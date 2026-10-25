"""Convert source JPEGs to WebP; keep recoverable originals outside the project.

Requires Pillow: python -m pip install Pillow
Run from any directory: python scripts/optimize-images.py
"""

from pathlib import Path
import shutil
import tempfile

from PIL import Image, ImageOps


def main():
    public = Path(__file__).resolve().parents[1] / "public"
    sources = sorted(path for path in public.rglob("*") if path.suffix.lower() in {".jpg", ".jpeg"})
    if not sources:
        print("No JPEG images to optimize.")
        return

    backup = Path(tempfile.mkdtemp(prefix="skyshards-original-images-"))
    before = after = 0
    print(f"Original image backup: {backup}", flush=True)

    for source in sources:
        target = source.with_suffix(".webp")
        if target.exists():
            raise FileExistsError(f"Refusing to overwrite {target}")
        is_map = source.parent.name == "map"
        with Image.open(source) as image:
            image = ImageOps.exif_transpose(image).convert("RGB")
            if not is_map:
                image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            image.save(target, "WEBP", quality=90 if is_map else 85, method=6)
            expected_size = image.size
        with Image.open(target) as check:
            check.load()
            if check.size != expected_size:
                raise ValueError(f"Invalid output dimensions: {target}")
        destination = backup / source.relative_to(public)
        destination.parent.mkdir(parents=True, exist_ok=True)
        before += source.stat().st_size
        after += target.stat().st_size
        shutil.move(str(source), str(destination))

    print(f"Converted {len(sources)} images: {before:,} -> {after:,} bytes ({1 - after / before:.1%} smaller)")


if __name__ == "__main__":
    main()
