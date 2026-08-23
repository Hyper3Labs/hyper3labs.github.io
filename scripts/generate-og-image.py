"""Generate the static Open Graph / Twitter card image.

The OG card intentionally reads the shared brand SVG from the business-development
brand-assets folder, rather than redrawing the mark in Python. That keeps the
social preview aligned with the canonical hyper³labs logo source.

Output: public/og/default.png (1200x630).
"""
from __future__ import annotations

import shutil
import subprocess
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
BRAND_LOGO = (
    ROOT.parent
    / "business-development"
    / "brand-assets"
    / "hyper3labs-logo-primary.svg"
)
OUTPUT = ROOT / "public" / "og" / "default.png"
WIDTH, HEIGHT = 1200, 630

BG = (10, 10, 10, 255)
WHITE = (255, 255, 255, 255)
FG_STRONG = (248, 249, 252, 255)
FG_MUTED = (184, 189, 202, 255)
FG_DIM = (118, 124, 140, 255)
ACCENT = (126, 157, 220, 255)


# --- Fonts -----------------------------------------------------------------

FONT_SANS = [
    "/System/Library/Fonts/HelveticaNeue.ttc",
    "/System/Library/Fonts/Helvetica.ttc",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]
FONT_SANS_BOLD = [
    "/System/Library/Fonts/HelveticaNeue.ttc",
    "/System/Library/Fonts/Helvetica.ttc",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]
FONT_MONO = [
    "/System/Library/Fonts/Menlo.ttc",
    "/System/Library/Fonts/Monaco.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
]


def _load(candidates, size: int, index: int = 0) -> ImageFont.ImageFont:
    for p in candidates:
        path = Path(p)
        if not path.exists():
            continue
        try:
            return ImageFont.truetype(str(path), size=size, index=index)
        except OSError:
            try:
                return ImageFont.truetype(str(path), size=size)
            except OSError:
                continue
    return ImageFont.load_default()


def font_sans(size: int) -> ImageFont.ImageFont:
    return _load(FONT_SANS, size)


def font_sans_bold(size: int) -> ImageFont.ImageFont:
    return _load(FONT_SANS_BOLD, size, index=1)


def font_mono(size: int) -> ImageFont.ImageFont:
    return _load(FONT_MONO, size)


def render_brand_logo(target_px: int) -> Image.Image:
    if not BRAND_LOGO.exists():
        raise FileNotFoundError(f"Brand logo not found: {BRAND_LOGO}")

    renderer = shutil.which("rsvg-convert")
    if renderer is None:
        raise RuntimeError("rsvg-convert is required to render the canonical brand SVG")

    result = subprocess.run(
        [renderer, "-w", str(target_px), "-h", str(target_px), str(BRAND_LOGO)],
        check=True,
        stdout=subprocess.PIPE,
    )
    return Image.open(BytesIO(result.stdout)).convert("RGBA")


# --- Compose ----------------------------------------------------------------


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGBA", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    pad = 78
    logo_size = 386
    logo_x = pad
    logo_y = (HEIGHT - logo_size) // 2 + 8
    logo = render_brand_logo(logo_size)
    img.paste(logo, (logo_x, logo_y), logo)

    text_x = 560
    brand_font = font_sans_bold(30)
    title_font = font_sans_bold(70)
    footer_font = font_mono(20)

    brand_y = 130
    draw.text((text_x, brand_y), "hyper³labs", font=brand_font, fill=FG_STRONG)
    draw.line((text_x, brand_y + 50, text_x + 108, brand_y + 50), fill=ACCENT, width=3)

    title_y = brand_y + 92
    line1 = "Hyperbolic"
    line2 = "embedding"
    line3 = "models."
    line_gap = 4
    h1 = draw.textbbox((0, 0), line1, font=title_font)[3]
    h2 = draw.textbbox((0, 0), line2, font=title_font)[3]
    draw.text((text_x, title_y), line1, font=title_font, fill=FG_STRONG)
    draw.text((text_x, title_y + h1 + line_gap), line2, font=title_font, fill=FG_STRONG)
    draw.text((text_x, title_y + h1 + h2 + line_gap * 2), line3, font=title_font, fill=FG_STRONG)

    draw.text((text_x, HEIGHT - pad - 5), "hyper3labs.github.io", font=footer_font, fill=FG_DIM)

    img.convert("RGB").save(OUTPUT, "PNG", optimize=True)
    print(f"Wrote {OUTPUT.relative_to(ROOT)} ({WIDTH}x{HEIGHT})")


if __name__ == "__main__":
    main()
