---
name: deploy-high
description: Deploy the high site (hijinks.uno) to production on the droppalon droplet. Build the Astro static site and rsync it to the nginx web root. Use when deploying high or hijinks.uno.
---

# Deploy high → hijinks.uno

SSH, `deploy-static` and the shared gotchas are in **`/droppalon`** — read it first.

| | |
|---|---|
| Domain | `hijinks.uno`, `www.hijinks.uno` |
| Web root | `/var/www/high/` |
| Build | `npm run build` (`astro build`) → `dist/` (hashed assets in `_astro/`, not `assets/`) |

## 1. Build

```bash
cd /Users/manfroze/htdocs/high
npm run build
```

## 2. Deploy

The web root holds only the Astro build: nothing else lives inside it, so the
sync needs no excludes.

```bash
deploy-static dist/ /var/www/high/        # dry run
deploy-static --go dist/ /var/www/high/
```

Keep it that way. The old nested folders (`ident/`, `n26-tool/`, and
`worldmatrix/`, which forwarded to toys.hijinks.uno until 2026-11-04) are gone.
Anything new goes on its own subdomain, not in here. If something ever must,
it needs an anchored `--exclude /<name>/` here (with the leading `/`: unanchored,
rsync matches the name at any depth, and the old `voidjunker/` exclude once
skipped `dist/img/voidjunker/`). `deploy-static` refuses
to `--go` if a whole top-level directory would be deleted, which is what a
forgotten one looks like.

## 3. Verify

```bash
curl -sI https://hijinks.uno/ | head -3                                    # 200, nginx
```

## Gotchas

- The dry run touching `_astro/` is normal — Astro's hashed bundles live there.
- `/voidjunker/` is gone (removed 2026-09-26). The game is not hosted here: it
  ships on itch at `highlyintegratedgayhijink.itch.io/voidjunker`, with a Steam
  store page for wishlists, and the homepage card links to both. A backup of
  the old build is in `~/site-backups/` on droppalon.
