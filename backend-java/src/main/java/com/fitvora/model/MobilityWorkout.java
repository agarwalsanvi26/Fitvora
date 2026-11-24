package com.fitvora.model;

import com.fitvora.enums.DifficultyLevel;
import com.fitvora.enums.MuscleGroup;

/**
 * Concrete MobilityWorkout illustrating active restorative energy expenditure.
 */
public class MobilityWorkout extends AbstractWorkout {
    private boolean includesBreathwork;
    private String focusJointChain; // e.g., "Thoracic Spine & Pelvic Girdle"

    public MobilityWorkout() {
        super();
        this.primaryMuscleGroup = MuscleGroup.MOBILITY;
        this.includesBreathwork = true;
    }

    public MobilityWorkout(Long id, String title, String description, int durationMinutes,
                           DifficultyLevel difficultyLevel, String focusJointChain) {
        super(id, title, description, durationMinutes, difficultyLevel, MuscleGroup.MOBILITY);
        this.focusJointChain = focusJointChain;
        this.includesBreathwork = true;
    }

    public boolean isIncludesBreathwork() {
        return includesBreathwork;
    }

    public void setIncludesBreathwork(boolean includesBreathwork) {
        this.includesBreathwork = includesBreathwork;
    }

    public String getFocusJointChain() {
        return focusJointChain;
    }

    public void setFocusJointChain(String focusJointChain) {
        this.focusJointChain = focusJointChain;
    }

    /**
     * Polymorphic implementation of CalorieCalculable.
     * Restorative flow prioritizes autonomic down-regulation and tissue glide.
     */
    @Override
    public double calculateCaloriesBurned(double bodyWeightKg) {
        double mobilityMet = 2.8;
        double calories = (mobilityMet * 3.5 * bodyWeightKg / 200.0) * durationMinutes;
        return Math.round(calories * 10.0) / 10.0;
    }

    @Override
    public String getWorkoutProtocol() {
        return String.format("MOBILITY PROTOCOL: %s | Target: %s | Diaphragmatic Breathwork: %b | Focus: Joint Capsule & Fascial Decompression",
                title, focusJointChain, includesBreathwork);
    }
}
