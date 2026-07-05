"use client";

import { useState } from "react";

const tabs = [
  "Work Experiences",
  "Projects",
  "Stack",
  "Open Source",
] as const;

const work = [
  {
    name: "Freelance",
    role: "Frontend Developer — React & Next.js",
    year: "2024 — Now",
  },
  {
    name: "Web Agency",
    role: "React Developer — UI & animations",
    year: "2022 — 2024",
  },
  {
    name: "Startup",
    role: "Junior Frontend Developer",
    year: "2020 — 2022",
  },
];

const projects = [
  { name: "Bento Portfolio — Next.js", year: "2025" },
  { name: "Dashboard UI — React + Tailwind", year: "2025" },
  { name: "E-commerce Storefront", year: "2024" },
  { name: "Landing Page + GSAP animations", year: "2024" },
];

const stack = [
  { name: "React / Next.js / TypeScript", year: "daily" },
  { name: "Tailwind CSS / CSS Modules", year: "daily" },
  { name: "GSAP / Framer Motion", year: "motion" },
  { name: "Three.js / React Three Fiber", year: "3D" },
];

const openSource = [
  { name: "UI component snippets", year: "2024" },
  { name: "Dev starter templates", year: "2023" },
];

const data = {
  "Work Experiences": work,
  Projects: projects,
  Stack: stack,
  "Open Source": openSource,
};

export default function ExperienceCard() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Work Experiences");
  const items = data[tab];
  const isWork = tab === "Work Experiences";

  return (
    <div className="card flex h-full flex-col overflow-hidden rounded-xl">
      <div
        className="flex gap-0.5 overflow-x-auto border-b px-2 py-1.5"
        style={{ borderColor: "var(--border)" }}
      >
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-md px-2.5 py-1 text-[10px] transition-colors ${
              tab === t
                ? "bg-violet-500/20 text-violet-500 dark:text-violet-300"
                : ""
            }`}
            style={
              tab !== t ? { color: "var(--text-tertiary)" } : undefined
            }
          >
            {t}
          </button>
        ))}
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-3 py-2">
        {isWork
          ? work.map((item) => (
              <div
                key={item.name}
                className="flex items-start justify-between gap-3 border-b border-dotted py-2.5 last:border-0"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="mt-0.5 text-[10px]"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {item.role}
                  </p>
                </div>
                <span
                  className="shrink-0 text-[10px]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {item.year}
                </span>
              </div>
            ))
          : items.map((item) => (
              <div
                key={item.name}
                className="flex items-start justify-between gap-3 border-b border-dotted py-2.5 last:border-0"
                style={{ borderColor: "var(--border)" }}
              >
                <p
                  className="text-xs"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.name}
                </p>
                <span
                  className="shrink-0 text-[10px]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {item.year}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
}
