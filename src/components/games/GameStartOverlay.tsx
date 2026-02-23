import React from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Play, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";

type Difficulty = "easy" | "medium" | "hard";

interface GameStartOverlayProps {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  onStart: (difficulty: Difficulty) => void;
  onRestart: (difficulty: Difficulty) => void;
  gameName?: string;
  pointsMap?: { easy: number; medium: number; hard: number };
}

export default function GameStartOverlay({
  isPlaying,
  isGameOver,
  score,
  highScore,
  onStart,
  onRestart,
  gameName = "Game",
  pointsMap,
}: GameStartOverlayProps) {
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<Difficulty>("medium");

  const diffCardClass = (d: Difficulty, selected: boolean) => {
    const base =
      "text-left p-4 rounded-xl border transition select-none focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950";
    const palette =
      d === "easy"
        ? "border-green-500/30 bg-green-500/10 hover:bg-green-500/15"
        : d === "medium"
          ? "border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/15"
          : "border-red-500/30 bg-red-500/10 hover:bg-red-500/15";

    const ring =
      d === "easy"
        ? "ring-green-500/40"
        : d === "medium"
          ? "ring-yellow-500/40"
          : "ring-red-500/40";

    return [base, palette, selected ? `ring-2 ${ring}` : ""].join(" ");
  };

  const handleAction = () => {
    if (isGameOver) onRestart(selectedDifficulty);
    else onStart(selectedDifficulty);
  };

  if (isPlaying && !isGameOver) return null;

  return (
    <div className="w-full mx-auto mb-2 max-w-[760px] animate-in fade-in duration-300">
      <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isGameOver ? "Game Over" : gameName}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Choose difficulty, then start.
              </div>
            </div>

            {isGameOver && (
              <div className="flex items-center gap-2 text-yellow-600 font-bold text-sm bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                <Trophy className="h-4 w-4" />
                <span>High: {highScore}</span>
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
              const selected = d === selectedDifficulty;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDifficulty(d)}
                  className={diffCardClass(d, selected)}
                  aria-pressed={selected}
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                    {d}
                  </div>
                  {pointsMap && (
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Multiplier: {pointsMap[d]}x
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-1">
            <Button className="flex-1 h-9 text-sm" onClick={handleAction}>
              {<Play className="h-3.5 w-3.5 mr-2" />}
              {isGameOver ? "Play again" : "Start game"}
            </Button>
          </div>

          {isGameOver && (
            <div className="text-xs text-center text-slate-700 dark:text-slate-300">
              Final Score: <strong>{score}</strong>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
