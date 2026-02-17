import os
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types

# 1. Load the key from your .env.local
load_dotenv(".env.local")
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("CRITICAL ERROR: GEMINI_API_KEY not found in .env.local")
    exit()

client = genai.Client(api_key=api_key)
MODEL_ID = "gemini-3-pro-image-preview"

# 2. FULL 12-SHEET DATASET
prompts = [
    "A professional studio photography contact sheet featuring 9 distinct botanical stems arranged in a precise 3x3 grid. Stems: Pink Peony, King Protea, Black Baccara Rose, White Orchid, Japanese Anemone, Juliet Rose, Ranunculus, Chocolate Cosmos, Dinnerplate Dahlia. Style: Hyper-realistic, ultra-modern, bright commercial lighting, isolated on white.",
    "A professional studio photography contact sheet featuring 9 distinct botanical stems arranged in a precise 3x3 grid. Stems: Blue Himalayan Poppy, Classic Red Rose, Tulip, Lily, Exotic Orchid, Hydrangea Head, Iris, Gladiolus, Amaryllis. Style: Hyper-realistic, ultra-modern, bright commercial lighting, isolated on white.",
    "A professional studio photography contact sheet featuring 9 distinct botanical stems arranged in a precise 3x3 grid. Stems: Hibiscus, Magnolia Branch, Rhododendron, Camellia, Clematis, Delphinium, Chrysanthemum, Carnation, Gerbera Daisy. Style: Hyper-realistic, ultra-modern, bright commercial lighting, isolated on white.",
    "A professional studio photography contact sheet featuring 9 distinct botanical stems arranged in a precise 3x3 grid. Stems: Hyacinth, Plumeria, Orange Poppy, Hellebore, Lotus Flower, Whole Artichoke Stem, Persimmon Branch with Fruit, Monstera Leaf, Pussy Willow Branch. Style: Hyper-realistic, ultra-modern, bright commercial lighting, isolated on white.",
    "A professional studio photography contact sheet featuring 9 distinct botanical stems arranged in a precise 3x3 grid. Stems: Eucalyptus Branch, Bird of Paradise, Lotus Pod, Cotton Stem, Air Plant (Tillandsia), Dried Palm Frond, Foxglove, Snapdragon, Daffodil. Style: Hyper-realistic, ultra-modern, bright commercial lighting, isolated on white.",
    "A professional studio photography contact sheet featuring 9 distinct botanical stems arranged in a precise 3x3 grid. Stems: Salvia, Stock Flower, Wisteria, Oleander, Azalea, Lilac, Blue Thistle, Lavender Bundle, Baby's Breath. Style: Hyper-realistic, ultra-modern, bright commercial lighting, isolated on white.",
    "A professional studio photography contact sheet featuring 9 distinct botanical stems arranged in a precise 3x3 grid. Stems: Queen Anne's Lace, Waxflower, Hypericum Berries, Dusty Miller Leaf, Seeded Eucalyptus, Purple Statice, Fern Frond, Daisy, Marigold. Style: Hyper-realistic, ultra-modern, bright commercial lighting, isolated on white.",
    "A professional studio photography contact sheet featuring 9 distinct botanical stems arranged in a precise 3x3 grid. Stems: Zinnia, Cosmos, Verbena, Yarrow, Alstroemeria, Freesia, Phlox, Lantana, Echinacea (Coneflower). Style: Hyper-realistic, ultra-modern, bright commercial lighting, isolated on white.",
    "A professional studio photography contact sheet featuring 9 distinct botanical stems arranged in a precise 3x3 grid. Stems: Scabiosa (Pincushion Flower), Shasta Daisy, Forget-Me-Not, Bluebell, Primrose, Columbine, Bachelor's Button, Golden Wheat Stalk, Olive Branch. Style: Hyper-realistic, ultra-modern, bright commercial lighting, isolated on white.",
    "A professional studio photography contact sheet featuring 9 distinct botanical stems arranged in a precise 3x3 grid. Stems: Mossy Stone, Calla Lily, Wild Ivy Vine, Sunflower, Green Succulent, Sweet Pea, Morning Glory, Begonia, Geranium. Style: Hyper-realistic, ultra-modern, bright commercial lighting, isolated on white.",
    "A professional studio photography contact sheet featuring 9 distinct botanical stems arranged in a precise 3x3 grid. Stems: Petunia, Gardenia, Jasmine Vine, Nasturtium, Periwinkle, Impatiens, Pansy, Viola, Wallflower. Style: Hyper-realistic, ultra-modern, bright commercial lighting, isolated on white.",
    "A professional studio photography contact sheet featuring 9 distinct botanical stems arranged in a precise 3x3 grid. Stems: Buttercup, Moonflower, Nigella, Tuberose, Zantedeschia, Generic Green Foliage, Wild Grass, Flowering Branch Tip, Berry Sprig. Style: Hyper-realistic, ultra-modern, bright commercial lighting, isolated on white."
]

filenames = [
    "Sheet_01_Focals_A.png", "Sheet_02_Focals_B.png", "Sheet_03_Focals_C.png",
    "Sheet_04_Focals_D_Arch.png", "Sheet_05_Architectural_A.png", "Sheet_06_Architectural_B.png",
    "Sheet_07_Accents_A.png", "Sheet_08_Accents_B.png", "Sheet_09_Accents_C.png",
    "Sheet_10_Whimsical_A.png", "Sheet_11_Whimsical_B.png", "Sheet_12_Whimsical_C.png"
]

def generate_assets():
    folder = 'botanical_assets'
    if not os.path.exists(folder):
        os.makedirs(folder)
        print(f"DEBUG: Created folder '{folder}'")

    for i in range(len(prompts)):
        print(f"--- Attempting: {filenames[i]} ({i+1}/12) ---")
        try:
            response = client.models.generate_content(
                model=MODEL_ID,
                contents=prompts[i],
                config=types.GenerateContentConfig(
                    response_modalities=['Image']
                )
            )
            
            # Save the image from the response parts
            for part in response.parts:
                if image := part.as_image():
                    image.save(os.path.join(folder, filenames[i]))
                    print(f"SUCCESS: Saved {filenames[i]}")

        except Exception as e:
            print(f"FAILED {filenames[i]}: {e}")

        # Safety pause between requests
        if i < len(prompts) - 1:
            print("Sleeping 45s to stay under rate limits...")
            time.sleep(45)

    print("\n[COMPLETE] All sheets generated in 'botanical_assets' folder.")

if __name__ == "__main__":
    generate_assets()