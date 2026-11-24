package com.fitvora.concurrency;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Fine-Grained Concurrency Lock Manager for Trainer Schedules.
 * Demonstrates:
 * 1. Multithreading & Synchronization (ConcurrentHashMap, ReentrantLock, tryLock with timeout)
 * 2. Race condition prevention during high-concurrency booking spikes
 */
public class AppointmentSchedulerLock {
    private static final ConcurrentHashMap<Long, ReentrantLock> trainerLocks = new ConcurrentHashMap<>();

    private AppointmentSchedulerLock() {}

    /**
     * Attempts to acquire an exclusive lock for a specific trainer before scheduling.
     * Prevents double-booking race conditions between concurrent threads.
     *
     * @param trainerId ID of trainer being reserved
     * @param timeoutMs maximum time to wait for lock acquisition
     * @return true if lock acquired successfully, false on timeout
     * @throws InterruptedException if interrupted while waiting
     */
    public static boolean acquireTrainerLock(Long trainerId, long timeoutMs) throws InterruptedException {
        ReentrantLock lock = trainerLocks.computeIfAbsent(trainerId, id -> new ReentrantLock(true)); // Fair locking
        return lock.tryLock(timeoutMs, TimeUnit.MILLISECONDS);
    }

    /**
     * Releases exclusive lock for the trainer.
     * @param trainerId ID of trainer
     */
    public static void releaseTrainerLock(Long trainerId) {
        ReentrantLock lock = trainerLocks.get(trainerId);
        if (lock != null && lock.isHeldByCurrentThread()) {
            lock.unlock();
        }
    }
}
