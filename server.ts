import "dotenv/config";
import express, { type Request, type Response } from "express";
import path from "path";
import { GoogleGenAI, GenerateContentResponse, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Backend Architecture Modules
import {
  AuthenticationFilter,
  AuthServlet,
  UserServlet,
  WorkoutServlet,
  AppointmentServlet,
  JavaRubricServlet,
  type AuthenticatedRequest
} from "./server/oop/servlets.ts";
import { UserDaoImpl, WorkoutDaoImpl, AppointmentDaoImpl } from "./server/oop/dao.ts";
import { ConnectionPool, TransactionManager } from "./server/oop/db.ts";
import { AppointmentSchedulerLock, WorkerThreadPoolManager } from "./server/oop/concurrency.ts";
import { ApiResponse } from "./server/oop/generics.ts";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize DAOs and Servlets
const userDao = new UserDaoImpl();
const workoutDao = new WorkoutDaoImpl();
const appointmentDao = new AppointmentDaoImpl();

const authServlet = new AuthServlet(userDao);
const userServlet = new UserServlet(userDao);
const workoutServlet = new WorkoutServlet(workoutDao);
const appointmentServlet = new AppointmentServlet(appointmentDao);
const architectureServlet = new JavaRubricServlet();

// Apply Authentication Filter to all API requests
app.use("/api", (req, res, next) => {
  AuthenticationFilter.doFilter(req as AuthenticatedRequest, res, next);
});

// Shared Gemini AI client utility
let aiClient: GoogleGenAI | null = null;
let cachedGeminiKey: string | undefined;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    aiClient = null;
    cachedGeminiKey = undefined;
    return null;
  }
  if (!aiClient || cachedGeminiKey !== apiKey) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    cachedGeminiKey = apiKey;
  }
  return aiClient;
}

// Health check reporting verified runtime diagnostics (no unverified scoring claims)
app.get("/api/health", (_req, res) => {
  const pool = ConnectionPool.getInstance();
  const dbHealth = pool.verifyDatabaseHealth();
  const poolStats = pool.getPoolStats();
  const threadStats = WorkerThreadPoolManager.getMetrics();

  res.status(dbHealth.connected ? 200 : 503).json({
    status: dbHealth.connected ? "ok" : "degraded",
    app: "FITVORA",
    database: dbHealth,
    metrics: {
      connectionPool: poolStats,
      threadPool: threadStats
    },
    timestamp: new Date().toISOString()
  });
});

// Authentication Routes
app.get("/api/auth/admin-status", (req, res) => authServlet.getAdminStatus(req, res));
app.post("/api/auth/claim-admin", (req, res) => authServlet.claimAdmin(req, res));
app.post("/api/auth/login", (req, res) => authServlet.login(req, res));
app.post("/api/auth/register", (req, res) => authServlet.register(req, res));
app.get("/api/auth/me", (req, res) => authServlet.me(req as AuthenticatedRequest, res));
app.post("/api/auth/logout", (_req, res) => {
  res.json(ApiResponse.ok(null, "Signed out"));
});

// Architecture Metadata Endpoints
app.use("/api/java/architecture", (req: Request, res: Response) => {
  architectureServlet.service(req, res);
});
app.use("/api/java/rubric", (req: Request, res: Response) => {
  architectureServlet.service(req, res);
});

// Protected User Servlet (Admin-only list/create, self-or-Admin profile access, password hashes excluded)
app.use("/api/java/users", (req: Request, res: Response) => {
  userServlet.service(req, res);
});

// Workout Servlet
app.use("/api/java/workouts", (req: Request, res: Response) => {
  workoutServlet.service(req, res);
});

// Protected Appointment Servlet (Mutex Lock + Real SQLite ACID Transaction)
app.use("/api/java/appointments", (req: Request, res: Response) => {
  appointmentServlet.service(req, res);
});

// Concurrency Lock & Race Condition Test (Protected)
app.post("/api/java/concurrency/simulate", async (req, res) => {
  const trainerId = String(req.body?.trainerId || "trn_1");
  const logs: Array<{ thread: string; message: string; type: string; timestamp: string }> = [];
  const log = (thread: string, message: string, type: string) => {
    logs.push({ thread, message, type, timestamp: new Date().toISOString().substring(11, 23) });
  };

  log("main", `Starting concurrent lock contention check for Trainer #${trainerId}`, "INFO");

  let releaseWorker1!: () => void;
  const worker1Hold = new Promise<void>(resolve => {
    releaseWorker1 = resolve;
  });

  const worker1Promise = WorkerThreadPoolManager.executeTask("Booking-Worker-1", async () => {
    log("Worker-1", `Requesting exclusive lock on Trainer #${trainerId}`, "LOCK");
    const acquired = await AppointmentSchedulerLock.acquireTrainerLock(trainerId, "Worker-1", 1000);
    if (acquired) {
      log("Worker-1", `Mutex acquired for Trainer #${trainerId}`, "SUCCESS");
      await new Promise(r => setTimeout(r, 450));
      AppointmentSchedulerLock.releaseTrainerLock(trainerId, "Worker-1");
      log("Worker-1", `Work completed; released mutex lock for Trainer #${trainerId}`, "INFO");
    }
    releaseWorker1();
    return acquired;
  });

  // Slight delay so Worker-1 holds lock when Worker-2 contends
  await new Promise(r => setTimeout(r, 50));

  const worker2Result = await WorkerThreadPoolManager.executeTask("Booking-Worker-2", async () => {
    log("Worker-2", `Attempting concurrent booking on Trainer #${trainerId} (250ms timeout)`, "WARN");
    const acquired = await AppointmentSchedulerLock.acquireTrainerLock(trainerId, "Worker-2", 250);
    if (!acquired) {
      log("Worker-2", `Lock contention timeout reached -> SchedulingConflict prevented`, "WARN");
    }
    return acquired;
  });

  await worker1Hold;
  const worker1Result = await worker1Promise;

  res.json(ApiResponse.ok({
    simulation: "Per-Trainer Mutex Lock & Contention Verification",
    trainerId,
    worker1Acquired: worker1Result,
    worker2Acquired: worker2Result,
    logs
  }));
});

// Real SQLite ACID Transaction Runner (Protected)
app.post("/api/java/jdbc/transaction", async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const { simulateSqlError = false } = req.body || {};
  const logs: string[] = [];
  const athleteId = "usr_1";
  const trainerId = "trn_1";

  const pool = ConnectionPool.getInstance();
  const readConn = await pool.getConnection();
  let beforeCount = 0;
  let beforeStreak = 0;
  try {
    const cntRow = readConn.prepareStatement("SELECT COUNT(*) AS cnt FROM appointments").executeGet<{ cnt: number }>();
    const usrRow = readConn.prepareStatement("SELECT streak_days FROM users WHERE id = ?").executeGet<{ streak_days: number }>(athleteId);
    beforeCount = Number(cntRow?.cnt ?? 0);
    beforeStreak = Number(usrRow?.streak_days ?? 0);
  } finally {
    pool.releaseConnection(readConn);
  }

  logs.push(`[SQLite] Baseline before transaction: appointments=${beforeCount}, usr_1.streak_days=${beforeStreak}`);

  try {
    const result = await TransactionManager.executeInTransaction(async (conn) => {
      logs.push(`[DB] Borrowed connection ${conn.getId()} (${authReq.authUser?.email || "authenticated"})`);
      logs.push("[DB] BEGIN IMMEDIATE; // Start real SQLite ACID transaction");

      const aptId = `apt_tx_${Date.now()}`;
      const slot = new Date().toISOString();
      conn.prepareStatement(
        "INSERT INTO appointments (id, athlete_id, trainer_id, session_time, duration_minutes, status, created_at, updated_at, version) VALUES (?, ?, ?, ?, 60, 'CONFIRMED', ?, ?, 1)"
      ).executeUpdate(aptId, athleteId, trainerId, slot, slot, slot);
      logs.push(`[SQL] INSERT INTO appointments (id='${aptId}', athlete_id='${athleteId}', trainer_id='${trainerId}') -> 1 row inserted`);

      if (simulateSqlError) {
        logs.push("[SQL] Executing statement that violates FOREIGN KEY constraint (trainer_id='nonexistent_trainer')...");
        // Triggers a real SQLite FOREIGN KEY constraint error!
        conn.prepareStatement(
          "INSERT INTO appointments (id, athlete_id, trainer_id, session_time, duration_minutes, status, created_at, updated_at, version) VALUES (?, ?, ?, ?, 60, 'CONFIRMED', ?, ?, 1)"
        ).executeUpdate(`apt_bad_${Date.now()}`, athleteId, "nonexistent_trainer", slot, slot, slot);
      }

      conn.prepareStatement("UPDATE users SET streak_days = streak_days + 1, updated_at = ? WHERE id = ?")
        .executeUpdate(new Date().toISOString(), athleteId);
      logs.push("[SQL] UPDATE users SET streak_days = streak_days + 1 WHERE id = 'usr_1' -> 1 row updated");
      logs.push("[COMMIT] COMMIT; // Changes persisted atomically to SQLite");
      return { status: "COMMITTED", appointmentId: aptId };
    });

    const verifyConn = await pool.getConnection();
    let afterCount = beforeCount;
    let afterStreak = beforeStreak;
    try {
      afterCount = Number(verifyConn.prepareStatement("SELECT COUNT(*) AS cnt FROM appointments").executeGet<{ cnt: number }>()?.cnt ?? 0);
      afterStreak = Number(verifyConn.prepareStatement("SELECT streak_days FROM users WHERE id = ?").executeGet<{ streak_days: number }>(athleteId)?.streak_days ?? 0);
    } finally {
      pool.releaseConnection(verifyConn);
    }
    logs.push(`[VERIFY] Verified in SQLite after commit: appointments=${afterCount}, usr_1.streak_days=${afterStreak}`);
    res.json(ApiResponse.ok({ result: { ...result, beforeCount, afterCount, beforeStreak, afterStreak }, logs }));
  } catch (err: any) {
    logs.push(`[SQL-ERROR] ${err.message}`);
    logs.push("[ROLLBACK] ROLLBACK; // SQLite reverted all uncommitted writes in this transaction");

    const verifyConn = await pool.getConnection();
    let afterCount = beforeCount;
    let afterStreak = beforeStreak;
    try {
      afterCount = Number(verifyConn.prepareStatement("SELECT COUNT(*) AS cnt FROM appointments").executeGet<{ cnt: number }>()?.cnt ?? 0);
      afterStreak = Number(verifyConn.prepareStatement("SELECT streak_days FROM users WHERE id = ?").executeGet<{ streak_days: number }>(athleteId)?.streak_days ?? 0);
    } finally {
      pool.releaseConnection(verifyConn);
    }
    logs.push(`[VERIFY] Verified in SQLite after rollback: appointments=${afterCount} (unchanged), usr_1.streak_days=${afterStreak} (unchanged)`);
    res.json(ApiResponse.ok({ result: { status: "ROLLEDBACK", error: err.message, beforeCount, afterCount, beforeStreak, afterStreak }, logs }));
  }
});

type CoachHistoryItem = {
  sender?: string;
  text?: string;
};

type AnswerStyle = "concise" | "balanced" | "detailed";

function normalizeAnswerStyle(style: unknown): AnswerStyle {
  if (style === "concise" || style === "detailed" || style === "balanced") {
    return style;
  }
  return "balanced";
}

function getStyleGuidance(style: AnswerStyle): string {
  switch (style) {
    case "concise":
      return "Keep answers brief and direct (around 3-5 short sentences or tight bullet points), focusing only on the key actionable takeaway.";
    case "detailed":
      return "Provide a thorough, structured breakdown with clear steps, sets/reps or portions, brief rationale, and practical substitutions.";
    case "balanced":
    default:
      return "Give a clear, well-structured answer (roughly 120-220 words) with specific next steps and practical numbers where helpful.";
  }
}

function parseGeminiError(err: unknown): { status: number; message: string; code: string; retryable: boolean } {
  const raw = err instanceof Error ? err.message : String(err || "Unknown error");
  const lower = raw.toLowerCase();
  const statusCode =
    typeof (err as { status?: number })?.status === "number"
      ? (err as { status: number }).status
      : undefined;

  if (
    (statusCode === 400 && (lower.includes("api_key_invalid") || lower.includes("api key not valid"))) ||
    statusCode === 403 ||
    lower.includes("permission_denied") ||
    lower.includes("api_key_invalid") ||
    lower.includes("api key not valid")
  ) {
    return {
      status: 403,
      code: "API_KEY_INVALID",
      message: "Your Gemini API key could not be verified. Please check your key in Settings > Secrets.",
      retryable: false,
    };
  }

  if (statusCode === 429 || lower.includes("resource_exhausted") || lower.includes("quota") || lower.includes("rate limit")) {
    return {
      status: 429,
      code: "RATE_LIMITED",
      message: "The AI Coach has reached its rate limit or quota. Please wait a moment and try again, or check your key in Settings > Secrets.",
      retryable: true,
    };
  }

  if (statusCode === 404 || lower.includes("not_found")) {
    return {
      status: 502,
      code: "MODEL_NOT_FOUND",
      message: "The configured AI Coach model is currently unavailable. Please try again shortly.",
      retryable: false,
    };
  }

  if (statusCode === 400) {
    return {
      status: 400,
      code: "INVALID_REQUEST",
      message: "The request could not be processed by the AI Coach. Please rephrase and try again.",
      retryable: false,
    };
  }

  const isTransient =
    statusCode === 500 ||
    statusCode === 502 ||
    statusCode === 503 ||
    statusCode === 504 ||
    lower.includes("timeout") ||
    lower.includes("network") ||
    lower.includes("fetch failed") ||
    lower.includes("econnreset") ||
    lower.includes("unavailable");

  return {
    status: 502,
    code: statusCode ? `UPSTREAM_${statusCode}` : "UPSTREAM_ERROR",
    message:
      statusCode === 503
        ? "The AI Coach service is temporarily busy. Please try again in a moment."
        : "Unable to reach the AI Coach right now. Please try again in a moment.",
    retryable: isTransient,
  };
}

// AI Fitness Coach Handler
const handleAiCoach = async (req: Request, res: Response) => {
  try {
    const rawMessage = req.body?.message;
    const trimmedMessage = typeof rawMessage === "string" ? rawMessage.trim() : "";

    if (!trimmedMessage) {
      res.status(400).json({ error: "Please enter a message for the AI Coach." });
      return;
    }

    const ai = getAIClient();
    if (!ai) {
      res.status(503).json({
        error: "AI Coach is not configured yet. Please add your Gemini API key in Settings > Secrets.",
      });
      return;
    }

    const userProfile = req.body?.userProfile || req.body?.userContext || {};
    const answerStyle = normalizeAnswerStyle(req.body?.answerStyle);
    const rawHistory: CoachHistoryItem[] = Array.isArray(req.body?.history) ? req.body.history : [];

    // Build clean, alternating user/model conversation history starting from the first user turn
    const normalizedHistory: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
    for (const item of rawHistory.slice(-12)) {
      const text = typeof item?.text === "string" ? item.text.trim() : "";
      if (!text) continue;
      const role: "user" | "model" = item?.sender === "user" ? "user" : "model";
      if (normalizedHistory.length === 0 && role !== "user") {
        continue;
      }
      const prev = normalizedHistory[normalizedHistory.length - 1];
      if (prev && prev.role === role) {
        prev.parts[0].text = `${prev.parts[0].text}\n${text}`;
      } else {
        normalizedHistory.push({ role, parts: [{ text }] });
      }
    }

    // Ensure history ends on a model turn (or is empty) before appending the new user message
    if (normalizedHistory.length > 0 && normalizedHistory[normalizedHistory.length - 1].role === "user") {
      normalizedHistory.pop();
    }

    const systemInstruction = `You are FITVORA's supportive, practical fitness and nutrition coach.
Speak naturally, clearly, and like a knowledgeable human coach—avoid hype, generic clichés, or buzzwords.

Default Response Style (${answerStyle.toUpperCase()}):
- ${getStyleGuidance(answerStyle)}
- Format using clean plain text or simple bullet lists so it reads well in a chat bubble (avoid heavy markdown tables or raw HTML).

Member Profile:
- Name: ${userProfile?.name || "Member"}
- Goal: ${userProfile?.goal || "General Fitness"}
- Weight: ${userProfile?.weight ? `${userProfile.weight} kg` : "Not specified"}
- Height: ${userProfile?.height ? `${userProfile.height} cm` : "Not specified"}
- Fitness Level: ${userProfile?.fitnessLevel || "Not specified"}
- Activity Level: ${userProfile?.activityLevel || "Moderately Active"}

Safety Guidelines:
- Never diagnose medical conditions or prescribe medication.
- If the user mentions acute pain, injury, illness, or disordered eating, advise consulting a qualified physician or physical therapist.
- Give practical, safe, realistic steps tailored to their profile.`;

    const contents = [
      ...normalizedHistory,
      { role: "user" as const, parts: [{ text: trimmedMessage }] },
    ];

    const maxAttempts = 3;
    let response: GenerateContentResponse | null = null;
    let lastError: unknown = null;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-4-hydrogen",
          contents,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });
        break;
      } catch (err) {
        lastError = err;
        const parsed = parseGeminiError(err);
        if (!parsed.retryable || attempt === maxAttempts - 1) {
          console.error("Gemini AI Coach error:", err);
          res.status(parsed.status).json({ error: parsed.message, code: parsed.code });
          return;
        }
        const delayMs = 400 * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    if (!response) {
      const parsed = parseGeminiError(lastError);
      res.status(parsed.status).json({ error: parsed.message, code: parsed.code });
      return;
    }

    const reply = response.text?.trim();
    if (!reply) {
      res.status(502).json({
        error: "The AI Coach did not generate a response. Please rephrase your question and try again.",
      });
      return;
    }

    res.json({ reply, answerStyle });
  } catch (err) {
    console.error("Coach Error:", err);
    res.status(500).json({
      error: "Unable to process your AI Coach request right now.",
    });
  }
};

app.post("/api/ai/coach", handleAiCoach);
app.post("/api/ai-coach", handleAiCoach);

// Vite & Static file handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FITVORA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
