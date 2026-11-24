package com.fitvora.enums;

public enum DifficultyLevel {
    BEGINNER("Beginner", 1.0),
    INTERMEDIATE("Intermediate", 1.25),
    ADVANCED("Advanced", 1.5);

    private final String display;
    private final double intensityFactor;

    DifficultyLevel(String display, double intensityFactor) {
        this.display = display;
        this.intensityFactor = intensityFactor;
    }

    public String getDisplay() {
        return display;
    }

    public double getIntensityFactor() {
        return intensityFactor;
    }
}
