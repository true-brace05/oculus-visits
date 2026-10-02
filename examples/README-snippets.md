# Profile README snippets

Replace `YOUR-WORKER.workers.dev` with your Worker hostname and `YOUR-ID`
with one of your `ALLOWED_IDS`.

## Oculus (default)

```md
![visits](https://YOUR-WORKER.workers.dev/count.svg?id=YOUR-ID)
```

## Oculus with explicit options

```md
![visits](https://YOUR-WORKER.workers.dev/count.svg?id=YOUR-ID&theme=hud&character=oculus&label=visits)
```

## Minimal badge (no character)

```md
![visits](https://YOUR-WORKER.workers.dev/count.svg?id=YOUR-ID&theme=minimal&character=none&label=views)
```

## Centered with a link

```md
<p align="center">
  <a href="https://github.com/YOUR-USER">
    <img src="https://YOUR-WORKER.workers.dev/count.svg?id=YOUR-ID" alt="profile visits" />
  </a>
</p>
```

## Stats API (does not increment)

```sh
curl "https://YOUR-WORKER.workers.dev/api/stats?id=YOUR-ID"
# {"total":42,"last_7_days":7}
```
