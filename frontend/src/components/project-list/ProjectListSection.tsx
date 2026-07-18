"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Project } from "@/data/projects";

const UNLOCK_KEY = "project-list-details-unlocked-v2";

type UnlockedDetails = {
  _id: string;
  slug: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  href: string | null;
  github: string | null;
};

type StoredUnlock = {
  details: Record<string, UnlockedDetails>;
  expiresAt: number;
  lockAfterSeconds: number;
};

type ProjectListSectionProps = {
  projects: Project[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
}

function LockedCell({ onUnlock }: { onUnlock: () => void }) {
  return (
    <button
      type="button"
      onClick={onUnlock}
      className="text-amber-300 hover:underline"
    >
      🔒 Locked
    </button>
  );
}

export default function ProjectListSection({
  projects,
}: ProjectListSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [detailsMap, setDetailsMap] = useState<
    Record<string, UnlockedDetails>
  >({});
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [lockAfterSeconds, setLockAfterSeconds] = useState(60);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "live" | "nda" | "archived"
  >("all");

  const isUnlocked = Object.keys(detailsMap).length > 0;

  const lockNow = useCallback(() => {
    setDetailsMap({});
    setExpiresAt(null);
    setSecondsLeft(0);
    try {
      sessionStorage.removeItem(UNLOCK_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const applyUnlock = useCallback(
    (details: Record<string, UnlockedDetails>, ttlSeconds: number) => {
      const expires = Date.now() + ttlSeconds * 1000;
      setDetailsMap(details);
      setExpiresAt(expires);
      setLockAfterSeconds(ttlSeconds);
      setSecondsLeft(ttlSeconds);
      try {
        const payload: StoredUnlock = {
          details,
          expiresAt: expires,
          lockAfterSeconds: ttlSeconds,
        };
        sessionStorage.setItem(UNLOCK_KEY, JSON.stringify(payload));
      } catch {
        /* ignore */
      }
    },
    [],
  );

  useEffect(() => {
    setMounted(true);
    try {
      const raw = sessionStorage.getItem(UNLOCK_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredUnlock;
      if (!parsed?.expiresAt || parsed.expiresAt <= Date.now()) {
        sessionStorage.removeItem(UNLOCK_KEY);
        return;
      }
      setDetailsMap(parsed.details ?? {});
      setExpiresAt(parsed.expiresAt);
      setLockAfterSeconds(parsed.lockAfterSeconds ?? 60);
      setSecondsLeft(Math.max(0, Math.ceil((parsed.expiresAt - Date.now()) / 1000)));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!expiresAt || !isUnlocked) return;

    const tick = () => {
      const left = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0) lockNow();
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [expiresAt, isUnlocked, lockNow]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return projects;
    return projects.filter((p) => p.status === statusFilter);
  }, [projects, statusFilter]);

  const getDetails = (project: Project): UnlockedDetails | undefined => {
    if (project._id && detailsMap[project._id]) return detailsMap[project._id];
    return detailsMap[project.slug];
  };

  const unlockDetails = async () => {
    setUnlocking(true);
    setUnlockError("");
    try {
      const res = await fetch(`${API_URL}/projects/unlock-repos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Incorrect password");
      }
      const next: Record<string, UnlockedDetails> = {};
      const list = (json.data.details ?? json.data.repos) as UnlockedDetails[];
      list.forEach((item) => {
        next[item._id] = item;
        next[item.slug] = item;
      });
      const ttl =
        typeof json.data.lockAfterSeconds === "number"
          ? json.data.lockAfterSeconds
          : 60;
      applyUnlock(next, ttl);
      setUnlockOpen(false);
      setPassword("");
    } catch (err) {
      setUnlockError(err instanceof Error ? err.message : "Unlock failed");
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--bg-page)", color: "var(--text-primary)" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-14">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xs transition-colors hover:text-amber-400"
          style={{ color: "var(--text-secondary)" }}
        >
          ← Back to bento
        </Link>

        <header
          className={`mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between transition-all duration-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] text-amber-400/90 uppercase">
              Separate section · CMS managed
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Project list
            </h1>
            <p
              className="mt-3 max-w-xl text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Title, description, and status are public.{" "}
              <span className="text-amber-300">
                Start, end, live link, and repo
              </span>{" "}
              stay locked until unlocked. Auto-locks after the Site Settings TTL
              (default 1 min).
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-stretch">
            {isUnlocked ? (
              <>
                <div className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-5 py-3 text-left">
                  <p className="text-sm font-semibold text-emerald-300">
                    Details unlocked ✓
                  </p>
                  <p className="text-[10px] text-emerald-300/70">
                    Auto-lock in {formatCountdown(secondsLeft)}
                    {lockAfterSeconds !== 60
                      ? ` · TTL ${lockAfterSeconds}s`
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={lockNow}
                  className="rounded-xl border border-rose-500/35 bg-rose-500/10 px-5 py-3 text-left transition-colors hover:bg-rose-500/20"
                >
                  <p className="text-sm font-semibold text-rose-300">Lock now</p>
                  <p className="text-[10px] text-rose-300/70">
                    Hide start · end · live · repo
                  </p>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setUnlockOpen(true)}
                className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-5 py-3 text-left transition-colors hover:bg-amber-500/20"
              >
                <p className="text-sm font-semibold text-amber-300">
                  Unlock details
                </p>
                <p className="text-[10px] text-amber-300/70">
                  Reveals start · end · live · repo
                </p>
              </button>
            )}
          </div>
        </header>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {(["all", "live", "nda", "archived"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-medium capitalize transition-all ${
                statusFilter === s
                  ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"
                  : "hover:bg-[var(--bg-secondary)]"
              }`}
              style={
                statusFilter !== s
                  ? { color: "var(--text-secondary)" }
                  : undefined
              }
            >
              {s}
            </button>
          ))}
        </div>

        <div
          className="overflow-x-auto rounded-2xl border"
          style={{
            borderColor: "var(--border)",
            background: "var(--bg-primary)",
          }}
        >
          <table className="w-full min-w-[800px] text-left text-xs">
            <thead>
              <tr style={{ color: "var(--text-tertiary)" }}>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Start</th>
                <th className="px-4 py-3 font-medium">End</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Live link</th>
                <th className="px-4 py-3 font-medium">Repo link</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => {
                const details = getDetails(project);
                return (
                  <tr
                    key={project._id || project.slug}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-4 py-3 font-medium">{project.title}</td>
                    <td
                      className="max-w-[240px] truncate px-4 py-3"
                      style={{ color: "var(--text-secondary)" }}
                      title={project.description}
                    >
                      {project.description}
                    </td>
                    <td
                      className="px-4 py-3 font-mono"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {isUnlocked ? (
                        details?.startDate || "—"
                      ) : (
                        <LockedCell onUnlock={() => setUnlockOpen(true)} />
                      )}
                    </td>
                    <td
                      className="px-4 py-3 font-mono"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {isUnlocked ? (
                        details?.endDate || "—"
                      ) : (
                        <LockedCell onUnlock={() => setUnlockOpen(true)} />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-md px-2 py-0.5 text-[9px] font-bold uppercase"
                        style={{
                          background: `${project.accent}18`,
                          color: project.accent,
                        }}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isUnlocked ? (
                        details?.href ? (
                          <a
                            href={details.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline"
                          >
                            Open
                          </a>
                        ) : (
                          "—"
                        )
                      ) : (
                        <LockedCell onUnlock={() => setUnlockOpen(true)} />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isUnlocked ? (
                        details?.github ? (
                          <a
                            href={details.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-400 hover:underline"
                          >
                            GitHub
                          </a>
                        ) : (
                          "—"
                        )
                      ) : (
                        <LockedCell onUnlock={() => setUnlockOpen(true)} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p
              className="px-4 py-10 text-center text-sm"
              style={{ color: "var(--text-tertiary)" }}
            >
              No projects yet. Add them from Dashboard → Projects.
            </p>
          )}
        </div>
      </div>

      {unlockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            className="w-full max-w-sm rounded-2xl border p-5 shadow-2xl"
            style={{
              background: "var(--bg-primary)",
              borderColor: "var(--border)",
            }}
          >
            <h3 className="text-sm font-semibold">Unlock project details</h3>
            <p
              className="mt-2 text-xs leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Reveals <strong>start</strong>, <strong>end</strong>,{" "}
              <strong>live link</strong>, and <strong>repo</strong>. Auto-locks
              using{" "}
              <strong className="text-amber-300">
                Site Settings → repoUnlockTtlSeconds
              </strong>
              .
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void unlockDetails()}
              placeholder="repoUnlockPassword"
              className="mt-4 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:border-amber-400"
              style={{ borderColor: "var(--border)" }}
              autoFocus
            />
            {unlockError && (
              <p className="mt-2 text-xs text-red-400">{unlockError}</p>
            )}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => void unlockDetails()}
                disabled={unlocking || !password}
                className="flex-1 rounded-lg bg-amber-500/20 px-3 py-2 text-xs font-medium text-amber-200 hover:bg-amber-500/30 disabled:opacity-50"
              >
                {unlocking ? "Checking…" : "Unlock"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setUnlockOpen(false);
                  setUnlockError("");
                }}
                className="rounded-lg border px-3 py-2 text-xs"
                style={{ borderColor: "var(--border)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
