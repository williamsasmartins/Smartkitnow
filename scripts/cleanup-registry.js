import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const registryPath = path.join(__dirname, '../src/data/calculatorRegistry.ts');
const content = fs.readFileSync(registryPath, 'utf8');

// We need to parse the array content. Since it's a TS file with imports, we can't just eval it easily without transpilation.
// So we will do a line-based processing with a simple state machine to identify objects in the array.

// Assumption: Objects start with '{' and end with '},' (or '}') on their own lines or indented.
// And they are inside 'export const calculatorRegistry: CalculatorEntry[] = ['

const lines = content.split('\n');
const newLines = [];
let insideRegistry = false;
let currentObjectBuffer = [];
let bufferContainsRecipe = false;
let registryStartIndex = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Start of registry array
    if (line.includes('export const calculatorRegistry: CalculatorEntry[] = [')) {
        insideRegistry = true;
        newLines.push(line);
        registryStartIndex = i;
        continue;
    }

    if (!insideRegistry) {
        newLines.push(line);
        continue;
    }

    // Inside registry
    // Check for end of array '];'
    if (line.trim() === '];' || (line.trim().startsWith(']') && !currentObjectBuffer.length)) {
        // Flush any remaining buffer? (Shouldn't happen if objects represent entries)
        if (currentObjectBuffer.length > 0) {
            // Edge case: if last object didn't have comma
            if (!bufferContainsRecipe) {
                newLines.push(...currentObjectBuffer);
            }
        }
        insideRegistry = false; // Finished registry
        newLines.push(line);
        continue;
    }

    // Start of an object?
    if (line.trim() === '{') {
        // Start buffering an object
        if (currentObjectBuffer.length > 0) {
            // We were already buffering? Maybe nested object?
            // But valid registry entries are top-level objects in the array.
            // We assume simple structure.
            currentObjectBuffer.push(line);
        } else {
            currentObjectBuffer = [line];
            bufferContainsRecipe = false;
        }
    } else if (currentObjectBuffer.length > 0) {
        // Inside an object buffer
        currentObjectBuffer.push(line);

        // Check for "Recipes" or "Misc" recipe keywords in this line
        // NOTE: The user wants to remove ALL references to deleted files.
        // We know they are in `.../Recipes/...`.
        // Also we deleted files in `Misc` like `ChickenTortillaSoup`.
        // Let's filter by `/Recipes/` string first, as that was the build error.
        // And maybe specific Misc files if we know them.

        if (line.includes('/Recipes/') ||
            line.includes('ChickenTortillaSoupCalculator') ||
            line.includes('ChickenEnchiladasCalculator') ||
            line.includes('ChilesEnNogadaCalculator') ||
            line.includes('CannoliCalculator') ||
            line.includes('TiramisuCalculator') ||
            line.includes('EnchiladasSuizasCalculator') ||
            line.includes('GelatoCalculator') ||
            line.includes('HorchataCalculator')) {
            bufferContainsRecipe = true;
        }

        // Check for end of object '},' or '}'
        if (line.trim() === '},' || line.trim() === '}') {
            // End of object. Decide to keep or drop.
            if (!bufferContainsRecipe) {
                newLines.push(...currentObjectBuffer);
            } else {
                console.log('Removing recipe entry found in buffer.');
            }
            currentObjectBuffer = [];
            bufferContainsRecipe = false;
        }
    } else {
        // Line not inside an object (e.g. comments, or lines between objects if any)
        // Just keep it.
        newLines.push(line);
    }
}

fs.writeFileSync(registryPath, newLines.join('\n'), 'utf8');
console.log('Cleaned registry.');
