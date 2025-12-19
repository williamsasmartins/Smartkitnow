import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

type Item = { name: string; slug: string; icon?: string; description?: string };

const arcadeClassics: Item[] = [
  { name: "Neon Snake", slug: "neon-snake" },
  { name: "Astro Breakout", slug: "astro-breakout" },
  { name: "Brick Dash", slug: "brick-dash" },
  { name: "Bubble Shooter Nova", slug: "bubble-shooter-nova" },
  { name: "Space Invaders Remix", slug: "space-invaders-remix" },
  { name: "Asteroid Drift", slug: "asteroid-drift" },
  { name: "Neon Paddle (Pong-style)", slug: "neon-paddle" },
  { name: "Pinball Neon", slug: "pinball-neon" },
  { name: "Crossy Street", slug: "crossy-street" },
  { name: "Missile Command Grid", slug: "missile-command-grid" },
];

const runnerPlatform: Item[] = [
  { name: "Orb Runner", slug: "orb-runner" },
  { name: "Flappy Rocket", slug: "flappy-rocket" },
  { name: "Doodle Jumpers", slug: "doodle-jumpers" },
  { name: "Jetpack Dash", slug: "jetpack-dash" },
  { name: "Skyline Runner", slug: "skyline-runner" },
  { name: "Cave Hop", slug: "cave-hop" },
  { name: "Rope Swing Rush", slug: "rope-swing-rush" },
];

const puzzleLogic: Item[] = [
  { name: "2048 Galaxy", slug: "2048-galaxy" },
  { name: "Sliding Puzzle Deluxe", slug: "sliding-puzzle-deluxe" },
  { name: "Jigsaw Lounge", slug: "jigsaw-lounge" },
  { name: "Nonogram Glow", slug: "nonogram-glow" },
  { name: "Sokoban Warehouse", slug: "sokoban-warehouse" },
  { name: "Lights Out Lumina", slug: "lights-out-lumina" },
  { name: "Mastermind Codebreaker", slug: "mastermind-codebreaker" },
  { name: "Kakuro Grid", slug: "kakuro-grid" },
  { name: "KenKen Fusion", slug: "kenken-fusion" },
  { name: "Pattern Lock Puzzle", slug: "pattern-lock-puzzle" },
  { name: "Water Sort Neon", slug: "water-sort-neon" },
];

const cubeHub: Item[] = [
  { name: "Magic Cube 3D", slug: "magic-cube-3d" },
  { name: "Cube Solver Trainer", slug: "cube-solver-trainer" },
  { name: "Speed Cube Timer", slug: "speed-cube-timer" },
];

const wordTrivia: Item[] = [
  { name: "Word Sprint", slug: "word-sprint" },
  { name: "Typing Duel", slug: "typing-duel" },
  { name: "Trivia Blitz", slug: "trivia-blitz" },
  { name: "Word Search Premium", slug: "word-search-premium" },
  { name: "Hangman Noir", slug: "hangman-noir" },
  { name: "Crossword Daily", slug: "crossword-daily" },
  { name: "Word Connect Quest", slug: "word-connect-quest" },
  { name: "Anagram Attack", slug: "anagram-attack" },
  { name: "Letter Drop", slug: "letter-drop" },
  { name: "Category Quiz (Scattergories-style)", slug: "category-quiz" },
];

const mathBrain: Item[] = [
  { name: "Quick Math Arena", slug: "quick-math-arena" },
  { name: "Number Memory Vault", slug: "number-memory-vault" },
  { name: "Mental Math Sprint", slug: "mental-math-sprint" },
  { name: "Calculator Rush", slug: "calculator-rush" },
  { name: "Fraction Trainer", slug: "fraction-trainer" },
  { name: "Times Tables Blitz", slug: "times-tables-blitz" },
];

const boardStrategy: Item[] = [
  { name: "Join Dots (Connect Four)", slug: "join-dots-connect-four" },
  { name: "Tic-Tac-Toe Prime", slug: "tic-tac-toe-prime" },
  { name: "Checkers Royale", slug: "checkers-royale" },
  { name: "Reversi Eclipse", slug: "reversi-eclipse" },
  { name: "Chess Puzzles Daily", slug: "chess-puzzles-daily" },
  { name: "Dots & Boxes Classic", slug: "dots-and-boxes-classic" },
  { name: "Battleship Grid", slug: "battleship-grid" },
  { name: "Ludo Party", slug: "ludo-party" },
  { name: "Backgammon Classic", slug: "backgammon-classic" },
  { name: "Four-in-a-Row Blitz", slug: "four-in-a-row-blitz" },
];

const cardDice: Item[] = [
  { name: "Solitaire Classic (Klondike)", slug: "solitaire-classic-klondike" },
  { name: "Spider Solitaire Shadow", slug: "spider-solitaire-shadow" },
  { name: "FreeCell Classic", slug: "freecell-classic" },
  { name: "Pyramid Solitaire Temple", slug: "pyramid-solitaire-temple" },
  { name: "TriPeaks Trek", slug: "tripeaks-trek" },
  { name: "Hearts Club", slug: "hearts-club" },
  { name: "Spades Arena", slug: "spades-arena" },
  { name: "Dice Yacht (Yahtzee-style)", slug: "dice-yacht" },
];

const matchMerge: Item[] = [
  { name: "Match-3 Aurora", slug: "match-3-aurora" },
  { name: "Jewel Cascade", slug: "jewel-cascade" },
  { name: "Merge Garden", slug: "merge-garden" },
  { name: "Color Blocks Merge", slug: "color-blocks-merge" },
];

const rhythmReflex: Item[] = [
  { name: "Rhythm Tiles", slug: "rhythm-tiles" },
  { name: "Tap Reflex", slug: "tap-reflex" },
  { name: "Reaction Time Lab", slug: "reaction-time-lab" },
  { name: "Precision Click Arena", slug: "precision-click-arena" },
];

const mazePath: Item[] = [
  { name: "Maze Escape", slug: "maze-escape" },
  { name: "Path Finder", slug: "path-finder" },
  { name: "Labyrinth Sprint", slug: "labyrinth-sprint" },
  { name: "A* Path Challenge", slug: "a-star-path-challenge" },
];

const sportsTabletop: Item[] = [
  { name: "Mini Golf Orbit", slug: "mini-golf-orbit" },
  { name: "Air Hockey Neon", slug: "air-hockey-neon" },
  { name: "Hoop Shot Arcade", slug: "hoop-shot-arcade" },
  { name: "Penalty Kick Pro", slug: "penalty-kick-pro" },
];

const classicPuzzles: Item[] = [
  { name: "Sudoku Night", slug: "sudoku-night" },
  { name: "Minesweeper Dark", slug: "minesweeper-dark" },
];

const TOTAL =
  arcadeClassics.length +
  runnerPlatform.length +
  puzzleLogic.length +
  cubeHub.length +
  wordTrivia.length +
  mathBrain.length +
  boardStrategy.length +
  cardDice.length +
  matchMerge.length +
  rhythmReflex.length +
  mazePath.length +
  sportsTabletop.length +
  classicPuzzles.length;

export default function GamesCategory() {
  const [descExpanded, setDescExpanded] = useState(false);
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Free Games"
        description="Play free games across arcade, runners, puzzles, cubes, word & trivia, math & brain training, board & strategy, cards & dice, match‑3, rhythm & reflex, maze & pathfinding, sports & tabletop, and classic puzzles."
        canonical="https://www.smartkitnow.com/games"
        robots="index,follow"
        og={{ type: "website", url: "https://www.smartkitnow.com/games", siteName: "Smart Kit Now" }}
        twitter={{ card: "summary_large_image" }}
        extra={[{ name: "keywords", content: "free games, arcade, puzzles, word games, brain training, board games, solitaire, match-3, reflex, maze, tabletop, sudoku, minesweeper" }]}
      />
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto pb-16" style={{ maxWidth: 1200 }}>
        <div className="relative xl:flex xl:justify-center xl:gap-12">
          <div className="w-full max-w-3xl mx-auto xl:mx-0 px-4 sm:px-6 min-w-0">
            <header className="py-6 mb-8">
              <div className="flex items-center gap-3">
                <EmojiIcon symbol="🎮" size={38} className="text-primary" label="Games" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Free Games</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} games
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      Explore curated free games across arcade classics, endless runners and platformers, puzzle and logic, cube challenges, word and trivia, math and brain training, board and strategy, card and dice, match‑3 and merge, rhythm and reflex, maze and pathfinding, sports and tabletop, plus evergreen classics.
                    </p>
                    <p>
                      Each game card includes an icon, title, and an action button. The list is ready to receive dynamic data with fields like <span className="font-mono">${"{thumbnailUrl}"}</span>, <span className="font-mono">${"{title}"}</span>, <span className="font-mono">${"{description}"}</span>, and <span className="font-mono">${"{playUrl}"}</span>.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    Organized free games across arcade, puzzles, word, brain training, board, cards, match‑3, reflex, maze, tabletop, and classic formats. Clean UI, hover interactions, and responsive layout.
                  </p>
                )}
                {!descExpanded && (
                  <Button
                    type="button"
                    className="mt-2 inline-flex items-center rounded-md border px-3 py-1 text-sm text-primary hover:underline"
                    onClick={() => setDescExpanded(true)}
                    aria-expanded={descExpanded}
                    variant="ghost"
                  >
                    Read More
                  </Button>
                )}
              </div>
            </header>

            <Section
              emoji="🕹️"
              title={`Arcade Classics (${arcadeClassics.length})`}
              items={arcadeClassics}
              base="/games"
            />
            <Section
              emoji="🏃"
              title={`Endless Runner & Platform (${runnerPlatform.length})`}
              items={runnerPlatform}
              base="/games"
            />
            <Section
              emoji="🧩"
              title={`Puzzle & Logic (${puzzleLogic.length})`}
              items={puzzleLogic}
              base="/games"
            />
            <Section
              emoji="🧊"
              title={`Magic Cube (${cubeHub.length})`}
              items={cubeHub}
              base="/games"
            />
            <Section
              emoji="🔤"
              title={`Word & Trivia (${wordTrivia.length})`}
              items={wordTrivia}
              base="/games"
            />
            <Section
              emoji="🧠"
              title={`Math & Brain Training (${mathBrain.length})`}
              items={mathBrain}
              base="/games"
            />
            <Section
              emoji="♟️"
              title={`Board & Strategy (${boardStrategy.length})`}
              items={boardStrategy}
              base="/games"
            />
            <Section
              emoji="🃏"
              title={`Card & Dice (${cardDice.length})`}
              items={cardDice}
              base="/games"
            />
            <Section
              emoji="🔳"
              title={`Match‑3 & Merge (${matchMerge.length})`}
              items={matchMerge}
              base="/games"
            />
            <Section
              emoji="🎵"
              title={`Rhythm & Reflex (${rhythmReflex.length})`}
              items={rhythmReflex}
              base="/games"
            />
            <Section
              emoji="🧭"
              title={`Maze & Pathfinding (${mazePath.length})`}
              items={mazePath}
              base="/games"
            />
            <Section
              emoji="🏓"
              title={`Sports & Tabletop (${sportsTabletop.length})`}
              items={sportsTabletop}
              base="/games"
            />
            <Section
              emoji="🧮"
              title={`Classic Puzzles (${classicPuzzles.length})`}
              items={classicPuzzles}
              base="/games"
            />

            <div className="mt-14 space-y-6">
              <ShareThisPageBox />
              <SuggestionBox />
            </div>
          </div>

          <aside className="hidden xl:block w-[300px] flex-shrink-0">
            <div className="sticky" style={{ top: "var(--skn-rail-top)" }}>
              <AdSidebarRight topOffset={0} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function splitTwoColumns<T>(arr: T[]) {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

function Section({
  emoji,
  title,
  items,
  base,
}: {
  emoji: string;
  title: string;
  items: Item[];
  base: string;
}) {
  const [left, right] = splitTwoColumns(items);
  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-grid place-items-center h-8 w-8 rounded-lg border bg-card">
          <EmojiIcon symbol={emoji} size={20} />
        </span>
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
      </div>

      <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
        <ul className="list-disc ml-6 space-y-2.5">
          {left.map((it) => (
            <li key={it.slug} className="leading-relaxed">
              <Link
                to={`${base}/${it.slug}`}
                className="group inline-flex items-center justify-between w-full text-primary hover:underline text-base md:text-[1.05rem] font-medium"
              >
                <span>{it.name}</span>
                <span className="ml-3 px-2 py-0.5 rounded-md text-xs border opacity-0 group-hover:opacity-100 transition">
                  Play
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="list-disc ml-6 space-y-2.5">
          {right.map((it) => (
            <li key={it.slug} className="leading-relaxed">
              <Link
                to={`${base}/${it.slug}`}
                className="group inline-flex items-center justify-between w-full text-primary hover:underline text-base md:text-[1.05rem] font-medium"
              >
                <span>{it.name}</span>
                <span className="ml-3 px-2 py-0.5 rounded-md text-xs border opacity-0 group-hover:opacity-100 transition">
                  Play
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
