-- ===================================================================
-- FITVORA Smart Fitness Management System
-- Relational Database Schema (MySQL 8.0+)
-- ===================================================================

CREATE DATABASE IF NOT EXISTS fitvora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fitvora_db;

-- 1. USERS TABLE (Role-Based Polymorphic Model)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'TRAINER', 'ADMIN') NOT NULL DEFAULT 'USER',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Athlete-specific fields
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    target_weight_kg DECIMAL(5,2),
    fitness_goal ENUM('WEIGHT_LOSS', 'MUSCLE_GAIN', 'STRENGTH', 'ENDURANCE', 'FLEXIBILITY', 'GENERAL_FITNESS'),
    daily_water_target_liters DECIMAL(4,2) DEFAULT 2.50,
    streak_days INT UNSIGNED DEFAULT 0,
    
    -- Trainer-specific fields
    certification VARCHAR(150),
    specialization VARCHAR(150),
    experience_years INT UNSIGNED,
    hourly_rate DECIMAL(8,2),
    rating DECIMAL(3,2) DEFAULT 5.00,
    
    -- Admin-specific fields
    department VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. EXERCISES TABLE
CREATE TABLE IF NOT EXISTS exercises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    muscle_group ENUM('CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE', 'FULL_BODY', 'CARDIO', 'MOBILITY') NOT NULL,
    difficulty ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL,
    default_sets INT UNSIGNED DEFAULT 3,
    default_reps INT UNSIGNED DEFAULT 10,
    rest_seconds INT UNSIGNED DEFAULT 60,
    equipment VARCHAR(100) DEFAULT 'Bodyweight',
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ex_muscle (muscle_group)
) ENGINE=InnoDB;

-- 3. WORKOUTS TABLE (Polymorphic Discriminator Schema)
CREATE TABLE IF NOT EXISTS workouts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    duration_minutes INT UNSIGNED NOT NULL,
    difficulty_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL,
    muscle_group ENUM('CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE', 'FULL_BODY', 'CARDIO', 'MOBILITY') NOT NULL,
    workout_type ENUM('STRENGTH', 'CARDIO', 'MOBILITY') NOT NULL,
    
    -- Strength-specific
    total_sets INT UNSIGNED,
    volume_load_kg DECIMAL(9,2),
    rpe_target DECIMAL(3,1),
    
    -- Cardio-specific
    heart_rate_zone INT UNSIGNED,
    average_speed_kph DECIMAL(5,2),
    elevation_gain_meters DECIMAL(6,2),
    
    -- Mobility-specific
    focus_joint_chain VARCHAR(150),
    includes_breathwork BOOLEAN DEFAULT TRUE,
    
    scheduled_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_workout_type (workout_type),
    INDEX idx_workout_scheduled (scheduled_time)
) ENGINE=InnoDB;

-- 4. WORKOUT_EXERCISES (Many-to-Many Join Table)
CREATE TABLE IF NOT EXISTS workout_exercises (
    workout_id BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,
    order_index INT NOT NULL,
    PRIMARY KEY (workout_id, exercise_id),
    CONSTRAINT fk_we_workout FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE,
    CONSTRAINT fk_we_exercise FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. APPOINTMENTS TABLE (Synchronized Booking & Trainer Calendar)
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    athlete_id BIGINT NOT NULL,
    trainer_id BIGINT NOT NULL,
    session_time DATETIME NOT NULL,
    duration_minutes INT UNSIGNED NOT NULL DEFAULT 60,
    session_type VARCHAR(100) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_apt_athlete FOREIGN KEY (athlete_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_apt_trainer FOREIGN KEY (trainer_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_trainer_slot (trainer_id, session_time)
) ENGINE=InnoDB;

-- 6. PROGRESS_RECORDS TABLE (Biometric Tracking)
CREATE TABLE IF NOT EXISTS progress_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    athlete_id BIGINT NOT NULL,
    record_date DATE NOT NULL,
    weight_kg DECIMAL(5,2) NOT NULL,
    body_fat_percentage DECIMAL(4,2),
    waist_cm DECIMAL(5,2),
    chest_cm DECIMAL(5,2),
    hips_cm DECIMAL(5,2),
    daily_steps INT UNSIGNED DEFAULT 0,
    workout_minutes INT UNSIGNED DEFAULT 0,
    calories_burned DECIMAL(6,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_prog_athlete FOREIGN KEY (athlete_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE KEY uk_athlete_date (athlete_id, record_date)
) ENGINE=InnoDB;

-- 7. SEED DATA NOTE
-- Create initial accounts via POST /api/auth/register (or a deployment seed script
-- generating real BCrypt hashes) rather than embedding static password hashes in SQL.
