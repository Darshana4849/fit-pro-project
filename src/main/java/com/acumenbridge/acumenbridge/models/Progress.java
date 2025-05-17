package com.acumenbridge.acumenbridge.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Progress Model
 * 
 * Represents a user's progress tracking entity in the system, containing:
 * - Achievement type and details
 * - Progress tracking metrics (completed vs total)
 * - Unique identifier
 */
@Document(collection = "progress") // Specifies the MongoDB collection name
public class Progress {

    @Id // Marks this field as the document identifier
    private String id; // Unique identifier for the progress record

    private String achievementType; // Type/category of the achievement
    private String head;            // Title/heading of the progress item
    private String description;     // Detailed description of the progress
    private int completed;          // Number of items/tasks completed
    private int toComplete;         // Total number of items/tasks to complete

    // --------------------------------------
    // Standard Getters and Setters
    // --------------------------------------

    /**
     * Gets the unique identifier of the progress record
     * @return The progress ID
     */
    public String getId() {
        return id;
    }

    /**
     * Gets the type/category of the achievement
     * @return The achievement type
     */
    public String getAchievementType() {
        return achievementType;
    }

    /**
     * Sets the type/category of the achievement
     * @param achievementType The achievement type to set
     */
    public void setAchievementType(String achievementType) {
        this.achievementType = achievementType;
    }

    /**
     * Gets the title/heading of the progress item
     * @return The progress heading
     */
    public String getHead() {
        return head;
    }

    /**
     * Sets the title/heading of the progress item
     * @param head The heading to set
     */
    public void setHead(String head) {
        this.head = head;
    }

    /**
     * Gets the detailed description of the progress
     * @return The progress description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the detailed description of the progress
     * @param description The description to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Gets the number of completed items/tasks
     * @return The completed count
     */
    public int getCompleted() {
        return completed;
    }

    /**
     * Sets the number of completed items/tasks
     * @param completed The completed count to set
     */
    public void setCompleted(int completed) {
        this.completed = completed;
    }

    /**
     * Gets the total number of items/tasks to complete
     * @return The total to complete
     */
    public int getToComplete() {
        return toComplete;
    }

    /**
     * Sets the total number of items/tasks to complete
     * @param toComplete The total to complete
     */
    public void setToComplete(int toComplete) {
        this.toComplete = toComplete;
    }
}