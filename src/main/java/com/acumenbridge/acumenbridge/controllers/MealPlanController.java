package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.models.MealPlan;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import com.acumenbridge.acumenbridge.services.MealPlanService;
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
 * Meal Plan Controller
 * 
 * Handles all meal plan-related operations including:
 * - Creating, updating, and deleting meal plans
 * - Retrieving meal plans (personal, public, and from followed users)
 * - Managing meal plan visibility and access
 */
@RestController
@RequestMapping("/meal-plans") // Base path for all meal plan endpoints
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Allow frontend requests with credentials
public class MealPlanController {

    @Autowired // Injects MealPlanService for business logic
    private MealPlanService mealPlanService;
    
    @Autowired // Injects UserRepository for user lookups
    private UserRepository userRepository;
    
    /**
     * Helper method to get the email of the currently authenticated user
     * Supports multiple authentication types:
     * - JWT tokens
     * - OAuth2 authentication
     * - Standard UserDetails
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
     * Get meal plans for the current user's feed (own plans + followed users' plans)
     * 
     * @return ResponseEntity with list of meal plans or error
     */
    @GetMapping
    public ResponseEntity<?> getMealPlans() {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User currentUser = optUser.get();
        
        // Include current user and followed users in feed
        List<String> userIds = new ArrayList<>(currentUser.getFollowing());
        userIds.add(currentUser.getId());
        
        List<MealPlan> plans = mealPlanService.getFeedMealPlans(userIds);
        return ResponseEntity.ok(plans);
    }
    
    /**
     * Get all public meal plans
     * 
     * @return ResponseEntity with list of public meal plans
     */
    @GetMapping("/public")
    public ResponseEntity<?> getPublicMealPlans() {
        List<MealPlan> plans = mealPlanService.getPublicMealPlans();
        return ResponseEntity.ok(plans);
    }
    
    /**
     * Get meal plans for a specific user
     * 
     * @param userId ID of the user whose plans to retrieve
     * @return ResponseEntity with list of user's meal plans
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserMealPlans(@PathVariable String userId) {
        List<MealPlan> plans = mealPlanService.getUserMealPlans(userId);
        return ResponseEntity.ok(plans);
    }
    
    /**
     * Get a specific meal plan by ID
     * 
     * @param id ID of the meal plan to retrieve
     * @return ResponseEntity with meal plan or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getMealPlanById(@PathVariable String id) {
        Optional<MealPlan> plan = mealPlanService.getMealPlanById(id);
        return plan.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    /**
     * Create a new meal plan
     * 
     * @param mealPlan Meal plan data from request body
     * @return ResponseEntity with created meal plan or error
     */
    @PostMapping
    public ResponseEntity<?> createMealPlan(@RequestBody MealPlan mealPlan) {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        MealPlan created = mealPlanService.createMealPlan(mealPlan, optUser.get());
        return ResponseEntity.ok(created);
    }
    
    /**
     * Update an existing meal plan
     * 
     * @param id ID of the meal plan to update
     * @param updates Updated meal plan data
     * @return ResponseEntity with updated meal plan or error
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMealPlan(
            @PathVariable String id,
            @RequestBody MealPlan updates) {
        
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        Optional<MealPlan> updated = mealPlanService.updateMealPlan(id, updates, optUser.get());
        return updated.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    /**
     * Delete a meal plan
     * 
     * @param id ID of the meal plan to delete
     * @return ResponseEntity with no content (success) or error
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMealPlan(@PathVariable String id) {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        boolean deleted = mealPlanService.deleteMealPlan(id, optUser.get());
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}