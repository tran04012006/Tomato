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

  const findUser = (id) => users.find((u) => u.id === id);

  return (
    <div className="chat">
      <div className="chat-box" ref={boxRef}>
        {messages.map((m) => {
          const user = findUser(m.userId);
          return (
            <div key={m.id} className="chat-msg">
              <span
                className="chat-user"
                style={{ color: user?.color || "var(--text)" }}
              >
                {m.userId === currentUserId ? "You" : user?.name || "?"}:
              </span>
              <span className="chat-text">{m.text}</span>
            </div>
          );
        })}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          type="text"
          placeholder="Say something..."
          maxLength={200}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
      </div>
    </div>
  );
}
