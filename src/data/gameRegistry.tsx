import React from "react";
import GamePlaceholder from "../components/games/GamePlaceholder";
import TicTacToePrime from "../components/games/board/TicTacToePrime";
import NeonSnakeGame from "../components/games/NeonSnakeGame";
import SpaceInvadersGame from "../components/games/SpaceInvadersGame";
import AstroBreakoutGame from "../components/games/AstroBreakoutGame";
import NeonPaddleGame from "../components/games/NeonPaddleGame";
import AsteroidDriftGame from "../components/games/AsteroidDriftGame";
import PinballNeonGame from "../components/games/PinballNeonGame";
import BubbleShooterGame from "../components/games/BubbleShooterGame";
import BrickDashGame from "../components/games/BrickDashGame";
// import CrossyStreetGame from "../components/games/CrossyStreetGame"; 

export type GameCategory =
    | "arcade"
    | "runner"
    | "puzzle"
    | "cube"
    | "word"
    | "math"
    | "board"
    | "card"
    | "match3"
    | "rhythm"
    | "maze"
    | "sports"
    | "classics";

export interface GameEntry {
    slug: string;
    title: string;
    category: GameCategory;
    description: string;
    component: React.ComponentType<any>;
    useCustomLayout?: boolean;
}

// ----------------------------------------------------------------------
// GAME LIST (70+ TITLES)
// ----------------------------------------------------------------------

const RAW_GAMES: Omit<GameEntry, "component">[] = [
    // --- ARCADE (8) ---
    { slug: "neon-snake", title: "Neon Snake", category: "arcade", description: "Classic snake game with a neon twist." },
    { slug: "galaxy-invaders", title: "Galaxy Invaders", category: "arcade", description: "Defend Earth from alien swarms!" },
    { slug: "brick-breaker-pro", title: "Brick Breaker Pro", category: "arcade", description: "Smash bricks with power-ups." },
    { slug: "pong-masters", title: "Pong Masters", category: "arcade", description: "The original tennis arcade game." },
    { slug: "meteor-blast", title: "Meteor Blast", category: "arcade", description: "Shoot asteroids before they hit." },
    { slug: "cyber-pinball", title: "Cyber Pinball", category: "arcade", description: "Futuristic pinball machine." },
    { slug: "tank-battle-arena", title: "Tank Battle Arena", category: "arcade", description: "Top-down tank warfare." },
    { slug: "pac-runner", title: "Pac-Runner", category: "arcade", description: "Collect dots and avoid ghosts." },

    // --- ENDLESS RUNNER (5) ---
    { slug: "dino-run-3d", title: "Dino Run 3D", category: "runner", description: "Infinite desert running action." },
    { slug: "subway-surfer-lite", title: "Subway Surfer Lite", category: "runner", description: "Dodge trains and collect coins." },
    { slug: "cosmic-dash", title: "Cosmic Dash", category: "runner", description: "Jump across floating platforms." },
    { slug: "temple-escape", title: "Temple Escape", category: "runner", description: "Run from the ancient guardian." },
    { slug: "ninja-roof-runner", title: "Ninja Roof Runner", category: "runner", description: "Parkour over city rooftops." },
    { slug: "brick-dash", title: "Brick Dash", category: "runner", description: "Dodge the falling bricks!" }, // Added

    // --- PUZZLE (10) ---
    { slug: "sudoku-zen", title: "Sudoku Zen", category: "puzzle", description: "Relaxing number placement puzzle." },
    { slug: "jigsaw-explorer", title: "Jigsaw Explorer", category: "puzzle", description: "Assemble beautiful HD puzzles." },
    { slug: "2048-classic", title: "2048 Classic", category: "puzzle", description: "Join numbers to reach 2048." },
    { slug: "minesweeper-pro", title: "Minesweeper Pro", category: "puzzle", description: "Clear the board without exploding." },
    { slug: "tangram-master", title: "Tangram Master", category: "puzzle", description: "Fit shapes into the outline." },
    { slug: "pipe-connect", title: "Pipe Connect", category: "puzzle", description: "Create a flow by connecting pipes." },
    { slug: "block-puzzle-jewel", title: "Block Puzzle Jewel", category: "puzzle", description: "Fit blocks to clear lines." },
    { slug: "differences-finder", title: "Differences Finder", category: "puzzle", description: "Spot the differences between images." },
    { slug: "water-sort", title: "Water Sort", category: "puzzle", description: "Sort colored water into tubes." },
    { slug: "hexa-puzzle", title: "Hexa Puzzle", category: "puzzle", description: "Fill the honeycomb grid." },

    // --- MAGIC CUBE (3) ---
    { slug: "rubiks-cube-3x3", title: "Rubik's Cube 3x3", category: "cube", description: "Interactive 3D magic cube." },
    { slug: "speed-cuber-timer", title: "Speed Cuber Timer", category: "cube", description: "Track your solving times." },
    { slug: "cube-solver-ai", title: "Cube Solver AI", category: "cube", description: "Let AI solve your scrambled cube." },

    // --- WORD (6) ---
    { slug: "wordle-unlimited", title: "Wordle Unlimited", category: "word", description: "Guess the 5-letter word." },
    { slug: "crossword-daily", title: "Crossword Daily", category: "word", description: "New crossword puzzles every day." },
    { slug: "word-search-pro", title: "Word Search Pro", category: "word", description: "Find hidden words in the grid." },
    { slug: "hangman-extreme", title: "Hangman Extreme", category: "word", description: "Guess the phrase before time runs out." },
    { slug: "scrabble-solo", title: "Scrabble Solo", category: "word", description: "Practice your word building skills." },
    { slug: "typing-racer", title: "Typing Racer", category: "word", description: "Type fast to win the race." },

    // --- MATH (5) ---
    { slug: "math-blaster", title: "Math Blaster", category: "math", description: "Solve equations to shoot targets." },
    { slug: "24-game", title: "24 Game", category: "math", description: "Make 24 using 4 numbers." },
    { slug: "mental-math-gym", title: "Mental Math Gym", category: "math", description: "Train your brain with quick math." },
    { slug: "fraction-pizza", title: "Fraction Pizza", category: "math", description: "Learn fractions with pizza slices." },
    { slug: "geometry-dash-lite", title: "Geometry Dash Lite", category: "math", description: "Rhythm-based geometry platformer." },

    // --- BOARD (6) ---
    { slug: "tic-tac-toe-prime", title: "Tic-Tac-Toe Prime", category: "board", description: "The classic game of X and O, reimagined." },
    { slug: "chess-master-ai", title: "Chess Master AI", category: "board", description: "Play chess against a smart AI." },
    { slug: "checkers-online", title: "Checkers Online", category: "board", description: "Classic checkers strategy game." },
    { slug: "connect-4-pro", title: "Connect 4 Pro", category: "board", description: "Drop discs to connect four." },
    { slug: "backgammon-live", title: "Backgammon Live", category: "board", description: "Roll dice and move your checkers." },
    { slug: "ludo-party", title: "Ludo Party", category: "board", description: "Fun board game for up to 4 players." },

    // --- CARD (5) ---
    { slug: "solitaire-klondike", title: "Solitaire Klondike", category: "card", description: "The classic patience card game." },
    { slug: "baccarat-royale", title: "Baccarat Royale", category: "card", description: "Casino style baccarat game." },
    { slug: "spider-solitaire", title: "Spider Solitaire", category: "card", description: "Challenge yourself with two decks." },
    { slug: "uno-friends", title: "Uno Friends", category: "card", description: "Colorful card matching fun." },
    { slug: "memory-match-cards", title: "Memory Match", category: "card", description: "Find matching card pairs." },

    // --- MATCH-3 (5) ---
    { slug: "candy-crush-clone", title: "Candy Burst", category: "match3", description: "Match 3 candies to clear the board." },
    { slug: "jewel-hunter", title: "Jewel Hunter", category: "match3", description: "Hunt for ancient jewels." },
    { slug: "bubble-shooter-pop", title: "Bubble Shooter Pop", category: "match3", description: "Pop bubbles of the same color." },
    { slug: "zuma-tumble", title: "Zuma Tumble", category: "match3", description: "Stop the marble chain." },
    { slug: "fruit-splash", title: "Fruit Splash", category: "match3", description: "Connect juicy fruits." },

    // --- RHYTHM (4) ---
    { slug: "piano-tiles-speed", title: "Piano Tiles Speed", category: "rhythm", description: "Tap the black tiles to the beat." },
    { slug: "drum-kit-pro", title: "Drum Kit Pro", category: "rhythm", description: "Play virtual drums." },
    { slug: "music-racer", title: "Music Racer", category: "rhythm", description: "Race along your music tracks." },
    { slug: "beat-saber-web", title: "Beat Saber Web", category: "rhythm", description: "Slice blocks to the rhythm." },

    // --- MAZE (4) ---
    { slug: "maze-runner-3d", title: "Maze Runner 3D", category: "maze", description: "Escape the labyrinth in first person." },
    { slug: "pac-maze", title: "Pac-Maze", category: "maze", description: "Classic maze navigation." },
    { slug: "ball-roll-maze", title: "Ball Roll Maze", category: "maze", description: "Tilt to roll the ball out." },
    { slug: "scary-maze", title: "Scary Maze", category: "maze", description: "Don't touch the walls!" },

    // --- SPORTS (5) ---
    { slug: "basketball-hoops", title: "Basketball Hoops", category: "sports", description: "Shoot some hoops." },
    { slug: "penalty-shootout", title: "Penalty Shootout", category: "sports", description: "Score goals against the keeper." },
    { slug: "8-ball-pool-lite", title: "8 Ball Pool Lite", category: "sports", description: "Play pool online." },
    { slug: "table-tennis-pro", title: "Table Tennis Pro", category: "sports", description: "Fast-paced ping pong." },
    { slug: "archery-master", title: "Archery Master", category: "sports", description: "Hit the bullseye." },

    // --- CLASSICS (6) ---
    { slug: "tetris-blocks", title: "Tetris Blocks", category: "classics", description: "Fit falling blocks together." },
    { slug: "snake-classic", title: "Snake Classic", category: "classics", description: "Retro snake game." },
    { slug: "minesweeper-xp", title: "Minesweeper XP", category: "classics", description: "Windows 95 style minesweeper." },
    { slug: "pinball-classic", title: "Pinball Classic", category: "classics", description: "Retro arcade pinball." },
    { slug: "simon-says", title: "Simon Says", category: "classics", description: "Repeat the color sequence." },
    { slug: "breakout-retro", title: "Breakout Retro", category: "classics", description: "Bounce the ball to break bricks." }
];

export const GAME_REGISTRY: GameEntry[] = RAW_GAMES.map(game => {
    // SPECIAL MAPPING FOR REAL GAMES
    if (game.slug === "tic-tac-toe-prime") return { ...game, component: TicTacToePrime }; // Uses standard layout

    // Full-page games (Self-contained layout)
    if (game.slug === "neon-snake") return { ...game, component: NeonSnakeGame, useCustomLayout: true };
    if (game.slug === "galaxy-invaders") return { ...game, component: SpaceInvadersGame, useCustomLayout: true };
    if (game.slug === "brick-breaker-pro") return { ...game, component: AstroBreakoutGame, useCustomLayout: true };
    if (game.slug === "pong-masters") return { ...game, component: NeonPaddleGame, useCustomLayout: true };
    if (game.slug === "meteor-blast") return { ...game, component: AsteroidDriftGame, useCustomLayout: true };
    if (game.slug === "cyber-pinball") return { ...game, component: PinballNeonGame, useCustomLayout: true };
    if (game.slug === "bubble-shooter-pop") return { ...game, component: BubbleShooterGame, useCustomLayout: true };
    if (game.slug === "brick-dash") return { ...game, component: BrickDashGame, useCustomLayout: true };
    if (game.slug === "ninja-roof-runner") return { ...game, component: BrickDashGame, useCustomLayout: true };

    // DEFAULT FALLBACK FOR ALL OTHER GAMES
    return {
        ...game,
        component: () => <GamePlaceholder title={game.title} />
    };
});

export function getGameBySlug(slug: string): GameEntry | undefined {
    return GAME_REGISTRY.find(game => game.slug === slug);
}

export function getGamesByCategory(category: GameCategory): GameEntry[] {
    return GAME_REGISTRY.filter(game => game.category === category);
}

export const CATEGORY_LABELS: Record<GameCategory, string> = {
    arcade: "Arcade Action",
    runner: "Endless Runner",
    puzzle: "Puzzle & Logic",
    cube: "Magic Cube",
    word: "Word Games",
    math: "Math Challenges",
    board: "Board Games",
    card: "Card & Casino",
    match3: "Match-3",
    rhythm: "Music & Rhythm",
    maze: "Mazes & Labyrinths",
    sports: "Sports Arcade",
    classics: "Retro Classics"
};
