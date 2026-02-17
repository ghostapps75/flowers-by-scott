export const BOTANICALS = {
    focals: [
        // Original focals
        "Peonies",
        "King Protea",
        "Black Baccara Roses",
        "White Orchids",
        "Japanese Anemones",
        "Juliet Roses",
        "Ranunculus",
        "Chocolate Cosmos",
        "Dinnerplate Dahlias",
        "Blue Himalayan Poppies",
        // Classic roses & large blooms
        "Roses",
        "Tulips",
        "Lilies",
        "Orchids",
        "Hydrangeas",
        "Iris",
        "Gladiolus",
        "Amaryllis",
        "Hibiscus",
        "Magnolia",
        "Rhododendron",
        "Camellia",
        "Clematis",
        "Delphiniums",
        "Chrysanthemums",
        "Carnations",
        "Gerbera Daisies",
        "Hyacinths",
        "Plumeria",
        "Poppies",
        "Hellebores",
        "Lotus",
    ],
    architectural: [
        // Original architectural
        "Artichokes",
        "Persimmon Branches",
        "Monstera Leaves",
        "Pussy Willow",
        "Eucalyptus",
        "Bird of Paradise",
        "Lotus Pods",
        "Cotton Stems",
        "Air Plants",
        "Dried Palm Fronds",
        // Tall spikes & structural blooms
        "Foxglove",
        "Snapdragons",
        "Daffodils",
        "Salvia",
        "Stock",
        "Wisteria",
        "Oleander",
        "Azaleas",
        "Lilac",
    ],
    accents: [
        // Original accents
        "Blue Thistle",
        "Lavender",
        "Baby's Breath",
        "Queen Anne's Lace",
        "Waxflower",
        "Hypericum Berries",
        "Dusty Miller",
        "Seeded Eucalyptus",
        "Statice",
        "Fern Fronds",
        // Filler & texture flowers
        "Daisies",
        "Marigolds",
        "Zinnias",
        "Cosmos",
        "Verbena",
        "Yarrow",
        "Alstroemeria",
        "Freesia",
        "Phlox",
        "Lantana",
        "Echinacea",
        "Scabiosa",
        "Shasta Daisies",
        "Forget-Me-Nots",
        "Bluebells",
        "Primrose",
        "Columbine",
        "Bachelor's Buttons",
    ],
    whimsical: [
        // Original whimsical
        "Golden Wheat",
        "Olive Branches",
        "Mossy Stones",
        "Calla Lilies",
        "Wild Ivy",
        "Sunflowers",
        "Succulents",
        // Charming & romantic additions
        "Sweet Peas",
        "Morning Glories",
        "Begonias",
        "Geraniums",
        "Petunias",
        "Gardenias",
        "Jasmine",
        "Nasturtiums",
        "Periwinkle",
        "Impatiens",
        "Pansies",
        "Violas",
        "Wallflowers",
        "Buttercups",
        "Moonflowers",
        "Nigella",
        "Tuberose",
        "Zantedeschia",
    ],
};

// Return a flattened list for simple random selection if needed, 
// though we primarily use the categorized logic now.
export const ALL_BOTANICALS = [
    ...BOTANICALS.focals,
    ...BOTANICALS.architectural,
    ...BOTANICALS.accents,
    ...BOTANICALS.whimsical
];

// Smart logic: 1 Focal + 2 Others (Architectural/Accents/Whimsical)
export function getHarmoniousTriplet(): string[] {
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    const focal = getRandom(BOTANICALS.focals);

    const otherPool = [
        ...BOTANICALS.architectural,
        ...BOTANICALS.accents,
        ...BOTANICALS.whimsical
    ];

    // Get 2 unique from the "other" pool
    const others: string[] = [];
    while (others.length < 2) {
        const candidate = getRandom(otherPool);
        if (!others.includes(candidate) && candidate !== focal) {
            others.push(candidate);
        }
    }

    return [focal, ...others];
}
