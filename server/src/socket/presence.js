// Presence được giữ trong bộ nhớ: roomId -> Map(socketId -> member)
const presence = new Map();

export function countInRoom(roomId) {
  return presence.get(roomId)?.size || 0;
}

export function addMember(roomId, socketId, member) {
  if (!presence.has(roomId)) presence.set(roomId, new Map());
  presence.get(roomId).set(socketId, member);
}

export function removeMember(roomId, socketId) {
  const room = presence.get(roomId);
  if (!room) return null;
  const member = room.get(socketId) || null;
  room.delete(socketId);
  if (room.size === 0) presence.delete(roomId);
  return member;
}

export function updateMember(roomId, socketId, patch) {
  const member = presence.get(roomId)?.get(socketId);
  if (member) Object.assign(member, patch);
}

export function listMembers(roomId) {
  return [...(presence.get(roomId)?.values() || [])];
}
