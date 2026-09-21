import type { CSSProperties } from "react";

/** Lightweight vector choreography also works when WebGL is unavailable. */
export default function SignalField() {
  return (
    <div className="signal-field ambient-scene" aria-hidden="true">
      <svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="signal-ink" x1="0" y1="1" x2="1" y2="0">
            <stop stopColor="#8295be" stopOpacity="0" />
            <stop offset=".48" stopColor="#d3f1a6" stopOpacity=".6" />
            <stop offset="1" stopColor="#e9ece2" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 7 }, (_, i) => (
          <g key={i} style={{ "--strand": i } as CSSProperties}>
            <path
              className="signal-strand"
              pathLength="100"
              d={`M ${260 + i * 19} 950 C ${980 - i * 20} 590, ${400 + i * 28} 260, ${1170 - i * 16} -50`}
            />
            <path
              className="signal-current"
              pathLength="100"
              d={`M ${260 + i * 19} 950 C ${980 - i * 20} 590, ${400 + i * 28} 260, ${1170 - i * 16} -50`}
            />
          </g>
        ))}
      </svg>
      <div className="signal-aura" />
    </div>
  );
}
