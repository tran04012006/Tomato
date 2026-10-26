import "../../styles/todo.css";

const FILTERS = ["all", "active", "done"];

export default function TodoFilter({ filter, onChange }) {
  return (
    <div className="filter-row">
      {FILTERS.map((f) => (
        <button
          key={f}
          className={filter === f ? "filter-btn active" : "filter-btn"}
          onClick={() => onChange(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}