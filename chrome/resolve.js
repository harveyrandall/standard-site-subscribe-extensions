// Pure resolution logic for the subscribe extension. No DOM, no chrome.* — unit-tested directly.
export const APPVIEW = "https://api.vey.dev";
const PUB_URI = /^at:\/\/(did:[a-z0-9:._-]+)\/site\.standard\.publication\/[^/]+$/i;

/** DID from a site.standard.publication AT-URI, or null. */
export function didFromLinkHref(href) {
  const m = PUB_URI.exec((href || "").trim());
  return m ? m[1] : null;
}

/**
 * The publication DID for a page. Prefer an explicit publication link (no network). Else, for a
 * document link, look the author's primary publication up in the AppView (MVP assumption: the
 * author owns the publication — the common standard.site case). Returns null if unresolvable.
 */
export async function resolvePublicationDid(links, fetchImpl) {
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
