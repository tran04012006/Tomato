import useRooms from "../hooks/useRooms";
import RoomCard from "./RoomCard";

export default function RoomPicker({ onJoin }) {
  const rooms = useRooms();

  return (
    <div>
      <div className="section-label">Chọn phòng học</div>
      <div className="room-list">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} onJoin={onJoin} />
        ))}
      </div>
    </div>
  );
}