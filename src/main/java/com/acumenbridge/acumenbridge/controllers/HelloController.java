package com.acumenbridge.acumenbridge.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import com.acumenbridge.acumenbridge.services.UserService;

/**
 * Hello Controller
 * 
 * Provides simple greeting endpoints for testing and demonstration purposes.
 * Shows basic controller structure and service integration.
 */
@RestController // Marks this class as a REST controller that returns response bodies
public class HelloController {

    private final UserService userService; // Service for user-related operations

    /**
     * Constructor for dependency injection of UserService
     * 
     * @param userService The UserService instance to be injected
     */
    public HelloController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Simple hello endpoint
     * 
     * @return A welcome message string
     */
    @GetMapping("/hello") // Maps HTTP GET requests to /hello to this method
    public String sayHello() {
        return "Hello from Acumenbridge!";
    }

    /**
     * Personalized greeting endpoint
     * 
     * @param name The name to include in the greeting
     * @return A personalized welcome message from the UserService
     */
    @GetMapping("/greet/{name}") // Maps HTTP GET requests with path variable to this method
    public String greetUser(@PathVariable String name) {
        return userService.getWelcomeMessage(name);
    }
}