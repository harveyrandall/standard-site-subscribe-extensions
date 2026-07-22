---
---

# Follow standard.site publications in one click

This is a small browser extension that adds a Subscribe button to your toolbar. When you land on a
site that publishes to standard.site, the button lights up. Press it and you are following that
publication.

There is nothing to sign into inside the extension and no keys to paste anywhere. It hands the
subscribe itself over to [con.vey.dev](https://con.vey.dev), which already knows how to sign you in
and save the record.

## How it works

Publishers put a small `<link>` tag in their page that names their standard.site publication. The
extension watches for that tag, and when it sees one it badges the toolbar icon. Pressing the button
works out which publication the page belongs to and opens
`con.vey.dev/p/<publication>?subscribe` in a new tab, where con.vey.dev signs you in if needed and
saves the subscription.

The split is on purpose. The extension only reads that link tag. For a page that links a single
document rather than a whole publication, it makes one request to the public standard.site API to
find the publication the document came from. It never touches your account and it stores nothing.

## Getting started

To subscribe you need a standard.site identity, which is the same account you use at con.vey.dev. The
first time you press the button while signed out, con.vey.dev takes you through signing in and then
finishes the subscribe. From then on it is one click.

Subscribing writes a `site.standard.graph.subscription` record to your account. It is public, and you
can remove it again whenever you like from con.vey.dev.

## Install from source

The extension is not on the Chrome Web Store or Firefox Add-ons yet, so for now you load it from a
local copy of this repository.

### Chrome

1. Clone or download this repository.
2. Open `chrome://extensions` and turn on Developer mode.
3. Click *Load unpacked* and choose the `chrome/` folder.

### Firefox

1. Clone or download this repository.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click *Load Temporary Add-on* and choose `firefox/manifest.json`. Firefox drops temporary add-ons
   when it closes, so load it again the same way next time.

To check it is running, visit a publisher page and confirm the toolbar badge shows up, then press the
button and watch the con.vey.dev tab open.

## Privacy

The extension reads the standard.site link tags on the pages you visit, and that is all it reads. Its
only network request is the lookup described above, to the public standard.site API, and only for
document pages. It keeps no history and saves nothing on your machine. Your credentials stay with
con.vey.dev and never reach the extension.

## Source

The code and tests live in this repository. The part that works out a publication from a page is
covered by unit tests; the repository README explains how to run them and how the pieces fit
together.
