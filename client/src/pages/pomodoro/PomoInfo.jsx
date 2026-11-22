import { POMO_TIPS, POMO_FACTS } from "./constants";

export default function PomoInfo({ mode }) {
  return (
    <div className="pomo-info">
      <p className="tomato-fact">{POMO_FACTS[mode]}</p>
      <p className="pomo-tip">{POMO_TIPS[mode]}</p>
    </div>
  );
}