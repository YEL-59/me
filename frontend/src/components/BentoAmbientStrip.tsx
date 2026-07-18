"use client";

import { usePortfolio } from "./PortfolioProvider";

function MarqueeRow({
  items,
  direction,
}: {
  items: string[];
  direction: "left" | "right";
}) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max gap-8 px-4 ${
          direction === "left" ? "bento-marquee-left" : "bento-marquee-right"
        }`}
      >
        {doubled.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="flex items-center gap-8 whitespace-nowrap text-sm font-medium tracking-wide"
            style={{ color: "var(--text-tertiary)" }}
          >
            {word}
            <span className="text-violet-500/70">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function BentoAmbientStrip() {
  const { data } = usePortfolio();
  const trackA = data?.siteSettings?.marqueeTrackA?.length
    ? data.siteSettings.marqueeTrackA
    : ["Clarity", "Utility", "Empathy", "Craft", "React", "Next.js"];
  const trackB = data?.siteSettings?.marqueeTrackB?.length
    ? data.siteSettings.marqueeTrackB
    : ["Dhaka", "Frontend", "UI/UX", "Motion", "Open Source"];
  const badge =
    data?.siteSettings?.availabilityBadge ??
    data?.profile?.availabilityStatus ??
    "Open to freelance";
  const city = data?.profile?.locationCity?.split(",")[0] ?? "Dhaka";
  const tagline =
    data?.siteSettings?.ambientTagline ??
    `Building thoughtful interfaces from ${city}`;

  return (
    <section
      className="bento-ambient relative shrink-0 overflow-hidden rounded-2xl border"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-primary)",
      }}
    >
      <div className="bento-ambient-shimmer pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-10 left-1/4 h-24 w-48 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 right-1/4 h-20 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative space-y-3 py-5 md:py-6">
        <MarqueeRow items={trackA} direction="left" />
        <MarqueeRow items={trackB} direction="right" />

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 pt-1">
          <p
            className="text-center text-[11px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {tagline.includes(city) ? (
              <>
                Building thoughtful interfaces from{" "}
                <span className="text-cyan-400">{city}</span>
              </>
            ) : (
              tagline
            )}
          </p>
          <span
            className="hidden h-3 w-px md:block"
            style={{ background: "var(--border)" }}
          />
          <span
            className="rounded-full border px-2.5 py-0.5 text-[10px] text-emerald-400/90"
            style={{
              borderColor: "rgba(52,211,153,0.25)",
              background: "rgba(52,211,153,0.08)",
            }}
          >
            {badge}
          </span>
        </div>
      </div>
    </section>
  );
}
