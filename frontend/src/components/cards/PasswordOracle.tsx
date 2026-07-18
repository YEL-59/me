"use client";

import {
  type RitualMode,
  generateParadoxCode,
  getOracleWhisper,
  getRitualLabel,
  getRouletteSymbols,
  getSeanceLetters,
  nextRitualMode,
  setSessionPasscode,
} from "@/lib/portfolio-auth";
import { useCallback, useEffect, useRef, useState } from "react";

type PasswordOracleProps = {
  onClose: () => void;
  onCodeGenerated: (code: string) => void;
};

export default function PasswordOracle({
  onClose,
  onCodeGenerated,
}: PasswordOracleProps) {
  const [mode, setMode] = useState<RitualMode>("roulette");
  const [ritualCount, setRitualCount] = useState(0);
  const [entropy, setEntropy] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [whisper, setWhisper] = useState("");
  const [glitch, setGlitch] = useState(false);
  const [copied, setCopied] = useState(false);
  const [injected, setInjected] = useState(false);
  const [roulette, setRoulette] = useState<string[]>(["?", "?", "?", "?"]);
  const [seance, setSeance] = useState<string[]>([]);
  const [planchette, setPlanchette] = useState(0);
  const [quantumBits, setQuantumBits] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const schedule = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  const activateCode = useCallback(
    (code: string) => {
      setSessionPasscode(code);
      onCodeGenerated(code);
      setInjected(true);
      schedule(() => setInjected(false), 2000);
    },
    [onCodeGenerated]
  );

  const runRitual = useCallback(() => {
    if (generating) return;

    clearTimers();
    setGenerating(true);
    setOutput(null);
    setCopied(false);
    setGlitch(false);

    const nextMode = nextRitualMode(ritualCount);
    setMode(nextMode);

    const newEntropy = Math.min(100, entropy + 18 + Math.floor(Math.random() * 12));
    const newCount = ritualCount + 1;

    if (nextMode === "roulette") {
      Array.from({ length: 12 }, (_, i) =>
        schedule(() => {
          setRoulette(getRouletteSymbols());
          if (i === 11) finish();
        }, i * 90)
      );
    } else if (nextMode === "seance") {
      const letters = getSeanceLetters();
      setSeance(letters);
      setPlanchette(0);
      letters.forEach((_, i) => {
        schedule(() => setPlanchette(i), i * 220);
      });
      schedule(() => finish(), letters.length * 220 + 400);
    } else if (nextMode === "quantum") {
      const bits = Array.from({ length: 24 }, () =>
        Math.random() > 0.5 ? "1" : "0"
      );
      setQuantumBits(bits);
      schedule(() => finish(), 1400);
    } else {
      schedule(() => finish(), 1800);
    }

    function finish() {
      const code = generateParadoxCode(nextMode);
      setOutput(code);
      setEntropy(newEntropy);
      setRitualCount(newCount);
      setWhisper(getOracleWhisper(newCount, newEntropy));
      setGenerating(false);
      activateCode(code);

      schedule(() => {
        setGlitch(true);
        schedule(() => setGlitch(false), 600);
      }, 200);
    }
  }, [activateCode, entropy, generating, ritualCount]);

  const copyCode = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    schedule(() => setCopied(false), 2000);
  };

  const injectCode = () => {
    if (!output) return;
    activateCode(output);
  };

  return (
    <div className="oracle-panel absolute inset-0 z-30 flex flex-col overflow-hidden rounded-xl">
      <div className="oracle-scanlines pointer-events-none absolute inset-0" />
      <div className="oracle-aurora pointer-events-none absolute inset-0" />

      <div
        className="relative z-10 flex items-center justify-between border-b px-3 py-2"
        style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
      >
        <div>
          <p className="text-[9px] font-bold tracking-[0.2em] text-red-400 uppercase">
            Paradox Engine™
          </p>
          <p className="text-[8px]" style={{ color: "var(--text-tertiary)" }}>
            {getRitualLabel(mode)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border px-2 py-0.5 text-[9px] transition-colors hover:border-red-500/40 hover:text-red-400"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
        >
          ✕ exit
        </button>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-3 py-2">
        <div className="mb-2">
          <div
            className="mb-1 flex items-center justify-between text-[8px]"
            style={{ color: "var(--text-tertiary)" }}
          >
            <span>Entropy</span>
            <span className={entropy >= 100 ? "text-red-400" : "text-violet-400"}>
              {entropy}%
            </span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full"
            style={{ background: "var(--bg-secondary)" }}
          >
            <div
              className="oracle-entropy h-full rounded-full transition-all duration-700"
              style={{ width: `${entropy}%` }}
            />
          </div>
        </div>

        <div
          className={`oracle-stage relative flex min-h-[88px] items-center justify-center overflow-hidden rounded-lg border ${
            glitch ? "oracle-glitch" : ""
          }`}
          style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
        >
          {generating && mode === "roulette" && (
            <div className="flex gap-1.5">
              {roulette.map((sym, i) => (
                <div
                  key={i}
                  className="oracle-reel flex h-10 w-8 items-center justify-center rounded border text-sm font-bold text-violet-400"
                  style={{
                    borderColor: "var(--border)",
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {sym}
                </div>
              ))}
            </div>
          )}

          {generating && mode === "seance" && (
            <div className="relative h-full w-full p-2">
              <div className="grid grid-cols-4 gap-1">
                {seance.map((letter, i) => (
                  <span
                    key={`${letter}-${i}`}
                    className={`flex h-6 items-center justify-center rounded text-[10px] font-bold transition-all duration-300 ${
                      planchette === i
                        ? "scale-110 bg-violet-500/20 text-violet-300"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <div
                className="oracle-planchette absolute h-0 w-0 transition-all duration-300"
                style={{
                  left: `${12 + (planchette % 4) * 22}%`,
                  top: `${planchette < 4 ? 38 : 62}%`,
                }}
              />
            </div>
          )}

          {generating && mode === "quantum" && (
            <div className="oracle-quantum flex flex-wrap justify-center gap-0.5 px-2">
              {quantumBits.map((bit, i) => (
                <span
                  key={i}
                  className="text-[8px] font-mono"
                  style={{
                    color: bit === "1" ? "#a78bfa" : "var(--text-muted)",
                    animationDelay: `${i * 0.03}s`,
                  }}
                >
                  {bit}
                </span>
              ))}
            </div>
          )}

          {generating && mode === "prophecy" && (
            <div className="oracle-prophecy px-3 text-center">
              <p className="text-[8px] tracking-widest text-red-400/80 uppercase">
                Unrolling scroll…
              </p>
              <p
                className="mt-2 text-[9px] leading-relaxed italic"
                style={{ color: "var(--text-secondary)" }}
              >
                &ldquo;From Peelkhana&apos;s fourth gate, a key is forged for
                this session only…&rdquo;
              </p>
            </div>
          )}

          {!generating && output && (
            <div className="px-2 text-center">
              <p className="text-[8px] tracking-wider text-emerald-500/80 uppercase">
                Vault key minted
              </p>
              <p className="oracle-output mt-1 font-mono text-[11px] font-bold text-violet-300">
                {output}
              </p>
              <p className="mt-1 text-[8px] text-emerald-500/70">
                ✓ Active passcode — works now
              </p>
            </div>
          )}

          {!generating && !output && (
            <p
              className="px-3 text-center text-[9px] italic"
              style={{ color: "var(--text-tertiary)" }}
            >
              Summon a ritual to mint your vault passcode.
            </p>
          )}
        </div>

        {whisper && (
          <p
            className={`mt-2 text-[8px] leading-relaxed italic ${
              entropy >= 100 ? "text-emerald-400/90" : "text-amber-500/80"
            }`}
          >
            ◈ Oracle whispers: {whisper}
          </p>
        )}

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={runRitual}
            disabled={generating}
            className="oracle-summon flex flex-1 items-center justify-center gap-1 rounded-lg border py-2 text-[10px] font-medium transition-all hover:border-violet-500/40 disabled:opacity-50"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          >
            <span className="oracle-orb inline-block h-2 w-2 rounded-full bg-violet-500" />
            {generating ? "Channeling…" : "Summon ritual"}
          </button>

          {output && (
            <>
              <button
                type="button"
                onClick={injectCode}
                className="rounded-lg border px-2 py-2 text-[9px] transition-colors hover:border-emerald-500/40 hover:text-emerald-400"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                {injected ? "Injected ✓" : "Inject"}
              </button>
              <button
                type="button"
                onClick={copyCode}
                className="rounded-lg border px-2 py-2 text-[9px] transition-colors hover:text-violet-400"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </>
          )}
        </div>

        <p className="mt-2 text-center text-[7px]" style={{ color: "var(--text-muted)" }}>
          Ritual #{ritualCount} · session key only · summon again to reforge
        </p>
      </div>
    </div>
  );
}
