export const UNLOCK_KEY = "portfolio-unlocked";
export const SESSION_PASSCODE_KEY = "portfolio-session-passcode";
export const MASTER_PASSCODE = "1234";

export type RitualMode = "roulette" | "seance" | "quantum" | "prophecy";

export function unlockPortfolio() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(UNLOCK_KEY, "true");
  }
}

export function isPortfolioUnlocked() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(UNLOCK_KEY) === "true";
}

export function setSessionPasscode(code: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_PASSCODE_KEY, code);
  }
}

export function getSessionPasscode(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(SESSION_PASSCODE_KEY);
}

export function isValidPasscode(input: string, masterPasscode?: string): boolean {
  const master = masterPasscode || MASTER_PASSCODE;
  if (input === master) return true;
  const sessionCode = getSessionPasscode();
  return sessionCode !== null && input === sessionCode;
}

const GHOST_WORDS = ["peel", "void", "yel59", "dhaka", "ghost", "rift"];
const RUNE_PAIRS = ["VX", "QX", "NX", "ZX", "OX", "RX"];
const HEX = "0123456789abcdef";

export function nextRitualMode(count: number): RitualMode {
  const modes: RitualMode[] = ["roulette", "seance", "quantum", "prophecy"];
  return modes[count % modes.length];
}

export function generateParadoxCode(mode: RitualMode): string {
  const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const digits = () => Math.floor(1000 + Math.random() * 8999);

  switch (mode) {
    case "roulette":
      return `${pick(RUNE_PAIRS)}-${digits()}-${pick(["A", "X", "Z", "9"])}`;
    case "seance":
      return `${pick(GHOST_WORDS).toUpperCase()}-${Math.floor(10 + Math.random() * 89)}-${pick(["PEEL", "DHK"])}`;
    case "quantum": {
      let hex = "";
      for (let i = 0; i < 6; i++) hex += pick(HEX.split(""));
      return `0x${hex.toUpperCase()}`;
    }
    case "prophecy":
      return `PEEL-${pick(["IV", "VII", "IX"])}-${digits()}`;
    default:
      return `VOID-${digits()}`;
  }
}

export function getRouletteSymbols(): string[] {
  const pool = [...RUNE_PAIRS, ..."☯☀☾♆".split(""), "?", "0", "9"];
  return Array.from({ length: 4 }, () => pool[Math.floor(Math.random() * pool.length)]);
}

export function getSeanceLetters(): string[] {
  const alphabet = "AEIOUYHKLNPRTVXZ";
  return Array.from({ length: 7 }, () =>
    alphabet[Math.floor(Math.random() * alphabet.length)]
  );
}

export function getOracleWhisper(ritualCount: number, entropy: number): string {
  if (entropy >= 100) {
    return "Vault synchronized. This code is live — use it now.";
  }
  const whispers = [
    "A key materializes. It only works for this session.",
    "Copy it. Inject it. The vault listens to the ritual alone.",
    "No static passwords here — the engine mints your access.",
    "Each summon forges a new key. Old keys turn to dust.",
    "Entropy stabilizes. Your passcode is armed and ready.",
    "YEL-59 sealed the vault. Only ritual-born codes pass.",
  ];
  return whispers[Math.min(ritualCount - 1, whispers.length - 1)];
}

export function getRitualLabel(mode: RitualMode): string {
  const labels: Record<RitualMode, string> = {
    roulette: "Cosmic Roulette",
    seance: "Dhaka Séance Board",
    quantum: "Quantum Collapse",
    prophecy: "Peelkhana Prophecy",
  };
  return labels[mode];
}
