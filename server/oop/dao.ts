/**
 * Concrete SQLite-Backed DAO Implementations
 */

import { BaseDao, JdbcConnection } from './db.ts';
import {
  User,
  AthleteUser,
  TrainerUser,
  AdminUser,
  AbstractWorkout,
  StrengthWorkout,
  CardioWorkout,
  MobilityWorkout,
  Appointment
} from './models.ts';
import { UserRole, FitnessGoal, AppointmentStatus } from './enums.ts';

/**
 * Polymorphic User DAO backed by SQLite `users` table
 */
export class UserDaoImpl extends BaseDao<User, string> {
  protected override readonly tableName = 'users';

  protected override mapRow(row: Record<string, unknown>): User {
    const role = (row.role as UserRole) || UserRole.USER;
    const id = String(row.id);
    const name = String(row.name || '');
    const email = String(row.email || '');
    const passwordHash = String(row.password_hash || '');

    let user: User;
    if (role === UserRole.TRAINER) {
      const trainer = new TrainerUser(
        id,
        name,
        email,
        passwordHash,
        String(row.specialization || 'Strength & Conditioning'),
        Number(row.hourly_rate ?? 85)
      );
      user = trainer;
    } else if (role === UserRole.ADMIN) {
      const admin = new AdminUser(
        id,
        name,
        email,
        passwordHash,
        String(row.department || 'Operations')
      );
      user = admin;
    } else {
      const athlete = new AthleteUser(
        id,
        name,
        email,
        passwordHash,
        Number(row.target_weight_kg ?? 65),
        (row.fitness_goal as FitnessGoal) || FitnessGoal.GENERAL_FITNESS
      );
      athlete.setHeightCm(Number(row.height_cm ?? 175));
      athlete.setCurrentWeightKg(Number(row.weight_kg ?? 70));
      athlete.setDailyCalorieTarget(Number(row.daily_calorie_target ?? 2150));
      for (let i = 0; i < Number(row.streak_days ?? 0); i++) {
        athlete.incrementStreak();
      }
      user = athlete;
    }

    if (row.created_at) user.setCreatedAt(new Date(String(row.created_at)));
    if (row.updated_at) user.setUpdatedAt(new Date(String(row.updated_at)));
    return user;
  }

  protected override insertEntity(conn: JdbcConnection, user: User): void {
    const sql = `
      INSERT INTO users
      (id, name, email, password_hash, role, active, height_cm, weight_kg, target_weight_kg, fitness_goal, daily_calorie_target, daily_water_target_liters, streak_days, specialization, hourly_rate, department, created_at, updated_at, version)
      VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const isAthlete = user instanceof AthleteUser;
    const isTrainer = user instanceof TrainerUser;
    const isAdmin = user instanceof AdminUser;

    conn.prepareStatement(sql).executeUpdate(
      user.getId()!,
      user.getName(),
      user.getEmail(),
      user.getPasswordHash(),
      user.getRole(),
      user.getHeightCm(),
      user.getCurrentWeightKg(),
      isAthlete ? user.getTargetWeightKg() : null,
      isAthlete ? user.getPrimaryGoal() : null,
      isAthlete ? user.getDailyCalorieTarget() : 2150,
      isAthlete ? user.getDailyWaterTargetLiters() : 2.5,
      isAthlete ? user.getStreakDays() : 0,
      isTrainer ? user.getSpecialization() : null,
      isTrainer ? user.getHourlyRate() : null,
      isAdmin ? user.getDepartment() : null,
      user.getCreatedAt().toISOString(),
      user.getUpdatedAt().toISOString(),
      user.getVersion()
    );
  }

  protected override updateEntity(conn: JdbcConnection, user: User): void {
    const sql = `
      UPDATE users
      SET name = ?, email = ?, height_cm = ?, weight_kg = ?, updated_at = ?, version = ?
      WHERE id = ?
    `;
    conn.prepareStatement(sql).executeUpdate(
      user.getName(),
      user.getEmail(),
      user.getHeightCm(),
      user.getCurrentWeightKg(),
      user.getUpdatedAt().toISOString(),
      user.getVersion(),
      user.getId()!
    );
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.withConnection((conn) => {
      const row = conn
        .prepareStatement('SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1')
        .executeGet(email);
      return row ? this.mapRow(row) : null;
    });
  }

  public async findByRole(role: UserRole): Promise<User[]> {
    return this.withConnection((conn) => {
      const rows = conn
        .prepareStatement('SELECT * FROM users WHERE role = ? ORDER BY created_at DESC')
        .executeQuery(role);
      return rows.map(r => this.mapRow(r));
    });
  }

  public async hasAdminWithPassword(): Promise<boolean> {
    return this.withConnection((conn) => {
      const row = conn
        .prepareStatement("SELECT 1 AS found FROM users WHERE role = 'ADMIN' AND LENGTH(password_hash) > 0 LIMIT 1")
        .executeGet();
      return Boolean(row);
    });
  }
}

/**
 * Polymorphic Workout DAO backed by SQLite `workouts` table
 */
export class WorkoutDaoImpl extends BaseDao<AbstractWorkout, string> {
  protected override readonly tableName = 'workouts';

  protected override mapRow(row: Record<string, unknown>): AbstractWorkout {
    const type = String(row.workout_type || 'STRENGTH');
    const id = String(row.id);
    const title = String(row.title || '');
    const duration = Number(row.duration_minutes ?? 45);

    if (type === 'CARDIO') {
      return new CardioWorkout(id, title, duration, Number(row.heart_rate_zone ?? 3), Number(row.average_heart_rate_bpm ?? 142));
    }
    if (type === 'MOBILITY') {
      let joints = ['Hips', 'Spine'];
      try {
        if (row.target_joints) joints = JSON.parse(String(row.target_joints));
      } catch {
        // default
      }
      return new MobilityWorkout(id, title, duration, joints);
    }
    return new StrengthWorkout(
      id,
      title,
      duration,
      Number(row.total_sets ?? 16),
      Number(row.volume_load_kg ?? 4200),
      Number(row.rpe_target ?? 8.5)
    );
  }

  protected override insertEntity(conn: JdbcConnection, workout: AbstractWorkout): void {
    const type = workout instanceof CardioWorkout ? 'CARDIO' : workout instanceof MobilityWorkout ? 'MOBILITY' : 'STRENGTH';
    conn.prepareStatement(`
      INSERT INTO workouts (id, title, description, duration_minutes, difficulty_level, muscle_group, workout_type, created_at, updated_at, version)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).executeUpdate(
      workout.getId()!,
      workout.getTitle(),
      workout.getDescription(),
      workout.getDurationMinutes(),
      workout.getDifficultyLevel(),
      workout.getPrimaryMuscleGroup(),
      type,
      workout.getCreatedAt().toISOString(),
      workout.getUpdatedAt().toISOString(),
      workout.getVersion()
    );
  }

  protected override updateEntity(conn: JdbcConnection, workout: AbstractWorkout): void {
    conn.prepareStatement(`
      UPDATE workouts SET title = ?, description = ?, duration_minutes = ?, updated_at = ?, version = ? WHERE id = ?
    `).executeUpdate(
      workout.getTitle(),
      workout.getDescription(),
      workout.getDurationMinutes(),
      workout.getUpdatedAt().toISOString(),
      workout.getVersion(),
      workout.getId()!
    );
  }
}

/**
 * Appointment DAO backed by SQLite `appointments` table
 */
export class AppointmentDaoImpl extends BaseDao<Appointment, string> {
  protected override readonly tableName = 'appointments';

  protected override mapRow(row: Record<string, unknown>): Appointment {
    const apt = new Appointment(
      String(row.athlete_id),
      String(row.trainer_id),
      new Date(String(row.session_time)),
      Number(row.duration_minutes ?? 60)
    );
    apt.setId(String(row.id));
    apt.status = (row.status as AppointmentStatus) || AppointmentStatus.PENDING;
    if (row.created_at) apt.setCreatedAt(new Date(String(row.created_at)));
    if (row.updated_at) apt.setUpdatedAt(new Date(String(row.updated_at)));
    return apt;
  }

  protected override insertEntity(conn: JdbcConnection, apt: Appointment): void {
    conn.prepareStatement(`
      INSERT INTO appointments (id, athlete_id, trainer_id, session_time, duration_minutes, status, created_at, updated_at, version)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).executeUpdate(
      apt.getId()!,
      apt.athleteId,
      apt.trainerId,
      apt.sessionTime.toISOString(),
      apt.durationMinutes,
      apt.status,
      apt.getCreatedAt().toISOString(),
      apt.getUpdatedAt().toISOString(),
      apt.getVersion()
    );
  }

  protected override updateEntity(conn: JdbcConnection, apt: Appointment): void {
    conn.prepareStatement(`
      UPDATE appointments SET status = ?, session_time = ?, duration_minutes = ?, updated_at = ?, version = ? WHERE id = ?
    `).executeUpdate(
      apt.status,
      apt.sessionTime.toISOString(),
      apt.durationMinutes,
      apt.getUpdatedAt().toISOString(),
      apt.getVersion(),
      apt.getId()!
    );
  }

  public async findByTrainerId(trainerId: string): Promise<Appointment[]> {
    return this.withConnection((conn) => {
      const rows = conn
        .prepareStatement('SELECT * FROM appointments WHERE trainer_id = ? ORDER BY session_time ASC')
        .executeQuery(trainerId);
      return rows.map(r => this.mapRow(r));
    });
  }

  public async findByAthleteId(athleteId: string): Promise<Appointment[]> {
    return this.withConnection((conn) => {
      const rows = conn
        .prepareStatement('SELECT * FROM appointments WHERE athlete_id = ? ORDER BY session_time ASC')
        .executeQuery(athleteId);
      return rows.map(r => this.mapRow(r));
    });
  }
}
