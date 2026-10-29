import { useEffect, useState } from "react";
import { useSocket } from "../../socket/Socket.jsx";
import { Navbar } from "../../component/profil/Navbar.jsx";
import api from "../../utils/api.js";
import { MatchedChannelPreview } from "../tchat/MatchedChannelPreview.jsx";

export function MessagePage() {

  const [currentUserId, setCurrentUserId] = useState(null);

  const { socket } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [error, setError] = useState(null);

  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const fetchOnlineUsers = async () => {
      try {
        const { data: meData } = await api.get("/api/me");
        setCurrentUserId(meData.user?.id);

        const { data } = await api.get("/api/authOnlineUsers");
        setOnlineUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOnlineUsers();

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
      setError(null);
    };

    socket.on("onlineUsers", handleOnlineUsers);
    return () => socket.off("onlineUsers", handleOnlineUsers);
  }, [socket]);

  return (
    <div className="flex flex-col h-[calc(100dvh-64px)] lg:h-[100dvh]">
      <Navbar />
      <main className="flex-1 min-h-0 flex flex-col w-full max-w-[1340px] mx-auto px-0 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center justify-between mb-3 flex-none px-4 lg:px-0">
          <h1 className="text-2xl md:text-3xl font-bold text-pen">
            messages <span className="text-pink">伝</span><span className="text-tea">言</span>
          </h1>
          {currentUserId && (
            <span className="matcha-eyebrow">{onlineUsers.filter(u => u.id !== currentUserId && u.is_online).length} en ligne</span>
          )}
        </div>

        {error && <p className="text-red-500 mb-3 flex-none px-4 lg:px-0">Erreur : {error}</p>}

        <div className="flex-1 min-h-0">
          <MatchedChannelPreview
            selectedChannel={selectedChannel}
            setSelectedChannel={setSelectedChannel}
            onlineUsers={onlineUsers}
          />
        </div>
      </main>
    </div>
  );
}
