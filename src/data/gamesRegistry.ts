/* SmartKitNow — Games Registry (Safe Mode) */

export type GameRegistryEntry = {
  slug: string;
  title: string;
  description: string;
  loader: () => Promise<any>;
  comingSoon?: boolean;
};

// Loader genérico para jogos que ainda não existem
export const DEFAULT_GAME_LOADER = () => import("../components/games/ComingSoonGame");

export const GAMES: GameRegistryEntry[] = [
  // --- JOGOS (Atualmente apontando para Coming Soon para evitar erro de build) ---
  {
    slug: "neon-snake",
    title: "Neon Snake",
    description: "Classic snake game with a neon twist. Collect food, grow longer, and avoid hitting the walls or yourself!",
    loader: () => import("../components/games/NeonSnakeGame"),
  },

  // --- OUTROS JOGOS ---
  { slug: "astro-breakout", title: "Astro Breakout", description: "Breakout-style arcade.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "orb-runner", title: "Orb Runner", description: "Arcade runner game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "pixel-tetris", title: "Pixel Tetris", description: "Classic block-stacking puzzle.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "memory-flux", title: "Memory Flux", description: "Memory challenge game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "word-sprint", title: "Word Sprint", description: "Fast-paced word game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "typing-duel", title: "Typing Duel", description: "Typing speed duel.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "trivia-blitz", title: "Trivia Blitz", description: "Quick trivia rounds.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "quick-math-arena", title: "Quick Math Arena", description: "Mental math battles.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "sudoku-night", title: "Sudoku Night", description: "Sudoku with a dark theme.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "nonogram-glow", title: "Nonogram Glow", description: "Picross / nonogram puzzle.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "minesweeper-dark", title: "Minesweeper Dark", description: "Minesweeper with a sleek UI.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "2048-galaxy", title: "2048 Galaxy", description: "2048 with a cosmic skin.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "sliding-puzzle-deluxe", title: "Sliding Puzzle Deluxe", description: "Classic sliding puzzle.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "match-3-aurora", title: "Match-3 Aurora", description: "Match-3 gem puzzle.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "bubble-pop-nova", title: "Bubble Pop Nova", description: "Bubble pop arcade.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "tower-stack", title: "Tower Stack", description: "Stack blocks for high score.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "tap-reflex", title: "Tap Reflex", description: "Reflex training mini-game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "rhythm-tiles", title: "Rhythm Tiles", description: "Rhythm timing game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "flappy-rocket", title: "Flappy Rocket", description: "Flappy-style rocket game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "doodle-jumpers", title: "Doodle Jumpers", description: "Endless jump platformer.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "mini-golf-orbit", title: "Mini Golf Orbit", description: "Mini golf in space.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "air-hockey-neon", title: "Air Hockey Neon", description: "Neon air hockey.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "pong-recharged", title: "Pong Recharged", description: "Modern pong remix.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "checkers-royale", title: "Checkers Royale", description: "Classic checkers.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "tic-tac-toe-prime", title: "Tic-Tac-Toe Prime", description: "Tic-tac-toe variants.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "reversi-eclipse", title: "Reversi Eclipse", description: "Reversi / Othello.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "chess-puzzles-daily", title: "Chess Puzzles Daily", description: "Daily chess puzzles.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "word-search-premium", title: "Word Search Premium", description: "Word search.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "hangman-noir", title: "Hangman Noir", description: "Hangman word game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "guess-the-number-pro", title: "Guess the Number Pro", description: "Guess the number.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "simon-lights", title: "Simon Lights", description: "Repeat the light pattern.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "maze-escape", title: "Maze Escape", description: "Solve mazes.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "path-finder", title: "Path Finder", description: "Find the optimal path puzzles.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
];

function normalizeSlug(slugOrAlias: string) {
  return (slugOrAlias || "").trim().toLowerCase();
}

const bySlug = new Map<string, GameRegistryEntry>(GAMES.map((g) => [g.slug, g]));

const ALIASES: Record<string, string> = {};

export function getGameEntry(slugOrAlias: string | undefined | null): GameRegistryEntry | null {
  const key = normalizeSlug(slugOrAlias || "");
  if (!key) return null;

  const canonical = ALIASES[key] ?? key;
  return bySlug.get(canonical) ?? null;
}

export function listGames(): GameRegistryEntry[] {
  return GAMES.slice();
}
