package com.fitvora.model;

import com.fitvora.enums.DifficultyLevel;
import com.fitvora.enums.MuscleGroup;

public class Exercise extends AbstractEntity {
    private String name;
    private MuscleGroup muscleGroup;
    private DifficultyLevel difficulty;
    private int defaultSets;
    private int defaultReps;
    private int restSeconds;
    private String equipment;
    private String instructions;

    public Exercise() {
        super();
    }

    public Exercise(Long id, String name, MuscleGroup muscleGroup, DifficultyLevel difficulty,
                    int defaultSets, int defaultReps, int restSeconds, String equipment, String instructions) {
        super(id);
        this.name = name;
        this.muscleGroup = muscleGroup;
        this.difficulty = difficulty;
        this.defaultSets = defaultSets;
        this.defaultReps = defaultReps;
        this.restSeconds = restSeconds;
        this.equipment = equipment;
        this.instructions = instructions;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public MuscleGroup getMuscleGroup() {
        return muscleGroup;
    }

    public void setMuscleGroup(MuscleGroup muscleGroup) {
        this.muscleGroup = muscleGroup;
    }

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(DifficultyLevel difficulty) {
        this.difficulty = difficulty;
    }

    public int getDefaultSets() {
        return defaultSets;
    }

    public void setDefaultSets(int defaultSets) {
        this.defaultSets = defaultSets;
    }

    public int getDefaultReps() {
        return defaultReps;
    }

    public void setDefaultReps(int defaultReps) {
        this.defaultReps = defaultReps;
    }

    public int getRestSeconds() {
        return restSeconds;
    }

    public void setRestSeconds(int restSeconds) {
        this.restSeconds = restSeconds;
    }

    public String getEquipment() {
        return equipment;
    }

    public void setEquipment(String equipment) {
        this.equipment = equipment;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}
