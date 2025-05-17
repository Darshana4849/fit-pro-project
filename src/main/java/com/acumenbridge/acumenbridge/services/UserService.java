// src/main/java/com/acumenbridge/acumenbridge/services/UserService.java
package com.acumenbridge.acumenbridge.services;

import org.springframework.stereotype.Service;

/**
 * Service class for user-related operations.
 * Provides basic user functionality and business logic.
 */
@Service
public class UserService {

    /**
     * Generates a personalized welcome message for the given username.
     * 
     * @param username The name of the user to welcome
     * @return A formatted welcome message string
     */
    public String getWelcomeMessage(String username) {
        return "Welcome, " + username + "!";
    }
}