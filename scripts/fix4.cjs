const fs = require('fs');

const filesToFix = [
    'src/components/games/BrickDashGame.tsx',
    'src/components/games/PacRunnerGame.tsx',
    'src/components/games/SpaceInvadersGame.tsx',
    'src/components/games/TankBattleArenaGame.tsx'
];

filesToFix.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');

    // MATCH GameStartOverlay block exactly using generic capture
    const match = content.match(/<GameStartOverlay[\s\S]*?\/>/);
    if (!match) {
        console.log("No overlay found in", filePath);
        return;
    }
    const overlayStr = match[0];
    content = content.replace(overlayStr, '');

    // Now, we find the containerRef div
    const containerMatch = content.match(/<div\s+ref=\{containerRef\}[\s\S]*?class(?:Name)?="([^"]*)"[^>]*>/);
    if (!containerMatch) {
        console.log("No containerRef found in", filePath);
        return;
    }

    const divFullStr = containerMatch[0]; // e.g. `<div ref={containerRef} className="relative..." tabIndex={0}>`

    // We want to insert the overlay ABOVE this div!
    // BUT the Board component has one single outer return. Since this `div` is the root element of the return, replacing it directly with a wrapper and appending a closing div at the end works perfectly!
    // Note: For TankBattleArenaGame and others, `containerRef` IS the root div.

    // Replace the exact root `<div` with `<div className="flex flex-col gap-4 w-full max-w-[800px] mx-auto z-10">\n      ${overlayStr}\n      <div`

    content = content.replace(divFullStr,
        `<div className="flex flex-col gap-4 w-full max-w-[800px] mx-auto z-10">\n      ${overlayStr}\n      ${divFullStr}`
    );

    // Now append a closing `</div>` right before the end of the board component
    // The board component usually ends just before `// --- Main Page Component ---` or `export default function`

    const mainComponentPos = content.indexOf('export default function');
    if (mainComponentPos !== -1) {
        // find the return block end right above this
        let closingTags = [
            '    </div>\n  );\n}\n',
            '    </div>\n  )\n}\n',
            '  </div>\n  );\n}\n',
            '  </div>\n  );\n}\n\n'
        ];
        let inserted = false;
        for (let c of closingTags) {
            const pos = content.lastIndexOf(c, mainComponentPos);
            if (pos !== -1 && pos > mainComponentPos - 500) {
                content = content.substring(0, pos) + '    </div>\n' + c + content.substring(pos + c.length);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            // fallback matching using regex for the last closing tag
            const beforeMainHtml = content.substring(0, mainComponentPos);
            const replaced = beforeMainHtml.replace(/(<\/div>\s*\);\s*}\s*)$/, '  </div>\n$1');
            if (replaced !== beforeMainHtml) {
                content = replaced + content.substring(mainComponentPos);
                inserted = true;
            }
        }

        if (!inserted) {
            console.log("Could not find closing brace for", filePath);
        } else {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log("Fixed", filePath);
        }
    }
});
