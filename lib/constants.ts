
export const FLOWER_IMAGES: Record<string, string> = {
    // Focals - High Fidelity Assets
    "Peonies": "https://images.unsplash.com/photo-1563241527-30058e573bbf?auto=format&fit=crop&w=800&q=80",
    "King Protea": "https://images.unsplash.com/photo-1596726698031-6e3cb267e782?auto=format&fit=crop&w=800&q=80",
    "Black Baccara Roses": "https://images.unsplash.com/photo-1518709414768-a88981a4515d?auto=format&fit=crop&w=800&q=80", // Dark red rose substitute
    "White Orchids": "https://images.unsplash.com/photo-1566929367462-8db9fea62eaf?auto=format&fit=crop&w=800&q=80",
    "Japanese Anemones": "https://loremflickr.com/800/1000/anemone,flower",
    "Juliet Roses": "https://loremflickr.com/800/1000/rose,peach",
    "Ranunculus": "https://loremflickr.com/800/1000/ranunculus,flower",
    "Chocolate Cosmos": "https://loremflickr.com/800/1000/cosmos,flower",
    "Dinnerplate Dahlias": "https://loremflickr.com/800/1000/dahlia,flower",
    "Blue Himalayan Poppies": "https://loremflickr.com/800/1000/poppy,blue",
    "Roses": "https://loremflickr.com/800/1000/rose,flower",
    "Tulips": "https://loremflickr.com/800/1000/tulip,flower",
    "Lilies": "https://loremflickr.com/800/1000/lily,flower",
    "Orchids": "https://loremflickr.com/800/1000/orchid,flower",
    "Hydrangeas": "https://loremflickr.com/800/1000/hydrangea,flower",
    // Architectural
    "Artichokes": "https://loremflickr.com/800/1000/artichoke",
    "Persimmon Branches": "https://loremflickr.com/800/1000/persimmon",
    "Monstera Leaves": "https://loremflickr.com/800/1000/monstera",
    "Pussy Willow": "https://loremflickr.com/800/1000/pussywillow",
    "Eucalyptus": "https://loremflickr.com/800/1000/eucalyptus",
    "Bird of Paradise": "https://loremflickr.com/800/1000/strelitzia",
    "Lotus Pods": "https://loremflickr.com/800/1000/lotus",
    // Accents
    "Blue Thistle": "https://loremflickr.com/800/1000/thistle",
    "Lavender": "https://loremflickr.com/800/1000/lavender",
    "Baby's Breath": "https://loremflickr.com/800/1000/gypsophila",
    "Queen Anne's Lace": "https://loremflickr.com/800/1000/daucus",
    "Waxflower": "https://loremflickr.com/800/1000/waxflower",
    "Hypericum Berries": "https://loremflickr.com/800/1000/hypericum",
    "Dusty Miller": "https://loremflickr.com/800/1000/dustymiller",
    // Whimsical
    "Golden Wheat": "https://loremflickr.com/800/1000/wheat",
    "Olive Branches": "https://loremflickr.com/800/1000/olive,branch",
    "Mossy Stones": "https://loremflickr.com/800/1000/moss",
    "Calla Lilies": "https://loremflickr.com/800/1000/callalily",
    "Wild Ivy": "https://loremflickr.com/800/1000/ivy",
    "Sunflowers": "https://loremflickr.com/800/1000/sunflower",
    "Succulents": "https://loremflickr.com/800/1000/succulent",
};

export const BOTANICALS = {
    focals: [
        "Peonies", "King Protea", "Black Baccara Roses", "White Orchids", "Japanese Anemones",
        "Juliet Roses", "Ranunculus", "Chocolate Cosmos", "Dinnerplate Dahlias", "Blue Himalayan Poppies",
        "Roses", "Tulips", "Lilies", "Orchids", "Hydrangeas", "Iris", "Gladiolus", "Amaryllis",
        "Hibiscus", "Magnolia", "Rhododendron", "Camellia", "Clematis", "Delphiniums",
        "Chrysanthemums", "Carnations", "Gerbera Daisies", "Hyacinths", "Plumeria", "Poppies",
        "Hellebores", "Lotus",
    ],
    architectural: [
        "Artichokes", "Persimmon Branches", "Monstera Leaves", "Pussy Willow", "Eucalyptus",
        "Bird of Paradise", "Lotus Pods", "Cotton Stems", "Air Plants", "Dried Palm Fronds",
        "Foxglove", "Snapdragons", "Daffodils", "Salvia", "Stock", "Wisteria", "Oleander",
        "Azaleas", "Lilac",
    ],
    accents: [
        "Blue Thistle", "Lavender", "Baby's Breath", "Queen Anne's Lace", "Waxflower",
        "Hypericum Berries", "Dusty Miller", "Seeded Eucalyptus", "Statice", "Fern Fronds",
        "Daisies", "Marigolds", "Zinnias", "Cosmos", "Verbena", "Yarrow", "Alstroemeria",
        "Freesia", "Phlox", "Lantana", "Echinacea", "Scabiosa", "Shasta Daisies",
        "Forget-Me-Nots", "Bluebells", "Primrose", "Columbine", "Bachelor's Buttons",
    ],
    whimsical: [
        "Golden Wheat", "Olive Branches", "Mossy Stones", "Calla Lilies", "Wild Ivy",
        "Sunflowers", "Succulents", "Sweet Peas", "Morning Glories", "Begonias",
        "Geraniums", "Petunias", "Gardenias", "Jasmine", "Nasturtiums", "Periwinkle",
        "Impatiens", "Pansies", "Violas", "Wallflowers", "Buttercups", "Moonflowers",
        "Nigella", "Tuberose", "Zantedeschia",
    ],
};

export const FLOWER_OPTIONS = [
    ...BOTANICALS.focals,
    ...BOTANICALS.architectural,
    ...BOTANICALS.accents,
    ...BOTANICALS.whimsical
];

// Weighted shuffler: Prevents repeats of the exact same combination
let lastGeneratedSet: string[] = [];

/**
 * Auto-Suggests a Bouquet based on Pairing Affinity.
 * Pairing Logic: 1 Focal + 1 Architectural + 1 Accent/Whimsical
 * Ensures variety by preventing consecutive identical suggestions.
 */
export function getHarmoniousTriplet(): string[] {
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    // Pairing Affinity Logic: Structure + Focus + Texture
    const focal = getRandom(BOTANICALS.focals);
    const architectural = getRandom(BOTANICALS.architectural);
    const accent = getRandom([...BOTANICALS.accents, ...BOTANICALS.whimsical]);

    let selection = [focal, architectural, accent];

    // Variety Gate: Check against last generation
    const isSame = selection.length === lastGeneratedSet.length &&
        selection.every((val, index) => val === lastGeneratedSet[index]);

    if (isSame) {
        // If exact same match, re-roll the focal to ensure a different vibe
        // (Statistically unlikely to hit same 3 randoms twice, but good safety)
        const newFocal = getRandom(BOTANICALS.focals.filter(f => f !== focal));
        selection = [newFocal, architectural, accent];
    }

    lastGeneratedSet = selection;
    return selection;
}
