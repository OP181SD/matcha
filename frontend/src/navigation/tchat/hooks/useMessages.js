import { useEffect } from "react";
import api from "../../../utils/api.js";


export const useMessages = (socket, channelId, setMessages) => {
  useEffect(() => {
    if (!channelId) return;

    const fetchMessages = async () => {
      try {

        const { data } = await api.get(`/api/messages/${channelId}`);
        setMessages(data);
      } catch (err) {
      }
    };

    fetchMessages();
  }, [channelId, setMessages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      setMessages(prev => [...prev, msg]);
    };

    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [socket, setMessages]);
};
