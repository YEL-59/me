"use client";

import { useMemo, useState } from "react";
import { usePortfolio } from "../PortfolioProvider";

const tabs = [
  "Work Experiences",
  "Projects",
  "Stack",
  "Open Source",
] as const;

export default function ExperienceCard() {
  const { data } = usePortfolio();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Work Experiences");

  const work = useMemo(
    () =>
      data?.experiences?.length
        ? data.experiences.map((e) => ({
            name: e.company,
            role: e.role,
            year: e.yearLabel || `${e.startDate} — ${e.endDate}`,
          }))
        : [
            {
              name: "Freelance",
              role: "Frontend Developer — React & Next.js",
              year: "2024 — Now",
            },
          ],
    [data?.experiences]
  );

  const projects = useMemo(
    () =>
      data?.projects?.length
        ? data.projects.slice(0, 6).map((p) => ({
            name: p.title,
            year: p.year,
          }))
        : [{ name: "Bento Portfolio — Next.js", year: "2025" }],
    [data?.projects]
  );

  const stack = useMemo(
    () =>
      data?.skills?.length
        ? data.skills.slice(0, 8).map((s) => ({
            name: s.label,
            year: "skill",
          }))
        : [{ name: "React / Next.js / TypeScript", year: "daily" }],
    [data?.skills]
  );

  const openSource = useMemo(
    () =>
      data?.openSource?.length
        ? data.openSource.slice(0, 6).map((o) => ({
            name: o.name,
            year: o.category,
          }))
        : [{ name: "UI component snippets", year: "2024" }],
    [data?.openSource]
  );

  const tabData = {
    "Work Experiences": work,
    Projects: projects,
    Stack: stack,
    "Open Source": openSource,
  };

  const items = tabData[tab];
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
            style={tab !== t ? { color: "var(--text-tertiary)" } : undefined}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-3 py-2">
        {isWork
          ? work.map((item) => (
              <div
                key={`${item.name}-${item.year}`}
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
                key={`${item.name}-${item.year}`}
                className="flex items-start justify-between gap-3 border-b border-dotted py-2.5 last:border-0"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="text-xs" style={{ color: "var(--text-primary)" }}>
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
