"use client";

import Link from "next/link";
import {
  filterProjects,
  projectFilters,
  projects,
  type Project,
  type ProjectFilterId,
} from "@/data/projects";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const BATCH_SIZE = 4;
const MAX_WAVES = 6;

function ProjectCard({
  project,
  wave,
}: {
  project: Project;
  wave: number;
}) {
  return (
    <article
      className="proj-card group relative flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-primary)",
      }}
    >
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: `${project.accent}40` }}
      />

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="font-mono text-[10px] font-medium"
              style={{ color: "var(--text-tertiary)" }}
            >
              {project.year}
            </span>
            {wave > 0 && (
              <span className="rounded-md bg-violet-500/10 px-1.5 py-0.5 text-[8px] text-violet-400">
                ·{wave + 1}
              </span>
            )}
          </div>
          <span
            className="rounded-md px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase"
            style={{ background: `${project.accent}18`, color: project.accent }}
          >
            {project.status}
          </span>
        </div>

        <h2 className="mt-3 text-lg font-semibold tracking-tight md:text-xl">
          {project.title}
        </h2>

        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {project.description}
        </p>

        <ul className="mt-4 flex-1 space-y-1.5">
          {project.highlights.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-xs leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              <span
                className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                style={{ background: project.accent }}
              />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-1">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md px-2 py-0.5 font-mono text-[9px]"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-tertiary)",
              }}
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span
              className="rounded-md px-2 py-0.5 text-[9px]"
              style={{ color: "var(--text-muted)" }}
            >
              +{project.stack.length - 4}
            </span>
          )}
        </div>

        <div
          className="mt-5 flex items-center gap-2 border-t pt-4"
          style={{ borderColor: "var(--border)" }}
        >
          {project.href && (
            <Link
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[11px] font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: project.accent }}
            >
              Visit
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </Link>
          )}
          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border px-3.5 py-2 text-[11px] transition-colors hover:text-violet-400"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              GitHub
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function LoadingPulse() {
  return (
    <div className="col-span-full flex flex-col items-center gap-3 py-8">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="proj-pulse-dot h-1.5 w-1.5 rounded-full bg-cyan-400"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
        Loading more…
      </p>
    </div>
  );
}

export default function ProjectsShowcase() {
  const [filter, setFilter] = useState<ProjectFilterId>("all");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => filterProjects(filter), [filter]);
  const maxItems = filtered.length * MAX_WAVES;

  const displayProjects = useMemo(() => {
    const items: { project: Project; wave: number; key: string }[] = [];
    let i = 0;
    while (items.length < visibleCount && items.length < maxItems) {
      const project = filtered[i % filtered.length];
      const wave = Math.floor(i / filtered.length);
      items.push({
        project,
        wave,
        key: `${project.slug}-w${wave}-${i}`,
      });
      i++;
    }
    return items;
  }, [filtered, visibleCount, maxItems]);

  const hasMore = visibleCount < maxItems;

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + BATCH_SIZE, maxItems));
      setLoading(false);
    }, 500);
  }, [hasMore, loading, maxItems]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [filter]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "280px", threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, hasMore, filter]);

  return (
    <div
      className="proj-stream relative min-h-screen overflow-hidden"
      style={{ background: "var(--bg-page)", color: "var(--text-primary)" }}
    >
      <div className="proj-mesh pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/8 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14 2xl:max-w-6xl">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-xs transition-colors hover:text-cyan-400"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to bento
        </Link>

        <header
          className={`mb-10 flex flex-col gap-6 2xl:flex-row 2xl:items-end 2xl:justify-between transition-all duration-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div>
            <p className="text-[10px] font-semibold tracking-[0.35em] text-cyan-400/90 uppercase">
              Work · 2019 — Now
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl 2xl:text-5xl">
              Projects
            </h1>
            <p
              className="mt-3 max-w-md text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Scroll to explore — AI tools, dashboards, and production apps.
            </p>
          </div>

          <div className="flex shrink-0 gap-3">
            <div
              className="rounded-xl border px-5 py-3"
              style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
            >
              <p className="text-xl font-bold tabular-nums text-cyan-400">{projects.length}</p>
              <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                Total
              </p>
            </div>
            <div
              className="rounded-xl border px-5 py-3"
              style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
            >
              <p className="text-xl font-bold tabular-nums text-emerald-400">
                {projects.filter((p) => p.status === "live").length}
              </p>
              <p className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                Live
              </p>
            </div>
          </div>
        </header>

        <div className="mb-8 flex flex-wrap gap-1.5">
          {projectFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-lg px-3.5 py-1.5 text-[11px] font-medium transition-all ${
                filter === f.id
                  ? "bg-cyan-500/12 text-cyan-400 ring-1 ring-cyan-500/30"
                  : "hover:bg-[var(--bg-secondary)]"
              }`}
              style={
                filter !== f.id
                  ? { color: "var(--text-secondary)" }
                  : undefined
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2 2xl:gap-5">
          {displayProjects.map(({ project, wave, key }) => (
            <ProjectCard key={key} project={project} wave={wave} />
          ))}

          {loading && <LoadingPulse />}
        </div>

        <div ref={sentinelRef} className="col-span-full h-4" />

        {!hasMore && displayProjects.length > 0 && (
          <div
            className="mt-10 rounded-xl border border-dashed py-10 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm font-medium">End of stream</p>
            <p className="mt-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
              {filtered.length} projects ·{" "}
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-cyan-400 hover:underline"
              >
                Back to top
              </button>
            </p>
          </div>
        )}

        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
            No projects in this filter.
          </p>
        )}
      </div>
    </div>
  );
}
