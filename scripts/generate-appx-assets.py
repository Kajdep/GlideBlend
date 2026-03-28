from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
SOURCE_ICON = ROOT / "public" / "favicon-512x512.png"
OUTPUT_DIR = ROOT / "build" / "appx"
BACKGROUND = "#000000"


def load_content_image() -> Image.Image:
    image = Image.open(SOURCE_ICON).convert("RGBA")
    mask = image.convert("L").point(lambda value: 255 if value > 12 else 0)
    bbox = mask.getbbox()
    return image.crop(bbox) if bbox else image


def contain(image: Image.Image, max_width: int, max_height: int) -> Image.Image:
    ratio = min(max_width / image.width, max_height / image.height)
    size = (max(1, round(image.width * ratio)), max(1, round(image.height * ratio)))
    return image.resize(size, Image.Resampling.LANCZOS)


def render_canvas(filename: str, width: int, height: int, width_ratio: float, height_ratio: float) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    content = load_content_image()
    fitted = contain(content, round(width * width_ratio), round(height * height_ratio))
    canvas = Image.new("RGBA", (width, height), BACKGROUND)
    offset = ((width - fitted.width) // 2, (height - fitted.height) // 2)
    canvas.alpha_composite(fitted, dest=offset)
    canvas.save(OUTPUT_DIR / filename)


def main() -> None:
    render_canvas("StoreLogo.png", 50, 50, 0.82, 0.82)
    render_canvas("Square44x44Logo.png", 44, 44, 0.82, 0.82)
    render_canvas("Square71x71Logo.png", 71, 71, 0.82, 0.82)
    render_canvas("Square150x150Logo.png", 150, 150, 0.82, 0.82)
    render_canvas("LargeTile.png", 310, 310, 0.82, 0.82)
    render_canvas("Wide310x150Logo.png", 310, 150, 0.34, 0.78)
    render_canvas("SplashScreen.png", 620, 300, 0.26, 0.7)


if __name__ == "__main__":
    main()
