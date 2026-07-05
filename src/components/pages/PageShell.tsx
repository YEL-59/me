import Link from "next/link";

type PageShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  accent?: string;
};

export default function PageShell({
  title,
  subtitle,
  children,
  accent = "#8b5cf6",
}: PageShellProps) {
  return (
    <div
      className="relative min-h-screen transition-colors duration-300"
      style={{ background: "var(--bg-page)", color: "var(--text-primary)" }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-40"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${accent}33, transparent 70%)`,
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xs transition-colors hover:text-violet-400"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to bento
        </Link>
        <header className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p
              className="mt-2 max-w-2xl text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {subtitle}
            </p>
          )}
        </header>
        {children}
      </div>
    </div>
  );
}
