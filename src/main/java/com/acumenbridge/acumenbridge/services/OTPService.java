// src/main/java/com/acumenbridge/acumenbridge/services/OTPService.java
package com.acumenbridge.acumenbridge.services;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for handling One-Time Password (OTP) operations.
 * Provides functionality for storing, validating, and managing OTPs.
 * Uses an in-memory ConcurrentHashMap for thread-safe OTP storage.
 */
@Service
public class OTPService {
    // A simple store with email as key and OTP details as value
    private final ConcurrentHashMap<String, OTPDetails> otpStore = new ConcurrentHashMap<>();

    // Duration in minutes the OTP is valid
    private final int OTP_VALID_DURATION = 10;

    /**
     * Stores an OTP for the specified email address.
     * @param email The email address to associate with the OTP
     * @param otp The OTP to store
     */
    public void storeOTP(String email, String otp) {
        OTPDetails details = new OTPDetails(otp, LocalDateTime.now());
        otpStore.put(email, details);
    }

    /**
     * Validates an OTP for the specified email address.
     * Checks both the OTP code and its expiration time.
     * @param email The email address to validate against
     * @param otp The OTP to validate
     * @return true if the OTP is valid and not expired, false otherwise
     */
    public boolean validateOTP(String email, String otp) {
        OTPDetails details = otpStore.get(email);
        if (details == null) return false;
        // Check if OTP matches
        if (!details.getOtp().equals(otp)) return false;
        // Check if OTP has expired
        LocalDateTime expiryTime = details.getCreatedTime().plusMinutes(OTP_VALID_DURATION);
        return LocalDateTime.now().isBefore(expiryTime);
    }

    /**
     * Removes the OTP associated with the specified email address.
     * @param email The email address whose OTP should be removed
     */
    public void removeOTP(String email) {
        otpStore.remove(email);
    }

    /**
     * Inner class to hold OTP details including the code and creation time.
     */
    public static class OTPDetails {
        private final String otp;
        private final LocalDateTime createdTime;

        /**
         * Constructs a new OTPDetails instance.
         * @param otp The OTP code
         * @param createdTime The time when the OTP was created
         */
        public OTPDetails(String otp, LocalDateTime createdTime) {
            this.otp = otp;
            this.createdTime = createdTime;
        }

        /**
         * Gets the OTP code.
         * @return The OTP code
         */
        public String getOtp() {
            return otp;
        }

        /**
         * Gets the creation time of the OTP.
         * @return The creation time
         */
        public LocalDateTime getCreatedTime() {
            return createdTime;
        }
    }
}