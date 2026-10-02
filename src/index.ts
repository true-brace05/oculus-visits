import { checkId } from "./guard.ts";
import { render } from "./render.ts";
import { getTheme } from "./themes.ts";
import { renderCharacterByName } from "./characters.ts";
import { D1Storage } from "./storage/d1.ts";

export interface Env {
  DB: D1Database;
  ALLOWED_IDS?: string;
}

export const NO_CACHE_HEADERS = {
  "Content-Type": "image/svg+xml",
  "Cache-Control": "no-cache, no-store, must-revalidate",
};

function svgResponse(svg: string): Response {
  return new Response(svg, { status: 200, headers: NO_CACHE_HEADERS });
}

export async function handleCount(
  request: Request,
  env: Env,
): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") ?? "";
  const checked = checkId(id, env.ALLOWED_IDS);
  if (!checked.valid) {
    return new Response(checked.message, { status: checked.status });
  }
  try {
    const storage = new D1Storage(env.DB);
    const count = await storage.incr(checked.id);
    const theme = getTheme(url.searchParams.get("theme"));
    const label = (url.searchParams.get("label") ?? theme.label).slice(0, 30);
    const characterSvg = renderCharacterByName(
      url.searchParams.get("character"),
      count,
      label,
    );
    return svgResponse(characterSvg ?? render(count, theme, label));
  } catch {
    return new Response("internal error", { status: 500 });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/count.svg") {
      if (request.method !== "GET") {
        return new Response("method not allowed", { status: 405 });
      }
      return handleCount(request, env);
    }
    return new Response("not found", { status: 404 });
  },
};
