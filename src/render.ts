export interface RenderTheme {
  background: string;
  foreground: string;
  accent: string;
  font: string;
  label: string;
  width: number;
}

export const DEFAULT_THEME: RenderTheme = {
  background: "#0f0f1a",
  foreground: "#e6e6f0",
  accent: "#8b5cf6",
  font: "monospace",
  label: "visits",
  width: 180,
};

export function padCount(count: number): string {
  const n = Math.max(0, Math.floor(count));
  return String(n).padStart(6, "0");
}

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function render(
  count: number,
  theme: Partial<RenderTheme> = {},
  label?: string,
): string {
  const t = { ...DEFAULT_THEME, ...theme };
  const text = label ?? t.label;
  const digits = padCount(count);
  const w = t.width;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="48" viewBox="0 0 ${w} 48" role="img">` +
    `<rect width="${w}" height="48" rx="8" fill="${t.background}"/>` +
    `<rect x="1" y="1" width="${w - 2}" height="46" rx="7" fill="none" stroke="${t.accent}" stroke-width="1" opacity="0.6"/>` +
    `<text x="12" y="20" font-family="${t.font}" font-size="10" fill="${t.foreground}" opacity="0.7">${escapeXml(text)}</text>` +
    `<text x="12" y="38" font-family="${t.font}" font-size="18" font-weight="bold" fill="${t.foreground}" letter-spacing="2">${digits}</text>` +
    `</svg>`
  );
}
