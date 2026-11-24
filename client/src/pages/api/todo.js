import api from "../../api/axios";

export const getTodos = () => api.get("/todo");
export const createTodo = (task) => api.post("/todo", { task });
export const updateTodo = (id, changes) => api.patch(`/todo/${id}`, changes);
export const deleteTodo = (id) => api.delete(`/todo/${id}`);
