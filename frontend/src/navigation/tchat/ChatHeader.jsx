import { getTimeAgo } from '../../utils/time.js';

const DEFAULT_PICTURE = "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F375.svg";

export function ChatHeader({ channel, onBack, isOnline, lastSeen, isBlocked }) {
  const connectionStatus = isOnline
    ? { text: "En ligne", style: "text-tea font-medium" }
    : lastSeen
      ? { text: `En ligne ${getTimeAgo(lastSeen)}`, style: "text-pen/50" }
      : { text: "Jamais connecté", style: "text-pen/40" };

  const picture = isBlocked ? DEFAULT_PICTURE : (channel.profile_picture || DEFAULT_PICTURE);

  return (
    <div className="px-6 py-4 flex gap-4 justify-start items-center transition-all">
      <button onClick={onBack} className="lg:hidden bg-transparent p-3 rounded-full">
        <svg className="w-4 h-4 text-pen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </button>

      <img
        src={picture}
        alt={isBlocked ? "Utilisateur introuvable" : (channel.first_name || "Photo de profil")}
        className="w-16 h-16 rounded-full object-cover border-2 border-pen/60 matcha-shadow-sm"
      />

      <div className="flex flex-col gap-1 justify-center">
        {isBlocked ? (
          <h1 className="text-xl font-semibold text-pen/60 italic">Utilisateur introuvable</h1>
        ) : (
          <>
            <div className="flex gap-2">
              <h1 className="text-xl font-semibold text-pen">{channel.first_name}</h1>
              <h1 className="text-xl font-semibold text-pen">{channel.last_name}</h1>
            </div>
            <span className={`text-sm ${connectionStatus.style}`}>
              {connectionStatus.text}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
