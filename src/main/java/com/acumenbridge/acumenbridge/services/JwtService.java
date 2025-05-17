// src/main/java/com/acumenbridge/acumenbridge/services/JwtService.java
package com.acumenbridge.acumenbridge.services;

import com.acumenbridge.acumenbridge.models.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Service for handling JSON Web Token (JWT) operations.
 * Provides functionality for generating JWT tokens for user authentication.
 */
@Service
public class JwtService {

    // In production, store your secret securely (e.g., environment variable)
    private final String secretKey = "mySuperSecretKeyThatShouldBeLongEnoughForHS256"; 
    // Token validity period (24 hours)
    private final long expirationMillis = 86400000;

    /**
     * Generates a JWT token for the given user.
     * The token contains the user's email as subject and name as a claim.
     * 
     * @param user The user for whom the token is being generated
     * @return A signed JWT token string
     */
    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .setSubject(user.getEmail())  // Set user email as subject
                .claim("name", user.getName())  // Add name as additional claim
                .setIssuedAt(now)  // Set token creation time
                .setExpiration(expiryDate)  // Set token expiration time
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()), SignatureAlgorithm.HS256)  // Sign with secret key
                .compact();  // Convert to compact string
    }
}