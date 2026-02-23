const fs = require('fs');
const path = require('path');

const gamesDir = path.join(__dirname, '../src/components/games');
const files = fs.readdirSync(gamesDir).filter(f => f.endsWith('Game.tsx'));

files.forEach(file => {
    if (file === 'NeonSnakeGame.tsx' || file === 'TicTacToePrime.tsx') return;

    const filePath = path.join(gamesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('GameStartOverlay')) return;

    // 1. Extract the <GameStartOverlay ... /> call
    const overlayRegex = /<GameStartOverlay[\s\S]*?\/>/;
    const match = content.match(overlayRegex);
    if (!match) return;
    const overlayStr = match[0];

    // 2. Remove it from its original place
    content = content.replace(overlayStr, '');

    // 3. We want to place `overlayStr` before the main game board rendering area.
    // In most games, the main wrapper has `ref={containerRef}` or `className={`relative bg-black`}`.
    // Let's look for the main `return (` of the board component.
    // The board component is usually named `XxxBoard`, and the main page component is `XxxGame`.
    // The board component ends before `// --- Main Page Component ---` or `export default function`.

    const boardFnEnd = content.indexOf('export default function');
    if (boardFnEnd === -1) {
        console.error('Could not find export default for:', file);
        return;
    }

    // Find the last `return (` before `export default function`
    const returnIndices = [...content.matchAll(/return \(/g)].map(m => m.index);
    const boardReturnIdx = returnIndices.filter(idx => idx < boardFnEnd).pop();

    if (!boardReturnIdx) {
        console.error('Could not find Board return for:', file);
        return;
    }

    // Let's find the first `<div` after `return (`.
    const firstDivIdx = content.indexOf('<div', boardReturnIdx);
    if (firstDivIdx === -1) {
        console.error('Could not find <div after return for:', file);
        return;
    }

    // Instead of complex AST parsing, let's wrap the entire returned structure.
    // The return block ends at the closing `</div>\n  );\n}` of the Board component.
    // We can blindly wrap it:
    // We'll replace the `return (\n    <div` with `return (\n  <div className="flex flex-col gap-4 w-full">\n    {/* INLINE SETUP */}\n    ${overlayStr}\n    <div`
    // And append closing `</div>` to the end of the return statement before the function ends.

    // Find the end of the Board component return.
    let endOfReturnIdx = content.lastIndexOf('  );\n}', boardFnEnd);
    if (endOfReturnIdx === -1) {
        endOfReturnIdx = content.lastIndexOf('  )\n}', boardFnEnd);
    }
    if (endOfReturnIdx === -1) {
        endOfReturnIdx = content.lastIndexOf(');\n}', boardFnEnd);
    }

    if (endOfReturnIdx === -1) {
        console.error('Could not find end of return for:', file);
        return;
    }

    // Split content
    let newContent = content.substring(0, firstDivIdx)
        + '<div className="flex flex-col gap-4 w-full max-w-[800px] mx-auto z-10">\n      '
        + overlayStr.split('\n').join('\n      ')
        + '\n      '
        + content.substring(firstDivIdx, endOfReturnIdx)
        + '    </div>\n'
        + content.substring(endOfReturnIdx);

    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Refactored ${file}`);
});
