"use client";

interface ProgressRingProps {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
}

export default function ProgressRing({
  pct,
  size = 64,
  stroke = 6,
  color = '#FF8C00',
  trackColor = '#e2e8f0',
}: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const center = size / 2;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={center} cy={center} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}
