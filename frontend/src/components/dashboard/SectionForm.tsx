"use client";

import IconPicker from "@/components/dashboard/IconPicker";
import type { FieldDef } from "@/lib/dashboard-forms";

type SectionFormProps = {
  fields: FieldDef[];
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
};

const WIDE_TYPES = new Set(["textarea", "stringList", "objectList", "icon"]);

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="mb-1.5">
      <div className="dash-field-label">{label}</div>
      {hint && <p className="dash-field-hint">{hint}</p>}
    </div>
  );
}

export default function SectionForm({
  fields,
  value,
  onChange,
}: SectionFormProps) {
  const setField = (key: string, next: unknown) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <div className="dash-form-grid">
      {fields.map((field) => {
        const current = value[field.key];
        const wide = WIDE_TYPES.has(field.type) ? "dash-span-2" : "";

        if (field.type === "boolean") {
          return (
            <label
              key={field.key}
              className={`${wide} flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition-colors`}
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-secondary)",
              }}
            >
              <input
                type="checkbox"
                checked={Boolean(current)}
                onChange={(e) => setField(field.key, e.target.checked)}
                className="h-4 w-4 accent-amber-500"
              />
              <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                {field.label}
              </span>
            </label>
          );
        }

        if (field.type === "select") {
          return (
            <div key={field.key} className={wide}>
              <FieldLabel label={field.label} hint={field.hint} />
              <select
                value={String(current ?? "")}
                onChange={(e) => setField(field.key, e.target.value)}
                className="dash-input"
              >
                {(field.options ?? []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === "stringList") {
          const lines = Array.isArray(current)
            ? (current as string[]).join("\n")
            : "";
          return (
            <div key={field.key} className={wide}>
              <FieldLabel label={field.label} hint={field.hint} />
              <textarea
                value={lines}
                onChange={(e) =>
                  setField(
                    field.key,
                    e.target.value.split("\n").map((s) => s.trimEnd()),
                  )
                }
                onBlur={() => {
                  if (!Array.isArray(current)) return;
                  setField(
                    field.key,
                    (current as string[]).map((s) => s.trim()).filter(Boolean),
                  );
                }}
                rows={4}
                className="dash-input font-mono text-xs"
              />
            </div>
          );
        }

        if (field.type === "icon") {
          return (
            <div key={field.key} className={wide}>
              <FieldLabel label={field.label} hint={field.hint} />
              <IconPicker
                value={String(current ?? "")}
                onChange={(next) => setField(field.key, next)}
              />
            </div>
          );
        }

        if (field.type === "objectList") {
          const rows = Array.isArray(current)
            ? (current as Record<string, string>[])
            : [];
          const columns = field.columns ?? [];
          const hasIconCol = columns.some((c) => c.type === "icon");

          return (
            <div key={field.key} className={wide}>
              <FieldLabel label={field.label} hint={field.hint} />
              <div
                className="space-y-2 rounded-xl border p-3"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--bg-secondary)",
                }}
              >
                {rows.length === 0 && (
                  <p
                    className="text-[11px]"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    No rows yet
                  </p>
                )}
                {rows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`grid gap-2 rounded-lg border p-2 ${
                      hasIconCol
                        ? "sm:grid-cols-1"
                        : "sm:grid-cols-[repeat(auto-fit,minmax(7rem,1fr))_auto]"
                    }`}
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--bg-primary)",
                    }}
                  >
                    {columns.map((col) =>
                      col.type === "icon" ? (
                        <div key={col.key}>
                          <p className="dash-field-label mb-1">{col.label}</p>
                          <IconPicker
                            compact
                            value={row[col.key] ?? ""}
                            onChange={(next) => {
                              const updated = rows.map((r, i) =>
                                i === rowIndex ? { ...r, [col.key]: next } : r,
                              );
                              setField(field.key, updated);
                            }}
                          />
                        </div>
                      ) : (
                        <input
                          key={col.key}
                          value={row[col.key] ?? ""}
                          onChange={(e) => {
                            const next = rows.map((r, i) =>
                              i === rowIndex
                                ? { ...r, [col.key]: e.target.value }
                                : r,
                            );
                            setField(field.key, next);
                          }}
                          placeholder={col.label}
                          className="dash-input"
                        />
                      ),
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setField(
                          field.key,
                          rows.filter((_, i) => i !== rowIndex),
                        )
                      }
                      className="dash-btn dash-btn-danger text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const blank: Record<string, string> = {};
                    columns.forEach((c) => {
                      blank[c.key] = c.type === "icon" ? "FiStar" : "";
                    });
                    setField(field.key, [...rows, blank]);
                  }}
                  className="text-xs font-medium text-amber-400 hover:underline"
                >
                  + Add row
                </button>
              </div>
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div key={field.key} className={wide}>
              <FieldLabel label={field.label} hint={field.hint} />
              <textarea
                value={String(current ?? "")}
                onChange={(e) => setField(field.key, e.target.value)}
                rows={3}
                className="dash-input"
              />
            </div>
          );
        }

        if (field.type === "number") {
          return (
            <div key={field.key} className={wide}>
              <FieldLabel label={field.label} hint={field.hint} />
              <input
                type="number"
                value={
                  current === undefined || current === null
                    ? ""
                    : String(current)
                }
                onChange={(e) => {
                  const raw = e.target.value;
                  setField(field.key, raw === "" ? undefined : Number(raw));
                }}
                className="dash-input"
              />
            </div>
          );
        }

        if (field.type === "color") {
          const color = String(current ?? "#f59e0b");
          return (
            <div key={field.key} className={wide}>
              <FieldLabel label={field.label} hint={field.hint} />
              <div className="flex gap-2">
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : "#f59e0b"}
                  onChange={(e) => setField(field.key, e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-lg border"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg-input)",
                  }}
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setField(field.key, e.target.value)}
                  className="dash-input"
                />
              </div>
            </div>
          );
        }

        return (
          <div key={field.key} className={wide}>
            <FieldLabel label={field.label} hint={field.hint} />
            <input
              type={field.type === "password" ? "password" : "text"}
              value={String(current ?? "")}
              onChange={(e) => setField(field.key, e.target.value)}
              className="dash-input"
              autoComplete={field.type === "password" ? "off" : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
