package com.fitvora.model;

import com.fitvora.enums.DifficultyLevel;
import com.fitvora.enums.MuscleGroup;

/**
 * Concrete StrengthWorkout illustrating Polymorphism and progressive overload calculation.
 */
public class StrengthWorkout extends AbstractWorkout {
    private int totalSets;
    private double estimatedVolumeLoadKg;
    private double rpeTarget; // Rating of Perceived Exertion (1 - 10)

    public StrengthWorkout() {
        super();
        this.rpeTarget = 8.0;
    }

    public StrengthWorkout(Long id, String title, String description, int durationMinutes,
                           DifficultyLevel difficultyLevel, MuscleGroup primaryMuscleGroup,
                           int totalSets, double estimatedVolumeLoadKg, double rpeTarget) {
        super(id, title, description, durationMinutes, difficultyLevel, primaryMuscleGroup);
        this.totalSets = totalSets;
        this.estimatedVolumeLoadKg = estimatedVolumeLoadKg;
        this.rpeTarget = rpeTarget;
    }

    public int getTotalSets() {
        return totalSets;
    }

    public void setTotalSets(int totalSets) {
        this.totalSets = totalSets;
    }

    public double getEstimatedVolumeLoadKg() {
        return estimatedVolumeLoadKg;
    }

    public void setEstimatedVolumeLoadKg(double estimatedVolumeLoadKg) {
        this.estimatedVolumeLoadKg = estimatedVolumeLoadKg;
    }

    public double getRpeTarget() {
        return rpeTarget;
    }

    public void setRpeTarget(double rpeTarget) {
        this.rpeTarget = rpeTarget;
    }

    /**
     * Polymorphic implementation of CalorieCalculable.
     * Strength formula incorporates EPOC (Excess Post-exercise Oxygen Consumption) and volume intensity.
     */
    @Override
    public double calculateCaloriesBurned(double bodyWeightKg) {
        // Base MET for resistance training = ~6.0, amplified by RPE and difficulty factor
        double baseMet = 5.5 + (rpeTarget / 10.0) * 2.0;
        double intensityMultiplier = difficultyLevel != null ? difficultyLevel.getIntensityFactor() : 1.0;
        double activeCalories = (baseMet * 3.5 * bodyWeightKg / 200.0) * durationMinutes * intensityMultiplier;
        
        // Add 15% EPOC recovery burn for hypertrophy/mechanical tension
        double epocBonus = activeCalories * 0.15;
        return Math.round((activeCalories + epocBonus) * 10.0) / 10.0;
    }

    @Override
    public String getWorkoutProtocol() {
        return String.format("STRENGTH PROTOCOL: %s | %d Sets | RPE Target: %.1f | Focus: Mechanical Tension & Neuromuscular recruitment",
                title, totalSets, rpeTarget);
    }
}
