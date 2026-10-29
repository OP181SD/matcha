 import { Navbar } from '../../component/profil/Navbar.jsx';
import { Link } from 'react-router-dom';
import { useNotificationsPage } from './hooks/useNotificationsPage.js';

export function NotificationsPage() {
  const {
    notifications,
    groupedNotifications,
    handleNotificationClick,
    getNotificationIcon,
    formatGroupDate,
    removeNotification,
    clearAllNotifications,
    formatDateTime
  } = useNotificationsPage();

  return (
    <div>
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-pen">Notifications</h1>
              <p className="text-pen mt-2 font-medium">
                {notifications.length === 0
                  ? 'Aucune notification'
                  : `${notifications.length} notification${notifications.length > 1 ? 's' : ''}`
                }
              </p>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="matcha-btn matcha-btn-pink"
              >
                <i className="fas fa-trash mr-2"></i>
                Effacer tout
              </button>
            )}
          </div>
        </div>

        {}
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <i className="fas fa-bell-slash text-5xl text-pen opacity-30 mb-4"></i>
            <h3 className="text-xl font-bold text-pen">Aucune notification</h3>
            <p className="text-pen opacity-80 mt-2 font-medium">
              Vous recevrez ici vos likes, matchs, messages et vues de profil.
            </p>
            <Link
              to="/meet-page"
              className="matcha-btn matcha-btn-tea mt-6"
            >
              Découvrir des profils
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedNotifications)
              .sort(([a], [b]) => new Date(b) - new Date(a))
              .map(([dateString, dayNotifications]) => (
                <div key={dateString} className="matcha-card !p-0 overflow-hidden">
                  <div className="px-6 py-3 border-b border-pen/60">
                    <h2 className="matcha-eyebrow">{formatGroupDate(dateString)}</h2>
                  </div>

                  <div className="divide-y divide-pen/25">
                    {dayNotifications.map((notification) => {
                      const iconData = getNotificationIcon(notification.type);

                      return (
                        <div
                          key={notification.id}
                          className="px-6 py-4 hover:bg-pink/15 transition-colors cursor-pointer flex items-start space-x-4"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${iconData.bg} flex items-center justify-center`}>
                            <i className={`${iconData.icon} ${iconData.color} text-lg`}></i>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-pen font-medium">{notification.message}</p>
                            <p className="text-sm text-pen opacity-80 mt-1">
                              <span className="font-semibold">{formatDateTime(notification.createdAt)}</span>
                            </p>
                          </div>

                          <div className="flex-shrink-0 flex items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="p-2 text-pen opacity-50 hover:text-red-500 transition"
                              title="Supprimer"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}