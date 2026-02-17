// botanicalData.ts

export interface BotanicalSheet {
    id: string;
    title: string;
    imageSrc: string; // Ensure this matches your public folder path
    stems: string[];  // The 9 flowers in 3x3 order (Row 1: L,M,R, Row 2: L,M,R...)
}

export const botanicalSheets: BotanicalSheet[] = [
    {
        id: 'sheet-01',
        title: 'Focals A',
        imageSrc: '/botanical_assets/Sheet_01_Focals_A.png',
        stems: ['Pink Peony', 'King Protea', 'Black Baccara Rose', 'White Orchid', 'Japanese Anemone', 'Juliet Rose', 'Ranunculus', 'Chocolate Cosmos', 'Dinnerplate Dahlia']
    },
    {
        id: 'sheet-02',
        title: 'Focals B',
        imageSrc: '/botanical_assets/Sheet_02_Focals_B.png',
        stems: ['Blue Himalayan Poppy', 'Classic Red Rose', 'Tulip', 'Lily', 'Exotic Orchid', 'Hydrangea Head', 'Iris', 'Gladiolus', 'Amaryllis']
    },
    {
        id: 'sheet-03',
        title: 'Focals C',
        imageSrc: '/botanical_assets/Sheet_03_Focals_C.png',
        stems: ['Hibiscus', 'Magnolia Branch', 'Rhododendron', 'Camellia', 'Clematis', 'Delphinium', 'Chrysanthemum', 'Carnation', 'Gerbera Daisy']
    },
    {
        id: 'sheet-04',
        title: 'Focals D + Arch',
        imageSrc: '/botanical_assets/Sheet_04_Focals_D_Arch.png',
        stems: ['Hyacinth', 'Plumeria', 'Orange Poppy', 'Hellebore', 'Lotus Flower', 'Whole Artichoke', 'Persimmon Branch', 'Monstera Leaf', 'Pussy Willow']
    },
    {
        id: 'sheet-05',
        title: 'Architectural A',
        imageSrc: '/botanical_assets/Sheet_05_Architectural_A.png',
        stems: ['Eucalyptus', 'Bird of Paradise', 'Lotus Pod', 'Cotton Stem', 'Air Plant', 'Dried Palm', 'Foxglove', 'Snapdragon', 'Daffodil']
    },
    {
        id: 'sheet-06',
        title: 'Architectural B',
        imageSrc: '/botanical_assets/Sheet_06_Architectural_B.png',
        stems: ['Salvia', 'Stock Flower', 'Wisteria', 'Oleander', 'Azalea', 'Lilac', 'Blue Thistle', 'Lavender', 'Babys Breath']
    },
    {
        id: 'sheet-07',
        title: 'Accents A',
        imageSrc: '/botanical_assets/Sheet_07_Accents_A.png',
        stems: ['Queen Annes Lace', 'Waxflower', 'Hypericum Berries', 'Dusty Miller', 'Seeded Eucalyptus', 'Purple Statice', 'Fern Frond', 'Daisy', 'Marigold']
    },
    {
        id: 'sheet-08',
        title: 'Accents B',
        imageSrc: '/botanical_assets/Sheet_08_Accents_B.png',
        stems: ['Zinnia', 'Cosmos', 'Verbena', 'Yarrow', 'Alstroemeria', 'Freesia', 'Phlox', 'Lantana', 'Echinacea']
    },
    {
        id: 'sheet-09',
        title: 'Accents C',
        imageSrc: '/botanical_assets/Sheet_09_Accents_C.png',
        stems: ['Scabiosa', 'Shasta Daisy', 'Forget-Me-Not', 'Bluebell', 'Primrose', 'Columbine', 'Bachelors Button', 'Wheat Stalk', 'Olive Branch']
    },
    {
        id: 'sheet-10',
        title: 'Whimsical A',
        imageSrc: '/botanical_assets/Sheet_10_Whimsical_A.png',
        stems: ['Mossy Stone', 'Calla Lily', 'Wild Ivy', 'Sunflower', 'Succulent', 'Sweet Pea', 'Morning Glory', 'Begonia', 'Geranium']
    },
    {
        id: 'sheet-11',
        title: 'Whimsical B',
        imageSrc: '/botanical_assets/Sheet_11_Whimsical_B.png',
        stems: ['Petunia', 'Gardenia', 'Jasmine Vine', 'Nasturtium', 'Periwinkle', 'Impatiens', 'Pansy', 'Viola', 'Wallflower']
    },
    {
        id: 'sheet-12',
        title: 'Whimsical C',
        imageSrc: '/botanical_assets/Sheet_12_Whimsical_C.png',
        stems: ['Buttercup', 'Moonflower', 'Nigella', 'Tuberose', 'Zantedeschia', 'Green Foliage', 'Wild Grass', 'Flowering Branch', 'Berry Sprig']
    }
];