// MV3 background. Chrome runs this as a service worker; Firefox as an event page (manifest loads
// resolve.js first). Holds per-tab detected links, badges, and on click resolves the publication
// DID and opens con.vey.dev's ?subscribe one-click. No auth or writes happen here.
if (typeof importScripts === "function") { try { importScripts("resolve.js"); } catch { /* firefox loads via manifest */ } }
const api = typeof browser !== "undefined" ? browser : chrome;
const tabLinks = new Map(); // tabId -> { publication?, document? }

api.runtime.onMessage.addListener((msg, sender) => {
  if (msg?.type !== "standardsite:detect" || !sender.tab) return;
  const tabId = sender.tab.id;
  if (msg.present) { tabLinks.set(tabId, msg.links); api.action.setBadgeText({ tabId, text: "·" }); api.action.setBadgeBackgroundColor?.({ tabId, color: "#C2410C" }); }
  else { tabLinks.delete(tabId); api.action.setBadgeText({ tabId, text: "" }); }
});
api.tabs.onRemoved.addListener((tabId) => tabLinks.delete(tabId));

api.action.onClicked.addListener(async (tab) => {
  const links = tabLinks.get(tab.id);
  if (!links) { api.action.setBadgeText({ tabId: tab.id, text: "?" }); return; } // nothing on this page
  const did = await resolvePublicationDid(links, (u) => fetch(u));
  if (!did) { api.action.setBadgeText({ tabId: tab.id, text: "!" }); return; } // couldn't resolve
  api.tabs.create({ url: `https://con.vey.dev/p/${encodeURIComponent(did)}?subscribe` });
});
