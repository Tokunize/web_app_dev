import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { getNotifications, markNotificationAsRead } from './notificationService';
import { useAuth0 } from '@auth0/auth0-react';
import { BellRing, Check } from "lucide-react"
 import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDistanceToNow } from 'date-fns';
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

  const notificationss = [
    {
      title: "Your call has been confirmed.",
      description: "1 hour ago",
    },
    {
      title: "You have a new message!",
      description: "1 hour ago",
    },
    {
      title: "Your subscription is expiring soon!",
      description: "2 hours ago",
    },
  ]

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

      <PopoverContent side="bottom" align="end" className="mt-2 p-0 max-h-80 bg-white shadow-lg rounded-lg overflow-y-auto scrollbar-thin  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>You have 3 unread messages.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className=" flex items-center space-x-4 rounded-md border p-4">
              <BellRing />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Push Notifications
                </p>
                <p className="text-sm text-muted-foreground">
                  Send notifications to device.
                </p>
              </div>
            </div>
            <div>
              {notificationss.map((notification, index) => (
                <div
                  key={index}
                  className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                >
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleMarkAllAsRead} className="w-full">
              <Check  /> Mark all as read
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
};