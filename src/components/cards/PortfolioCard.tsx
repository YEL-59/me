"use client";

import { useState } from "react";

export default function PortfolioCard() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleSubmit = () => {
    if (passcode === "dev2025") {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setUnlocked(false);
    }
  };

  return (
    <div className="card relative flex h-full flex-col overflow-hidden rounded-xl">
      <div className="absolute top-0 left-0 h-full w-1 bg-red-500/80" />

      <div className="flex flex-1 flex-col justify-between p-4 pl-5">
        <div>
          <h3
            className="text-xs font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            My portfolio
          </h3>
          <p
            className="mt-2 text-[10px] leading-relaxed"
            style={{ color: "var(--text-tertiary)" }}
          >
            Some projects are under NDA. Email me and I&apos;ll send you
            access.
          </p>
        </div>

        <div>
          {unlocked ? (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
              <p className="text-[10px] text-emerald-500">Access granted ✓</p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-[10px] underline"
                style={{ color: "var(--text-secondary)" }}
              >
                View on GitHub →
              </a>
            </div>
          ) : (
            <>
              <div className="relative">
                <span
                  className="absolute top-1/2 left-3 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </span>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setError(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Enter passcode"
                  aria-label="My portfolio"
                  className="w-full rounded-lg border py-2 pr-3 pl-9 text-xs focus:outline-none"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              {error && (
                <p className="mt-1.5 text-[10px] text-red-500">
                  Incorrect passcode
                </p>
              )}
              <button
                onClick={handleSubmit}
                className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border py-2 text-[11px] transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                View portfolio
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
