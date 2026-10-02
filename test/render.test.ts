import { describe, expect, it } from "vitest";
import { escapeXml, padCount, render } from "../src/render.ts";

describe("padCount", () => {
  it("zero-pads to at least 6 digits", () => {
    expect(padCount(0)).toBe("000000");
    expect(padCount(42)).toBe("000042");
    expect(padCount(123456)).toBe("123456");
    expect(padCount(1234567)).toBe("1234567");
  });
});

describe("escapeXml", () => {
  it("escapes markup characters", () => {
    expect(escapeXml("a&b<>\"'")).toBe("a&amp;b&lt;&gt;&quot;&apos;");
  });
});

describe("render", () => {
  it("embeds the padded count and label in an SVG", () => {
    const svg = render(42);
    expect(svg).toContain("<svg");
    expect(svg).toContain("000042");
    expect(svg).toContain("visits");
  });

  it("prefers an explicit label and escapes it", () => {
    const svg = render(7, { label: "views" }, "a&b");
    expect(svg).toContain("a&amp;b");
    expect(svg).not.toContain("{{");
  });

  it("stays small enough for profile embeds", () => {
    expect(render(999999).length).toBeLessThan(10240);
  });
});
