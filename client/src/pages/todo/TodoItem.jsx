import "../../styles/todo.css";

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        className="todo-check"
        checked={todo.done}
        onChange={() => onToggle(todo._id)}
      />
      <span className={todo.done ? "todo-text done" : "todo-text"}>
        {todo.task}
      </span>
      <span className="todo-date">{new Date(todo.createdAt).toLocaleDateString("vi-VN")}</span>
      <button className="del-btn" onClick={() => onDelete(todo._id)}>
        ✕
      </button>
    </div>
  );
}