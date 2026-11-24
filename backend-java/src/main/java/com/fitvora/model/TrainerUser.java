package com.fitvora.model;

import com.fitvora.enums.UserRole;
import java.util.ArrayList;
import java.util.List;

/**
 * Concrete Trainer class modeling coaches, nutritionists, and physical therapists.
 */
public class TrainerUser extends User {
    private String certification;
    private String specialization;
    private int experienceYears;
    private double hourlyRate;
    private double rating;
    private int reviewCount;
    private List<String> specialties;

    public TrainerUser() {
        super();
        this.role = UserRole.TRAINER;
        this.specialties = new ArrayList<>();
        this.rating = 5.0;
    }

    public TrainerUser(Long id, String name, String email, String passwordHash,
                       String certification, String specialization, int experienceYears,
                       double hourlyRate) {
        super(id, name, email, passwordHash, UserRole.TRAINER);
        this.certification = certification;
        this.specialization = specialization;
        this.experienceYears = experienceYears;
        this.hourlyRate = hourlyRate;
        this.rating = 5.0;
        this.specialties = new ArrayList<>();
    }

    public String getCertification() {
        return certification;
    }

    public void setCertification(String certification) {
        this.certification = certification;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public int getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(int experienceYears) {
        this.experienceYears = experienceYears;
    }

    public double getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(double hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(int reviewCount) {
        this.reviewCount = reviewCount;
    }

    public List<String> getSpecialties() {
        return specialties;
    }

    public void setSpecialties(List<String> specialties) {
        this.specialties = specialties;
    }

    @Override
    public String getProfileSummary() {
        return String.format("Coach %s (%s) | %d yrs exp | $%.2f/hr | Rating: %.2f★",
                name, specialization, experienceYears, hourlyRate, rating);
    }
}
