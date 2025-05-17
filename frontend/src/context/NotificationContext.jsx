// src/context/NotificationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Context for managing application notifications
 * @type {React.Context}
 */
const NotificationContext = createContext();

/**
 * NotificationProvider component that wraps the application to provide notification context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} The notification provider component
 */
export function NotificationProvider({ children }) {
  // State for storing notifications array
  const [notifications, setNotifications] = useState([]);
  // State for tracking unread notifications count
  const [unreadCount, setUnreadCount] = useState(0);

  /**
   * Effect hook to load saved notifications from localStorage when component mounts
   */
  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      const parsed = JSON.parse(storedNotifications);
      setNotifications(parsed);
      // Calculate initial unread count
      setUnreadCount(parsed.filter(n => !n.read).length);
    }
  }, []);

  /**
   * Effect hook to persist notifications to localStorage when they change
   */
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  /**
   * Adds a new notification
   * @param {Object} notification - Notification object to add
   * @param {string} notification.message - Notification message
   * @param {string} [notification.type] - Type of notification (e.g., 'success', 'error')
   */
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(), // Unique ID based on timestamp
      ...notification,
      read: false, // Mark as unread by default
      createdAt: new Date().toISOString() // Add creation timestamp
    };
    
    // Add new notification to beginning of array
    setNotifications(prev => [newNotification, ...prev]);
    // Increment unread count
    setUnreadCount(prev => prev + 1);
  };

  /**
   * Marks a specific notification as read
   * @param {string} id - ID of the notification to mark as read
   */
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    );
    // Decrement unread count (minimum 0)
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  /**
   * Marks all notifications as read
   */
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    // Reset unread count to 0
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Custom hook for accessing notification context
 * @returns {Object} Notification context value
 */
export function useNotifications() {
  return useContext(NotificationContext);
}