package com.acumenbridge.acumenbridge.config;

import jakarta.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

/**
 * Central security configuration class that defines:
 * - Authentication and authorization rules for all endpoints
 * - Cross-Origin Resource Sharing (CORS) policies
 * - CSRF protection settings
 * - JWT token validation configuration
 * - OAuth2 login integration
 * - Exception handling for security violations
 * 
 * This configuration ensures proper access control while supporting
 * both traditional form login and OAuth2 authentication flows.
 */
@Configuration
public class SecurityConfig {

    // Secret key used for JWT signing and validation
    // Security Note: In production environments, this should be:
    // 1. Externalized to configuration (not hardcoded)
    // 2. Much longer and more complex
    // 3. Rotated periodically
    private final String secretKey = "mySuperSecretKeyThatShouldBeLongEnoughForHS256";

    /**
     * Defines the main security filter chain that applies to all requests.
     * Configures:
     * - Endpoint authorization rules
     * - Authentication mechanisms
     * - Exception handling
     * - CORS policies
     * 
     * @param http The HttpSecurity builder object
     * @return Fully configured SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @SuppressWarnings("removal")
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. CORS Configuration
            // Applies our custom CORS rules to all endpoints
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. CSRF Protection
            // Disabled since we're using stateless JWT authentication
            // (CSRF mainly protects against browser-based attacks with cookies)
            .csrf(csrf -> csrf.disable())
            
            // 3. Exception Handling
            // Custom response for unauthorized access attempts
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, ex2) ->
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
                )
            )
            
            // 4. Authorization Rules
            // Defines which endpoints are public vs require authentication
            .authorizeHttpRequests(auth -> auth
                // 4.1 Public Endpoints (no authentication required)
                .requestMatchers(
                    "/auth/register",               // User registration endpoint
                    "/auth/send-otp",               // OTP generation endpoint
                    "/auth/verify-otp",             // OTP verification endpoint
                    "/auth/login",                  // Traditional login endpoint
                    "/auth/forgot-password",        // Password reset request
                    "/auth/reset-password",         // Password reset submission
                    "/auth/reset-password/**",      // Password reset with token
                    "/oauth2/**",                   // OAuth2 authentication endpoints
                    "/my-custom-login",             // Custom login page
                    "/", "/css/**", "/js/**",       // Static web resources
                    "/images/**", "/uploads/**",    // Image resources
                    "/connections", "/connections/**" // Public connection endpoints
                ).permitAll()

                // 4.2 Authenticated User Endpoints
                .requestMatchers(
                    "/auth/profile",                // User profile viewing
                    "/auth/update-profile",         // Profile updates
                    "/auth/following",              // List of followed users
                    "/auth/suggestions",           // User suggestions
                    "/auth/follow/**",              // Follow user actions
                    "/auth/unfollow/**",            // Unfollow user actions
                    "/auth/profile/**"              // Profile-related endpoints
                ).authenticated()

                // 4.3 Post Endpoints
                // Read operations public, write operations require auth
                .requestMatchers(HttpMethod.GET,    "/posts/**").permitAll()      // View posts
                .requestMatchers(HttpMethod.POST,   "/posts").authenticated()     // Create posts
                .requestMatchers(HttpMethod.PUT,    "/posts/**").authenticated()  // Update posts
                .requestMatchers(HttpMethod.DELETE, "/posts/**").authenticated()  // Delete posts

                // 4.4 Like Endpoints
                // All like operations require authentication
                .requestMatchers(HttpMethod.POST, "/posts/*/like").authenticated()    // Like a post
                .requestMatchers(HttpMethod.POST, "/posts/*/unlike").authenticated()  // Unlike a post

                // 4.5 Comment Endpoints
                // Read operations public, write operations require auth
                .requestMatchers(HttpMethod.GET,    "/comments/post/**").permitAll()      // View comments
                .requestMatchers(HttpMethod.POST,   "/comments/post/**").authenticated()   // Create comments
                .requestMatchers(HttpMethod.PUT,    "/comments/**").authenticated()        // Update comments
                .requestMatchers(HttpMethod.DELETE, "/comments/**").authenticated()        // Delete comments

                // 4.6 Default Rule
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            
            // 5. Form Login Configuration
            // Sets up traditional username/password login
            .formLogin(form -> form
                .loginPage("/my-custom-login")  // Custom login page URL
                .permitAll()                    // Allow access to login page
            )
            
            // 6. OAuth2 Login Configuration
            // Configures social login integration
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/my-custom-login")  // Custom login page URL
                // Redirect to frontend after successful login
                .successHandler((req, res, auth) -> res.sendRedirect("http://localhost:5173/"))
                .permitAll()  // Allow access to OAuth2 endpoints
            )
            
            // 7. JWT Resource Server Configuration
            // Enables JWT token authentication for API endpoints
            .oauth2ResourceServer(oauth2 -> oauth2.jwt())
            
            // 8. Logout Configuration
            // Allows all users to access logout functionality
            .logout(logout -> logout.permitAll());

        return http.build();
    }

    /**
     * Creates and configures the CORS (Cross-Origin Resource Sharing) policy.
     * This controls which external domains can access our API endpoints.
     * 
     * @return Configured CorsConfigurationSource with our CORS rules
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        // Allowed origin - only our frontend development server
        cfg.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        // Allowed HTTP methods
        cfg.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS"));
        // Allowed headers - permit all headers
        cfg.setAllowedHeaders(Arrays.asList("*"));
        // Allow credentials (cookies, authorization headers)
        cfg.setAllowCredentials(true);

        // Apply this configuration to all paths
        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }

    /**
     * Creates a JWT decoder configured with our secret key.
     * This decoder is used to validate incoming JWT tokens.
     * 
     * @return Configured JwtDecoder using HMAC-SHA algorithm
     */
    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder
            // Convert our secret key string to proper key format
            .withSecretKey(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)))
            .build();
    }
}