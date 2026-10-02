const ID_PATTERN = /^[a-zA-Z0-9-_]+$/;
export const MAX_ID_LENGTH = 39;

export type GuardOk = { valid: true; id: string };
export type GuardErr = { valid: false; status: 400 | 403; message: string };
export type GuardResult = GuardOk | GuardErr;

export function isValidId(id: string): boolean {
  return id.length > 0 && id.length <= MAX_ID_LENGTH && ID_PATTERN.test(id);
}

export function parseAllowlist(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function checkId(
  id: string | null | undefined,
  allowedIdsRaw: string | null | undefined,
): GuardResult {
  if (!id || !isValidId(id)) {
    return { valid: false, status: 400, message: "invalid id" };
  }
  const allowlist = parseAllowlist(allowedIdsRaw);
  if (allowlist.length > 0 && !allowlist.includes(id)) {
    return { valid: false, status: 403, message: "id not allowed" };
  }
  return { valid: true, id };
}
