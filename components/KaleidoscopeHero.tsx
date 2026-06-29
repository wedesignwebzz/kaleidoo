"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./KaleidoscopeHero.module.css";

const COLORS = ["#FF6A2B", "#FFC233", "#0FB5A6", "#2563EB", "#7A3CF0", "#EC2C82"];
const SIZE = 400;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R  = SIZE / 2 - 4;

/* A triangular wedge from centre → arc, starting at startDeg for spanDeg degrees */
function wedgePath(startDeg: number, spanDeg: number): string {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const x1 = CX + R * Math.sin(toRad(startDeg));
  const y1 = CY - R * Math.cos(toRad(startDeg));
  const x2 = CX + R * Math.sin(toRad(startDeg + spanDeg));
  const y2 = CY - R * Math.cos(toRad(startDeg + spanDeg));
  const large = spanDeg > 180 ? 1 : 0;
  return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
}

/* 12 wedges of 30° each: colours cycle in pairs (normal + slightly lighter) */
const WEDGES = Array.from({ length: 12 }, (_, i) => ({
  path:    wedgePath(i * 30, 30),
  color:   COLORS[Math.floor(i / 2) % COLORS.length],
  opacity: i % 2 === 0 ? 1 : 0.65,
}));

const LABELS = [
  { text: "Deep focus",            pct: { x: 75, y: 22 } },
  { text: "Pattern spotting",      pct: { x: 78, y: 72 } },
  { text: "Honest, literal clarity", pct: { x: 14, y: 60 } },
];

export default function KaleidoscopeHero() {
  const [rotation, setRotation] = useState(0);
  const [paused,   setPaused]   = useState(false);
  const rafRef  = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const accRef  = useRef(0);

  /* Watch Calm mode class + OS reduced-motion preference */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () =>
      setPaused(mq.matches || document.body.classList.contains("calm"));

    update();
    mq.addEventListener("change", update);

    const obs = new MutationObserver(update);
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => {
      mq.removeEventListener("change", update);
      obs.disconnect();
    };
  }, []);

  /* rAF spin — 46 s per full revolution */
  useEffect(() => {
    if (paused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastRef.current = null;
      return;
    }

    const DEG_PER_MS = 360 / (46 * 1000);

    function tick(ts: number) {
      if (lastRef.current !== null) {
        accRef.current += (ts - lastRef.current) * DEG_PER_MS;
        setRotation(accRef.current % 360);
      }
      lastRef.current = ts;
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [paused]);

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        className={styles.svg}
        role="img"
        aria-label="Kaleidoscope illustration — spinning coloured wedges"
      >
        <defs>
          <clipPath id="k-circle">
            <circle cx={CX} cy={CY} r={R} />
          </clipPath>
        </defs>

        {/* Spinning wedges */}
        <g clipPath="url(#k-circle)" transform={`rotate(${rotation} ${CX} ${CY})`}>
          {WEDGES.map((w, i) => (
            <path key={i} d={w.path} fill={w.color} opacity={w.opacity} />
          ))}
        </g>

        {/* Outer border */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#1B1230" strokeWidth={3} />

        {/* Centre core */}
        <circle cx={CX} cy={CY} r={50} fill="#1B1230" />
        <text
          x={CX} y={CY - 7}
          textAnchor="middle"
          fill="#FAF6EF"
          fontSize="14"
          fontFamily="Bricolage Grotesque, sans-serif"
          fontWeight="800"
          letterSpacing="-0.03em"
        >
          You
        </text>
        <text
          x={CX} y={CY + 10}
          textAnchor="middle"
          fill="rgba(250,246,239,0.55)"
          fontSize="9"
          fontFamily="Atkinson Hyperlegible, serif"
        >
          refracted
        </text>
      </svg>

      {/* Floating pill labels */}
      <div className={styles.labels} aria-hidden="true">
        {LABELS.map(({ text, pct }) => (
          <span
            key={text}
            className={styles.floatingPill}
            style={{ left: `${pct.x}%`, top: `${pct.y}%` }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
