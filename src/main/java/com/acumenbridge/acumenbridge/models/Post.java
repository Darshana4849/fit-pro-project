// src/main/java/com/acumenbridge/acumenbridge/models/Post.java
package com.acumenbridge.acumenbridge.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Represents a Post entity in the social media application.
 * Stores information about user posts including content, media, likes, and timestamps.
 * Persisted in MongoDB as documents in the "posts" collection.
 */
@Document(collection = "posts") // Specifies the MongoDB collection name
public class Post {

    @Id // Marks this field as the document identifier
    private String id; // Unique identifier for the post

    private String userId;       // ID of the user who created the post
    private String userName;     // Display name of the creator

    private String description;  // Text content of the post
    private List<String> mediaUrls = new ArrayList<>(); // URLs to associated media files

    private Set<String> likes = new HashSet<>(); // Set of user IDs who liked the post

    private Instant createdAt;  // Timestamp when post was created
    private Instant updatedAt;  // Timestamp when post was last updated

    /**
     * Default constructor required by Spring Data.
     */
    public Post() {
        // Default constructor for Spring Data
    }

    /**
     * Convenience constructor for creating a new Post with initial values.
     *
     * @param userId      ID of the user creating the post
     * @param userName    Name of the user creating the post
     * @param description Text description/content of the post
     * @param mediaUrls   List of URLs to media files associated with the post
     */
    public Post(String userId, String userName, String description, List<String> mediaUrls) {
        this.userId      = userId;
        this.userName    = userName;
        this.description = description;
        this.mediaUrls   = mediaUrls != null ? mediaUrls : new ArrayList<>();
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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getMediaUrls() {
        return mediaUrls;
    }

    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }

    public Set<String> getLikes() {
        return likes;
    }

    public void setLikes(Set<String> likes) {
        this.likes = likes;
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
    // Business Logic Methods
    // --------------------------------------

    /**
     * Adds a user's like to this post.
     * @param userId ID of the user who liked the post
     */
    public void addLike(String userId) {
        this.likes.add(userId);
    }

    /**
     * Removes a user's like from this post.
     * @param userId ID of the user who unliked the post
     */
    public void removeLike(String userId) {
        this.likes.remove(userId);
    }

    // --------------------------------------
    // Overridden Methods
    // --------------------------------------

    /**
     * Returns a string representation of the Post object.
     * @return String containing all fields of the Post
     */
    @Override
    public String toString() {
        return "Post{" +
               "id='" + id + '\'' +
               ", userId='" + userId + '\'' +
               ", userName='" + userName + '\'' +
               ", description='" + description + '\'' +
               ", mediaUrls=" + mediaUrls +
               ", likes=" + likes +
               ", createdAt=" + createdAt +
               ", updatedAt=" + updatedAt +
               '}';
    }
}