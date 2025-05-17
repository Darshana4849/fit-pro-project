// src/main/java/com/acumenbridge/acumenbridge/repositories/MealPlanRepository.java
package com.acumenbridge.acumenbridge.repositories;

import com.acumenbridge.acumenbridge.models.MealPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for MealPlan entity operations.
 * Provides CRUD functionality and custom query methods for MealPlan documents in MongoDB.
 */
@Repository
public interface MealPlanRepository extends MongoRepository<MealPlan, String> {

    /**
     * Finds all meal plans for a specific user, ordered by creation date (newest first).
     * 
     * @param userId The ID of the user whose meal plans to retrieve
     * @return List of MealPlan objects belonging to the user, sorted by createdAt in descending order
     */
    List<MealPlan> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Finds meal plans for multiple users, ordered by creation date (newest first).
     * 
     * @param userIds List of user IDs to retrieve meal plans for
     * @return List of MealPlan objects belonging to the specified users, sorted by createdAt in descending order
     */
    List<MealPlan> findByUserIdInOrderByCreatedAtDesc(List<String> userIds);

    /**
     * Finds all public meal plans, ordered by creation date (newest first).
     * 
     * @return List of public MealPlan objects, sorted by createdAt in descending order
     */
    List<MealPlan> findByIsPublicTrueOrderByCreatedAtDesc();
}