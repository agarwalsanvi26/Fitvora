package com.fitvora.enums;

public enum MuscleGroup {
    CHEST("Chest / Pectorals"),
    BACK("Back / Latissimus Dorsi"),
    LEGS("Legs / Quadriceps & Hamstrings"),
    SHOULDERS("Shoulders / Deltoids"),
    ARMS("Arms / Biceps & Triceps"),
    CORE("Core / Abdominals"),
    FULL_BODY("Full Body Compound"),
    CARDIO("Cardiovascular System"),
    MOBILITY("Joints & Fascia");

    private final String description;

    MuscleGroup(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
