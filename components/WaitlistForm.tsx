"use client";

import { useState, useId } from "react";
import styles from "./WaitlistForm.module.css";

type Interest = "talent" | "employer" | "both" | "investor";

export default function WaitlistForm() {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interest, setInterest] = useState<Interest | "">("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || status === "success") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          interest: interest || undefined,
          company_website: honeypot, // honeypot — bots fill this, humans don't
        }),
      });

      const data: { ok: boolean; error?: string } = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Could not reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <span className={styles.successIcon} aria-hidden="true">✓</span>
        <h3>You&apos;re on the list.</h3>
        <p>We&apos;ll be in touch when Kaleidoo opens. Thanks for your interest.</p>
      </div>
    );
  }

  const INTERESTS: { value: Interest; label: string }[] = [
    { value: "talent",   label: "Talent" },
    { value: "employer", label: "Employer" },
    { value: "both",     label: "Both" },
    { value: "investor", label: "Investor" },
  ];

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {/* Honeypot — hidden from real users, filled by bots */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Leave this blank</label>
        <input
          id={`${uid}-website`}
          type="text"
          name="company_website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${uid}-email`}>
          Email address <span className={styles.required} aria-hidden="true">*</span>
        </label>
        <input
          id={`${uid}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
          disabled={status === "loading"}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${uid}-name`}>
          Name <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id={`${uid}-name`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          placeholder="Your name"
          disabled={status === "loading"}
        />
      </div>

      <fieldset className={styles.fieldset}>
        <legend>
          I&apos;m interested as <span className={styles.optional}>(optional)</span>
        </legend>
        <div className={styles.segmented} role="group">
          {INTERESTS.map(({ value, label }) => (
            <label
              key={value}
              className={`${styles.segment} ${interest === value ? styles.segmentActive : ""}`}
            >
              <input
                type="radio"
                name={`${uid}-interest`}
                value={value}
                checked={interest === value}
                onChange={() => setInterest(value)}
                disabled={status === "loading"}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {status === "error" && (
        <div className={styles.error} role="alert" aria-live="assertive">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        className={`btn btn-primary ${styles.submitBtn}`}
        disabled={status === "loading"}
        aria-busy={status === "loading"}
      >
        {status === "loading" ? "Sending…" : "Join the list"}
      </button>

      <p className={styles.microcopy}>
        Candidates always join free. No spam — just a heads-up when we launch.
      </p>
    </form>
  );
}
