package com.acumenbridge.acumenbridge.repositories;

import com.acumenbridge.acumenbridge.models.WorkoutPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutPlanRepository extends MongoRepository<WorkoutPlan, String> {
    List<WorkoutPlan> findByUserIdOrderByCreatedAtDesc(String userId);
    List<WorkoutPlan> findByUserIdInOrderByCreatedAtDesc(List<String> userIds);
    List<WorkoutPlan> findByIsPublicTrueOrderByCreatedAtDesc();
}