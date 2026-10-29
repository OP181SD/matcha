import { useEffect, useRef } from "react";

export function MessageInput({ newMessage, setNewMessage, sendMessage, gender, socket, channel }) {
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!socket || !channel?.channel_id) return;

    if (newMessage.trim() !== "") {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", { channelId: channel.channel_id 
        });
      }, 300);
    }
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [newMessage, socket, channel?.channel_id]);

  return (
    <div className="bg-matcha border-t border-pen/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center border-opacity-70 border border-pen/60 rounded-full px-4 py-2">
          <input
            type="text"
            name="message"
            aria-label="Message"
            autoComplete="off"
            placeholder="Envoyer un message..."
            value={newMessage}
            maxLength={1000}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-grow bg-transparent outline-none placeholder-pen text-pen text-sm font-bold"
          />
          <button
            onClick={sendMessage}
            className={`ml-3 p-2 rounded-full text-pen border border-pen/60 matcha-shadow-sm transition
              ${gender === "homme"
                ? "bg-tea hover:bg-tea/90"
                : "bg-pink hover:bg-pink/90"}`}
            aria-label="Envoyer message"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}