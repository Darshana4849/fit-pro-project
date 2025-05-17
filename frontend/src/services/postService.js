// src/services/postService.js
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

/**
 * Create a new post
 * @param {Object|FormData} postData - The post data to create (can be FormData for file uploads)
 * @returns {Promise} Axios response with the created post
 */
export async function createPost(postData) {
  // postData can be FormData (if you ever attach files)
  return axios.post(
    `${API_URL}/posts`,
    postData,
    {
      withCredentials: true,
      headers: {
        ...authHeaders(),
        // if sending JSON instead, uncomment:
        // 'Content-Type': 'application/json'
      }
    }
  );
}

/**
 * Get the current user's feed of posts
 * @returns {Promise} Axios response with array of post objects
 */
export async function getFeed() {
  return axios.get(
    `${API_URL}/posts`,
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}

/**
 * Get all posts by a specific user
 * @param {string} userId - The ID of the user whose posts to fetch
 * @returns {Promise} Axios response with array of post objects
 */
export async function getPostsByUser(userId) {
  return axios.get(
    `${API_URL}/posts/user/${userId}`,
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}

/**
 * Get a specific post by its ID
 * @param {string} postId - The ID of the post to fetch
 * @returns {Promise} Axios response with the post object
 */
export async function getPostById(postId) {
  return axios.get(
    `${API_URL}/posts/${postId}`,
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}

/**
 * Update an existing post
 * @param {string} postId - The ID of the post to update
 * @param {Object} updateData - The data to update the post with
 * @returns {Promise} Axios response with the updated post
 */
export async function updatePost(postId, updateData) {
  return axios.put(
    `${API_URL}/posts/${postId}`,
    updateData,
    {
      withCredentials: true,
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json'
      }
    }
  );
}

/**
 * Delete a post
 * @param {string} postId - The ID of the post to delete
 * @returns {Promise} Axios response
 */
export async function deletePost(postId) {
  return axios.delete(
    `${API_URL}/posts/${postId}`,
    {
      withCredentials: true,
      headers: authHeaders()
    }
  );
}