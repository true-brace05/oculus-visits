import minimal from "./themes/minimal.json" with { type: "json" };
import type { RenderTheme } from "./render.ts";

const THEMES: Record<string, RenderTheme> = {
  minimal: minimal as RenderTheme,
};

export const DEFAULT_THEME_NAME = "minimal";

export function getTheme(name: string | null | undefined): RenderTheme {
  if (name && THEMES[name]) return THEMES[name];
  return THEMES[DEFAULT_THEME_NAME];
}

export function themeNames(): string[] {
  return Object.keys(THEMES);
}
