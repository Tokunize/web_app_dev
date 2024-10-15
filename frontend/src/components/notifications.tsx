import React, { useEffect, useState, useMemo } from 'react';
import { FaBell, FaCheckCircle } from 'react-icons/fa';
import { getNotifications, markNotificationAsRead } from './notificationService';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: number;
  message: string;
  created_at: string;
  is_read: boolean;
}

export const Notifications: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0); // Mover el conteo aquí

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = await getAccessTokenSilently();
        const data = await getNotifications(accessToken);
        setNotifications(data);
        // Calcular el conteo de notificaciones no leídas aquí
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
      // Decrementar el conteo de notificaciones no leídas
      setUnreadCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError("Error marking notification as read. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="focus:outline-none items-center flex">
          <FaBell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="relative flex">
              <span className="absolute inline-flex -top-3 h-4 w-4 rounded-full bg-[#C8E870] opacity-75 animate-ping"></span>
              <span className="relative inline-flex -top-3 h-4 w-4 rounded-full bg-[#C8E870] text-white text-[10px] font-semibold items-center justify-center">
                {unreadCount}
              </span>
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent side="bottom" align="end" className="max-w-sm mt-2 max-h-80 w-[100%] bg-white shadow-lg rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="font-bold text-gray-800 p-4">
          Notifications
        </div>
        {loading ? (
          <div className="py-3 px-4"> {/* Loader aquí */} </div>
        ) : error ? (
          <div className="py-3 px-4 text-sm text-red-500">
            {error}
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification: Notification) => (
            <React.Fragment key={notification.id}>
              <div
                className={`py-4 px-4 text-sm transition-all duration-150 ease-in-out rounded-md cursor-pointer ${
                  notification.is_read
                    ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    : 'bg-white text-gray-900 hover:bg-gray-100 shadow-md'
                } flex items-center justify-between mb-2`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="break-words max-w-[85%]">
                  {notification.message}
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
                {notification.is_read && (
                  <FaCheckCircle className="text-[#C3E26E] ml-3 w-4 h-4" />
                )}
              </div>
              {notification.id !== notifications[notifications.length - 1].id && <div className="border-none"></div>}
            </React.Fragment>
          ))
        ) : (
          <div className="py-3 px-4 text-sm text-gray-500">
            No notifications
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
