import React, { useState, useEffect, useRef, useCallback } from "react";
import { Gamepad2, Maximize2, Minimize2 } from "lucide-react";
import GameStartOverlay from "./GameStartOverlay";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const TANK_SIZE = 30;
const BULLET_SPEED = 8;
const PLAYER_SPEED = 3;
const ENEMY_SPEED = 1.5;

type GameState = "MENU" | "PLAYING" | "GAME_OVER";

interface Point { x: number; y: number; }
interface Tank extends Point {
    angle: number;
    hp: number;
    active: boolean;
    color: string;
    cooldown: number;
    fromPlayer?: boolean;
}
interface Bullet extends Point {
    dx: number;
    dy: number;
    active: boolean;
    fromPlayer: boolean;
}

export default function TankBattleArenaGame({
    title = "Tank Battle Arena",
    description = "Top-down tank warfare. Survive against waves of enemies!",
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
    const [wave, setWave] = useState(1);

    // Refs
    const playerRef = useRef<Tank>({ x: 400, y: 300, angle: 0, hp: 3, active: true, color: "#22c55e", cooldown: 0 });
    const enemiesRef = useRef<Tank[]>([]);
    const bulletsRef = useRef<Bullet[]>([]);
    const keysRef = useRef<{ [key: string]: boolean }>({});
    const mouseRef = useRef<Point>({ x: 400, y: 300 });
    const isMouseDownRef = useRef(false);
    const requestRef = useRef<number>();

    // Fullscreen
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

    // Controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = false; };

        // Mouse
        const handleMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const scaleX = CANVAS_WIDTH / rect.width;
            const scaleY = CANVAS_HEIGHT / rect.height;
            mouseRef.current = {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        };
        const handleMouseDown = () => { isMouseDownRef.current = true; };
        const handleMouseUp = () => { isMouseDownRef.current = false; };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    // Joystick state for mobile
    const leftJoystick = useRef({ active: false, dx: 0, dy: 0, originX: 0, originY: 0, id: -1 });
    const rightJoystick = useRef({ active: false, dx: 0, dy: 0, originX: 0, originY: 0, id: -1 });

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            const x = t.clientX - rect.left;
            const y = t.clientY - rect.top;

            if (x < rect.width / 2 && !leftJoystick.current.active) {
                leftJoystick.current = { active: true, originX: x, originY: y, dx: 0, dy: 0, id: t.identifier };
            } else if (x >= rect.width / 2 && !rightJoystick.current.active) {
                rightJoystick.current = { active: true, originX: x, originY: y, dx: 0, dy: 0, id: t.identifier };
            }
        }
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            const x = t.clientX - rect.left;
            const y = t.clientY - rect.top;

            if (t.identifier === leftJoystick.current.id) {
                leftJoystick.current.dx = x - leftJoystick.current.originX;
                leftJoystick.current.dy = y - leftJoystick.current.originY;
            } else if (t.identifier === rightJoystick.current.id) {
                rightJoystick.current.dx = x - rightJoystick.current.originX;
                rightJoystick.current.dy = y - rightJoystick.current.originY;
            }
        }
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const t = e.changedTouches[i];
            if (t.identifier === leftJoystick.current.id) leftJoystick.current.active = false;
            if (t.identifier === rightJoystick.current.id) rightJoystick.current.active = false;
        }
    };

    const spawnEnemies = (waveNum: number) => {
        const num = 2 + waveNum;
        const enemies: Tank[] = [];
        for (let i = 0; i < num; i++) {
            // Spawn away from player
            let ex = 0, ey = 0;
            do {
                ex = Math.random() * CANVAS_WIDTH;
                ey = Math.random() * CANVAS_HEIGHT;
            } while (Math.hypot(ex - playerRef.current.x, ey - playerRef.current.y) < 200);

            enemies.push({ x: ex, y: ey, angle: 0, hp: 1 + Math.floor(waveNum / 3), active: true, color: "#ef4444", cooldown: 60 });
        }
        enemiesRef.current = enemies;
    };

    const initGame = () => {
        setScore(0);
        setWave(1);
        setGameState("PLAYING");
        playerRef.current = { x: 400, y: 300, angle: 0, hp: 5, active: true, color: "#22c55e", cooldown: 0 };
        bulletsRef.current = [];
        spawnEnemies(1);
    };

    const update = useCallback(() => {
        if (gameState !== "PLAYING") return;

        const p = playerRef.current;
        if (!p.active) return;

        // Movement Mobile vs Desktop
        let moveDX = 0;
        let moveDY = 0;

        if (leftJoystick.current.active) {
            const dist = Math.hypot(leftJoystick.current.dx, leftJoystick.current.dy);
            if (dist > 10) {
                moveDX = leftJoystick.current.dx / dist;
                moveDY = leftJoystick.current.dy / dist;
            }
        } else {
            if (keysRef.current['w'] || keysRef.current['arrowup']) moveDY -= 1;
            if (keysRef.current['s'] || keysRef.current['arrowdown']) moveDY += 1;
            if (keysRef.current['a'] || keysRef.current['arrowleft']) moveDX -= 1;
            if (keysRef.current['d'] || keysRef.current['arrowright']) moveDX += 1;
        }

        if (moveDX !== 0 || moveDY !== 0) {
            const len = Math.hypot(moveDX, moveDY);
            p.x += (moveDX / len) * PLAYER_SPEED;
            p.y += (moveDY / len) * PLAYER_SPEED;
        }

        // Clamp Bounds
        p.x = Math.max(TANK_SIZE / 2, Math.min(CANVAS_WIDTH - TANK_SIZE / 2, p.x));
        p.y = Math.max(TANK_SIZE / 2, Math.min(CANVAS_HEIGHT - TANK_SIZE / 2, p.y));

        // Aiming
        if (rightJoystick.current.active) {
            p.angle = Math.atan2(rightJoystick.current.dy, rightJoystick.current.dx);
            isMouseDownRef.current = true; // Auto shoot if right stick is active
        } else {
            p.angle = Math.atan2(mouseRef.current.y - p.y, mouseRef.current.x - p.x);
        }

        // Shooting
        if (p.cooldown > 0) p.cooldown--;
        if (isMouseDownRef.current && p.cooldown <= 0) {
            bulletsRef.current.push({
                x: p.x + Math.cos(p.angle) * TANK_SIZE,
                y: p.y + Math.sin(p.angle) * TANK_SIZE,
                dx: Math.cos(p.angle) * BULLET_SPEED,
                dy: Math.sin(p.angle) * BULLET_SPEED,
                active: true,
                fromPlayer: true
            });
            p.cooldown = 15;
        }

        // Move Bullets
        bulletsRef.current.forEach(b => {
            if (!b.active) return;
            b.x += b.dx;
            b.y += b.dy;
            if (b.x < 0 || b.x > CANVAS_WIDTH || b.y < 0 || b.y > CANVAS_HEIGHT) b.active = false;
        });

        // Enemies
        let aliveEnemies = 0;
        enemiesRef.current.forEach(e => {
            if (!e.active) return;
            aliveEnemies++;

            // Move towards player
            const dist = Math.hypot(p.x - e.x, p.y - e.y);
            e.angle = Math.atan2(p.y - e.y, p.x - e.x);

            if (dist > 100) {
                e.x += Math.cos(e.angle) * ENEMY_SPEED;
                e.y += Math.sin(e.angle) * ENEMY_SPEED;
            }

            // Shoot at player
            if (e.cooldown > 0) e.cooldown--;
            if (dist < 300 && e.cooldown <= 0) {
                bulletsRef.current.push({
                    x: e.x + Math.cos(e.angle) * TANK_SIZE,
                    y: e.y + Math.sin(e.angle) * TANK_SIZE,
                    dx: Math.cos(e.angle) * (BULLET_SPEED - 2),
                    dy: Math.sin(e.angle) * (BULLET_SPEED - 2),
                    active: true,
                    fromPlayer: false
                });
                e.cooldown = 60 + Math.random() * 60;
            }

            // Bullet collisions against enemy
            bulletsRef.current.forEach(b => {
                if (b.active && b.fromPlayer && Math.hypot(b.x - e.x, b.y - e.y) < TANK_SIZE / 1.5) {
                    b.active = false;
                    e.hp--;
                    if (e.hp <= 0) {
                        e.active = false;
                        setScore(s => s + 100);
                    }
                }
            });
        });

        // Bullet collisions against player
        bulletsRef.current.forEach(b => {
            if (b.active && !b.fromPlayer && Math.hypot(b.x - p.x, b.y - p.y) < TANK_SIZE / 1.5) {
                b.active = false;
                p.hp--;
                if (p.hp <= 0) {
                    p.active = false;
                    setGameState("GAME_OVER");
                }
            }
        });

        // Cleanup
        bulletsRef.current = bulletsRef.current.filter(b => b.active);

        // Next Wave
        if (aliveEnemies === 0) {
            setWave(w => {
                spawnEnemies(w + 1);
                return w + 1;
            });
            // heal player
            p.hp = Math.min(5, p.hp + 1);
        }

    }, [gameState]);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = theme === "dark" ? "#0f172a" : "#f1f5f9";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw Grid (Arena style)
        ctx.strokeStyle = theme === "dark" ? "#1e293b" : "#e2e8f0";
        ctx.lineWidth = 1;
        for (let i = 0; i < CANVAS_WIDTH; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_HEIGHT); ctx.stroke(); }
        for (let i = 0; i < CANVAS_HEIGHT; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_WIDTH, i); ctx.stroke(); }

        const drawTank = (tank: Tank) => {
            ctx.save();
            ctx.translate(tank.x, tank.y);
            ctx.rotate(tank.angle);

            // Body
            ctx.fillStyle = tank.color;
            ctx.fillRect(-TANK_SIZE / 2, -TANK_SIZE / 2, TANK_SIZE, TANK_SIZE);

            // Treads
            ctx.fillStyle = "#333";
            ctx.fillRect(-TANK_SIZE / 2 - 4, -TANK_SIZE / 2 - 2, 8, TANK_SIZE + 4);
            ctx.fillRect(-TANK_SIZE / 2 - 4 + TANK_SIZE, -TANK_SIZE / 2 - 2, 8, TANK_SIZE + 4);

            // Turret barrel
            ctx.fillStyle = "#666";
            ctx.fillRect(0, -4, TANK_SIZE, 8);

            // Turret base
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(0, 0, TANK_SIZE / 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            // HP Bar
            if (!tank.fromPlayer && tank.hp > 0) {
                ctx.fillStyle = "red";
                ctx.fillRect(tank.x - 15, tank.y - 25, 30, 4);
                ctx.fillStyle = "#22c55e";
                ctx.fillRect(tank.x - 15, tank.y - 25, (30 * tank.hp) / (1 + Math.floor((wave || 1) / 3)), 4);
            }
        };

        if (playerRef.current.active) drawTank(playerRef.current);
        enemiesRef.current.forEach(e => { if (e.active) drawTank(e); });

        // Bullets
        bulletsRef.current.forEach(b => {
            ctx.fillStyle = b.fromPlayer ? "#38bdf8" : "#fbbf24";
            ctx.beginPath();
            ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 10;
            ctx.shadowColor = ctx.fillStyle;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

    }, [theme, wave]);

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
                    gameName="Tank Battle Arena"
                />
            </div>

            <div className={`relative bg-black rounded-lg shadow-2xl overflow-hidden touch-none ${isFullscreen ? 'w-full h-full max-w-[1200px] max-h-[900px] aspect-[4/3]' : 'w-full max-w-[800px] aspect-[4/3]'}`}>

                {/* HUD */}
                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none z-10 text-white font-mono drop-shadow-md">
                    <div>
                        <div className="text-xl font-bold">WAVE: {wave}</div>
                        <div className="text-lg text-emerald-400">SCORE: {score}</div>
                    </div>
                    <div className="flex gap-1">
                        {Array.from({ length: Math.max(0, playerRef.current.hp) }).map((_, i) => (
                            <div key={i} className="w-6 h-6 bg-red-500 rounded-sm border-2 border-red-700 shadow-[0_0_10px_red]" />
                        ))}
                    </div>
                </div>

                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="w-full h-full object-contain cursor-crosshair touch-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                />

                {!isFullscreen && (
                    <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-10 text-white/50 hover:text-white pointer-events-auto" onClick={toggleFullscreen}>
                        <Maximize2 className="w-6 h-6" />
                    </Button>
                )}

                {/* Mobile controls visual hints */}
                {gameState === "PLAYING" && (
                    <div className="absolute inset-0 pointer-events-none sm:hidden flex justify-between items-end p-8 text-white/30 font-bold tracking-widest text-center text-sm">
                        <div>MOVE<br />(Drag Left)</div>
                        <div>AIM & SHOOT<br />(Drag Right)</div>
                    </div>
                )}
            </div>
        </div>
    );
}
