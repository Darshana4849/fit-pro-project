// src/main/java/com/acumenbridge/acumenbridge/repositories/ProgressRepository.java
package com.acumenbridge.acumenbridge.repositories;

import com.acumenbridge.acumenbridge.models.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Repository interface for Progress entity.
 * Extends MongoRepository to provide basic CRUD operations for Progress documents.
 * 
 * This interface inherits all standard MongoDB operations from MongoRepository
 * including save(), findById(), findAll(), deleteById(), etc.
 * 
 * @see org.springframework.data.mongodb.repository.MongoRepository
 */
public interface ProgressRepository extends MongoRepository<Progress, String> {
    // Basic CRUD operations are inherited from MongoRepository
    // No custom query methods are currently defined
}