/**
 * TennisServeSpeedCalculator — COURT NOIR aesthetic
 * Design: Luxury Minimal · DM Serif Display + DM Sans
 * Palette: #0a1f14 (court noir) · #c8f564 (neon lime) · #e8f0e4 (court cream)
 * DFII: 13 — Execute fully
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
// ⚠️ FULL ICON IMPORT
import {
  Timer,
  TrendingUp,
  Trophy,
  Flag,
  RotateCcw,
  AlertTriangle,
  ExternalLink,
  Gauge,
  ArrowRightLeft,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

// ─── Design tokens (COURT NOIR) ───────────────────────────────────
const CN = {
  noir:   "#0a1f14",
  deep:   "#0e2a1a",
  mid:    "#1a3d28",
  muted:  "#2b5e3a",
  accent: "#c8f564",
  cream:  "#e8f0e4",
  dim:    "#7ea88a",
} as const;

// ─── Data ─────────────────────────────────────────────────────────
const PRO_BENCHMARKS = [
  { player: "Sam Groth",       country: "🇦🇺", kmh: 263, tag: "All-Time Record"  },
  { player: "John Isner",      country: "🇺🇸", kmh: 253, tag: "ATP Record"       },
  { player: "Novak Djokovic",  country: "🇷🇸", kmh: 220, tag: "Top ATP"          },
  { player: "Rafael Nadal",    country: "🇪🇸", kmh: 217, tag: "Top ATP"          },
  { player: "Roger Federer",   country: "🇨🇭", kmh: 215, tag: "Top ATP"          },
  { player: "Sabine Lisicki",  country: "🇩🇪", kmh: 211, tag: "WTA Record"       },
  { player: "Serena Williams", country: "🇺🇸", kmh: 207, tag: "Top WTA"          },
  { player: "ATP Average",     country: "🏆",  kmh: 193, tag: "Tour Average"     },
  { player: "WTA Average",     country: "🏆",  kmh: 163, tag: "Tour Average"     },
  { player: "Club Player",     country: "🎾",  kmh: 130, tag: "Amateur"          },
].sort((a, b) => b.kmh - a.kmh);

// ─── Helpers ──────────────────────────────────────────────────────
const ftToM    = (ft: number) => ft / 3.28084;
const kmhToMph = (kmh: number) => kmh * 0.621371;

// ─── SVG Speedometer — COURT NOIR styled ─────────────────────────
function CourtNoir_Speedometer({
  speedKmh,
  animated,
}: {
  speedKmh: number;
  animated: boolean;
}) {
  const MAX = 300;
  const clamped = Math.min(speedKmh, MAX);
  const pct = clamped / MAX;

  // Arc geometry
  const cx = 120, cy = 115, R = 90;
  const START = -215, SWEEP = 250;
  const toXY = (deg: number, r: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const s = toXY(START, R);
  const e = toXY(START + SWEEP, R);
  const needle = toXY(START + pct * SWEEP, R - 8);

  // Tick marks
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const a = START + (i / 10) * SWEEP;
    const inner = toXY(a, R - 14);
    const outer = toXY(a, R - 4);
    return { inner, outer, major: i % 5 === 0 };
  });

  const mph = kmhToMph(speedKmh).toFixed(0);

  return (
    <svg
      viewBox="0 0 240 175"
      className="w-full max-w-[300px] mx-auto select-none"
      style={{ filter: "drop-shadow(0 0 18px rgba(200,245,100,0.18))" }}
    >
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={R + 10} fill={CN.deep} />
      <circle cx={cx} cy={cy} r={R + 10} fill="none" stroke={CN.mid} strokeWidth="1" />

      {/* Track */}
      <path
        d={`M ${s.x} ${s.y} A ${R} ${R} 0 1 1 ${e.x} ${e.y}`}
        fill="none"
        stroke={CN.muted}
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Filled arc */}
      {pct > 0.001 && (
        <path
          d={`M ${s.x} ${s.y} A ${R} ${R} 0 ${pct > 0.5 ? 1 : 0} 1 ${needle.x} ${needle.y}`}
          fill="none"
          stroke={CN.accent}
          strokeWidth="8"
          strokeLinecap="round"
          style={{
            transition: animated ? "all 0.8s cubic-bezier(0.34,1.56,0.64,1)" : "none",
          }}
        />
      )}

      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.inner.x} y1={t.inner.y}
          x2={t.outer.x} y2={t.outer.y}
          stroke={t.major ? CN.cream : CN.muted}
          strokeWidth={t.major ? 1.5 : 0.8}
        />
      ))}

      {/* Needle glow */}
      {pct > 0.001 && (
        <circle
          cx={needle.x}
          cy={needle.y}
          r="6"
          fill={CN.accent}
          style={{ filter: "drop-shadow(0 0 6px #c8f564)" }}
        />
      )}

      {/* Center hub */}
      <circle cx={cx} cy={cy} r="6" fill={CN.mid} stroke={CN.dim} strokeWidth="1" />

      {/* km/h display */}
      <text
        x={cx}
        y={cy + 22}
        textAnchor="middle"
        fontSize="30"
        fontWeight="700"
        fontFamily="'DM Serif Display', Georgia, serif"
        fill={CN.accent}
        style={{ letterSpacing: "-1px" }}
      >
        {speedKmh.toFixed(0)}
      </text>
      <text x={cx} y={cy + 36} textAnchor="middle" fontSize="8" fill={CN.dim} fontFamily="'DM Sans', sans-serif" letterSpacing="3">
        KM/H
      </text>
      <text x={cx} y={cy + 50} textAnchor="middle" fontSize="10" fill={CN.cream} fontFamily="'DM Sans', sans-serif">
        {mph} mph
      </text>

      {/* Scale labels */}
      <text x="26" y="160" fontSize="8" fill={CN.dim} fontFamily="'DM Sans', sans-serif">0</text>
      <text x="196" y="160" fontSize="8" fill={CN.dim} fontFamily="'DM Sans', sans-serif">{MAX}</text>
    </svg>
  );
}

// ─── Comparison bars ───────────────────────────────────────────────
function CourtNoir_Chart({ userKmh }: { userKmh: number }) {
  const MAX = 280;
  const rows = [
    { label: "Sam Groth — All-Time Record", kmh: 263, accent: "#ef4444" },
    { label: "Serena Williams — WTA Record", kmh: 207, accent: "#d97706" },
    { label: "ATP Tour Average",            kmh: 193, accent: "#6366f1" },
    { label: "⚡ Your Serve",              kmh: userKmh, accent: CN.accent, isUser: true },
    { label: "Club Player Average",         kmh: 130, accent: CN.dim },
  ].sort((a, b) => b.kmh - a.kmh);

  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const pct = Math.min((row.kmh / MAX) * 100, 100);
        return (
          <div key={row.label}>
            <div className="flex justify-between items-baseline mb-1">
              <span
                className="text-xs font-semibold"
                style={{ color: row.isUser ? CN.accent : CN.cream, fontFamily: "'DM Sans', sans-serif" }}
              >
                {row.label}
              </span>
              <span className="text-xs font-mono" style={{ color: CN.dim }}>
                {row.kmh.toFixed(0)} km/h · {kmhToMph(row.kmh).toFixed(0)} mph
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: CN.mid }}>
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${pct}%`,
                  background: row.isUser
                    ? `linear-gradient(90deg, ${CN.accent}, #a3f065)`
                    : row.accent,
                  boxShadow: row.isUser ? `0 0 8px ${CN.accent}80` : "none",
                  transition: "width 0.9s cubic-bezier(0.34,1.2,0.64,1)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Speed tier ────────────────────────────────────────────────────
function getTier(kmh: number) {
  if (kmh >= 240) return { label: "MONSTER SERVE", sub: "Top 1% worldwide", glow: true };
  if (kmh >= 210) return { label: "PRO-LEVEL",     sub: "ATP / WTA territory", glow: true };
  if (kmh >= 180) return { label: "ADVANCED",      sub: "Strong amateur game", glow: false };
  if (kmh >= 140) return { label: "CLUB PLAYER",   sub: "Solid recreational", glow: false };
  return              { label: "DEVELOPING",       sub: "Keep training!",      glow: false };
}

// ─── Main component ────────────────────────────────────────────────
export default function TennisServeSpeedCalculator() {
  const [unit, setUnit]     = useState<"metric" | "imperial">("metric");
  const [inputs, setInputs] = useState({ distance: "", time: "" });
  const [hasResult, setHasResult] = useState(false);

  const handleInputChange = useCallback(
    (n: string, v: string) => setInputs((p) => ({ ...p, [n]: v })),
    []
  );

  const results = useMemo(() => {
    const rawDist = parseFloat(inputs.distance);
    const time    = parseFloat(inputs.time);
    if (isNaN(rawDist) || isNaN(time) || rawDist <= 0 || time <= 0) {
      return { kmh: null, mph: null, warning: "Enter valid positive numbers for distance and time." };
    }
    const distMeters = unit === "imperial" ? ftToM(rawDist) : rawDist;
    const kmh = (distMeters / time) * 3.6;
    return { kmh, mph: kmhToMph(kmh), warning: null };
  }, [inputs, unit]);

  // Animate result in on first valid calculation
  useEffect(() => {
    if (results.kmh !== null && !results.warning) {
      setHasResult(true);
    }
  }, [results.kmh, results.warning]);

  const tier       = results.kmh ? getTier(results.kmh) : null;
  const percentile = results.kmh
    ? results.kmh >= 240 ? 99 : results.kmh >= 220 ? 95 : results.kmh >= 200 ? 85
      : results.kmh >= 185 ? 70 : results.kmh >= 160 ? 50 : results.kmh >= 130 ? 25 : 10
    : null;

  const distLabel = unit === "metric" ? "m" : "ft";
  const distPlaceholder = unit === "metric" ? "e.g. 18.3" : "e.g. 60";

  // ── FAQs ─────────────────────────────────────────────────────────
  const faqs = [
    {
      question: "How accurate is the Tennis Serve Speed Calculator?",
      answer: "The calculator gives an estimate based on distance and time. Factors like ball spin and air resistance can affect accuracy. For professional-grade precision, radar guns or Hawk-Eye systems are recommended.",
    },
    {
      question: "What is the fastest tennis serve ever recorded?",
      answer: "Sam Groth (Australia) holds the official record at 263.4 km/h (163.7 mph), set in 2012. John Isner holds the Grand Slam record at 253 km/h. On the women's side, Sabine Lisicki recorded 211 km/h (131 mph).",
    },
    {
      question: "Can I enter distance in feet instead of meters?",
      answer: "Yes — toggle the Imperial button to switch to feet. The calculator automatically converts feet to meters before computing speed, and always shows results in both km/h and mph.",
    },
    {
      question: "What is the average serve speed on the ATP Tour?",
      answer: "ATP first-serve average is approximately 185–200 km/h (115–124 mph). WTA average is around 155–165 km/h (96–103 mph). Club players typically serve between 100–140 km/h (62–87 mph).",
    },
    {
      question: "How do I measure serve time accurately?",
      answer: "Film at 120fps or higher. Count frames from ball-racket contact to first bounce, then divide by your frame rate to get seconds. Apps like Ubersense or Coach's Eye make this straightforward.",
    },
    {
      question: "What is a good serve speed for a recreational player?",
      answer: "100–140 km/h (62–87 mph) is typical. Breaking 160 km/h (100 mph) is a strong milestone for amateurs. At the club level, placement and spin often matter more than raw speed.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // ── Widget ────────────────────────────────────────────────────────
  const widget = (
    <>
      {/* COURT NOIR font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .cn-widget {
          background: ${CN.noir};
          border-radius: 20px;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        .cn-header {
          position: relative;
          padding: 28px 28px 24px;
          border-bottom: 1px solid ${CN.mid};
          overflow: hidden;
        }
        /* Subtle court lines in header */
        .cn-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, transparent 33%, ${CN.mid} 33%, ${CN.mid} 33.3%, transparent 33.3%),
            linear-gradient(90deg, transparent 66%, ${CN.mid} 66%, ${CN.mid} 66.3%, transparent 66.3%),
            linear-gradient(180deg, transparent 50%, ${CN.mid} 50%, ${CN.mid} 50.4%, transparent 50.4%);
          opacity: 0.3;
          pointer-events: none;
        }
        .cn-body { padding: 24px 28px; }
        .cn-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: ${CN.dim};
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .cn-input {
          background: ${CN.deep} !important;
          border: 1px solid ${CN.mid} !important;
          color: ${CN.cream} !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 15px !important;
          border-radius: 10px !important;
          height: 48px !important;
          transition: border-color 0.2s, box-shadow 0.2s !important;
        }
        .cn-input::placeholder { color: ${CN.muted} !important; }
        .cn-input:focus {
          border-color: ${CN.accent} !important;
          box-shadow: 0 0 0 3px ${CN.accent}22 !important;
          outline: none !important;
        }
        .cn-btn-primary {
          background: ${CN.accent};
          color: ${CN.noir};
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border: none;
          border-radius: 10px;
          height: 48px;
          width: 100%;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 0 0 0 ${CN.accent}00;
        }
        .cn-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px ${CN.accent}40;
        }
        .cn-btn-primary:active { transform: translateY(0); }
        .cn-btn-ghost {
          background: transparent;
          color: ${CN.dim};
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid ${CN.mid};
          border-radius: 10px;
          height: 48px;
          width: 100%;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .cn-btn-ghost:hover { border-color: ${CN.dim}; color: ${CN.cream}; }
        .cn-toggle {
          background: ${CN.deep};
          border: 1px solid ${CN.mid};
          border-radius: 10px;
          overflow: hidden;
        }
        .cn-toggle-btn {
          flex: 1;
          padding: 9px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          border: none;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .cn-toggle-btn.active {
          background: ${CN.accent};
          color: ${CN.noir};
        }
        .cn-toggle-btn:not(.active) {
          background: transparent;
          color: ${CN.dim};
        }
        .cn-toggle-btn:not(.active):hover { color: ${CN.cream}; }

        .cn-result-enter {
          animation: cnResultIn 0.6s cubic-bezier(0.34,1.3,0.64,1) both;
        }
        @keyframes cnResultIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .cn-speed-card {
          background: ${CN.deep};
          border: 1px solid ${CN.mid};
          border-radius: 14px;
          padding: 20px;
          text-align: center;
          flex: 1;
        }
        .cn-speed-label {
          font-size: 9px;
          letter-spacing: 3px;
          font-weight: 600;
          text-transform: uppercase;
          color: ${CN.dim};
          margin-bottom: 6px;
        }
        .cn-speed-value {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 52px;
          line-height: 1;
          color: ${CN.accent};
          text-shadow: 0 0 20px ${CN.accent}60;
        }
        .cn-speed-value.mph {
          color: ${CN.cream};
          text-shadow: none;
          font-size: 48px;
        }
        .cn-speed-unit {
          font-size: 10px;
          color: ${CN.dim};
          margin-top: 4px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .cn-tier {
          text-align: center;
          padding: 16px;
          background: ${CN.deep};
          border: 1px solid ${CN.mid};
          border-radius: 14px;
        }
        .cn-tier-label {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 26px;
          color: ${CN.accent};
        }
        .cn-tier-label.glow { text-shadow: 0 0 24px ${CN.accent}80; }
        .cn-tier-sub {
          font-size: 12px;
          color: ${CN.dim};
          margin-top: 2px;
        }
        .cn-tier-pct {
          display: inline-block;
          margin-top: 8px;
          font-size: 11px;
          color: ${CN.cream};
          background: ${CN.mid};
          border-radius: 100px;
          padding: 3px 12px;
        }
        .cn-gauge-wrap {
          background: ${CN.deep};
          border: 1px solid ${CN.mid};
          border-radius: 14px;
          padding: 16px 16px 8px;
        }
        .cn-gauge-label {
          font-size: 9px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: ${CN.dim};
          text-align: center;
          margin-bottom: 4px;
        }
        .cn-chart-wrap {
          background: ${CN.deep};
          border: 1px solid ${CN.mid};
          border-radius: 14px;
          padding: 20px;
        }
        .cn-chart-title {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 17px;
          color: ${CN.cream};
          margin-bottom: 4px;
        }
        .cn-chart-sub {
          font-size: 11px;
          color: ${CN.dim};
          margin-bottom: 16px;
        }
        .cn-warn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fbbf24;
          font-size: 13px;
          padding: 12px 16px;
          background: #78350f22;
          border: 1px solid #78350f;
          border-radius: 10px;
        }
        .cn-divider {
          height: 1px;
          background: ${CN.mid};
          margin: 0;
        }
      `}</style>

      <div className="cn-widget">
        {/* ── Header ── */}
        <div className="cn-header">
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 40, lineHeight: 1 }}>🎾</span>
            <div>
              <div style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 22,
                color: CN.cream,
                lineHeight: 1.1,
              }}>
                Serve Speed Calculator
              </div>
              <div style={{ fontSize: 12, color: CN.dim, marginTop: 3, letterSpacing: 1 }}>
                km/h · mph · Pro benchmarks
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="cn-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Unit toggle */}
          <div>
            <div className="cn-label"><ArrowRightLeft size={11} /> Unit System</div>
            <div className="cn-toggle flex flex-col sm:flex-row">
              <button
                id="unit-metric"
                className={`cn-toggle-btn${unit === "metric" ? " active" : ""}`}
                onClick={() => { setUnit("metric"); setInputs({ distance: "", time: "" }); setHasResult(false); }}
              >
                Metric (m, km/h)
              </button>
              <button
                id="unit-imperial"
                className={`cn-toggle-btn${unit === "imperial" ? " active" : ""}`}
                onClick={() => { setUnit("imperial"); setInputs({ distance: "", time: "" }); setHasResult(false); }}
              >
                Imperial (ft, mph)
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="cn-label"><Flag size={11} /> Distance ({distLabel})</div>
              <input
                id="distance"
                type="number"
                min="0"
                step="0.01"
                placeholder={distPlaceholder}
                value={inputs.distance}
                onChange={(e) => handleInputChange("distance", e.target.value)}
                className="cn-input"
                style={{
                  background: CN.deep,
                  border: `1px solid ${CN.mid}`,
                  color: CN.cream,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  borderRadius: 10,
                  height: 48,
                  width: "100%",
                  paddingLeft: 14,
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                aria-describedby="distance-desc"
              />
              <p id="distance-desc" style={{ fontSize: 11, color: CN.dim, marginTop: 5 }}>
                Baseline to first bounce
              </p>
            </div>
            <div>
              <div className="cn-label"><Timer size={11} /> Time (seconds)</div>
              <input
                id="time"
                type="number"
                min="0"
                step="0.001"
                placeholder="e.g. 0.35"
                value={inputs.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                className="cn-input"
                style={{
                  background: CN.deep,
                  border: `1px solid ${CN.mid}`,
                  color: CN.cream,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  borderRadius: 10,
                  height: 48,
                  width: "100%",
                  paddingLeft: 14,
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                aria-describedby="time-desc"
              />
              <p id="time-desc" style={{ fontSize: 11, color: CN.dim, marginTop: 5 }}>
                Impact to bounce
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="calculate-btn"
              className="cn-btn-primary flex-1"
              onClick={() => setInputs((p) => ({ ...p }))}
              aria-label="Calculate serve speed"
            >
              <Gauge size={14} style={{ display: "inline", marginRight: 8, verticalAlign: "middle" }} />
              Calculate Speed
            </button>
            <button
              id="reset-btn"
              className="cn-btn-ghost w-full sm:w-auto px-6"
              onClick={() => { setInputs({ distance: "", time: "" }); setHasResult(false); }}
              aria-label="Reset"
            >
              <RotateCcw size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              Reset
            </button>
          </div>

          {/* Warning */}
          {results.warning && inputs.distance && inputs.time && (
            <div className="cn-warn">
              <AlertTriangle size={16} /> {results.warning}
            </div>
          )}

          {/* ── Results ── */}
          {results.kmh !== null && !results.warning && (
            <div className="cn-result-enter" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              <div className="cn-divider" />

              {/* Speed cards */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="cn-speed-card">
                  <div className="cn-speed-label">km / h</div>
                  <div className="cn-speed-value">{results.kmh.toFixed(1)}</div>
                  <div className="cn-speed-unit">kilometers · hour</div>
                </div>
                <div className="cn-speed-card">
                  <div className="cn-speed-label">mph</div>
                  <div className="cn-speed-value mph">{results.mph!.toFixed(1)}</div>
                  <div className="cn-speed-unit">miles · hour</div>
                </div>
              </div>

              {/* Tier badge */}
              {tier && (
                <div className="cn-tier">
                  <div className={`cn-tier-label${tier.glow ? " glow" : ""}`}>{tier.label}</div>
                  <div className="cn-tier-sub">{tier.sub}</div>
                  {percentile !== null && (
                    <div className="cn-tier-pct">
                      Faster than ~{percentile}% of all players
                    </div>
                  )}
                </div>
              )}

              {/* Gauge */}
              <div className="cn-gauge-wrap">
                <div className="cn-gauge-label"><Gauge size={10} style={{ display: "inline", marginRight: 4 }} />Speed Gauge</div>
                <CourtNoir_Speedometer speedKmh={results.kmh} animated={hasResult} />
              </div>

              {/* Comparison chart */}
              <div className="cn-chart-wrap">
                <div className="cn-chart-title">
                  <TrendingUp size={16} style={{ display: "inline", marginRight: 8, color: CN.accent, verticalAlign: "middle" }} />
                  How do you compare?
                </div>
                <div className="cn-chart-sub">Your serve vs. world benchmarks</div>
                <CourtNoir_Chart userKmh={results.kmh} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // ── Benchmark table ────────────────────────────────────────────────
  const benchmarkTable = (
    <section id="benchmark-table" className="scroll-mt-32">
      <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Trophy className="w-7 h-7" style={{ color: CN.accent }} /> Pro Player Speed Benchmarks
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
        Official tournament measurements and validated records — sorted from fastest to slowest.
        Results shown in both km/h and mph.
      </p>
      <div className="overflow-x-auto rounded-2xl shadow-lg" style={{ border: `1px solid ${CN.mid}` }}>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: CN.noir, color: CN.cream }}>
              <th className="text-left px-4 py-3 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.5px" }}>Player</th>
              <th className="text-center px-4 py-3 font-semibold">Flag</th>
              <th className="text-center px-4 py-3 font-semibold">Category</th>
              <th className="text-right px-4 py-3 font-semibold">km/h</th>
              <th className="text-right px-4 py-3 font-semibold">mph</th>
            </tr>
          </thead>
          <tbody>
            {PRO_BENCHMARKS.map((row, i) => (
              <tr
                key={row.player}
                className="border-t transition-colors"
                style={{
                  background: i % 2 === 0
                    ? "white"
                    : "#f8faf8",
                  borderColor: "#e5ede8",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "#e8f5ec"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? "white" : "#f8faf8"; }}
              >
                <td className="px-4 py-3 font-semibold text-slate-800">{row.player}</td>
                <td className="px-4 py-3 text-center text-lg">{row.country}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    row.tag.includes("Record") || row.tag.includes("All-Time")
                      ? "bg-red-100 text-red-700"
                      : row.tag.includes("Average")
                      ? "bg-blue-100 text-blue-700"
                      : row.tag === "Amateur"
                      ? "bg-slate-100 text-slate-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {row.tag}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold" style={{ color: CN.muted }}>
                  {row.kmh}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-blue-700">
                  {kmhToMph(row.kmh).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-3 italic">
        Sources: ATP/WTA official records, Tennis Abstract, Sports Reference.
      </p>
    </section>
  );

  // ── Editorial ──────────────────────────────────────────────────────
  const editorial = (
    <div className="space-y-12">
      {benchmarkTable}

      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Tennis Serve Speed
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Serve speed is measured from the moment of ball contact to the first bounce. This calculator
          applies the physics formula <em>Speed = Distance ÷ Time</em> and outputs results in both
          <strong> km/h</strong> (used internationally and on the ATP/WTA Tour) and <strong>mph</strong>
          (the standard on US broadcasts and Hawk-Eye displays at the US Open).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The average ATP first serve is around 193 km/h (120 mph). The all-time record — 263 km/h
          (163.7 mph) by Sam Groth — remains one of the most impressive athletic feats in sport.
          A strong club player typically serves between 100–140 km/h (62–87 mph).
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Step 1:</strong> Choose <em>Metric</em> (meters) or <em>Imperial</em> (feet).</li>
          <li><strong>Step 2:</strong> Measure the straight-line distance from serve impact to first bounce.</li>
          <li><strong>Step 3:</strong> Record the time in seconds (slow-motion video recommended).</li>
          <li><strong>Step 4:</strong> Click <strong>Calculate Speed</strong> to see km/h and mph instantly.</li>
          <li><strong>Step 5:</strong> Use the gauge and comparison chart to benchmark against the pros.</li>
        </ul>
        <div className="mt-5 p-4 rounded-xl text-sm" style={{ background: "#e8f5ec", border: `1px solid #95d5b2`, color: CN.noir }}>
          <strong>🎾 Court reference:</strong> The baseline-to-service-line distance is exactly 18.29 m (60 ft).
          This is a reliable standard distance for serve measurements.
        </div>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips to Increase Serve Speed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: "💪", title: "Leg Drive", desc: "80% of serve power starts from the legs. Practice explosive knee bend and upward drive mechanics." },
            { icon: "🔄", title: "Hip-Shoulder Separation", desc: "Maximize the kinetic chain. Rotational strength drills and yoga help open this critical range of motion." },
            { icon: "🎯", title: "Contact Point", desc: "Reach full extension at contact — higher is faster. A ball toss slightly in front and above creates the optimal strike zone." },
            { icon: "📈", title: "Track Progress", desc: "Even 5 km/h (3 mph) per month compounds dramatically over a full season. Use this calculator at every practice session." },
          ].map((tip) => (
            <div key={tip.title} className="flex gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-2xl flex-shrink-0">{tip.icon}</span>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">{tip.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Additional Resources</h2>
        <ul className="space-y-4">
          {[
            { href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3761736/",     title: "Biomechanics of the Tennis Serve",            desc: "NIH-published study on serve mechanics and velocity factors." },
            { href: "https://www.itftennis.com/en/news-and-media/articles/tennis-serve-speed-how-to-improve-your-serve/", title: "ITF: How to Improve Your Serve Speed", desc: "Expert coaching guidance from the International Tennis Federation." },
            { href: "https://www.sportsci.org/jour/9804/wilson.html",             title: "Physics of Tennis Ball Speed",               desc: "Academic analysis of physics principles governing ball velocity." },
          ].map((ref) => (
            <li key={ref.href}>
              <a href={ref.href} target="_blank" rel="noopener noreferrer"
                className="font-bold hover:underline flex items-center gap-1" style={{ color: CN.muted }}>
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-500 mt-1">{ref.desc}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Tennis Serve Speed Calculator"
      description="Calculate tennis serve speed in km/h and mph. Compare your result with ATP & WTA professionals using our benchmark table, speed gauge, and visual comparison chart."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Speed (km/h) = (Distance (m) ÷ Time (s)) × 3.6",
        variables: [
          { symbol: "Distance (m)", description: "Straight-line distance from serve impact to first bounce in meters (feet ÷ 3.281 for imperial)" },
          { symbol: "Time (s)",     description: "Time from ball contact to first bounce in seconds" },
          { symbol: "Speed (km/h)", description: "Average serve speed in km/h; divide by 1.609 for mph" },
        ],
      }}
      example={{
        title: "Real-World Example (Imperial)",
        scenario: "A player serves 60 ft (≈ 18.3 m) and slow-motion video shows 0.35 s from impact to bounce.",
        steps: [
          { label: "Step 1", explanation: "Convert distance: 60 ft ÷ 3.281 = 18.29 m." },
          { label: "Step 2", explanation: "Time: 0.35 seconds (from 120fps video)." },
          { label: "Step 3", explanation: "Speed (m/s) = 18.29 ÷ 0.35 = 52.26 m/s." },
          { label: "Step 4", explanation: "Speed (km/h) = 52.26 × 3.6 = 188.1 km/h." },
          { label: "Step 5", explanation: "Speed (mph) = 188.1 ÷ 1.609 = 116.9 mph." },
        ],
        result: "Serve ≈ 188 km/h · 117 mph — Advanced club / entry-level ATP territory.",
      }}
      relatedCalculators={[
        { title: "Tennis ELO / Rating Progress",          url: "/sports/tennis-elo-rating-progress",       icon: "🎾" },
        { title: "Race Time Predictor (Riegel Formula)",  url: "/sports/race-time-predictor-riegel",       icon: "🏆" },
        { title: "Fantasy Team Points Projections",       url: "/sports/fantasy-team-points-projections",  icon: "🏆" },
        { title: "Wilks Coefficient Calculator",          url: "/sports/wilks-coefficient",                icon: "🏋️" },
        { title: "Basketball Pace & ORtg/DRtg",          url: "/sports/basketball-pace-ortg-drtg",        icon: "🏀" },
        { title: "BABIP Calculator",                      url: "/sports/babip-calculator",                 icon: "⚾" },
      ]}
      onThisPage={[
        { id: "benchmark-table", label: "🏆 Pro Benchmarks"   },
        { id: "what-is",         label: "Understanding Speed" },
        { id: "how-to",          label: "How to Use"          },
        { id: "tips",            label: "Training Tips"       },
        { id: "faq",             label: "FAQ"                 },
        { id: "references",      label: "References"          },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}