package com.acumenbridge.acumenbridge.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

/**
 * Logout Controller
 * 
 * Handles user logout functionality by invalidating the current authentication session.
 * Uses Spring Security's logout handler to properly clean up security context.
 */
@RestController // Marks this class as a controller that returns response bodies
@RequestMapping("/auth") // Base path for authentication-related endpoints
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Allow frontend requests with credentials
public class LogoutController {

    /**
     * Handles user logout requests
     * 
     * Invalidates the current authentication session using Spring Security's
     * logout handler. Clears the security context and any associated cookies.
     * 
     * @param request The HTTP request object
     * @param response The HTTP response object
     * @return ResponseEntity with logout success message
     */
    @PostMapping("/logout") // Maps HTTP POST requests to /auth/logout
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        // Get current authentication from request
        Authentication auth = (Authentication) request.getUserPrincipal();
        
        // If user is authenticated, perform logout
        if (auth != null) {
            // Use Spring Security's logout handler to properly clean up
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        
        // Return success response
        return ResponseEntity.ok("Logout successful");
    }
}