"use client";

import { useRef, useState } from "react";
import IconPicker from "@/components/dashboard/IconPicker";
import { uploadFile } from "@/lib/dashboard-api";
import type { FieldDef } from "@/lib/dashboard-forms";

type SectionFormProps = {
  fields: FieldDef[];
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
};

const WIDE_TYPES = new Set(["textarea", "stringList", "objectList", "icon", "file"]);

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="mb-1.5">
      <div className="dash-field-label">{label}</div>
      {hint && <p className="dash-field-hint">{hint}</p>}
    </div>
  );
}

function FileUploadField({
  label,
  hint,
  value,
  onChange,
  className,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = await uploadFile(file);
      onChange(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const isPdf = value.toLowerCase().endsWith(".pdf") || value.includes(".pdf");
  const isImage = /\.(png|jpg|jpeg|webp|svg|gif)($|\?)/i.test(value);

  return (
    <div className={className}>
      <FieldLabel label={label} hint={hint} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="File URL or upload from device..."
          className="dash-input flex-1 font-mono text-xs"
        />
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.tex,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.svg,.gif,.json"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="dash-btn dash-btn-secondary shrink-0"
        >
          {uploading ? "Uploading…" : "📁 Upload File"}
        </button>
      </div>

      {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}

      {value && (
        <div className="mt-2 flex items-center gap-3">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:underline"
          >
            {isPdf ? "📄 View PDF" : isImage ? "🖼️ View Image" : "🔗 Open / Test Link"} →
          </a>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[11px] text-red-400 hover:underline"
          >
            Clear
          </button>
        </div>
      )}
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

        if (field.type === "file") {
          return (
            <FileUploadField
              key={field.key}
              label={field.label}
              hint={field.hint}
              value={String(current ?? "")}
              onChange={(next) => setField(field.key, next)}
              className={wide}
            />
          );
        }


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
