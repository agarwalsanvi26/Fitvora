package com.fitvora.model;

import com.fitvora.enums.DifficultyLevel;
import com.fitvora.enums.MuscleGroup;

/**
 * Concrete CardioWorkout illustrating distinct polymorphic energy expenditure algorithm.
 */
public class CardioWorkout extends AbstractWorkout {
    private int targetHeartRateZone; // Zone 1 to Zone 5
    private double averageSpeedKph;
    private double elevationGainMeters;

    public CardioWorkout() {
        super();
        this.primaryMuscleGroup = MuscleGroup.CARDIO;
        this.targetHeartRateZone = 3;
    }

    public CardioWorkout(Long id, String title, String description, int durationMinutes,
                         DifficultyLevel difficultyLevel, int targetHeartRateZone,
                         double averageSpeedKph) {
        super(id, title, description, durationMinutes, difficultyLevel, MuscleGroup.CARDIO);
        this.targetHeartRateZone = targetHeartRateZone;
        this.averageSpeedKph = averageSpeedKph;
    }

    public int getTargetHeartRateZone() {
        return targetHeartRateZone;
    }

    public void setTargetHeartRateZone(int targetHeartRateZone) {
        this.targetHeartRateZone = targetHeartRateZone;
    }

    public double getAverageSpeedKph() {
        return averageSpeedKph;
    }

    public void setAverageSpeedKph(double averageSpeedKph) {
        this.averageSpeedKph = averageSpeedKph;
    }

    public double getElevationGainMeters() {
        return elevationGainMeters;
    }

    public void setElevationGainMeters(double elevationGainMeters) {
        this.elevationGainMeters = elevationGainMeters;
    }

    /**
     * Polymorphic implementation of CalorieCalculable.
     * Cardio formula scales exponentially with Heart Rate Zones (Zone 2 aerobic vs Zone 4/5 VO2 max).
     */
    @Override
    public double calculateCaloriesBurned(double bodyWeightKg) {
        double zoneMet;
        switch (targetHeartRateZone) {
            case 1: zoneMet = 4.0; break;
            case 2: zoneMet = 7.0; break; // Aerobic fat oxidation base
            case 3: zoneMet = 9.5; break; // Tempo lactate clearance
            case 4: zoneMet = 12.0; break; // Threshold
            case 5: zoneMet = 15.0; break; // VO2 max sprint
            default: zoneMet = 8.0;
        }

        double calories = (zoneMet * 3.5 * bodyWeightKg / 200.0) * durationMinutes;
        return Math.round(calories * 10.0) / 10.0;
    }

    @Override
    public String getWorkoutProtocol() {
        return String.format("CARDIO PROTOCOL: %s | Zone %d | Target Speed: %.1f km/h | Focus: Mitochondrial Density & VO2 Max",
                title, targetHeartRateZone, averageSpeedKph);
    }
}
