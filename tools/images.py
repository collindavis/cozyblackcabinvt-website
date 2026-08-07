#!/usr/bin/env python3
"""
Cozy Black Cabin VT — image pipeline.

Sources photos either from the old CDN (if the host is allowlisted) or from a
local folder of originals (--src), then writes optimized, repo-hosted assets:

  assets/photos/cabin-01.webp ... cabin-90.webp   (full, q82, max 2000px wide)
  assets/photos/cabin-01.jpg  ... cabin-90.jpg    (JPEG fallback, q80)
  assets/photos/hero.webp / hero.jpg              (1920px wide hero)
  assets/og-image.jpg                             (1200x630 social share)

Usage:
  python3 tools/images.py --from-cdn          # downloads 1..90 from old host
  python3 tools/images.py --src /path/to/originals
"""
import argparse, sys, os, io, urllib.request
from pathlib import Path
from PIL import Image, ImageOps

CDN = ("https://cdn-63d217d1c1ac1839b49c35e6.closte.com/"
       "wp-content/uploads/2023/10/101-Bascom-Farm-Dr-Brownsville-VT-{n}.jpg")
ROOT = Path(__file__).resolve().parents[1]
OUT  = ROOT / "assets" / "photos"
HERO_INDEX = 28          # which source photo becomes the hero/og
FULL_MAX   = 2000        # px, longest side for gallery/full images
HERO_W     = 1920
WEBP_Q     = 82
JPEG_Q     = 80

def load_from_cdn(n):
    with urllib.request.urlopen(CDN.format(n=n), timeout=30) as r:
        return Image.open(io.BytesIO(r.read()))

def load_from_src(src, n):
    # accept common naming patterns
    for pat in (f"*-{n}.jpg", f"*-{n}.jpeg", f"{n}.jpg", f"cabin-{n:02d}.*", f"*{n:02d}*"):
        hits = sorted(src.glob(pat))
        if hits:
            return Image.open(hits[0])
    raise FileNotFoundError(f"no source image for #{n} in {src}")

def fit(img, longest):
    img = ImageOps.exif_transpose(img).convert("RGB")
    w, h = img.size
    if max(w, h) > longest:
        s = longest / max(w, h)
        img = img.resize((round(w*s), round(h*s)), Image.LANCZOS)
    return img

def main():
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--from-cdn", action="store_true")
    g.add_argument("--src", type=str)
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    src = Path(args.src) if args.src else None

    hero_src = None
    ok = 0
    for n in range(1, 91):
        try:
            raw = load_from_cdn(n) if args.from_cdn else load_from_src(src, n)
        except Exception as e:
            print(f"  skip #{n}: {e}", file=sys.stderr); continue
        full = fit(raw, FULL_MAX)
        stem = OUT / f"cabin-{n:02d}"
        full.save(f"{stem}.webp", "WEBP", quality=WEBP_Q, method=6)
        full.save(f"{stem}.jpg", "JPEG", quality=JPEG_Q, optimize=True, progressive=True)
        if n == HERO_INDEX: hero_src = fit(raw, HERO_W)
        ok += 1
        print(f"  cabin-{n:02d}  {full.size[0]}x{full.size[1]}")

    if hero_src:
        hero_src.save(ROOT/"assets"/"hero.webp", "WEBP", quality=86, method=6)
        hero_src.save(ROOT/"assets"/"hero.jpg", "JPEG", quality=84, optimize=True, progressive=True)
        og = ImageOps.fit(hero_src, (1200, 630), Image.LANCZOS)
        og.save(ROOT/"assets"/"og-image.jpg", "JPEG", quality=82, optimize=True)
        print("  hero + og-image written")
    print(f"done: {ok}/90 photos optimized into {OUT}")

if __name__ == "__main__":
    main()
