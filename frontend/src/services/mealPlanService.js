// src/services/mealPlanService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/meal-plans';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  };
};

export const getMealPlans = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    throw error;
  }
};

export const getPublicMealPlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/public`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching public meal plans:', error);
    throw error;
  }
};

export const getUserMealPlans = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching user meal plans:', error);
    throw error;
  }
};

export const getMealPlanById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    throw error;
  }
};

export const createMealPlan = async (mealPlan) => {
  try {
    const response = await axios.post(API_URL, mealPlan, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating meal plan:', error);
    throw error;
  }
};

export const updateMealPlan = async (id, mealPlan) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, mealPlan, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating meal plan:', error);
    throw error;
  }
};

export const deleteMealPlan = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    throw error;
  }
};