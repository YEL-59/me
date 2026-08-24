"use client";

import SectionForm from "@/components/dashboard/SectionForm";
import VisitorsPanel from "@/components/dashboard/VisitorsPanel";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  api,
  EMPTY_TEMPLATES,
  SECTIONS,
  SectionId,
  getDashboardKey,
  setDashboardKey,
} from "@/lib/dashboard-api";
import { FORM_FIELDS, stripMeta } from "@/lib/dashboard-forms";
import { IconView } from "@/lib/icons";
import "./dashboard.css";

type ListItem = Record<string, unknown> & { _id?: string };
type EditMode = "form" | "json";
type DashView = SectionId | "visitors";

const MODE_KEY = "dashboard_edit_mode";

const SECTION_META: Record<
  SectionId,
  { icon: string; group: "Core" | "Content" | "Library" }
> = {
  profile: { icon: "FiUser", group: "Core" },
  about: { icon: "FiInfo", group: "Core" },
  resume: { icon: "FiFileText", group: "Core" },
  "site-settings": { icon: "FiSettings", group: "Core" },
  skills: { icon: "FiStar", group: "Content" },
  experiences: { icon: "FiBriefcase", group: "Content" },
  education: { icon: "MdSchool", group: "Content" },
  projects: { icon: "MdRocketLaunch", group: "Content" },
  "open-source": { icon: "FiGithub", group: "Library" },
  "social-links": { icon: "FiLink", group: "Library" },
  people: { icon: "FiUsers", group: "Library" },
  files: { icon: "FiFolder", group: "Library" },
};

const GROUPS = ["Core", "Content", "Library"] as const;

function itemTitle(item: ListItem) {
  return String(
    item.title ||
      item.name ||
      item.label ||
      item.company ||
      item.place ||
      item.slug ||
      item._id,
  );
}

function itemSubtitle(item: ListItem) {
  return String(
    item.description ||
      item.role ||
      item.href ||
      item.detail ||
      item.category ||
      "",
  );
}

export default function DashboardPage() {
  const [active, setActive] = useState<DashView>("visitors");
  const [keyInput, setKeyInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [items, setItems] = useState<ListItem[]>([]);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [jsonText, setJsonText] = useState("{}");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<EditMode>("form");
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");

  const isVisitors = active === "visitors";

  const section = useMemo(
    () => (isVisitors ? null : SECTIONS.find((s) => s.id === active)!),
    [active, isVisitors],
  );

  const fields = section ? FORM_FIELDS[section.id] ?? [] : [];

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const hay = `${itemTitle(item)} ${itemSubtitle(item)} ${String(item.slug ?? "")} ${String(item.status ?? "")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  useEffect(() => {
    setMounted(true);
    const existing = getDashboardKey();
    if (existing) {
      setKeyInput(existing);
      setUnlocked(true);
    }
    try {
      const saved = localStorage.getItem(MODE_KEY) as EditMode | null;
      if (saved === "form" || saved === "json") setEditMode(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const setMode = (mode: EditMode) => {
    setError("");
    if (mode === editMode) return;
    if (mode === "json" && editMode === "form") {
      setJsonText(JSON.stringify(formData, null, 2));
    }
    if (mode === "form" && editMode === "json") {
      try {
        const parsed = JSON.parse(jsonText) as Record<string, unknown>;
        setFormData(parsed);
      } catch {
        setError("Invalid JSON — fix it before switching to Form");
        return;
      }
    }
    setEditMode(mode);
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      /* ignore */
    }
  };

  const cleanStringLists = (data: Record<string, unknown>) => {
    const next = { ...data };
    for (const field of fields) {
      if (field.type === "stringList" && Array.isArray(next[field.key])) {
        next[field.key] = (next[field.key] as string[])
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    return next;
  };

  const getBody = (): Record<string, unknown> => {
    if (editMode === "json") {
      return JSON.parse(jsonText) as Record<string, unknown>;
    }
    return cleanStringLists(formData);
  };

  const applyData = (data: Record<string, unknown>) => {
    const clean = stripMeta(data);
    setFormData(clean);
    setJsonText(JSON.stringify(clean, null, 2));
  };

  const startCreate = useCallback(() => {
    if (!section) return;
    setEditingId(null);
    setError("");
    setMessage("Ready to create a new item");
    applyData(EMPTY_TEMPLATES[section.id] ?? {});
  }, [section]);

  const loadSection = useCallback(
    async (retainId?: string | null) => {
      if (!unlocked || !section) return;
      setLoading(true);
      setError("");
      try {
        if (section.kind === "singleton") {
          const data = await api<Record<string, unknown> | null>(section.path, {
            auth: true,
          });
          applyData(data ?? {});
        } else {
          const data = await api<ListItem[]>(section.path, { auth: true });
          const list = data ?? [];
          setItems(list);

          if (retainId) {
            const found = list.find((i) => i._id === retainId);
            if (found) {
              setEditingId(found._id ?? null);
              applyData(found);
            } else {
              setEditingId(null);
              applyData(EMPTY_TEMPLATES[section.id] ?? {});
            }
          } else {
            setEditingId(null);
            applyData(EMPTY_TEMPLATES[section.id] ?? {});
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    },
    [section, unlocked],
  );

  useEffect(() => {
    setQuery("");
    setMessage("");
    setError("");
    if (!isVisitors) void loadSection();
  }, [active, unlocked, isVisitors, loadSection]);

  const unlock = () => {
    setDashboardKey(keyInput.trim());
    setUnlocked(true);
    setMessage("Dashboard unlocked");
  };

  const lockDashboard = () => {
    try {
      localStorage.removeItem("dashboard_key");
    } catch {
      /* ignore */
    }
    setUnlocked(false);
    setKeyInput("");
    setMessage("");
    setError("");
  };

  const saveSingleton = async () => {
    if (!section) return;
    setLoading(true);
    setError("");
    try {
      const body = getBody();
      await api(section.path, { method: "PUT", body });
      setMessage(`${section.label} saved`);
      const data = await api<Record<string, unknown> | null>(section.path, {
        auth: true,
      });
      applyData(data ?? {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const saveItem = async () => {
    if (!section) return;
    setLoading(true);
    setError("");
    try {
      const body = getBody();
      if (editingId) {
        const updated = await api<ListItem>(`${section.path}/${editingId}`, {
          method: "PATCH",
          body,
        });
        setMessage("Item updated");
        await loadSection(String(updated?._id ?? editingId));
      } else {
        const created = await api<ListItem>(section.path, {
          method: "POST",
          body,
        });
        setMessage("Item created");
        await loadSection(created?._id ? String(created._id) : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const editItem = (item: ListItem) => {
    setEditingId(item._id ?? null);
    setError("");
    setMessage(`Editing “${itemTitle(item)}”`);
    applyData(item);
  };

  const duplicateItem = (item: ListItem) => {
    const clean = stripMeta(item);
    if (typeof clean.slug === "string" && clean.slug) {
      clean.slug = `${clean.slug}-copy`;
    }
    if (typeof clean.title === "string") {
      clean.title = `${clean.title} (copy)`;
    } else if (typeof clean.name === "string") {
      clean.name = `${clean.name} (copy)`;
    } else if (typeof clean.label === "string") {
      clean.label = `${clean.label} (copy)`;
    }
    setEditingId(null);
    setMessage("Duplicated — save to create a new item");
    applyData(clean);
  };

  const deleteItem = async (id: string, title?: string) => {
    if (!section) return;
    if (!confirm(`Delete “${title || "this item"}”? This cannot be undone.`))
      return;
    setLoading(true);
    setError("");
    try {
      await api(`${section.path}/${id}`, { method: "DELETE" });
      setMessage("Item deleted");
      if (editingId === id) {
        setEditingId(null);
        applyData(EMPTY_TEMPLATES[section.id] ?? {});
      }
      const data = await api<ListItem[]>(section.path, { auth: true });
      setItems(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const seedAll = async () => {
    if (!confirm("Reset and seed all portfolio data from frontend defaults?"))
      return;
    setLoading(true);
    setError("");
    try {
      await api("/seed", { method: "POST", body: {} });
      setMessage("Portfolio seeded successfully");
      await loadSection();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Seed failed");
    } finally {
      setLoading(false);
    }
  };

  const modeTabs = (
    <div className="dash-tabs" role="tablist" aria-label="Editor mode">
      <button
        type="button"
        role="tab"
        aria-selected={editMode === "form"}
        className={editMode === "form" ? "is-active" : ""}
        onClick={() => setMode("form")}
      >
        <strong>Form</strong>
        <span>Easy fields · safer edits</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={editMode === "json"}
        className={editMode === "json" ? "is-active" : ""}
        onClick={() => setMode("json")}
      >
        <strong>JSON</strong>
        <span>Full raw control</span>
      </button>
    </div>
  );

  const editorBody =
    editMode === "form" ? (
      fields.length > 0 ? (
        <SectionForm
          fields={fields}
          value={formData}
          onChange={(next) => {
            setFormData(next);
            setJsonText(JSON.stringify(next, null, 2));
          }}
        />
      ) : (
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          No form fields for this section — switch to JSON.
        </p>
      )
    ) : (
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        className="dash-json"
        spellCheck={false}
        aria-label="JSON editor"
      />
    );

  if (!unlocked) {
    return (
      <div className="dash-shell">
        <div className="dash-lock">
          <div className="dash-lock-card">
            <p
              className="text-[10px] font-semibold tracking-[0.28em] uppercase"
              style={{ color: "var(--dash-accent)" }}
            >
              Portfolio CMS
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              Dashboard
            </h1>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Manage projects and content with Form or JSON. Add, edit, update,
              and delete anytime.
            </p>
            <label className="mt-6 block">
              <span className="dash-field-label">Dashboard secret</span>
              <input
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && unlock()}
                placeholder="DASHBOARD_SECRET"
                type="password"
                className="dash-input mt-1"
                autoFocus
              />
            </label>
            <button
              onClick={unlock}
              disabled={!keyInput.trim()}
              className="dash-btn dash-btn-primary mt-4 w-full"
            >
              Unlock dashboard
            </button>
            <Link
              href="/"
              className="mt-4 block text-center text-xs hover:underline"
              style={{ color: "var(--text-tertiary)" }}
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-shell">
      <header className="dash-topbar">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold"
            style={{
              background: "var(--dash-accent-soft)",
              color: "var(--dash-accent)",
              border: "1px solid var(--dash-accent-border)",
            }}
          >
            CMS
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">
              Portfolio Dashboard
            </p>
            <p
              className="truncate text-[11px]"
              style={{ color: "var(--text-tertiary)" }}
            >
              Form + JSON · add · edit · update · delete
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className="dash-btn dash-btn-ghost">
            View site
          </Link>
          <Link href="/project-list" className="dash-btn dash-btn-ghost">
            Project list
          </Link>
          <button
            type="button"
            onClick={lockDashboard}
            className="dash-btn dash-btn-ghost"
          >
            Lock
          </button>
        </div>
      </header>

      <div className="dash-layout">
        <aside className="dash-aside scrollbar-thin">
          <div className="mb-4">
            <p
              className="mb-1.5 px-2 text-[10px] font-semibold tracking-[0.18em] uppercase"
              style={{ color: "var(--text-tertiary)" }}
            >
              Insights
            </p>
            <nav className="space-y-0.5">
              <button
                type="button"
                onClick={() => setActive("visitors")}
                className={`dash-nav-btn ${
                  active === "visitors" ? "is-active" : ""
                }`}
              >
                <span className="dash-nav-icon">
                  <IconView name="FiBarChart2" size={14} />
                </span>
                <span className="truncate">Visitors</span>
              </button>
            </nav>
          </div>

          {GROUPS.map((group) => {
            const groupSections = SECTIONS.filter(
              (s) => SECTION_META[s.id].group === group,
            );
            return (
              <div key={group} className="mb-4 last:mb-0">
                <p
                  className="mb-1.5 px-2 text-[10px] font-semibold tracking-[0.18em] uppercase"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {group}
                </p>
                <nav className="space-y-0.5">
                  {groupSections.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActive(s.id)}
                      className={`dash-nav-btn ${
                        active === s.id ? "is-active" : ""
                      }`}
                    >
                      <span className="dash-nav-icon">
                        <IconView name={SECTION_META[s.id].icon} size={14} />
                      </span>
                      <span className="truncate">{s.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            );
          })}

          <button
            type="button"
            onClick={seedAll}
            className="dash-btn dash-btn-warn mt-2 w-full"
          >
            Seed all data
          </button>
        </aside>

        <section
          className={`dash-panel transition-opacity duration-300 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="flex flex-wrap items-start justify-between gap-3 border-b pb-4"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="grid h-8 w-8 place-items-center rounded-lg text-sm"
                style={{
                  background: "var(--dash-accent-soft)",
                  color: "var(--dash-accent)",
                }}
              >
                <IconView
                  name={
                    isVisitors
                      ? "FiBarChart2"
                      : SECTION_META[section!.id].icon
                  }
                  size={16}
                />
              </span>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  {isVisitors ? "Visitors" : section!.label}
                </h2>
                <p
                  className="text-[11px]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {isVisitors
                    ? "Daily unique visitors and page views"
                    : section!.kind === "singleton"
                      ? "Single document · choose Form or JSON below"
                      : `${items.length} item${items.length === 1 ? "" : "s"} · full CRUD`}
                </p>
              </div>
            </div>
            {!isVisitors && (
              <button
                type="button"
                onClick={() => void loadSection(editingId)}
                className="dash-btn dash-btn-ghost"
                disabled={loading}
              >
                Refresh
              </button>
            )}
          </div>

          <div className="mt-4 space-y-2">
            {message && <p className="dash-alert dash-alert-ok">{message}</p>}
            {error && <p className="dash-alert dash-alert-err">{error}</p>}
            {loading && !isVisitors && (
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                Working…
              </p>
            )}
          </div>

          {isVisitors ? (
            <div className="mt-5">
              <VisitorsPanel />
            </div>
          ) : (
            <>
          {/* Always-visible Form / JSON choice */}
          <div className="mt-4">{modeTabs}</div>
          <p
            className="mt-2 text-[11px]"
            style={{ color: "var(--text-tertiary)" }}
          >
            Showing <strong style={{ color: "var(--dash-accent)" }}>{editMode === "form" ? "Form" : "JSON"}</strong>{" "}
            editor · your choice is remembered
          </p>

          {section!.kind === "singleton" ? (
            <div className="mt-4">
              <div className="dash-editor-pane">{editorBody}</div>
              <div className="dash-savebar">
                <p
                  className="text-[11px]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Update this section anytime
                </p>
                <button
                  type="button"
                  onClick={saveSingleton}
                  disabled={loading}
                  className="dash-btn dash-btn-primary"
                >
                  Save / Update {section?.label ?? "Section"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)]">
              <div>
                <div className="dash-crud-bar">
                  <button
                    type="button"
                    onClick={startCreate}
                    className="dash-btn dash-btn-primary"
                  >
                    + Add new
                  </button>
                  <button
                    type="button"
                    onClick={() => void loadSection()}
                    disabled={loading}
                    className="dash-btn dash-btn-secondary"
                  >
                    Reload list
                  </button>
                </div>

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${section?.label?.toLowerCase() ?? "items"}…`}
                  className="dash-input mb-3"
                />

                <div className="scrollbar-thin max-h-[70vh] space-y-2 overflow-y-auto pr-1">
                  {filteredItems.length === 0 && (
                    <div
                      className="rounded-xl border border-dashed px-4 py-8 text-center text-xs"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      {items.length === 0
                        ? "No items yet. Click “Add new” to create one."
                        : "No matches for your search."}
                    </div>
                  )}
                  {filteredItems.map((item) => (
                    <div
                      key={String(item._id)}
                      role="button"
                      tabIndex={0}
                      onClick={() => editItem(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          editItem(item);
                        }
                      }}
                      className={`dash-item ${
                        editingId === item._id ? "is-selected" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-snug">
                            {itemTitle(item)}
                          </p>
                          {itemSubtitle(item) && (
                            <p
                              className="mt-1 line-clamp-2 text-[11px] leading-relaxed"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {itemSubtitle(item)}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.status != null && (
                              <span
                                className="rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase"
                                style={{
                                  background: "var(--dash-accent-soft)",
                                  color: "var(--dash-accent)",
                                }}
                              >
                                {String(item.status)}
                              </span>
                            )}
                            {item.emoji != null && String(item.emoji) && (
                              <span
                                className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px]"
                                style={{
                                  background: "var(--bg-primary)",
                                  color: "var(--text-secondary)",
                                }}
                              >
                                <IconView
                                  name={String(item.emoji)}
                                  size={12}
                                />
                                icon
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className="mt-3 flex flex-wrap gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => editItem(item)}
                          className="dash-btn dash-btn-ghost text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateItem(item)}
                          className="dash-btn dash-btn-ghost text-[11px]"
                        >
                          Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            deleteItem(String(item._id), itemTitle(item))
                          }
                          className="dash-btn dash-btn-danger text-[11px]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div
                  className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b pb-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <h3 className="text-sm font-medium">
                    {editingId ? "Edit / Update" : "Add new"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {editingId && (
                      <span
                        className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                        style={{
                          background: "var(--dash-accent-soft)",
                          color: "var(--dash-accent)",
                        }}
                      >
                        Editing
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={startCreate}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      Clear → new
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() =>
                          deleteItem(
                            editingId,
                            String(formData.title || formData.name || "item"),
                          )
                        }
                        className="text-[11px] text-red-400 hover:underline"
                      >
                        Delete this
                      </button>
                    )}
                  </div>
                </div>

                <div className="dash-editor-pane">{editorBody}</div>

                <div className="dash-savebar">
                  <p
                    className="text-[11px]"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {editMode === "form" ? "Form" : "JSON"} ·{" "}
                    {editingId ? "will update existing" : "will create new"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          const current = items.find((i) => i._id === editingId);
                          if (current) duplicateItem(current);
                        }}
                        className="dash-btn dash-btn-ghost"
                        disabled={loading}
                      >
                        Duplicate
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={saveItem}
                      disabled={loading}
                      className="dash-btn dash-btn-primary"
                    >
                      {editingId ? "Update" : "Create / Add"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
