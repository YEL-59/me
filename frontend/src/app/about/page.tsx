"use client";

import Image from "next/image";
import PageShell from "@/components/pages/PageShell";
import Link from "next/link";
import { PortfolioProvider, usePortfolio } from "@/components/PortfolioProvider";
import { IconView } from "@/lib/icons";

function AboutContent() {
  const { data, loading } = usePortfolio();
  const about = data?.about;
  const profile = data?.profile;
  const people = data?.people ?? [];
  const socialLinks =
    data?.socialLinks?.filter((l) => l.placement === "about" || l.placement === "vault") ??
    [];

  const funFacts = about?.funFacts?.length
    ? about.funFacts
    : [
        { emoji: "FiHome", label: "Roots", value: "Peelkhana, Dhaka" },
        { emoji: "MdSchool", label: "Degree", value: "BSc CSE — DIU" },
      ];
  const philosophies = about?.philosophies?.length
    ? about.philosophies
    : ["Ship interfaces that feel obvious the first time you use them."];
  const intro =
    about?.introParagraphs?.length
      ? about.introParagraphs
      : profile?.bioParagraphs ?? [];

  if (loading && !data) {
    return (
      <PageShell title="About" subtitle="Loading…">
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Loading about…
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={about?.pageTitle ?? "More about me"}
      subtitle={
        about?.pageSubtitle ??
        `${profile?.displayName ?? "Tofayel"} — ${profile?.role ?? "Frontend Developer"}`
      }
      accent={about?.accent ?? "#f472b6"}
    >
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <div className="relative mx-auto md:mx-0">
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-violet-500/30 to-pink-500/20 blur-md" />
          <Image
            src={about?.photoUrl ?? profile?.avatarUrl ?? "/tofayel.png"}
            alt={profile?.displayName ?? "Profile"}
            width={200}
            height={250}
            className="relative rounded-2xl border object-cover object-top"
            style={{ borderColor: "var(--border)" }}
            priority
          />
          <span className="absolute -right-2 -bottom-2 rotate-3 rounded-md bg-violet-600 px-2 py-1 text-[10px] font-bold text-white shadow-lg">
            {about?.handleBadge ?? profile?.handle ?? "YEL-59"}
          </span>
        </div>

        <div className="space-y-4">
          <div
            className="rounded-2xl border p-5"
            style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
          >
            <p className="text-[10px] font-bold tracking-[0.2em] text-violet-400 uppercase">
              Hello world
            </p>
            {intro.map((p) => (
              <p
                key={p.slice(0, 24)}
                className="mt-3 text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {p}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {funFacts.map((f) => (
              <div
                key={f.label}
                className="rounded-xl border p-3"
                style={{
                  background: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="inline-flex text-amber-400">
                  <IconView name={f.emoji} size={20} />
                </span>
                <p
                  className="mt-1 text-[10px]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {f.label}
                </p>
                <p className="text-xs font-medium">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {people.map((person) => (
        <div
          key={person._id}
          className="mt-8 rounded-2xl border p-5"
          style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
        >
          <p className="text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase">
            People who matter
          </p>
          <h2 className="mt-2 text-sm font-semibold">
            My {person.relation} — {person.name}
          </h2>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative mx-auto shrink-0 sm:mx-0">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 blur-md" />
              <Image
                src={person.imageUrl}
                alt={person.name}
                width={88}
                height={88}
                className="relative rounded-full border-2 object-cover"
                style={{ borderColor: "var(--border)" }}
              />
            </div>
            <div className="flex-1">
              {person.bioParagraphs.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="mt-3 text-sm leading-relaxed first:mt-0"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {p}
                </p>
              ))}
              {person.focusTags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {person.focusTags.map((tag) => (
                    <span key={tag} className="text-xs text-emerald-400">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {person.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border px-3 py-1.5 text-[11px] transition-colors hover:border-emerald-500/40 hover:text-emerald-400"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div
        className="mt-8 rounded-2xl border p-5"
        style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
      >
        <h2 className="text-sm font-semibold">How I think about code</h2>
        <ul className="mt-4 space-y-3">
          {philosophies.map((p) => (
            <li
              key={p}
              className="flex gap-3 text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              <span className="text-violet-400">→</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {(socialLinks.length
          ? socialLinks
          : [
              { label: "GitHub", href: "https://github.com/YEL-59" },
              { label: "Email", href: `mailto:${profile?.email ?? ""}` },
            ]
        ).map((l) => (
          <Link
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border px-4 py-2 text-xs transition-colors hover:border-violet-500/40 hover:text-violet-400"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

export default function AboutPage() {
  return (
    <PortfolioProvider>
      <AboutContent />
    </PortfolioProvider>
  );
}
