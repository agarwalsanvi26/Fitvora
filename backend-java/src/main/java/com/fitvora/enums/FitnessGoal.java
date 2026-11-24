package com.fitvora.enums;

public enum FitnessGoal {
    WEIGHT_LOSS("Weight Loss & Fat Reduction", 0.8),
    MUSCLE_GAIN("Hypertrophy & Lean Mass", 1.15),
    STRENGTH("Maximal Strength & Power", 1.10),
    ENDURANCE("Stamina & Cardiovascular Longevity", 1.05),
    FLEXIBILITY("Mobility & Functional Recovery", 0.95),
    GENERAL_FITNESS("General Health & Longevity", 1.0);

    private final String label;
    private final double caloricMultiplier;

    FitnessGoal(String label, double caloricMultiplier) {
        this.label = label;
        this.caloricMultiplier = caloricMultiplier;
    }

    public String getLabel() {
        return label;
    }

    public double getCaloricMultiplier() {
        return caloricMultiplier;
    }
}
