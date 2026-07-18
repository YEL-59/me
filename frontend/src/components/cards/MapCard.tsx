"use client";

import mapData from "@/data/map-points.json";
import { useCallback, useRef, useState } from "react";
import { usePortfolio } from "../PortfolioProvider";

const { width, height, pin, points } = mapData;

const REGION_RADIUS = 14;

function dist(
  ax: number,
  ay: number,
  bx: number,
  by: number
): number {
  return Math.hypot(ax - bx, ay - by);
}

export default function MapCard() {
  const { data } = usePortfolio();
  const LOCATION = {
    area: data?.profile?.locationArea ?? "Hatirjheel, Noyatola",
    city: data?.profile?.locationCity ?? "Dhaka, Bangladesh",
    lat: data?.profile?.lat ?? 23.8103,
    lng: data?.profile?.lng ?? 90.4125,
  };
  const inviteLine =
    data?.siteSettings?.mapInviteLine ??
    "If you're in Dhaka, let's grab a coffee.";
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [pinHovered, setPinHovered] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        setCursor({
          x: ((e.clientX - rect.left) / rect.width) * width,
          y: ((e.clientY - rect.top) / rect.height) * height,
        });
      });
    },
    []
  );

  const handleMouseLeave = () => {
    cancelAnimationFrame(rafRef.current);
    setCursor(null);
    setPinHovered(false);
  };

  const nearPin = cursor ? dist(cursor.x, cursor.y, pin.x, pin.y) < 18 : false;

  return (
    <div
      className="card group relative h-full overflow-hidden rounded-xl"
      style={{ borderColor: undefined }}
    >
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-violet-500/[0.05] via-transparent to-cyan-500/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {cursor && (
        <div
          className="pointer-events-none absolute z-10 rounded-full transition-[left,top] duration-75 ease-out"
          style={{
            width: 140,
            height: 140,
            left: `${(cursor.x / width) * 100}%`,
            top: `${(cursor.y / height) * 100}%`,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
          }}
        />
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="relative z-20 h-full w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label="World map showing location in Dhaka, Bangladesh"
      >
        <defs>
          <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>

          <mask id="spotlight">
            <rect width={width} height={height} fill="black" />
            {cursor && (
              <circle
                cx={cursor.x}
                cy={cursor.y}
                r={28}
                fill="white"
                style={{ filter: "blur(6px)" }}
              />
            )}
          </mask>

          <filter id="pinBlur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g>
          {points.map((dot, i) => {
            const nearRegion = dist(dot.x, dot.y, pin.x, pin.y) < REGION_RADIUS;
            return (
              <circle
                key={i}
                cx={dot.x}
                cy={dot.y}
                r={nearRegion ? 0.42 : 0.32}
                fill={nearRegion ? "var(--map-dot-region)" : "var(--map-dot)"}
                opacity={nearRegion ? 0.75 : 0.45}
              />
            );
          })}
        </g>

        <g mask="url(#spotlight)">
          {points.map((dot, i) => (
            <circle
              key={`lit-${i}`}
              cx={dot.x}
              cy={dot.y}
              r={0.48}
              fill="var(--map-dot-hover)"
              opacity={0.85}
            />
          ))}
        </g>

        <g
          transform={`translate(${pin.x}, ${pin.y})`}
          onMouseEnter={() => setPinHovered(true)}
          onMouseLeave={() => setPinHovered(false)}
          style={{ cursor: "pointer" }}
        >
          <circle r={16} fill="url(#pinGlow)" opacity={pinHovered ? 0.9 : 0.55}>
            <animate
              attributeName="r"
              values="12;18;12"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.45;0.75;0.45"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>

          <circle
            r={8}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth={0.4}
            opacity={0.5}
          >
            <animate
              attributeName="r"
              values="6;14;6"
              dur="2.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0;0.6"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>

          <circle
            r={5}
            fill="none"
            stroke="#c4b5fd"
            strokeWidth={0.35}
            opacity={0.35}
          >
            <animate
              attributeName="r"
              values="5;11;5"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0;0.4"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          <circle
            r={2.8}
            fill="#8b5cf6"
            filter="url(#pinBlur)"
            className="transition-transform duration-300"
            style={{ transform: pinHovered ? "scale(1.25)" : "scale(1)" }}
          />
          <circle r={1.2} fill="#ede9fe" opacity={0.95} />
        </g>
      </svg>

      <div
        className={`pointer-events-none absolute top-[38%] z-30 rounded-lg border px-2.5 py-1.5 text-[10px] leading-tight backdrop-blur-md transition-all duration-300 ${
          pinHovered || nearPin
            ? "translate-y-0 opacity-100"
            : "translate-y-1 opacity-0"
        }`}
        style={{
          left: `${(pin.x / width) * 100 - 8}%`,
          background: "var(--map-tooltip-bg)",
          borderColor: "var(--map-tooltip-border)",
          color: "var(--text-primary)",
          boxShadow: "0 8px 24px rgba(139, 92, 246, 0.2)",
        }}
      >
        <p className="font-medium text-violet-400">{LOCATION.area}</p>
        <p style={{ color: "var(--text-secondary)" }}>{LOCATION.city}</p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-2 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/90 to-transparent px-3 pt-10 pb-3">
        <button
          type="button"
          className="max-w-[58%] text-left text-[10px] transition-colors duration-300 hover:text-violet-400"
          style={{ color: "var(--text-secondary)" }}
        >
          <span className="mr-1">🇧🇩</span>
          {data?.siteSettings?.mapFooterLine ??
            `Based in ${LOCATION.area}, ${LOCATION.city}`}
        </button>

        <p
          className="max-w-[40%] text-right text-[9px] leading-tight transition-colors duration-300 group-hover:text-violet-300/80"
          style={{ color: "var(--text-tertiary)" }}
        >
          {inviteLine}
        </p>
      </div>
    </div>
  );
}
