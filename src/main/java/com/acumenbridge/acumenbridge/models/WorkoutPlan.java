package com.acumenbridge.acumenbridge.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "workoutPlans")
public class WorkoutPlan {
    @Id
    private String id;
    
    private String userId;       // who created the plan
    private String userName;     // display name of the creator
    
    private String title;
    private String description;
    private String difficulty;   // Beginner, Intermediate, Advanced
    private int durationMinutes;
    private List<String> targetMuscles = new ArrayList<>();
    private List<Exercise> exercises = new ArrayList<>();
    private boolean isPublic;
    
    private Instant createdAt;
    private Instant updatedAt;

    // Nested Exercise class
    public static class Exercise {
        private String name;
        private int sets;
        private String reps;        // Changed to String to support ranges like "8-12"
        private String duration;    // Added to support time-based exercises (e.g. "30 sec")
        
        // Constructors, getters, and setters
        public Exercise() {}
        
        public Exercise(String name, int sets, String reps, String duration) {
            this.name = name;
            this.sets = sets;
            this.reps = reps;
            this.duration = duration;
        }

        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public int getSets() { return sets; }
        public void setSets(int sets) { this.sets = sets; }
        
        public String getReps() { return reps; }
        public void setReps(String reps) { this.reps = reps; }
        
        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
        
        @Override
        public String toString() {
            return "Exercise{" +
                    "name='" + name + '\'' +
                    ", sets=" + sets +
                    ", reps='" + reps + '\'' +
                    ", duration='" + duration + '\'' +
                    '}';
        }
    }

    // Constructors
    public WorkoutPlan() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }
    
    public WorkoutPlan(String title, String description, String difficulty, 
                       int durationMinutes, List<String> targetMuscles, 
                       List<Exercise> exercises, boolean isPublic) {
        this();
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.durationMinutes = durationMinutes;
        this.targetMuscles = targetMuscles;
        this.exercises = exercises;
        this.isPublic = isPublic;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    
    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
    
    public List<String> getTargetMuscles() { return targetMuscles; }
    public void setTargetMuscles(List<String> targetMuscles) { this.targetMuscles = targetMuscles; }
    
    public List<Exercise> getExercises() { return exercises; }
    public void setExercises(List<Exercise> exercises) { this.exercises = exercises; }
    
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    
    /**
     * Updates the updatedAt timestamp to the current time
     */
    public void updateTimestamp() {
        this.updatedAt = Instant.now();
    }
    
    /**
     * Adds a target muscle to the list if it doesn't already exist
     * @param muscle The muscle to add
     * @return true if added, false if already present
     */
    public boolean addTargetMuscle(String muscle) {
        if (!targetMuscles.contains(muscle)) {
            targetMuscles.add(muscle);
            return true;
        }
        return false;
    }
    
    /**
     * Removes a target muscle from the list
     * @param muscle The muscle to remove
     * @return true if removed, false if not found
     */
    public boolean removeTargetMuscle(String muscle) {
        return targetMuscles.remove(muscle);
    }
    
    /**
     * Adds an exercise to the workout plan
     * @param exercise The exercise to add
     */
    public void addExercise(Exercise exercise) {
        exercises.add(exercise);
    }
    
    /**
     * Removes an exercise at the specified index
     * @param index The index of the exercise to remove
     * @return The removed exercise, or null if index is out of bounds
     */
    public Exercise removeExercise(int index) {
        if (index >= 0 && index < exercises.size()) {
            return exercises.remove(index);
        }
        return null;
    }
    
    @Override
    public String toString() {
        return "WorkoutPlan{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", title='" + title + '\'' +
                ", difficulty='" + difficulty + '\'' +
                ", durationMinutes=" + durationMinutes +
                ", targetMuscles=" + targetMuscles +
                ", exercises=" + exercises +
                ", isPublic=" + isPublic +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}