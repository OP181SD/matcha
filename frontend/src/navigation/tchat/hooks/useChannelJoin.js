import { useEffect } from "react";

export const useChannelJoin = (socket, channelId) => {
  useEffect(() => {
    if (!socket || !channelId) return;
    socket.emit('joinChannels', [channelId]);
  }, [socket, channelId]);
};
