import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { getNotifications, markNotificationAsRead } from './notificationService';
import { useAuth0 } from '@auth0/auth0-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Define el tipo Notification
interface Notification {
  id: number;
  message: string;
  is_read: boolean;
}

export const Notifications: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = await getAccessTokenSilently();
        const data = await getNotifications(accessToken);
        setNotifications(data);
        setUnreadCount(data.filter(notification => !notification.is_read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Error fetching notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [getAccessTokenSilently]);

  const handleMarkAsRead = async (notificationId: number) => {
    const accessToken = await getAccessTokenSilently();
    setLoading(true);
    setError(null);
    try {
      await markNotificationAsRead(notificationId, accessToken);
      setNotifications(prev =>
        prev.map(notification => 
          notification.id === notificationId ? { ...notification, is_read: true } : notification
        )
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError("Error marking notification as read. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center relative">
          <FaBell className="w-5 h-5 text-gray-600" />
          {/* Indicador de notificaciones */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" mt-2">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? ( // Muestra el loading
          <DropdownMenuItem disabled>Cargando...</DropdownMenuItem>
        ) : error ? ( // Muestra el error si hay uno
          <DropdownMenuItem disabled>{error}</DropdownMenuItem>
        ) : notifications.length > 0 ? (
          notifications.map((notification: Notification) => ( // Especifica el tipo aquí
            <DropdownMenuItem 
              key={notification.id} 
              className={`hover:bg-gray-100 ${notification.is_read ? 'opacity-50' : ''} max-w-xs`}
              onClick={() => handleMarkAsRead(notification.id)} // Marca como leído al hacer clic
            >
              <div className="break-words">{notification.message}</div> {/* Permite que el texto se divida en varias líneas */}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No hay notificaciones</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
