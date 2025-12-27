import React from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Play, Settings2 } from "lucide-react";
import StartOverlay from "./StartOverlay";

type Difficulty = "easy" | "medium" | "hard";

interface GameStartOverlayProps {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  onStart: (difficulty: Difficulty) => void;
  onRestart: (difficulty: Difficulty) => void;
  gameName?: string;
}

export default function GameStartOverlay({
  isPlaying,
  isGameOver,
  score,
  highScore,
  onStart,
  onRestart,
  gameName = "Game",
}: GameStartOverlayProps) {
  // If playing and not game over, don't show anything (game is running)
  if (isPlaying && !isGameOver) return null;

  return (
    <StartOverlay
      open={!isPlaying || isGameOver}
      onClose={() => {}} // Controlled by buttons
      title={isGameOver ? "Game Over" : gameName}
      description={isGameOver ? `Final Score: ${score}` : "Select difficulty to start"}
      hideFooterClose={true}
    >
      <div className="flex flex-col gap-4 w-full">
        {isGameOver && (
          <div className="flex items-center justify-center gap-2 text-yellow-600 font-bold text-lg mb-2">
            <Trophy className="h-5 w-5" />
            <span>High Score: {highScore}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => (isGameOver ? onRestart("easy") : onStart("easy"))}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-6 text-lg"
          >
            Easy
          </Button>
          <Button
            onClick={() => (isGameOver ? onRestart("medium") : onStart("medium"))}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 text-lg"
          >
            Medium
          </Button>
          <Button
            onClick={() => (isGameOver ? onRestart("hard") : onStart("hard"))}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-6 text-lg"
          >
            Hard
          </Button>
        </div>
      </div>
    </StartOverlay>
  );
}
