import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext.jsx';
import { getNotificationVisual } from './notificationVisual.js';
import { formatDateTime } from '../../utils/time.js';

const TOAST_TTL_MS = 5000;

export function NotificationToast() {
  const { notifications, markAsRead } = useNotifications();
  const [toasts, setToasts] = useState([]);
  const shownRef = useRef(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fresh = notifications
      .filter(n => n.isNew && !n.isRead && !shownRef.current.has(n.id))
      .slice(0, 3);
    if (fresh.length === 0) return;

    fresh.forEach(n => shownRef.current.add(n.id));
    setToasts(prev => [...fresh, ...prev].slice(0, 3));
    fresh.forEach(n => {
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== n.id)), TOAST_TTL_MS);
    });
  }, [notifications]);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.data?.from_user_id) {
      navigate(`/profile/${notification.data.from_user_id}`);
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2 max-w-[calc(100vw-2rem)]">
      {toasts.map((toast, index) => {
        const v = getNotificationVisual(toast.type);
        return (
          <div
            key={toast.id}
            className={`transform transition-all duration-500 ease-in-out ${
              index === 0 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
            style={{ transitionDelay: `${index * 100}ms`, animation: 'slideInRight 0.5s ease-out forwards' }}
          >
            <div
              onClick={() => handleNotificationClick(toast)}
              className="cursor-pointer w-[320px] max-w-full bg-matcha border border-pen/60 rounded-2xl p-4 shadow-[3px_3px_0_rgba(89,67,71,0.28)]"
            >
              <div className="flex items-start gap-3">
                <div className={`flex-none w-9 h-9 rounded-full grid place-items-center border border-pen/60 ${v.bg}`}>
                  <i className={`${v.icon} ${v.color} text-sm`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-pen leading-tight">{toast.message}</p>
                  <p className="text-xs text-pen/50 mt-1">{formatDateTime(toast.createdAt)}</p>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); setToasts(prev => prev.filter(t => t.id !== toast.id)); }}
                  className="flex-none text-pen/50 hover:text-pink transition-colors"
                  title="Fermer la notification"
                >
                  <i className="fas fa-times text-xs" />
                </button>
              </div>

              <div className="mt-3 w-full bg-pen/15 rounded-full h-1 overflow-hidden">
                <div className="h-1 rounded-full bg-tea" style={{ animation: 'progressBar 5s linear forwards' }} />
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes progressBar { from { width: 100%; } to { width: 0%; } }
      `}</style>
    </div>
  );
}
