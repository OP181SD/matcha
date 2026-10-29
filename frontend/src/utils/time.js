export const formatDateTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };
export const getTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const days = Math.floor(hr / 24);

  if (sec < 60) return "il y a quelques secondes";
  if (min < 60) return `il y a ${min} min`;
  if (hr < 24) return `il y a ${hr} h`;
  return `il y a ${days} j`;
};

export const getConnectionStatus = (user) => {
  if (user.is_online) return { text: "En ligne", style: "text-tea font-medium" };
  const lastSeen = user.last_seen || user.last_connection;
  if (lastSeen) return { text: `Vu ${getTimeAgo(lastSeen)}`, style: "text-gray-500" };
  return { text: "Jamais connecté", style: "text-gray-400" };
};