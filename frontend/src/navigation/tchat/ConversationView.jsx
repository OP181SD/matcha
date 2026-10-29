import { useState, useEffect, useRef } from "react";
import { ChatHeader } from "./ChatHeader.jsx";
import { MessageBubble } from "./MessageBubble.jsx";
import { MessageInput } from "./MessageInput.jsx";
import { getTimeAgo } from "../../utils/time.js";
import { useChannelJoin } from "./hooks/useChannelJoin.js";

import { useTyping } from "./hooks/useTyping.js";
import { useMarkMessagesRead } from "./hooks/useMarkMessagesRead.js";
import { useMessages } from "./hooks/useMessages.js";
import { useOnlineStatus } from "./hooks/useOnlineStatus.js";

const getReadReceiptText = (readAt) => {
  if (!readAt) return null;
  const diffSec = Math.floor((Date.now() - new Date(readAt).getTime()) / 1000);
  if (diffSec < 60) return "Vu à l'instant";
  return `Vu ${getTimeAgo(readAt)}`;
};

export function ConversationView({ channel, onBack, socket, user, gender, setLastReceivedMap }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineInfo, setOnlineInfo] = useState(null);
  const [sendError, setSendError] = useState('');
  const messagesEndRef = useRef(null);

  useChannelJoin(socket, channel?.channel_id);
  useTyping(socket, channel?.channel_id, setTypingUsers);
  useMarkMessagesRead(socket, channel?.channel_id, setMessages);
  useMessages(socket, channel?.channel_id, setMessages);
  useOnlineStatus(socket, channel, setOnlineInfo);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, typingUsers]);

  useEffect(() => {
    if (!socket) return;
    const handleMessageError = ({ channelId, error }) => {
      if (channelId && channelId !== channel?.channel_id) return;
      setSendError(error || "Message non envoyé.");
    };
    socket.on('messageError', handleMessageError);
    return () => socket.off('messageError', handleMessageError);
  }, [socket, channel?.channel_id]);

  useEffect(() => { setSendError(''); }, [channel?.channel_id]);

  useEffect(() => {
    if (!socket || !channel?.channel_id) return;
    const last = messages[messages.length - 1];
    if (last && last.sender_id !== user?.id && !last.is_read) {
      socket.emit("markMessagesAsRead", { channelId: channel.channel_id });
      setMessages(prev => prev.map(m =>
        m.sender_id !== user?.id && !m.is_read
          ? { ...m, is_read: true, read_at: new Date().toISOString() }
          : m
      ));
    }
  }, [messages, socket, channel?.channel_id, user?.id]);

  const [, forceTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const lastMessage = messages[messages.length - 1];

  const statusText = lastMessage?.sender_id === user?.id
    ? (lastMessage.is_read ? getReadReceiptText(lastMessage.read_at) : "Envoyé")
    : null;

  const sendMessage = () => {
    if (!socket || !socket.connected || !newMessage.trim()) return;

    socket.emit('sendMessage', {
      channelId: channel.channel_id,
      content: newMessage,
      gender,
    });
    setNewMessage('');

    setLastReceivedMap(prev => ({
      ...prev,
      [channel.channel_id]: {
        content: newMessage,
        receivedAt: Date.now(),
        senderId: user.id,
        isRead: true,
      },
    }));
  };

  return (
    <div className="flex flex-col h-full w-full bg-matcha">
      <div className="w-full border-b border-pen/60">
        <ChatHeader
          channel={channel}
          onBack={onBack}
          isOnline={!channel.is_blocked && onlineInfo?.is_online}
          lastSeen={onlineInfo?.last_seen || channel.last_seen}
          isBlocked={channel.is_blocked}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto px-4 md:px-8 max-w-3xl space-y-3 py-4">
          <div className="flex justify-center items-center text-sm text-pen/40 mb-2">
            Ceci est le début de votre conversation
          </div>

          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} userId={user?.id} gender={gender} avatarUrl={channel.profile_picture} />
          ))}

          {typingUsers.length > 0 && (
            <MessageBubble key="typing" isTyping={true} gender={gender === "homme" ? "homme" : "femme"} avatarUrl={channel.profile_picture} />
          )}
          {statusText && (
            <p className="text-xs text-pen/40 text-right pr-2">{statusText}</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {channel.is_blocked ? (
        <p className="text-center text-sm font-bold text-pen/60 italic bg-pen/5 py-4 px-4" role="alert">
          Vous ne pouvez plus envoyer de message à cette personne.
        </p>
      ) : (
        <>
          {sendError && (
            <p className="text-center text-sm font-bold text-pink bg-pink/10 py-2 px-4" role="alert" aria-live="assertive">
              {sendError}
            </p>
          )}

          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            gender={gender}
            socket={socket}
            channel={channel}
          />
        </>
      )}
    </div>
  );
}
