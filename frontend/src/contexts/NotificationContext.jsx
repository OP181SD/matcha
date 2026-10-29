import { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { useSocket } from '../socket/Socket.jsx';
import api from '../utils/api.js';

const NotificationContext = createContext();

const NOTIFICATION_TYPES = {
  LIKE_RECEIVED: 'like_received',
  PROFILE_VIEWED: 'profile_viewed',
  MATCH: 'match',
  MESSAGE_RECEIVED: 'message_received',
  LIKE_REMOVED: 'like_removed',
};

const ACTIONS = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  CLEAR_ALL: 'CLEAR_ALL',
};

const getNotificationMessage = (type, data) => {
  switch (type) {
    case NOTIFICATION_TYPES.LIKE_RECEIVED:
      return `${data.from_username} a liké votre profil`;

    case NOTIFICATION_TYPES.PROFILE_VIEWED:
      return `${data.from_username} a consulté votre profil`;

    case NOTIFICATION_TYPES.MATCH:
      return `Vous avez un match avec ${data.from_username} !`;

    case NOTIFICATION_TYPES.MESSAGE_RECEIVED:
      return `${data.from_username}: ${data.preview || 'Nouveau message'}`;

    case NOTIFICATION_TYPES.LIKE_REMOVED:
      return `${data.from_username} a retiré son like`;

    default:
      return data.message || 'Nouvelle notification';
  }
};

const shouldIgnoreMessageNotification = () => {
  const isOnMessagePage = window.location.pathname === '/message-page';
  return isOnMessagePage;
};

function notificationReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          {
            id: Date.now() + Math.random(),
            ...action.payload,
            isRead: false,
            isNew: true,
            createdAt: new Date(),
          },
          ...state.notifications,
        ],
        unreadCount: state.unreadCount + 1,
      };

    case ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload.id
            ? { ...notif, isRead: true }
            : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case ACTIONS.REMOVE_NOTIFICATION:
      const notifToRemove = state.notifications.find(n => n.id === action.payload.id);
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload.id),
        unreadCount: notifToRemove && !notifToRemove.isRead
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };

    case ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload.notifications,
        unreadCount: action.payload.notifications.filter(n => !n.isRead).length,
      };

    case ACTIONS.CLEAR_ALL:
      return {
        notifications: [],
        unreadCount: 0,
      };

    default:
      return state;
  }
}

const initialState = {
  notifications: [],
  unreadCount: 0,
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const { socket, user, isReady } = useSocket();

  const refreshUnreadMessagesCount = useCallback(async () => {
    try {
      const { data } = await api.get('/api/messages/unread-count');
      setUnreadMessagesCount(data.count || 0);
    } catch (err) {
    }
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({
      type: ACTIONS.REMOVE_NOTIFICATION,
      payload: { id },
    });
  }, []);

  const addNotification = useCallback((notification) => {
    dispatch({
      type: ACTIONS.ADD_NOTIFICATION,
      payload: notification,
    });

    if (notification.autoRemove !== false) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, 5000);
    }
  }, [removeNotification]);

  const markAsRead = useCallback((id) => {
    dispatch({
      type: ACTIONS.MARK_AS_READ,
      payload: { id },
    });
    api.patch(`/api/notifications/${id}/read`).catch(() => {});
  }, []);

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ALL });
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      try {
        const { data } = await api.get('/api/notifications');
        const rows = data;
        const mapped = (rows || []).map(n => ({
          id: n.id,
          type: n.type,
          message: getNotificationMessage(n.type, n.data || {}),
          data: n.data || {},
          isRead: n.is_read,
          isNew: false,
          createdAt: new Date(n.created_at),
          autoRemove: false,
        }));
        dispatch({ type: ACTIONS.SET_NOTIFICATIONS, payload: { notifications: mapped } });
      } catch (err) {
      }
    };

    loadNotifications();
    refreshUnreadMessagesCount();
  }, [user, refreshUnreadMessagesCount]);

  useEffect(() => {
    if (!socket || !isReady) {
      return;
    }

    const handleLikeReceived = (data) => {

      addNotification({
        id: data.id,
        type: NOTIFICATION_TYPES.LIKE_RECEIVED,
        message: getNotificationMessage(NOTIFICATION_TYPES.LIKE_RECEIVED, data),
        data,
        autoRemove: false,
      });
    };

    const handleProfileViewed = (data) => {
      addNotification({
        id: data.id,
        type: NOTIFICATION_TYPES.PROFILE_VIEWED,
        message: getNotificationMessage(NOTIFICATION_TYPES.PROFILE_VIEWED, data),
        data,
        autoRemove: false,
      });
    };

    const handleMatch = (data) => {
      addNotification({
        id: data.id,
        type: NOTIFICATION_TYPES.MATCH,
        message: getNotificationMessage(NOTIFICATION_TYPES.MATCH, data),
        data,
        autoRemove: false,
      });
    };

    const handleMessageReceived = (data) => {

      if (shouldIgnoreMessageNotification()) {
        return;
      }
      setUnreadMessagesCount(prev => prev + 1);
      addNotification({
        id: data.id,
        type: NOTIFICATION_TYPES.MESSAGE_RECEIVED,
        message: getNotificationMessage(NOTIFICATION_TYPES.MESSAGE_RECEIVED, data),
        data,
        autoRemove: true,
      });
    };

    const handleLikeRemoved = (data) => {
      addNotification({
        id: data.id,
        type: NOTIFICATION_TYPES.LIKE_REMOVED,
        message: getNotificationMessage(NOTIFICATION_TYPES.LIKE_REMOVED, data),
        data,
        autoRemove: false,
      });
    };

    const simulateNotification = () => {
      handleProfileViewed({
        from_user_id: 999,
        from_username: 'TestUser',
        message: 'TestUser a consulté votre profil'
      });
    };

    const simulateLikeNotification = () => {
      handleLikeReceived({
        from_user_id: 999,
        from_username: 'TestUser',
        message: 'TestUser a aimé votre profil'
      });
    };

    const simulateMatchNotification = () => {
      handleMatch({
        from_user_id: 999,
        from_username: 'TestUser',
        message: 'Vous avez un match avec TestUser !'
      });
    };

    socket.on('notification_like_received', handleLikeReceived);
    socket.on('notification_profile_viewed', handleProfileViewed);
    socket.on('notification_match', handleMatch);
    socket.on('notification_message_received', handleMessageReceived);
    socket.on('notification_like_removed', handleLikeRemoved);

    window.simulateNotification = simulateNotification;
    window.simulateLikeNotification = simulateLikeNotification;
    window.simulateMatchNotification = simulateMatchNotification;

    return () => {

      socket.off('notification_like_received', handleLikeReceived);
      socket.off('notification_profile_viewed', handleProfileViewed);
      socket.off('notification_match', handleMatch);
      socket.off('notification_message_received', handleMessageReceived);
      socket.off('notification_like_removed', handleLikeRemoved);
      delete window.simulateNotification;
      delete window.simulateLikeNotification;
      delete window.simulateMatchNotification;
    };
  }, [socket, isReady, user, addNotification]);

  const value = {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    addNotification,
    markAsRead,
    removeNotification,
    clearAllNotifications,
    unreadMessagesCount,
    refreshUnreadMessagesCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};