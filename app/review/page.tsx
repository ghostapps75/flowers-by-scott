import Image from "next/image";

// Your sheet configuration from the earlier steps
const SHEETS = [
    { id: "Sheet_01_Focals_A", rows: 3, cols: 3 },
    // { id: "Sheet_02_Focals_B", rows: 3, cols: 3 }, // Add your missing sheets here
    { id: "Sheet_03_Focals_C", rows: 2, cols: 4 },
    { id: "Sheet_04_Focals_D_Arch", rows: 2, cols: 5 },
    { id: "Sheet_05_Architectural_A", rows: 2, cols: 5 },
    { id: "Sheet_06_Architectural_B", rows: 3, cols: 3 },
    { id: "Sheet_07_Accents_A", rows: 3, cols: 3 },
    { id: "Sheet_08_Accents_B", rows: 2, cols: 4 },
    { id: "Sheet_09_Accents_C", rows: 3, cols: 3 },
    // Sheet 10?
    // Sheet 11?
    { id: "Sheet_12_Whimsical_C", rows: 3, cols: 3 },
];

export default function ReviewPage() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-serif text-emerald-900 mb-8">Stem QA Lightbox</h1>

            <div className="flex flex-col gap-12">
                {SHEETS.map((sheet) => (
                    <div key={sheet.id} className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4 border-b pb-2">{sheet.id}</h2>
                        <div className="flex flex-wrap gap-4">
                            {Array.from({ length: sheet.rows }).map((_, r) =>
                                Array.from({ length: sheet.cols }).map((_, c) => {
                                    const filename = `${sheet.id}_Row${r + 1}_Col${c + 1}.jpg`;
                                    return (
                                        <div key={filename} className="flex flex-col items-center gap-2">
                                            <div className="relative w-32 h-32 bg-gray-50 border rounded-lg overflow-hidden group">
                                                <Image
                                                    src={`/images/stems/${filename}?t=${Date.now()}`}
                                                    alt={filename}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform"
                                                    unoptimized // Important for local file checking
                                                />
                                            </div>
                                            <span className="text-[10px] font-mono text-gray-400 select-all cursor-pointer hover:text-red-500 transition-colors">
                                                {filename}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}