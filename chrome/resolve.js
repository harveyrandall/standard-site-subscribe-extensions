// Pure resolution logic. Loaded as a CLASSIC script (importScripts / background.scripts),
// so it exposes a global rather than using ES `export`. The Vitest test imports this file
// for its side effect and reads the same global.
(function (root) {
  const APPVIEW = "https://api.vey.dev";
  const PUB_URI = /^at:\/\/(did:[a-z0-9:._-]+)\/site\.standard\.publication\/[^/]+$/i;

  function didFromLinkHref(href) {
    const m = PUB_URI.exec((href || "").trim());
    return m ? m[1] : null;
  }

  async function resolvePublicationDid(links, fetchImpl) {
    if (links.publication) {
      const did = didFromLinkHref(links.publication);
      if (did) return did;
    }
    if (links.document) {
      const m = /^at:\/\/(did:[a-z0-9:._-]+)\//i.exec(links.document);
      const authorDid = m ? m[1] : null;
      if (!authorDid) return null;
      try {
        const r = await fetchImpl(`${APPVIEW}/publications/${authorDid}`);
        if (r.ok) {
          const body = await r.json();
          if (body && typeof body.did === "string") return body.did;
        }
      } catch { /* fall through to null */ }
    }
    return null;
  }

  root.SubscribeResolve = { APPVIEW, didFromLinkHref, resolvePublicationDid };
})(typeof globalThis !== "undefined" ? globalThis : self);
