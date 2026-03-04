import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── WARNING: This game contains a jumpscare on level 3 ──────────────────────

// ─── Level definitions ────────────────────────────────────────────────────────
// Each level: path as a series of [x,y] waypoints, corridor width
interface LevelDef {
  waypoints: [number, number][];
  corridorWidth: number;
  label: string;
}

const LEVELS: LevelDef[] = [
  { corridorWidth: 30, label: "Level 1 — Easy", waypoints: [[60,540],[60,460],[100,460],[100,360],[200,360],[200,260],[300,260],[300,160],[400,160],[400,80],[500,80],[500,40]] },
  { corridorWidth: 22, label: "Level 2 — Narrower", waypoints: [[60,540],[60,440],[140,440],[140,320],[80,320],[80,200],[200,200],[200,120],[340,120],[340,220],[420,220],[420,80],[500,80],[500,40]] },
  { corridorWidth: 14, label: "Level 3 — NARROW", waypoints: [[60,540],[60,460],[120,460],[120,380],[60,380],[60,260],[160,260],[160,160],[280,160],[280,280],[400,280],[400,160],[480,160],[480,80],[520,80],[520,40]] },
  { corridorWidth: 11, label: "Level 4 — Expert", waypoints: [[60,540],[60,470],[100,470],[100,380],[60,380],[60,260],[180,260],[180,160],[320,160],[320,300],[440,300],[440,160],[500,160],[500,60],[540,60],[540,40]] },
  { corridorWidth: 9, label: "Level 5 — Insane", waypoints: [[60,540],[60,460],[110,460],[110,360],[60,360],[60,240],[180,240],[180,140],[300,140],[300,260],[400,260],[400,120],[480,120],[480,60],[530,60],[530,40]] },
  { corridorWidth: 8, label: "Level 6", waypoints: [[60,540],[60,440],[130,440],[130,330],[60,330],[60,210],[200,210],[200,110],[360,110],[360,230],[460,230],[460,90],[520,90],[520,40]] },
  { corridorWidth: 8, label: "Level 7", waypoints: [[60,540],[60,430],[120,430],[120,310],[60,310],[60,190],[220,190],[220,90],[380,90],[380,210],[480,210],[480,70],[530,70],[530,40]] },
  { corridorWidth: 8, label: "Level 8", waypoints: [[60,540],[60,440],[130,440],[130,320],[70,320],[70,200],[210,200],[210,100],[370,100],[370,220],[470,220],[470,80],[530,80],[530,40]] },
  { corridorWidth: 8, label: "Level 9", waypoints: [[60,540],[60,450],[110,450],[110,350],[60,350],[60,220],[190,220],[190,120],[340,120],[340,250],[450,250],[450,100],[510,100],[510,40]] },
  { corridorWidth: 8, label: "Level 10 — FINAL", waypoints: [[60,540],[60,460],[100,460],[100,360],[60,360],[60,240],[160,240],[160,140],[280,140],[280,270],[380,270],[380,130],[470,130],[470,60],[520,60],[520,40]] },
];

const SVG_W = 580;
const SVG_H = 580;

// Build a polyline stroke path string from waypoints
function buildPathD(waypoints: [number, number][]): string {
  return waypoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
}

// Check if point is within the corridor (distance from polyline segments)
function distToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax, dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function isOffPath(px: number, py: number, waypoints: [number, number][], halfWidth: number): boolean {
  for (let i = 0; i < waypoints.length - 1; i++) {
    const [ax, ay] = waypoints[i];
    const [bx, by] = waypoints[i + 1];
    if (distToSegment(px, py, ax, ay, bx, by) <= halfWidth) return false;
  }
  return true;
}

// ─── Audio helpers ────────────────────────────────────────────────────────────
function playFailSound(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(80, ctx.currentTime);
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

function playJumpscareBuzz(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(60, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.5);
  gain.gain.setValueAtTime(1.0, ctx.currentTime);
  gain.gain.setValueAtTime(1.0, ctx.currentTime + 0.5);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 1.5);
}

// ─── Game UI ─────────────────────────────────────────────────────────────────
function GameUI() {
  const svgRef = useRef<SVGSVGElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const [phase, setPhase] = useState<"warning" | "playing" | "fail" | "jumpscare" | "complete">("warning");
  const [levelIdx, setLevelIdx] = useState(0);
  const [dotPos, setDotPos] = useState({ x: 60, y: 540 });
  const [attempts, setAttempts] = useState(0);
  const [jumpscareActive, setJumpscareActive] = useState(false);
  const failCooldown = useRef(false);

  const getAudio = useCallback(() => {
    if (!audioRef.current) audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioRef.current.state === "suspended") audioRef.current.resume();
    return audioRef.current;
  }, []);

  const resetLevel = useCallback((lvlIdx: number) => {
    const lv = LEVELS[lvlIdx];
    const start = lv.waypoints[0];
    setDotPos({ x: start[0], y: start[1] });
    setPhase("playing");
    failCooldown.current = false;
  }, []);

  const triggerFail = useCallback(() => {
    if (failCooldown.current) return;
    failCooldown.current = true;
    const ctx = getAudio();
    playFailSound(ctx);
    setPhase("fail");
    setAttempts((a) => a + 1);
    setTimeout(() => {
      setPhase("playing");
      resetLevel(levelIdx);
    }, 800);
  }, [getAudio, levelIdx, resetLevel]);

  const triggerJumpscare = useCallback(() => {
    if (failCooldown.current) return;
    failCooldown.current = true;
    const ctx = getAudio();
    playJumpscareBuzz(ctx);
    setJumpscareActive(true);
    setPhase("jumpscare");
    setAttempts((a) => a + 1);
    setTimeout(() => {
      setJumpscareActive(false);
      resetLevel(levelIdx);
    }, 2000);
  }, [getAudio, levelIdx, resetLevel]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (phase !== "playing" || failCooldown.current) return;
    const rect = svgRef.current!.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (SVG_W / rect.width);
    const py = (e.clientY - rect.top) * (SVG_H / rect.height);

    const lv = LEVELS[levelIdx];
    const hw = lv.corridorWidth / 2;

    // Jumpscare on level 3 (index 2) when player reaches the second-to-last segment carefully
    // Actually triggered by wall collision on level 2 (3rd level, 0-indexed 2)
    if (isOffPath(px, py, lv.waypoints, hw)) {
      if (levelIdx === 2) {
        triggerJumpscare();
      } else {
        triggerFail();
      }
      return;
    }

    setDotPos({ x: px, y: py });

    // Check if reached exit (near last waypoint)
    const lastWp = lv.waypoints[lv.waypoints.length - 1];
    const dx = px - lastWp[0], dy = py - lastWp[1];
    if (Math.hypot(dx, dy) < 20) {
      if (levelIdx >= LEVELS.length - 1) {
        setPhase("complete");
      } else {
        setLevelIdx((l) => l + 1);
        const nextLv = LEVELS[levelIdx + 1];
        const ns = nextLv.waypoints[0];
        setDotPos({ x: ns[0], y: ns[1] });
        setPhase("playing");
        failCooldown.current = false;
      }
    }
  }, [phase, levelIdx, triggerFail, triggerJumpscare]);

  const handleTouchMove = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (phase !== "playing" || failCooldown.current) return;
    const rect = svgRef.current!.getBoundingClientRect();
    const touch = e.touches[0];
    const px = (touch.clientX - rect.left) * (SVG_W / rect.width);
    const py = (touch.clientY - rect.top) * (SVG_H / rect.height);

    const lv = LEVELS[levelIdx];
    const hw = lv.corridorWidth / 2;

    if (isOffPath(px, py, lv.waypoints, hw)) {
      if (levelIdx === 2) triggerJumpscare(); else triggerFail();
      return;
    }
    setDotPos({ x: px, y: py });

    const lastWp = lv.waypoints[lv.waypoints.length - 1];
    if (Math.hypot(px - lastWp[0], py - lastWp[1]) < 20) {
      if (levelIdx >= LEVELS.length - 1) setPhase("complete");
      else {
        const next = levelIdx + 1;
        setLevelIdx(next);
        const ns = LEVELS[next].waypoints[0];
        setDotPos({ x: ns[0], y: ns[1] });
        setPhase("playing");
        failCooldown.current = false;
      }
    }
  }, [phase, levelIdx, triggerFail, triggerJumpscare]);

  const lv = LEVELS[Math.min(levelIdx, LEVELS.length - 1)];
  const pathD = buildPathD(lv.waypoints);
  const startWp = lv.waypoints[0];
  const endWp = lv.waypoints[lv.waypoints.length - 1];

  if (phase === "warning") {
    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-yellow-950 border-2 border-yellow-500 rounded-xl max-w-lg mx-auto text-center">
        <div className="text-5xl">⚠️</div>
        <h3 className="text-yellow-400 font-bold text-2xl">WARNING</h3>
        <p className="text-yellow-200 text-base">
          This game contains a <strong>jumpscare effect</strong> on Level 3 — a sudden loud sound and full-screen flash.
          If you are sensitive to sudden noises or flashing lights, please do not play.
        </p>
        <p className="text-gray-300 text-sm">Guide the dot through the winding path without touching the walls. The path gets narrower each level.</p>
        <button
          onClick={() => { setPhase("playing"); setAttempts(0); setLevelIdx(0); setDotPos({ x: 60, y: 540 }); }}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-lg text-lg"
        >
          I Understand — Start Game
        </button>
      </div>
    );
  }

  if (phase === "complete") {
    return (
      <div className="flex flex-col items-center gap-4 p-8 bg-gray-900 rounded-xl text-center">
        <div className="text-5xl">🏆</div>
        <h3 className="text-green-400 font-bold text-3xl">COMPLETE!</h3>
        <p className="text-white text-lg">You navigated all 10 levels!</p>
        <p className="text-gray-400">Total attempts: {attempts}</p>
        <button onClick={() => { setPhase("playing"); setAttempts(0); setLevelIdx(0); setDotPos({ x: 60, y: 540 }); }}
          className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3 rounded-lg text-lg mt-2">
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 select-none relative">
      {/* Jumpscare overlay */}
      {jumpscareActive && (
        <div style={{
          position: "fixed", inset: 0, background: "#ff0000",
          zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
          animation: "pulse 0.1s infinite",
        }}>
          <div style={{ fontSize: 120, filter: "drop-shadow(0 0 40px #fff)" }}>😱</div>
        </div>
      )}

      <div className="flex items-center justify-between w-full max-w-lg px-2">
        <span className="text-white font-bold text-sm">{lv.label}</span>
        <span className="text-gray-400 text-sm">Attempts: {attempts}</span>
        <span className="text-yellow-400 text-sm font-bold">Width: {lv.corridorWidth}px</span>
      </div>

      {phase === "fail" && (
        <div className="w-full max-w-lg text-center py-2 bg-red-700 rounded text-white font-bold text-lg animate-pulse">
          FAIL! Don't touch the walls!
        </div>
      )}

      <div style={{ position: "relative", width: "100%", maxWidth: SVG_W }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width={SVG_W}
          height={SVG_H}
          style={{ maxWidth: "100%", background: "#0a0a0a", borderRadius: 10, cursor: "none", touchAction: "none", display: "block" }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width={SVG_W} height={SVG_H} fill="url(#grid)" />

          {/* Wall borders — thicker stroke = wall area */}
          <path d={pathD} fill="none" stroke="#1a3a1a" strokeWidth={lv.corridorWidth + 24} strokeLinecap="round" strokeLinejoin="round" />
          {/* Corridor wall outline */}
          <path d={pathD} fill="none" stroke="#00aa44" strokeWidth={lv.corridorWidth + 4} strokeLinecap="round" strokeLinejoin="round" opacity={0.3} />
          {/* Safe corridor */}
          <path d={pathD} fill="none" stroke="#003300" strokeWidth={lv.corridorWidth} strokeLinecap="round" strokeLinejoin="round" />
          {/* Corridor edges (walls visible) */}
          <path d={pathD} fill="none" stroke="#00ff66" strokeWidth={lv.corridorWidth + 2} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="2 6" opacity={0.5} />
          {/* Center guide line */}
          <path d={pathD} fill="none" stroke="rgba(0,255,100,0.08)" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="10 10" />

          {/* Start marker */}
          <circle cx={startWp[0]} cy={startWp[1]} r={12} fill="#3498db" opacity={0.7} />
          <text x={startWp[0]} y={startWp[1] + 28} textAnchor="middle" fill="#3498db" fontSize="12" fontWeight="bold">START</text>

          {/* End marker */}
          <circle cx={endWp[0]} cy={endWp[1]} r={12} fill="#2ecc71" opacity={0.9} />
          <text x={endWp[0]} y={endWp[1] - 18} textAnchor="middle" fill="#2ecc71" fontSize="12" fontWeight="bold">END</text>

          {/* Player dot */}
          {phase === "playing" && (
            <>
              <circle cx={dotPos.x} cy={dotPos.y} r={7} fill="#e74c3c" />
              <circle cx={dotPos.x} cy={dotPos.y} r={10} fill="none" stroke="#e74c3c" strokeWidth={1} opacity={0.4} />
            </>
          )}
        </svg>
      </div>

      <p className="text-xs text-gray-500 max-w-lg text-center">
        Move your mouse/finger along the green path. Touch the wall = fail. Level 3 has a surprise.
      </p>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function ScaryMazeGame() {
  return (
    <CalculatorVerticalLayout
      title="Scary Maze Game - Don't Touch the Walls!"
      description="Navigate a winding maze without touching the walls. 10 levels, each narrower. Warning: Level 3 contains a jumpscare. Free online scary maze game."
      canonical="https://www.smartkitnow.com/games/scary-maze"
      widget={<GameUI />}
      editorial={
        <div>
          <h2>How to Play Scary Maze</h2>
          <p className="font-bold text-red-500">WARNING: This game contains a jumpscare effect on Level 3. It involves a sudden loud noise and full-screen flash.</p>
          <p>Guide a small dot from START to END along a winding path. The walls are tight — one slip and you start over. Each level gets narrower and more challenging.</p>
          <h3>Controls</h3>
          <ul>
            <li><strong>Mouse:</strong> Move the cursor along the path.</li>
            <li><strong>Touch/Finger:</strong> Drag your finger along the path on mobile.</li>
          </ul>
          <h3>Levels</h3>
          <ul>
            <li><strong>Levels 1-2:</strong> Corridor widths of 30px and 22px — manageable.</li>
            <li><strong>Level 3:</strong> 14px corridor — and something unexpected happens if you fail.</li>
            <li><strong>Levels 4-10:</strong> As narrow as 8px. Extreme precision required.</li>
          </ul>
          <h3>Tips</h3>
          <ul>
            <li>Move slowly and deliberately — speed causes mistakes.</li>
            <li>Follow the center of the green corridor line.</li>
            <li>Attempts are counted — can you complete it in under 10?</li>
          </ul>
        </div>
      }
      contentMaxWidth="max-w-5xl"
    />
  );
}
