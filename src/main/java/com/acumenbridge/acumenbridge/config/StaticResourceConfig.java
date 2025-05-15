// src/main/java/com/acumenbridge/acumenbridge/config/StaticResourceConfig.java
package com.acumenbridge.acumenbridge.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class for static resource handling.
 * Maps virtual URL paths to physical file system locations for serving static files.
 */
@Configuration // Marks this class as a Spring configuration class
public class StaticResourceConfig implements WebMvcConfigurer {

    /**
     * Configures resource handlers to serve static files from the filesystem.
     * 
     * @param registry The ResourceHandlerRegistry used to add resource handlers
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Maps any request to /uploads/** to serve static resources from the "uploads/" directory
        // in the filesystem (relative to the application root)
        registry.addResourceHandler("/uploads/**")  // URL path pattern
                .addResourceLocations("file:uploads/");  // Corresponding filesystem location
    }
}