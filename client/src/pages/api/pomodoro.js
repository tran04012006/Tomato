import api from "../../api/axios";

export const createSession = (minutes) => api.post("/pomodoro/sessions", { minutes });
export const getStats = () => api.get("/pomodoro/stats");