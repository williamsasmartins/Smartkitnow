import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Trophy, User, Bot, Swords } from "lucide-react";
import confetti from "canvas-confetti";

type Player = "X" | "O";
type SquareValue = Player | null;
type GameMode = "PVP" | "PVC"; // Player vs Player, Player vs Computer

export default function TicTacToePrime() {
    const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState<Player | "Draw" | null>(null);
    const [scores, setScores] = useState({ X: 0, O: 0 });
    const [gameMode, setGameMode] = useState<GameMode>("PVC");

    const currentPlayer = isXNext ? "X" : "O";

    const checkWinner = (squares: SquareValue[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const [a, b, c] of lines) {
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return { winner: squares[a], line: [a, b, c] };
            }
        }
        return squares.every(Boolean) ? { winner: "Draw", line: null } : null;
    };

    const handleClick = (index: number) => {
        if (board[index] || winner || (gameMode === "PVC" && !isXNext)) return;

        makeMove(index, "X");
    };

    const makeMove = (index: number, player: Player) => {
        const newBoard = [...board];
        newBoard[index] = player;
        setBoard(newBoard);

        const gameResult = checkWinner(newBoard);
        if (gameResult) {
            setWinner(gameResult.winner as Player | "Draw");
            if (gameResult.winner !== "Draw") {
                setScores(prev => ({ ...prev, [gameResult.winner as Player]: prev[gameResult.winner as Player] + 1 }));
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        } else {
            setIsXNext(player !== "X");
        }
    };

    // Computer Move Logic (Minimax or Random for simplicity; we'll use a basic logic to block/win or random)
    useEffect(() => {
        if (gameMode === "PVC" && !isXNext && !winner) {
            const timer = setTimeout(() => {
                const availableMoves = board.map((val, idx) => val === null ? idx : -1).filter(idx => idx !== -1);

                // Simple AI: 1. Try to win, 2. Try to block, 3. Random
                let moveIndex = -1;

                // Check for win or block
                for (const player of ["O", "X"] as Player[]) {
                    for (const i of availableMoves) {
                        const testBoard = [...board];
                        testBoard[i] = player;
                        const res = checkWinner(testBoard);
                        if (res && res.winner === player) {
                            moveIndex = i;
                            break;
                        }
                    }
                    if (moveIndex !== -1) break;
                }

                // Center strategy
                if (moveIndex === -1 && availableMoves.includes(4)) {
                    moveIndex = 4;
                }

                // Random move
                if (moveIndex === -1) {
                    moveIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                }

                if (moveIndex !== -1) {
                    makeMove(moveIndex, "O");
                }
            }, 500); // Small delay to feel natural
            return () => clearTimeout(timer);
        }
    }, [isXNext, gameMode, winner, board]);

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setWinner(null);
        setIsXNext(true);
    };

    const resetScores = () => {
        setScores({ X: 0, O: 0 });
        resetGame();
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4 sm:p-6 lg:p-8">
            {/* Mode Selection */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-6">
                <Button
                    variant={gameMode === "PVC" ? "default" : "ghost"}
                    className="flex-1 rounded-lg gap-2 text-sm h-9 px-4 transition-all"
                    onClick={() => { setGameMode("PVC"); resetScores(); }}
                >
                    <Bot className="w-4 h-4" /> 1 Player
                </Button>
                <Button
                    variant={gameMode === "PVP" ? "default" : "ghost"}
                    className="flex-1 rounded-lg gap-2 text-sm h-9 px-4 transition-all"
                    onClick={() => { setGameMode("PVP"); resetScores(); }}
                >
                    <Swords className="w-4 h-4" /> 2 Players
                </Button>
            </div>

            {/* Scoreboard */}
            <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <Card className={`p-4 flex gap-4 items-center justify-center border-2 transition-all ${currentPlayer === 'X' && !winner ? 'border-pink-500 bg-pink-500/5 shadow-md shadow-pink-500/20' : 'border-slate-200 dark:border-slate-800'}`}>
                    <div className="text-center">
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                            <User className="w-3 h-3" /> Player X
                        </p>
                        <p className="text-4xl font-black text-pink-600 dark:text-pink-400 mt-1">{scores.X}</p>
                    </div>
                </Card>
                <Card className={`p-4 flex gap-4 items-center justify-center border-2 transition-all ${currentPlayer === 'O' && !winner ? 'border-cyan-500 bg-cyan-500/5 shadow-md shadow-cyan-500/20' : 'border-slate-200 dark:border-slate-800'}`}>
                    <div className="text-center">
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                            {gameMode === "PVC" ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                            {gameMode === "PVC" ? "CPU O" : "Player O"}
                        </p>
                        <p className="text-4xl font-black text-cyan-600 dark:text-cyan-400 mt-1">{scores.O}</p>
                    </div>
                </Card>
            </div>

            {/* Game Board */}
            <div className="relative w-full aspect-square max-w-[320px]">
                <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 bg-slate-200 dark:bg-slate-800 rounded-3xl h-full w-full shadow-inner">
                    {board.map((value, i) => (
                        <button
                            key={i}
                            onClick={() => handleClick(i)}
                            disabled={!!value || !!winner || (gameMode === "PVC" && !isXNext)}
                            className={`
                                rounded-2xl text-6xl sm:text-7xl font-black transition-all duration-300
                                flex items-center justify-center shadow-sm 
                                ${!value ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 hover:scale-105 active:scale-95 dark:hover:bg-slate-700' : ''}
                                ${value === 'X' ? 'bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40 text-pink-500 dark:text-pink-400 border-2 border-pink-200 dark:border-pink-900/50' : ''}
                                ${value === 'O' ? 'bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-900/40 dark:to-blue-900/40 text-cyan-500 dark:text-cyan-400 border-2 border-cyan-200 dark:border-cyan-900/50' : ''}
                            `}
                        >
                            <span className={value ? "animate-in zoom-in duration-300 drop-shadow-sm" : ""}>{value}</span>
                        </button>
                    ))}
                </div>

                {/* Winner Overlay */}
                {winner && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center animate-in zoom-in duration-300 z-10 p-6 text-center border shadow-xl">
                        <Trophy className={`w-16 h-16 mb-4 animate-bounce ${winner === "X" ? "text-pink-500" : winner === "O" ? "text-cyan-500" : "text-yellow-500"}`} />
                        <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
                            {winner === "Draw" ? "Draw!" : `${winner} Wins!`}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
                            {winner === "Draw" ? "It was a tie." : gameMode === "PVC" && winner === "O" ? "The AI beat you this time!" : "Great job!"}
                        </p>
                        <Button size="lg" onClick={resetGame} className="w-full gap-2 rounded-xl h-12 text-lg">
                            <RefreshCw className="w-5 h-5" /> Play Again
                        </Button>
                    </div>
                )}
            </div>

            {/* Footer Controls */}
            <div className="mt-8 flex gap-4 w-full max-w-[320px]">
                <Button variant="outline" onClick={resetGame} className="flex-1 rounded-xl h-12 font-medium">
                    <RefreshCw className="w-4 h-4 mr-2" /> Reset Game
                </Button>
            </div>
        </div>
    );
}
