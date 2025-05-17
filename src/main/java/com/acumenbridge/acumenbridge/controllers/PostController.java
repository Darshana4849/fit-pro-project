package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.Post;
import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.repositories.PostRepository;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for handling post-related operations including creation,
 * retrieval, update, and deletion of posts.
 * Supports cross-origin requests from the frontend development server.
 */
@RestController
@RequestMapping("/posts") // Base path for all post endpoints
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Allow frontend requests with credentials
public class PostController {

    @Autowired // Repository for post data operations
    private PostRepository postRepository;

    @Autowired // Repository for user data operations
    private UserRepository userRepository;

    /**
     * Helper method to extract the current user's email from the security context.
     * Supports multiple authentication types: JWT, OAuth2, and UserDetails.
     * 
     * @return String representing the logged-in user's email or principal name
     */
    private String getLoggedInUserEmail() {
        Object principal = SecurityContextHolder.getContext()
                                              .getAuthentication()
                                              .getPrincipal();

        if (principal instanceof Jwt) {
            return ((Jwt) principal).getSubject();
        } else if (principal instanceof DefaultOAuth2User) {
            return (String) ((DefaultOAuth2User) principal)
                               .getAttributes()
                               .get("email");
        } else if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    /**
     * Helper method to load the current User entity from the database.
     * 
     * @return Optional containing the current User if found, empty otherwise
     */
    private Optional<User> getCurrentUser() {
        String email = getLoggedInUserEmail();
        return userRepository.findByEmail(email);
    }

    /**
     * Create a new post by the logged-in user.
     * 
     * @param post The post data to be created
     * @return ResponseEntity with the created post or unauthorized status
     */
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User currentUser = optUser.get();

        // Set post metadata
        Instant now = Instant.now();
        post.setUserId(currentUser.getId());
        post.setUserName(currentUser.getName());
        post.setCreatedAt(now);
        post.setUpdatedAt(now);

        Post saved = postRepository.save(post);
        return ResponseEntity.ok(saved);
    }

    /**
     * Get a feed of posts including the current user's posts and those of users they follow.
     * Posts are ordered by creation date (newest first).
     * 
     * @return ResponseEntity with the feed posts or unauthorized status
     */
    @GetMapping
    public ResponseEntity<?> getFeed() {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User currentUser = optUser.get();

        // Build list of IDs: themselves + whoever they follow
        List<String> userIds = new ArrayList<>(currentUser.getFollowing());
        userIds.add(currentUser.getId());

        List<Post> feed = postRepository.findByUserIdInOrderByCreatedAtDesc(userIds);
        return ResponseEntity.ok(feed);
    }

    /**
     * Get all posts by a specific user (for profile pages), ordered by creation date (newest first).
     * 
     * @param userId The ID of the user whose posts to retrieve
     * @return ResponseEntity with the user's posts
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPostsByUser(@PathVariable String userId) {
        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(posts);
    }

    /**
     * Get a single post by its ID.
     * 
     * @param id The ID of the post to retrieve
     * @return ResponseEntity with the post if found, or not found status
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable String id) {
        Optional<Post> opt = postRepository.findById(id);
        return opt.map(ResponseEntity::ok)
                 .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Update a post's description and media URLs. Only the post owner can update.
     * 
     * @param id The ID of the post to update
     * @param updates The post data containing the updates
     * @return ResponseEntity with the updated post, or appropriate error status
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable String id,
            @RequestBody Post updates) {

        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String currentUserId = optUser.get().getId();

        Optional<Post> optPost = postRepository.findById(id);
        if (!optPost.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Post existing = optPost.get();
        
        // Verify current user is the post owner
        if (!existing.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        // Update post fields
        existing.setDescription(updates.getDescription());
        existing.setMediaUrls(updates.getMediaUrls());
        existing.setUpdatedAt(Instant.now());

        Post saved = postRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    /**
     * Delete a post. Only the post owner can delete.
     * 
     * @param id The ID of the post to delete
     * @return ResponseEntity with no content if successful, or appropriate error status
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String currentUserId = optUser.get().getId();

        Optional<Post> optPost = postRepository.findById(id);
        if (!optPost.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Post existing = optPost.get();
        
        // Verify current user is the post owner
        if (!existing.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        postRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}