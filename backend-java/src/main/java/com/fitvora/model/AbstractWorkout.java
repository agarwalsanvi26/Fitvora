package com.fitvora.model;

import com.fitvora.enums.DifficultyLevel;
import com.fitvora.enums.MuscleGroup;
import com.fitvora.interfaces.CalorieCalculable;
import com.fitvora.interfaces.Schedulable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Abstract Workout base class demonstrating OOP Polymorphism and Encapsulation.
 */
public abstract class AbstractWorkout extends AbstractEntity implements CalorieCalculable, Schedulable {
    protected String title;
    protected String description;
    protected int durationMinutes;
    protected DifficultyLevel difficultyLevel;
    protected MuscleGroup primaryMuscleGroup;
    protected LocalDateTime scheduledTime;
    protected List<Exercise> exercises;

    public AbstractWorkout() {
        super();
        this.exercises = new ArrayList<>();
    }

    public AbstractWorkout(Long id, String title, String description, int durationMinutes,
                           DifficultyLevel difficultyLevel, MuscleGroup primaryMuscleGroup) {
        super(id);
        this.title = title;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.difficultyLevel = difficultyLevel;
        this.primaryMuscleGroup = primaryMuscleGroup;
        this.exercises = new ArrayList<>();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public DifficultyLevel getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public MuscleGroup getPrimaryMuscleGroup() {
        return primaryMuscleGroup;
    }

    public void setPrimaryMuscleGroup(MuscleGroup primaryMuscleGroup) {
        this.primaryMuscleGroup = primaryMuscleGroup;
    }

    @Override
    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public List<Exercise> getExercises() {
        return exercises;
    }

    public void setExercises(List<Exercise> exercises) {
        this.exercises = exercises;
    }

    public void addExercise(Exercise exercise) {
        if (exercise != null) {
            this.exercises.add(exercise);
        }
    }

    @Override
    public boolean conflictsWith(Schedulable other) {
        if (other == null || this.scheduledTime == null || other.getScheduledTime() == null) {
            return false;
        }
        LocalDateTime startA = this.scheduledTime;
        LocalDateTime endA = startA.plusMinutes(this.durationMinutes);
        LocalDateTime startB = other.getScheduledTime();
        LocalDateTime endB = startB.plusMinutes(other.getDurationMinutes());

        return startA.isBefore(endB) && endA.isAfter(startB);
    }

    /**
     * Polymorphic method implemented differently by Strength, Cardio, and Mobility.
     */
    @Override
    public abstract double calculateCaloriesBurned(double bodyWeightKg);

    /**
     * Polymorphic description of training protocol and recovery advice.
     */
    public abstract String getWorkoutProtocol();
}
