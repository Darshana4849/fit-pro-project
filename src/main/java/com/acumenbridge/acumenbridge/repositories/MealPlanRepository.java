package com.acumenbridge.acumenbridge.repositories;

import com.acumenbridge.acumenbridge.models.MealPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealPlanRepository extends MongoRepository<MealPlan, String> {
    List<MealPlan> findByUserIdOrderByCreatedAtDesc(String userId);
    List<MealPlan> findByUserIdInOrderByCreatedAtDesc(List<String> userIds);
    List<MealPlan> findByIsPublicTrueOrderByCreatedAtDesc();
}