"use client";

import PageShell from "@/components/pages/PageShell";
import Link from "next/link";
import { PortfolioProvider, usePortfolio } from "@/components/PortfolioProvider";

function ResumeHub() {
  const { data, loading } = usePortfolio();
  const resume = data?.resume;

  if (loading && !data) {
    return (
      <PageShell title="Resume" subtitle="Loading…">
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Loading resume…
        </p>
      </PageShell>
    );
  }

  const pdfUrl = resume?.pdfUrl ?? "/resume/tofayel-resume.pdf";
  const texUrl = resume?.texUrl ?? "/resume/resume-ats.tex";
  const latexRepo =
    resume?.latexRepoUrl ?? "https://github.com/YEL-59/Resumelatex";

  return (
    <PageShell
      title={resume?.pageTitle?.includes("ATS") ? "Resume" : resume?.pageTitle ?? "Resume"}
      subtitle={
        resume?.pageSubtitle?.includes("plain-text")
          ? "Download my PDF resume or view the ATS-friendly version optimized for recruiters and applicant systems."
          : resume?.pageSubtitle ??
            "Download my PDF resume or view the ATS-friendly version."
      }
      accent="#ef4444"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href={pdfUrl}
          download
          className="group rounded-2xl border p-6 transition-all hover:border-red-500/40"
          style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
        >
          <div className="flex h-16 w-12 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10">
            <span className="text-sm font-bold text-red-500">PDF</span>
          </div>
          <h2 className="mt-4 text-sm font-semibold">Designed Resume</h2>
          <p
            className="mt-2 text-xs leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Visual PDF with layout, colors, and portfolio styling. Best for
            direct sharing.
          </p>
          <span className="mt-4 inline-block text-xs text-red-400 group-hover:underline">
            Download PDF →
          </span>
        </a>

        <Link
          href="/resume/ats"
          className="group rounded-2xl border p-6 transition-all hover:border-violet-500/40"
          style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
        >
          <div className="flex h-16 w-12 items-center justify-center rounded-lg border border-violet-500/30 bg-violet-500/10">
            <span className="text-[10px] font-bold text-violet-400">ATS</span>
          </div>
          <h2 className="mt-4 text-sm font-semibold">ATS-Friendly Resume</h2>
          <p
            className="mt-2 text-xs leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Plain, parseable format for job portals and recruiter systems. Built
            from LaTeX source.
          </p>
          <span className="mt-4 inline-block text-xs text-violet-400 group-hover:underline">
            View ATS version →
          </span>
        </Link>
      </div>

      <div
        className="mt-6 rounded-2xl border p-5"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
      >
        <p className="text-xs font-medium">LaTeX source</p>
        <p
          className="mt-2 text-xs leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          ATS resume generated from LaTeX. Source available on{" "}
          <a
            href={latexRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:underline"
          >
            {latexRepo.replace("https://", "")}
          </a>{" "}
          or download{" "}
          <a
            href={texUrl}
            download
            className="text-violet-400 hover:underline"
          >
            resume-ats.tex
          </a>
        </p>
      </div>
    </PageShell>
  );
}

export default function ResumePage() {
  return (
    <PortfolioProvider>
      <ResumeHub />
    </PortfolioProvider>
  );
}
