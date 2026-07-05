"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const timeline = [
  {
    year: "Early",
    place: "Peelkhana, Dhaka",
    title: "Where it started",
    detail: "Raised in Peelkhana — streets, stories, and curiosity.",
  },
  {
    year: "School",
    place: "BMARPC",
    title: "School & College",
    detail: "Built discipline and the first love for computers.",
  },
  {
    year: "College",
    place: "Rifles Public College",
    title: "Higher secondary",
    detail: "Science background, problem-solving mindset.",
  },
  {
    year: "2020 — Now",
    place: "Daffodil International University",
    title: "BSc in CSE",
    detail: "Computer Science & Engineering — algorithms to interfaces.",
  },
  {
    year: "Today",
    place: "Softvence · Dhaka",
    title: "Frontend Developer",
    detail: "React, Next.js, Tailwind — shipping UI that converts.",
  },
];

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "UI/UX",
  "REST APIs",
  "Git",
];

const links = [
  { label: "GitHub", href: "https://github.com/YEL-59" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tofayel-islam" },
  { label: "Live Site", href: "https://tofayel.vercel.app/" },
];

export default function VaultDossier() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="vault-page relative min-h-screen overflow-hidden">
      <div className="vault-noise pointer-events-none absolute inset-0 opacity-[0.04]" />
      <div className="vault-glow pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-red-600/20 blur-[120px]" />
      <div className="vault-glow pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-violet-600/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
        <div
          className={`mb-8 flex items-center justify-between transition-all duration-700 ${
            revealed ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-xs transition-colors hover:text-red-400"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to bento
          </Link>
          <div className="vault-stamp rounded border border-red-500/50 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-red-400 uppercase">
            Access Granted
          </div>
        </div>

        <header
          className={`vault-card relative overflow-hidden rounded-2xl border transition-all duration-700 delay-100 ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="absolute top-0 left-0 h-full w-[22%] bg-red-950/80" />
          <div className="absolute top-1/2 left-[22%] z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border bg-[var(--bg-primary)]" style={{ borderColor: "var(--border)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
              <rect width="18" height="11" x="3" y="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </svg>
          </div>

          <div className="relative flex flex-col gap-6 p-6 pl-[26%] md:flex-row md:items-center md:gap-8 md:p-8 md:pl-[28%]">
            <div className="vault-photo relative mx-auto shrink-0 md:mx-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-red-500/40 via-transparent to-violet-500/30 blur-sm" />
              <Image
                src="/tofayel.png"
                alt="Md. Tofayel Islam"
                width={140}
                height={175}
                className="relative rounded-xl border object-cover object-top"
                style={{ borderColor: "var(--border)" }}
                priority
              />
              <span className="absolute -right-2 -bottom-2 rounded-md bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white">
                YEL-59
              </span>
            </div>

            <div className="text-center md:text-left">
              <p className="text-[10px] tracking-[0.25em] text-red-400 uppercase">
                Classified Dossier · Level 4
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl" style={{ color: "var(--text-primary)" }}>
                Md. Tofayel Islam
              </h1>
              <p className="mt-1 text-sm font-medium text-violet-400">
                Frontend Developer
              </p>
              <p className="mt-3 max-w-md text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                BSc graduate in Computer Science & Engineering from{" "}
                <span className="text-red-300/90">Daffodil International University</span>.
                Dhaka-born, Peelkhana-raised — turning ideas into interfaces at{" "}
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>Softvence</span>.
              </p>
            </div>
          </div>
        </header>

        <div
          className={`mt-6 grid gap-4 transition-all duration-700 delay-200 md:grid-cols-2 ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="vault-card rounded-2xl border p-5">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-red-400 uppercase">
              Origin File
            </h2>
            <p className="mt-3 text-lg font-medium" style={{ color: "var(--text-primary)" }}>
              Peelkhana, Dhaka
            </p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Grew up in the heart of Dhaka. From school benches at BMARPC to
              college halls at Rifles Public College — every chapter pushed me
              closer to code.
            </p>
          </div>

          <div className="vault-card rounded-2xl border p-5">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-red-400 uppercase">
              Current Status
            </h2>
            <p className="mt-3 text-lg font-medium" style={{ color: "var(--text-primary)" }}>
              Building at Softvence
            </p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              2+ years crafting responsive, conversion-focused web apps with
              React, Next.js, and Tailwind. Open to collaborations & full-stack
              growth.
            </p>
          </div>
        </div>

        <div
          className={`vault-card mt-6 rounded-2xl border p-5 transition-all duration-700 delay-300 md:p-6 ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-red-400 uppercase">
            Education Trail
          </h2>
          <div className="mt-5 space-y-0">
            {timeline.map((item, i) => (
              <div key={item.title} className="vault-timeline-item relative flex gap-4 pb-6 last:pb-0">
                {i < timeline.length - 1 && (
                  <div className="absolute top-8 left-[5px] h-[calc(100%-12px)] w-px bg-gradient-to-b from-red-500/50 to-transparent" />
                )}
                <div className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-red-500 bg-[var(--bg-primary)]" />
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-[10px] font-medium text-violet-400">{item.year}</span>
                    <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {item.place}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>
                    {item.title}
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`mt-6 flex flex-wrap gap-2 transition-all duration-700 delay-[400ms] ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border px-3 py-1 text-[10px] font-medium"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
                background: "var(--bg-secondary)",
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        <div
          className={`vault-marquee mt-8 overflow-hidden rounded-xl border py-2 transition-all duration-700 delay-500 ${
            revealed ? "opacity-100" : "opacity-0"
          }`}
          style={{ borderColor: "var(--border)" }}
        >
          <div className="vault-marquee-track flex gap-8 text-[10px] tracking-widest uppercase" style={{ color: "var(--text-tertiary)" }}>
            {[...Array(2)].map((_, gi) => (
              <span key={gi} className="flex shrink-0 gap-8">
                <span>React · Next.js · TypeScript · Dhaka · DIU · Peelkhana · Frontend · UI · YEL-59 ·</span>
                <span>React · Next.js · TypeScript · Dhaka · DIU · Peelkhana · Frontend · UI · YEL-59 ·</span>
              </span>
            ))}
          </div>
        </div>

        <footer
          className={`mt-8 flex flex-wrap items-center justify-center gap-4 pb-8 transition-all duration-700 delay-[600ms] ${
            revealed ? "opacity-100" : "opacity-0"
          }`}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border px-4 py-2 text-xs transition-all hover:border-red-500/40 hover:text-red-400"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              {link.label}
            </a>
          ))}
        </footer>
      </div>
    </div>
  );
}
