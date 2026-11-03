export default function NameBar({ name, onChange, showHint }) {
  return (
    <div className="name-bar">
      <div className="section-label">Your name</div>
      <div className="name-row">
        <input
          className="chat-input"
          type="text"
          placeholder="Enter your name..."
          maxLength={20}
          value={name}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {showHint && <div className="name-hint">Please enter your name!</div>}
    </div>
  );
}