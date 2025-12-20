// src/data/gamesRegistry.ts

export type GameRegistryEntry = {
  slug: string;
  title: string;
  description: string;
  loader: () => Promise<any>;
  aliases?: string[];
  comingSoon?: boolean;
};

const DEFAULT_LOADER = () => import("../components/games/ComingSoonGame");

// Manter como array facilita ordenar/listar na página /games
const GAMES: GameRegistryEntry[] = [
  {
    slug: "join-dots-connect-four",
    title: "Join Dots (Connect Four)",
    description: "Play Connect Four in a clean UI with AI. Three difficulty levels.",
    loader: () => import("../components/games/JoinDotsConnectFour"),
    comingSoon: false,
  },

  "brick-dash": {
  title: "Brick Dash",
  description: "Dodge falling brick walls and dash through tight gaps. Desktop + mobile controls, fullscreen, combos, and power-ups.",
  loader: () => import("@/components/games/BrickDash"),
},

  { slug: "neon-snake", title: "Neon Snake", description: "Classic Snake in a neon grid. Eat, grow, avoid collisions.", loader: () => import("../components/games/NeonSnake"), comingSoon: false },
  { slug: "astro-breakout", title: "Astro Breakout", description: "Breakout-style arcade. Power-ups and sectors.", loader: () => import("../components/games/AstroBreakout"), comingSoon: false },
  { slug: "orb-runner", title: "Orb Runner", description: "Endless runner reflex game. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "pixel-tetris", title: "Pixel Tetris", description: "Tetris-inspired block puzzler. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "memory-flux", title: "Memory Flux", description: "Memory cards and patterns. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "word-sprint", title: "Word Sprint", description: "Fast-paced word challenges. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "typing-duel", title: "Typing Duel", description: "Typing speed duel. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "trivia-blitz", title: "Trivia Blitz", description: "Quick trivia rounds. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "quick-math-arena", title: "Quick Math Arena", description: "Mental math under time pressure. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "sudoku-night", title: "Sudoku Night", description: "Sudoku with a calm theme. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "nonogram-glow", title: "Nonogram Glow", description: "Nonogram (Picross) puzzles. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "minesweeper-dark", title: "Minesweeper Dark", description: "Minesweeper with a dark theme. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "2048-galaxy", title: "2048 Galaxy", description: "2048-style merging puzzle. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "sliding-puzzle-deluxe", title: "Sliding Puzzle Deluxe", description: "Sliding tiles puzzle. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "match-3-aurora", title: "Match-3 Aurora", description: "Match-3 puzzle game. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "bubble-pop-nova", title: "Bubble Pop Nova", description: "Bubble pop arcade. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "brick-dash", title: "Brick Dash", description: "Brick-busting dash arcade. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "tower-stack", title: "Tower Stack", description: "Timing-based stacking game. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "tap-reflex", title: "Tap Reflex", description: "Reaction and reflex mini-game. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "rhythm-tiles", title: "Rhythm Tiles", description: "Rhythm tile tapping. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "flappy-rocket", title: "Flappy Rocket", description: "Flappy-style rocket game. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "doodle-jumpers", title: "Doodle Jumpers", description: "Vertical platform jumping. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "mini-golf-orbit", title: "Mini Golf Orbit", description: "Mini golf with simple physics. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "air-hockey-neon", title: "Air Hockey Neon", description: "Air hockey arcade match. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "pong-recharged", title: "Pong Recharged", description: "Pong with modern polish. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },

  { slug: "checkers-royale", title: "Checkers Royale", description: "Checkers game. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "tic-tac-toe-prime", title: "Tic-Tac-Toe Prime", description: "Tic-tac-toe with style. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "reversi-eclipse", title: "Reversi Eclipse", description: "Reversi / Othello board game. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "chess-puzzles-daily", title: "Chess Puzzles Daily", description: "Chess puzzles and tactics. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },

  { slug: "word-search-premium", title: "Word Search", description: "Word search puzzle. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "hangman-noir", title: "Hangman Noir", description: "Hangman word game. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "guess-the-number-pro", title: "Guess the Number", description: "Guess-the-number logic game. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "simon-lights", title: "Simon Lights", description: "Repeat the pattern memory game. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "maze-escape", title: "Maze Escape", description: "Maze navigation puzzle. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
  { slug: "path-finder", title: "Path Finder", description: "Pathfinding logic puzzle. Coming soon.", loader: DEFAULT_LOADER, comingSoon: true },
];

function normalizeSlug(input: string) {
  return (input ?? "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
}

const bySlug = new Map<string, GameRegistryEntry>();
const byAlias = new Map<string, string>();

for (const g of GAMES) {
  bySlug.set(g.slug, g);
  for (const a of g.aliases ?? []) {
    byAlias.set(normalizeSlug(a), g.slug);
  }
}

export function listGames() {
  return [...GAMES].sort((a, b) => a.title.localeCompare(b.title));
}

export function getGameEntry(slugOrAlias: string): GameRegistryEntry | null {
  const key = normalizeSlug(slugOrAlias);
  if (!key) return null;

  const direct = bySlug.get(key);
  if (direct) return direct;

  const resolved = byAlias.get(key);
  if (resolved) return bySlug.get(resolved) ?? null;

  return null;
}
