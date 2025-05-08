// src/services/workoutPlanService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/workout-plans';

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

export const getWorkoutPlans = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    throw error;
  }
};

export const getPublicWorkoutPlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/public`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching public workout plans:', error);
    throw error;
  }
};

export const getWorkoutPlanById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    throw error;
  }
};

export const createWorkoutPlan = async (workoutPlan) => {
  try {
    const response = await axios.post(API_URL, workoutPlan, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating workout plan:', error);
    throw error;
  }
};

export const updateWorkoutPlan = async (id, workoutPlan) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, workoutPlan, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating workout plan:', error);
    throw error;
  }
};

export const deleteWorkoutPlan = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Error deleting workout plan:', error);
    throw error;
  }
};