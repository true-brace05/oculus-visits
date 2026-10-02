import { describe, expect, it } from "vitest";
import { checkId, isValidId, parseAllowlist } from "../src/guard.ts";

describe("isValidId", () => {
  it("accepts letters, digits, dash and underscore up to 39 chars", () => {
    expect(isValidId("alice")).toBe(true);
    expect(isValidId("a-Z_0-9")).toBe(true);
    expect(isValidId("a".repeat(39))).toBe(true);
  });

  it("rejects empty, too-long and illegal ids", () => {
    expect(isValidId("")).toBe(false);
    expect(isValidId("a".repeat(40))).toBe(false);
    expect(isValidId("bad id!")).toBe(false);
    expect(isValidId("../../etc")).toBe(false);
  });
});

describe("parseAllowlist", () => {
  it("splits on commas and drops blanks", () => {
    expect(parseAllowlist("alice, bob ,,")).toEqual(["alice", "bob"]);
    expect(parseAllowlist("")).toEqual([]);
    expect(parseAllowlist(null)).toEqual([]);
  });
});

describe("checkId", () => {
  it("returns 400 for invalid ids", () => {
    expect(checkId("bad!", "")).toMatchObject({ valid: false, status: 400 });
    expect(checkId("", "")).toMatchObject({ valid: false, status: 400 });
    expect(checkId(null, "")).toMatchObject({ valid: false, status: 400 });
  });

  it("allows any valid id when no allowlist is configured", () => {
    expect(checkId("alice", "")).toMatchObject({ valid: true, id: "alice" });
    expect(checkId("alice", undefined)).toMatchObject({
      valid: true,
      id: "alice",
    });
  });

  it("returns 403 for ids missing from the allowlist", () => {
    expect(checkId("alice", "alice,bob")).toMatchObject({
      valid: true,
      id: "alice",
    });
    expect(checkId("eve", "alice,bob")).toMatchObject({
      valid: false,
      status: 403,
    });
  });
});
