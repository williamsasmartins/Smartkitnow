import React, { useState, useEffect, useRef, useCallback } from "react";
import { Gamepad2, Maximize2, Minimize2 } from "lucide-react";
import GameStartOverlay from "./GameStartOverlay";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const SPEED = 5;

type GameState = "MENU" | "PLAYING" | "GAME_OVER";

export default function PacRunnerGame({
    title = "Pac-Runner",
    description = "Collect dots and avoid ghosts in this endless runner!",
}: {
    title?: string;
    description?: string;
}) {
    const { theme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [gameState, setGameState] = useState<GameState>("MENU");
    const [score, setScore] = useState(0);

    // Refs
    const playerRef = useRef({ x: 100, y: 300, vy: 0, radius: 20, mouthOpen: 0 });
    const obstaclesRef = useRef<{ x: number, y: number, width: number, height: number, type: 'ghost' | 'dot', active: boolean }[]>([]);
    const frameRef = useRef(0);
    const requestRef = useRef<number>();

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(() => { });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", onFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
    }, []);

    const jump = useCallback(() => {
        if (gameState !== "PLAYING") return;
        if (playerRef.current.y >= 300) {
            playerRef.current.vy = JUMP_FORCE;
        }
    }, [gameState]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" || e.code === "ArrowUp") jump();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [jump]);

    const initGame = () => {
        setScore(0);
        setGameState("PLAYING");
        playerRef.current = { x: 100, y: 300, vy: 0, radius: 20, mouthOpen: 0 };
        obstaclesRef.current = [];
        frameRef.current = 0;
    };

    const update = useCallback(() => {
        if (gameState !== "PLAYING") return;
        frameRef.current++;

        const p = playerRef.current;

        // Physics
        p.vy += GRAVITY;
        p.y += p.vy;
        if (p.y > 300) {
            p.y = 300;
            p.vy = 0;
        }

        // Animation
        p.mouthOpen = (Math.sin(frameRef.current * 0.2) + 1) / 2; // 0 to 1

        // Spawn Obstacles / Dots
        if (frameRef.current % 60 === 0) {
            if (Math.random() < 0.6) {
                // Ghost
                obstaclesRef.current.push({ x: CANVAS_WIDTH, y: 280, width: 30, height: 40, type: 'ghost', active: true });
            } else {
                // Dot higher up
                obstaclesRef.current.push({ x: CANVAS_WIDTH, y: 180 + Math.random() * 50, width: 15, height: 15, type: 'dot', active: true });
            }
        }

        // Update Obstacles
        obstaclesRef.current.forEach(obs => {
            if (!obs.active) return;
            obs.x -= SPEED + (score / 500); // Speed up over time
            if (obs.x < -100) obs.active = false;

            // Collision
            if (obs.type === 'ghost') {
                if (p.x + p.radius - 5 > obs.x && p.x - p.radius + 5 < obs.x + obs.width &&
                    p.y + p.radius - 5 > obs.y && p.y - p.radius + 5 < obs.y + obs.height) {
                    setGameState("GAME_OVER");
                }
            } else if (obs.type === 'dot') {
                const dist = Math.hypot(p.x - (obs.x + obs.width / 2), p.y - (obs.y + obs.height / 2));
                if (dist < p.radius + obs.width / 2) {
                    obs.active = false;
                    setScore(s => s + 50);
                }
            }
        });

        obstaclesRef.current = obstaclesRef.current.filter(o => o.active);
        setScore(s => s + 1); // Passively increase score

    }, [gameState, score]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = theme === "dark" ? "#0f172a" : "#1e293b";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Floor
        ctx.fillStyle = theme === "dark" ? "#1e293b" : "#334155";
        ctx.fillRect(0, 320, CANVAS_WIDTH, CANVAS_HEIGHT - 320);

        const p = playerRef.current;

        // Draw Pac
        ctx.fillStyle = "#eab308";
        ctx.beginPath();
        const mouthAngle = p.mouthOpen * 0.4;
        ctx.arc(p.x, p.y, p.radius, mouthAngle, Math.PI * 2 - mouthAngle);
        ctx.lineTo(p.x, p.y);
        ctx.fill();

        // Draw Eye
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(p.x + 2, p.y - 10, 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw Obstacles
        obstaclesRef.current.forEach(obs => {
            if (obs.type === 'ghost') {
                ctx.fillStyle = ["#ef4444", "#3b82f6", "#ec4899", "#f97316"][Math.floor(obs.x / 200) % 4];
                ctx.beginPath();
                ctx.arc(obs.x + obs.width / 2, obs.y + 10, obs.width / 2, Math.PI, 0);
                ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
                // wavy bottom
                ctx.lineTo(obs.x + obs.width * 0.75, obs.y + obs.height - 5);
                ctx.lineTo(obs.x + obs.width * 0.5, obs.y + obs.height);
                ctx.lineTo(obs.x + obs.width * 0.25, obs.y + obs.height - 5);
                ctx.lineTo(obs.x, obs.y + obs.height);
                ctx.fill();

                // Eyes
                ctx.fillStyle = "#fff";
                ctx.beginPath(); ctx.arc(obs.x + 8, obs.y + 10, 4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(obs.x + 22, obs.y + 10, 4, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "#000";
                ctx.beginPath(); ctx.arc(obs.x + 10, obs.y + 10, 2, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(obs.x + 24, obs.y + 10, 2, 0, Math.PI * 2); ctx.fill();

            } else if (obs.type === 'dot') {
                ctx.fillStyle = "#fff";
                ctx.beginPath();
                ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 10;
                ctx.shadowColor = "#fff";
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });

    }, [theme]);

    useEffect(() => {
        const loop = () => {
            update();
            draw();
            requestRef.current = requestAnimationFrame(loop);
        };
        requestRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [update, draw]);

    return (
        <div className="w-full flex flex-col justify-center items-center py-10 px-4 bg-slate-900 min-h-screen relative" ref={containerRef}>
            {isFullscreen && (
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-50 text-white/50 hover:text-white" onClick={toggleFullscreen}>
                    <Minimize2 className="w-8 h-8" />
                </Button>
            )}

            <div className="w-full max-w-[800px] mx-auto z-10 flex flex-col gap-4 mb-4">
                <GameStartOverlay
                    isPlaying={gameState === "PLAYING"}
                    isGameOver={gameState === "GAME_OVER"}
                    score={score}
                    highScore={0}
                    onStart={initGame}
                    onRestart={initGame}
                    gameName="Pac-Runner"
                />
            </div>

            <div
                className={`relative bg-black rounded-lg shadow-2xl overflow-hidden touch-none ${isFullscreen ? 'w-full h-full max-w-[1200px] aspect-[2/1]' : 'w-full max-w-[800px] aspect-[2/1]'}`}
                style={{ touchAction: 'none' }}
                onPointerDown={jump}
            >
                <div className="absolute top-4 left-4 z-10 text-white font-mono text-2xl font-bold drop-shadow-md">
                    SCORE: {score}
                </div>

                <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className={`w-full h-full pointer-events-none ${isFullscreen ? "object-contain" : "object-fill"}`} />

                {!isFullscreen && (
                    <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-10 text-white/50 hover:text-white pointer-events-auto" onClick={toggleFullscreen}>
                        <Maximize2 className="w-6 h-6" />
                    </Button>
                )}
            </div>
        </div>
    );
}
