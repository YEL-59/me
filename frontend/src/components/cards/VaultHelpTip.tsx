"use client";

import { useState } from "react";

import { usePortfolio } from "../PortfolioProvider";
import { IconView } from "@/lib/icons";

function AiSparkleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 2l1.2 4.2L17.5 7.5l-4.3 1.3L12 13l-1.2-4.2L6.5 7.5l4.3-1.3L12 2z"
        fill="currentColor"
        className="text-violet-400"
      />
      <path
        d="M5 14l.7 2.4L8 17l-2.3.7L5 20l-.7-2.3L2 17l2.3-.6L5 14z"
        fill="currentColor"
        className="text-violet-300/80"
      />
      <path
        d="M18 12l.9 3.1L22 16l-3.1.9L18 20l-.9-3.1L14 16l3.1-.9L18 12z"
        fill="currentColor"
        className="text-violet-300/60"
      />
    </svg>
  );
}

const fallbackSteps = [
  {
    icon: "🔒",
    label: "Why is it locked?",
    text: "Some of my projects are under NDA. This vault keeps private work separate from the public bento grid.",
  },
  {
    icon: "🔑",
    label: "Use your passcode",
    text: "Type your passcode in the field below, then click View portfolio to unlock.",
  },
  {
    icon: "⚗️",
    label: "Or mint a ritual key",
    text: "Open Paradox Engine™ → Summon ritual. A unique code is generated and auto-filled for you.",
  },
  {
    icon: "📂",
    label: "What you get inside",
    text: "A classified dossier page — my bio, education trail, skills, and social links.",
  },
];

type VaultHelpTipProps = {
  subtitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function VaultHelpButton({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpenChange(!isOpen)}
      className={`vault-help-btn group flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 transition-all duration-300 ${
        isOpen
          ? "border-violet-500/50 bg-violet-500/15"
          : "hover:border-violet-500/40 hover:bg-violet-500/10"
      }`}
      style={{ borderColor: isOpen ? undefined : "var(--border)" }}
      aria-label="Open vault guide"
      aria-expanded={isOpen}
    >
      <AiSparkleIcon size={16} />
      <span className="text-[10px] font-semibold text-violet-400">Guide</span>
    </button>
  );
}

export function VaultHelpPanel({ onClose }: { onClose: () => void }) {
  const { data } = usePortfolio();
  const steps =
    data?.siteSettings?.vaultHelpSteps?.length
      ? data.siteSettings.vaultHelpSteps
      : fallbackSteps;

  return (
    <div className="vault-help-overlay absolute inset-0 z-[60] flex flex-col overflow-hidden rounded-xl">
      <div className="vault-help-aurora pointer-events-none absolute inset-0" />

      <div
        className="relative z-10 flex items-center justify-between border-b px-4 py-3.5"
        style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <AiSparkleIcon size={22} />
          </span>
          <div>
            <p className="text-sm font-semibold text-violet-400">Vault Guide</p>
            <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              How to unlock my portfolio
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border px-3 py-1.5 text-[11px] transition-colors hover:border-red-500/40 hover:text-red-400"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          Close ✕
        </button>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-3.5 scrollbar-thin">
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div
              key={step.label}
              className="vault-help-step flex gap-3.5 rounded-xl border p-3.5"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-secondary)",
              }}
            >
              <div className="flex w-8 flex-col items-center gap-1 pt-0.5">
                <span className="inline-flex text-xl leading-none text-violet-300">
                  <IconView name={step.icon} size={20} />
                </span>
                <span className="text-[10px] font-bold text-violet-400">
                  {i + 1}
                </span>
              </div>
              <div>
                <p
                  className="text-xs font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {step.label}
                </p>
                <p
                  className="mt-1.5 text-[11px] leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-3.5 rounded-xl border border-dashed px-3.5 py-3"
          style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
        >
          <p className="text-[11px] font-semibold text-amber-500/90">
            💡 Quick tip
          </p>
          <p
            className="mt-1.5 text-[11px] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Ritual keys last one browser session. Summon a new one anytime — or
            use your personal passcode directly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VaultHelpTip({
  subtitle,
  isOpen,
  onOpenChange,
}: VaultHelpTipProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3
          className="text-xs font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          My portfolio
        </h3>
        <p
          className="mt-1.5 text-[10px] leading-relaxed"
          style={{ color: "var(--text-tertiary)" }}
        >
          {subtitle}
        </p>
      </div>
      <VaultHelpButton isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
