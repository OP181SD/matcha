import { useEffect } from "react";

export const useTyping = (socket, channelId, setTypingUsers) => {
  useEffect(() => {
    if (!socket || !channelId) return;

    const handleTyping = ({ userId, channelId: id }) => {
      if (id !== channelId) return;

      setTypingUsers(prev => prev.includes(userId) ? prev : [...prev, userId]);

      setTimeout(() => setTypingUsers(prev => prev.filter(u => u !== userId)), 2000);
    };

    socket.on("userTyping", handleTyping);
    return () => socket.off("userTyping", handleTyping);
  }, [socket, channelId, setTypingUsers]);
};


