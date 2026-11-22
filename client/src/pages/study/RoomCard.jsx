export default function RoomCard({ room, onJoin }) {
  const { id, name, desc, icon, capacity, count } = room;
  const full = count >= capacity;

  return (
    <div
      className={`room-card ${full ? "full" : ""}`}
      onClick={() => !full && onJoin(id)}
    >
      <div className="room-card-icon">{icon}</div>

      <div className="room-card-info">
        <div className="room-card-name">{name}</div>
        <div className="room-card-desc">{desc}</div>
      </div>

      <div className="room-card-right">
        <span className={`room-slots ${full ? "full" : "open"}`}>
          {count}/{capacity}
        </span>
        <div className="room-pips">
          {Array.from({ length: capacity }, (_, i) => (
            <span key={i} className={`room-pip ${i < count ? "on" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}