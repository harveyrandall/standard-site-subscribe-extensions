#!/usr/bin/env python3
"""Generate toolbar icons for both extensions.

Draws a rounded-square badge (cyberpunk palette) with a neon-green checkmark, supersampled then
downscaled for antialiasing, at the MV3 sizes. Writes into chrome/icons and firefox/icons.

Run from anywhere:  python3 icons/generate.py
Requires Pillow.
"""
from PIL import Image, ImageDraw
import os

SIZES = [16, 32, 48, 128]
OUT_DIRS = ["chrome/icons", "firefox/icons"]
SS = 4  # supersample factor

SURFACE = (19, 28, 49, 255)   # #131C31 — elevated dark
BORDER = (43, 58, 85, 255)    # #2B3A55 — subtle chrome
GREEN = (34, 197, 94, 255)    # #22C55E — neon green (the "verified" accent)


def draw_icon(size):
    s = size * SS
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    pad = round(s * 0.06)
    radius = round(s * 0.22)
    d.rounded_rectangle(
        [pad, pad, s - pad - 1, s - pad - 1],
        radius=radius,
        fill=SURFACE,
        outline=BORDER,
        width=max(SS, round(s * 0.03)),
    )

    # checkmark: short arm then long arm, rounded caps + joint
    w = max(SS, round(s * 0.13))
    pts = [(0.30, 0.52), (0.44, 0.67), (0.72, 0.34)]
    px = [(x * s, y * s) for x, y in pts]
    d.line(px, fill=GREEN, width=w, joint="curve")
    r = w / 2
    for (x, y) in (px[0], px[2]):
        d.ellipse([x - r, y - r, x + r, y + r], fill=GREEN)

    return img.resize((size, size), Image.LANCZOS)


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for size in SIZES:
        icon = draw_icon(size)
        for od in OUT_DIRS:
            dpath = os.path.join(root, od)
            os.makedirs(dpath, exist_ok=True)
            icon.save(os.path.join(dpath, f"icon-{size}.png"))
    print("wrote icon-{%s}.png to %s" % (",".join(map(str, SIZES)), ", ".join(OUT_DIRS)))


if __name__ == "__main__":
    main()
