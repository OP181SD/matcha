import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { getNotificationVisual } from './notificationVisual.js';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, removeNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date) => {
    const diff = Date.now() - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) markAsRead(notification.id);
    setIsOpen(false);

    switch (notification.type) {
      case 'like_received':
      case 'profile_viewed':
      case 'like_removed':
        if (notification.data?.from_user_id) navigate(`/profile/${notification.data.from_user_id}`);
        break;
      case 'match':
        navigate('/message-page');
        break;
      case 'message_received':
        navigate(notification.data?.channel_id ? `/message-page?channel=${notification.data.channel_id}` : '/message-page');
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(o => !o)}
        className="relative w-[42px] h-[42px] grid place-items-center bg-matcha border border-pen/60 rounded-[11px] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_rgba(89,67,71,0.28)] hover:bg-pink/20"
        title="Notifications"
      >
        <i className="fas fa-bell text-pen text-lg" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-pink text-pen border border-pen/60 rounded-full text-[11px] font-extrabold grid place-items-center leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 max-w-[90vw] max-h-[70vh] flex flex-col overflow-hidden bg-matcha border border-pen/60 rounded-2xl shadow-[3px_3px_0_rgba(89,67,71,0.28)] z-50">
          {}
          <div className="flex items-center justify-between px-4 py-3 border-b border-pen/60">
            <h3 className="matcha-eyebrow">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={() => notifications.forEach(n => { if (!n.isRead) markAsRead(n.id); })}
                className="text-xs font-semibold text-tea hover:underline"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-pen/50">
                <i className="fas fa-bell-slash text-4xl mb-3" />
                <p className="text-sm">Aucune notification</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const v = getNotificationVisual(notif.type);
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex cursor-pointer gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                      notif.isRead ? 'hover:bg-pink/10' : 'bg-pink/15'
                    }`}
                  >
                    <div className={`flex-none w-9 h-9 rounded-full grid place-items-center border border-pen/60 ${v.bg}`}>
                      <i className={`${v.icon} ${v.color} text-sm`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm text-pen ${notif.isRead ? 'text-pen/70' : 'font-semibold'}`}>{notif.message}</p>
                      <p className="mt-0.5 text-xs text-pen/50">{formatTime(notif.createdAt)}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                      className="flex-none self-start text-pen/40 hover:text-pink transition-colors"
                      title="Supprimer"
                    >
                      <i className="fas fa-times text-xs" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-pen/60 px-4 py-2.5 text-center">
              <Link to="/notifications" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-tea hover:underline">
                Voir toutes les notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
