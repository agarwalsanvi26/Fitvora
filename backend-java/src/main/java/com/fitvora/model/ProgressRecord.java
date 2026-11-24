package com.fitvora.model;

import com.fitvora.interfaces.Trackable;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public class ProgressRecord extends AbstractEntity implements Trackable {
    private Long athleteId;
    private LocalDate recordDate;
    private double weightKg;
    private double bodyFatPercentage;
    private double waistCm;
    private double chestCm;
    private double hipsCm;
    private int dailySteps;
    private int workoutMinutes;
    private double caloriesBurned;
    private Map<String, Double> dynamicMetrics;

    public ProgressRecord() {
        super();
        this.recordDate = LocalDate.now();
        this.dynamicMetrics = new HashMap<>();
    }

    public ProgressRecord(Long id, Long athleteId, LocalDate recordDate, double weightKg,
                          double bodyFatPercentage, double waistCm, int dailySteps) {
        super(id);
        this.athleteId = athleteId;
        this.recordDate = recordDate;
        this.weightKg = weightKg;
        this.bodyFatPercentage = bodyFatPercentage;
        this.waistCm = waistCm;
        this.dailySteps = dailySteps;
        this.dynamicMetrics = new HashMap<>();
    }

    public Long getAthleteId() {
        return athleteId;
    }

    public void setAthleteId(Long athleteId) {
        this.athleteId = athleteId;
    }

    public LocalDate getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDate recordDate) {
        this.recordDate = recordDate;
    }

    public double getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(double weightKg) {
        this.weightKg = weightKg;
    }

    public double getBodyFatPercentage() {
        return bodyFatPercentage;
    }

    public void setBodyFatPercentage(double bodyFatPercentage) {
        this.bodyFatPercentage = bodyFatPercentage;
    }

    public double getWaistCm() {
        return waistCm;
    }

    public void setWaistCm(double waistCm) {
        this.waistCm = waistCm;
    }

    public double getChestCm() {
        return chestCm;
    }

    public void setChestCm(double chestCm) {
        this.chestCm = chestCm;
    }

    public double getHipsCm() {
        return hipsCm;
    }

    public void setHipsCm(double hipsCm) {
        this.hipsCm = hipsCm;
    }

    public int getDailySteps() {
        return dailySteps;
    }

    public void setDailySteps(int dailySteps) {
        this.dailySteps = dailySteps;
    }

    public int getWorkoutMinutes() {
        return workoutMinutes;
    }

    public void setWorkoutMinutes(int workoutMinutes) {
        this.workoutMinutes = workoutMinutes;
    }

    public double getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(double caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    @Override
    public void recordMetric(String metricName, double value) {
        this.dynamicMetrics.put(metricName, value);
    }

    @Override
    public Map<String, Double> getMetricsSummary() {
        Map<String, Double> summary = new HashMap<>(dynamicMetrics);
        summary.put("weightKg", weightKg);
        summary.put("bodyFat", bodyFatPercentage);
        summary.put("waistCm", waistCm);
        summary.put("steps", (double) dailySteps);
        return summary;
    }

    @Override
    public double getMetric(String metricName) {
        return dynamicMetrics.getOrDefault(metricName, 0.0);
    }
}
