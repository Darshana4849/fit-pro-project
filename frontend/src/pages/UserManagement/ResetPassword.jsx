// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, LinearProgress } from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../services/authService';

/**
 * ResetPassword component handles the password reset functionality
 * for users who have requested a password reset via email.
 * It requires a valid reset token and email to proceed.
 */
function ResetPassword() {
  // Get the reset token from URL parameters
  const { token } = useParams();
  // Get email from query parameters
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  
  // State management:
  const [password, setPassword] = useState(''); // New password input
  const [confirmPassword, setConfirmPassword] = useState(''); // Password confirmation
  const [strength, setStrength] = useState(0); // Password strength score (0-4)
  const [message, setMessage] = useState(''); // Status/error messages

  /**
   * Evaluates password strength based on common criteria
   * @param {string} pass - The password to evaluate
   * @returns {number} Strength score (0-4)
   */
  const evaluatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++; // Minimum length requirement
    if (/[A-Z]/.test(pass)) score++; // Contains uppercase letter
    if (/[0-9]/.test(pass)) score++; // Contains number
    if (/[^A-Za-z0-9]/.test(pass)) score++; // Contains special character
    return score;
  };

  /**
   * Handles password input changes and updates strength score
   * @param {Object} e - Change event from password input
   */
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setStrength(evaluatePasswordStrength(val));
  };

  /**
   * Handles the password reset submission
   * Validates inputs before making API call
   */
  const handleReset = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      // Call reset password service with email, token, and new password
      await resetPassword(email, token, password);
      setMessage('Password reset successful! You can now log in.');
    } catch (err) {
      // Display error message from API or default message
      setMessage(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <Box
      sx={{
        width: 400, // Fixed width form
        margin: 'auto', // Center horizontally
        marginTop: 5, // Top margin
        display: 'flex',
        flexDirection: 'column', // Vertical layout
        gap: 2 // Spacing between elements
      }}
    >
      {/* Form title */}
      <Typography variant="h4" textAlign="center">Reset Password</Typography>

      {/* New password input */}
      <TextField
        label="New Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={handlePasswordChange}
      />

      {/* Password strength indicator */}
      <LinearProgress
        variant="determinate"
        value={(strength / 4) * 100} // Convert 0-4 score to percentage
        sx={{ height: 8 }} // Custom height
      />

      {/* Password confirmation input */}
      <TextField
        label="Confirm New Password"
        type="password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {/* Reset password submit button */}
      <Button variant="contained" onClick={handleReset}>
        Reset Password
      </Button>

      {/* Status/error message display */}
      {message && (
        <Typography color="secondary" textAlign="center">
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default ResetPassword;