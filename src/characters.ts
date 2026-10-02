import { escapeXml, padCount } from "./render.ts";

// Character templates live in theme folders:
//   src/themes/<character>/character.svg
// Each template uses {{COUNT}} (zero-padded) and {{LABEL}} placeholders.
// Unknown character names fall back to the default badge renderer.

const TEMPLATES: Record<string, string> = {};

export const DEFAULT_CHARACTER_NAME = "";

export function getCharacterTemplate(
  name: string | null | undefined,
): string | null {
  if (!name) return null;
  return TEMPLATES[name] ?? null;
}

export function characterNames(): string[] {
  return Object.keys(TEMPLATES);
}

export function renderCharacter(
  template: string,
  count: number,
  label: string,
): string {
  return template
    .split("{{COUNT}}")
    .join(padCount(count))
    .split("{{LABEL}}")
    .join(escapeXml(label));
}
