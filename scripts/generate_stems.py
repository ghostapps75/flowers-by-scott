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
MODEL_ID = "gemini-3-pro-image-preview"

OUTPUT_DIR = "public/images/stems"
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def generate_stem(stem_name, filename):
    prompt = f"A professional studio photography shot of a single {stem_name} stem. Square composition, center weighted. Style: High-end editorial film photography, Hasselblad medium format, sharp focus, bright commercial lighting. Soft natural shadow. IMPORTANT: Isolated on pure white background, no text, no labels. The stem should be centered and fully visible."

    print(f"--- Generating: {stem_name} -> {filename} ---")
    
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=['Image'],
                # aspect_ratio='1:1' # gemini-3-pro-image-preview might default to 1:1 or need explicit config. 
                # Checking docs or assuming prompt `Square composition` guides it, but explicit aspect ratio is better if supported.
                # For now, relying on prompt as per previous success, but will add aspect ratio if supported in `types`.
                # Safest to just prompt for "Square". 
            )
        )
        
        for part in response.parts:
            if image := part.as_image():
                # Check if we need to convert to JPEG (Sharp used .jpg output). 
                # GenAI usually returns PNG or JPEG. We'll save with the requested extension.
                output_path = os.path.join(OUTPUT_DIR, filename)
                image.save(output_path)
                print(f"SUCCESS: Saved {output_path}")
                return True

    except Exception as e:
        print(f"FAILED {filename}: {e}")
        return False

# Full Dataset from fieldGuideData.ts
SHEETS = [
    {
        "id": "Sheet_01_Focals_A",
        "stems": [
            "Pink Peony", "King Protea", "Black Baccara Rose",
            "White Orchid", "Japanese Anemone", "Juliet Rose",
            "Ranunculus", "Chocolate Cosmos", "Dinnerplate Dahlia"
        ]
    },
    {
        "id": "Sheet_02_Focals_B",
        "stems": [
            "Blue Himalayan Poppy", "Classic Red Rose", "Tulip",
            "Lily", "Exotic Orchid", "Hydrangea Head",
            "Iris", "Gladiolus", "Amaryllis"
        ]
    },
    {
        "id": "Sheet_03_Focals_C",
        "stems": [
            "Hibiscus", "Magnolia Branch", "Rhododendron",
            "Camellia", "Clematis", "Delphinium",
            "Chrysanthemum", "Carnation", "Gerbera Daisy"
        ]
    },
    {
        "id": "Sheet_04_Focals_D_Arch",
        "stems": [
            "Hyacinth", "Plumeria", "Orange Poppy",
            "Hellebore", "Lotus Flower", "Whole Artichoke Stem",
            "Persimmon Branch with Fruit", "Monstera Leaf", "Pussy Willow Branch"
        ]
    },
    {
        "id": "Sheet_05_Architectural_A",
        "stems": [
            "Eucalyptus Branch", "Bird of Paradise", "Lotus Pod",
            "Cotton Stem", "Air Plant (Tillandsia)", "Dried Palm Frond",
            "Foxglove", "Snapdragon", "Daffodil"
        ]
    },
    {
        "id": "Sheet_06_Architectural_B",
        "stems": [
            "Salvia", "Stock Flower", "Wisteria",
            "Oleander", "Azalea", "Lilac",
            "Blue Thistle", "Lavender Bundle", "Baby's Breath"
        ]
    },
    {
        "id": "Sheet_07_Accents_A",
        "stems": [
            "Queen Anne's Lace", "Waxflower", "Hypericum Berries",
            "Dusty Miller Leaf", "Seeded Eucalyptus", "Purple Statice",
            "Fern Frond", "Daisy", "Marigold"
        ]
    },
    {
        "id": "Sheet_08_Accents_B",
        "stems": [
            "Zinnia", "Cosmos", "Verbena",
            "Yarrow", "Alstroemeria", "Freesia",
            "Phlox", "Lantana", "Echinacea (Coneflower)"
        ]
    },
    {
        "id": "Sheet_09_Accents_C",
        "stems": [
            "Scabiosa (Pincushion Flower)", "Shasta Daisy", "Forget-Me-Not",
            "Bluebell", "Primrose", "Columbine",
            "Bachelor's Button", "Golden Wheat Stalk", "Olive Branch"
        ]
    },
    {
        "id": "Sheet_10_Whimsical_A",
        "stems": [
            "Mossy Stone", "Calla Lily", "Wild Ivy Vine",
            "Sunflower", "Green Succulent", "Sweet Pea",
            "Morning Glory", "Begonia", "Geranium"
        ]
    },
    {
        "id": "Sheet_11_Whimsical_B",
        "stems": [
            "Petunia", "Gardenia", "Jasmine Vine",
            "Nasturtium", "Periwinkle", "Impatiens",
            "Pansy", "Viola", "Wallflower"
        ]
    },
    {
        "id": "Sheet_12_Whimsical_C",
        "stems": [
            "Buttercup", "Moonflower", "Nigella",
            "Tuberose", "Zantedeschia", "Generic Green Foliage",
            "Wild Grass", "Flowering Branch Tip", "Berry Sprig"
        ]
    }
]

# Sheet Layout Configuration (to determine Rows/Cols)
# Most are 3x3 (9 items), but we need to map the flat list to the correct filename.
# Since we are essentially replacing the sliced files, we will assume a 3x3 layout logic 
# for naming consistency (Row1_Col1, Row1_Col2, etc.) even if the original sheet was different.
# This ensures the files overwrite the old ones and work with any future logic.
# The user's goal is "3x3 grid" for everything anyway.

def get_filename(sheet_id, index):
    # 0-8 -> Row 1-3, Col 1-3
    row = (index // 3) + 1
    col = (index % 3) + 1
    return f"{sheet_id}_Row{row}_Col{col}.jpg"

if __name__ == "__main__":
    print("--- STARTING FULL BATCH GENERATION ---")
    print(f"Total Sheets: {len(SHEETS)}")
    
    total_stems = sum(len(s['stems']) for s in SHEETS)
    print(f"Total Stems: {total_stems}")
    
    current_count = 0
    
    for sheet in SHEETS:
        sheet_id = sheet['id']
        stems = sheet['stems']
        
        print(f"\nProcessing Sheet: {sheet_id}")
        
        for i, stem_name in enumerate(stems):
            current_count += 1
            filename = get_filename(sheet_id, i)
            
            # Check if file exists to potentially skip? 
            # User wants to regenerate, but for "Pink Peony" we might skip if we just did it.
            # I'll just overwrite to be safe and consistent.
            
            print(f"[{current_count}/{total_stems}] {stem_name}...")
            
            success = generate_stem(stem_name, filename)
            
            if success:
                # Sleep to respect rate limits (e.g. 15-20s is usually safe for this model tier, 
                # but user said 'allow to run for an hour', so let's be generous: 30s)
                # 108 stems * 30s = ~54 mins. Perfect.
                sleep_time = random.randint(25, 35)
                print(f"Sleeping {sleep_time}s...")
                time.sleep(sleep_time)
            else:
                print("Skipping sleep due to failure.")

    print("\n--- BATCH GENERATION COMPLETE ---")
