package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Search Controller
 * 
 * Handles user search functionality by name or email.
 * Provides an endpoint for finding users based on partial matches.
 */
@RestController
@RequestMapping("/auth") // Base path for authentication-related endpoints
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Allow frontend requests with credentials
public class SearchController {

    @Autowired // Injects UserRepository for database operations
    private UserRepository userRepository;

    /**
     * Search for users by name or email (case-insensitive partial match)
     * 
     * @param query The search string to match against user names or emails
     * @return ResponseEntity containing list of matching users or empty list if no matches found
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam("query") String query) {
        // Search both name and email fields for partial matches (case-insensitive)
        List<User> results = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
        return ResponseEntity.ok(results);
    }
}