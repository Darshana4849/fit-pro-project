package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.Progress;
import com.acumenbridge.acumenbridge.repositories.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Progress Controller
 * 
 * Handles all CRUD operations for user progress tracking including:
 * - Creating new progress records
 * - Retrieving progress data (single or multiple records)
 * - Updating existing progress entries
 * - Deleting progress records
 */
@RestController
@RequestMapping("/api/progress") // Base path for all progress endpoints
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Allow frontend requests with credentials
public class ProgressController {

    @Autowired // Injects ProgressRepository for database operations
    private ProgressRepository progressRepository;

    /**
     * Create a new progress record
     * 
     * @param progress The progress data to be created
     * @return The newly created Progress object
     */
    @PostMapping
    public Progress createProgress(@RequestBody Progress progress) {
        return progressRepository.save(progress);
    }

    /**
     * Get all progress records
     * 
     * @return List of all Progress objects in the database
     */
    @GetMapping
    public List<Progress> getAllProgress() {
        return progressRepository.findAll();
    }

    /**
     * Get a specific progress record by ID
     * 
     * @param id The ID of the progress record to retrieve
     * @return ResponseEntity with the Progress object if found, or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Progress> getProgressById(@PathVariable String id) {
        return progressRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update an existing progress record
     * 
     * @param id The ID of the progress record to update
     * @param updatedProgress The updated progress data
     * @return ResponseEntity with the updated Progress object if found, or 404 if not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Progress> updateProgress(@PathVariable String id, @RequestBody Progress updatedProgress) {
        return progressRepository.findById(id).map(progress -> {
            progress.setAchievementType(updatedProgress.getAchievementType());
            progress.setHead(updatedProgress.getHead());
            progress.setDescription(updatedProgress.getDescription());
            progress.setCompleted(updatedProgress.getCompleted());
            progress.setToComplete(updatedProgress.getToComplete());
            return ResponseEntity.ok(progressRepository.save(progress));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a progress record
     * 
     * @param id The ID of the progress record to delete
     * @return ResponseEntity with success status if found and deleted, or 404 if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable String id) {
        return progressRepository.findById(id).map(progress -> {
            progressRepository.delete(progress);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}