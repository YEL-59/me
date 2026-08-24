"use client";

import { api } from "@/lib/dashboard-api";
import { useCallback, useEffect, useState } from "react";

type DayRow = {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
};

type Summary = {
  timezone: string;
  today: DayRow;
  yesterday: DayRow;
  last7Days: DayRow[];
  last7Totals: { pageViews: number; uniqueVisitors: number };
  daily: DayRow[];
  rangeTotals: { pageViews: number; uniqueVisitors: number };
  allTime: { pageViews: number; uniqueVisitors: number };
  peakDay: DayRow;
};

function formatLabel(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function StatCard({
  label,
  visitors,
  views,
  hint,
}: {
  label: string;
  visitors: number;
  views: number;
  hint?: string;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-secondary)",
      }}
    >
      <p
        className="text-[10px] font-semibold tracking-[0.16em] uppercase"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-amber-400">
        {visitors}
      </p>
      <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
        unique visitors
      </p>
      <p className="mt-2 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
        {views} page views{hint ? ` · ${hint}` : ""}
      </p>
    </div>
  );
}

export default function VisitorsPanel() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const summary = await api<Summary>("/analytics/summary?days=30", {
        auth: true,
      });
      setData(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const maxVisitors = Math.max(
    1,
    ...(data?.daily.map((d) => d.uniqueVisitors) ?? [1]),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Daily visitors</h3>
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            Unique people + page views · day boundary{" "}
            {data?.timezone ?? "Asia/Dhaka"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="dash-btn dash-btn-ghost"
          disabled={loading}
        >
          Refresh stats
        </button>
      </div>

      {error && <p className="dash-alert dash-alert-err">{error}</p>}
      {loading && !data && (
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          Loading visitor stats…
        </p>
      )}

      {data && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Today"
              visitors={data.today.uniqueVisitors}
              views={data.today.pageViews}
            />
            <StatCard
              label="Yesterday"
              visitors={data.yesterday.uniqueVisitors}
              views={data.yesterday.pageViews}
            />
            <StatCard
              label="Last 7 days"
              visitors={data.last7Totals.uniqueVisitors}
              views={data.last7Totals.pageViews}
              hint="sum of daily uniques"
            />
            <StatCard
              label="All time"
              visitors={data.allTime.uniqueVisitors}
              views={data.allTime.pageViews}
              hint="sum of daily uniques"
            />
          </div>

          <div
            className="rounded-xl border p-4"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-secondary)",
            }}
          >
            <p className="text-xs font-medium">Last 30 days</p>
            <p
              className="mt-1 text-[11px]"
              style={{ color: "var(--text-tertiary)" }}
            >
              Peak day: {formatLabel(data.peakDay.date)} ·{" "}
              {data.peakDay.uniqueVisitors} visitors · {data.peakDay.pageViews}{" "}
              views
            </p>

            <div className="mt-4 flex h-28 items-end gap-1">
              {[...data.daily].reverse().map((d) => (
                <div
                  key={d.date}
                  className="group relative flex flex-1 flex-col items-center justify-end"
                  title={`${d.date}: ${d.uniqueVisitors} visitors, ${d.pageViews} views`}
                >
                  <div
                    className="w-full max-w-[14px] rounded-t-sm bg-amber-400/80 transition-opacity group-hover:opacity-100"
                    style={{
                      height: `${Math.max(
                        4,
                        (d.uniqueVisitors / maxVisitors) * 100,
                      )}%`,
                      opacity: d.uniqueVisitors === 0 ? 0.2 : 0.85,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            className="overflow-x-auto rounded-xl border"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-primary)",
            }}
          >
            <table className="w-full min-w-[420px] text-left text-xs">
              <thead>
                <tr style={{ color: "var(--text-tertiary)" }}>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Unique visitors</th>
                  <th className="px-4 py-3 font-medium">Page views</th>
                </tr>
              </thead>
              <tbody>
                {data.daily.map((d) => (
                  <tr
                    key={d.date}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-medium">{formatLabel(d.date)}</span>
                      <span
                        className="ml-2 font-mono text-[10px]"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {d.date}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-amber-400">
                      {d.uniqueVisitors}
                    </td>
                    <td
                      className="px-4 py-2.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {d.pageViews}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
