function timeSince(timestamp) {
  if (!timestamp) return "";
  const now = Date.now();
  const time = new Date(timestamp).getTime();
  const seconds = Math.floor((now - time) / 1000);

  if (seconds < 60) return "À l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  if (days < 7) return `il y a ${days} j`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `il y a ${weeks} sem`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) return `il y a ${months} mois`;
  const years = Math.floor(days / 365);
  return `il y a ${years} an${years > 1 ? 's' : ''}`;
}

function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function MatchChat({ user, DEFAULT_PICTURE, lastReceived, onSelectChannel, typingUsers, selected, isOnline, currentUserId }) {

  const isUnread = lastReceived && lastReceived.senderId !== currentUserId && lastReceived.isRead === false;
  const displayTime = lastReceived?.receivedAt || lastReceived?.created_at;
  const isTyping = typingUsers.includes(user.matched_user_id || user.id);

  const messageContent = lastReceived?.content || "";

  const isBlocked = user.is_blocked;
  const displayName = isBlocked ? "Utilisateur introuvable" : user.first_name;
  const displayPicture = isBlocked ? DEFAULT_PICTURE : (user.profile_picture || DEFAULT_PICTURE);

  return (
    <div
      key={user.matched_user_id || user.id}
      onClick={() => onSelectChannel(user)}
      className={`flex flex-col cursor-pointer rounded-xl p-3 lg:p-2 transition-colors ${selected ? "bg-pink/15" : "hover:bg-pink/10"}`}
    >
      <div className="flex items-center space-x-3 w-full">
        <div className="relative flex-none">
          <img
            className="w-14 h-14 object-cover rounded-full border border-pen/60"
            src={displayPicture}
            alt={displayName || "Photo de profil"}
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-matcha bg-matcha-light" />
          )}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className={`text-pen font-semibold text-sm truncate ${isBlocked ? "italic text-pen/60" : ""}`}>{displayName}</span>

          {isTyping ? (
            <span className="text-pen/50 text-sm truncate">
              <span className="text-pen italic">est en train d’écrire...</span>
            </span>
          ) : lastReceived ? (
            <span className="text-pen/50 text-sm truncate">
              <span className={isUnread ? "font-bold text-pen" : "font-medium"}>
                {truncateText(messageContent, 30)}
              </span>
              {displayTime && <>{" · "}<small>{timeSince(displayTime)}</small></>}
            </span>
          ) : (
            <span className="text-pen/50 text-sm italic">Aucun message échangé</span>
          )}
        </div>
      </div>
    </div>
  );
}