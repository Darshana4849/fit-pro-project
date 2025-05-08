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

@Service
public class MealPlanService {
    @Autowired
    private MealPlanRepository mealPlanRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<MealPlan> getUserMealPlans(String userId) {
        return mealPlanRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<MealPlan> getFeedMealPlans(List<String> userIds) {
        return mealPlanRepository.findByUserIdInOrderByCreatedAtDesc(userIds);
    }
    
    public List<MealPlan> getPublicMealPlans() {
        return mealPlanRepository.findByIsPublicTrueOrderByCreatedAtDesc();
    }
    
    public Optional<MealPlan> getMealPlanById(String id) {
        return mealPlanRepository.findById(id);
    }
    
    public MealPlan createMealPlan(MealPlan mealPlan, User user) {
        mealPlan.setUserId(user.getId());
        mealPlan.setUserName(user.getName());
        Instant now = Instant.now();
        mealPlan.setCreatedAt(now);
        mealPlan.setUpdatedAt(now);
        return mealPlanRepository.save(mealPlan);
    }
    
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