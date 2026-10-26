import { useState } from "react";
import AddTask from "./todo/AddTask";
import TodoItem from "./todo/TodoItem"

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTask = (text) => {
    setTodos([{ id: Date.now(), text, done: false, date: "Today" }, ...todos]);
  };
  

  const toggleTask = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const deleteTask = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };


  return (
    <>
      <AddTask onAdd={addTask} />
       {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      ))}
    </>
  );
}