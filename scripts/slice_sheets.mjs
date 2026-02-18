import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '../public/images/field_guide');
const OUTPUT_DIR = path.join(__dirname, '../public/images/stems');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Configuration based on user input
const SHEET_CONFIG = {
    // Test Sheet
    'Sheet_01_Test.png': { rows: 3, cols: 3 },
};

async function sliceSheet(filename) {
    const config = SHEET_CONFIG[filename];

    if (config === null) {
        console.log(`Skipping ${filename} (Explicitly excluded)`);
        return;
    }

    // Default to 3x3 if not specified
    const rows = config ? config.rows : 3;
    const cols = config ? config.cols : 3;

    const inputPath = path.join(INPUT_DIR, filename);

    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        const width = metadata.width;
        const height = metadata.height;

        const cellWidth = Math.floor(width / cols);
        const cellHeight = Math.floor(height / rows);

        // Zoom/Crop calculation: Standard 5% crop
        const cropX = Math.floor(cellWidth * 0.05);
        const cropY = Math.floor(cellHeight * 0.05);
        const finalWidth = cellWidth - (cropX * 2);
        const finalHeight = cellHeight - (cropY * 2);

        console.log(`Processing ${filename}: ${width}x${height} -> Grid ${rows}x${cols} -> Cell ${cellWidth}x${cellHeight} -> Crop to ${finalWidth}x${finalHeight}`);

        const baseName = path.parse(filename).name;
        let count = 0;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const left = (c * cellWidth) + cropX;
                const top = (r * cellHeight) + cropY;

                // Clamp values to ensure we never exceed image dimensions
                // Sharp throws "bad extract area" if (left + width) > imageWidth, even by 1 pixel
                const safeLeft = Math.max(0, left);
                const safeTop = Math.max(0, top);

                // Ensure width/height fit
                let safeWidth = finalWidth;
                let safeHeight = finalHeight;

                if (safeLeft + safeWidth > width) {
                    safeWidth = width - safeLeft;
                    console.warn(`  [Fix] Clamped width for ${filename} at r${r}c${c}: ${finalWidth} -> ${safeWidth}`);
                }
                if (safeTop + safeHeight > height) {
                    safeHeight = height - safeTop;
                    console.warn(`  [Fix] Clamped height for ${filename} at r${r}c${c}: ${finalHeight} -> ${safeHeight}`);
                }

                if (safeWidth <= 0 || safeHeight <= 0) {
                    console.warn(`  [Skip] Invalid dimensions for ${filename} at r${r}c${c}: ${safeWidth}x${safeHeight}`);
                    continue;
                }

                const outputFilename = `${baseName}_Row${r + 1}_Col${c + 1}.jpg`;
                const outputPath = path.join(OUTPUT_DIR, outputFilename);

                // console.log(`    Extracting: L${safeLeft} T${safeTop} W${safeWidth} H${safeHeight}`);

                await image
                    .clone()
                    .extract({ left: safeLeft, top: safeTop, width: safeWidth, height: safeHeight })
                    .toFile(outputPath);

                count++;
            }
        }
        console.log(`  -> Generated ${count} stems from ${filename}`);

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`Warning: File not found ${filename}, skipping.`);
        } else {
            console.error(`Error processing ${filename}:`, error);
        }
    }
}

async function main() {
    const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.png'));

    if (files.length === 0) {
        console.error("No PNG files found in input directory!");
        return;
    }

    for (const file of files) {
        if (SHEET_CONFIG.hasOwnProperty(file)) {
            await sliceSheet(file);
        } else {
            // If a file is in the folder but not in our explicit config, skip or warn? 
            // Plan said "Iterate through the sheet filenames", implies all in folder.
            // I will default to 3x3 for unknown files to be safe, or just skip if strictly following config.
            // Sticking to config mapping for safety as requested "Use this specific grid configuration".
            console.log(`Skipping ${file} (No configuration match)`);
        }
    }
}

main();
