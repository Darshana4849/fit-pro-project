// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { forgotPassword } from '../../services/authService';

/**
 * ForgotPassword component handles the password reset request flow.
 * Users can enter their email to receive a password reset link.
 */
function ForgotPassword() {
  // State management:
  const [email, setEmail] = useState(''); // Stores the email input
  const [message, setMessage] = useState(''); // Success message state
  const [error, setError] = useState(''); // Error message state

  /**
   * Handles the password reset request submission
   */
  const handleForgot = async () => {
    // Clear any existing messages
    setMessage('');
    setError('');
    
    // Validate that the email field is not empty
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      // Call the forgotPassword service with the email
      await forgotPassword(email);
      // Show success message
      setMessage('Password reset link sent to your email.');
    } catch (err) {
      // Handle errors from the API
      setError(err.response?.data?.message || 'Error sending reset link');
    }
  };

  // Component render
  return (
    <Box
      sx={{
        width: 400, // Fixed width for the form
        margin: 'auto', // Center the form horizontally
        marginTop: 5, // Add top margin
        display: 'flex',
        flexDirection: 'column', // Stack children vertically
        gap: 2, // Add gap between child elements
      }}
    >
      {/* Form title */}
      <Typography variant="h4" textAlign="center">
        Forgot Password
      </Typography>

      {/* Email input field */}
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />

      {/* Submit button */}
      <Button variant="contained" onClick={handleForgot}>
        Send Reset Link
      </Button>

      {/* Success message display */}
      {message && (
        <Typography color="primary" textAlign="center">
          {message}
        </Typography>
      )}

      {/* Error message display */}
      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default ForgotPassword;