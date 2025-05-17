package com.acumenbridge.acumenbridge.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

/**
 * Custom Login Controller
 * 
 * Handles redirection from Spring Security's default login page
 * to the custom React login page. This ensures a seamless transition
 * between backend authentication flows and frontend login UI.
 */
@Controller // Marks this class as a Spring MVC Controller
public class CustomLoginController {

    /**
     * Handles requests to the custom login endpoint
     * 
     * Redirects users to the React application's login page
     * instead of using Spring's default login page.
     * 
     * @return RedirectView that forwards to the React login page
     */
    @GetMapping("/my-custom-login") // Maps HTTP GET requests to this method
    public RedirectView redirectToReactLogin() {
        // Creates a redirect to the React application's login page
        // Note: In production, this URL should be configurable
        return new RedirectView("http://localhost:5173/login");
    }
}