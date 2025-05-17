package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Connection Controller
 * 
 * Handles all user connection-related operations including:
 * - Following/unfollowing users
 * - Retrieving followed users
 * - Getting user suggestions
 * - Managing follower/following relationships
 */
@RestController
@RequestMapping(value = "/auth", produces = "application/json") // Base path for authentication-related endpoints
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Allow frontend requests with credentials
public class ConnectionController {

    @Autowired // Injects UserRepository for database operations
    private UserRepository userRepository;

    /**
     * Helper method to extract the logged-in user's email from security context
     * Supports multiple authentication types:
     * - JWT tokens
     * - OAuth2 authentication
     * - Standard UserDetails
     * 
     * @return Email of the authenticated user or principal string if unknown type
     */
    private String getLoggedInUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Jwt) {
            return ((Jwt) principal).getSubject();
        } else if (principal instanceof DefaultOAuth2User) {
            return (String) ((DefaultOAuth2User) principal).getAttributes().get("email");
        } else if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return principal.toString();
    }

    /**
     * Get the list of users the current user is following
     * 
     * @return ResponseEntity with list of followed users or error message
     */
    @GetMapping("/following")
    public ResponseEntity<?> getFollowing() {
        String email = getLoggedInUserEmail();
        Optional<User> optUser = userRepository.findByEmail(email);
        if (!optUser.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User currentUser = optUser.get();
        List<String> followingIds = currentUser.getFollowing();
        // Handle null following list
        if (followingIds == null) {
            followingIds = new ArrayList<>();
        }
        List<User> followingUsers = userRepository.findAllById(followingIds);
        return ResponseEntity.ok(followingUsers);
    }

    /**
     * Get suggested users to follow (users not already followed)
     * 
     * @return ResponseEntity with list of suggested users or error message
     */
    @GetMapping("/suggestions")
    public ResponseEntity<?> getSuggestions() {
        String email = getLoggedInUserEmail();
        Optional<User> optUser = userRepository.findByEmail(email);
        if (!optUser.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User currentUser = optUser.get();
        
        // Users to exclude from suggestions (self + already followed)
        List<String> excludeIds = new ArrayList<>();
        excludeIds.add(currentUser.getId());
        if (currentUser.getFollowing() != null) {
            excludeIds.addAll(currentUser.getFollowing());
        }
        
        // Get all users and filter out excluded ones
        List<User> allUsers = userRepository.findAll();
        List<User> suggestions = allUsers.stream()
                .filter(u -> !excludeIds.contains(u.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(suggestions);
    }

    /**
     * Follow a user
     * 
     * @param targetUserId ID of the user to follow
     * @return ResponseEntity with success message or error
     */
    @PostMapping("/follow/{targetUserId}")
    public ResponseEntity<?> followUser(@PathVariable String targetUserId) {
        String email = getLoggedInUserEmail();
        Optional<User> optCurrent = userRepository.findByEmail(email);
        Optional<User> optTarget = userRepository.findById(targetUserId);

        if (!optCurrent.isPresent() || !optTarget.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User currentUser = optCurrent.get();
        User targetUser = optTarget.get();

        // Initialize lists if null
        if (currentUser.getFollowing() == null) {
            currentUser.setFollowing(new ArrayList<>());
        }
        if (targetUser.getFollowers() == null) {
            targetUser.setFollowers(new ArrayList<>());
        }

        // Add follow relationship if not already exists
        if (!currentUser.getFollowing().contains(targetUserId)) {
            currentUser.getFollowing().add(targetUserId);
        }
        if (!targetUser.getFollowers().contains(currentUser.getId())) {
            targetUser.getFollowers().add(currentUser.getId());
        }

        userRepository.save(currentUser);
        userRepository.save(targetUser);
        return ResponseEntity.ok("Followed user: " + targetUser.getName());
    }

    /**
     * Unfollow a user
     * 
     * @param targetUserId ID of the user to unfollow
     * @return ResponseEntity with success message or error
     */
    @PostMapping("/unfollow/{targetUserId}")
    public ResponseEntity<?> unfollowUser(@PathVariable String targetUserId) {
        String email = getLoggedInUserEmail();
        Optional<User> optCurrent = userRepository.findByEmail(email);
        Optional<User> optTarget = userRepository.findById(targetUserId);

        if (!optCurrent.isPresent() || !optTarget.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User currentUser = optCurrent.get();
        User targetUser = optTarget.get();

        // Remove follow relationship if exists
        if (currentUser.getFollowing() != null) {
            currentUser.getFollowing().remove(targetUserId);
        }
        if (targetUser.getFollowers() != null) {
            targetUser.getFollowers().remove(currentUser.getId());
        }

        userRepository.save(currentUser);
        userRepository.save(targetUser);
        return ResponseEntity.ok("Unfollowed user: " + targetUser.getName());
    }

    /**
     * Get both followers and following lists for the current user
     * 
     * @return ResponseEntity with ConnectionsResponse containing both lists
     */
    @GetMapping("/connections")
    public ResponseEntity<?> getConnections() {
        String email = getLoggedInUserEmail();
        Optional<User> optUser = userRepository.findByEmail(email);
        if (!optUser.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User currentUser = optUser.get();
        return ResponseEntity.ok(new ConnectionsResponse(currentUser.getFollowers(), currentUser.getFollowing()));
    }

    /**
     * Inner class for connections response
     * Used for JSON serialization of both followers and following lists
     */
    public static class ConnectionsResponse {
        private List<String> followers;
        private List<String> following;

        public ConnectionsResponse(List<String> followers, List<String> following) {
            this.followers = followers;
            this.following = following;
        }

        public List<String> getFollowers() {
            return followers;
        }

        public void setFollowers(List<String> followers) {
            this.followers = followers;
        }

        public List<String> getFollowing() {
            return following;
        }

        public void setFollowing(List<String> following) {
            this.following = following;
        }
    }
}