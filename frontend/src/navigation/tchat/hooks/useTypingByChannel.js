import { useEffect } from "react";

export const useTypingByChannel = (socket, setTypingUsersByChannel) => {
  useEffect(() => {
    if (!socket) return;

    const handleUserTyping = ({ userId, channelId }) => {
      setTypingUsersByChannel(prev => ({
        ...prev,
        [channelId]: [...(prev[channelId] || []), userId],
      }));

      setTimeout(() => {
        setTypingUsersByChannel(prev => ({
          ...prev,
          [channelId]: (prev[channelId] || []).filter(id => id !== userId),
        }));
      }, 2000);
    };

    socket.on("userTyping", handleUserTyping);
    return () => socket.off("userTyping", handleUserTyping);
  }, [socket, setTypingUsersByChannel]);
};
