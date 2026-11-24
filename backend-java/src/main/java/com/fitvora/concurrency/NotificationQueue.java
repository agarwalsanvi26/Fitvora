package com.fitvora.concurrency;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Thread-Safe Producer-Consumer Notification Queue.
 * Demonstrates:
 * 1. Multithreading & Synchronization (ReentrantLock, Condition notEmpty/notFull)
 * 2. Background daemon thread consumer
 * 3. Graceful shutdown
 */
public class NotificationQueue {
    public static class NotificationMessage {
        private final Long userId;
        private final String title;
        private final String message;
        private final long timestamp;

        public NotificationMessage(Long userId, String title, String message) {
            this.userId = userId;
            this.title = title;
            this.message = message;
            this.timestamp = System.currentTimeMillis();
        }

        public Long getUserId() { return userId; }
        public String getTitle() { return title; }
        public String getMessage() { return message; }
        public long getTimestamp() { return timestamp; }
    }

    private static final int MAX_CAPACITY = 100;
    private final Queue<NotificationMessage> queue;
    private final ReentrantLock lock;
    private final Condition notFull;
    private final Condition notEmpty;
    private volatile boolean isRunning;
    private final Thread consumerThread;

    public NotificationQueue() {
        this.queue = new LinkedList<>();
        this.lock = new ReentrantLock();
        this.notFull = lock.newCondition();
        this.notEmpty = lock.newCondition();
        this.isRunning = true;

        this.consumerThread = new Thread(this::consumeLoop, "Notification-Consumer-Thread");
        this.consumerThread.setDaemon(true);
        this.consumerThread.start();
    }

    /**
     * Thread-safe enqueue with Condition wait on full queue.
     */
    public void enqueue(NotificationMessage message) throws InterruptedException {
        lock.lock();
        try {
            while (queue.size() >= MAX_CAPACITY && isRunning) {
                notFull.await();
            }
            if (!isRunning) return;

            queue.add(message);
            notEmpty.signal(); // Notify waiting consumer
        } finally {
            lock.unlock();
        }
    }

    private void consumeLoop() {
        while (isRunning) {
            NotificationMessage msg = null;
            lock.lock();
            try {
                while (queue.isEmpty() && isRunning) {
                    notEmpty.await();
                }
                if (!isRunning && queue.isEmpty()) break;

                msg = queue.poll();
                notFull.signal(); // Notify waiting producers
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } finally {
                lock.unlock();
            }

            if (msg != null) {
                dispatchNotification(msg);
            }
        }
    }

    private void dispatchNotification(NotificationMessage msg) {
        // Simulated push notification / email dispatch
        System.out.println(String.format("[ASYNC-NOTIF-DISPATCH] To User %d: '%s' - %s",
                msg.getUserId(), msg.getTitle(), msg.getMessage()));
    }

    public synchronized void shutdown() {
        this.isRunning = false;
        lock.lock();
        try {
            notEmpty.signalAll();
            notFull.signalAll();
        } finally {
            lock.unlock();
        }
    }

    public int getQueueSize() {
        lock.lock();
        try {
            return queue.size();
        } finally {
            lock.unlock();
        }
    }
}
