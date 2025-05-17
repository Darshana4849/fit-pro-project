// src/services/authService.js
import axios from 'axios';

// Set API URL from environment variables or default to local development server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Axios response
 */
export async function registerUser(userData) {
  return axios.post(`${API_URL}/auth/register`, userData, { withCredentials: true });
}

/**
 * Send OTP (One-Time Password) to user's email
 * @param {string} email - User's email address
 * @returns {Promise} Axios response
 */
export async function sendOtp(email) {
  return axios.post(`${API_URL}/auth/send-otp`, { email }, { withCredentials: true });
}

/**
 * Verify OTP (One-Time Password) entered by user
 * @param {string} email - User's email address
 * @param {string} otp - One-Time Password to verify
 * @returns {Promise} Axios response
 */
export async function verifyOtp(email, otp) {
  return axios.post(`${API_URL}/auth/verify-otp`, { email, otp }, { withCredentials: true });
}

/**
 * Login user with credentials
 * @param {Object} credentials - User credentials (email and password)
 * @returns {Promise} Axios response with token in data if successful
 */
export async function loginUser(credentials) {
  const response = await axios.post(`${API_URL}/auth/login`, credentials, { withCredentials: true });
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response;
}

/**
 * Initiate social login with provider (Google, Facebook, etc.)
 * @param {string} provider - Social login provider name
 */
export async function socialLogin(provider) {
  window.location.href = `${API_URL}/oauth2/authorization/${provider}`;
}

/**
 * Request password reset for a user
 * @param {string} email - User's email address
 * @returns {Promise} Axios response
 */
export async function forgotPassword(email) {
  return axios.post(`${API_URL}/auth/forgot-password`, { email }, { withCredentials: true });
}

/**
 * Reset user's password with token from email
 * @param {string} email - User's email address
 * @param {string} token - Password reset token
 * @param {string} newPassword - New password to set
 * @returns {Promise} Axios response
 */
export async function resetPassword(email, token, newPassword) {
  return axios.post(
    `${API_URL}/auth/reset-password`,
    { email, token, newPassword },
    { withCredentials: true }
  );
}

/**
 * Get current user's profile data
 * @returns {Promise} Axios response with user profile data
 */
export async function getUserProfile() {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/auth/profile`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

/**
 * Update user's profile information
 * @param {FormData} formData - Profile data to update (can include file uploads)
 * @returns {Promise} Axios response with updated profile data
 * @throws {Error} If update fails
 */
export async function updateProfile(formData) {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`${API_URL}/auth/update-profile`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

/**
 * Logout current user
 * @returns {Promise} Axios response (always resolves)
 */
export async function logoutUser() {
  try {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem('token');
  }
}

/**
 * Delete current user's profile
 * @returns {Promise} Axios response
 */
export async function deleteProfile() {
  const token = localStorage.getItem('token');
  return axios.delete(`${API_URL}/auth/delete-profile`, {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}