// src/services/notificationService.js
import api from './api';

export const getNotifications = async () => {
  try {
    // Mock response - replace with actual API call
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

export const markAsRead = async (notificationId) => {
  try {
    // Mock implementation
    console.log(`Marking notification ${notificationId} as read`);
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllAsRead = async () => {
  try {
    // Mock implementation
    console.log('Marking all notifications as read');
    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};