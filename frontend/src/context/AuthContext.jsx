// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile } from '../services/authService';

/**
 * Authentication Context for managing user authentication state
 * @type {React.Context}
 */
export const AuthContext = createContext();

/**
 * AuthProvider component that wraps the application to provide authentication context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} The authentication provider component
 */
export function AuthProvider({ children }) {
  // State for storing the authenticated user
  const [user, setUser] = useState(null);

  /**
   * Effect hook to load user profile when component mounts
   * Checks for existing token and fetches user profile if token exists
   */
  useEffect(() => {
    async function fetchUser() {
      try {
        // Fetch user profile from API
        const response = await getUserProfile();
        // Set user data in state
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Clear user state on error
        setUser(null);
      }
    }

    // Check for existing authentication token
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user profile if token exists
      fetchUser();
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Context value containing user state and setter function
  const value = { user, setUser };

  // Return the provider with context value and children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}