export const LUXURY_FLOWERS = [
    "Ranunculus",
    "Peonies",
    "King Protea",
    "Black Baccara Roses",
    "Lavender",
    "Eucalyptus",
    "White Orchids",
    "Anemones",
    "Calla Lilies",
    "Dahlias",
    "Garden Roses",
    "Lisianthus",
    "Hydrangeas",
    "Sweet Peas",
];

// Simple logic to get 3 unique random flowers that "harmonize" (for now, just unique selection)
// In a real app, this could have complex color theory matching.
export function getHarmoniousTriplet(): string[] {
    const shuffled = [...LUXURY_FLOWERS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
}
