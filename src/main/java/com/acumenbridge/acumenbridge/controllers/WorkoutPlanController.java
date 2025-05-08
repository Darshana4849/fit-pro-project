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

@RestController
@RequestMapping("/workout-plans")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class WorkoutPlanController {
    @Autowired
    private WorkoutPlanService workoutPlanService;
    
    @Autowired
    private UserRepository userRepository;
    
    // Helper methods from your PostController
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
    
    // Endpoints
    @GetMapping
    public ResponseEntity<?> getWorkoutPlans() {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User currentUser = optUser.get();
        
        List<String> userIds = new ArrayList<>(currentUser.getFollowing());
        userIds.add(currentUser.getId());
        
        List<WorkoutPlan> plans = workoutPlanService.getFeedWorkoutPlans(userIds);
        return ResponseEntity.ok(plans);
    }
    
    @GetMapping("/public")
    public ResponseEntity<?> getPublicWorkoutPlans() {
        List<WorkoutPlan> plans = workoutPlanService.getPublicWorkoutPlans();
        return ResponseEntity.ok(plans);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserWorkoutPlans(@PathVariable String userId) {
        List<WorkoutPlan> plans = workoutPlanService.getUserWorkoutPlans(userId);
        return ResponseEntity.ok(plans);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getWorkoutPlanById(@PathVariable String id) {
        Optional<WorkoutPlan> plan = workoutPlanService.getWorkoutPlanById(id);
        return plan.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createWorkoutPlan(@RequestBody WorkoutPlan workoutPlan) {
        Optional<User> optUser = getCurrentUser();
        if (!optUser.isPresent()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        WorkoutPlan created = workoutPlanService.createWorkoutPlan(workoutPlan, optUser.get());
        return ResponseEntity.ok(created);
    }
    
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