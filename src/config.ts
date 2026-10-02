import raw from "../counter.config.json" with { type: "json" };

export interface CounterConfig {
  allowedIds: string[];
  defaultTheme: string;
  defaultCharacter: string;
  defaultLabel: string;
  startOffset: number;
}

function asNumber(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

const r = raw as Partial<CounterConfig>;

export const config: CounterConfig = {
  allowedIds: Array.isArray(r.allowedIds)
    ? r.allowedIds.filter((x): x is string => typeof x === "string")
    : [],
  defaultTheme:
    typeof r.defaultTheme === "string" && r.defaultTheme
      ? r.defaultTheme
      : "hud",
  defaultCharacter:
    typeof r.defaultCharacter === "string" && r.defaultCharacter
      ? r.defaultCharacter
      : "oculus",
  defaultLabel:
    typeof r.defaultLabel === "string" && r.defaultLabel
      ? r.defaultLabel
      : "visits",
  startOffset: Math.max(0, Math.floor(asNumber(r.startOffset, 0))),
};

export function resolveAllowlist(envAllowed: string | null | undefined): string {
  if (envAllowed && envAllowed.trim().length > 0) return envAllowed;
  return config.allowedIds.join(",");
}

export function applyOffset(count: number): number {
  return Math.max(0, count + config.startOffset);
}
