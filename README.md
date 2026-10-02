# oculus-counter

A self-hostable GitHub profile visit counter on Cloudflare Workers + D1.
It returns an animated SVG badge you embed in your profile README.
Use this repo as a template and deploy it on your own free Cloudflare account — the author hosts nothing and pays nothing.

## Meet Oculus

Oculus is a HUD-style eye that watches your profile: a violet iris, a slowly
rotating segmented outer ring, faint scan lines, a pupil that drifts left and
right, and a periodic blink. Your count glows in the bar below the eye, and
Oculus evolves as you grow — brighter at 100+, an extra ring at 1,000+, and a
golden glow pulse at 10,000+.

## Honest limitations

- This counts **image loads**, not unique people. GitHub READMEs cannot run JS
  and the viewer's IP never reaches us (images are proxied through
  [camo](https://github.com/atmos/camo)), so unique visitors are impossible.
- Bots, crawlers, and link unfurls/previews fetch the image too and
  **inflate** the count.
- Camo and CDN edge cases (caching, retries, prefetching) can **undercount** or
  double-count. Every SVG response sends
  `Cache-Control: no-cache, no-store, must-revalidate` to keep camo from
  freezing the count, but treat the number as a fun signal, not analytics.

## 5-step setup

1. **Use template** — click *Use this template* (or fork) to create your own repo.
2. **Create a D1 database** — `npx wrangler d1 create oculus-counter`.
3. **Set `database_id`** — copy the id from step 2 into `wrangler.toml`.
4. **Set `ALLOWED_IDS`** — put your counter id(s) in `wrangler.toml` (`[vars]`)
   and/or `counter.config.json` (`allowedIds`).
5. **Deploy** — `npx wrangler deploy` (or push to `main` for the GitHub Action).

See `examples/README-snippets.md` for copy-paste profile embeds.

## Embed snippet

```md
![visits](https://YOUR-WORKER.workers.dev/count.svg?id=YOUR-ID)
```

With options:

```md
![visits](https://YOUR-WORKER.workers.dev/count.svg?id=YOUR-ID&theme=hud&character=oculus&label=visits)
```

- `GET /count.svg?id=<id>&theme=<name>&character=<name>&label=<text>` increments
  atomically and returns the SVG. Unknown theme/character falls back to the
  default instead of crashing.
- `GET /api/stats?id=<id>` returns `{ "total": N, "last_7_days": M }` and does
  **not** increment.
- `GET /health` returns `ok`.

Ids match `[a-zA-Z0-9-_]`, max 39 chars. Unlisted ids get `403`, invalid ids
get `400`.

## How to write a new storage adapter

Implement the `Storage` interface in `src/storage/types.ts`:

```ts
export interface Storage {
  incr(id: string): Promise<number>;
  get(id: string): Promise<number>;
}
```

Create e.g. `src/storage/memory.ts` with a class implementing `incr`/`get`
(always increment atomically — never read-then-write), then wire it into
`src/index.ts` where `D1Storage` is constructed. See `src/storage/d1.ts` for
the reference implementation
(`INSERT ... ON CONFLICT(id) DO UPDATE SET count = count + 1 RETURNING count`).

## How to write a new character

1. Add a folder `src/themes/<name>/` with a `character.svg` template using
   `{{COUNT}}` (zero-padded) and `{{LABEL}}` placeholders. Animation must be
   SVG SMIL or CSS keyframes only — no JS, no external fonts or images — and
   stay under 10KB.
2. Embed the template in `src/characters.ts` (Workers have no filesystem
   access at runtime; see the `OCULUS_TEMPLATE` comment) and register it in
   `TEMPLATES` plus `renderCharacterByName`.
3. Pick it with `?character=<name>`; unknown names fall back to the badge.

## Local development

```sh
npm install
npm run typecheck
npm test
npx wrangler dev
```

## License

MIT — see [LICENSE](LICENSE).
