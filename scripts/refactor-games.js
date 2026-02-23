const fs = require('fs');
const path = require('path');

const gamesDir = path.join(__dirname, '../src/components/games');
const files = fs.readdirSync(gamesDir).filter(f => f.endsWith('Game.tsx'));

files.forEach(file => {
    if (file === 'NeonSnakeGame.tsx') return; // already neon!
    if (file === 'TicTacToePrime.tsx') return;

    const filePath = path.join(gamesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if it uses GameStartOverlay
    if (!content.includes('GameStartOverlay')) return;

    // Let's use a robust replacement:
    // Usually the structure is:
    /*
    return (
      <div
        ref={containerRef}
        className="relative w-full max-w-[600px] mx-auto aspect-square bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 focus:outline-none"
        tabIndex={0}
      >
        ...
        <GameStartOverlay
          isPlaying={gameState === "PLAYING"}
          isGameOver={gameState === "GAME_OVER"}
          score={score}
          highScore={highScore}
          onStart={initGame}
          onRestart={initGame}
          gameName="..."
        />
      </div>
    );
    */

    // We want to transform it so the return wraps the container inside a parent div,
    // and places GameStartOverlay outside the relative wrapper.

    // Actually, we can just replace `<GameStartOverlay` to be BEFORE the <div
    // Wait, no. The best way is to manually extract GameStartOverlay block, and place it just above the board container, wrapping the whole return in `<div className="w-full flex flex-col gap-4 max-w-3xl mx-auto">`.

    // Extract GameStartOverlay block
    const overlayRegex = /(<GameStartOverlay[\s\S]*?\/>)/;
    const match = content.match(overlayRegex);
    if (!match) return;
    const overlayCode = match[1];

    // Remove the overlay from its original position
    content = content.replace(overlayRegex, '');

    // Now find the main return statement of the Board component.
    // The Board component usually has `function SomeBoard(` or `const SomeBoard =` and a `return (` at the end.
    // We can just find the `return (` block that contains `ref={containerRef}` or `<canvas`.
    // Wait, some games have multiple `return (`. 
    // Let's find `ref={containerRef}` which is uniquely attached to the game board wrapper.

    const containerRefPos = content.indexOf('ref={containerRef}');
    if (containerRefPos === -1) return; // safety

    // Backtrack to the nearest `<div`
    const divBeforeRef = content.lastIndexOf('<div', containerRefPos);

    // We want to wrap this `<div...` and everything after it (until the closing `</div>`) with a new parent.
    // That's tricky.
    // Instead, let's just insert the overlay right after `<div` + `ref={containerRef}`... wait, then it's STILL inside the container.

    console.log('Skipping advanced parsing, doing it directly for:', file);
});
