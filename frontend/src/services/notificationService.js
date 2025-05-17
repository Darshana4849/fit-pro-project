// src/services/notificationService.js
import api from './api';

/**
 * Fetches user notifications (currently using mock data)
 * @returns {Promise<Object>} Resolves with an object containing:
 *   - notifications: Array of notification objects
 *   - unreadCount: Number of unread notifications
 * @throws {Error} If the request fails (currently just for pattern consistency)
 */
export const getNotifications = async () => {
  try {
    // Mock response - replace with actual API call
    // TODO: Replace with actual API implementation when backend is ready
    // Example: return await api.get('/notifications');
    return {
      notifications: [{
        _id: '1',
        senderId: '123',
        senderName: 'Test User',
        senderAvatar: '',
        type: 'like',
        read: false,
        createdAt: new Date()
      }],
      unreadCount: 1
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Marks a single notification as read (mock implementation)
 * @param {string} notificationId - The ID of the notification to mark as read
 * @returns {Promise<Object>} Resolves with success status object
 * @throws {Error} If the operation fails
 */
export const markAsRead = async (notificationId) => {
  try {
    // Mock implementation - replace with actual API call
    // TODO: Replace with actual API implementation when backend is ready
    // Example: return await api.patch(`/notifications/${notificationId}/read`);
    console.log(`Marking notification ${notificationId} as read`);
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Marks all notifications as read (mock implementation)
 * @returns {Promise<Object>} Resolves with success status object
 * @throws {Error} If the operation fails
 */
export const markAllAsRead = async () => {
  try {
    // Mock implementation - replace with actual API call
    // TODO: Replace with actual API implementation when backend is ready
    // Example: return await api.patch('/notifications/mark-all-read');
    console.log('Marking all notifications as read');
    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};