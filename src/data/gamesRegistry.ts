type GameEntry = {
  slug: string;
  title: string;
  description?: string;
  loader: () => Promise<any>;
};

const TITLES: Record<string, string> = {
  "neon-snake": "Neon Snake",
  "astro-breakout": "Astro Breakout",
  "brick-dash": "Brick Dash",
  "bubble-shooter-nova": "Bubble Shooter Nova",
  "space-invaders-remix": "Space Invaders Remix",
  "asteroid-drift": "Asteroid Drift",
  "neon-paddle": "Neon Paddle",
  "pinball-neon": "Pinball Neon",
  "crossy-street": "Crossy Street",
  "missile-command-grid": "Missile Command Grid",
  "orb-runner": "Orb Runner",
  "flappy-rocket": "Flappy Rocket",
  "doodle-jumpers": "Doodle Jumpers",
  "jetpack-dash": "Jetpack Dash",
  "skyline-runner": "Skyline Runner",
  "cave-hop": "Cave Hop",
  "rope-swing-rush": "Rope Swing Rush",
  "2048-galaxy": "2048 Galaxy",
  "sliding-puzzle-deluxe": "Sliding Puzzle Deluxe",
  "jigsaw-lounge": "Jigsaw Lounge",
  "nonogram-glow": "Nonogram Glow",
  "sokoban-warehouse": "Sokoban Warehouse",
  "lights-out-lumina": "Lights Out Lumina",
  "mastermind-codebreaker": "Mastermind Codebreaker",
  "kakuro-grid": "Kakuro Grid",
  "kenken-fusion": "KenKen Fusion",
  "pattern-lock-puzzle": "Pattern Lock Puzzle",
  "water-sort-neon": "Water Sort Neon",
  "magic-cube-3d": "Magic Cube 3D",
  "cube-solver-trainer": "Cube Solver Trainer",
  "speed-cube-timer": "Speed Cube Timer",
  "word-sprint": "Word Sprint",
  "typing-duel": "Typing Duel",
  "trivia-blitz": "Trivia Blitz",
  "word-search-premium": "Word Search Premium",
  "hangman-noir": "Hangman Noir",
  "crossword-daily": "Crossword Daily",
  "word-connect-quest": "Word Connect Quest",
  "anagram-attack": "Anagram Attack",
  "letter-drop": "Letter Drop",
  "category-quiz": "Category Quiz",
  "quick-math-arena": "Quick Math Arena",
  "number-memory-vault": "Number Memory Vault",
  "mental-math-sprint": "Mental Math Sprint",
  "calculator-rush": "Calculator Rush",
  "fraction-trainer": "Fraction Trainer",
  "times-tables-blitz": "Times Tables Blitz",
  "join-dots-connect-four": "Join Dots (Connect Four)",
  "tic-tac-toe-prime": "Tic-Tac-Toe Prime",
  "checkers-royale": "Checkers Royale",
  "reversi-eclipse": "Reversi Eclipse",
  "chess-puzzles-daily": "Chess Puzzles Daily",
  "dots-and-boxes-classic": "Dots & Boxes Classic",
  "battleship-grid": "Battleship Grid",
  "ludo-party": "Ludo Party",
  "backgammon-classic": "Backgammon Classic",
  "four-in-a-row-blitz": "Four-in-a-Row Blitz",
  "solitaire-classic-klondike": "Solitaire Classic (Klondike)",
  "spider-solitaire-shadow": "Spider Solitaire Shadow",
  "freecell-classic": "FreeCell Classic",
  "pyramid-solitaire-temple": "Pyramid Solitaire Temple",
  "tripeaks-trek": "TriPeaks Trek",
  "hearts-club": "Hearts Club",
  "spades-arena": "Spades Arena",
  "dice-yacht": "Dice Yacht",
  "match-3-aurora": "Match-3 Aurora",
  "jewel-cascade": "Jewel Cascade",
  "merge-garden": "Merge Garden",
  "color-blocks-merge": "Color Blocks Merge",
  "rhythm-tiles": "Rhythm Tiles",
  "tap-reflex": "Tap Reflex",
  "reaction-time-lab": "Reaction Time Lab",
  "precision-click-arena": "Precision Click Arena",
  "maze-escape": "Maze Escape",
  "path-finder": "Path Finder",
  "labyrinth-sprint": "Labyrinth Sprint",
  "a-star-path-challenge": "A* Path Challenge",
  "mini-golf-orbit": "Mini Golf Orbit",
  "air-hockey-neon": "Air Hockey Neon",
  "hoop-shot-arcade": "Hoop Shot Arcade",
  "penalty-kick-pro": "Penalty Kick Pro",
  "sudoku-night": "Sudoku Night",
  "minesweeper-dark": "Minesweeper Dark",
};

function titleFromSlug(slug: string) {
  return TITLES[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export function getGameEntry(slug: string): GameEntry {
  const title = titleFromSlug(slug);
  return {
    slug,
    title,
    description: "Interactive game. Coming soon.",
    loader: () => import("@/components/games/ComingSoonGame"),

  };
}

// join-dots-connect-four
{
  title: "Join Dots (Connect Four)",
  description: "Play Connect Four against a smart AI with difficulty levels and live analysis.",
  loader: () => import("@/components/games/JoinDotsConnectFour"),
}

