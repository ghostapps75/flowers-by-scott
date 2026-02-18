import os
import time
import random
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load API Key
load_dotenv(".env.local")
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("CRITICAL ERROR: GEMINI_API_KEY not found in .env.local")
    exit()

client = genai.Client(api_key=api_key)
MODEL_ID = "gemini-3-pro-image-preview" # Staying with Pro, it's smarter, just need better neg prompts.

OUTPUT_DIR = "public/images/stems"

# --- ROUND 6: FINAL FIX (FORGET-ME-NOT) ---
WORK_ORDER = [
    # User reported "weird border in bold" on Row 1 Col 3
    ("Forget-Me-Not", "Sheet_09_Accents_C_Row1_Col3"),
]

def get_prompt(stem_name, filename):
    # Base: Commercial Studio Style - AGGRESSIVE NO-FRAME
    prompt = (
        f"A professional commercial studio photo of a single {stem_name} flower stem. "
        "Strictly Square 1:1 Aspect Ratio. "
        "View: Straight on, fully centered. "
        "Lighting: Soft, bright commercial lighting, soft natural shadow below. "
        "Background: Pure solid white (#FFFFFF). "
        "Negative Prompt: No text, no labels, no film borders, no black edges, no film strips, no frame, no hands, no vase, no polaroid border, no black lines, no bounding box, no square outline."
    )
    return prompt

def generate_stem(stem_name, filename):
    prompt = get_prompt(stem_name, filename)
    print(f"--- 🚑 Surgical Regen: {stem_name} -> {filename}.jpg ---")
    
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=['Image'],
            )
        )
        
        for part in response.parts:
            if image := part.as_image():
                output_path = os.path.join(OUTPUT_DIR, f"{filename}.jpg")
                image.save(output_path)
                print(f"SUCCESS: Saved {output_path}")
                return True

    except Exception as e:
        print(f"FAILED {filename}: {e}")
        return False

if __name__ == "__main__":
    print(f"🚑 Starting Round 4 Surgical Regen for {len(WORK_ORDER)} items...")

    for flower_name, filename in WORK_ORDER:
        success = generate_stem(flower_name, filename)
        if success:
             # Safety Delay
            time.sleep(10)
    
    print("\n✨ Batch Complete.")