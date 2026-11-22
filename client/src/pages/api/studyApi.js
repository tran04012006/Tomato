import { ROOMS, USERS, MESSAGES } from "../mock/studyData";

export const getRooms = () =>
  ROOMS.map((room) => ({
    ...room,
    count: USERS.filter((u) => u.roomId === room.id).length,
  }));;
  
export const getUsers = () => USERS;
export const getMessages = () => MESSAGES;