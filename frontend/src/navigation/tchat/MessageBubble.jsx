const DEFAULT_PICTURE = "https://cdn.jsdelivr.net/npm/openmoji@15.0.0/color/svg/1F375.svg";

export function MessageBubble({ msg, userId, gender, isTyping, avatarUrl }) {
  const isCurrentUser = msg?.sender_id === userId;

  const Avatar = () => (
    <img
      src={avatarUrl || DEFAULT_PICTURE}
      alt=""
      className="w-7 h-7 rounded-full object-cover border border-pen/60 flex-none self-end"
    />
  );

  if (isTyping) {
    return (
      <div className="flex items-end gap-2 justify-start">
        <Avatar />
        <div
          className="relative w-fit max-w-[80%] px-4 py-2 text-sm break-words overflow-hidden
            bg-white border border-pen/30 text-pen font-bold rounded-2xl rounded-bl-sm animate-pulse"
        >
          <span className="inline-block w-3 h-3 rounded-full bg-pen/40 mr-1 animate-bounce"></span>
          <span className="inline-block w-3 h-3 rounded-full bg-pen/40 mr-1 animate-bounce delay-150"></span>
          <span className="inline-block w-3 h-3 rounded-full bg-pen/40 animate-bounce delay-300"></span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-end gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}
      style={{
        animation: "fadeSlideIn 0.3s ease forwards",
        animationDelay: `${msg.id * 30}ms`,
      }}
    >
      {!isCurrentUser && <Avatar />}
      <div
        className={`relative w-fit max-w-[80%] px-4 py-2 text-sm break-words overflow-hidden font-bold
        ${isCurrentUser
            ? `${gender === "homme" ? "bg-tea" : "bg-pink"} text-pen rounded-2xl rounded-br-sm`
            : "bg-white border border-pen/30 text-pen rounded-2xl rounded-bl-sm"
          }
      `}
        style={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
        role="article"
        aria-label={isCurrentUser ? "Message envoyé" : "Message reçu"}
      >
        {msg.content}
      </div>
    </div>
  );
}
