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

import java.util.Optional;
import java.util.Set;

/**
 * Like Controller
 * 
 * Handles all like-related operations for posts including:
 * - Liking posts
 * - Unliking posts
 * - Retrieving lists of users who liked a post
 */
@RestController
@RequestMapping("/posts/{postId}/likes") // Base path for like-related endpoints
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Allow frontend requests with credentials
public class LikeController {

    @Autowired // Injects PostRepository for post operations
    private PostRepository postRepository;

    @Autowired // Injects UserRepository for user lookups
    private UserRepository userRepository;

    /**
     * Helper method to get the email of the currently authenticated user
     * Supports multiple authentication types:
     * - JWT tokens
     * - OAuth2 authentication
     * - Standard UserDetails
     * 
     * @return Email of logged-in user or null if not authenticated
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
        return null;
    }

    /**
     * Helper method to get the current authenticated user entity
     * 
     * @return Optional containing the User if found, empty if not authenticated
     */
    private Optional<User> getCurrentUser() {
        String email = getLoggedInUserEmail();
        return userRepository.findByEmail(email);
    }

    /**
     * Like a post
     * 
     * @param postId ID of the post to like
     * @return ResponseEntity with updated like set or error
     */
    @PostMapping
    public ResponseEntity<?> like(@PathVariable String postId) {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Post> opt = postRepository.findById(postId);
        if (!opt.isPresent()) return ResponseEntity.notFound().build();

        Post post = opt.get();
        String uid = optUser.get().getId();

        // Add like if not already present
        Set<String> likes = post.getLikes();
        if (!likes.contains(uid)) {
            likes.add(uid);
            post.setLikes(likes);
            postRepository.save(post);
        }
        return ResponseEntity.ok(likes);
    }

    /**
     * Unlike a post
     * 
     * @param postId ID of the post to unlike
     * @return ResponseEntity with updated like set or error
     */
    @DeleteMapping
    public ResponseEntity<?> unlike(@PathVariable String postId) {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Post> opt = postRepository.findById(postId);
        if (!opt.isPresent()) return ResponseEntity.notFound().build();

        Post post = opt.get();
        String uid = optUser.get().getId();

        // Remove like if present
        Set<String> likes = post.getLikes();
        if (likes.contains(uid)) {
            likes.remove(uid);
            post.setLikes(likes);
            postRepository.save(post);
        }
        return ResponseEntity.ok(likes);
    }

    /**
     * Get list of users who liked a post
     * 
     * @param postId ID of the post to check
     * @return ResponseEntity with like set or error
     */
    @GetMapping
    public ResponseEntity<?> listLikes(@PathVariable String postId) {
        Optional<Post> opt = postRepository.findById(postId);
        if (!opt.isPresent()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(opt.get().getLikes());
    }
}