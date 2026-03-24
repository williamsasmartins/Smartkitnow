/**
 * gameSlugs.ts — Lightweight slug-only copy of gameRegistry.tsx RAW_GAMES.
 *
 * This file exists so that non-JSX scripts (e.g. generate-sitemap.ts) can
 * enumerate all game routes without importing React/component dependencies.
 *
 * IMPORTANT: When you add a new game to gameRegistry.tsx RAW_GAMES, also add
 * its slug here to keep the sitemap in sync.
 */

export const GAME_SLUGS: string[] = [
  // --- ARCADE (8) ---
  "neon-snake",
  "galaxy-invaders",
  "brick-breaker-pro",
  "pong-masters",
  "meteor-blast",
  "cyber-pinball",
  "tank-battle-arena",
  "pac-runner",

  // --- ENDLESS RUNNER (6) ---
  "dino-run-3d",
  "subway-surfer-lite",
  "cosmic-dash",
  "temple-escape",
  "ninja-roof-runner",
  "brick-dash",

  // --- PUZZLE (10) ---
  "sudoku-zen",
  "jigsaw-explorer",
  "2048-classic",
  "minesweeper-pro",
  "tangram-master",
  "pipe-connect",
  "block-puzzle-jewel",
  "differences-finder",
  "water-sort",
  "hexa-puzzle",

  // --- MAGIC CUBE (3) ---
  "rubiks-cube-3x3",
  "speed-cuber-timer",
  "cube-solver-ai",

  // --- WORD (6) ---
  "wordle-unlimited",
  "crossword-daily",
  "word-search-pro",
  "hangman-extreme",
  "scrabble-solo",
  "typing-racer",

  // --- MATH (5) ---
  "math-blaster",
  "24-game",
  "mental-math-gym",
  "fraction-pizza",
  "geometry-dash-lite",

  // --- BOARD (6) ---
  "tic-tac-toe-prime",
  "chess-master-ai",
  "checkers-online",
  "connect-4-pro",
  "backgammon-live",
  "ludo-party",

  // --- CARD (5) ---
  "solitaire-klondike",
  "baccarat-royale",
  "spider-solitaire",
  "uno-friends",
  "memory-match-cards",

  // --- MATCH-3 (5) ---
  "candy-crush-clone",
  "jewel-hunter",
  "bubble-shooter-pop",
  "zuma-tumble",
  "fruit-splash",

  // --- RHYTHM (4) ---
  "piano-tiles-speed",
  "drum-kit-pro",
  "music-racer",
  "beat-saber-web",

  // --- MAZE (4) ---
  "maze-runner-3d",
  "pac-maze",
  "ball-roll-maze",
  "scary-maze",

  // --- SPORTS (5) ---
  "basketball-hoops",
  "penalty-shootout",
  "8-ball-pool-lite",
  "table-tennis-pro",
  "archery-master",

  // --- CLASSICS (6) ---
  "tetris-blocks",
  "snake-classic",
  "minesweeper-xp",
  "pinball-classic",
  "simon-says",
  "breakout-retro",
];
