'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import {
  getMyNotificationsAction,
  markNotificationReadAction,
  markAllNotificationsReadAction,
  deleteNotificationAction,
  INotificationItem,
  INotificationMeta,
  INotificationFilterParams,
} from '@/services/notification/notification.service';
import { getAccessTokenAction } from '@/services/auth/auth.service';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socketClient';

interface NotificationContextType {
  notifications: INotificationItem[];
  unreadCount: number;
  meta: INotificationMeta | null;
  isLoading: boolean;
  isRefreshing: boolean;
  fetchNotifications: (params?: INotificationFilterParams) => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (id: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function playNotificationChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch {
    // Silently ignore audio context autoplay restrictions
  }
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<INotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [meta, setMeta] = useState<INotificationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const isFetchingRef = useRef(false);

  const fetchNotifications = useCallback(
    async (params?: INotificationFilterParams) => {
      if (!isAuthenticated) {
        setNotifications([]);
        setUnreadCount(0);
        setIsLoading(false);
        return;
      }

      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        const res = await getMyNotificationsAction(params);
        if (res.success) {
          const list = Array.isArray(res.data) ? res.data : [];
          setNotifications(list);
          if (res.meta) {
            setMeta(res.meta as INotificationMeta);
            if (typeof res.meta.unreadCount === 'number') {
              setUnreadCount(res.meta.unreadCount);
            } else {
              setUnreadCount(list.filter((n) => !n.isRead).length);
            }
          } else {
            setUnreadCount(list.filter((n) => !n.isRead).length);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user notifications:', err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        isFetchingRef.current = false;
      }
    },
    [isAuthenticated],
  );

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchNotifications]);

  // Periodic background sync (every 15 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications]);

  // Real-time Socket.IO Connection & Listeners
  useEffect(() => {
    if (!isAuthenticated || !user) {
      disconnectSocket();
      return;
    }

    let isMounted = true;

    async function initSocketListener() {
      try {
        let token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) {
          token = await getAccessTokenAction();
        }

        if (!isMounted) return;

        const socket = connectSocket(token);
        if (!socket) return;

        // Handler for incoming push notifications
        const handleNewNotification = (newNotif: any) => {
          if (!newNotif) return;

          playNotificationChime();

          // Add to local state
          const normalized: INotificationItem = {
            id: newNotif.id || `notif-${Date.now()}`,
            userId: newNotif.userId || user?.id || '',
            title: newNotif.title || 'New Notification',
            message: newNotif.message || '',
            type: newNotif.type || 'SYSTEM',
            isRead: false,
            link: newNotif.link || null,
            metadata: newNotif.metadata || null,
            createdAt: newNotif.createdAt || new Date().toISOString(),
          };

          setNotifications((prev) => [normalized, ...prev.filter((n) => n.id !== normalized.id)]);
          setUnreadCount((prev) => prev + 1);

          // Toast alert with direct action if link is provided
          const isEmergency =
            normalized.type === 'TRIP' ||
            normalized.title.toLowerCase().includes('emergency') ||
            normalized.title.toLowerCase().includes('critical') ||
            normalized.title.toLowerCase().includes('dispatch');

          if (isEmergency) {
            toast.error(normalized.title, {
              description: normalized.message,
              duration: 8000,
              action: normalized.link
                ? {
                    label: 'Open',
                    onClick: () => {
                      if (typeof window !== 'undefined' && normalized.link) {
                        window.location.href = normalized.link;
                      }
                    },
                  }
                : undefined,
            });
          } else {
            toast.info(normalized.title, {
              description: normalized.message,
              duration: 5000,
              action: normalized.link
                ? {
                    label: 'View',
                    onClick: () => {
                      if (typeof window !== 'undefined' && normalized.link) {
                        window.location.href = normalized.link;
                      }
                    },
                  }
                : undefined,
            });
          }
        };

        socket.off('notification:new');
        socket.on('notification:new', handleNewNotification);

        return () => {
          socket.off('notification:new', handleNewNotification);
        };
      } catch (err) {
        console.error('Socket init error:', err);
      }
    }

    initSocketListener();

    return () => {
      isMounted = false;
      const s = getSocket();
      if (s) {
        s.off('notification:new');
      }
    };
  }, [isAuthenticated, user]);

  const markAsRead = async (id: string): Promise<boolean> => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      const res = await markNotificationReadAction(id);
      return !!res.success;
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      // Re-fetch to reconcile state
      fetchNotifications();
      return false;
    }
  };

  const markAllAsRead = async (): Promise<boolean> => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      const res = await markAllNotificationsReadAction();
      if (res.success) {
        toast.success('All notifications marked as read.');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
      fetchNotifications();
      return false;
    }
  };

  const deleteNotification = async (id: string): Promise<boolean> => {
    const target = notifications.find((n) => n.id === id);
    const wasUnread = target && !target.isRead;

    // Optimistic update
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (wasUnread) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      const res = await deleteNotificationAction(id);
      if (res.success) {
        toast.success('Notification removed.');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to delete notification:', err);
      fetchNotifications();
      return false;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        meta,
        isLoading,
        isRefreshing,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
