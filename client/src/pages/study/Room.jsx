import useRoom from "../hooks/useRoom";
import { getRooms } from "../api/studyApi";
import UserList from "./UserList";
import Chat from "./Chat";

export default function Room({ roomId, userId, name, onLeave }) {
  const { users, userCount, messages, sendMessage } = useRoom(roomId, {
    id: userId,
    name,
  });

  const room = getRooms().find((r) => r.id === roomId);
  console.log("userCount: " + userCount);
  return (
    <>
      <div className="room-header">
        <div className="room-status">
          <div className="live-dot-wrap">
            <span className="live-ping" />
            <span className="live-dot" />
          </div>
          {room.icon} {room.name}
        </div>

        <div className="room-header-right">
          <span className="online-count">
            {userCount}/{room.capacity} people
          </span>
          <button className="leave-btn" onClick={onLeave}>
            Leave
          </button>
        </div>
      </div>

      <div>
        <div className="section-label">In this room</div>
        <UserList users={users} currentUserId={userId} />
      </div>

      <div>
        <div className="section-label">Room Chat</div>
        <Chat
          messages={messages}
          users={users}
          currentUserId={userId}
          onSend={sendMessage}
        />
      </div>
    </>
  );
}
