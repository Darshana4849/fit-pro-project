// src/main/java/com/acumenbridge/acumenbridge/services/MealPlanService.java
package com.acumenbridge.acumenbridge.services;

import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.models.MealPlan;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import com.acumenbridge.acumenbridge.repositories.MealPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Service class for handling meal plan operations including creation, retrieval,
 * updating and deletion of meal plans.
 */
@Service
public class MealPlanService {
    @Autowired
    private MealPlanRepository mealPlanRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Retrieves all meal plans for a specific user, ordered by creation date (newest first)
     * @param userId The ID of the user whose meal plans to retrieve
     * @return List of meal plans belonging to the user
     */
    public List<MealPlan> getUserMealPlans(String userId) {
        return mealPlanRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    /**
     * Retrieves meal plans for multiple users (feed), ordered by creation date (newest first)
     * @param userIds List of user IDs whose meal plans to retrieve
     * @return List of meal plans from the specified users
     */
    public List<MealPlan> getFeedMealPlans(List<String> userIds) {
        return mealPlanRepository.findByUserIdInOrderByCreatedAtDesc(userIds);
    }
    
    /**
     * Retrieves all public meal plans, ordered by creation date (newest first)
     * @return List of public meal plans
     */
    public List<MealPlan> getPublicMealPlans() {
        return mealPlanRepository.findByIsPublicTrueOrderByCreatedAtDesc();
    }
    
    /**
     * Retrieves a specific meal plan by its ID
     * @param id The ID of the meal plan to retrieve
     * @return Optional containing the meal plan if found
     */
    public Optional<MealPlan> getMealPlanById(String id) {
        return mealPlanRepository.findById(id);
    }
    
    /**
     * Creates a new meal plan for the specified user
     * @param mealPlan The meal plan to create
     * @param user The user creating the meal plan
     * @return The created meal plan
     */
    public MealPlan createMealPlan(MealPlan mealPlan, User user) {
        mealPlan.setUserId(user.getId());
        mealPlan.setUserName(user.getName());
        Instant now = Instant.now();
        mealPlan.setCreatedAt(now);
        mealPlan.setUpdatedAt(now);
        return mealPlanRepository.save(mealPlan);
    }
    
    /**
     * Updates an existing meal plan if it belongs to the specified user
     * @param id The ID of the meal plan to update
     * @param updates The updated meal plan data
     * @param user The user attempting the update
     * @return Optional containing the updated meal plan if successful
     */
    public Optional<MealPlan> updateMealPlan(String id, MealPlan updates, User user) {
        return mealPlanRepository.findById(id)
            .map(existing -> {
                if (!existing.getUserId().equals(user.getId())) {
                    return null; // Or throw an exception
                }
                
                existing.setTitle(updates.getTitle());
                existing.setDescription(updates.getDescription());
                existing.setDietType(updates.getDietType());
                existing.setDurationDays(updates.getDurationDays());
                existing.setMeals(updates.getMeals());
                existing.setPublic(updates.isPublic());
                existing.setUpdatedAt(Instant.now());
                
                return mealPlanRepository.save(existing);
            });
    }
    
    /**
     * Deletes a meal plan if it belongs to the specified user
     * @param id The ID of the meal plan to delete
     * @param user The user attempting the deletion
     * @return true if deletion was successful, false otherwise
     */
    public boolean deleteMealPlan(String id, User user) {
        return mealPlanRepository.findById(id)
            .map(mealPlan -> {
                if (!mealPlan.getUserId().equals(user.getId())) {
                    return false;
                }
                mealPlanRepository.deleteById(id);
                return true;
            })
            .orElse(false);
    }
}