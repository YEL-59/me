"use client";

import { usePortfolio } from "../PortfolioProvider";

export default function CodeCard() {
  const { data } = usePortfolio();
  const profile = data?.profile;
  const role = profile?.role ?? "Frontend developer";
  const collection = profile?.collectionLabel ?? "Development";
  const city =
    profile?.locationCity?.split(",")[0]?.trim() ?? "Dhaka";
  const area = profile?.locationArea ?? "Hatirjheel, Noyatola";
  const stack = (profile?.codeCardStack?.length
    ? profile.codeCardStack
    : data?.skills?.slice(0, 3).map((s) => s.label) ?? [
        "React",
        "Next.js",
        "TypeScript",
      ]
  ).map((s) => `'${s}'`).join(", ");
  const status =
    profile?.availabilityStatus?.toLowerCase() ?? "open to work";
  const importName = (profile?.shortName ?? "tofayel").toLowerCase();

  const lines: { n: number; parts: React.ReactNode }[] = [
    {
      n: 1,
      parts: (
        <>
          <span className="text-pink-500">import</span>{" "}
          <span className="text-sky-500">passion</span>
          <span style={{ color: "var(--text-secondary)" }}>, </span>
          <span style={{ color: "var(--text-secondary)" }}>{"{ craft }"}</span>{" "}
          <span className="text-pink-500">from</span>{" "}
          <span className="text-emerald-500">&apos;{importName}&apos;</span>
        </>
      ),
    },
    { n: 2, parts: <>&nbsp;</> },
    {
      n: 3,
      parts: (
        <span style={{ color: "var(--code-comment)" }}>
          {"// Collection name"}
        </span>
      ),
    },
    {
      n: 4,
      parts: (
        <>
          <span className="text-pink-500">export const</span>{" "}
          <span className="text-sky-500">collection</span>{" "}
          <span style={{ color: "var(--text-secondary)" }}>= </span>
          <span className="text-emerald-500">&apos;{collection}&apos;</span>
        </>
      ),
    },
    { n: 5, parts: <>&nbsp;</> },
    {
      n: 6,
      parts: (
        <span style={{ color: "var(--code-comment)" }}>{"// Profile"}</span>
      ),
    },
    {
      n: 7,
      parts: (
        <>
          <span className="text-pink-500">const</span>{" "}
          <span className="text-sky-500">developer</span>{" "}
          <span style={{ color: "var(--text-secondary)" }}>= </span>
          <span className="text-pink-500">new</span>{" "}
          <span className="text-amber-500">Developer</span>
          <span style={{ color: "var(--text-secondary)" }}>({"{"}</span>
        </>
      ),
    },
    {
      n: 8,
      parts: (
        <>
          <span className="text-sky-500">role</span>
          <span style={{ color: "var(--text-secondary)" }}>: </span>
          <span className="text-emerald-500">&apos;{role}&apos;</span>
          <span style={{ color: "var(--text-secondary)" }}>,</span>
        </>
      ),
    },
    {
      n: 9,
      parts: (
        <>
          <span className="text-sky-500">location</span>
          <span style={{ color: "var(--text-secondary)" }}>: {"{"}</span>
        </>
      ),
    },
    {
      n: 10,
      parts: (
        <>
          <span className="text-sky-500">city</span>
          <span style={{ color: "var(--text-secondary)" }}>: </span>
          <span className="text-emerald-500">&apos;{city}&apos;</span>
          <span style={{ color: "var(--text-secondary)" }}>,</span>
        </>
      ),
    },
    {
      n: 11,
      parts: (
        <>
          <span className="text-sky-500">area</span>
          <span style={{ color: "var(--text-secondary)" }}>: </span>
          <span className="text-emerald-500">&apos;{area}&apos;</span>
          <span style={{ color: "var(--text-secondary)" }}>,</span>
        </>
      ),
    },
    {
      n: 12,
      parts: <span style={{ color: "var(--text-secondary)" }}>{"  },"}</span>,
    },
    {
      n: 13,
      parts: (
        <>
          <span className="text-sky-500">stack</span>
          <span style={{ color: "var(--text-secondary)" }}>: [</span>
          <span className="text-emerald-500">{stack}</span>
          <span style={{ color: "var(--text-secondary)" }}>],</span>
        </>
      ),
    },
    {
      n: 14,
      parts: (
        <>
          <span className="text-sky-500">status</span>
          <span style={{ color: "var(--text-secondary)" }}>: </span>
          <span className="text-emerald-500">&apos;{status}&apos;</span>
        </>
      ),
    },
    {
      n: 15,
      parts: <span style={{ color: "var(--text-secondary)" }}>{"})"}</span>,
    },
    { n: 16, parts: <>&nbsp;</> },
    {
      n: 17,
      parts: (
        <>
          <span className="text-pink-500">export default</span>{" "}
          <span className="text-sky-500">developer</span>
        </>
      ),
    },
  ];

  return (
    <div className="card h-full overflow-hidden rounded-xl">
      <div className="scrollbar-thin h-full overflow-auto p-3 font-mono text-[13px] leading-5">
        {lines.map((line) => (
          <div key={line.n} className="flex">
            <span
              className="mr-3 w-5 shrink-0 select-none text-right"
              style={{ color: "var(--text-muted)" }}
            >
              {line.n}
            </span>
            <span style={{ color: "var(--code-text)" }}>{line.parts}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
