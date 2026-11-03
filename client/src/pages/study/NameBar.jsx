export default function NameBar({ name, onChange, showHint }) {
  return (
    <div className="name-bar">
      <div className={`section-label ${showHint ? "error" : ""}`}>
        {showHint ? "Please enter your name!" : "Your name"}
      </div>
      <div className="name-row">
        <input
          className={`chat-input ${showHint ? "error" : ""}`}
          type="text"
          placeholder="Enter your name..."
          maxLength={20}
          value={name}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}