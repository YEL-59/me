"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

export default function SiteHeader() {
  const { isDark, toggleTheme } = useTheme();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Dhaka",
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "Asia/Dhaka",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="rounded-b-[28px] border-b border-l border-r transition-colors duration-300"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-primary)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border text-sm font-semibold"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-secondary)",
              color: "var(--text-secondary)",
            }}
          >
            T
          </span>
          <p
            className="truncate text-base"
            style={{ color: "var(--text-primary)" }}
          >
            Hello, it&apos;s Tofayel <span aria-hidden>👋</span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div
            className="hidden items-center gap-2 rounded-full border py-1 pl-1 pr-2 sm:flex"
            style={{
              borderColor: "var(--pill-border)",
              background: "var(--pill-bg)",
            }}
          >
            <span
              className="flex items-center gap-1 rounded-full border py-0.5 pl-1.5 pr-2 text-xs font-medium"
              style={{
                borderColor: "var(--pill-border)",
                background: "var(--pill-inner)",
                color: "var(--text-primary)",
              }}
            >
              <SunIcon />
              <span suppressHydrationWarning>
                {mounted ? time : "--:-- --"}
              </span>
            </span>
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
              suppressHydrationWarning
            >
              {mounted ? date : "..."}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
              className={`flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 outline-none transition-colors duration-300 ${
                isDark ? "bg-violet-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  isDark ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className="whitespace-nowrap text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {isDark ? "Dark" : "Light"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
