"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Spark = {
  id: number;
  x: number;
  y: number;
  angle: number;
  color: string;
  size: number;
};

const SPARK_COLORS = ["#c4b5fd", "#a78bfa", "#22d3ee", "#67e8f9", "#ede9fe"];

function createSpark(x: number, y: number): Spark {
  return {
    id: Math.random(),
    x,
    y,
    angle: Math.random() * 360,
    color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
    size: 2 + Math.random() * 2.5,
  };
}

export default function CursorSpark() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);
  const lastSparkRef = useRef(0);

  const removeSpark = useCallback((id: number) => {
    setSparks((prev) => prev.filter((spark) => spark.id !== id));
  }, []);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!coarsePointer && !reducedMotion) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      setVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });

      const now = performance.now();
      if (now - lastSparkRef.current < 40) return;
      lastSparkRef.current = now;

      const batch = [
        createSpark(e.clientX, e.clientY),
        createSpark(
          e.clientX + (Math.random() - 0.5) * 8,
          e.clientY + (Math.random() - 0.5) * 8
        ),
      ];

      setSparks((prev) => [...prev.slice(-32), ...batch]);
    };

    const onLeave = () => {
      setVisible(false);
      setSparks([]);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor-spark-layer pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      <div
        className={`cursor-spark-core transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ left: position.x, top: position.y }}
      />

      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="cursor-spark"
          style={
            {
              left: spark.x,
              top: spark.y,
              width: spark.size,
              height: spark.size,
              background: spark.color,
              boxShadow: `0 0 6px ${spark.color}`,
              "--spark-angle": `${spark.angle}deg`,
            } as React.CSSProperties
          }
          onAnimationEnd={() => removeSpark(spark.id)}
        />
      ))}
    </div>
  );
}
