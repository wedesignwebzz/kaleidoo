"use client";

import { useEffect, useState } from "react";
import styles from "./CalmToggle.module.css";

const STORAGE_KEY = "k_calm";

export default function CalmToggle() {
  const [calm, setCalm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial = stored === "1";
    setCalm(initial);
    document.body.classList.toggle("calm", initial);
    setMounted(true);
  }, []);

  function toggle() {
    const next = !calm;
    setCalm(next);
    document.body.classList.toggle("calm", next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  }

  /* Avoid flash of wrong state — render as unchecked until hydrated */
  if (!mounted) {
    return (
      <button
        className={styles.toggle}
        aria-pressed={false}
        aria-label="Calm mode"
        disabled
      >
        <span className={styles.track}>
          <span className={styles.thumb} />
        </span>
        <span className={styles.label}>Calm</span>
      </button>
    );
  }

  return (
    <button
      className={styles.toggle}
      aria-pressed={calm}
      aria-label={calm ? "Calm mode on — click to turn off" : "Calm mode off — click to turn on"}
      onClick={toggle}
    >
      <span className={`${styles.track} ${calm ? styles.trackOn : ""}`}>
        <span className={`${styles.thumb} ${calm ? styles.thumbOn : ""}`} />
      </span>
      <span className={styles.label}>Calm</span>
    </button>
  );
}
