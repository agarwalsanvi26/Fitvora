package com.fitvora.model;

import com.fitvora.enums.FitnessGoal;
import com.fitvora.enums.UserRole;

/**
 * Concrete Athlete/User class modeling gym and home fitness members.
 * Implements role-specific polymorphic behavior and biometric data.
 */
public class AthleteUser extends User {
    private double heightCm;
    private double currentWeightKg;
    private double targetWeightKg;
    private FitnessGoal fitnessGoal;
    private double dailyWaterTargetLiters;
    private int streakDays;

    public AthleteUser() {
        super();
        this.role = UserRole.USER;
        this.dailyWaterTargetLiters = 2.5;
        this.streakDays = 0;
    }

    public AthleteUser(Long id, String name, String email, String passwordHash,
                       double heightCm, double currentWeightKg, double targetWeightKg,
                       FitnessGoal fitnessGoal) {
        super(id, name, email, passwordHash, UserRole.USER);
        this.heightCm = heightCm;
        this.currentWeightKg = currentWeightKg;
        this.targetWeightKg = targetWeightKg;
        this.fitnessGoal = fitnessGoal;
        this.dailyWaterTargetLiters = 2.5;
        this.streakDays = 0;
    }

    public double getHeightCm() {
        return heightCm;
    }

    public void setHeightCm(double heightCm) {
        this.heightCm = heightCm;
    }

    public double getCurrentWeightKg() {
        return currentWeightKg;
    }

    public void setCurrentWeightKg(double currentWeightKg) {
        this.currentWeightKg = currentWeightKg;
    }

    public double getTargetWeightKg() {
        return targetWeightKg;
    }

    public void setTargetWeightKg(double targetWeightKg) {
        this.targetWeightKg = targetWeightKg;
    }

    public FitnessGoal getFitnessGoal() {
        return fitnessGoal;
    }

    public void setFitnessGoal(FitnessGoal fitnessGoal) {
        this.fitnessGoal = fitnessGoal;
    }

    public double getDailyWaterTargetLiters() {
        return dailyWaterTargetLiters;
    }

    public void setDailyWaterTargetLiters(double dailyWaterTargetLiters) {
        this.dailyWaterTargetLiters = dailyWaterTargetLiters;
    }

    public int getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(int streakDays) {
        this.streakDays = streakDays;
    }

    public double calculateBmi() {
        if (heightCm <= 0) return 0.0;
        double heightM = heightCm / 100.0;
        return Math.round((currentWeightKg / (heightM * heightM)) * 10.0) / 10.0;
    }

    @Override
    public String getProfileSummary() {
        return String.format("Athlete: %s | Goal: %s | BMI: %.1f | Streak: %d days",
                name, fitnessGoal != null ? fitnessGoal.getLabel() : "General", calculateBmi(), streakDays);
    }
}
