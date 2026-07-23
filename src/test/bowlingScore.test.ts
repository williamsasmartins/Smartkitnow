import { describe, it, expect } from "vitest";
import { calculateBowlingScore } from "@/components/calculators/Sports/BowlingScoreCalculator";

const frame = (...rolls: number[]) => ({ rolls });

describe("Bowling score", () => {
  it("scores a perfect game as 300", () => {
    const frames = [
      ...Array.from({ length: 9 }, () => frame(10)),
      frame(10, 10, 10),
    ];
    expect(calculateBowlingScore(frames)).toBe(300);
  });

  it("scores all spares with 5s as 150", () => {
    const frames = [
      ...Array.from({ length: 9 }, () => frame(5, 5)),
      frame(5, 5, 5),
    ];
    expect(calculateBowlingScore(frames)).toBe(150);
  });

  it("scores an all-open game by raw pinfall", () => {
    const frames = Array.from({ length: 10 }, () => frame(3, 4));
    expect(calculateBowlingScore(frames)).toBe(70);
  });

  it("counts the second roll after a 10th-frame strike (X-9-8 = 27 in frame 10)", () => {
    const frames = [
      ...Array.from({ length: 9 }, () => frame(0, 0)),
      frame(10, 9, 8),
    ];
    expect(calculateBowlingScore(frames)).toBe(27);
  });

  it("gives a 9th-frame strike its next-two-rolls bonus from the 10th frame", () => {
    const frames = [
      ...Array.from({ length: 8 }, () => frame(0, 0)),
      frame(10),
      frame(7, 2, 0),
    ];
    // 9th frame: 10 + 7 + 2 = 19; 10th: 9 → 28
    expect(calculateBowlingScore(frames)).toBe(28);
  });
});
