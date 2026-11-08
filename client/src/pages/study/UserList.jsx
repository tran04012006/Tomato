export default function UserList({ users, currentUserId }) {
  return (
    <div className="users-list">
      {users.map((user) => (
        <div
          key={user.id}
          className={`user-row ${user.id === currentUserId ? "you" : ""}`}
        >
          <div
            className="avatar"
            style={{ background: user.color, color: "#fff" }}
          >
            {user.name.slice(0, 2).toUpperCase()}
          </div>

          <span className="user-name">
            {user.name}
            {user.id === currentUserId && " (you)"}
          </span>

          <div className="user-status">
            <span
              className="status-dot"
              style={{ background: user.status === "focus" ? "var(--red)" : "var(--green)" }}
            />
            <span className="status-text">
              {user.status === "focus" ? "Focusing" : "Break"}
            </span>
          </div>

          <span className="focus-time">{user.focusMinutes}m</span>
        </div>
      ))}
    </div>
  );
}