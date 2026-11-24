package com.fitvora.concurrency;

import java.util.concurrent.atomic.AtomicLong;

/**
 * Platform metrics and concurrency coordination manager.
 * Demonstrates Atomic primitives (thread-safe lock-free counters).
 */
public class WorkerThreadPoolManager {
    private static final AtomicLong totalWorkoutsLogged = new AtomicLong(0);
    private static final AtomicLong totalHydrationLitersLogged = new AtomicLong(0);

    private WorkerThreadPoolManager() {}

    public static long incrementWorkouts() {
        return totalWorkoutsLogged.incrementAndGet();
    }

    public static long addHydration(long ml) {
        return totalHydrationLitersLogged.addAndGet(ml);
    }

    public static long getTotalWorkoutsLogged() {
        return totalWorkoutsLogged.get();
    }

    public static long getTotalHydrationLitersLogged() {
        return totalHydrationLitersLogged.get() / 1000;
    }
}
