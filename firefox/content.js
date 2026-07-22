// Runs in the page. Finds the standard.site link tags and reports them to the background worker.
const api = typeof browser !== "undefined" ? browser : chrome;
function detect() {
  const pub = document.querySelector('link[rel="site.standard.publication"]');
  const doc = document.querySelector('link[rel="site.standard.document"]');
  const links = {};
  if (pub && pub.getAttribute("href")) links.publication = pub.getAttribute("href");
  if (doc && doc.getAttribute("href")) links.document = doc.getAttribute("href");
  const present = !!(links.publication || links.document);
  api.runtime.sendMessage({ type: "standardsite:detect", present, links });
}
detect();
