package com.fitvora.dao;

import com.fitvora.enums.MuscleGroup;
import com.fitvora.exception.DatabaseException;
import com.fitvora.generics.GenericDao;
import com.fitvora.model.AbstractWorkout;

import java.util.List;

public interface WorkoutDao extends GenericDao<AbstractWorkout, Long> {
    List<AbstractWorkout> findByMuscleGroup(MuscleGroup muscleGroup) throws DatabaseException;
    List<AbstractWorkout> findByAthleteId(Long athleteId) throws DatabaseException;
    void assignExercisesToWorkout(Long workoutId, List<Long> exerciseIds) throws DatabaseException;
}
