from PIL import Image
import os

def crop_avatar(input_path, output_path):
    try:
        img = Image.open(input_path)
        width, height = img.size
        
        # The user said the character is justified left.
        # We want a square crop. The height is the constraining factor usually for a banner.
        # Let's verify dimensions.
        print(f"Original dimensions: {width}x{height}")
        
        size = min(width, height)
        # Crop from the left
        left = 0
        top = 0
        right = size
        bottom = size
        
        # If the image is wider than tall (landscape), this crops the leftmost square.
        # If the image is taller than wide (portrait), this crops the top square.
        
        cropped_img = img.crop((left, top, right, bottom))
        
        # Resize to 256x256 for avatar usage (or keep high res and let CSS handle it, but 256 is good for file size)
        # actually, let's keep it reasonably high quality but maybe not full banner height if it's huge.
        # Banner height is likely < 1000px. Let's just save the crop.
        
        cropped_img.save(output_path)
        print(f"Avatar saved to {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    import os
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    banner_path = os.path.join(base_dir, "app", "banner.jpg")
    avatar_path = os.path.join(base_dir, "public", "avatar.png")
    
    # Ensure public dir exists (it should)
    os.makedirs(os.path.dirname(avatar_path), exist_ok=True)
    
    crop_avatar(banner_path, avatar_path)
