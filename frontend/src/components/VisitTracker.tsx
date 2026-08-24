"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
const VISITOR_KEY = "portfolio_visitor_id";

function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return `anon_${Date.now()}`;
  }
}

/** Silent page-view tracker for public pages (skips /dashboard). */
export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/dashboard")) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      const visitorId = getVisitorId();
      void fetch(`${API_URL}/analytics/hit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, path: pathname }),
        keepalive: true,
      }).catch(() => {
        /* ignore offline / CORS blips */
      });
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
