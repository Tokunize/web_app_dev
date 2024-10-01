// src/services/notificationService.ts

import axios from 'axios';

const API_URL = `${import.meta.env.VITE_APP_BACKEND_URL}notifications/mynotifications/`;

// Función para obtener notificaciones
export const getNotifications = async (accessToken: string) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data; // Retorna las notificaciones
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error; // Propaga el error
  }
};

// Función para crear una nueva notificación
export const createNotification = async (notificationData: { message: string }, accessToken: string) => {
  try {
    const response = await axios.post(API_URL, notificationData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data; // Retorna la notificación creada
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error; // Propaga el error
  }
};



// Función para marcar una notificación como leída
export const markNotificationAsRead = async (notificationId: number, accessToken: string) => {
  try {
    const response = await axios.patch(`${API_URL}${notificationId}/mark_as_read/`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error; // Propaga el error
  }
};
