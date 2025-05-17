// src/services/workoutPlanService.js
import axios from 'axios';

// Base URL for workout plan API endpoints
const API_URL = 'http://localhost:8080/workout-plans';

/**
 * Helper function to generate authorization headers with JWT token
 * @returns {Object} Configuration object containing:
 *   - headers: Authorization and Content-Type headers
 *   - withCredentials: Boolean for including credentials
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,  // Include JWT token in Authorization header
      'Content-Type': 'application/json',  // Set content type for JSON requests
    },
    withCredentials: true,  // Include cookies in requests
  };
};

/**
 * Fetch all workout plans available to the authenticated user
 * @returns {Promise<Array>} Resolves with array of workout plan objects
 * @throws {Error} If request fails
 */
export const getWorkoutPlans = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    throw error;
  }
};

/**
 * Fetch all public workout plans
 * @returns {Promise<Array>} Resolves with array of public workout plan objects
 * @throws {Error} If request fails
 */
export const getPublicWorkoutPlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/public`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching public workout plans:', error);
    throw error;
  }
};

/**
 * Fetch a specific workout plan by its ID
 * @param {string} id - ID of the workout plan to fetch
 * @returns {Promise<Object>} Resolves with the workout plan object
 * @throws {Error} If request fails
 */
export const getWorkoutPlanById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    throw error;
  }
};

/**
 * Create a new workout plan
 * @param {Object} workoutPlan - The workout plan data to create
 * @returns {Promise<Object>} Resolves with the created workout plan object
 * @throws {Error} If request fails
 */
export const createWorkoutPlan = async (workoutPlan) => {
  try {
    const response = await axios.post(API_URL, workoutPlan, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating workout plan:', error);
    throw error;
  }
};

/**
 * Update an existing workout plan
 * @param {string} id - ID of the workout plan to update
 * @param {Object} workoutPlan - Updated workout plan data
 * @returns {Promise<Object>} Resolves with the updated workout plan object
 * @throws {Error} If request fails
 */
export const updateWorkoutPlan = async (id, workoutPlan) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, workoutPlan, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating workout plan:', error);
    throw error;
  }
};

/**
 * Delete a workout plan
 * @param {string} id - ID of the workout plan to delete
 * @returns {Promise<void>} Resolves when deletion is successful
 * @throws {Error} If request fails
 */
export const deleteWorkoutPlan = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Error deleting workout plan:', error);
    throw error;
  }
};