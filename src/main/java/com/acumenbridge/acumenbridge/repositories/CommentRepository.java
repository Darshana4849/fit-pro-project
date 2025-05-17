// src/main/java/com/acumenbridge/acumenbridge/repositories/CommentRepository.java
package com.acumenbridge.acumenbridge.repositories;

import com.acumenbridge.acumenbridge.models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing Comment entities in MongoDB.
 * Extends MongoRepository to provide basic CRUD operations and custom query methods.
 */
@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
  
  /**
   * Finds all comments associated with a specific post, ordered by creation date in ascending order.
   * 
   * @param postId The ID of the post to retrieve comments for
   * @return List of Comment objects associated with the given postId, ordered by createdAt ascending
   */
  List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);
}