import { useState } from "react";
import AddTask from "./todo/AddTask";
import TodoItem from "./todo/TodoItem";
import TodoFilter from "./todo/TodoFilter";

export default function Todo() {
  const [todo, setTodo] = useState([]); //array các task rỗng
  const [filter, setFilter] = useState("all");

  const addTask = (task) => {
    setTodo([{ id: Date.now(), task, done: false, date: "Today" }, ...todo]);
  };
  //sau khi người dùng nhập task => setTask tạo task và thêm vào array. Mỗi task có id, task, status, date


  const toggleTask = (id) => {
    setTodo(
      todo.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo //chuyển status nếu đúng id
      )
    );
  };

  // giữ lại nếu todo.id != id cần xóa
  const deleteTask = (id) => {
    setTodo(todo.filter((todo) => todo.id !== id));
  };

  //"all"=> hiện hết, active => hiện task status chưa hoàn thành 
  const visibletodo = todo.filter((todo) =>
    filter === "all" ? true : filter === "active" ? !todo.done : todo.done

  );

  // hiện khi empty
  const emptyMsg =
    filter === "done" ? "Nothing completed yet." : "No tasks here.";

  //thanh hoàn thành 
  const doneCount = todo.filter((todo) => todo.done).length;
  const percent = todo.length ? (doneCount / todo.length) * 100 : 0;





  return (
    <main className="panel active">
      {/* thanh hoàn thành*/}
      <section className="progress-row">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: percent + "%" }} />
        </div>
        <span className="progress-label">🍅 {doneCount} / {todo.length}</span>
      </section>

      <AddTask onAdd={addTask} //add task
      />

      <TodoFilter  // chọn filter
        filter={filter}
        onChange={setFilter}
      />

      {visibletodo.length === 0 ? (
        <div className="todo-empty">
          🍅
          <p>{emptyMsg}</p>
        </div>
      ) : (
        <ul className="todo-list">
          {visibletodo.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </ul>
      )}
    </main>
  );
}