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

@Service
public class WorkoutPlanService {
    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<WorkoutPlan> getUserWorkoutPlans(String userId) {
        return workoutPlanRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<WorkoutPlan> getFeedWorkoutPlans(List<String> userIds) {
        return workoutPlanRepository.findByUserIdInOrderByCreatedAtDesc(userIds);
    }
    
    public List<WorkoutPlan> getPublicWorkoutPlans() {
        return workoutPlanRepository.findByIsPublicTrueOrderByCreatedAtDesc();
    }
    
    public Optional<WorkoutPlan> getWorkoutPlanById(String id) {
        return workoutPlanRepository.findById(id);
    }
    
    public WorkoutPlan createWorkoutPlan(WorkoutPlan workoutPlan, User user) {
        workoutPlan.setUserId(user.getId());
        workoutPlan.setUserName(user.getName());
        Instant now = Instant.now();
        workoutPlan.setCreatedAt(now);
        workoutPlan.setUpdatedAt(now);
        return workoutPlanRepository.save(workoutPlan);
    }
    
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