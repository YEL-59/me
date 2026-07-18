"use client";

import { useMemo, useState } from "react";
import {
  IconView,
  isKnownIcon,
  resolveIcon,
  searchIcons,
} from "@/lib/icons";

type IconPickerProps = {
  value: string;
  onChange: (next: string) => void;
  compact?: boolean;
};

export default function IconPicker({
  value,
  onChange,
  compact = false,
}: IconPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => searchIcons(query || value, 60), [query, value]);
  const known = isKnownIcon(value);
  const typedKnown = Boolean(resolveIcon(query.trim() || value));

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border text-lg"
          style={{
            borderColor: "var(--border)",
            background: "var(--bg-secondary)",
            color: "var(--dash-accent, #f59e0b)",
          }}
          title={known ? value : "Emoji or unknown code"}
        >
          <IconView name={value || "FiStar"} size={compact ? 16 : 18} />
        </div>
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setQuery(value);
            setOpen(true);
          }}
          placeholder="FiGithub or 🚀"
          className="dash-input font-mono text-xs"
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="dash-btn dash-btn-ghost shrink-0 text-[11px]"
        >
          Browse
        </button>
      </div>

      {!compact && (
        <p className="dash-field-hint mt-1">
          Type a{" "}
          <a
            href="https://react-icons.github.io/react-icons/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:underline"
          >
            react-icons
          </a>{" "}
          name (FiGithub, MdRocketLaunch, SiReact) or paste an emoji.{" "}
          {value && (
            <span style={{ color: known ? "#34d399" : "var(--text-tertiary)" }}>
              {known ? "✓ icon found" : "emoji / custom text"}
            </span>
          )}
        </p>
      )}

      {open && (
        <div
          className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border p-2 shadow-xl"
          style={{
            borderColor: "var(--border)",
            background: "var(--bg-primary)",
          }}
        >
          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <p
              className="text-[10px] uppercase tracking-wider"
              style={{ color: "var(--text-tertiary)" }}
            >
              {matches.length} icons
              {typedKnown && query ? ` · “${query.trim()}” is valid` : ""}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[10px] text-amber-400 hover:underline"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-6 gap-1 sm:grid-cols-8">
            {matches.map((name) => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => {
                  onChange(name);
                  setQuery(name);
                  setOpen(false);
                }}
                className="grid aspect-square place-items-center rounded-lg border transition-colors hover:border-amber-400/50"
                style={{
                  borderColor:
                    value === name
                      ? "var(--dash-accent-border, rgba(245,158,11,0.45))"
                      : "var(--border)",
                  background:
                    value === name
                      ? "var(--dash-accent-soft, rgba(245,158,11,0.12))"
                      : "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
              >
                <IconView name={name} size={16} />
              </button>
            ))}
          </div>
          {matches.length === 0 && (
            <p
              className="px-2 py-4 text-center text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              No catalog match. Keep typing a full name like{" "}
              <span className="font-mono text-amber-400">LuBot</span> if you
              know it.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
