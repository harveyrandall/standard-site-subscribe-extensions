# standard-site-subscribe

Browser extension for one-click Subscribe on standard.site publications. Auth-free: it detects
the standard.site link tag on a page, resolves the publication DID, and opens
`con.vey.dev/p/<did>?subscribe`. All writes (auth, the actual subscribe record) are delegated to
con.vey.dev - this extension never talks to a PDS or holds credentials.

## How it works

- `content.js` runs on every page, looks for `<link rel="site.standard.publication">` or
  `<link rel="site.standard.document">`, and reports what it finds to the background worker.
- `background.js` keeps a per-tab map of detected links and badges the toolbar icon (`·`) when a
  page carries one. On click it resolves the publication DID (`resolve.js` - direct from a
  publication link, or one AppView lookup for a document-only page) and opens
  `https://con.vey.dev/p/<did>?subscribe` in a new tab. If nothing was detected the badge shows
  `?`; if the DID could not be resolved it shows `!`.
- `resolve.js` is the pure, unit-tested resolution logic shared by both browsers (see
  `resolve.test.mjs`).

## Layout

Two loadable MV3 extensions sharing identical `resolve.js`/`content.js`/`background.js`; only the
manifest differs.

- `chrome/` - `background.js` runs as a service worker (`importScripts` loads `resolve.js`).
- `firefox/` - `background.js` runs as an event page (`resolve.js` is listed in
  `background.scripts`), plus the `browser_specific_settings.gecko` block.

## Load it (unpacked)

- **Chrome** - `chrome://extensions` -> enable Developer mode -> *Load unpacked* -> select `chrome/`.
- **Firefox** - `about:debugging#/runtime/this-firefox` -> *Load Temporary Add-on* -> select
  `firefox/manifest.json`.

## Manual verification checklist

Browser APIs (badging, `action.onClicked`, cross-context script loading) have no unit harness, so
this is the deliverable's test:

1. Chrome -> `chrome://extensions` -> Developer mode -> Load unpacked -> select `chrome/`.
2. Visit a real publisher page carrying `<link rel="site.standard.publication">` (or a document
   link) - confirm the toolbar badge shows `·`.
3. Click the icon -> a new tab opens `con.vey.dev/p/<did>?subscribe`. Logged in, it auto-subscribes
   and shows "Subscribed"; logged out, it lands on login and, after sign-in, returns and completes.
4. Confirm the `site.standard.graph.subscription` record exists (the publication shows "Subscribed"
   on reload) and the reader appears as a subscriber edge in `con.vey.dev/graph`.
5. Firefox -> `about:debugging` -> Load Temporary Add-on -> select `firefox/manifest.json` ->
   repeat steps 2-4.
6. Visit a page with no standard.site link -> no badge; clicking shows the `?` no-op badge.

## Privacy

The content script only reads two `<link>` tags already present in the page it's running on. The
background worker's only network call is the optional AppView lookup in `resolvePublicationDid`
(`https://api.vey.dev/publications/<did>`) for document-only pages, plus opening the con.vey.dev
tab on click. Nothing is stored locally and no credentials are handled by this extension.

## Develop

```bash
nvm use 22
npm install
npm test
```
