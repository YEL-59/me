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
        <span className="text-emerald-500">&apos;tofayel&apos;</span>
      </>
    ),
  },
  { n: 2, parts: <>&nbsp;</> },
  {
    n: 3,
    parts: (
      <span style={{ color: "var(--code-comment)" }}>{"// Collection name"}</span>
    ),
  },
  {
    n: 4,
    parts: (
      <>
        <span className="text-pink-500">export const</span>{" "}
        <span className="text-sky-500">collection</span>{" "}
        <span style={{ color: "var(--text-secondary)" }}>= </span>
        <span className="text-emerald-500">&apos;Development&apos;</span>
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
        <span className="text-emerald-500">&apos;Frontend developer&apos;</span>
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
        <span className="text-emerald-500">&apos;Dhaka&apos;</span>
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
        <span className="text-emerald-500">
          &apos;Hatirjheel, Noyatola&apos;
        </span>
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
        <span className="text-emerald-500">
          &apos;React&apos;, &apos;Next.js&apos;, &apos;TypeScript&apos;
        </span>
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
        <span className="text-emerald-500">&apos;open to work&apos;</span>
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

export default function CodeCard() {
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
