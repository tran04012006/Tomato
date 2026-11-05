export const AVATAR_COLORS = ["#d4453a", "#4a9c5d", "#e0a030", "#5b7fd6", "#9b59b6"];

export const ROOMS = [
  { id: "r1", name: "Deep Focus", desc: "Im lặng, tập trung tối đa", icon: "🎯", capacity: 6 },
  { id: "r2", name: "Chill Study", desc: "Vừa học vừa trò chuyện nhẹ", icon: "☕", capacity: 6 },
  { id: "r3", name: "Exam Sprint", desc: "Ôn thi nước rút", icon: "🔥", capacity: 6 },
];

export const USERS = [
  { id: "u1", name: "Linh", roomId: "r1", status: "focus", focusMinutes: 42, color: AVATAR_COLORS[0] },
  { id: "u2", name: "Minh", roomId: "r1", status: "break", focusMinutes: 15, color: AVATAR_COLORS[1] },
  { id: "u3", name: "An", roomId: "r2", status: "focus", focusMinutes: 70, color: AVATAR_COLORS[2] },
  { id: "u4", name: "Huy", roomId: "r3", status: "focus", focusMinutes: 25, color: AVATAR_COLORS[3] },
  { id: "u5", name: "Vy", roomId: "r3", status: "focus", focusMinutes: 33, color: AVATAR_COLORS[4] },
];

export const MESSAGES = [
  { id: "m1", roomId: "r1", userId: "u1", text: "Cố lên nhé mọi người!", ts: 1730000000000 },
  { id: "m2", roomId: "r1", userId: "u2", text: "Mình nghỉ 5 phút rồi quay lại 🍅", ts: 1730000060000 },
];