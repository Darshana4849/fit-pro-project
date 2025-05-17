package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.models.WorkoutPlan;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import com.acumenbridge.acumenbridge.services.WorkoutPlanService;
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

/**
 * Workout Plan Controller
 * 
 * Handles all workout plan-related operations including:
 * - Creating, updating, and deleting workout plans
 * - Retrieving workout plans (personal, public, and from followed users)
 * - Managing workout plan visibility and access
 */
@RestController
@RequestMapping("/workout-plans") // Base path for all workout plan endpoints
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Allow frontend requests with credentials
public class WorkoutPlanController {

    @Autowired // Service for workout plan business logic
    private WorkoutPlanService workoutPlanService;
    
    @Autowired // Repository for user data access
    private UserRepository userRepository;
    
    /**
     * Helper method to get the email of the currently authenticated user
     * Supports multiple authentication types: JWT, OAuth2, and UserDetails
     * 
     * @return Email of logged-in user or principal string if unknown type
     */
    private String getLoggedInUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Jwt) {
            return ((Jwt) principal).getSubject();
        } else if (principal instanceof DefaultOAuth2User) {
            return (String) ((DefaultOAuth2User) principal).getAttributes().get("email");
        } else if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
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
     * Get workout plans for the current user's feed (own plans + followed users' plans)
     * 
     * @return ResponseEntity with list of workout plans or unauthorized status
     */
    @GetMapping
    public ResponseEntity<?> getWorkoutPlans() {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User currentUser = optUser.get();
        
        // Include current user and followed users in feed
        List<String> userIds = new ArrayList<>(currentUser.getFollowing());
        userIds.add(currentUser.getId());
        
        List<WorkoutPlan> plans = workoutPlanService.getFeedWorkoutPlans(userIds);
        return ResponseEntity.ok(plans);
    }
    
    /**
     * Get all public workout plans
     * 
     * @return ResponseEntity with list of public workout plans
     */
    @GetMapping("/public")
    public ResponseEntity<?> getPublicWorkoutPlans() {
        List<WorkoutPlan> plans = workoutPlanService.getPublicWorkoutPlans();
        return ResponseEntity.ok(plans);
    }
    
    /**
     * Get workout plans for a specific user
     * 
     * @param userId ID of the user whose plans to retrieve
     * @return ResponseEntity with list of user's workout plans
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserWorkoutPlans(@PathVariable String userId) {
        List<WorkoutPlan> plans = workoutPlanService.getUserWorkoutPlans(userId);
        return ResponseEntity.ok(plans);
    }
    
    /**
     * Get a specific workout plan by ID
     * 
     * @param id ID of the workout plan to retrieve
     * @return ResponseEntity with workout plan if found, or not found status
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getWorkoutPlanById(@PathVariable String id) {
        Optional<WorkoutPlan> plan = workoutPlanService.getWorkoutPlanById(id);
        return plan.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    /**
     * Create a new workout plan
     * 
     * @param workoutPlan Workout plan data from request body
     * @return ResponseEntity with created workout plan or unauthorized status
     */
    @PostMapping
    public ResponseEntity<?> createWorkoutPlan(@RequestBody WorkoutPlan workoutPlan) {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        WorkoutPlan created = workoutPlanService.createWorkoutPlan(workoutPlan, optUser.get());
        return ResponseEntity.ok(created);
    }
    
    /**
     * Update an existing workout plan
     * 
     * @param id ID of the workout plan to update
     * @param updates Updated workout plan data
     * @return ResponseEntity with updated workout plan or error status
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateWorkoutPlan(
            @PathVariable String id,
            @RequestBody WorkoutPlan updates) {
        
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        Optional<WorkoutPlan> updated = workoutPlanService.updateWorkoutPlan(id, updates, optUser.get());
        return updated.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    /**
     * Delete a workout plan
     * 
     * @param id ID of the workout plan to delete
     * @return ResponseEntity with no content (success) or error status
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkoutPlan(@PathVariable String id) {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        boolean deleted = workoutPlanService.deleteWorkoutPlan(id, optUser.get());
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}