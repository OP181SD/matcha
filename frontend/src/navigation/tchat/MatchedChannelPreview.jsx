import { useState } from "react";
import { Link } from "react-router-dom";
import { useSocket } from "../../socket/Socket.jsx";
import { MatchChat } from "./MatchChat.jsx";
import { ConversationView } from "./ConversationView.jsx";
import api from "../../utils/api.js";
import { useFetchMatchedChannels } from "./hooks/useFetchMatchedChannels";
import { useNewMessages } from "./hooks/useNewMessages";
import { useTypingByChannel } from "./hooks/useTypingByChannel.js";
import { useNotifications } from "../../contexts/NotificationContext.jsx";

const DEFAULT_PICTURE = "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F375.svg";

async function markMessagesAsRead(channelId) {
  try {
    const { data } = await api.put(`/api/messages/${channelId}/mark-as-read`);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error || "Erreur lors du marquage des messages comme lus");
  }
}

export const MatchedChannelPreview = ({ selectedChannel, setSelectedChannel, onlineUsers = [] }) => {

  const [typingUsersByChannel, setTypingUsersByChannel] = useState({});
  const [search, setSearch] = useState("");
  const { socket, user } = useSocket();
  const { refreshUnreadMessagesCount } = useNotifications();

  useTypingByChannel(socket, setTypingUsersByChannel);

  const {
    matchedUsers,
    gender,
    lastReceivedMap,
    setLastReceivedMap,
    isLoading
  } = useFetchMatchedChannels();

  useNewMessages(socket, selectedChannel, setLastReceivedMap);

  const onlineIds = new Set(onlineUsers.filter(u => u.is_online).map(u => u.id));

  const handleSelectChannel = async (u) => {
    try {
      const lastReceived = lastReceivedMap[u.channel_id];
      if (lastReceived && lastReceived.isRead === false) {
        await markMessagesAsRead(u.channel_id);
        setLastReceivedMap(prev => ({
          ...prev,
          [u.channel_id]: { ...prev[u.channel_id], isRead: true },
        }));
        refreshUnreadMessagesCount();
      }
      setSelectedChannel(u);
    } catch (err) {
    }
  };

  const onlineMatches = onlineUsers.filter(u => u.id !== user?.id && u.is_online);
  const filteredMatches = matchedUsers.filter(u =>
    (u.first_name || "").toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="grid lg:grid-cols-[340px_minmax(0,1fr)] gap-4 h-full min-h-0">

      {}
      {}
      <aside className={`${selectedChannel ? "hidden lg:flex" : "flex"} bg-matcha overflow-hidden flex-col min-h-0 lg:border lg:border-pen/60 lg:rounded-[20px] lg:shadow-[3px_3px_0_rgba(89,67,71,0.28)]`}>
        {}
        <div className="p-3 border-b border-pen/60">
          <div className="flex items-center gap-2 rounded-full border border-pen/60 bg-matcha px-3 py-2">
            <svg className="w-4 h-4 text-pen/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
            </svg>
            <input
              type="text"
              name="search"
              aria-label="Rechercher une conversation"
              autoComplete="off"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher"
              className="flex-grow bg-transparent outline-none text-pen text-sm font-semibold placeholder-pen/50"
            />
          </div>
        </div>

        {}
        {onlineMatches.length > 0 && (
          <div className="flex gap-3 overflow-x-auto px-3 py-3 border-b border-pen/60">
            {onlineMatches.map(u => (
              <div key={u.id} className="flex flex-col items-center gap-1 flex-none w-16">
                <div className="relative">
                  <img
                    src={u.image_url || DEFAULT_PICTURE}
                    alt={u.first_name}
                    className="w-14 h-14 object-cover rounded-full border border-pen/60"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-matcha bg-matcha-light" />
                </div>
                <span className="text-[11px] font-semibold text-pen truncate w-full text-center">{u.first_name}</span>
              </div>
            ))}
          </div>
        )}

        {}
        <div className="flex-1 min-h-0 overflow-y-auto p-2">
          <h2 className="matcha-eyebrow px-2 pt-1 pb-2">Conversations</h2>
          {isLoading ? (
            <p className="text-center text-pen/50 mt-8">Chargement...</p>
          ) : filteredMatches.length > 0 ? (
            <div className="flex flex-col gap-1">
              {filteredMatches.map(matchedUser => (
                <MatchChat
                  key={matchedUser.matched_user_id}
                  user={matchedUser}
                  DEFAULT_PICTURE={DEFAULT_PICTURE}
                  lastReceived={lastReceivedMap[matchedUser.channel_id]}
                  onSelectChannel={handleSelectChannel}
                  typingUsers={typingUsersByChannel[matchedUser.channel_id] || []}
                  selected={selectedChannel?.channel_id === matchedUser.channel_id}
                  isOnline={!matchedUser.is_blocked && onlineIds.has(matchedUser.matched_user_id)}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-pen/50 text-sm mt-8 px-4">
              {search ? "Aucun résultat." : "Pas encore de matchs ? Swipe pour rencontrer du monde !"}
            </p>
          )}
        </div>
      </aside>

      {}
      <section className={`${selectedChannel ? "fixed inset-0 z-50 lg:static lg:z-auto" : "hidden lg:flex"} bg-matcha overflow-hidden flex-col min-h-0 lg:border lg:border-pen/60 lg:rounded-[20px] lg:shadow-[3px_3px_0_rgba(89,67,71,0.28)]`}>
        {selectedChannel ? (
          <ConversationView
            channel={selectedChannel}
            onBack={() => setSelectedChannel(null)}
            socket={socket}
            user={user}
            gender={gender}
            lastReceivedMap={lastReceivedMap}
            setLastReceivedMap={setLastReceivedMap}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-pen/50 px-6">
            <svg className="w-16 h-16 mb-4 text-pen/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h6m-6 4h4m-9 4h18a2 2 0 002-2V6a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-bold text-pen">Tes messages</p>
            <p className="text-sm mt-1">Sélectionne une conversation pour commencer.</p>
            <Link to="/meet-page" className="matcha-btn matcha-btn-tea mt-4">Découvrir des profils</Link>
          </div>
        )}
      </section>
    </div>
  );
};
