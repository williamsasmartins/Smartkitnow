/* SmartKitNow — Games Registry (single source of truth)
   - Each game must have a unique slug under /games/:slug
   - loader must point to the game component default export
*/

export type GameRegistryEntry = {
  slug: string;
  title: string;
  description: string;
  loader: () => Promise<any>;
  comingSoon?: boolean;
};

// Carrega a tela de "Em Breve" para jogos que ainda não foram criados
export const DEFAULT_GAME_LOADER = () => import("../components/games/ComingSoonGame");

export const GAMES: GameRegistryEntry[] = [
  // -------------------------------------------------------------------------
  // JOGOS ATIVOS (Códigos já gerados)
  // -------------------------------------------------------------------------
  { 
    slug: "neon-snake", 
    title: "Neon Snake", 
    description: "Classic Snake in a neon grid. Eat, grow, avoid collisions.", 
    loader: () => import("../components/games/NeonSnake"), 
    comingSoon: false 
  },
  { 
    slug: "brick-dash", 
    title: "Brick Dash", 
    description: "Dash between lanes, dodge falling bricks, grab power-ups, and chase a new high score.", 
    loader: () => import("../components/games/BrickDash"), 
    comingSoon: false 
  },

  // -------------------------------------------------------------------------
  // PLACEHOLDERS (Jogos futuros - Apontam para ComingSoonGame)
  // -------------------------------------------------------------------------
  
  // Arcade Classics
  { slug: "astro-breakout", title: "Astro Breakout", description: "Breakout-style arcade.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "bubble-shooter-nova", title: "Bubble Shooter Nova", description: "Match bubbles.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "space-invaders-remix", title: "Space Invaders Remix", description: "Defend Earth.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "asteroid-drift", title: "Asteroid Drift", description: "Space survival.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "neon-paddle", title: "Neon Paddle", description: "Pong-style game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "pinball-neon", title: "Pinball Neon", description: "Arcade pinball.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "crossy-street", title: "Crossy Street", description: "Road crossing game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "missile-command-grid", title: "Missile Command Grid", description: "Base defense.", loader: DEFAULT_GAME_LOADER, comingSoon: true },

  // Endless Runner
  { slug: "orb-runner", title: "Orb Runner", description: "Arcade runner game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "flappy-rocket", title: "Flappy Rocket", description: "Tap to fly.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "doodle-jumpers", title: "Doodle Jumpers", description: "Endless jump platformer.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "jetpack-dash", title: "Jetpack Dash", description: "High speed flying.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "skyline-runner", title: "Skyline Runner", description: "Rooftop parkour.", loader: DEFAULT_GAME_LOADER, comingSoon: true },

  // Puzzle & Logic
  { slug: "pixel-tetris", title: "Pixel Tetris", description: "Classic block-stacking puzzle.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "memory-flux", title: "Memory Flux", description: "Memory challenge game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "2048-galaxy", title: "2048 Galaxy", description: "2048 with a cosmic skin.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "sliding-puzzle-deluxe", title: "Sliding Puzzle Deluxe", description: "Classic sliding puzzle.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "match-3-aurora", title: "Match-3 Aurora", description: "Match-3 gem puzzle.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "bubble-pop-nova", title: "Bubble Pop Nova", description: "Bubble pop arcade.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "tower-stack", title: "Tower Stack", description: "Stack blocks for high score.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "nonogram-glow", title: "Nonogram Glow", description: "Picross / nonogram puzzle.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "minesweeper-dark", title: "Minesweeper Dark", description: "Minesweeper with a sleek UI.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "water-sort-neon", title: "Water Sort Neon", description: "Color sorting puzzle.", loader: DEFAULT_GAME_LOADER, comingSoon: true },

  // Word & Trivia
  { slug: "word-sprint", title: "Word Sprint", description: "Fast-paced word game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "typing-duel", title: "Typing Duel", description: "Typing speed duel.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "trivia-blitz", title: "Trivia Blitz", description: "Quick trivia rounds.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "word-search-premium", title: "Word Search Premium", description: "Word search.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "hangman-noir", title: "Hangman Noir", description: "Hangman word game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  
  // Math & Brain
  { slug: "quick-math-arena", title: "Quick Math Arena", description: "Mental math battles.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "sudoku-night", title: "Sudoku Night", description: "Sudoku with a dark theme.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "guess-the-number-pro", title: "Guess the Number Pro", description: "Guess the number.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "simon-lights", title: "Simon Lights", description: "Repeat the light pattern.", loader: DEFAULT_GAME_LOADER, comingSoon: true },

  // Board & Strategy
  { slug: "join-dots-connect-four", title: "Join Dots (Connect Four)", description: "Play Connect Four against AI.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "checkers-royale", title: "Checkers Royale", description: "Classic checkers.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "tic-tac-toe-prime", title: "Tic-Tac-Toe Prime", description: "Tic-tac-toe variants.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "reversi-eclipse", title: "Reversi Eclipse", description: "Reversi / Othello.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "chess-puzzles-daily", title: "Chess Puzzles Daily", description: "Daily chess puzzles.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "battleship-grid", title: "Battleship Grid", description: "Naval combat.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "ludo-party", title: "Ludo Party", description: "Dice board game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },

  // Reflex & Rhythm
  { slug: "tap-reflex", title: "Tap Reflex", description: "Reflex training mini-game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "rhythm-tiles", title: "Rhythm Tiles", description: "Rhythm timing game.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  
  // Sports
  { slug: "mini-golf-orbit", title: "Mini Golf Orbit", description: "Mini golf in space.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "air-hockey-neon", title: "Air Hockey Neon", description: "Neon air hockey.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  
  // Maze
  { slug: "maze-escape", title: "Maze Escape", description: "Solve mazes.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
  { slug: "path-finder", title: "Path Finder", description: "Find the optimal path puzzles.", loader: DEFAULT_GAME_LOADER, comingSoon: true },
];

function normalizeSlug(slugOrAlias: string) {
  return (slugOrAlias || "").trim().toLowerCase();
}

const bySlug = new Map<string, GameRegistryEntry>(GAMES.map((g) => [g.slug, g]));

// Aliases para URL (opcional)
const ALIASES: Record<string, string> = {
  // "snake": "neon-snake",
};

export function getGameEntry(slugOrAlias: string | undefined | null): GameRegistryEntry | null {
  const key = normalizeSlug(slugOrAlias || "");
  if (!key) return null;

  const canonical = ALIASES[key] ?? key;
  return bySlug.get(canonical) ?? null;
}

export function listGames(): GameRegistryEntry[] {
  return GAMES.slice();
}
