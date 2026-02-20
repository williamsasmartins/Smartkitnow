import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Trophy } from "lucide-react";

const WORDS = [
    "REACT", "APPLE", "BRAIN", "CLOUD", "DREAM", "EAGLE", "FLAME", "GHOST", "HEART", "IMAGE",
    "JUICE", "KNIFE", "LEMON", "MAGIC", "NIGHT", "OCEAN", "PEACE", "QUEEN", "RIVER", "SNAKE",
    "TRAIN", "UNION", "VOICE", "WATER", "XENON", "YACHT", "ZEBRA", "SMART", "WORLD", "LIGHT"
];

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

type LetterState = "CORRECT" | "PRESENT" | "ABSENT" | "EMPTY";

interface Guess {
    word: string;
    states: LetterState[];
}

export default function WordleUnlimitedGame() {
    const [targetWord, setTargetWord] = useState("");
    const [guesses, setGuesses] = useState<Guess[]>([]);
    const [currentGuess, setCurrentGuess] = useState("");
    const [gameStatus, setGameStatus] = useState<"PLAYING" | "WON" | "LOST">("PLAYING");

    const initGame = () => {
        const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        setTargetWord(randomWord);
        setGuesses([]);
        setCurrentGuess("");
        setGameStatus("PLAYING");
    };

    useEffect(() => {
        initGame();
    }, []);

    const evaluateGuess = (guess: string): LetterState[] => {
        const states: LetterState[] = Array(WORD_LENGTH).fill("ABSENT");
        const targetChars = targetWord.split("");
        const guessChars = guess.split("");

        // First pass: Find CORRECT letters
        guessChars.forEach((char, i) => {
            if (char === targetChars[i]) {
                states[i] = "CORRECT";
                targetChars[i] = null as any; // Mark as used
            }
        });

        // Second pass: Find PRESENT letters
        guessChars.forEach((char, i) => {
            if (states[i] !== "CORRECT" && targetChars.includes(char)) {
                states[i] = "PRESENT";
                targetChars[targetChars.indexOf(char)] = null as any; // Mark as used
            }
        });

        return states;
    };

    const handleKeyPress = (key: string) => {
        if (gameStatus !== "PLAYING") return;

        if (key === "ENTER") {
            if (currentGuess.length === WORD_LENGTH) {
                const states = evaluateGuess(currentGuess);
                const newGuess = { word: currentGuess, states };
                const newGuesses = [...guesses, newGuess];
                setGuesses(newGuesses);
                setCurrentGuess("");

                if (currentGuess === targetWord) {
                    setGameStatus("WON");
                } else if (newGuesses.length >= MAX_GUESSES) {
                    setGameStatus("LOST");
                }
            }
        } else if (key === "BACKSPACE" || key === "DELETE") {
            setCurrentGuess((prev) => prev.slice(0, -1));
        } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
            setCurrentGuess((prev) => prev + key);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            if (key === "ENTER" || key === "BACKSPACE" || key === "DELETE" || /^[A-Z]$/.test(key)) {
                handleKeyPress(key);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentGuess, gameStatus, targetWord]);

    // Keyboard layout
    const keyboardRows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
    ];

    // Helper to find letter state for keyboard coloring
    const getLetterState = (letter: string) => {
        let state: LetterState = "EMPTY";
        for (const guess of guesses) {
            for (let i = 0; i < WORD_LENGTH; i++) {
                if (guess.word[i] === letter) {
                    if (guess.states[i] === "CORRECT") return "CORRECT";
                    if (guess.states[i] === "PRESENT") state = "PRESENT";
                    if (guess.states[i] === "ABSENT" && state === "EMPTY") state = "ABSENT";
                }
            }
        }
        return state;
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 select-none touch-manipulation">
            {/* Game Header */}
            <div className="w-full flex justify-between items-center mb-6 border-b pb-4 dark:border-slate-800">
                <h2 className="text-3xl font-black tracking-widest text-slate-800 dark:text-slate-100 uppercase">Wordle</h2>
                <Button variant="ghost" size="icon" onClick={initGame} title="Restart Game">
                    <RefreshCw className="w-5 h-5 text-slate-500" />
                </Button>
            </div>

            {/* Grid */}
            <div className="flex flex-col gap-2 w-full max-w-[300px] mb-8">
                {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
                    const guess = guesses[rowIndex];
                    const isCurrentRow = rowIndex === guesses.length;

                    return (
                        <div key={rowIndex} className="grid grid-cols-5 gap-2 w-full">
                            {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                                let letter = "";
                                let state: LetterState = "EMPTY";

                                if (guess) {
                                    letter = guess.word[colIndex];
                                    state = guess.states[colIndex];
                                } else if (isCurrentRow) {
                                    letter = currentGuess[colIndex] || "";
                                }

                                // Tile Styling based on state
                                let stateClasses = "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"; // EMPTY
                                if (state === "CORRECT") stateClasses = "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20";
                                if (state === "PRESENT") stateClasses = "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20";
                                if (state === "ABSENT") stateClasses = "bg-slate-500 border-slate-500 text-white dark:bg-slate-700 dark:border-slate-700";

                                const isPopulated = letter !== "" && state === "EMPTY";

                                return (
                                    <div
                                        key={colIndex}
                                        className={`
                      aspect-square flex items-center justify-center text-2xl sm:text-3xl font-bold uppercase transition-all duration-300
                      ${state === "EMPTY" ? 'border-2' : 'border-0'} 
                      ${isPopulated ? 'border-slate-400 dark:border-slate-500 scale-[1.02]' : ''}
                      ${stateClasses} rounded-lg
                    `}
                                    >
                                        {letter}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Game Status Overlay / Message */}
            {gameStatus !== "PLAYING" && (
                <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 z-10 w-11/12 max-w-sm text-center shadow-2xl animate-in zoom-in duration-300 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
                    <Trophy className={`w-16 h-16 mx-auto mb-4 ${gameStatus === "WON" ? "text-emerald-500" : "text-slate-400"}`} />
                    <h3 className="text-3xl font-black mb-2 uppercase tracking-wide">
                        {gameStatus === "WON" ? "You Won!" : "Game Over"}
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 font-medium">
                        The word was <strong className="text-slate-900 dark:text-white">{targetWord}</strong>.
                    </p>
                    <Button onClick={initGame} className="w-full h-12 text-lg font-bold gap-2">
                        <RefreshCw className="w-5 h-5" /> Play Again
                    </Button>
                </Card>
            )}

            {/* On-screen Keyboard (Mobile friendly) */}
            <div className="w-full max-w-[500px] flex flex-col gap-2 mt-auto">
                {keyboardRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-1 sm:gap-2">
                        {row.map((key) => {
                            const state = getLetterState(key);
                            let keyBg = "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100";
                            if (state === "CORRECT") keyBg = "bg-emerald-500 text-white";
                            if (state === "PRESENT") keyBg = "bg-amber-500 text-white";
                            if (state === "ABSENT") keyBg = "bg-slate-800 text-white dark:bg-slate-900";

                            const isSpecial = key === "ENTER" || key === "BACKSPACE";

                            return (
                                <button
                                    key={key}
                                    onClick={() => handleKeyPress(key)}
                                    className={`
                    flex-1 flex items-center justify-center font-bold rounded-md shadow-sm active:scale-95 transition-all outline-none
                    ${isSpecial ? "text-xs sm:text-sm px-2 min-w-[3.5rem] sm:min-w-[4.5rem]" : "text-sm sm:text-lg min-w-[2rem] sm:min-w-[2.5rem]"}
                    h-12 sm:h-14 ${keyBg}
                  `}
                                >
                                    {key === "BACKSPACE" ? "DEL" : key}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
