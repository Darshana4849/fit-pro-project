package com.acumenbridge.acumenbridge.controllers;

import com.acumenbridge.acumenbridge.models.User;
import com.acumenbridge.acumenbridge.repositories.UserRepository;
import com.acumenbridge.acumenbridge.services.EmailService;
import com.acumenbridge.acumenbridge.services.OTPService;
import com.acumenbridge.acumenbridge.services.JwtService;
import com.acumenbridge.acumenbridge.utils.OTPUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Controller
 * 
 * Handles all authentication-related endpoints including:
 * - User registration
 * - User login with JWT generation
 * - OTP (One-Time Password) sending and verification
 * 
 * Cross-origin requests are allowed from the frontend development server.
 */
@RestController
@RequestMapping("/auth") // Base path for all authentication endpoints
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from frontend
public class AuthController {

    @Autowired // Injects UserRepository for database operations
    private UserRepository userRepository;

    @Autowired // Injects EmailService for sending emails
    private EmailService emailService;

    @Autowired // Injects OTPService for OTP management
    private OTPService otpService;

    @Autowired // Injects JwtService for token generation
    private JwtService jwtService;

    // Password encoder for securely hashing passwords
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * User Registration Endpoint
     * 
     * @param user User object containing registration details
     * @return ResponseEntity with success/error message
     */
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists.");
        }
        // Hash password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Save new user to database
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    /**
     * User Login Endpoint
     * 
     * @param loginRequest User credentials (email and password)
     * @return ResponseEntity with JWT token or error message
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        // Find user by email
        var userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid credentials.");
        }
        
        User user = userOptional.get();
        // Verify password matches
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid credentials.");
        }
        
        // Generate JWT token for authenticated user
        String token = jwtService.generateToken(user);
        
        // Prepare response with token
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful!");
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    /**
     * OTP Sending Endpoint
     * 
     * @param emailRequest Contains email address to send OTP to
     * @return ResponseEntity with success/error message
     */
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody EmailRequest emailRequest) {
        String email = emailRequest.getEmail();
        // Validate email
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }
        
        // Generate 6-digit OTP
        String otp = OTPUtil.generateOTP();
        // Store OTP temporarily with expiration
        otpService.storeOTP(email, otp);
        // Send OTP via email
        emailService.sendOtpEmail(email, otp);
        
        return ResponseEntity.ok("OTP sent to your email.");
    }

    /**
     * OTP Verification Endpoint
     * 
     * @param request Contains email and OTP to verify
     * @return ResponseEntity with verification result
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpVerificationRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp();
        
        // Validate OTP against stored value
        if (otpService.validateOTP(email, otp)) {
            // Remove used OTP
            otpService.removeOTP(email);
            return ResponseEntity.ok("Email verified successfully.");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired OTP.");
        }
    }
}

/**
 * Request DTO for email operations
 */
class EmailRequest {
    private String email;
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

/**
 * Request DTO for OTP verification
 */
class OtpVerificationRequest {
    private String email;
    private String otp;
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}