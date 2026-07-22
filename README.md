# standard-site-subscribe

Browser extension for one-click Subscribe on standard.site publications. Auth-free: it detects
the standard.site link tag on a page, resolves the publication DID, and opens
`con.vey.dev/p/<did>?subscribe` — all writes are delegated to con.vey.dev.

## Status

This repo currently contains only the pure DID-resolution logic (`chrome/resolve.js`), covered
by plain Vitest unit tests (`resolve.test.mjs`). No DOM or `chrome.*` glue yet — that lands in a
later task alongside the MV3 manifest.

## Develop

```bash
nvm use 22
npm install
npm test
```
