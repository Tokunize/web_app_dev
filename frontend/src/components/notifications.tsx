import React, { useEffect, useState } from 'react';
import { FaBell, FaCheckCircle } from 'react-icons/fa';
import { getNotifications, markNotificationAsRead } from './notificationService';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDistanceToNow } from 'date-fns';

import { Skeleton } from "@/components/ui/skeleton"

export const SkeletonDemo =()=> {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

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
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

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
      setUnreadCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError("Error marking notification as read. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    const accessToken = await getAccessTokenSilently();
    setLoading(true);
    setError(null);
    try {
      await Promise.all(notifications.map(notification => 
        markNotificationAsRead(notification.id, accessToken)
      ));
      setNotifications(prev => prev.map(notification => ({ ...notification, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setError("Error marking notifications as read. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(notification => !notification.is_read)
    : notifications;

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
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-bold text-gray-800">Notifications</div>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead} 
              className="text-green-500 hover:underline"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {/* Pestañas para All y Unread */}
        <div className="flex space-x-4 border-b p-2">
          <button 
            className={`flex-1 py-2 text-center ${activeTab === 'all' ? 'font-bold text-gray-800' : 'text-gray-600'}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={`flex-1 py-2 text-center ${activeTab === 'unread' ? 'font-bold text-gray-800' : 'text-gray-600'}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {loading ? (
          <SkeletonDemo />  
        ) : error ? (
          <div className="py-3 px-4 text-sm text-red-500">
            {error}
          </div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification: Notification) => (
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
        ) : activeTab === 'unread' ? (
          <div className="py-3 px-4 text-sm text-gray-500">
            No new notifications
          </div>
        ) : (
          <div className="py-3 px-4 text-sm text-gray-500">
            No notifications
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};