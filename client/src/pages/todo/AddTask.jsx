import { useState } from "react";
import "../../styles/todo.css"

export default function AddTask({ onAdd }) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const text = input.trim();
    if (!text) return;
    onAdd(text);
    setInput("");
  };

  return (
    <div className="todo-input-row">
      <input
        className="todo-input"
        type="text"
        placeholder="Add a task for today…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <button className="btn-red" onClick={handleAdd}>Add 🍅</button>
    </div>
  );

}
