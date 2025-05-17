package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.Comment;
import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.repositories.CommentRepository;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Comment Controller
 * 
 * Handles all comment-related operations including:
 * - Creating comments on posts
 * - Retrieving comments for a post
 * - Editing existing comments
 * - Deleting comments
 * 
 * Includes proper authorization checks to ensure users can only modify their own comments.
 */
@RestController
@RequestMapping("/comments") // Base path for all comment endpoints
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Allow frontend requests with credentials
public class CommentController {

    @Autowired // Injects CommentRepository for database operations
    private CommentRepository commentRepo;
    
    @Autowired // Injects UserRepository for user lookups
    private UserRepository userRepo;

    /**
     * Helper method to get the email of the currently authenticated user
     * Supports multiple authentication types:
     * - JWT tokens
     * - OAuth2 authentication
     * - Standard UserDetails
     * 
     * @return Email of logged-in user or null if not authenticated
     */
    private String getLoggedInEmail() {
        Object p = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (p instanceof Jwt)               return ((Jwt)p).getSubject();
        else if (p instanceof DefaultOAuth2User) return (String)((DefaultOAuth2User)p).getAttributes().get("email");
        else if (p instanceof UserDetails)   return ((UserDetails)p).getUsername();
        else                                 return null;
    }

    /**
     * Helper method to get the current authenticated user entity
     * 
     * @return Optional containing the User if found, empty if not authenticated
     */
    private Optional<User> getCurrentUser() {
        String email = getLoggedInEmail();
        return email == null ? Optional.empty() : userRepo.findByEmail(email);
    }

    /**
     * Create a new comment on a post
     * 
     * @param postId ID of the post to comment on
     * @param incoming Comment content from request body
     * @return ResponseEntity with the created comment or error
     */
    @PostMapping("/post/{postId}")
    public ResponseEntity<?> addComment(
            @PathVariable String postId,
            @RequestBody Comment incoming
    ) {
        Optional<User> u = getCurrentUser();
        if (u.isEmpty()) return ResponseEntity.status(401).body("Unauthorized");
        
        // Create new comment with author info and timestamps
        Comment c = new Comment();
        c.setPostId(postId);
        c.setAuthorId(u.get().getId());
        c.setAuthorName(u.get().getName());
        c.setText(incoming.getText());
        Instant now = Instant.now();
        c.setCreatedAt(now);
        c.setUpdatedAt(now);
        
        Comment saved = commentRepo.save(c);
        return ResponseEntity.ok(saved);
    }

    /**
     * Get all comments for a specific post
     * 
     * @param postId ID of the post to get comments for
     * @return ResponseEntity with list of comments (ordered by creation time)
     */
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> listByPost(@PathVariable String postId) {
        return ResponseEntity.ok(
            commentRepo.findByPostIdOrderByCreatedAtAsc(postId)
        );
    }

    /**
     * Edit an existing comment
     * Only the original author can edit their comment
     * 
     * @param id ID of the comment to edit
     * @param updates New comment content from request body
     * @return ResponseEntity with updated comment or error
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> editComment(
            @PathVariable String id,
            @RequestBody Comment updates
    ) {
        Optional<User> u = getCurrentUser();
        if (u.isEmpty()) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Comment> oc = commentRepo.findById(id);
        if (oc.isEmpty()) return ResponseEntity.notFound().build();

        Comment existing = oc.get();
        // Verify current user is the comment author
        if (!existing.getAuthorId().equals(u.get().getId())) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        
        // Update comment text and modification timestamp
        existing.setText(updates.getText());
        existing.setUpdatedAt(Instant.now());
        return ResponseEntity.ok(commentRepo.save(existing));
    }

    /**
     * Delete a comment
     * Only the original author can delete their comment
     * (Could be extended to allow post owners to delete comments)
     * 
     * @param id ID of the comment to delete
     * @return ResponseEntity with no content or error
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id) {
        Optional<User> u = getCurrentUser();
        if (u.isEmpty()) return ResponseEntity.status(401).body("Unauthorized");

        Optional<Comment> oc = commentRepo.findById(id);
        if (oc.isEmpty()) return ResponseEntity.notFound().build();
        Comment existing = oc.get();

        boolean isAuthor = existing.getAuthorId().equals(u.get().getId());
        boolean isPostOwner = false;
        // Note: Could implement post owner check here by loading the Post and comparing userId

        if (!isAuthor && !isPostOwner) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        commentRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}