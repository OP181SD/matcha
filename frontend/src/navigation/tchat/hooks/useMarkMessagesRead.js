import { useEffect } from "react";

export const useMarkMessagesRead = (socket, channelId, setMessages) => {
  useEffect(() => {
    if (!socket || !channelId) return;

    socket.emit("markMessagesAsRead", { channelId });
    setMessages(prev => prev.map(msg => ({ ...msg, is_read: true, read_at: msg.read_at || new Date().toISOString() })));

    const handleMessagesRead = ({ channelId: id, readAt }) => {
      if (id !== channelId) return;
      setMessages(prev => prev.map(msg => ({ ...msg, is_read: true, read_at: msg.read_at || readAt })));
    };

    socket.on("messagesRead", handleMessagesRead);
    return () => socket.off("messagesRead", handleMessagesRead);
  }, [socket, channelId, setMessages]);
};


