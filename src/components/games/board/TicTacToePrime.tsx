import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

type Player = "X" | "O";
type SquareValue = Player | null;

export default function TicTacToePrime() {
    const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState<Player | "Draw" | null>(null);
    const [scores, setScores] = useState({ X: 0, O: 0 });

    const currentPlayer = isXNext ? "X" : "O";

    const checkWinner = (squares: SquareValue[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const [a, b, c] of lines) {
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return squares.every(Boolean) ? "Draw" : null;
    };

    const handleClick = (index: number) => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        const gameResult = checkWinner(newBoard);
        if (gameResult) {
            setWinner(gameResult as Player | "Draw");
            if (gameResult !== "Draw") {
                setScores(prev => ({ ...prev, [gameResult as Player]: prev[gameResult as Player] + 1 }));
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        } else {
            setIsXNext(!isXNext);
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setIsXNext(true);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4">
            {/* Scoreboard */}
            <div className="grid grid-cols-2 gap-4 w-full mb-6">
                <Card className={`p-4 text-center border-2 transition-all ${currentPlayer === 'X' && !winner ? 'border-pink-500 bg-pink-500/10' : 'border-slate-200 dark:border-slate-800'}`}>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Player X</p>
                    <p className="text-3xl font-black text-pink-600 dark:text-pink-400">{scores.X}</p>
                </Card>
                <Card className={`p-4 text-center border-2 transition-all ${currentPlayer === 'O' && !winner ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-200 dark:border-slate-800'}`}>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Player O</p>
                    <p className="text-3xl font-black text-cyan-600 dark:text-cyan-400">{scores.O}</p>
                </Card>
            </div>

            {/* Game Board */}
            <div className="relative">
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl">
                    {board.map((value, i) => (
                        <button
                            key={i}
                            onClick={() => handleClick(i)}
                            disabled={!!value || !!winner}
                            className={`
                h-24 w-24 sm:h-28 sm:w-28 rounded-xl text-5xl sm:text-6xl font-black transition-all duration-200
                flex items-center justify-center shadow-sm hover:shadow-md
                ${!value ? 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700' : ''}
                ${value === 'X' ? 'bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 text-pink-600 dark:text-pink-400' : ''}
                ${value === 'O' ? 'bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20 text-cyan-600 dark:text-cyan-400' : ''}
              `}
                        >
                            <span className={value ? "animate-in zoom-in duration-300" : ""}>{value}</span>
                        </button>
                    ))}
                </div>

                {/* Winner Overlay */}
                {winner && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                        <Trophy className="w-12 h-12 text-yellow-500 mb-4 animate-bounce" />
                        <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
                            {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
                        </h3>
                        <Button size="lg" onClick={resetGame} className="mt-4 gap-2">
                            <RefreshCw className="w-4 h-4" /> Play Again
                        </Button>
                    </div>
                )}
            </div>

            {/* Footer Controls */}
            <div className="mt-8 flex gap-4">
                <Button variant="ghost" size="sm" onClick={resetGame} className="text-slate-500">
                    <RefreshCw className="w-4 h-4 mr-2" /> Reset Board
                </Button>
            </div>
        </div>
    );
}
