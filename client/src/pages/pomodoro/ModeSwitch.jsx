import { MODE_LABELS } from "./constants";

export default function ModeSwitch({ mode, onChange }) {
    return (
        <div className="pomo-modes">
            {Object.entries(MODE_LABELS).map(([key, label]) => (
                <button
                    key={key}
                    className={`mode-btn ${mode === key ? "active" : ""}`}
                    onClick={() => onChange(key)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}