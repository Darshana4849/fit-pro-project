// src/services/mealPlanService.js
import axios from 'axios';

// Base URL for meal plan API endpoints
const API_URL = 'http://localhost:8080/meal-plans';

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
 * Fetch all meal plans available to the authenticated user
 * @returns {Promise<Array>} Resolves with array of meal plan objects
 * @throws {Error} If request fails
 */
export const getMealPlans = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    throw error;
  }
};

/**
 * Fetch all public meal plans
 * @returns {Promise<Array>} Resolves with array of public meal plan objects
 * @throws {Error} If request fails
 */
export const getPublicMealPlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/public`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching public meal plans:', error);
    throw error;
  }
};

/**
 * Fetch meal plans created by a specific user
 * @param {string} userId - ID of the user whose meal plans to fetch
 * @returns {Promise<Array>} Resolves with array of user's meal plan objects
 * @throws {Error} If request fails
 */
export const getUserMealPlans = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching user meal plans:', error);
    throw error;
  }
};

/**
 * Fetch a specific meal plan by its ID
 * @param {string} id - ID of the meal plan to fetch
 * @returns {Promise<Object>} Resolves with the meal plan object
 * @throws {Error} If request fails
 */
export const getMealPlanById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    throw error;
  }
};

/**
 * Create a new meal plan
 * @param {Object} mealPlan - The meal plan data to create
 * @returns {Promise<Object>} Resolves with the created meal plan object
 * @throws {Error} If request fails
 */
export const createMealPlan = async (mealPlan) => {
  try {
    const response = await axios.post(API_URL, mealPlan, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating meal plan:', error);
    throw error;
  }
};

/**
 * Update an existing meal plan
 * @param {string} id - ID of the meal plan to update
 * @param {Object} mealPlan - Updated meal plan data
 * @returns {Promise<Object>} Resolves with the updated meal plan object
 * @throws {Error} If request fails
 */
export const updateMealPlan = async (id, mealPlan) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, mealPlan, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating meal plan:', error);
    throw error;
  }
};

/**
 * Delete a meal plan
 * @param {string} id - ID of the meal plan to delete
 * @returns {Promise<void>} Resolves when deletion is successful
 * @throws {Error} If request fails
 */
export const deleteMealPlan = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    throw error;
  }
};