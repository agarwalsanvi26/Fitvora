package com.fitvora.model;

import com.fitvora.enums.AppointmentStatus;
import com.fitvora.interfaces.Schedulable;

import java.time.LocalDateTime;

public class Appointment extends AbstractEntity implements Schedulable {
    private Long athleteId;
    private String athleteName;
    private Long trainerId;
    private String trainerName;
    private LocalDateTime sessionTime;
    private int durationMinutes;
    private String sessionType;
    private AppointmentStatus status;
    private String notes;

    public Appointment() {
        super();
        this.status = AppointmentStatus.PENDING;
        this.durationMinutes = 60;
    }

    public Appointment(Long id, Long athleteId, String athleteName, Long trainerId,
                       String trainerName, LocalDateTime sessionTime, String sessionType) {
        super(id);
        this.athleteId = athleteId;
        this.athleteName = athleteName;
        this.trainerId = trainerId;
        this.trainerName = trainerName;
        this.sessionTime = sessionTime;
        this.durationMinutes = 60;
        this.sessionType = sessionType;
        this.status = AppointmentStatus.PENDING;
    }

    public Long getAthleteId() {
        return athleteId;
    }

    public void setAthleteId(Long athleteId) {
        this.athleteId = athleteId;
    }

    public String getAthleteName() {
        return athleteName;
    }

    public void setAthleteName(String athleteName) {
        this.athleteName = athleteName;
    }

    public Long getTrainerId() {
        return trainerId;
    }

    public void setTrainerId(Long trainerId) {
        this.trainerId = trainerId;
    }

    public String getTrainerName() {
        return trainerName;
    }

    public void setTrainerName(String trainerName) {
        this.trainerName = trainerName;
    }

    public LocalDateTime getSessionTime() {
        return sessionTime;
    }

    public void setSessionTime(LocalDateTime sessionTime) {
        this.sessionTime = sessionTime;
    }

    @Override
    public LocalDateTime getScheduledTime() {
        return sessionTime;
    }

    @Override
    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getSessionType() {
        return sessionType;
    }

    public void setSessionType(String sessionType) {
        this.sessionType = sessionType;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Override
    public boolean conflictsWith(Schedulable other) {
        if (other == null || this.sessionTime == null || other.getScheduledTime() == null) {
            return false;
        }
        LocalDateTime startA = this.sessionTime;
        LocalDateTime endA = startA.plusMinutes(this.durationMinutes);
        LocalDateTime startB = other.getScheduledTime();
        LocalDateTime endB = startB.plusMinutes(other.getDurationMinutes());

        return startA.isBefore(endB) && endA.isAfter(startB);
    }
}
