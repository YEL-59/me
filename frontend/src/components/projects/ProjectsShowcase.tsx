"use client";

import Link from "next/link";
import {
  filterProjects,
  projectFilters,
  type Project,
  type ProjectFilterId,
} from "@/data/projects";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const BATCH_SIZE = 8;

type ProjectsShowcaseProps = {
  projects: Project[];
};

function dateLabel(project: Project) {
  if (project.startDate || project.endDate) {
    return `${project.startDate || "—"} → ${project.endDate || "—"}`;
  }
  return project.year;
}

function ProjectCard({ project, wave }: { project: Project; wave: number }) {
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
          <span
            className="font-mono text-[10px] font-medium"
            style={{ color: "var(--text-tertiary)" }}
          >
            {dateLabel(project)}
            {wave > 0 ? ` ·${wave + 1}` : ""}
          </span>
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
            </Link>
          )}
          <Link
            href="/project-list"
            className="inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[11px] transition-colors hover:text-amber-300"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            Full list →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const [filter, setFilter] = useState<ProjectFilterId>("all");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => filterProjects(projects, filter),
    [projects, filter]
  );
  const maxItems = filtered.length;

  const displayProjects = useMemo(() => {
    return filtered.slice(0, visibleCount).map((project, index) => ({
      project,
      wave: 0,
      key: `${project.slug}-${index}`,
    }));
  }, [filtered, visibleCount]);

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

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14 2xl:max-w-6xl">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-xs transition-colors hover:text-cyan-400"
          style={{ color: "var(--text-secondary)" }}
        >
          ← Back to bento
        </Link>

        <header
          className={`mb-8 flex flex-col gap-4 transition-all duration-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div>
            <p className="text-[10px] font-semibold tracking-[0.35em] text-cyan-400/90 uppercase">
              Showcase
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Projects
            </h1>
            <p
              className="mt-3 max-w-md text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Visual project cards. For the full table with password-protected
              repo links, open{" "}
              <Link href="/project-list" className="text-amber-300 hover:underline">
                Project list
              </Link>
              .
            </p>
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
                filter !== f.id ? { color: "var(--text-secondary)" } : undefined
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
          {loading && (
            <p
              className="col-span-full py-6 text-center text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              Loading more…
            </p>
          )}
        </div>

        <div ref={sentinelRef} className="h-4" />
      </div>
    </div>
  );
}
