package com.fitvora.interfaces;

/**
 * Interface demonstrating polymorphic calculation contract for fitness energy expenditure.
 */
public interface CalorieCalculable {
    /**
     * Polymorphic method implemented with distinct algorithms across workout types.
     * @param bodyWeightKg athlete's body weight
     * @return estimated calories burned (kcal)
     */
    double calculateCaloriesBurned(double bodyWeightKg);
}
