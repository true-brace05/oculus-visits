import { escapeXml, padCount } from "./render.ts";

// Character templates live in theme folders:
//   src/themes/<character>/character.svg
// Each template uses {{COUNT}} (zero-padded) and {{LABEL}} placeholders.
// Unknown character names fall back to the default badge renderer.

// Embedded copy of src/themes/oculus/character.svg.
// Workers have no filesystem access at runtime, so the template is bundled
// here. Keep the two in sync when editing the artwork.
const OCULUS_TEMPLATE = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150" role="img" aria-label="{{LABEL}}: {{COUNT}}">` +
  `<defs><radialGradient id="oculus-iris" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="{{IRIS_HI}}"/><stop offset="55%" stop-color="{{IRIS_MID}}"/><stop offset="100%" stop-color="{{IRIS_LO}}"/></radialGradient>` +
  `<clipPath id="oculus-eyeclip"><ellipse cx="100" cy="56" rx="60" ry="32"/></clipPath></defs>` +
  `<rect width="200" height="150" rx="10" fill="#120826"/>` +
  `<rect x="1" y="1" width="198" height="148" rx="9" fill="none" stroke="#8b5cf6" stroke-width="1" opacity="0.5"/>` +
  `{{GLOW}}` +
  `<circle cx="100" cy="56" r="45" fill="none" stroke="#8b5cf6" stroke-width="3" stroke-dasharray="18 10 6 10" opacity="0.85">` +
  `<animateTransform attributeName="transform" type="rotate" from="0 100 56" to="360 100 56" dur="24s" repeatCount="indefinite"/></circle>` +
  `<circle cx="100" cy="56" r="51" fill="none" stroke="#a78bfa" stroke-width="1" stroke-dasharray="2 6" opacity="0.5">` +
  `<animateTransform attributeName="transform" type="rotate" from="360 100 56" to="0 100 56" dur="40s" repeatCount="indefinite"/></circle>` +
  `{{EXTRA_RING}}` +
  `<ellipse cx="100" cy="56" rx="60" ry="32" fill="#0b0518" stroke="#8b5cf6" stroke-width="1.5" opacity="0.9"/>` +
  `<g clip-path="url(#oculus-eyeclip)">` +
  `<g stroke="#a78bfa" stroke-width="1" opacity="0.12">` +
  `<line x1="40" y1="38" x2="160" y2="38"/><line x1="40" y1="47" x2="160" y2="47"/><line x1="40" y1="56" x2="160" y2="56"/><line x1="40" y1="65" x2="160" y2="65"/><line x1="40" y1="74" x2="160" y2="74"/></g>` +
  `<circle cx="100" cy="56" r="23" fill="url(#oculus-iris)"/>` +
  `<ellipse cx="100" cy="56" rx="8" ry="11" fill="#0b0518"><animate attributeName="cx" values="93;107;93" dur="7s" repeatCount="indefinite"/></ellipse>` +
  `<circle cx="103" cy="52" r="2.5" fill="#e9e4ff" opacity="0.9"><animate attributeName="cx" values="96;110;96" dur="7s" repeatCount="indefinite"/></circle>` +
  `<rect x="40" y="24" width="120" height="0" fill="#120826"><animate attributeName="height" values="0;0;64;0;0" keyTimes="0;0.92;0.95;0.98;1" dur="5s" repeatCount="indefinite"/></rect>` +
  `</g>` +
  `<text x="100" y="114" text-anchor="middle" font-family="monospace" font-size="9" fill="#a78bfa" opacity="0.8">{{LABEL}}</text>` +
  `<text x="100" y="136" text-anchor="middle" font-family="monospace" font-size="20" font-weight="bold" letter-spacing="3" fill="#e9e4ff">{{COUNT}}</text>` +
  `</svg>`;

const TEMPLATES: Record<string, string> = {
  oculus: OCULUS_TEMPLATE,
};

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

export type OculusTier = "dormant" | "awakened" | "ascended" | "radiant";

export function oculusTier(count: number): OculusTier {
  if (count >= 10000) return "radiant";
  if (count >= 1000) return "ascended";
  if (count >= 100) return "awakened";
  return "dormant";
}

const EXTRA_RING_SVG =
  `<circle cx="100" cy="56" r="57" fill="none" stroke="#a78bfa" stroke-width="1.5" stroke-dasharray="30 14 4 14" opacity="0.7">` +
  `<animateTransform attributeName="transform" type="rotate" from="0 100 56" to="360 100 56" dur="16s" repeatCount="indefinite"/></circle>`;

const GLOW_SVG =
  `<circle cx="100" cy="56" r="60" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.4">` +
  `<animate attributeName="opacity" values="0.15;0.6;0.15" dur="3s" repeatCount="indefinite"/>` +
  `<animate attributeName="r" values="58;62;58" dur="3s" repeatCount="indefinite"/></circle>`;

export function renderOculus(count: number, label: string): string {
  const tier = oculusTier(count);
  const iris =
    tier === "radiant"
      ? { hi: "#fde68a", mid: "#f59e0b", lo: "#92400e" }
      : tier === "ascended"
        ? { hi: "#e6dcff", mid: "#a78bfa", lo: "#7c3aed" }
        : tier === "awakened"
          ? { hi: "#ddd0ff", mid: "#a78bfa", lo: "#6d28d9" }
          : { hi: "#c4b5fd", mid: "#8b5cf6", lo: "#4c1d95" };
  return OCULUS_TEMPLATE.split("{{IRIS_HI}}")
    .join(iris.hi)
    .split("{{IRIS_MID}}")
    .join(iris.mid)
    .split("{{IRIS_LO}}")
    .join(iris.lo)
    .split("{{EXTRA_RING}}")
    .join(tier === "ascended" || tier === "radiant" ? EXTRA_RING_SVG : "")
    .split("{{GLOW}}")
    .join(tier === "radiant" ? GLOW_SVG : "")
    .split("{{COUNT}}")
    .join(padCount(count))
    .split("{{LABEL}}")
    .join(escapeXml(label));
}

export function renderCharacterByName(
  name: string | null | undefined,
  count: number,
  label: string,
): string | null {
  if (name === "oculus") return renderOculus(count, label);
  const template = getCharacterTemplate(name);
  if (!template) return null;
  return renderCharacter(template, count, label);
}
