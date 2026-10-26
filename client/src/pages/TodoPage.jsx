import { useState } from "react";
import AddTask from "./todo/AddTask";
import TodoItem from "./todo/TodoItem"

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTask = (text) => {
    setTodos([{ id: Date.now(), text, done: false, date: "Today" }, ...todos]);
  };

  return (
    <>
      <AddTask onAdd={addTask} />
    </>
  );
}