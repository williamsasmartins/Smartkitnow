import React, { useState, useEffect, useCallback, useRef } from "react";
import CalculatorVerticalLayout from "../templates/CalculatorVerticalLayout";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────
type PadId = 0 | 1 | 2 | 3;
type GameState = "IDLE" | "WATCHING" | "INPUT" | "GAME_OVER";
type Difficulty = "easy" | "normal" | "hard";

interface PadConfig {
  id: PadId;
  label: string;
  color: string;
  activeColor: string;
  freq: number;
  position: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PADS: PadConfig[] = [
  { id: 0, label: "Red",    color: "#c0392b", activeColor: "#ff6b6b", freq: 329, position: "top-left" },
  { id: 1, label: "Blue",   color: "#2980b9", activeColor: "#74b9ff", freq: 415, position: "top-right" },
  { id: 2, label: "Green",  color: "#27ae60", activeColor: "#55efc4", freq: 261, position: "bottom-left" },
  { id: 3, label: "Yellow", color: "#f39c12", activeColor: "#fdcb6e", freq: 369, position: "bottom-right" },
];

const DIFFICULTY_SPEEDS: Record<Difficulty, number> = {
  easy: 600,
  normal: 400,
  hard: 250,
};

const HIGH_SCORE_KEY = "simon-says-hs";

// ─── Audio ────────────────────────────────────────────────────────────────────
function playTone(freq: number, duration = 300, audioCtx: AudioContext) {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.frequency.value = freq;
  oscillator.type = "sine";
  gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration / 1000);
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration / 1000);
}

function playErrorTone(audioCtx: AudioContext) {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.frequency.value = 110;
  oscillator.type = "sawtooth";
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.6);
}

// ─── Simon Board (Inner Component) ────────────────────────────────────────────
function SimonBoard() {
  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [sequence, setSequence] = useState<PadId[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [activePad, setActivePad] = useState<PadId | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try { return parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? "0", 10) || 0; }
    catch { return 0; }
  });
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [statusMsg, setStatusMsg] = useState("Press Start to play");
  const [isFlashing, setIsFlashing] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sequenceTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function getAudioCtx(): AudioContext {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }

  function clearAllTimers() {
    sequenceTimersRef.current.forEach(t => clearTimeout(t));
    sequenceTimersRef.current = [];
  }

  const flashPad = useCallback((padId: PadId, duration: number) => {
    setActivePad(padId);
    const ctx = getAudioCtx();
    playTone(PADS[padId].freq, duration - 50, ctx);
    const t = setTimeout(() => setActivePad(null), duration - 80);
    sequenceTimersRef.current.push(t);
  }, []);

  const playSequence = useCallback((seq: PadId[], speed: number) => {
    clearAllTimers();
    setIsFlashing(true);
    setGameState("WATCHING");
    setStatusMsg("Watch the sequence...");

    seq.forEach((padId, i) => {
      const t = setTimeout(() => {
        flashPad(padId, speed - 50);
        if (i === seq.length - 1) {
          const t2 = setTimeout(() => {
            setIsFlashing(false);
            setGameState("INPUT");
            setStatusMsg(`Your turn! (${seq.length} step${seq.length > 1 ? "s" : ""})`);
          }, speed);
          sequenceTimersRef.current.push(t2);
        }
      }, i * speed);
      sequenceTimersRef.current.push(t);
    });
  }, [flashPad]);

  const startGame = () => {
    clearAllTimers();
    const firstPad = Math.floor(Math.random() * 4) as PadId;
    const newSeq: PadId[] = [firstPad];
    setSequence(newSeq);
    setPlayerIndex(0);
    setScore(0);
    setGameState("WATCHING");

    let speed = DIFFICULTY_SPEEDS[difficulty];
    setTimeout(() => playSequence(newSeq, speed), 500);
  };

  const handlePadClick = (padId: PadId) => {
    if (gameState !== "INPUT" || isFlashing) return;

    const ctx = getAudioCtx();
    playTone(PADS[padId].freq, 300, ctx);
    setActivePad(padId);
    setTimeout(() => setActivePad(null), 300);

    const expected = sequence[playerIndex];

    if (padId !== expected) {
      // Wrong!
      playErrorTone(ctx);
      setGameState("GAME_OVER");
      const finalScore = score;
      setStatusMsg(`Wrong! Game over. You reached level ${finalScore}`);
      setHighScore(prev => {
        const newHs = Math.max(prev, finalScore);
        try { localStorage.setItem(HIGH_SCORE_KEY, String(newHs)); } catch {}
        return newHs;
      });
      return;
    }

    const nextIndex = playerIndex + 1;

    if (nextIndex === sequence.length) {
      // Completed sequence!
      const newScore = score + 1;
      setScore(newScore);
      setPlayerIndex(0);
      setStatusMsg("Correct! Get ready...");
      setGameState("WATCHING");

      // Speed up at certain levels
      let speed = DIFFICULTY_SPEEDS[difficulty];
      if (newScore >= 15) speed = Math.floor(speed * 0.6);
      else if (newScore >= 10) speed = Math.floor(speed * 0.75);
      else if (newScore >= 5) speed = Math.floor(speed * 0.875);

      const newPad = Math.floor(Math.random() * 4) as PadId;
      const newSeq = [...sequence, newPad];
      setSequence(newSeq);

      setTimeout(() => {
        playSequence(newSeq, speed);
      }, 1000);
    } else {
      setPlayerIndex(nextIndex);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
      audioCtxRef.current?.close();
    };
  }, []);

  const PAD_SIZE = 140;

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Score bar */}
      <div className="flex gap-4 w-full max-w-[320px] justify-between">
        <div className="flex-1 bg-slate-800 dark:bg-slate-900 rounded-xl p-3 text-center border border-slate-700">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Level</div>
          <div className="text-2xl font-extrabold text-white">{score}</div>
        </div>
        <div className="flex-1 bg-slate-800 dark:bg-slate-900 rounded-xl p-3 text-center border border-slate-700">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Best</div>
          <div className="text-2xl font-extrabold text-yellow-400">{highScore}</div>
        </div>
      </div>

      {/* Difficulty selector */}
      <div className="flex gap-2">
        {(["easy", "normal", "hard"] as Difficulty[]).map(d => (
          <button
            key={d}
            disabled={gameState !== "IDLE" && gameState !== "GAME_OVER"}
            onClick={() => setDifficulty(d)}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
              difficulty === d
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Simon pads */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `${PAD_SIZE}px ${PAD_SIZE}px`,
          gridTemplateRows: `${PAD_SIZE}px ${PAD_SIZE}px`,
          gap: 8,
          borderRadius: "50%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {PADS.map(pad => {
          const isActive = activePad === pad.id;
          return (
            <button
              key={pad.id}
              onPointerDown={() => handlePadClick(pad.id)}
              disabled={gameState !== "INPUT" || isFlashing}
              style={{
                width: PAD_SIZE,
                height: PAD_SIZE,
                backgroundColor: isActive ? pad.activeColor : pad.color,
                border: "none",
                cursor: gameState === "INPUT" && !isFlashing ? "pointer" : "default",
                transition: "background-color 0.1s, box-shadow 0.1s",
                boxShadow: isActive ? `0 0 30px ${pad.activeColor}` : "none",
                borderRadius:
                  pad.position === "top-left" ? "50% 0 0 0" :
                  pad.position === "top-right" ? "0 50% 0 0" :
                  pad.position === "bottom-left" ? "0 0 0 50%" : "0 0 50% 0",
              }}
              aria-label={pad.label}
            />
          );
        })}

        {/* Center circle */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 80,
            height: 80,
            backgroundColor: "#1a1a2e",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "3px solid #333",
            zIndex: 10,
          }}
        >
          <span style={{ color: "#fff", fontSize: "0.65rem", fontWeight: 700, textAlign: "center" }}>
            SIMON
          </span>
        </div>
      </div>

      {/* Status message */}
      <div className="text-center min-h-[2rem]">
        <p className={`text-sm font-semibold ${
          gameState === "GAME_OVER" ? "text-red-400" :
          gameState === "INPUT" ? "text-green-400" :
          gameState === "WATCHING" ? "text-yellow-400" :
          "text-slate-400"
        }`}>
          {statusMsg}
        </p>
      </div>

      {/* Start / Restart button */}
      {(gameState === "IDLE" || gameState === "GAME_OVER") && (
        <button
          onClick={startGame}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-lg transition-colors shadow-lg"
        >
          {gameState === "GAME_OVER" ? "Play Again" : "Start Game"}
        </button>
      )}
    </div>
  );
}

// ─── Exported Page Component ───────────────────────────────────────────────────
export default function SimonSaysGame({
  title = "Simon Says",
  description = "Test your memory with the classic Simon Says electronic game. Watch the sequence and repeat it perfectly!",
}: {
  title?: string;
  description?: string;
}) {
  const editorial = (
    <div className="space-y-12">
      <section id="guide">
        <h2 className="text-2xl font-bold">How to Play Simon Says</h2>
        <p>
          Simon Says is a classic electronic memory game. The device plays a sequence of colored
          light flashes accompanied by tones, and you must repeat the sequence exactly.
        </p>
        <ol className="list-decimal pl-6 mt-4 space-y-2">
          <li>Press <strong>Start Game</strong> to begin. The game will flash one colored pad.</li>
          <li>After the sequence plays, it's your turn — click the pads <strong>in the same order</strong>.</li>
          <li>Each round, one new step is added to the sequence.</li>
          <li>Miss a step and the game is over. Try to beat your high score!</li>
        </ol>
        <p className="mt-4">
          The game supports three <strong>difficulty levels</strong>: Easy (slower flashes), Normal,
          and Hard (very fast). The speed also <strong>increases automatically</strong> as you progress
          to levels 5, 10, and 15.
        </p>
      </section>

      <section id="tips">
        <h2 className="text-2xl font-bold">Tips &amp; Strategies</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Use colors AND sounds:</strong> Each pad has a unique tone. Listening helps you
            remember the sequence even when the flashes go very fast.
          </li>
          <li>
            <strong>Chunk the sequence:</strong> Break long sequences into groups of 3-4. For
            example: Red-Blue-Green | Yellow-Red | Blue-Blue.
          </li>
          <li>
            <strong>Say it aloud:</strong> Quietly narrating the colors as they flash ("red, blue,
            green...") engages verbal memory, making the sequence easier to retain.
          </li>
          <li>
            <strong>Start on Easy:</strong> Get a feel for the game on Easy mode before jumping to
            Hard. The pattern of thinking is the same, but you have more time.
          </li>
          <li>
            <strong>Don't rush:</strong> During the INPUT phase, there is no time limit. Take a
            breath and recall the sequence deliberately.
          </li>
        </ul>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Does it use real sounds?</h3>
            <p>
              Yes! This game uses the Web Audio API to generate real tones — Red (329 Hz),
              Blue (415 Hz), Green (261 Hz), and Yellow (369 Hz) — matching the classic
              Simon device.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Does the sequence speed change?</h3>
            <p>
              Yes. The sequence automatically speeds up at levels 5, 10, and 15. On Hard
              difficulty, the speed at level 15+ is very challenging.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Is my high score saved?</h3>
            <p>Your high score is saved in the browser's localStorage and persists between sessions.</p>
          </div>
          <div>
            <h3 className="font-semibold">Can I play on mobile?</h3>
            <p>
              Yes! Each pad is at least 140×140px, making it comfortable to tap on touchscreens.
              The game uses pointer events for cross-device compatibility.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={<SimonBoard />}
      editorial={editorial}
      onThisPage={[
        { id: "guide", label: "How to Play" },
        { id: "tips", label: "Tips & Strategies" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
