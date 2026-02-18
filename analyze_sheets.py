import os
from PIL import Image

image_dir = r"c:\Users\scott\OneDrive\Documents\AI Agent Folder\flowers-by-scott\public\images\field_guide"
files = sorted([f for f in os.listdir(image_dir) if f.endswith(".png")])

print(f"Found {len(files)} images.")

for f in files:
    try:
        path = os.path.join(image_dir, f)
        with Image.open(path) as img:
            print(f"{f}: {img.size} ({img.format})")
    except Exception as e:
        print(f"Error reading {f}: {e}")
