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

@RestController
@RequestMapping("/meal-plans")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class MealPlanController {
    @Autowired
    private MealPlanService mealPlanService;
    
    @Autowired
    private UserRepository userRepository;
    
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
    
    private Optional<User> getCurrentUser() {
        String email = getLoggedInUserEmail();
        return userRepository.findByEmail(email);
    }
    
    @GetMapping
    public ResponseEntity<?> getMealPlans() {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User currentUser = optUser.get();
        
        List<String> userIds = new ArrayList<>(currentUser.getFollowing());
        userIds.add(currentUser.getId());
        
        List<MealPlan> plans = mealPlanService.getFeedMealPlans(userIds);
        return ResponseEntity.ok(plans);
    }
    
    @GetMapping("/public")
    public ResponseEntity<?> getPublicMealPlans() {
        List<MealPlan> plans = mealPlanService.getPublicMealPlans();
        return ResponseEntity.ok(plans);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserMealPlans(@PathVariable String userId) {
        List<MealPlan> plans = mealPlanService.getUserMealPlans(userId);
        return ResponseEntity.ok(plans);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getMealPlanById(@PathVariable String id) {
        Optional<MealPlan> plan = mealPlanService.getMealPlanById(id);
        return plan.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createMealPlan(@RequestBody MealPlan mealPlan) {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        MealPlan created = mealPlanService.createMealPlan(mealPlan, optUser.get());
        return ResponseEntity.ok(created);
    }
    
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