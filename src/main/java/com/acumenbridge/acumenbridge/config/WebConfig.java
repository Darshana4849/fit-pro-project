package com.acumenbridge.acumenbridge.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web Configuration Class
 * 
 * Configures global CORS (Cross-Origin Resource Sharing) settings for the application.
 * Allows controlled access to the API from specified origins (like frontend applications).
 */
@Configuration // Marks this class as a Spring configuration class
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configures global CORS mappings for the application.
     * 
     * This configuration:
     * - Applies to all endpoints ("/**")
     * - Allows requests from the specified origin (frontend development server)
     * - Permits standard HTTP methods
     * - Allows all headers
     * - Supports credentials (cookies, authorization headers)
     * 
     * @param registry The CorsRegistry used to configure CORS mappings
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply to all paths
                .allowedOrigins("http://localhost:5173") // Allow frontend origin
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(true); // Allow credentials (cookies, auth headers)
    }
}