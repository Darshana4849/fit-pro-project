// src/main/java/com/acumenbridge/acumenbridge/repositories/UserRepository.java
package com.acumenbridge.acumenbridge.repositories;

import com.acumenbridge.acumenbridge.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

/**
 * Repository interface for User entity operations.
 * Provides CRUD functionality through MongoRepository and custom query methods
 * for User documents in MongoDB.
 */
public interface UserRepository extends MongoRepository<User, String> {
    
    /**
     * Finds a user by their email address.
     * @param email The email address to search for
     * @return Optional containing the User if found, empty otherwise
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Finds multiple users by their IDs.
     * @param ids List of user IDs to search for
     * @return List of User objects matching the provided IDs
     */
    List<User> findByIdIn(List<String> ids);
    
    /**
     * Searches users by name or email containing the given strings (case-insensitive).
     * @param name String to search for in user names
     * @param email String to search for in user emails
     * @return List of User objects matching either name or email criteria
     */
    List<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);
}