import { useState, useEffect, useRef } from "react";

export default function Chat({ messages, users, currentUserId, onSend }) {
  const [text, setText] = useState("");
  const boxRef = useRef(null);

  // Tự cuộn xuống khi có tin mới
  useEffect(() => {
    const box = boxRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  // const findUser = (id) => users.find((u) => u.id === id);

  return (
    <div className="chat">
      <div className="chat-box" ref={boxRef}>
        {messages.length === 0 && (
          <p className="chat-empty">No messages yet. Start the conversation!</p>
        )}

        {messages.map((message) => (
          <div key={message.id} className="chat-msg">
            <span className="chat-user">
              {message.userId === currentUserId
                ? "You"
                : message.name || "Guest"}
              :
            </span>

            <span className="chat-text">{message.text}</span>
          </div>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          type="text"
          placeholder="Say something..."
          maxLength={500}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />
      </div>
    </div>
  );
}
