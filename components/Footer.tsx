import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        <p className={styles.desc}>
          Kaleidoo is a neurodiversity-first hiring platform in development —
          matching people to work through evidence, not interviews.
        </p>
        <div className={styles.meta}>
          <a href="mailto:kaleidoojobsearch@gmail.com">
            kaleidoojobsearch@gmail.com
          </a>
          <span>·</span>
          <span>© {year} Kaleidoo</span>
          <span>·</span>
          <span className={styles.dev}>Full platform in development</span>
        </div>
      </div>
    </footer>
  );
}
