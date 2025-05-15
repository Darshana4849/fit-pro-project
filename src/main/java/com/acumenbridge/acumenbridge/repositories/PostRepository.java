package com.acumenbridge.acumenbridge.repositories;

import com.acumenbridge.acumenbridge.models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Post entities providing custom query methods
 * in addition to standard CRUD operations from MongoRepository.
 * 
 * Uses Spring Data MongoDB to interact with the database.
 */
@Repository // Marks this interface as a Spring Data Repository component
public interface PostRepository extends MongoRepository<Post, String> {
    // Inherits standard CRUD operations from MongoRepository<Post, String>

    /**
     * Custom query method to find all posts by a specific user,
     * ordered by creation date in descending order (newest first).
     * 
     * @param userId The ID of the user whose posts to retrieve
     * @return List of Post objects matching the criteria
     */
    List<Post> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Custom query method to find all posts by multiple users,
     * ordered by creation date in descending order (newest first).
     * Useful for generating a user's feed containing their own posts
     * and posts from users they follow.
     * 
     * @param userIds List of user IDs whose posts to retrieve
     * @return List of Post objects matching the criteria
     */
    List<Post> findByUserIdInOrderByCreatedAtDesc(List<String> userIds);
}