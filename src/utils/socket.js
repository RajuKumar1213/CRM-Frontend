import { io } from 'socket.io-client';
import { store } from '../redux/store';
import { addNotification, setNotifications } from '../redux/features/notificationSlice';

let socket;

export const initializeSocket = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return;

  socket = io(import.meta.env.VITE_BACKEND_HOST_URL || 'http://localhost:8000', {
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('notifications', (notifications) => {
    store.dispatch(setNotifications(notifications));
  });

  socket.on('notification', (notification) => {
    store.dispatch(addNotification(notification));
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

// Re-export socket for direct access if needed
export { socket };
