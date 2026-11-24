package com.fitvora.concurrency;

import com.fitvora.model.AbstractWorkout;
import com.fitvora.model.AthleteUser;

import java.util.List;
import java.util.concurrent.*;

/**
 * Concurrent Workout Analytics & Metabolic Engine.
 * Demonstrates:
 * 1. Multithreading & Synchronization (ExecutorService, Callable, Future)
 * 2. Parallel processing of intensive athletic volume and energy burn metrics
 */
public class WorkoutAnalyticsProcessor {

    public static class AnalyticsResult {
        private final Long athleteId;
        private final double totalCaloriesBurned;
        private final int totalWorkoutMinutes;
        private final int completedSessions;
        private final long computationTimeMs;

        public AnalyticsResult(Long athleteId, double totalCaloriesBurned, int totalWorkoutMinutes,
                               int completedSessions, long computationTimeMs) {
            this.athleteId = athleteId;
            this.totalCaloriesBurned = totalCaloriesBurned;
            this.totalWorkoutMinutes = totalWorkoutMinutes;
            this.completedSessions = completedSessions;
            this.computationTimeMs = computationTimeMs;
        }

        public Long getAthleteId() { return athleteId; }
        public double getTotalCaloriesBurned() { return totalCaloriesBurned; }
        public int getTotalWorkoutMinutes() { return totalWorkoutMinutes; }
        public int getCompletedSessions() { return completedSessions; }
        public long getComputationTimeMs() { return computationTimeMs; }
    }

    private final ExecutorService executorService;

    public WorkoutAnalyticsProcessor() {
        // Controlled pool with fixed threads and custom naming
        this.executorService = Executors.newFixedThreadPool(4, new ThreadFactory() {
            private int counter = 1;
            @Override
            public Thread newThread(Runnable r) {
                Thread t = new Thread(r, "Fitvora-AnalyticsWorker-" + counter++);
                t.setPriority(Thread.NORM_PRIORITY);
                return t;
            }
        });
    }

    /**
     * Dispatches heavy analytics computation asynchronously to the worker pool.
     */
    public Future<AnalyticsResult> computeAthleteSummaryAsync(AthleteUser athlete, List<AbstractWorkout> workouts) {
        return executorService.submit(new Callable<AnalyticsResult>() {
            @Override
            public AnalyticsResult call() throws Exception {
                long start = System.currentTimeMillis();

                double totalCalories = 0.0;
                int totalMinutes = 0;

                // Polymorphic method call across heterogeneous workout instances
                for (AbstractWorkout workout : workouts) {
                    totalCalories += workout.calculateCaloriesBurned(athlete.getCurrentWeightKg());
                    totalMinutes += workout.getDurationMinutes();
                }

                long elapsed = System.currentTimeMillis() - start;
                return new AnalyticsResult(athlete.getId(), Math.round(totalCalories * 10.0) / 10.0,
                        totalMinutes, workouts.size(), elapsed);
            }
        });
    }

    public void shutdown() {
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(3, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
