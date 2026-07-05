"use client";

import Image from "next/image";
import PageShell from "@/components/pages/PageShell";
import Link from "next/link";

const funFacts = [
  { emoji: "🏠", label: "Roots", value: "Peelkhana, Dhaka" },
  { emoji: "🎓", label: "Degree", value: "BSc CSE — DIU" },
  { emoji: "💼", label: "Now", value: "Softvence · Frontend" },
  { emoji: "☕", label: "Vibe", value: "Coffee + clean UI" },
];

const philosophies = [
  "Ship interfaces that feel obvious the first time you use them.",
  "TypeScript everywhere — types are documentation you can't skip.",
  "Small components, big impact. Open source what helps the community.",
  "Dhaka-built discipline, global-quality craft.",
];

export default function AboutPage() {
  return (
    <PageShell
      title="More about me"
      subtitle="Md. Tofayel Islam — frontend developer, CSE graduate, and someone who treats UI like a love letter to the user."
      accent="#f472b6"
    >
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <div className="relative mx-auto md:mx-0">
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-violet-500/30 to-pink-500/20 blur-md" />
          <Image
            src="/tofayel.png"
            alt="Md. Tofayel Islam"
            width={200}
            height={250}
            className="relative rounded-2xl border object-cover object-top"
            style={{ borderColor: "var(--border)" }}
            priority
          />
          <span className="absolute -right-2 -bottom-2 rotate-3 rounded-md bg-violet-600 px-2 py-1 text-[10px] font-bold text-white shadow-lg">
            YEL-59
          </span>
        </div>

        <div className="space-y-4">
          <div
            className="rounded-2xl border p-5"
            style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
          >
            <p className="text-[10px] font-bold tracking-[0.2em] text-violet-400 uppercase">
              Hello world
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              I&apos;m <strong style={{ color: "var(--text-primary)" }}>Md. Tofayel Islam</strong> —
              a frontend developer with 2+ years building React & Next.js apps. I grew up in{" "}
              <span className="text-violet-400">Peelkhana, Dhaka</span>, studied at BMARPC &
              Rifles Public College, and graduated from{" "}
              <span className="text-violet-400">Daffodil International University</span> with a
              BSc in Computer Science & Engineering.
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Currently at <strong>Softvence</strong>, I ship responsive, conversion-focused
              interfaces. I love AI-powered products, design systems, and sharing tiny open-source
              components for the community.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {funFacts.map((f) => (
              <div
                key={f.label}
                className="rounded-xl border p-3"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
              >
                <span className="text-lg">{f.emoji}</span>
                <p className="mt-1 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                  {f.label}
                </p>
                <p className="text-xs font-medium">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="mt-8 rounded-2xl border p-5"
        style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
      >
        <h2 className="text-sm font-semibold">How I think about code</h2>
        <ul className="mt-4 space-y-3">
          {philosophies.map((p) => (
            <li
              key={p}
              className="flex gap-3 text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              <span className="text-violet-400">→</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {[
          { label: "GitHub", href: "https://github.com/YEL-59" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/tofayel-islam" },
          { label: "Live site", href: "https://tofayel.vercel.app/" },
          { label: "Email", href: "mailto:tofayeltuhin143@gmail.com" },
        ].map((l) => (
          <Link
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border px-4 py-2 text-xs transition-colors hover:border-violet-500/40 hover:text-violet-400"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
