export interface FieldGuideSheet {
    id: string;
    title: string;
    imageSrc: string;
    stems: string[]; // 9 stems, row-major order
}

export const FIELD_GUIDE_SHEETS: FieldGuideSheet[] = [
    {
        id: "sheet-01",
        title: "Focals A",
        imageSrc: "/images/field_guide/Sheet_01_Focals_A.png",
        stems: [
            "Pink Peony", "King Protea", "Black Baccara Rose",
            "White Orchid", "Japanese Anemone", "Juliet Rose",
            "Ranunculus", "Chocolate Cosmos", "Dinnerplate Dahlia"
        ]
    },
    {
        id: "sheet-02",
        title: "Focals B",
        imageSrc: "/images/field_guide/Sheet_02_Focals_B.png",
        stems: [
            "Blue Himalayan Poppy", "Classic Red Rose", "Tulip",
            "Lily", "Exotic Orchid", "Hydrangea Head",
            "Iris", "Gladiolus", "Amaryllis"
        ]
    },
    {
        id: "sheet-03",
        title: "Focals C",
        imageSrc: "/images/field_guide/Sheet_03_Focals_C.png",
        stems: [
            "Hibiscus", "Magnolia Branch", "Rhododendron",
            "Camellia", "Clematis", "Delphinium",
            "Chrysanthemum", "Carnation", "Gerbera Daisy"
        ]
    },
    {
        id: "sheet-04",
        title: "Focals D & Architectural",
        imageSrc: "/images/field_guide/Sheet_04_Focals_D_Arch.png",
        stems: [
            "Hyacinth", "Plumeria", "Orange Poppy",
            "Hellebore", "Lotus Flower", "Whole Artichoke Stem",
            "Persimmon Branch with Fruit", "Monstera Leaf", "Pussy Willow Branch"
        ]
    },
    {
        id: "sheet-05",
        title: "Architectural A",
        imageSrc: "/images/field_guide/Sheet_05_Architectural_A.png",
        stems: [
            "Eucalyptus Branch", "Bird of Paradise", "Lotus Pod",
            "Cotton Stem", "Air Plant (Tillandsia)", "Dried Palm Frond",
            "Foxglove", "Snapdragon", "Daffodil"
        ]
    },
    {
        id: "sheet-06",
        title: "Architectural B",
        imageSrc: "/images/field_guide/Sheet_06_Architectural_B.png",
        stems: [
            "Salvia", "Stock Flower", "Wisteria",
            "Oleander", "Azalea", "Lilac",
            "Blue Thistle", "Lavender Bundle", "Baby's Breath"
        ]
    },
    {
        id: "sheet-07",
        title: "Accents A",
        imageSrc: "/images/field_guide/Sheet_07_Accents_A.png",
        stems: [
            "Queen Anne's Lace", "Waxflower", "Hypericum Berries",
            "Dusty Miller Leaf", "Seeded Eucalyptus", "Purple Statice",
            "Fern Frond", "Daisy", "Marigold"
        ]
    },
    {
        id: "sheet-08",
        title: "Accents B",
        imageSrc: "/images/field_guide/Sheet_08_Accents_B.png",
        stems: [
            "Zinnia", "Cosmos", "Verbena",
            "Yarrow", "Alstroemeria", "Freesia",
            "Phlox", "Lantana", "Echinacea (Coneflower)"
        ]
    },
    {
        id: "sheet-09",
        title: "Accents C",
        imageSrc: "/images/field_guide/Sheet_09_Accents_C.png",
        stems: [
            "Scabiosa (Pincushion Flower)", "Shasta Daisy", "Forget-Me-Not",
            "Bluebell", "Primrose", "Columbine",
            "Bachelor's Button", "Golden Wheat Stalk", "Olive Branch"
        ]
    },
    {
        id: "sheet-10",
        title: "Whimsical A",
        imageSrc: "/images/field_guide/Sheet_10_Whimsical_A.png",
        stems: [
            "Mossy Stone", "Calla Lily", "Wild Ivy Vine",
            "Sunflower", "Green Succulent", "Sweet Pea",
            "Morning Glory", "Begonia", "Geranium"
        ]
    },
    {
        id: "sheet-11",
        title: "Whimsical B",
        imageSrc: "/images/field_guide/Sheet_11_Whimsical_B.png",
        stems: [
            "Petunia", "Gardenia", "Jasmine Vine",
            "Nasturtium", "Periwinkle", "Impatiens",
            "Pansy", "Viola", "Wallflower"
        ]
    },
    {
        id: "sheet-12",
        title: "Whimsical C",
        imageSrc: "/images/field_guide/Sheet_12_Whimsical_C.png",
        stems: [
            "Buttercup", "Moonflower", "Nigella",
            "Tuberose", "Zantedeschia", "Generic Green Foliage",
            "Wild Grass", "Flowering Branch Tip", "Berry Sprig"
        ]
    }
];
