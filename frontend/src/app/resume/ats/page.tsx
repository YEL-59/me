"use client";

import PageShell from "@/components/pages/PageShell";
import Link from "next/link";
import { PortfolioProvider, usePortfolio } from "@/components/PortfolioProvider";

function AtsResumeContent() {
  const { data, loading } = usePortfolio();
  const profile = data?.profile;
  const resume = data?.resume;
  const education = data?.education ?? [];
  const experiences = data?.experiences ?? [];
  const projects = (data?.projects ?? []).slice(0, 3);
  const githubUser = data?.siteSettings?.githubUsername ?? "YEL-59";

  if (loading && !data) {
    return (
      <PageShell title="ATS Resume" subtitle="Loading…">
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Loading…
        </p>
      </PageShell>
    );
  }

  const website = (profile?.website ?? "https://tofayel.vercel.app").replace(
    /^https?:\/\//,
    ""
  );
  const texUrl = resume?.texUrl ?? "/resume/resume-ats.tex";

  return (
    <PageShell
      title={resume?.pageTitle ?? "ATS Resume"}
      subtitle={
        resume?.pageSubtitle ??
        `${profile?.displayName ?? "Tofayel"} — plain-text optimized for applicant tracking systems.`
      }
      accent={resume?.accent ?? "#8b5cf6"}
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <a
          href={texUrl}
          download
          className="rounded-lg border px-4 py-2 text-xs transition-colors hover:text-violet-400"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          Download .tex
        </a>
        <Link
          href="/resume"
          className="rounded-lg border px-4 py-2 text-xs transition-colors hover:text-violet-400"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          ← Resume hub
        </Link>
      </div>

      <article
        className="resume-ats rounded-2xl border p-6 md:p-8"
        style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
      >
        <header className="border-b pb-4" style={{ borderColor: "var(--border)" }}>
          <h1 className="text-xl font-bold">
            {profile?.displayName ?? "Md. Tofayel Islam"}
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            {profile?.email}
            {profile?.phone ? ` · ${profile.phone}` : ""}
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {website} · github.com/{githubUser}
          </p>
          {profile?.role && (
            <p className="mt-1 text-sm text-violet-400">{profile.role}</p>
          )}
        </header>

        {(resume?.summary?.length ?? 0) > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wide">Summary</h2>
            <ul
              className="mt-2 list-disc space-y-1 pl-5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {resume!.summary.map((item) => (
                <li key={item.slice(0, 40)}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {education.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wide">
              Education
            </h2>
            <div className="mt-2 space-y-3 text-sm">
              {education.map((edu) => (
                <div key={edu._id}>
                  <p className="font-semibold">{edu.place}</p>
                  <p style={{ color: "var(--text-secondary)" }}>
                    {edu.title}
                    {edu.detail ? ` — ${edu.detail}` : ""}
                  </p>
                  <p style={{ color: "var(--text-tertiary)" }}>{edu.year}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {experiences.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wide">
              Experience
            </h2>
            <div className="mt-3 space-y-4 text-sm">
              {experiences.map((exp) => (
                <div key={exp._id}>
                  <p className="font-semibold">
                    {exp.role} — {exp.company}
                  </p>
                  <p style={{ color: "var(--text-secondary)" }}>
                    {[exp.employmentType, exp.location].filter(Boolean).join(" · ")}
                  </p>
                  <p style={{ color: "var(--text-tertiary)" }}>
                    {exp.yearLabel || `${exp.startDate} – ${exp.endDate}`}
                  </p>
                  {(exp.bullets?.length ?? 0) > 0 && (
                    <ul
                      className="mt-2 list-disc space-y-1 pl-5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {exp.bullets!.map((b) => (
                        <li key={b.slice(0, 40)}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wide">Projects</h2>
            <div className="mt-3 space-y-4 text-sm">
              {projects.map((project) => (
                <div key={project._id}>
                  <p className="font-semibold">{project.title}</p>
                  <p style={{ color: "var(--text-tertiary)" }}>
                    {project.stack.join(", ")}
                  </p>
                  <ul
                    className="mt-1 list-disc space-y-1 pl-5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {(project.highlights.length
                      ? project.highlights
                      : [project.description]
                    ).map((h) => (
                      <li key={h.slice(0, 40)}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {(resume?.skillGroups?.length ?? 0) > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wide">
              Technical Skills
            </h2>
            <ul
              className="mt-2 list-disc space-y-1 pl-5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {resume!.skillGroups.map((g) => (
                <li key={g.group}>
                  <strong>{g.group}:</strong> {g.items}
                </li>
              ))}
            </ul>
          </section>
        )}

        {(resume?.codingProfiles?.length ?? 0) > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wide">
              Programming Profiles
            </h2>
            <ul
              className="mt-2 space-y-1 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {resume!.codingProfiles.map((p) => (
                <li key={p.label}>
                  {p.label}:{" "}
                  <a href={p.href} className="text-violet-400 hover:underline">
                    {p.href.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </PageShell>
  );
}

export default function AtsResumePage() {
  return (
    <PortfolioProvider>
      <AtsResumeContent />
    </PortfolioProvider>
  );
}
