

export function getNotificationVisual(type) {
  switch (type) {
    case 'like_received':    return { icon: 'fas fa-heart',        color: 'text-pink',    bg: 'bg-pink/25' };
    case 'profile_viewed':   return { icon: 'fas fa-eye',          color: 'text-tea',     bg: 'bg-tea/25' };
    case 'match':            return { icon: 'fas fa-star',         color: 'text-tea',     bg: 'bg-tea/25' };
    case 'message_received': return { icon: 'fas fa-comment',      color: 'text-pen',     bg: 'bg-pen/10' };
    case 'like_removed':     return { icon: 'fas fa-heart-broken', color: 'text-red-400', bg: 'bg-red-100' };
    default:                 return { icon: 'fas fa-bell',         color: 'text-pen/60',  bg: 'bg-pen/10' };
  }
}
