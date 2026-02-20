import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Play, Pause, Zap } from "lucide-react";
import confetti from "canvas-confetti";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

// 9x9 grid
const GRID_SIZE = 9;

function generateEmptyBoard() {
    return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
}

// Simple validator for a row, col, box
function isValid(board: number[][], row: number, col: number, num: number) {
    for (let x = 0; x < GRID_SIZE; x++) {
        if (board[row][x] === num) return false;
    }
    for (let x = 0; x < GRID_SIZE; x++) {
        if (board[x][col] === num) return false;
    }
    let startRow = row - (row % 3), startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) return false;
        }
    }
    return true;
}

// Very basic Sudoku generator
function generateSudoku(emptyCount: number) {
    let board = generateEmptyBoard();

    function fillDiagonal() {
        for (let i = 0; i < 9; i = i + 3) fillBox(i, i);
    }

    function fillBox(rowStart: number, colStart: number) {
        let num;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                do {
                    num = Math.floor(Math.random() * 9) + 1;
                } while (!isSafeForBox(rowStart, colStart, num));
                board[rowStart + i][colStart + j] = num;
            }
        }
    }

    function isSafeForBox(rowStart: number, colStart: number, num: number) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[rowStart + i][colStart + j] === num) return false;
            }
        }
        return true;
    }

    function fillRemaining(i: number, j: number): boolean {
        if (j >= 9 && i < 8) {
            i = i + 1;
            j = 0;
        }
        if (i >= 9 && j >= 9) return true;
        if (i < 3) {
            if (j < 3) j = 3;
        } else if (i < 6) {
            if (j === Math.floor(i / 3) * 3) j = j + 3;
        } else {
            if (j === 6) {
                i = i + 1;
                j = 0;
                if (i >= 9) return true;
            }
        }
        for (let num = 1; num <= 9; num++) {
            if (isValid(board, i, j, num)) {
                board[i][j] = num;
                if (fillRemaining(i, j + 1)) return true;
                board[i][j] = 0;
            }
        }
        return false;
    }

    fillDiagonal();
    fillRemaining(0, 3);

    // Clone complete board
    const solution = board.map(row => [...row]);

    // Remove elements
    for (let i = 0; i < emptyCount; i++) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        while (board[row][col] === 0) {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        }
        board[row][col] = 0;
    }

    return { puzzle: board, solution };
}

export default function SudokuZenGame() {
    const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
    const [board, setBoard] = useState<number[][]>(generateEmptyBoard());
    const [initialBoard, setInitialBoard] = useState<number[][]>(generateEmptyBoard());
    const [solutionBoard, setSolutionBoard] = useState<number[][]>(generateEmptyBoard());
    const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isWon, setIsWon] = useState(false);

    // Time state
    const [time, setTime] = useState(0);

    useEffect(() => {
        let timer: any = null;
        if (isPlaying && !isWon) {
            timer = setInterval(() => setTime((t) => t + 1), 1000);
        }
        return () => clearInterval(timer);
    }, [isPlaying, isWon]);

    const startNewGame = (diff = difficulty) => {
        const emptyCount = diff === "EASY" ? 20 : diff === "MEDIUM" ? 40 : 55;
        const { puzzle, solution } = generateSudoku(emptyCount);
        setBoard(puzzle.map(row => [...row]));
        setInitialBoard(puzzle.map(row => [...row]));
        setSolutionBoard(solution);
        setSelectedCell(null);
        setIsPlaying(true);
        setIsWon(false);
        setTime(0);
        setDifficulty(diff);
    };

    const handleCellClick = (r: number, c: number) => {
        if (!isPlaying || isWon) return;
        setSelectedCell([r, c]);
    };

    const handleNumberInput = (num: number) => {
        if (!isPlaying || !selectedCell || isWon) return;
        const [r, c] = selectedCell;

        if (initialBoard[r][c] !== 0) return; // Cannot overwrite initial numbers

        const newBoard = board.map(row => [...row]);
        newBoard[r][c] = num;
        setBoard(newBoard);

        // Check win condition
        const isComplete = newBoard.every(row => row.every(cell => cell !== 0));
        if (isComplete) {
            const isValidBoard = newBoard.every((row, i) => row.every((val, j) => val === solutionBoard[i][j]));
            if (isValidBoard) {
                setIsWon(true);
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 }
                });
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key >= '1' && e.key <= '9') {
                handleNumberInput(parseInt(e.key));
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                handleNumberInput(0);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedCell, isPlaying, isWon, board]);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-2 sm:p-4 min-h-[500px]">
            {!isPlaying ? (
                <Card className="p-8 w-full max-w-sm flex flex-col items-center text-center shadow-lg border-2">
                    <Zap className="w-16 h-16 text-indigo-500 mb-4 animate-pulse" />
                    <h2 className="text-3xl font-black mb-2 text-slate-800 dark:text-slate-100">Sudoku Zen</h2>
                    <p className="text-slate-500 mb-8 font-medium">Clear your mind. Solve the grid.</p>

                    <div className="w-full flex flex-col gap-3">
                        <Button size="lg" onClick={() => startNewGame("EASY")} className="bg-emerald-500 hover:bg-emerald-600">Easy</Button>
                        <Button size="lg" onClick={() => startNewGame("MEDIUM")} className="bg-amber-500 hover:bg-amber-600">Medium</Button>
                        <Button size="lg" onClick={() => startNewGame("HARD")} className="bg-rose-500 hover:bg-rose-600">Hard</Button>
                    </div>
                </Card>
            ) : (
                <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
                    {/* Header */}
                    <div className="flex w-full items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-bold font-mono tracking-widest">{Math.floor(time / 60).toString().padStart(2, '0')}:{(time % 60).toString().padStart(2, '0')}</span>
                            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1">{difficulty}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsPlaying(false)}>
                            <Pause className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Board */}
                    <Card className="p-1 sm:p-2 bg-slate-200 dark:bg-slate-800 drop-shadow-xl relative w-full aspect-square max-h-[500px]">
                        {isWon && (
                            <div className="absolute inset-0 z-10 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl p-4 text-center">
                                <h3 className="text-4xl font-black text-emerald-600 mb-4 tracking-tight">Completed!</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">You solved the {difficulty} puzzle in {Math.floor(time / 60)}m {time % 60}s.</p>
                                <Button onClick={() => setIsPlaying(false)} className="gap-2">
                                    <RefreshCw className="w-4 h-4" /> Next Puzzle
                                </Button>
                            </div>
                        )}

                        <div className="grid grid-cols-9 h-full w-full border-4 border-slate-800 dark:border-slate-200 rounded-lg overflow-hidden gap-[1px] bg-slate-800 dark:bg-slate-200">
                            {board.map((row, r) => (
                                row.map((cell, c) => {
                                    const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                                    const isGiven = initialBoard[r][c] !== 0;
                                    const isError = !isGiven && cell !== 0 && cell !== solutionBoard[r][c];
                                    // Same number highlighting
                                    const isSameNumber = cell !== 0 && selectedCell && board[selectedCell[0]][selectedCell[1]] === cell;

                                    const rightBorder = (c % 3 === 2 && c !== 8) ? "border-r-2 border-r-slate-800 dark:border-r-slate-200" : "";
                                    const bottomBorder = (r % 3 === 2 && r !== 8) ? "border-b-2 border-b-slate-800 dark:border-b-slate-200" : "";

                                    return (
                                        <div
                                            key={`${r}-${c}`}
                                            onClick={() => handleCellClick(r, c)}
                                            className={`
                          flex items-center justify-center text-lg sm:text-2xl font-semibold cursor-pointer select-none transition-colors
                          ${rightBorder} ${bottomBorder}
                          ${isSelected ? "bg-indigo-200 dark:bg-indigo-900" : isSameNumber ? "bg-indigo-100 dark:bg-indigo-950/50" : "bg-white dark:bg-slate-900"}
                          ${isGiven ? "text-slate-800 dark:text-slate-100 font-black" : "text-indigo-600 dark:text-indigo-400"}
                          ${isError ? "text-rose-500 bg-rose-50 dark:bg-rose-950/30" : ""}
                          hover:bg-slate-50 dark:hover:bg-slate-800
                        `}
                                        >
                                            {cell !== 0 ? cell : ""}
                                        </div>
                                    )
                                })
                            ))}
                        </div>
                    </Card>

                    {/* Number Pad for Mobile */}
                    <div className="grid grid-cols-5 gap-2 w-full mt-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <Button
                                key={num}
                                variant="outline"
                                className="h-12 text-xl font-bold rounded-xl active:scale-95 border-2 shadow-sm"
                                onClick={() => handleNumberInput(num)}
                            >
                                {num}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            className="h-12 text-sm font-bold rounded-xl text-rose-500 active:scale-95 border-2 col-start-5 border-rose-200"
                            onClick={() => handleNumberInput(0)}
                        >
                            DEL
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
