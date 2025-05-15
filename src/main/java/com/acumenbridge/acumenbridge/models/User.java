// src/main/java/com/acumenbridge/acumenbridge/models/User.java
package com.acumenbridge.acumenbridge.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;

/**
 * Represents a User entity in the application.
 * Stores user profile information, authentication details, and social connections.
 * Persisted in MongoDB as documents in the "users" collection.
 */
@Document(collection = "users") // Specifies the MongoDB collection name
public class User {
    @Id // Marks this field as the document identifier
    private String id; // Unique identifier for the user

    private String name;     // User's display name
    private String email;    // User's email address (used for authentication)
    private String password; // Hashed password for security
    private String avatar;   // URL or file path to user's profile picture
    private String banner;   // URL or file path to user's profile banner image

    // Social connection fields
    private List<String> following = new ArrayList<>(); // List of user IDs this user follows
    private List<String> followers = new ArrayList<>(); // List of user IDs following this user

    /**
     * Default constructor required by Spring Data.
     */
    public User() {}

    /**
     * Convenience constructor for creating a new User with basic profile information.
     * 
     * @param name     User's display name
     * @param email    User's email address
     * @param password Hashed password
     * @param avatar   URL/path to profile picture
     * @param banner   URL/path to profile banner
     */
    public User(String name, String email, String password, String avatar, String banner) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
        this.banner = banner;
    }

    // --------------------------------------
    // Standard Getters and Setters
    // --------------------------------------

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getBanner() { return banner; }
    public void setBanner(String banner) { this.banner = banner; }

    // --------------------------------------
    // Social Connection Getters and Setters
    // --------------------------------------

    public List<String> getFollowing() { return following; }
    public void setFollowing(List<String> following) { this.following = following; }

    public List<String> getFollowers() { return followers; }
    public void setFollowers(List<String> followers) { this.followers = followers; }
}