
import '../styles/tabBar.css'


const TABS = [
  { key: "pomodoro", label: "Pomodoro", icon: "🍅" },
  { key: "todo", label: "To-Do", icon: "✅" },
  { key: "together", label: "Study Together", icon: "🌿" },
];



function TabBar({ active, onChange }) {
  return (
    <div className="tabs">
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`tab-btn ${active === t.key ? "active" : ""}`}
        >
          <span className="icon">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  


  );
}

export default TabBar;