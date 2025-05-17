package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import com.acumenbridge.acumenbridge.services.EmailService;
import com.acumenbridge.acumenbridge.services.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Password Controller
 * 
 * Handles password reset functionality including:
 * - Generating and sending password reset links
 * - Validating reset tokens
 * - Updating user passwords
 */
@RestController
@RequestMapping("/auth") // Base path for authentication-related endpoints
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Allow frontend requests with credentials
public class PasswordController {

    @Autowired // Injects UserRepository for database operations
    private UserRepository userRepository;

    @Autowired // Injects EmailService for sending reset emails
    private EmailService emailService;

    @Autowired // Injects PasswordResetService for token management
    private PasswordResetService passwordResetService;

    // Password encoder for securely hashing new passwords
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Request a password reset link
     * 
     * @param request Contains the user's email address
     * @return ResponseEntity with success/error message
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody EmailRequest request) {
        String email = request.getEmail();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Email not found");
        }
        
        // Generate a secure reset token
        String token = passwordResetService.createResetToken(email);
        
        // Construct the reset link (frontend URL)
        String resetLink = "http://localhost:5173/reset-password/" + token + "?email=" + email;
        
        // Send the reset link via email
        emailService.sendPasswordResetEmail(email, resetLink);
        
        return ResponseEntity.ok("Password reset link sent to your email");
    }

    /**
     * Reset user password using a valid token
     * 
     * @param request Contains email, token, and new password
     * @return ResponseEntity with success/error message
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        String email = request.getEmail();
        String token = request.getToken();
        String newPassword = request.getNewPassword();

        // Validate required fields
        if (email == null || token == null || newPassword == null ||
            email.isEmpty() || token.isEmpty() || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("Email, token, and new password are required");
        }

        // Validate the reset token
        if (!passwordResetService.validateResetToken(email, token)) {
            return ResponseEntity.badRequest().body("Invalid or expired reset token");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
        User user = userOpt.get();
        // Update user's password with hashed version
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Remove the used reset token
        passwordResetService.removeResetToken(email);
        
        return ResponseEntity.ok("Password has been reset successfully");
    }
}

/**
 * Request DTO for reset password operation
 */
class ResetPasswordRequest {
    private String email;
    private String token;
    private String newPassword;
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}