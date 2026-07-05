"use client";

import Link from "next/link";
import { useState } from "react";

type FileItem = {
  name: string;
  type: "doc" | "folder" | "pdf";
  href: string;
};

const files: FileItem[] = [
  { name: "More about me", type: "doc", href: "/about" },
  { name: "Next.js Projects_2025", type: "doc", href: "/project" },
  { name: "Open Source", type: "folder", href: "/opensource" },
  { name: "Resume", type: "pdf", href: "/resume" },
];

function DocIcon() {
  return (
    <div
      className="flex h-[52px] w-10 flex-col items-center justify-center rounded-md border"
      style={{ borderColor: "var(--border)", background: "var(--bg-page)" }}
    >
      <div className="space-y-[3px]">
        <div className="h-[2px] w-5 rounded-full bg-sky-500/60" />
        <div className="h-[2px] w-4 rounded-full bg-sky-500/40" />
        <div className="h-[2px] w-5 rounded-full bg-sky-500/50" />
        <div className="h-[2px] w-3 rounded-full bg-sky-500/30" />
      </div>
    </div>
  );
}

function FolderIcon() {
  return (
    <div className="relative flex h-[52px] w-10 items-end justify-center">
      <div className="absolute bottom-0 h-8 w-10 rounded-sm" style={{ background: "#fbbf24" }} />
      <div
        className="absolute top-2 h-3 w-10 rounded-t-sm"
        style={{ background: "#fbbf24", opacity: 0.85 }}
      />
      <span className="relative z-10 mb-1 text-[10px]">📁</span>
    </div>
  );
}

function PdfIcon() {
  return (
    <div className="flex h-[52px] w-10 flex-col items-center justify-center rounded-md border border-red-500/30 bg-red-500/10">
      <span className="text-[9px] font-bold text-red-500">PDF</span>
    </div>
  );
}

export default function FilesCard() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="card grid h-full grid-cols-3 gap-2 rounded-xl p-3">
      {files.map((file) => (
        <Link
          key={file.name}
          href={file.href}
          onMouseEnter={() => setHovered(file.name)}
          onMouseLeave={() => setHovered(null)}
          className="flex flex-col items-center justify-center gap-1.5 rounded-lg p-2 transition-all duration-200"
          style={{
            background:
              hovered === file.name ? "var(--bg-secondary)" : "transparent",
          }}
        >
          {file.type === "pdf" ? (
            <PdfIcon />
          ) : file.type === "folder" ? (
            <FolderIcon />
          ) : (
            <DocIcon />
          )}
          <span
            className={`text-center text-[8px] leading-tight ${
              file.type === "pdf" ? "text-red-500" : ""
            }`}
            style={
              file.type !== "pdf"
                ? { color: "var(--text-secondary)" }
                : undefined
            }
          >
            {file.name}
          </span>
        </Link>
      ))}

      <Link
        href="/resume/ats"
        onMouseEnter={() => setHovered("ats")}
        onMouseLeave={() => setHovered(null)}
        className="flex flex-col items-center justify-center gap-1.5 rounded-lg p-2 transition-all duration-200"
        style={{
          background: hovered === "ats" ? "var(--bg-secondary)" : "transparent",
        }}
      >
        <div className="flex h-[52px] w-10 flex-col items-center justify-center rounded-md border border-violet-500/30 bg-violet-500/10">
          <span className="text-[8px] font-bold text-violet-400">ATS</span>
        </div>
        <span className="text-center text-[8px] leading-tight text-violet-400">
          ATS Resume
        </span>
      </Link>
    </div>
  );
}
