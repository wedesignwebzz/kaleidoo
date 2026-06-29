import CalmToggle from "./CalmToggle";
import styles from "./Nav.module.css";

function LogoMark() {
  /* Conic-gradient "K" mark — SVG with six brand-colour wedges */
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="circle-clip">
          <circle cx="18" cy="18" r="17" />
        </clipPath>
      </defs>
      {/* Six wedges — each 60°, brand colours in order */}
      {[
        { color: "#FF6A2B", rot: 0 },
        { color: "#FFC233", rot: 60 },
        { color: "#0FB5A6", rot: 120 },
        { color: "#2563EB", rot: 180 },
        { color: "#7A3CF0", rot: 240 },
        { color: "#EC2C82", rot: 300 },
      ].map(({ color, rot }) => (
        <path
          key={rot}
          d="M18 18 L18 1 A17 17 0 0 1 32.7 9.5 Z"
          fill={color}
          transform={`rotate(${rot} 18 18)`}
          clipPath="url(#circle-clip)"
        />
      ))}
      <circle cx="18" cy="18" r="6" fill="#1B1230" />
      <circle cx="18" cy="18" r="17" stroke="#1B1230" strokeWidth="2" fill="none" />
    </svg>
  );
}

export default function Nav() {
  return (
    <header className={styles.nav} role="banner">
      <div className={`container ${styles.inner}`}>
        <a href="/" className={styles.logo} aria-label="Kaleidoo home">
          <LogoMark />
          <span className={styles.wordmark}>Kaleidoo</span>
        </a>
        <nav aria-label="Site navigation">
          <CalmToggle />
        </nav>
      </div>
    </header>
  );
}
