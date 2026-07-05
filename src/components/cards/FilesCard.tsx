const files = [
  { name: "More about me", type: "doc" },
  { name: "Next.js Projects_2025", type: "doc" },
  { name: "React Components_2024", type: "doc" },
  { name: "Open Source_2024", type: "doc" },
  { name: "Resume", type: "pdf" },
];

function DocIcon() {
  return (
    <div
      className="flex h-[52px] w-10 flex-col items-center justify-center rounded-md border"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-page)",
      }}
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

function PdfIcon() {
  return (
    <div className="flex h-[52px] w-10 flex-col items-center justify-center rounded-md border border-red-500/30 bg-red-500/10">
      <span className="text-[9px] font-bold text-red-500">PDF</span>
    </div>
  );
}

export default function FilesCard() {
  return (
    <div className="card grid h-full grid-cols-3 gap-2 rounded-xl p-3">
      {files.map((file) => (
        <button
          key={file.name}
          className="flex flex-col items-center justify-center gap-1.5 rounded-lg p-1.5 transition-colors hover:opacity-80"
          style={{ background: "transparent" }}
        >
          {file.type === "pdf" ? <PdfIcon /> : <DocIcon />}
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
        </button>
      ))}
    </div>
  );
}
