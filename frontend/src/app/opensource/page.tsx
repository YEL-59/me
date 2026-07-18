"use client";

import Link from "next/link";
import {
  componentCategories,
  openSourceComponents,
  type OpenSourceComponent,
} from "@/data/open-source";
import { PortfolioProvider, usePortfolio } from "@/components/PortfolioProvider";
import { IconView } from "@/lib/icons";
import { useMemo, useState } from "react";

const categoryIcons: Record<string, string> = {
  All: "LuSparkles",
  Button: "FiTarget",
  Card: "FiBox",
  Navbar: "FiCompass",
  Footer: "FiNavigation",
  Breadcrumb: "FiLink",
  Banner: "MdRocketLaunch",
};

function LivePreview({ comp }: { comp: OpenSourceComponent }) {
  const [active, setActive] = useState(false);

  switch (comp.preview) {
    case "button":
      return (
        <button
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ${
            active ? "scale-105 shadow-2xl" : "shadow-lg"
          }`}
          style={{
            background: `linear-gradient(135deg, ${comp.accent}, ${comp.accent}99)`,
            boxShadow: active ? `0 12px 40px ${comp.accent}55` : `0 4px 20px ${comp.accent}33`,
          }}
        >
          {active ? "Let's go →" : "Get started"}
        </button>
      );
    case "card":
      return (
        <div
          className={`w-full max-w-[200px] rounded-2xl border p-4 transition-all duration-300 ${
            active ? "-translate-y-1 shadow-xl" : ""
          }`}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          style={{
            borderColor: `${comp.accent}44`,
            background: `linear-gradient(160deg, ${comp.accent}18, transparent)`,
            boxShadow: active ? `0 16px 40px ${comp.accent}22` : undefined,
          }}
        >
          <div className="h-2.5 w-10 rounded-full" style={{ background: comp.accent }} />
          <div className="mt-3 h-2 w-full rounded" style={{ background: "var(--border)" }} />
          <div className="mt-2 h-2 w-3/4 rounded" style={{ background: "var(--border)" }} />
          <div
            className="mt-3 inline-block rounded-full px-2 py-0.5 text-[9px] font-medium"
            style={{ background: `${comp.accent}22`, color: comp.accent }}
          >
            Glass card
          </div>
        </div>
      );
    case "navbar":
      return (
        <div
          className="flex w-full max-w-[220px] items-center justify-between rounded-xl border px-4 py-3 transition-all duration-300 hover:shadow-lg"
          style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
        >
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full" style={{ background: `${comp.accent}44` }} />
            <div className="h-1.5 w-12 rounded" style={{ background: "var(--border)" }} />
          </div>
          <div className="flex gap-1.5">
            <div className="h-5 w-5 rounded-md" style={{ background: `${comp.accent}33` }} />
            <div className="h-5 w-8 rounded-md" style={{ background: "var(--border)" }} />
          </div>
        </div>
      );
    case "footer":
      return (
        <div
          className="w-full max-w-[220px] rounded-t-2xl border border-b-0 px-4 py-3"
          style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
        >
          <div className="flex justify-center gap-3">
            {["Email", "GitHub", "LinkedIn"].map((l) => (
              <span key={l} className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>
                {l}
              </span>
            ))}
          </div>
          <div
            className="mx-auto mt-2 h-0.5 w-16 rounded-full"
            style={{ background: comp.accent }}
          />
        </div>
      );
    case "breadcrumb":
      return (
        <div className="flex items-center gap-2 text-xs">
          <span style={{ color: "var(--text-tertiary)" }}>Home</span>
          <span className="text-violet-400/50">/</span>
          <span style={{ color: "var(--text-tertiary)" }}>Lab</span>
          <span className="text-violet-400/50">/</span>
          <span className="font-medium" style={{ color: comp.accent }}>
            Components
          </span>
        </div>
      );
    case "banner":
      return (
        <div
          className="w-full max-w-[220px] overflow-hidden rounded-2xl p-4"
          style={{
            background: `linear-gradient(135deg, ${comp.accent}33, ${comp.accent}08)`,
          }}
        >
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
            style={{ background: `${comp.accent}33`, color: comp.accent }}
          >
            New
          </span>
          <p className="mt-2 text-sm font-bold">Build faster.</p>
          <p className="mt-1 text-[10px]" style={{ color: "var(--text-secondary)" }}>
            Ship UI the community loves.
          </p>
          <div
            className="mt-3 inline-block rounded-lg px-3 py-1 text-[10px] font-medium text-white"
            style={{ background: comp.accent }}
          >
            Explore
          </div>
        </div>
      );
    default:
      return null;
  }
}

function OpenSourceLab() {
  const { data } = usePortfolio();
  const [folderOpen, setFolderOpen] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [selected, setSelected] = useState<OpenSourceComponent | null>(null);

  const components: OpenSourceComponent[] = useMemo(() => {
    if (data?.openSource?.length) {
      return data.openSource.map((c) => ({
        slug: c.slug,
        name: c.name,
        category: c.category,
        description: c.description,
        features: c.features,
        stack: c.stack,
        preview: c.preview,
        accent: c.accent,
        emoji: c.emoji,
        github: c.github,
      }));
    }
    return openSourceComponents;
  }, [data?.openSource]);

  const filtered =
    filter === "All"
      ? components
      : components.filter((c) => c.category === filter);

  return (
    <div
      className="os-lab relative min-h-screen overflow-hidden"
      style={{ background: "var(--bg-page)", color: "var(--text-primary)" }}
    >
      <div className="os-grid-bg pointer-events-none absolute inset-0" />
      <div className="os-glow pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-emerald-500/15 blur-[120px]" />
      <div className="os-glow pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-violet-500/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xs transition-colors hover:text-emerald-400"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to bento
        </Link>

        <header
          className="mb-10 transition-all duration-700 translate-y-0 opacity-100"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold tracking-[0.25em] text-emerald-400 uppercase">
                YEL-59 · Component Lab
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Open Source
              </h1>
              <p
                className="mt-3 max-w-lg text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Free TypeScript components for the community — buttons, cards,
                navbars, footers, breadcrumbs & banners. Copy, remix, ship.
              </p>
            </div>
            <div className="flex gap-3">
              {[
                { n: "6", label: "Components" },
                { n: "TS", label: "Typed" },
                { n: "MIT", label: "License" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border px-4 py-3 text-center"
                  style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
                >
                  <p className="text-lg font-bold text-emerald-400">{s.n}</p>
                  <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <button
          type="button"
          onClick={() => setFolderOpen((v) => !v)}
          className={`os-folder-btn mb-8 flex w-full items-center gap-5 rounded-2xl border p-5 text-left transition-all duration-500 md:p-6 ${
            folderOpen ? "border-amber-500/40 shadow-[0_0_40px_rgba(251,191,36,0.12)]" : "hover:border-amber-500/25"
          }`}
          style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
        >
          <div className="relative h-20 w-20 shrink-0">
            <div
              className="absolute bottom-1 left-1 h-12 w-[4.5rem] rounded-lg shadow-lg"
              style={{ background: "linear-gradient(180deg, #fcd34d, #f59e0b)" }}
            />
            <div
              className={`absolute top-3 left-1 h-6 w-[4.5rem] rounded-t-lg shadow-md transition-all duration-500 origin-bottom-left ${
                folderOpen ? "-rotate-[18deg] -translate-y-2" : ""
              }`}
              style={{ background: "linear-gradient(180deg, #fde68a, #fbbf24)" }}
            />
            <span
              className={`absolute inset-0 flex items-center justify-center text-3xl transition-transform duration-500 ${
                folderOpen ? "scale-110" : ""
              }`}
            >
              {folderOpen ? "📂" : "📁"}
            </span>
          </div>
          <div>
            <p className="text-base font-semibold">
              {folderOpen ? "community-components/" : "Double-click to open folder"}
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
              {components.length} packages · React + TypeScript + Tailwind
            </p>
            <p className="mt-2 font-mono text-[10px] text-emerald-400/80">
              ~/yel-59/opensource/{folderOpen ? "*" : "..."}
            </p>
          </div>
        </button>

        <div
          className={`os-finder overflow-hidden rounded-2xl border transition-all duration-700 ${
            folderOpen ? "opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
        >
          <div
            className="flex items-center gap-2 border-b px-4 py-2.5"
            style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
          >
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="mx-auto font-mono text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              component-lab — finder
            </span>
          </div>

          <div className="flex min-h-[480px] flex-col md:flex-row">
            <aside
              className="border-b p-3 md:w-44 md:border-r md:border-b-0"
              style={{ borderColor: "var(--border)" }}
            >
              <p className="mb-2 px-2 text-[9px] font-bold tracking-wider uppercase" style={{ color: "var(--text-tertiary)" }}>
                Categories
              </p>
              {componentCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`mb-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-all ${
                    filter === cat
                      ? "bg-emerald-500/15 font-medium text-emerald-400"
                      : "hover:bg-[var(--bg-secondary)]"
                  }`}
                  style={filter !== cat ? { color: "var(--text-secondary)" } : undefined}
                >
                  <span className="inline-flex">
                    <IconView name={categoryIcons[cat]} size={14} />
                  </span>
                  {cat}
                </button>
              ))}
            </aside>

            <div className="flex-1 p-4 md:p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((comp, i) => (
                  <article
                    key={comp.slug}
                    onClick={() => setSelected(comp)}
                    className={`os-comp-card group cursor-pointer rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 md:p-5 ${
                      selected?.slug === comp.slug ? "ring-2 ring-emerald-500/40" : ""
                    }`}
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--bg-secondary)",
                      animationDelay: `${i * 0.08}s`,
                    }}
                  >
                    <div
                      className="mb-4 flex h-32 items-center justify-center overflow-hidden rounded-xl transition-all duration-300 group-hover:shadow-inner"
                      style={{
                        background: `radial-gradient(ellipse at 50% 30%, ${comp.accent}18, var(--bg-primary))`,
                      }}
                    >
                      <LivePreview comp={comp} />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex text-lg" style={{ color: comp.accent }}>
                        <IconView name={comp.emoji} size={20} />
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                        style={{ background: `${comp.accent}22`, color: comp.accent }}
                      >
                        {comp.category}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold">{comp.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {comp.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {comp.stack.map((t) => (
                        <span
                          key={t}
                          className="rounded-md px-1.5 py-0.5 font-mono text-[8px]"
                          style={{ background: "var(--bg-primary)", color: "var(--text-tertiary)" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {selected && (
              <aside
                className="border-t p-4 md:w-64 md:border-t-0 md:border-l"
                style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
              >
                <p className="text-[9px] font-bold tracking-wider uppercase text-emerald-400">
                  Inspector
                </p>
                <h3 className="mt-2 text-base font-bold">{selected.name}</h3>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {selected.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {selected.features.map((f) => (
                    <li
                      key={f}
                      className="flex gap-2 text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span style={{ color: selected.accent }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={selected.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
                  style={{ background: selected.accent }}
                >
                  View on GitHub →
                </a>
              </aside>
            )}
          </div>
        </div>

        <div
          className="os-marquee mt-8 overflow-hidden rounded-xl border py-2.5"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="os-marquee-track flex gap-8 text-[10px] tracking-widest uppercase" style={{ color: "var(--text-tertiary)" }}>
            {[...Array(2)].map((_, gi) => (
              <span key={gi} className="flex shrink-0 gap-8">
                <span>TypeScript · Tailwind · React · Community · Open Source · Buttons · Cards · Navbars ·</span>
                <span>TypeScript · Tailwind · React · Community · Open Source · Buttons · Cards · Navbars ·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OpenSourcePage() {
  return (
    <PortfolioProvider>
      <OpenSourceLab />
    </PortfolioProvider>
  );
}
