import { useState, useEffect } from "react";
import AddTask from "./todo/AddTask";
import TodoItem from "./todo/TodoItem";
import TodoFilter from "./todo/TodoFilter";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api/todo";
import "../styles/todo.css";

export default function Todo() {
  const [todo, setTodo] = useState([]); //array các task rỗng
  const [filter, setFilter] = useState("all");

  // Khi mở trang: lấy todos từ server
  useEffect(() => {
    getTodos()
      .then((res) => setTodo(res.data.data))
      .catch((err) => console.error(err));
  }, []);



  //sau khi người dùng nhập task => setTask tạo task và thêm vào array. Mỗi task có id, task, status, date

  const addTask = async (task) => {
    try {
      const res = await createTodo(task); //tạo task mới
      setTodo((prev) => [res.data.data, ...prev]); 
    } 
    catch (err) {
      console.error(err);
    }
  };


  const toggleTask = async (id) => {
    try {
      const current = todo.find((t) => t._id === id);                          // todo đang hiển thị
      const res = await updateTodo(id, { done: !current.done });               
      setTodo((prev) => prev.map((t) => (t._id === id ? res.data.data : t)));  
    } catch (err) {
      console.error(err);
    }
  };


  const deleteTask = async (id) => {
    try {
      const res = await deleteTodo(id);
      setTodo((prev) => prev.filter((a) => a._id !== id));

    } 
    catch (err) {
      console.error(err);
    }
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
              key={todo._id}
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