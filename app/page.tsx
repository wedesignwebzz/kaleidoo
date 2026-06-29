import Nav from "@/components/Nav";
import KaleidoscopeHero from "@/components/KaleidoscopeHero";
import WaitlistForm from "@/components/WaitlistForm";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function Page() {
  return (
    <>
      <Nav />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className={styles.hero} aria-label="Introduction">
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroContent}>
              <span className={`pill ${styles.eyebrow}`}>
                ◆ Hiring, refracted
              </span>

              <h1 className={styles.headline}>
                Get hired for what you{" "}
                <span className={styles.doWord}>do</span>,<br />
                not how you interview.
              </h1>

              <p className={styles.lede}>
                Kaleidoo matches neurodivergent talent with employers through
                short, paid work trials. You show up, do the actual work, and
                decisions are made on evidence — not how well you perform under
                interview pressure.
              </p>

              <a href="#join" className="btn btn-primary">
                Join the waitlist
              </a>
            </div>

            <div className={styles.heroVisual} aria-hidden="true">
              <KaleidoscopeHero />
            </div>
          </div>
        </section>

        {/* ── What we're building ───────────────────────────────────────── */}
        <section className={styles.building} aria-label="What we're building">
          <div className="container">
            <div className={styles.buildingHeader}>
              <span className={`pill ${styles.comingSoonPill}`}>
                Platform launching soon
              </span>
              <h2>What we&apos;re building</h2>
              <p>
                A hiring process that works with how neurodivergent people
                actually think and work — not against it.
              </p>
            </div>

            <ol className={styles.featureList} role="list">
              <li className={`card ${styles.featureCard}`}>
                <div
                  className={styles.featureNumber}
                  style={{ "--accent": "var(--teal)" } as React.CSSProperties}
                >
                  1
                </div>
                <div>
                  <h3>Show your strengths</h3>
                  <p>
                    Build a profile around how you actually work — your focus
                    style, communication preferences, and the environments where
                    you do your best. No AI-optimised buzzwords, no masks.
                  </p>
                </div>
              </li>

              <li className={`card ${styles.featureCard}`}>
                <div
                  className={styles.featureNumber}
                  style={
                    { "--accent": "var(--violet)" } as React.CSSProperties
                  }
                >
                  2
                </div>
                <div>
                  <h3>Take a paid trial</h3>
                  <p>
                    Do the real work: a short, time-boxed task that mirrors what
                    the role actually involves. You get paid for your time
                    regardless of the outcome. No unpaid homework.
                  </p>
                </div>
              </li>

              <li className={`card ${styles.featureCard}`}>
                <div
                  className={styles.featureNumber}
                  style={
                    { "--accent": "var(--tangerine)" } as React.CSSProperties
                  }
                >
                  3
                </div>
                <div>
                  <h3>Get hired on the evidence</h3>
                  <p>
                    Hiring decisions come from what you delivered — not small
                    talk, eye contact, or how polished your answers were. The
                    work speaks for itself.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* ── Waitlist ──────────────────────────────────────────────────── */}
        <section
          id="join"
          className={styles.waitlistSection}
          aria-label="Join the waitlist"
        >
          <div className="container">
            <div className={styles.waitlistWrap}>
              <div className={styles.waitlistCopy}>
                <h2>Be first to know when we open.</h2>
                <p>
                  We&apos;re in development and moving deliberately. Sign up and
                  we&apos;ll reach out as soon as Kaleidoo is ready for you.
                </p>
                <p className={styles.waitlistNote}>
                  Candidates always join free. No spam — just a heads-up when
                  we launch.
                </p>
              </div>
              <div className={`card ${styles.formCard}`}>
                <WaitlistForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
