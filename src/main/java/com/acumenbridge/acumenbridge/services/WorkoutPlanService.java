// src/main/java/com/acumenbridge/acumenbridge/services/WorkoutPlanService.java
package com.acumenbridge.acumenbridge.services;

import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.models.WorkoutPlan;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import com.acumenbridge.acumenbridge.repositories.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Service class for managing workout plan operations including creation,
 * retrieval, updating and deletion of workout plans.
 */
@Service
public class WorkoutPlanService {
    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Retrieves all workout plans for a specific user, ordered by creation date (newest first).
     * @param userId The ID of the user whose workout plans to retrieve
     * @return List of workout plans belonging to the user
     */
    public List<WorkoutPlan> getUserWorkoutPlans(String userId) {
        return workoutPlanRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    /**
     * Retrieves workout plans for multiple users (feed), ordered by creation date (newest first).
     * @param userIds List of user IDs whose workout plans to retrieve
     * @return List of workout plans from the specified users
     */
    public List<WorkoutPlan> getFeedWorkoutPlans(List<String> userIds) {
        return workoutPlanRepository.findByUserIdInOrderByCreatedAtDesc(userIds);
    }
    
    /**
     * Retrieves all public workout plans, ordered by creation date (newest first).
     * @return List of public workout plans
     */
    public List<WorkoutPlan> getPublicWorkoutPlans() {
        return workoutPlanRepository.findByIsPublicTrueOrderByCreatedAtDesc();
    }
    
    /**
     * Retrieves a specific workout plan by its ID.
     * @param id The ID of the workout plan to retrieve
     * @return Optional containing the workout plan if found
     */
    public Optional<WorkoutPlan> getWorkoutPlanById(String id) {
        return workoutPlanRepository.findById(id);
    }
    
    /**
     * Creates a new workout plan for the specified user.
     * @param workoutPlan The workout plan to create
     * @param user The user creating the workout plan
     * @return The created workout plan
     */
    public WorkoutPlan createWorkoutPlan(WorkoutPlan workoutPlan, User user) {
        workoutPlan.setUserId(user.getId());
        workoutPlan.setUserName(user.getName());
        Instant now = Instant.now();
        workoutPlan.setCreatedAt(now);
        workoutPlan.setUpdatedAt(now);
        return workoutPlanRepository.save(workoutPlan);
    }
    
    /**
     * Updates an existing workout plan if it belongs to the specified user.
     * @param id The ID of the workout plan to update
     * @param updates The updated workout plan data
     * @param user The user attempting the update
     * @return Optional containing the updated workout plan if successful
     */
    public Optional<WorkoutPlan> updateWorkoutPlan(String id, WorkoutPlan updates, User user) {
        return workoutPlanRepository.findById(id)
            .map(existing -> {
                if (!existing.getUserId().equals(user.getId())) {
                    return null; // Or throw an exception
                }
                
                existing.setTitle(updates.getTitle());
                existing.setDescription(updates.getDescription());
                existing.setDifficulty(updates.getDifficulty());
                existing.setDurationMinutes(updates.getDurationMinutes());
                existing.setTargetMuscles(updates.getTargetMuscles());
                existing.setExercises(updates.getExercises());
                existing.setPublic(updates.isPublic());
                existing.setUpdatedAt(Instant.now());
                
                return workoutPlanRepository.save(existing);
            });
    }
    
    /**
     * Deletes a workout plan if it belongs to the specified user.
     * @param id The ID of the workout plan to delete
     * @param user The user attempting the deletion
     * @return true if deletion was successful, false otherwise
     */
    public boolean deleteWorkoutPlan(String id, User user) {
        return workoutPlanRepository.findById(id)
            .map(workoutPlan -> {
                if (!workoutPlan.getUserId().equals(user.getId())) {
                    return false;
                }
                workoutPlanRepository.deleteById(id);
                return true;
            })
            .orElse(false);
    }
}