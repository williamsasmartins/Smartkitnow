import React, { useState, useCallback, useEffect } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

type QuestionType = "identify" | "select";
interface Question { type: QuestionType; slices: number; highlighted: number; choices: string[]; answer: string }

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
function simplify(n: number, d: number): string {
  const g = gcd(n, d);
  return n/g === 1 && d/g === 1 ? "1" : `${n/g}/${d/g}`;
}

function makeFraction(slices: number, highlighted: number): string {
  return simplify(highlighted, slices);
}

function wrongChoices(slices: number, highlighted: number, count: number): string[] {
  const correct = makeFraction(slices, highlighted);
  const wrongs = new Set<string>();
  while (wrongs.size < count) {
    const rn = Math.floor(Math.random() * (slices - 1)) + 1;
    const f = makeFraction(slices, rn);
    if (f !== correct) wrongs.add(f);
  }
  return Array.from(wrongs);
}

function generateQuestion(): Question {
  const possibleSlices = [2,3,4,6,8,10,12];
  const slices = possibleSlices[Math.floor(Math.random() * possibleSlices.length)];
  const highlighted = Math.floor(Math.random() * (slices - 1)) + 1;
  const correct = makeFraction(slices, highlighted);
  const wrongs = wrongChoices(slices, highlighted, 3);
  const choices = [...wrongs, correct].sort(() => Math.random() - 0.5);
  return { type: "identify", slices, highlighted, choices, answer: correct };
}

function PizzaSlice({ index, total, highlighted, onClick, selected }: {
  index: number; total: number; highlighted: boolean; onClick?: () => void; selected?: boolean;
}) {
  const angle = (2 * Math.PI) / total;
  const startAngle = index * angle - Math.PI / 2;
  const endAngle = startAngle + angle;
  const r = 90;
  const cx = 100, cy = 100;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = angle > Math.PI ? 1 : 0;
  const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
  const fill = highlighted
    ? (selected ? "#dc2626" : "#ef4444")
    : "#fbbf24";
  const stroke = selected ? "#991b1b" : "#d97706";

  return (
    <path d={d} fill={fill} stroke={stroke} strokeWidth={2}
      style={{ cursor: onClick ? "pointer" : "default", filter: highlighted ? "drop-shadow(0 0 4px #ef4444)" : "none" }}
      onClick={onClick} />
  );
}

function Pizza({ slices, highlighted, onSliceClick, selectedSlices }: {
  slices: number; highlighted: number; onSliceClick?: (i: number) => void; selectedSlices?: Set<number>;
}) {
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-56 sm:h-56">
      <circle cx="100" cy="100" r="92" fill="#78350f" />
      <circle cx="100" cy="100" r="90" fill="#fbbf24" />
      {Array.from({ length: slices }, (_, i) => (
        <PizzaSlice key={i} index={i} total={slices}
          highlighted={onSliceClick ? !!(selectedSlices?.has(i)) : i < highlighted}
          selected={onSliceClick ? !!(selectedSlices?.has(i)) : i < highlighted}
          onClick={onSliceClick ? () => onSliceClick(i) : undefined} />
      ))}
      <circle cx="100" cy="100" r="8" fill="#92400e" />
      {/* slice lines */}
      {Array.from({ length: slices }, (_, i) => {
        const angle = (i * 2 * Math.PI / slices) - Math.PI / 2;
        return <line key={i} x1="100" y1="100" x2={100 + 90 * Math.cos(angle)} y2={100 + 90 * Math.sin(angle)}
          stroke="#92400e" strokeWidth="1.5" />;
      })}
    </svg>
  );
}

function PizzaGame() {
  const [question, setQuestion] = useState<Question>(generateQuestion);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<"correct"|"wrong"|null>(null);
  const [answered, setAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem("hs_fraction-pizza") || "0"));

  const next = useCallback(() => {
    setQuestion(generateQuestion());
    setFeedback(null);
    setAnswered(false);
  }, []);

  const choose = useCallback((choice: string) => {
    if (answered) return;
    setAnswered(true);
    const correct = choice === question.answer;
    setFeedback(correct ? "correct" : "wrong");
    setTotal(t => t + 1);
    if (correct) {
      const ns = score + 1;
      setScore(ns);
      setStreak(s => s + 1);
      if (ns > best) { setBest(ns); localStorage.setItem("hs_fraction-pizza", String(ns)); }
    } else {
      setStreak(0);
    }
    setTimeout(next, 1200);
  }, [answered, question, score, best, next]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Stats */}
      <div className="flex gap-6 text-sm">
        <span className="text-green-400">✓ {score}</span>
        <span className="text-slate-400">/ {total}</span>
        <span className="text-yellow-400">🔥 {streak}</span>
        <span className="text-purple-400">Best: {best}</span>
      </div>

      {/* Question */}
      <div className="text-center">
        <p className="text-lg font-semibold text-white mb-1">What fraction of the pizza is highlighted?</p>
        <p className="text-sm text-slate-400">{question.slices} total slices, {question.highlighted} highlighted</p>
      </div>

      {/* Pizza */}
      <div className={`transition-transform ${feedback === "correct" ? "scale-110" : feedback === "wrong" ? "scale-95" : ""}`}>
        <Pizza slices={question.slices} highlighted={question.highlighted} />
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`font-bold text-lg ${feedback === "correct" ? "text-green-400" : "text-red-400"}`}>
          {feedback === "correct" ? "🎉 Correct!" : `❌ Answer: ${question.answer}`}
        </div>
      )}

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {question.choices.map(c => (
          <button key={c} onClick={() => choose(c)} disabled={answered}
            className={`py-3 rounded-xl text-lg font-bold transition-all border-2
              ${answered
                ? c === question.answer ? "bg-green-600 border-green-400 text-white"
                  : feedback === "wrong" && c !== question.answer ? "bg-slate-800 border-slate-600 text-slate-500 opacity-50"
                  : "bg-slate-800 border-slate-600 text-slate-300"
                : "bg-slate-800 border-slate-600 text-white hover:bg-slate-700 hover:border-yellow-400"}`}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FractionPizzaGame() {
  return (
    <CalculatorVerticalLayout
      title="Fraction Pizza"
      description="Learn fractions with delicious pizza slices! Identify the correct fraction shown by highlighted pizza slices in this fun educational math game."
      canonical="https://www.smartkitnow.com/games/fraction-pizza"
      widget={<PizzaGame />}
      editorial={
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <h2 className="text-xl font-bold">How to Play Fraction Pizza</h2>
          <p>Look at the pizza and count how many slices are highlighted (red). Then pick the fraction that represents those slices out of the total.</p>
          <p><strong>Example:</strong> If 3 out of 8 slices are red, the answer is 3/8. Some fractions simplify: 4/8 = 1/2.</p>
          <p>Build your streak for maximum points! Fractions are always shown in their simplest form.</p>
        </div>
      }
      contentMaxWidth="max-w-2xl"
    />
  );
}
