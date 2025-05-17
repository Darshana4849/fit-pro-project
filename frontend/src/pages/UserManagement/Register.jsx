// src/pages/Register.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, LinearProgress } from '@mui/material';
import { registerUser, sendOtp, verifyOtp } from '../../services/authService';

/**
 * Register component handles user registration with:
 * - Email verification via OTP
 * - Password strength validation
 * - Form validation
 */
function Register() {
  // State management for form fields and registration flow
  const [name, setName] = useState(''); // User's name
  const [email, setEmail] = useState(''); // User's email
  const [password, setPassword] = useState(''); // User's password
  const [confirmPassword, setConfirmPassword] = useState(''); // Password confirmation
  const [otp, setOtp] = useState(''); // One-time password for verification
  const [isVerified, setIsVerified] = useState(false); // Email verification status
  const [otpSent, setOtpSent] = useState(false); // OTP sending status
  const [strength, setStrength] = useState(0); // Password strength score (0-4)
  const [message, setMessage] = useState(''); // Status/error messages

  /**
   * Evaluates password strength based on common criteria
   * @param {string} pass - The password to evaluate
   * @returns {number} Strength score (0-4)
   */
  const evaluatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++; // Minimum length
    if (/[A-Z]/.test(pass)) score++; // Contains uppercase
    if (/[0-9]/.test(pass)) score++; // Contains number
    if (/[^A-Za-z0-9]/.test(pass)) score++; // Contains special char
    return score;
  };

  /**
   * Handles password changes and updates strength score
   * @param {Object} e - Change event from password input
   */
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setStrength(evaluatePasswordStrength(val));
  };

  /**
   * Sends OTP to the provided email after validation
   */
  const handleSendOtp = async () => {
    if (!email) {
      setMessage('Please enter your email before sending OTP.');
      return;
    }
    try {
      await sendOtp(email);
      setOtpSent(true);
      setMessage('OTP sent to your email. Check your inbox.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending OTP');
    }
  };

  /**
   * Verifies the entered OTP against the server
   */
  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setMessage('OTP must be at least 6 digits.');
      return;
    }
    try {
      await verifyOtp(email, otp);
      setIsVerified(true);
      setMessage('Email verified successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid OTP');
    }
  };

  /**
   * Handles the final registration submission
   */
  const handleRegister = async () => {
    if (!isVerified) {
      setMessage('Please verify your email first with the OTP.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      await registerUser({ name, email, password, confirmPassword });
      setMessage('Registration successful! You can now log in.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
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
        gap: 2, // Spacing between elements
      }}
    >
      {/* Form title */}
      <Typography variant="h4" textAlign="center">Register</Typography>

      {/* Name input */}
      <TextField
        label="Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Email input */}
      <TextField
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* OTP verification section */}
      <Box display="flex" gap={1}>
        {/* OTP input */}
        <TextField
          label="OTP"
          variant="outlined"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={isVerified} // Disable after verification
        />
        {/* Send OTP button */}
        <Button
          variant="contained"
          onClick={handleSendOtp}
          disabled={otpSent || isVerified} // Disable after sending or verification
        >
          {otpSent ? "OTP Sent" : "Send OTP"}
        </Button>
        {/* Verify OTP button */}
        <Button
          variant="outlined"
          onClick={handleVerifyOtp}
          disabled={!otpSent || isVerified} // Disable unless OTP sent and not verified
        >
          Verify OTP
        </Button>
      </Box>

      {/* Password input with strength meter */}
      <TextField
        label="Password"
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

      {/* Password confirmation */}
      <TextField
        label="Confirm Password"
        type="password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {/* Registration submit button */}
      <Button variant="contained" onClick={handleRegister}>
        Register
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

export default Register;