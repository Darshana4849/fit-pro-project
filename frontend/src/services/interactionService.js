// src/services/interactionService.js
import axios from 'axios';

// Set API URL from environment variables or default to local development server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Helper function to generate authorization headers with JWT token if available
 * @returns {Object} Headers object with Authorization if token exists, empty object otherwise
 */
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ======================
// —— Post Likes ——
// ======================

/**
 * Like a specific post
 * @param {string} postId - ID of the post to like
 * @returns {Promise} Axios response
 */
export function likePost(postId) {
  return axios.post(
    `${API_URL}/posts/${postId}/likes`,
    null,  // No request body needed for like action
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}

/**
 * Remove like from a specific post
 * @param {string} postId - ID of the post to unlike
 * @returns {Promise} Axios response
 */
export function unlikePost(postId) {
  return axios.delete(
    `${API_URL}/posts/${postId}/likes`,
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}

// ======================
// —— Comments ——
// ======================

/**
 * Get all comments for a specific post
 * @param {string} postId - ID of the post to fetch comments for
 * @returns {Promise} Axios response with array of comments
 */
export function getCommentsByPost(postId) {
  return axios.get(
    `${API_URL}/comments/post/${postId}`,
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}

/**
 * Add a new comment to a post
 * @param {string} postId - ID of the post to comment on
 * @param {string} text - Content of the comment
 * @returns {Promise} Axios response with the created comment
 */
export function addComment(postId, text) {
  return axios.post(
    `${API_URL}/comments/post/${postId}`,
    { text },  // Comment text in request body
    {
      withCredentials: true,
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json'  // Explicit content type for JSON payload
      }
    }
  );
}

/**
 * Update an existing comment
 * @param {string} commentId - ID of the comment to update
 * @param {string} text - New content for the comment
 * @returns {Promise} Axios response with the updated comment
 */
export function updateComment(commentId, text) {
  return axios.put(
    `${API_URL}/comments/${commentId}`,
    { text },  // Updated comment text in request body
    {
      withCredentials: true,
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json'  // Explicit content type for JSON payload
      }
    }
  );
}

/**
 * Delete a specific comment
 * @param {string} commentId - ID of the comment to delete
 * @returns {Promise} Axios response
 */
export function deleteComment(commentId) {
  return axios.delete(
    `${API_URL}/comments/${commentId}`,
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}