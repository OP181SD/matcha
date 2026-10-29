import { useEffect, useRef } from "react";
import api from "../../../utils/api.js";

export const useOnlineStatus = (socket, channel, setOnlineInfo) => {
  const wasOnlineRef = useRef(null);

  useEffect(() => {
    if (!socket || !channel?.matched_user_id) return;

    const updateOnlineInfo = (users) => {
      const matchedUser = users.find(
        u => u.id === channel.matched_user_id
      );
      const isOnlineNow = !!matchedUser?.is_online;

      setOnlineInfo(prev => {
        if (isOnlineNow) {
          wasOnlineRef.current = true;
          return { is_online: true };
        }

        const justWentOffline = wasOnlineRef.current === true;
        wasOnlineRef.current = false;
        return {
          is_online: false,
          last_seen: justWentOffline ? new Date().toISOString() : prev?.last_seen,
        };
      });
    };

    const handleUserOffline = ({ id }) => {
      if (id !== channel.matched_user_id) return;

      wasOnlineRef.current = false;
      setOnlineInfo({ is_online: false, last_seen: new Date().toISOString() });
    };

    const fetchOnlineStatus = async () => {
      try {
        const { data } = await api.get("/api/authOnlineUsers");
        updateOnlineInfo(data);
      } catch (err) {
      }
    };

    fetchOnlineStatus();

    socket.on("onlineUsers", updateOnlineInfo);
    socket.on("userOffline", handleUserOffline);

    return () => {
      socket.off("onlineUsers", updateOnlineInfo);
      socket.off("userOffline", handleUserOffline);
    };
  }, [socket, channel, setOnlineInfo]);
};
