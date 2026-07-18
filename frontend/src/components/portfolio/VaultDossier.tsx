"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePortfolio } from "../PortfolioProvider";

export default function VaultDossier() {
  const { data } = usePortfolio();
  const [revealed, setRevealed] = useState(false);

  const profile = data?.profile;
  const timeline = useMemo(
    () =>
      data?.education?.length
        ? data.education.map((e) => ({
            year: e.year,
            place: e.place,
            title: e.title,
            detail: e.detail,
          }))
        : [],
    [data?.education]
  );
  const skills = useMemo(
    () =>
      data?.skills?.length
        ? data.skills.map((s) => s.label)
        : ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    [data?.skills]
  );
  const links = useMemo(
    () =>
      data?.socialLinks?.filter((l) => l.placement === "vault").length
        ? data.socialLinks
            .filter((l) => l.placement === "vault")
            .map((l) => ({ label: l.label, href: l.href }))
        : [
            { label: "GitHub", href: "https://github.com/YEL-59" },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/tofayel-islam",
            },
          ],
    [data?.socialLinks]
  );

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
          <div
            className="absolute top-1/2 left-[22%] z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border bg-[var(--bg-primary)]"
            style={{ borderColor: "var(--border)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
              <rect width="18" height="11" x="3" y="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </svg>
          </div>

          <div className="relative flex flex-col gap-6 p-6 pl-[26%] md:flex-row md:items-center md:gap-8 md:p-8 md:pl-[28%]">
            <div className="vault-photo relative mx-auto shrink-0 md:mx-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-red-500/40 via-transparent to-violet-500/30 blur-sm" />
              <Image
                src={profile?.avatarUrl ?? "/tofayel.png"}
                alt={profile?.displayName ?? "Md. Tofayel Islam"}
                width={140}
                height={175}
                className="relative rounded-xl border object-cover object-top"
                style={{ borderColor: "var(--border)" }}
                priority
              />
              <span className="absolute -right-2 -bottom-2 rounded-md bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white">
                {profile?.handle ?? "YEL-59"}
              </span>
            </div>

            <div className="text-center md:text-left">
              <p className="text-[10px] tracking-[0.25em] text-red-400 uppercase">
                Classified Dossier · Level 4
              </p>
              <h1
                className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl"
                style={{ color: "var(--text-primary)" }}
              >
                {profile?.displayName ?? "Md. Tofayel Islam"}
              </h1>
              <p className="mt-1 text-sm font-medium text-violet-400">
                {profile?.role ?? "Frontend Developer"}
              </p>
              <p
                className="mt-3 max-w-md text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {profile?.bioParagraphs?.[0] ??
                  "BSc graduate in Computer Science & Engineering. Dhaka-born — turning ideas into interfaces."}
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
              {profile?.vaultOriginTitle ?? "Origin File"}
            </h2>
            <p className="mt-3 text-lg font-medium" style={{ color: "var(--text-primary)" }}>
              {profile?.locationArea ?? "Peelkhana, Dhaka"}
            </p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {profile?.vaultOriginDetail ??
                "Grew up in the heart of Dhaka — every chapter pushed closer to code."}
            </p>
          </div>

          <div className="vault-card rounded-2xl border p-5">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-violet-400 uppercase">
              {profile?.vaultCurrentTitle ?? "Current Status"}
            </h2>
            <p className="mt-3 text-lg font-medium" style={{ color: "var(--text-primary)" }}>
              {profile?.role ?? "Frontend Developer"}
            </p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {profile?.vaultCurrentDetail ??
                "Shipping React & Next.js interfaces. Open to freelance."}
            </p>
          </div>
        </div>

        {timeline.length > 0 && (
          <section
            className={`mt-6 vault-card rounded-2xl border p-5 transition-all duration-700 delay-300 ${
              revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-red-400 uppercase">
              Education Trail
            </h2>
            <div className="mt-4 space-y-4">
              {timeline.map((item) => (
                <div
                  key={`${item.year}-${item.place}`}
                  className="flex gap-4 border-b border-dotted pb-4 last:border-0 last:pb-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span className="w-20 shrink-0 text-[10px] font-medium text-violet-400">
                    {item.year}
                  </span>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                      {item.title}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      {item.place}
                    </p>
                    <p className="mt-1 text-[11px]" style={{ color: "var(--text-secondary)" }}>
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section
          className={`mt-6 vault-card rounded-2xl border p-5 transition-all duration-700 delay-[400ms] ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-red-400 uppercase">
            Skill Matrix
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border px-2.5 py-1 text-[10px]"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <footer
          className={`mt-6 flex flex-wrap gap-3 transition-all duration-700 delay-500 ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border px-3 py-1.5 text-[11px] transition-colors hover:border-red-500/40 hover:text-red-400"
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
