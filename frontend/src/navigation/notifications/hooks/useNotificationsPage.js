import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../contexts/NotificationContext.jsx';
import { formatDateTime } from '../../../utils/time.js';
import { getNotificationVisual } from '../../../component/notifications/notificationVisual.js';

export function useNotificationsPage() {
  const {
    notifications,
    markAsRead,
    removeNotification,
    clearAllNotifications
  } = useNotifications();

  const navigate = useNavigate();

  useEffect(() => {
    notifications.forEach(notif => {
      if (!notif.isRead) markAsRead(notif.id);
    });
  }, [notifications, markAsRead]);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) markAsRead(notification.id);
    if (notification.data?.from_user_id) {
      navigate(`/profile/${notification.data.from_user_id}`);
    }
  };

  const getNotificationIcon = getNotificationVisual;

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case 'like_received':
      case 'profile_viewed':
      case 'like_removed':
        return `/profile/${notification.data?.from_user_id}`;
      case 'match':
        return '/message-page';
      case 'message_received':
        return `/chat-page?channel=${notification.data?.channel_id}`;
      default:
        return null;
    }
  };

  const groupedNotifications = useMemo(() => {
    return notifications.reduce((groups, notification) => {
      const date = notification.createdAt.toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(notification);
      return groups;
    }, {});
  }, [notifications]);

  const formatGroupDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (dateString === today) return 'Aujourd\'hui';
    if (dateString === yesterday) return 'Hier';
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return {
    notifications,
    groupedNotifications,
    handleNotificationClick,
    getNotificationIcon,
    getNotificationLink,
    formatGroupDate,
    removeNotification,
    clearAllNotifications,
    formatDateTime
  };
}