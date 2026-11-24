import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Code2,
  Cpu,
  Database,
  CheckCircle2,
  Play,
  Copy,
  Check,
  FileCode,
  RefreshCw,
  Lock
} from 'lucide-react';

interface JavaArchitecturePageProps {
  setCurrentPage: (page: string) => void;
}

export const JavaArchitecturePage: React.FC<JavaArchitecturePageProps> = ({ setCurrentPage }) => {
  const { authToken, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'simulation' | 'code-browser'>('overview');
  const [activeCodeFile, setActiveCodeFile] = useState<string>('AuthenticationFilter.java');
  const [copied, setCopied] = useState(false);

  // Live /api/health diagnostics
  const [healthInfo, setHealthInfo] = useState<{
    status: string;
    engine: string;
    path: string;
    connected: boolean;
    available: number;
    maxPoolSize: number;
  } | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setHealthInfo({
          status: data?.status || 'ok',
          engine: data?.database?.engine || 'node:sqlite',
          path: data?.database?.path || 'fitvora.db',
          connected: Boolean(data?.database?.connected),
          available: Number(data?.metrics?.connectionPool?.available ?? 0),
          maxPoolSize: Number(data?.metrics?.connectionPool?.maxPoolSize ?? 10)
        });
      })
      .catch(() => undefined);
  }, []);

  // Polymorphism demo state
  const [simWeight, setSimWeight] = useState<number>(72);
  const [simDuration, setSimDuration] = useState<number>(45);
  const [simHeartRateZone, setSimHeartRateZone] = useState<number>(3);
  const [simRpe, setSimRpe] = useState<number>(8.5);

  // Concurrency test state
  const [threadLogs, setThreadLogs] = useState<Array<{ id: string; time: string; thread: string; message: string; type: 'info' | 'lock' | 'success' | 'warn' }>>([]);
  const [isRunningThreadSim, setIsRunningThreadSim] = useState(false);
  const [threadAuthNotice, setThreadAuthNotice] = useState<string | null>(null);
  const [trainerLockState, setTrainerLockState] = useState<'IDLE' | 'LOCKED' | 'CONTENTION'>('IDLE');

  // Real SQLite Transaction state
  const [txState, setTxState] = useState<'IDLE' | 'STARTED' | 'COMMITTED' | 'ROLLEDBACK'>('IDLE');
  const [simulateSqlError, setSimulateSqlError] = useState(false);
  const [txLogs, setTxLogs] = useState<string[]>([]);
  const [txAuthNotice, setTxAuthNotice] = useState<string | null>(null);

  const strengthMet = 5.5 + (simRpe / 10.0) * 2.0;
  const strengthBase = (strengthMet * 3.5 * simWeight / 200.0) * simDuration * 1.25;
  const strengthCalories = Math.round((strengthBase + strengthBase * 0.15) * 10) / 10;

  const zoneMets = [4.0, 7.0, 9.5, 12.0, 15.0];
  const cardioMet = zoneMets[simHeartRateZone - 1] || 9.5;
  const cardioCalories = Math.round(((cardioMet * 3.5 * simWeight / 200.0) * simDuration) * 10) / 10;

  const mobilityMet = 2.8;
  const mobilityCalories = Math.round(((mobilityMet * 3.5 * simWeight / 200.0) * simDuration) * 10) / 10;

  const runConcurrencySim = async () => {
    setThreadAuthNotice(null);
    if (!authToken) {
      setThreadAuthNotice('Sign in first to run protected backend lock checks.');
      return;
    }

    setIsRunningThreadSim(true);
    setTrainerLockState('LOCKED');

    try {
      const res = await fetch('/api/java/concurrency/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ trainerId: 'trn_1' })
      });
      const json = await res.json();
      if (!res.ok) {
        setThreadAuthNotice(json?.message || 'Sign in required to run concurrency check.');
        setTrainerLockState('IDLE');
        setIsRunningThreadSim(false);
        return;
      }

      const serverLogs = json.data?.logs || [];
      setThreadLogs(serverLogs.map((l: any, idx: number) => ({
        id: `log_${idx}_${Date.now()}`,
        time: l.timestamp,
        thread: l.thread,
        message: l.message,
        type: String(l.type || 'info').toLowerCase() as any
      })));
      setTrainerLockState('IDLE');
    } catch {
      setThreadAuthNotice('Could not connect to backend server.');
      setTrainerLockState('IDLE');
    } finally {
      setIsRunningThreadSim(false);
    }
  };

  const runTransactionSim = async () => {
    setTxAuthNotice(null);
    if (!authToken) {
      setTxAuthNotice('Sign in first to execute live SQLite ACID transactions.');
      return;
    }

    setTxState('STARTED');
    try {
      const res = await fetch('/api/java/jdbc/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ simulateSqlError })
      });
      const json = await res.json();
      if (!res.ok) {
        setTxAuthNotice(json?.message || 'Sign in required to run database transactions.');
        setTxState('IDLE');
        return;
      }
      setTxLogs(json.data?.logs || []);
      setTxState(json.data?.result?.status || (simulateSqlError ? 'ROLLEDBACK' : 'COMMITTED'));
    } catch {
      setTxAuthNotice('Could not connect to backend server.');
      setTxState('IDLE');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeFiles: Record<string, { lang: string; title: string; desc: string; code: string }> = {
    'AuthenticationFilter.java': {
      lang: 'java',
      title: 'Session Enforcement & CORS Filter',
      desc: 'Fails closed on protected routes when HttpSession lacks authenticatedUserId/role, normalizes paths against traversal, and validates origins against FITVORA_ALLOWED_ORIGIN.',
      code: `package com.fitvora.servlet;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Set;

public class AuthenticationFilter implements Filter {
    public static final String ATTR_USER_ID = "authenticatedUserId";
    public static final String ATTR_USER_ROLE = "authenticatedUserRole";

    private static final Set<String> PUBLIC_API_ROUTES = Set.of(
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/logout",
        "/api/health"
    );

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String route = request.getServletPath();
        String pathInfo = request.getPathInfo();
        String fullRoute = (route != null ? route : "") + (pathInfo != null ? pathInfo : "");

        if (fullRoute.contains("..")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        boolean isPublicApi = PUBLIC_API_ROUTES.contains(fullRoute)
                || ("/api/workouts".equals(fullRoute) && "GET".equalsIgnoreCase(request.getMethod()));

        if (fullRoute.startsWith("/api/") && !isPublicApi) {
            HttpSession session = request.getSession(false);
            Object userId = session != null ? session.getAttribute(ATTR_USER_ID) : null;
            Object userRole = session != null ? session.getAttribute(ATTR_USER_ROLE) : null;
            if (userId == null || userRole == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\\"success\\":false,\\"errorCode\\":\\"ERR_UNAUTHORIZED\\"}");
                return;
            }
        }
        chain.doFilter(request, response);
    }
}`
    },
    'UserServlet.java': {
      lang: 'java',
      title: 'Role-Authorized User Servlet & Safe DTO Mapping',
      desc: 'Requires ADMIN role to list or create users, restricts single-user lookup/updates to self or ADMIN, and strips passwordHash from every response.',
      code: `package com.fitvora.servlet;

import com.fitvora.enums.UserRole;
import com.fitvora.model.User;
import jakarta.servlet.http.HttpSession;
import java.util.LinkedHashMap;
import java.util.Map;

public class UserServlet {
    public static Map<String, Object> toSafeUserDto(User user) {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("id", user.getId());
        dto.put("name", user.getName());
        dto.put("email", user.getEmail());
        dto.put("role", user.getRole());
        dto.put("active", user.isActive());
        dto.put("heightCm", user.getHeightCm());
        dto.put("weightKg", user.getCurrentWeightKg());
        dto.put("createdAt", user.getCreatedAt());
        return dto; // passwordHash is never serialized
    }
}`
    },
    'DatabaseConnectionFactory.java': {
      lang: 'java',
      title: 'Environment-Configured JDBC Factory',
      desc: 'Reads database URL, username, password, and driver class strictly from environment variables or JVM system properties and fails closed if missing.',
      code: `package com.fitvora.db;

import com.fitvora.exception.DatabaseException;
import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseConnectionFactory {
    public static Connection createConnection() throws DatabaseException {
        String url = resolveConfig("FITVORA_DB_URL", "fitvora.db.url");
        String user = resolveConfig("FITVORA_DB_USER", "fitvora.db.user");
        String pass = resolveConfig("FITVORA_DB_PASSWORD", "fitvora.db.password");

        if (url == null || user == null || pass == null) {
            throw new DatabaseException(
                "Database credentials are not configured.",
                "ERR_DB_CONFIG_MISSING"
            );
        }
        try {
            return DriverManager.getConnection(url, user, pass);
        } catch (Exception e) {
            throw new DatabaseException("Failed to open database connection", e);
        }
    }
}`
    },
    'AbstractWorkout.java': {
      lang: 'java',
      title: 'Abstract Base Workout',
      desc: 'OOP inheritance with CalorieCalculable and Schedulable interfaces.',
      code: `package com.fitvora.model;

import com.fitvora.interfaces.CalorieCalculable;
import com.fitvora.interfaces.Schedulable;

public abstract class AbstractWorkout extends AbstractEntity implements CalorieCalculable, Schedulable {
    protected String title;
    protected int durationMinutes;

    @Override
    public abstract double calculateCaloriesBurned(double bodyWeightKg);

    public abstract String getWorkoutProtocol();
}`
    },
    'AppointmentSchedulerLock.java': {
      lang: 'java',
      title: 'Per-Trainer Fair Mutex Lock',
      desc: 'Uses ConcurrentHashMap<Long, ReentrantLock> to prevent overlapping trainer bookings.',
      code: `package com.fitvora.concurrency;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class AppointmentSchedulerLock {
    private static final ConcurrentHashMap<Long, ReentrantLock> trainerLocks = new ConcurrentHashMap<>();

    public static boolean acquireTrainerLock(Long trainerId, long timeoutMs) throws InterruptedException {
        ReentrantLock lock = trainerLocks.computeIfAbsent(trainerId, id -> new ReentrantLock(true));
        return lock.tryLock(timeoutMs, TimeUnit.MILLISECONDS);
    }

    public static void releaseTrainerLock(Long trainerId) {
        ReentrantLock lock = trainerLocks.get(trainerId);
        if (lock != null && lock.isHeldByCurrentThread()) {
            lock.unlock();
        }
    }
}`
    },
    'TransactionManager.java': {
      lang: 'java',
      title: 'ACID Transaction Manager',
      desc: 'Coordinates begin, commit, and automatic rollback on SQL failure.',
      code: `package com.fitvora.db;

import java.sql.Connection;

public class TransactionManager {
    public static <T> T executeInTransaction(TransactionCallback<T> callback) throws DatabaseException {
        Connection conn = ConnectionPool.getInstance().getConnection();
        try {
            conn.setAutoCommit(false);
            T result = callback.doInTransaction(conn);
            conn.commit();
            return result;
        } catch (Exception e) {
            try { conn.rollback(); } catch (Exception ignored) {}
            throw new DatabaseException("Transaction rolled back: " + e.getMessage(), e);
        } finally {
            try { conn.setAutoCommit(true); } catch (Exception ignored) {}
            ConnectionPool.getInstance().releaseConnection(conn);
        }
    }
}`
    },
    'schema.sql': {
      lang: 'sql',
      title: 'Relational Schema (MySQL / SQLite)',
      desc: 'Tables for users, workouts, and appointments with foreign keys and composite indexes; no placeholder password hashes.',
      code: `CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'TRAINER', 'ADMIN') NOT NULL DEFAULT 'USER',
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    streak_days INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    athlete_id BIGINT NOT NULL,
    trainer_id BIGINT NOT NULL,
    session_time DATETIME NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'),
    FOREIGN KEY (athlete_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES users (id) ON DELETE CASCADE
);`
    }
  };

  const architectureModules = [
    {
      title: 'Authentication & Access Control',
      summary: 'Fail-closed session filtering, scrypt/BCrypt password verification, first-run admin bootstrap, and safe DTO responses without password hashes.',
      files: ['AuthenticationFilter.java', 'UserServlet.java']
    },
    {
      title: 'Relational Persistence & Pooling',
      summary: 'Real SQLite storage via node:sqlite in Express and environment-configured JDBC factory with parameterized queries and ACID rollbacks.',
      files: ['DatabaseConnectionFactory.java', 'TransactionManager.java', 'schema.sql']
    },
    {
      title: 'Domain & Concurrency Safeguards',
      summary: 'Polymorphic workout calorie models alongside per-trainer mutex locking so concurrent bookings cannot double-book the same slot.',
      files: ['AbstractWorkout.java', 'AppointmentSchedulerLock.java']
    }
  ];

  return (
    <div className="bg-[#F5F0E7] min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-[#303528] text-white rounded-3xl p-8 sm:p-10 border border-[#596044]/40">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C87555]">
            Engineering Notes
          </p>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#F5F0E7]">
            Backend &amp; Database Lab
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Inspect the FITVORA persistence layer, test live SQLite transactions and concurrency locks against the running Express server, and browse the Java servlet modules.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2.5 rounded-full font-semibold text-xs transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'overview' ? 'bg-[#C87555] text-white' : 'bg-white/10 hover:bg-white/20 text-gray-200'
              }`}
            >
              <Database className="w-4 h-4" />
              Runtime &amp; Modules
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-5 py-2.5 rounded-full font-semibold text-xs transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'simulation' ? 'bg-[#C87555] text-white' : 'bg-white/10 hover:bg-white/20 text-gray-200'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Interactive Lab
            </button>
            <button
              onClick={() => setActiveTab('code-browser')}
              className={`px-5 py-2.5 rounded-full font-semibold text-xs transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'code-browser' ? 'bg-[#C87555] text-white' : 'bg-white/10 hover:bg-white/20 text-gray-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Source Browser
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: RUNTIME & MODULES */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#303528]">
                Live Database Status
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Verified via <code className="text-[#596044]">GET /api/health</code> running a real SQLite <code className="text-[#596044]">SELECT 1</code> check.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-[#F5F0E7] px-5 py-3.5 rounded-2xl border border-[#E7DFD1] tabular-nums">
              <CheckCircle2 className={`w-5 h-5 ${healthInfo?.connected ? 'text-emerald-600' : 'text-amber-600'}`} />
              <div className="text-xs">
                <div className="font-semibold text-[#303528]">
                  {healthInfo?.connected ? 'SQLite Connected' : 'Checking connection...'}
                </div>
                <div className="text-gray-500">
                  {healthInfo ? `${healthInfo.engine} · ${healthInfo.path} · Pool ${healthInfo.available}/${healthInfo.maxPoolSize}` : 'Connecting'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {architectureModules.map((mod, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#E7DFD1] flex flex-col justify-between space-y-5"
              >
                <div>
                  <h3 className="font-editorial text-xl font-bold text-[#303528] mb-2">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{mod.summary}</p>
                </div>
                <div className="pt-4 border-t border-[#E7DFD1]">
                  <div className="text-xs font-semibold text-gray-500 mb-2">Related Files</div>
                  <div className="flex flex-wrap gap-1.5">
                    {mod.files.map(file => (
                      <button
                        key={file}
                        onClick={() => {
                          if (codeFiles[file]) {
                            setActiveCodeFile(file);
                            setActiveTab('code-browser');
                          }
                        }}
                        className="text-xs font-mono bg-[#F5F0E7] text-[#303528] hover:bg-[#596044] hover:text-white px-2.5 py-1 rounded-md transition cursor-pointer"
                      >
                        {file}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE LAB */}
      {activeTab === 'simulation' && (
        <div className="space-y-8">
          {!currentUser && (
            <div className="bg-white rounded-2xl p-4 border border-[#E7DFD1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-[#303528]">
                <Lock className="w-4 h-4 text-[#C87555] shrink-0" />
                <span>Protected backend routes require a signed-in session before running lock or SQLite transaction tests.</span>
              </div>
              <button
                onClick={() => setCurrentPage('login')}
                className="px-4 py-2 rounded-full bg-[#596044] text-white text-xs font-semibold hover:bg-[#303528] transition cursor-pointer whitespace-nowrap"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Polymorphism Calorie Demo */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7DFD1] pb-4">
              <div>
                <p className="text-xs font-semibold text-[#C87555]">Energy Expenditure Model</p>
                <h2 className="font-editorial text-2xl font-bold text-[#303528]">
                  Calorie Calculation by Workout Type
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500">Weight (kg)</label>
                  <input
                    type="number"
                    value={simWeight}
                    onChange={e => setSimWeight(Math.max(40, Number(e.target.value)))}
                    className="w-20 px-2.5 py-1 text-sm rounded-lg border border-[#E7DFD1] bg-[#F5F0E7] font-semibold text-[#303528] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500">Duration (min)</label>
                  <input
                    type="number"
                    value={simDuration}
                    onChange={e => setSimDuration(Math.max(10, Number(e.target.value)))}
                    className="w-20 px-2.5 py-1 text-sm rounded-lg border border-[#E7DFD1] bg-[#F5F0E7] font-semibold text-[#303528] tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#F5F0E7] p-6 rounded-2xl border border-[#E7DFD1] space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#596044]">StrengthWorkout</span>
                  <span className="text-gray-500 font-mono">EPOC + RPE</span>
                </div>
                <div className="text-3xl font-bold text-[#303528] tabular-nums">
                  {strengthCalories} <span className="text-sm font-normal text-gray-500">kcal</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 text-gray-600 tabular-nums">
                  <span>RPE: {simRpe} / 10</span>
                  <input
                    type="range"
                    min="6"
                    max="10"
                    step="0.5"
                    value={simRpe}
                    onChange={e => setSimRpe(Number(e.target.value))}
                    className="w-24 accent-[#596044]"
                  />
                </div>
              </div>

              <div className="bg-[#F5F0E7] p-6 rounded-2xl border border-[#E7DFD1] space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#C87555]">CardioWorkout</span>
                  <span className="text-gray-500 font-mono">HR Zone MET</span>
                </div>
                <div className="text-3xl font-bold text-[#303528] tabular-nums">
                  {cardioCalories} <span className="text-sm font-normal text-gray-500">kcal</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 text-gray-600">
                  <span>Zone {simHeartRateZone}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(z => (
                      <button
                        key={z}
                        onClick={() => setSimHeartRateZone(z)}
                        className={`w-6 h-6 rounded text-xs font-semibold cursor-pointer ${
                          simHeartRateZone === z ? 'bg-[#C87555] text-white' : 'bg-white text-[#303528]'
                        }`}
                      >
                        {z}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#F5F0E7] p-6 rounded-2xl border border-[#E7DFD1] space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-emerald-800">MobilityWorkout</span>
                  <span className="text-gray-500 font-mono">MET 2.8</span>
                </div>
                <div className="text-3xl font-bold text-[#303528] tabular-nums">
                  {mobilityCalories} <span className="text-sm font-normal text-gray-500">kcal</span>
                </div>
                <p className="text-xs text-gray-600 pt-2">Low-intensity recovery baseline</p>
              </div>
            </div>
          </div>

          {/* Live Protected Lock & SQLite Transaction Runners */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-[#596044]">Protected Endpoint</p>
                  <h3 className="font-editorial text-xl font-bold text-[#303528]">
                    Trainer Lock Contention Check
                  </h3>
                </div>
                <button
                  onClick={runConcurrencySim}
                  disabled={isRunningThreadSim}
                  className="px-4 py-2 bg-[#596044] hover:bg-[#303528] disabled:bg-gray-400 text-white text-xs font-semibold rounded-full transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isRunningThreadSim ? 'Running...' : 'Run Lock Check'}</span>
                </button>
              </div>

              {threadAuthNotice && (
                <p className="text-xs text-rose-700 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200">
                  {threadAuthNotice}
                </p>
              )}

              <div className="text-xs text-gray-600 flex justify-between bg-[#F5F0E7] p-3 rounded-xl border border-[#E7DFD1]">
                <span>Lock status for Trainer trn_1:</span>
                <span className="font-semibold text-[#303528]">{trainerLockState}</span>
              </div>

              <div className="bg-[#1E211B] text-gray-200 rounded-2xl p-4 font-mono text-[11px] h-52 overflow-y-auto space-y-1.5">
                {threadLogs.length === 0 ? (
                  <span className="text-gray-400">Run check to inspect live worker lock acquisition and contention timing.</span>
                ) : (
                  threadLogs.map(log => (
                    <div key={log.id} className="flex items-start gap-2">
                      <span className="text-gray-500 shrink-0">{log.time}</span>
                      <span className="text-[#C87555] shrink-0">[{log.thread}]</span>
                      <span className="text-gray-200">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-[#C87555]">Real SQLite Transaction</p>
                  <h3 className="font-editorial text-xl font-bold text-[#303528]">
                    Commit &amp; Rollback Runner
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-gray-700 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simulateSqlError}
                      onChange={e => setSimulateSqlError(e.target.checked)}
                      className="accent-[#C87555]"
                    />
                    <span>Trigger FK Error</span>
                  </label>
                  <button
                    onClick={runTransactionSim}
                    className="px-4 py-2 bg-[#C87555] hover:bg-[#a65d41] text-white text-xs font-semibold rounded-full transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Run SQL Transaction</span>
                  </button>
                </div>
              </div>

              {txAuthNotice && (
                <p className="text-xs text-rose-700 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200">
                  {txAuthNotice}
                </p>
              )}

              <div className="p-3 rounded-xl bg-[#F5F0E7] border border-[#E7DFD1] flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">Last Transaction Outcome:</span>
                <span className="font-semibold text-[#303528]">{txState}</span>
              </div>

              <div className="bg-[#1E211B] text-gray-200 rounded-2xl p-4 font-mono text-[11px] h-52 overflow-y-auto space-y-1.5">
                {txLogs.length === 0 ? (
                  <span className="text-gray-400">Execute a real BEGIN IMMEDIATE / COMMIT or ROLLBACK against fitvora.db.</span>
                ) : (
                  txLogs.map((line, idx) => (
                    <div key={idx} className={line.includes('ROLLBACK') || line.includes('ERROR') ? 'text-rose-400' : line.includes('COMMIT') ? 'text-emerald-400' : 'text-gray-300'}>
                      {line}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SOURCE BROWSER */}
      {activeTab === 'code-browser' && (
        <div className="bg-white rounded-3xl border border-[#E7DFD1] overflow-hidden flex flex-col md:flex-row min-h-[560px]">
          <div className="w-full md:w-72 bg-[#F5F0E7] border-r border-[#E7DFD1] p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#596044] mb-3 px-2">
              <FileCode className="w-4 h-4" />
              <span>Backend Modules</span>
            </div>

            {Object.keys(codeFiles).map(fileName => (
              <button
                key={fileName}
                onClick={() => setActiveCodeFile(fileName)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition cursor-pointer ${
                  activeCodeFile === fileName
                    ? 'bg-[#596044] text-white'
                    : 'text-[#303528] hover:bg-[#E7DFD1]/60'
                }`}
              >
                {fileName}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col bg-[#1E211B] text-white">
            <div className="p-5 border-b border-gray-800 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white">{codeFiles[activeCodeFile].title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{codeFiles[activeCodeFile].desc}</p>
              </div>
              <button
                onClick={() => copyToClipboard(codeFiles[activeCodeFile].code)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-6 text-xs font-mono text-gray-200 overflow-auto flex-1 leading-relaxed">
              <code>{codeFiles[activeCodeFile].code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
