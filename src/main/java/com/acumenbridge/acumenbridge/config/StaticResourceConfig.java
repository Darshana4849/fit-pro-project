// src/main/java/com/acumenbridge/acumenbridge/config/StaticResourceConfig.java
package com.acumenbridge.acumenbridge.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Static Resource Configuration Class
 * 
 * Configures how static resources (like uploaded files) are served by the application.
 * Maps virtual URL paths to physical file system locations, allowing files to be
 * accessed via HTTP requests while being stored on the server's filesystem.
 * 
 * Implements WebMvcConfigurer to customize Spring MVC configuration.
 */
@Configuration // Indicates this class contains Spring bean definitions
public class StaticResourceConfig implements WebMvcConfigurer {

    /**
     * Configures resource handlers to map URL patterns to filesystem locations.
     * 
     * This method:
     * - Creates a mapping between a URL path and a physical directory
     * - Enables serving static files from the filesystem through HTTP
     * - Makes uploaded files accessible via web URLs
     * 
     * @param registry The ResourceHandlerRegistry that maintains the mappings between
     *                 URL patterns and resource locations
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Maps HTTP requests matching "/uploads/**" to files in the "uploads/" directory
        // "file:uploads/" indicates a filesystem-relative path (not classpath)
        // The trailing slash is important for proper directory resolution
        registry.addResourceHandler("/uploads/**")  // URL pattern to match
                .addResourceLocations("file:uploads/");  // Physical location in filesystem
        
        // Additional mappings could be added here for other resource locations
        // Example:
        // registry.addResourceHandler("/other-resources/**")
        //         .addResourceLocations("file:/path/to/other/resources/");
    }
}