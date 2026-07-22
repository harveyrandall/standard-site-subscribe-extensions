import { describe, it, expect, vi } from "vitest";
import "./chrome/resolve.js"; // side effect: sets globalThis.SubscribeResolve
const { didFromLinkHref, resolvePublicationDid } = globalThis.SubscribeResolve;

describe("didFromLinkHref", () => {
  it("extracts the DID from a publication AT-URI", () => {
    expect(didFromLinkHref("at://did:plc:abc/site.standard.publication/self")).toBe("did:plc:abc");
  });
  it("returns null for a non-publication or malformed href", () => {
    expect(didFromLinkHref("at://did:plc:abc/site.standard.document/1")).toBe(null); // not a publication uri
    expect(didFromLinkHref("https://example.com")).toBe(null);
    expect(didFromLinkHref("")).toBe(null);
  });
});

describe("resolvePublicationDid", () => {
  it("uses the publication link's DID directly (no fetch)", async () => {
    const fetchImpl = vi.fn();
    const did = await resolvePublicationDid({ publication: "at://did:plc:pub/site.standard.publication/self" }, fetchImpl);
    expect(did).toBe("did:plc:pub");
    expect(fetchImpl).not.toHaveBeenCalled();
  });
  it("resolves a document-only page via one AppView lookup (author owns the publication)", async () => {
    const fetchImpl = vi.fn(async () => ({ ok: true, json: async () => ({ did: "did:plc:author" }) }));
    const did = await resolvePublicationDid({ document: "at://did:plc:author/site.standard.document/1" }, fetchImpl);
    expect(did).toBe("did:plc:author");
    expect(fetchImpl).toHaveBeenCalledWith("https://api.vey.dev/publications/did:plc:author");
  });
  it("returns null when there is no usable link", async () => {
    expect(await resolvePublicationDid({}, vi.fn())).toBe(null);
  });
});
