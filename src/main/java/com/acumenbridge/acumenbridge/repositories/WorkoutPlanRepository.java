// src/main/java/com/acumenbridge/acumenbridge/repositories/WorkoutPlanRepository.java
package com.acumenbridge.acumenbridge.repositories;

import com.acumenbridge.acumenbridge.models.WorkoutPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for WorkoutPlan entity operations.
 * Provides CRUD functionality and custom query methods for WorkoutPlan documents.
 */
@Repository
public interface WorkoutPlanRepository extends MongoRepository<WorkoutPlan, String> {
    
    /**
     * Finds all workout plans for a specific user, ordered by creation date (newest first).
     * @param userId The ID of the user whose workout plans to retrieve
     * @return List of WorkoutPlan objects belonging to the user, in descending creation order
     */
    List<WorkoutPlan> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Finds workout plans for multiple users, ordered by creation date (newest first).
     * @param userIds List of user IDs whose workout plans to retrieve
     * @return List of WorkoutPlan objects belonging to the specified users, in descending creation order
     */
    List<WorkoutPlan> findByUserIdInOrderByCreatedAtDesc(List<String> userIds);

    /**
     * Finds all public workout plans, ordered by creation date (newest first).
     * @return List of public WorkoutPlan objects, in descending creation order
     */
    List<WorkoutPlan> findByIsPublicTrueOrderByCreatedAtDesc();
}