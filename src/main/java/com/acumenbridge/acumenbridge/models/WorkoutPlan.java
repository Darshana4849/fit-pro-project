package com.acumenbridge.acumenbridge.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * WorkoutPlan Model
 * 
 * Represents a workout plan entity in the system, containing:
 * - Workout plan details (title, description, difficulty)
 * - Duration and target muscles
 * - List of exercises with their specifications
 * - Creator information and visibility settings
 * - Creation and modification timestamps
 */
@Document(collection = "workoutPlans") // Specifies the MongoDB collection name
public class WorkoutPlan {
    @Id // Marks this field as the document identifier
    private String id; // Unique identifier for the workout plan
    
    private String userId;       // ID of the user who created the plan
    private String userName;     // Display name of the creator
    
    private String title;        // Title of the workout plan
    private String description;  // Description of the workout plan
    private String difficulty;   // Difficulty level (Beginner, Intermediate, Advanced)
    private int durationMinutes; // Total duration in minutes
    private List<String> targetMuscles = new ArrayList<>(); // List of targeted muscle groups
    private List<Exercise> exercises = new ArrayList<>();   // List of exercises in the plan
    private boolean isPublic;    // Visibility setting for the plan
    
    private Instant createdAt;   // Timestamp when plan was created
    private Instant updatedAt;   // Timestamp when plan was last updated

    /**
     * Nested Exercise class representing individual exercises within a workout plan
     */
    public static class Exercise {
        private String name;     // Name of the exercise
        private int sets;        // Number of sets
        private String reps;     // Repetitions (can be a range like "8-12")
        private String duration; // Duration for time-based exercises (e.g. "30 sec")
        
        /**
         * Default constructor
         */
        public Exercise() {}
        
        /**
         * Constructor for creating a new Exercise with specifications
         * @param name Name of the exercise
         * @param sets Number of sets
         * @param reps Repetitions (can be a range)
         * @param duration Duration for time-based exercises
         */
        public Exercise(String name, int sets, String reps, String duration) {
            this.name = name;
            this.sets = sets;
            this.reps = reps;
            this.duration = duration;
        }

        // Standard getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public int getSets() { return sets; }
        public void setSets(int sets) { this.sets = sets; }
        
        public String getReps() { return reps; }
        public void setReps(String reps) { this.reps = reps; }
        
        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
        
        /**
         * Returns a string representation of the Exercise
         * @return String containing exercise details
         */
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

    /**
     * Default constructor initializes timestamps
     */
    public WorkoutPlan() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }
    
    /**
     * Convenience constructor for creating a new WorkoutPlan with basic information
     * @param title Title of the workout plan
     * @param description Description of the workout plan
     * @param difficulty Difficulty level
     * @param durationMinutes Total duration in minutes
     * @param targetMuscles List of targeted muscle groups
     * @param exercises List of exercises
     * @param isPublic Visibility setting
     */
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

    // --------------------------------------
    // Standard Getters and Setters
    // --------------------------------------

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
    
    // --------------------------------------
    // Business Logic Methods
    // --------------------------------------

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
    
    /**
     * Returns a string representation of the WorkoutPlan
     * @return String containing workout plan details
     */
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