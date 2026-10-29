import { useEffect } from "react";

export const useNewMessages = (socket, selectedChannel, setLastReceivedMap) => {
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (!message.channelId) return;

      setLastReceivedMap(prev => ({
        ...prev,
        [message.channelId]: {
          content: message.content,
          receivedAt: Date.now(),
          senderId: message.sender_id,
          isRead: selectedChannel?.channel_id === message.channelId ? true : message.is_read,
        },
      }));
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedChannel, setLastReceivedMap]);
};
