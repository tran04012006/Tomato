import "../../styles/todo.css";

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        className="todo-check"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      <span className={todo.done ? "todo-text done" : "todo-text"}>
        {todo.text}
      </span>
      <span className="todo-date">{todo.date}</span>
      <button className="del-btn" onClick={() => onDelete(todo.id)}>
        ✕
      </button>
    </div>
  );
}