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
 * Main security configuration class that sets up:
 * - Authentication and authorization rules
 * - CORS configuration
 * - CSRF protection settings
 * - JWT token handling
 * - OAuth2 integration
 * - Exception handling
 */
@Configuration
public class SecurityConfig {

    // Secret key for JWT token signing and validation
    // Note: In production, this should be externalized and not hardcoded
    private final String secretKey = "mySuperSecretKeyThatShouldBeLongEnoughForHS256";

    /**
     * Configures the main security filter chain with all security rules.
     * @param http The HttpSecurity object to configure
     * @return Configured SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @SuppressWarnings("removal")
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS with our custom configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Disable CSRF protection since we're using JWT tokens
            .csrf(csrf -> csrf.disable())
            
            // Configure custom authentication entry point for unauthorized requests
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, ex2) ->
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
                )
            )
            
            // Configure authorization rules for all endpoints
            .authorizeHttpRequests(auth -> auth
                // Public endpoints that don't require authentication
                .requestMatchers(
                    "/auth/register",               // User registration
                    "/auth/send-otp",               // OTP sending
                    "/auth/verify-otp",             // OTP verification
                    "/auth/login",                  // User login
                    "/auth/forgot-password",        // Password reset request
                    "/auth/reset-password",         // Password reset
                    "/auth/reset-password/**",      // Password reset with token
                    "/oauth2/**",                   // OAuth2 endpoints
                    "/my-custom-login",            // Custom login page
                    "/", "/css/**", "/js/**",      // Static resources
                    "/images/**", "/uploads/**",   // Image resources
                    "/connections", "/connections/**" // Connection endpoints
                ).permitAll()

                // Authenticated endpoints for user profiles and social features
                .requestMatchers(
                    "/auth/profile",                // User profile
                    "/auth/update-profile",         // Profile updates
                    "/auth/following",              // Following list
                    "/auth/suggestions",            // User suggestions
                    "/auth/follow/**",              // Follow actions
                    "/auth/unfollow/**",            // Unfollow actions
                    "/auth/profile/**"              // Profile endpoints
                ).authenticated()

                // Post endpoints - read is public, write requires auth
                .requestMatchers(HttpMethod.GET,    "/posts/**").permitAll()      // View posts
                .requestMatchers(HttpMethod.POST,   "/posts").authenticated()     // Create post
                .requestMatchers(HttpMethod.PUT,    "/posts/**").authenticated()  // Update post
                .requestMatchers(HttpMethod.DELETE, "/posts/**").authenticated()  // Delete post

                // Like endpoints - require authentication
                .requestMatchers(HttpMethod.POST, "/posts/*/like").authenticated()    // Like post
                .requestMatchers(HttpMethod.POST, "/posts/*/unlike").authenticated()  // Unlike post

                // Comment endpoints - read is public, write requires auth
                .requestMatchers(HttpMethod.GET,    "/comments/post/**").permitAll()      // View comments
                .requestMatchers(HttpMethod.POST,   "/comments/post/**").authenticated()   // Create comment
                .requestMatchers(HttpMethod.PUT,    "/comments/**").authenticated()        // Update comment
                .requestMatchers(HttpMethod.DELETE, "/comments/**").authenticated()        // Delete comment

                // All other requests require authentication
                .anyRequest().authenticated()
            )
            
            // Configure form login with custom login page
            .formLogin(form -> form
                .loginPage("/my-custom-login")
                .permitAll()
            )
            
            // Configure OAuth2 login with redirect on success
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/my-custom-login")
                .successHandler((req, res, auth) -> res.sendRedirect("http://localhost:5173/"))
                .permitAll()
            )
            
            // Enable JWT token support for resource server
            .oauth2ResourceServer(oauth2 -> oauth2.jwt())
            
            // Configure logout
            .logout(logout -> logout.permitAll());

        return http.build();
    }

    /**
     * Creates CORS configuration to allow requests from frontend
     * @return Configured CorsConfigurationSource
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        // Allow requests from frontend development server
        cfg.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        // Allowed HTTP methods
        cfg.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS"));
        // Allow all headers
        cfg.setAllowedHeaders(Arrays.asList("*"));
        // Allow credentials (cookies, authorization headers)
        cfg.setAllowCredentials(true);

        // Apply this CORS config to all paths
        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }

    /**
     * Creates JWT decoder using HMAC-SHA algorithm with our secret key
     * @return Configured JwtDecoder
     */
    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder
            .withSecretKey(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)))
            .build();
    }
}