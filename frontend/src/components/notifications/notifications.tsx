import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { getNotifications, markNotificationAsRead } from './notificationService';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDistanceToNow } from 'date-fns';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { Skeleton } from "@/components/ui/skeleton";

interface Notification {
  id: number;
  message: string;
  created_at: string;
  is_read: boolean;
}

export const SkeletonDemo: React.FC = () => {
  return (
    <div className="flex items-center space-x-1">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};

export const Notifications: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const accessToken = await getAccessTokenSilently();
        const data = await getNotifications(accessToken);
        setNotifications(data as Notification[]); // Aquí aplicamos un type assertion
        setUnreadCount(data.filter((notification: Notification) => !notification.is_read).length); // Especifica el tipo en el filtro
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [getAccessTokenSilently]);

  const handleMarkAsRead = async (notificationId: number) => {
    const accessToken = await getAccessTokenSilently();
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    const accessToken = await getAccessTokenSilently();
    setLoading(true);
    try {
      await Promise.all(
        notifications.map(notification =>
          markNotificationAsRead(notification.id, accessToken)
        )
      );
      setNotifications(prev => prev.map(notification => ({ ...notification, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderNotification = (notification: Notification) => (
    <div
      key={notification.id}
      onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
      className={`p-4 rounded-lg cursor-pointer ${notification.is_read ? 'bg-gray-100' : 'bg-white'}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-700 text-sm">{notification.message}</p>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );

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

      <PopoverContent side="bottom" align="end" className="mt-2 max-h-80 max-w-lg bg-white shadow-lg rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="flex items-center justify-between p-2">
          <div className="text-sm font-medium leading-none">Notifications</div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="text-green-500 hover:underline">
              Mark All as Read
            </button>
          )}
        </div>

        {loading ? (
            <SkeletonDemo />
        ) : (
          <Tabs defaultValue="all" className="max-w-lg space-y-4">
            <TabsList className="grid w-full grid-cols-2 text-3xl ">
              <TabsTrigger value="all" className='text-sm font-medium leading-none'>All</TabsTrigger>
              <TabsTrigger value="unread" className='text-sm font-medium leading-none'>Unread  <span className='text-xs translate-y-[-10%] pl-1'>{unreadCount}</span> </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {notifications.length > 0 ? (
                notifications.map(notification => renderNotification(notification))
              ) : (
                <p className="p-4 text-center text-sm text-gray-500">No notifications yet</p>
              )}
            </TabsContent>
            <TabsContent value="unread">
              {notifications.filter(notification => !notification.is_read).length > 0 ? (
                notifications
                  .filter(notification => !notification.is_read)
                  .map(notification => renderNotification(notification))
              ) : (
                <p className="p-4 text-center text-sm text-gray-500">No unread notifications</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </PopoverContent>
    </Popover>
  );
};