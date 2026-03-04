import React, { useState, useEffect, useRef, useCallback } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DrumPad {
  id: string;
  label: string;
  key: string;
  color: string;
  activeColor: string;
  row: number;
  col: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PADS: DrumPad[] = [
  { id: "crash",  label: "Crash",   key: "A", color: "bg-yellow-700", activeColor: "bg-yellow-400", row: 0, col: 0 },
  { id: "hihat-o",label: "HiHat O", key: "S", color: "bg-yellow-600", activeColor: "bg-yellow-300", row: 0, col: 1 },
  { id: "ride",   label: "Ride",    key: "D", color: "bg-amber-700",  activeColor: "bg-amber-400",  row: 0, col: 2 },
  { id: "tom1",   label: "Tom 1",   key: "F", color: "bg-blue-700",   activeColor: "bg-blue-400",   row: 1, col: 0 },
  { id: "hihat-c",label: "HiHat C", key: "G", color: "bg-yellow-500", activeColor: "bg-yellow-200", row: 1, col: 1 },
  { id: "tom2",   label: "Tom 2",   key: "H", color: "bg-blue-600",   activeColor: "bg-blue-300",   row: 1, col: 2 },
  { id: "snare",  label: "Snare",   key: "J", color: "bg-red-700",    activeColor: "bg-red-400",    row: 2, col: 0 },
  { id: "kick",   label: "Kick",    key: "K", color: "bg-purple-700", activeColor: "bg-purple-400", row: 2, col: 1 },
  { id: "tom3",   label: "Tom 3",   key: "L", color: "bg-blue-500",   activeColor: "bg-blue-200",   row: 2, col: 2 },
];

const KEY_TO_PAD: Record<string, string> = Object.fromEntries(
  PADS.map((p) => [p.key.toLowerCase(), p.id])
);

// ─── Web Audio Sound Synthesis ───────────────────────────────────────────────

function createAudioContext(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

function playKick(ctx: AudioContext): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  gain.gain.setValueAtTime(1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);
}

function playSnare(ctx: AudioContext): void {
  const bufferSize = ctx.sampleRate * 0.2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.8, ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 3000;
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 0.2);

  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.frequency.value = 180;
  oscGain.gain.setValueAtTime(0.5, ctx.currentTime);
  oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.1);
}

function playHiHat(ctx: AudioContext, open: boolean): void {
  const bufferSize = ctx.sampleRate * (open ? 0.4 : 0.08);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = 8000;
  const gain = ctx.createGain();
  const duration = open ? 0.4 : 0.08;
  gain.gain.setValueAtTime(0.6, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  source.connect(hpf);
  hpf.connect(gain);
  gain.connect(ctx.destination);
  source.start(ctx.currentTime);
  source.stop(ctx.currentTime + duration);
}

function playTom(ctx: AudioContext, frequency: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(frequency * 0.4, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.8, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

function playCrash(ctx: AudioContext): void {
  const bufferSize = ctx.sampleRate * 1.2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const hpf = ctx.createBiquadFilter();
  hpf.type = "highpass";
  hpf.frequency.value = 5000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
  source.connect(hpf);
  hpf.connect(gain);
  gain.connect(ctx.destination);
  source.start(ctx.currentTime);
  source.stop(ctx.currentTime + 1.2);
}

function playRide(ctx: AudioContext): void {
  const bufferSize = ctx.sampleRate * 0.8;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const bpf = ctx.createBiquadFilter();
  bpf.type = "bandpass";
  bpf.frequency.value = 6000;
  bpf.Q.value = 0.5;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
  source.connect(bpf);
  bpf.connect(gain);
  gain.connect(ctx.destination);
  source.start(ctx.currentTime);
  source.stop(ctx.currentTime + 0.8);
}

function triggerSound(ctx: AudioContext, padId: string): void {
  switch (padId) {
    case "kick":    playKick(ctx); break;
    case "snare":   playSnare(ctx); break;
    case "hihat-c": playHiHat(ctx, false); break;
    case "hihat-o": playHiHat(ctx, true); break;
    case "tom1":    playTom(ctx, 250); break;
    case "tom2":    playTom(ctx, 180); break;
    case "tom3":    playTom(ctx, 130); break;
    case "crash":   playCrash(ctx); break;
    case "ride":    playRide(ctx); break;
  }
}

// ─── DrumKit Widget ──────────────────────────────────────────────────────────

function DrumKitWidget() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [activePads, setActivePads] = useState<Set<string>>(new Set());
  const [bpm, setBpm] = useState(120);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [beat, setBeat] = useState(0);
  const metronomeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [volume, setVolume] = useState(80);

  const ensureAudioContext = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const hitPad = useCallback((padId: string) => {
    const ctx = ensureAudioContext();
    triggerSound(ctx, padId);
    setActivePads((prev) => new Set([...prev, padId]));
    setTimeout(() => {
      setActivePads((prev) => {
        const next = new Set(prev);
        next.delete(padId);
        return next;
      });
    }, 150);
  }, [ensureAudioContext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const padId = KEY_TO_PAD[e.key.toLowerCase()];
      if (padId) hitPad(padId);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hitPad]);

  useEffect(() => {
    if (metronomeRef.current) clearInterval(metronomeRef.current);
    if (!metronomeOn) { setBeat(0); return; }
    const interval = (60 / bpm) * 1000;
    let currentBeat = 0;
    metronomeRef.current = setInterval(() => {
      currentBeat = (currentBeat % 4) + 1;
      setBeat(currentBeat);
      const ctx = ensureAudioContext();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = currentBeat === 1 ? 1000 : 800;
      g.gain.setValueAtTime(0.3 * (volume / 100), ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    }, interval);
    return () => { if (metronomeRef.current) clearInterval(metronomeRef.current); };
  }, [metronomeOn, bpm, volume, ensureAudioContext]);

  return (
    <div className="flex flex-col items-center gap-6 p-4 select-none">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-6 bg-slate-800 rounded-2xl px-6 py-4 w-full max-w-lg">
        <div className="flex flex-col items-center gap-1">
          <span className="text-slate-300 text-sm font-semibold">BPM: {bpm}</span>
          <input
            type="range" min={60} max={200} value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-28 accent-indigo-500"
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-slate-300 text-sm font-semibold">Volume: {volume}%</span>
          <input
            type="range" min={0} max={100} value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-28 accent-indigo-500"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setMetronomeOn((v) => !v)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              metronomeOn
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40"
                : "bg-slate-600 text-slate-300 hover:bg-slate-500"
            }`}
          >
            {metronomeOn ? "Metronome ON" : "Metronome OFF"}
          </button>
          {metronomeOn && (
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((b) => (
                <div
                  key={b}
                  className={`w-3 h-3 rounded-full transition-all duration-75 ${
                    beat === b
                      ? b === 1 ? "bg-red-400 scale-125" : "bg-indigo-400 scale-110"
                      : "bg-slate-600"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="text-slate-400 text-xs">Press keyboard keys A-L or tap/click pads</p>

      {/* Drum Pads Grid */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        {PADS.map((pad) => (
          <button
            key={pad.id}
            onMouseDown={() => hitPad(pad.id)}
            onTouchStart={(e) => { e.preventDefault(); hitPad(pad.id); }}
            className={`
              relative flex flex-col items-center justify-center
              rounded-2xl h-24 font-bold text-white
              border-2 transition-all duration-75 cursor-pointer
              shadow-lg active:scale-95
              ${activePads.has(pad.id)
                ? `${pad.activeColor} border-white scale-95 shadow-white/30`
                : `${pad.color} border-slate-600 hover:brightness-110`
              }
            `}
          >
            <span className="text-lg font-extrabold drop-shadow">{pad.label}</span>
            <span className="text-xs mt-1 opacity-70 bg-black/30 px-2 py-0.5 rounded-full">
              [{pad.key}]
            </span>
            {activePads.has(pad.id) && (
              <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Last hit indicator */}
      <div className="text-slate-400 text-sm h-6">
        {activePads.size > 0 && (
          <span className="text-indigo-300 font-semibold animate-pulse">
            {PADS.find((p) => activePads.has(p.id))?.label} hit!
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DrumKitProGame() {
  return (
    <CalculatorVerticalLayout
      title="Drum Kit Pro"
      description="Play a virtual drum kit in your browser using keyboard keys or taps. Synthesized sounds via Web Audio API. Includes metronome with BPM control."
      canonical="https://www.smartkitnow.com/games/drum-kit-pro"
      widget={<DrumKitWidget />}
      contentMaxWidth="max-w-5xl"
      editorial={
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>How to Play Drum Kit Pro</h2>
          <p>
            Drum Kit Pro puts a full synthesized drum kit in your browser—no downloads, no
            plugins, just pure Web Audio API sound generation. Each of the 9 pads produces a
            unique synthesized drum sound: a deep oscillator sweep for the kick, layered noise
            and oscillator for the snare, filtered short/long noise bursts for the hi-hats,
            mid-range oscillator sweeps for the three toms, and complex decaying noise for the
            crash and ride cymbals.
          </p>

          <h3>Keyboard Controls</h3>
          <ul>
            <li><strong>A</strong> — Crash cymbal</li>
            <li><strong>S</strong> — Open Hi-Hat</li>
            <li><strong>D</strong> — Ride cymbal</li>
            <li><strong>F</strong> — Tom 1 (high)</li>
            <li><strong>G</strong> — Closed Hi-Hat</li>
            <li><strong>H</strong> — Tom 2 (mid)</li>
            <li><strong>J</strong> — Snare</li>
            <li><strong>K</strong> — Kick drum</li>
            <li><strong>L</strong> — Tom 3 (low)</li>
          </ul>

          <h3>Using the Metronome</h3>
          <p>
            Toggle the metronome on to hear a click track at the BPM you select (60–200 BPM).
            The four beat indicators light up in sequence—the red indicator marks beat 1 of
            each bar. Use this to practice staying in time. The volume slider controls the
            master output level of all sounds and the metronome click.
          </p>

          <h3>Tips for Better Playing</h3>
          <p>
            For the most natural feel, use your left hand on the hi-hats and cymbals (A, S, D)
            and your right hand on snare, kick, and toms (J, K, L). Practice basic rock beats:
            kick on beats 1 and 3 (K), snare on 2 and 4 (J), and hi-hat on every eighth note
            (G repeated). Once you have the pattern, add crash accents and tom fills.
          </p>

          <h3>Sound Design Details</h3>
          <p>
            All sounds are synthesized in real time using the Web Audio API. The kick uses a
            sine oscillator with a rapid frequency sweep from 150 Hz to near zero. The snare
            layers band-passed white noise with a short sine burst. Hi-hats use high-pass
            filtered noise—the closed hat cuts off quickly while the open hat sustains with a
            gentle fade. Toms sweep from their fundamental frequency down to about 40% over
            300ms. Crash and ride use high-pass and band-pass filtered noise with longer decay
            tails of 1.2 and 0.8 seconds respectively.
          </p>
        </div>
      }
    />
  );
}
