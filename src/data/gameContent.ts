// Per-game editorial content generator.
//
// Why: every game page previously shared the same boilerplate instructions
// ("Most games can be played with a mouse or touch screen…"), which reads as
// duplicate/thin content across ~70 indexed pages — an SEO and AdSense risk.
// This module derives distinctive copy from each game's category, title and
// description so every page carries unique, useful text while staying indexed.

import type { GameCategory, GameEntry } from "./gameRegistry";

type CategoryCopy = {
  /** How you actually control games in this category. */
  controls: string;
  /** What good play looks like — a short strategy paragraph. */
  strategy: string;
  /** A concrete tip specific to the genre. */
  tip: string;
  /** Human-friendly genre label for prose. */
  label: string;
};

const CATEGORY_COPY: Record<GameCategory, CategoryCopy> = {
  arcade: {
    label: "arcade",
    controls:
      "Use the Arrow Keys (or WASD) to move and the Spacebar to shoot or perform your main action; on touch devices, tap and swipe on the play area.",
    strategy:
      "Arcade games reward fast reactions and pattern recognition. Learn the enemy or obstacle rhythm, keep moving so you are never cornered, and prioritise threats that appear closest to you first.",
    tip: "Chase a high score in short bursts — your reflexes stay sharpest in the first few minutes, so restart rather than grinding a tired run.",
  },
  runner: {
    label: "endless runner",
    controls:
      "Jump with the Spacebar or Up Arrow, slide or duck with the Down Arrow, and switch lanes with Left/Right; on mobile, swipe up, down, left and right.",
    strategy:
      "Runners are about reading the track ahead, not reacting late. Look a screen ahead of your character, commit to lane changes early, and collect pickups only when they are safely on your path.",
    tip: "Speed ramps up the longer you survive, so bank easy coins early — later stretches are too fast to detour for them.",
  },
  puzzle: {
    label: "puzzle",
    controls:
      "Click or tap tiles and pieces to select and place them; some puzzles also support dragging or the Arrow Keys to nudge the board.",
    strategy:
      "Puzzle games reward planning over speed. Scan the whole board before your first move, work from the constraints that have the fewest options, and undo mentally before you commit.",
    tip: "When you are stuck, clear the edges or corners first — they usually have the fewest valid solutions and unlock the middle.",
  },
  cube: {
    label: "cube / twisty",
    controls:
      "Rotate faces by clicking and dragging, or use the on-screen turn buttons; keyboard shortcuts map each face to a key where supported.",
    strategy:
      "Solve in stages rather than all at once: build one layer, then the middle, then the last. Keep the pieces you have already solved intact while you position the next set.",
    tip: "Slow, deliberate turns beat fast scrambling — one mis-turn can undo a whole layer.",
  },
  word: {
    label: "word",
    controls:
      "Type letters on your keyboard, or tap the on-screen tiles; press Enter to submit a guess and Backspace to remove a letter.",
    strategy:
      "Open with words that use common vowels and frequent consonants to reveal the most information, then narrow down using what each guess confirms or rules out.",
    tip: "Avoid repeating letters you have already eliminated — every guess should test something new.",
  },
  math: {
    label: "math",
    controls:
      "Type your answer and press Enter, or tap the number and operator buttons on screen.",
    strategy:
      "Math games train speed and accuracy together. Estimate first to catch obviously wrong answers, then compute exactly. Keep a steady pace instead of rushing and mis-typing.",
    tip: "Learn the small facts cold — quick recall of single-digit sums and products frees your attention for the harder steps.",
  },
  board: {
    label: "board",
    controls:
      "Click or tap a piece to select it, then click or tap a highlighted square to move; the game marks legal moves for you.",
    strategy:
      "Think a move ahead of your opponent: control the centre, develop all your pieces before attacking, and avoid trades that only help the other side.",
    tip: "Before every move, ask what your opponent threatens next — defending in time wins more games than flashy attacks.",
  },
  card: {
    label: "card",
    controls:
      "Click or tap to draw, select and play cards; drag a card onto a valid pile or slot to place it.",
    strategy:
      "Manage what you can see and plan for what you cannot. Keep useful cards in reserve, avoid emptying your options too early, and count what has already been played.",
    tip: "Patience pays — a move that looks good now can block a better one a turn later.",
  },
  match3: {
    label: "match-3",
    controls:
      "Swap two adjacent pieces by clicking/tapping them in turn, or by dragging one onto its neighbour, to line up three or more.",
    strategy:
      "Look for moves that trigger chain reactions rather than single matches, and set up special pieces before you use them. Clearing from the bottom often cascades new matches for free.",
    tip: "Save power-ups for crowded boards — combining two specials clears far more than using them apart.",
  },
  rhythm: {
    label: "rhythm",
    controls:
      "Hit the mapped keys (or tap the on-screen lanes) exactly as each note reaches the target line; hold for long notes.",
    strategy:
      "Rhythm games are about timing, not speed. Lock onto the beat, keep your hands relaxed, and watch a beat ahead so your hits land on time instead of chasing notes.",
    tip: "Turn the music up a little — you will time notes more accurately by ear than by eye alone.",
  },
  maze: {
    label: "maze",
    controls:
      "Move with the Arrow Keys or WASD; on touch devices, swipe in the direction you want to travel.",
    strategy:
      "Keep a consistent rule — such as following the left wall — to avoid looping, and glance ahead to spot dead ends before you commit to a corridor.",
    tip: "When chased, plan an exit before you enter a corridor so you never trap yourself in a dead end.",
  },
  sports: {
    label: "sports",
    controls:
      "Aim with the mouse or Arrow Keys and act (shoot, hit, kick) with the Spacebar or a tap; timing and power often depend on how long you hold.",
    strategy:
      "Sports games reward timing and positioning. Read the angle before you act, commit early to your aim, and favour consistent, controlled shots over risky power moves.",
    tip: "Practise the basic shot until it is automatic — reliable fundamentals beat a low-percentage trick play.",
  },
  classics: {
    label: "classic",
    controls:
      "Use the Arrow Keys or mouse to control the action, with the Spacebar for the main move; touch controls mirror this on mobile.",
    strategy:
      "These timeless games reward clean, deliberate play. Learn the core loop, avoid greedy risks, and build a steady rhythm rather than forcing big plays.",
    tip: "Consistency wins classic games — a calm, mistake-free run usually outscores an aggressive one.",
  },
};

export type GameContent = {
  intro: string;
  objective: string;
  controls: string;
  strategy: string;
  tip: string;
};

/** Build unique, category-aware editorial copy for a single game. */
export function getGameContent(game: Pick<GameEntry, "title" | "category" | "description">): GameContent {
  const c = CATEGORY_COPY[game.category] ?? CATEGORY_COPY.classics;
  return {
    intro: `${game.title} is a free online ${c.label} game you can play right here in your browser — no download, no sign-up. ${game.description}`,
    objective: game.description,
    controls: c.controls,
    strategy: c.strategy,
    tip: c.tip,
  };
}
