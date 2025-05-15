import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext'; // Assuming you have AuthContext

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const { token } = useAuth(); // Get the auth token

  useEffect(() => {
    if (!token) return;

    // Connect to socket server
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      auth: {
        token,
      },
    });

    newSocket.on('connect', () => {
      console.log('Connected to notification service');
    });

    newSocket.on('newNotification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      // You can also play a sound or show a toast notification here
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  const markAsRead = async (notificationId) => {
    try {
      const updatedNotifications = notifications.map((notif) =>
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      );
      setNotifications(updatedNotifications);
      
      // Call your API to mark notification as read
      await fetch(`/api/notifications/${notificationId}/mark-read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const value = {
    notifications,
    markAsRead,
    unreadCount: notifications.filter((n) => !n.isRead).length,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
