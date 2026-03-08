const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function checkCaseMismatch() {
    const files = [];
    walkDir('./src', (filePath) => {
        if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
            files.push(filePath);
        }
    });

    const fileMap = new Map();
    walkDir('./src', (filePath) => {
        fileMap.set(filePath.toLowerCase().replace(/\\/g, '/'), filePath.replace(/\\/g, '/'));
    });

    let hasError = false;

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        // Match import "path" or import from "path" or import("path")
        const importRegex = /(?:import|from)\s+['"]([^'"]+)['"]/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            let importPath = match[1];
            if (importPath.startsWith('@/')) {
                importPath = importPath.replace('@/', 'src/') + (importPath.endsWith('.css') ? '' : '');

                // try with .ts and .tsx and .js and .jsx 
                const exts = ['', '.ts', '.tsx', '.js', '.jsx'];
                let foundAny = false;
                for (const ext of exts) {
                    const testPath = (importPath + ext).toLowerCase();
                    if (fileMap.has(testPath)) {
                        foundAny = true;
                        const actualPath = fileMap.get(testPath);
                        if (!actualPath.includes(importPath + ext)) { // basic case check
                            // we need a strict case check
                            const expectedLower = testPath;
                            const actualLower = actualPath.toLowerCase();
                            // check if string equals
                            const expectedExact = importPath + ext;
                            if (!actualPath.endsWith(expectedExact)) {
                                console.log(`Case mismatch in ${file}:\n Imported: ${expectedExact}\n Actual:   ${actualPath}`);
                                hasError = true;
                            }
                        }
                        break;
                    }
                }
            } else if (importPath.startsWith('./') || importPath.startsWith('../')) {
                let absoluteImport = path.resolve(path.dirname(file), importPath).replace(/\\/g, '/');
                // get relative to root
                absoluteImport = path.relative(process.cwd(), absoluteImport).replace(/\\/g, '/');

                const exts = ['', '.ts', '.tsx', '.js', '.jsx'];
                for (const ext of exts) {
                    const testPath = (absoluteImport + ext).toLowerCase();
                    if (fileMap.has(testPath)) {
                        const actualPath = fileMap.get(testPath);
                        const expectedExact = absoluteImport + ext;
                        if (!actualPath.endsWith(expectedExact) && actualPath !== expectedExact) {
                            console.log(`Case mismatch in ${file}:\n Imported: ${expectedExact}\n Actual:   ${actualPath}`);
                            hasError = true;
                        }
                        break;
                    }
                }
            }
        }
    });

    if (!hasError) {
        console.log('No case mismatches found.');
    }
}

checkCaseMismatch();
