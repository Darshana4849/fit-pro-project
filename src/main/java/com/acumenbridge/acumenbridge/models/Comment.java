// src/main/java/com/acumenbridge/acumenbridge/models/Comment.java
package com.acumenbridge.acumenbridge.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Comment Model
 * 
 * Represents a comment entity in the system, storing information about:
 * - The post being commented on
 * - The user who made the comment
 * - The comment text content
 * - Creation and modification timestamps
 */
@Document(collection = "comments") // Specifies the MongoDB collection name
public class Comment {

    @Id // Marks this field as the document identifier
    private String id; // Unique identifier for the comment

    private String postId;     // ID of the post this comment belongs to
    private String authorId;   // ID of the user who created the comment
    private String authorName; // Display name of the comment author
    private String text;       // The comment content

    private Instant createdAt; // Timestamp when comment was created
    private Instant updatedAt; // Timestamp when comment was last updated

    /**
     * Default constructor required by Spring Data.
     */
    public Comment() {
        // Default constructor for Spring Data
    }

    /**
     * Convenience constructor for creating a new Comment with initial values.
     *
     * @param postId      ID of the post being commented on
     * @param authorId    ID of the user making the comment
     * @param authorName  Display name of the comment author
     * @param text        The comment text content
     */
    public Comment(String postId, String authorId, String authorName, String text) {
        this.postId     = postId;
        this.authorId   = authorId;
        this.authorName = authorName;
        this.text       = text;
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    // --------------------------------------
    // Standard Getters and Setters
    // --------------------------------------

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    // --------------------------------------
    // Overridden Methods
    // --------------------------------------

    /**
     * Returns a string representation of the Comment object.
     * 
     * @return String containing all fields of the Comment
     */
    @Override
    public String toString() {
        return "Comment{" +
               "id='" + id + '\'' +
               ", postId='" + postId + '\'' +
               ", authorId='" + authorId + '\'' +
               ", authorName='" + authorName + '\'' +
               ", text='" + text + '\'' +
               ", createdAt=" + createdAt +
               ", updatedAt=" + updatedAt +
               '}';
    }
}