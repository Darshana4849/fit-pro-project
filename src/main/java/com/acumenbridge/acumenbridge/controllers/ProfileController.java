package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

/**
 * Profile Controller
 * 
 * Handles user profile-related operations including:
 * - Retrieving profile information
 * - Updating profile details
 * - Managing profile pictures and banners
 * - Deleting user accounts
 */
@RestController
@RequestMapping(value = "/auth", produces = "application/json") // Base path for authentication endpoints
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Allow frontend requests with credentials
public class ProfileController {

    @Autowired // Injects UserRepository for database operations
    private UserRepository userRepository;
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // For password hashing

    /**
     * Get the current authenticated user's profile
     * 
     * @return ResponseEntity with user profile or error message
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = null;

        // Extract email based on authentication type
        if (principal instanceof Jwt) {
            email = ((Jwt) principal).getSubject();
        } else if (principal instanceof DefaultOAuth2User) {
            email = (String) ((DefaultOAuth2User) principal).getAttributes().get("email");
        } else if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }

        System.out.println("Extracted email: " + email);

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            // For social logins without full profile data, create a new user record
            if (principal instanceof DefaultOAuth2User) {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(email); // Default name; prompt user to update later
                newUser = userRepository.save(newUser);
                return ResponseEntity.ok(newUser);
            } else {
                return ResponseEntity.badRequest().body("User not found");
            }
        }
    }

    /**
     * Get any user's profile by ID (publicly accessible)
     * 
     * @param id The user ID to look up
     * @return ResponseEntity with user profile or not found error
     */
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfileById(@PathVariable("id") String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    /**
     * Update the current user's profile information
     * 
     * @param name Updated name
     * @param oldPassword Current password for verification (required when changing password)
     * @param newPassword New password (optional)
     * @param avatar New avatar image file (optional)
     * @param banner New banner image file (optional)
     * @return ResponseEntity with updated user profile or error message
     */
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(
            @RequestParam("name") String name,
            @RequestParam(value = "oldPassword", required = false) String oldPassword,
            @RequestParam(value = "newPassword", required = false) String newPassword,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam(value = "banner", required = false) MultipartFile banner) {

        // Get authenticated user's email
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = null;
        if (principal instanceof Jwt) {
            email = ((Jwt) principal).getSubject();
        } else if (principal instanceof DefaultOAuth2User) {
            email = (String) ((DefaultOAuth2User) principal).getAttributes().get("email");
        } else if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        user.setName(name);

        // Handle password change if new password provided
        if (newPassword != null && !newPassword.isEmpty()) {
            if (oldPassword == null || oldPassword.isEmpty() || !passwordEncoder.matches(oldPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body("Old password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        // Handle avatar upload
        if (avatar != null && !avatar.isEmpty()) {
            try {
                String avatarFileName = "avatar_" + user.getId() + "_" + avatar.getOriginalFilename();
                Path avatarPath = Paths.get("uploads/avatars/" + avatarFileName);
                Files.createDirectories(avatarPath.getParent());
                Files.write(avatarPath, avatar.getBytes());
                // Update avatar URL (adjust based on your hosting configuration)
                user.setAvatar("http://localhost:8080/uploads/avatars/" + avatarFileName);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving avatar");
            }
        }

        // Handle banner upload
        if (banner != null && !banner.isEmpty()) {
            try {
                String bannerFileName = "banner_" + user.getId() + "_" + banner.getOriginalFilename();
                Path bannerPath = Paths.get("uploads/banners/" + bannerFileName);
                Files.createDirectories(bannerPath.getParent());
                Files.write(bannerPath, banner.getBytes());
                user.setBanner("http://localhost:8080/uploads/banners/" + bannerFileName);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving banner");
            }
        }

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    /**
     * Delete the current user's profile
     * 
     * @return ResponseEntity with success message or error
     */
    @DeleteMapping("/delete-profile")
    public ResponseEntity<?> deleteProfile() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = null;

        // Extract email based on authentication type
        if (principal instanceof Jwt) {
            email = ((Jwt) principal).getSubject();
        } else if (principal instanceof DefaultOAuth2User) {
            email = (String) ((DefaultOAuth2User) principal).getAttributes().get("email");
        } else if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        userRepository.delete(userOpt.get());
        return ResponseEntity.ok("User profile deleted successfully");
    }
}