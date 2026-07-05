"use client";

import PasswordOracle from "@/components/cards/PasswordOracle";
import VaultHelpTip, { VaultHelpPanel } from "@/components/cards/VaultHelpTip";
import {
  getSessionPasscode,
  isValidPasscode,
  unlockPortfolio,
} from "@/lib/portfolio-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PortfolioCard() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Incorrect passcode");
  const [unlocking, setUnlocking] = useState(false);
  const [oracleOpen, setOracleOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [hasSessionCode, setHasSessionCode] = useState(false);

  useEffect(() => {
    const existing = getSessionPasscode();
    if (existing) {
      setHasSessionCode(true);
      setPasscode(existing);
    }
  }, []);

  const handleSubmit = () => {
    if (isValidPasscode(passcode)) {
      setError(false);
      setUnlocking(true);
      unlockPortfolio();
      setTimeout(() => router.push("/portfolio"), 700);
    } else {
      setError(true);
      setErrorMsg("Incorrect passcode — summon a ritual or try again.");
      setUnlocking(false);
    }
  };

  const handleCodeGenerated = (code: string) => {
    setPasscode(code);
    setHasSessionCode(true);
    setError(false);
  };

  return (
    <div className="card relative z-10 flex h-full flex-col overflow-hidden rounded-xl">
      <div className="absolute top-0 left-0 h-full w-[18%] overflow-hidden rounded-l-xl bg-red-950/70" />

      <div
        className="absolute top-1/2 left-[18%] z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border bg-[var(--bg-primary)] shadow-sm"
        style={{ borderColor: "var(--border)" }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-red-400 transition-transform duration-500 ${unlocking ? "scale-110" : ""}`}
        >
          <rect width="18" height="11" x="3" y="11" rx="2" />
          <path d={`M7 11V7a5 5 0 0 1 ${unlocking ? "10 0" : "9.9-1"}`} />
        </svg>
      </div>

      {oracleOpen && !unlocking && (
        <PasswordOracle
          onClose={() => setOracleOpen(false)}
          onCodeGenerated={handleCodeGenerated}
        />
      )}

      {helpOpen && !oracleOpen && !unlocking && (
        <VaultHelpPanel onClose={() => setHelpOpen(false)} />
      )}

      <div
        className={`flex flex-1 flex-col justify-between p-4 pl-[22%] transition-all duration-300 ${
          oracleOpen || helpOpen ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <VaultHelpTip
          isOpen={helpOpen}
          subtitle={
            hasSessionCode
              ? "Your ritual key is armed. Enter it below to unlock."
              : "Summon a ritual key — or enter your passcode directly."
          }
          onOpenChange={setHelpOpen}
        />

        <div>
          <div className="relative">
            <span
              className="absolute top-1/2 left-3 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 18v3c0 .6.4 1 1 1h2" />
                <path d="M14 18v3c0 .6.4 1 1 1h2" />
                <path d="M10 18v3c0 .6.4 1 1 1h2" />
                <path d="M6 18v3c0 .6.4 1 1 1h2" />
                <path d="M18 18v3c0 .6.4 1 1 1h2" />
                <path d="M8 14v-4" />
                <path d="M12 14v-4" />
                <path d="M16 14v-4" />
                <path d="M3 10h18" />
              </svg>
            </span>
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Enter passcode"
              aria-label="Portfolio passcode"
              disabled={unlocking}
              className="w-full rounded-lg border py-2 pr-3 pl-9 font-mono text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-red-500/30 disabled:opacity-50"
              style={{
                borderColor: error
                  ? "#ef4444"
                  : hasSessionCode
                    ? "rgba(139,92,246,0.35)"
                    : "var(--border)",
                background: "var(--bg-input)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {error && (
            <p className="mt-1.5 text-[10px] text-red-500">{errorMsg}</p>
          )}

          {unlocking && (
            <p className="mt-1.5 text-[10px] text-emerald-500">
              Unlocking dossier…
            </p>
          )}

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={unlocking}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-[11px] transition-colors hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              View portfolio
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOracleOpen(true)}
            disabled={unlocking}
            className="oracle-trigger mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-2 text-[9px] transition-all hover:border-violet-500/50 hover:bg-violet-500/5"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-tertiary)",
            }}
          >
            <span className="oracle-orb h-2 w-2 rounded-full bg-violet-500" />
            <span>
              Open{" "}
              <span className="font-semibold text-violet-400">
                Paradox Engine™
              </span>
            </span>
            <span className="text-[8px] opacity-60">⚗️ mint key</span>
          </button>
        </div>
      </div>
    </div>
  );
}
