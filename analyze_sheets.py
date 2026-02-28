import os
from PIL import Image

import os
base_dir = os.path.dirname(os.path.abspath(__file__))
image_dir = os.path.join(base_dir, "public", "images", "field_guide")
files = sorted([f for f in os.listdir(image_dir) if f.endswith(".png")])

print(f"Found {len(files)} images.")

for f in files:
    try:
        path = os.path.join(image_dir, f)
        with Image.open(path) as img:
            print(f"{f}: {img.size} ({img.format})")
    except Exception as e:
        print(f"Error reading {f}: {e}")
