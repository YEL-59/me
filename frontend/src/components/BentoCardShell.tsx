"use client";

import { type ReactNode, useCallback, useRef } from "react";

export default function BentoCardShell({ children }: { children: ReactNode }) {
  const shellRef = useRef<HTMLDivElement>(null);

  const trackGlow = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const shell = shellRef.current;
    if (!shell) return;

    const rect = shell.getBoundingClientRect();
    shell.style.setProperty(
      "--glow-x",
      `${((e.clientX - rect.left) / rect.width) * 100}%`
    );
    shell.style.setProperty(
      "--glow-y",
      `${((e.clientY - rect.top) / rect.height) * 100}%`
    );
  }, []);

  const resetGlow = useCallback(() => {
    const shell = shellRef.current;
    if (!shell) return;

    shell.style.setProperty("--glow-x", "50%");
    shell.style.setProperty("--glow-y", "50%");
  }, []);

  return (
    <div
      ref={shellRef}
      className="bento-card-shell relative h-full"
      onMouseMove={trackGlow}
      onMouseLeave={resetGlow}
    >
      {children}
    </div>
  );
}
