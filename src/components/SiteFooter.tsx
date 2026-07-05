const footerLinks = [
  { label: "Email", href: "mailto:hello@tofayel.dev" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Github", href: "#" },
  { label: "Medium", href: "#" },
];

const values = ["Clarity", "Utility", "Empathy", "Craft"];

export default function SiteFooter() {
  return (
    <footer
      className="rounded-t-[28px] border-t border-l border-r transition-colors duration-300"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-primary)",
      }}
    >
      <div className="flex justify-center px-6 pt-12 pb-6 md:hidden">
        <div className="flex flex-col items-center gap-3">
          {values.map((word, i) => (
            <div
              key={word}
              className="flex h-20 w-48 items-end rounded-2xl border p-3.5"
              style={{
                marginLeft: i % 2 === 0 ? 0 : 12,
                borderColor: "var(--border)",
                background: "var(--bg-page)",
              }}
            >
              <span
                className="text-xs tracking-wide"
                style={{ color: "var(--text-secondary)" }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-8 px-6 pb-10 pt-2 md:hidden">
        <div className="grid w-full grid-cols-2 gap-4">
          {footerLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className={`inline-flex w-full items-center justify-center rounded-lg border px-3 py-2 text-sm transition-colors ${
                i === footerLinks.length - 1 ? "col-span-2" : ""
              }`}
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-primary)",
                color: "var(--text-secondary)",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          © 2026 Tofayel. All rights reserved.
        </p>
      </div>

      <nav className="mx-auto hidden w-full max-w-[1376px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-8 py-4 md:flex">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm font-normal transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
