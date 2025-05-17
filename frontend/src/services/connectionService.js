// src/services/connectionService.js
import axios from 'axios';

// Set API URL from environment variables or default to local development server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Helper function to generate authorization headers with JWT token
 * @returns {Object} Headers object with Authorization if token exists
 */
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Get list of users the current user is following
 * @returns {Promise} Axios response with following list
 */
export async function getFollowing() {
  return axios.get(`${API_URL}/auth/following`, {
    withCredentials: true,
    headers: authHeaders()
  });
}

/**
 * Get suggested users to follow (recommendations)
 * @returns {Promise} Axios response with suggestions list
 */
export async function getSuggestions() {
  return axios.get(`${API_URL}/auth/suggestions`, {
    withCredentials: true,
    headers: authHeaders()
  });
}

/**
 * Follow a specific user
 * @param {string} targetUserId - ID of user to follow 
 * @returns {Promise} Axios response
 */
export async function followUser(targetUserId) {
  return axios.post(`${API_URL}/auth/follow/${targetUserId}`, {}, {
    withCredentials: true,
    headers: authHeaders()
  });
}

/**
 * Unfollow a specific user
 * @param {string} targetUserId - ID of user to unfollow
 * @returns {Promise} Axios response
 */
export async function unfollowUser(targetUserId) {
  return axios.post(`${API_URL}/auth/unfollow/${targetUserId}`, {}, {
    withCredentials: true,
    headers: authHeaders()
  });
}

/**
 * Get profile information for a specific user
 * @param {string} userId - ID of user to get profile for
 * @returns {Promise} Axios response with user profile data
 */
export async function getUserProfileById(userId) {
  return axios.get(`${API_URL}/auth/profile/${userId}`, {
    withCredentials: true,
    headers: authHeaders()
  });
}

/**
 * Search for users by query string
 * @param {string} query - Search term
 * @returns {Promise} Axios response with search results
 */
export async function searchUsers(query) {
  return axios.get(`${API_URL}/auth/search?query=${encodeURIComponent(query)}`, {
    withCredentials: true,
    headers: authHeaders()
  });
}