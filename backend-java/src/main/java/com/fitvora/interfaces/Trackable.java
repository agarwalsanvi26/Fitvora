package com.fitvora.interfaces;

import java.util.Map;

/**
 * Interface for domain objects that track biological and athletic performance metrics.
 */
public interface Trackable {
    void recordMetric(String metricName, double value);
    Map<String, Double> getMetricsSummary();
    double getMetric(String metricName);
}
