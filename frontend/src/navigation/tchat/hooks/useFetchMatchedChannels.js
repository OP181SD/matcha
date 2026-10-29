import { useState, useEffect } from "react";
import api from "../../../utils/api.js";

export const useFetchMatchedChannels = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [gender, setGender] = useState("");
  const [lastReceivedMap, setLastReceivedMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: channelsData } = await api.get("/api/channels");
        const channels = Array.isArray(channelsData) ? channelsData : [];
        setMatchedUsers(channels);

        const { data: dataGender } = await api.get("/api/gender");
        setGender(dataGender.gender);

        const lastMessages = await Promise.all(
          channels.map(async channel => {
            try {
              const { data } = await api.get(`/api/messages/${channel.channel_id}/last`);
              return { channelId: channel.channel_id, lastMessage: data.message };
            } catch {
              return null;
            }
          })
        );
        

        const lastMap = {};
        lastMessages.forEach(({ channelId, lastMessage }) => {
          if (lastMessage) {
            lastMap[channelId] = {
              content: lastMessage.content,
              receivedAt: new Date(lastMessage.created_at).getTime(),
              senderId: lastMessage.sender_id,
              isRead: lastMessage.is_read,
            };
          }
        });
        setLastReceivedMap(lastMap);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { matchedUsers, gender, lastReceivedMap, setLastReceivedMap, isLoading };
};
