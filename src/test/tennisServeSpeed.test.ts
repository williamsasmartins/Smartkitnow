import { describe, it, expect } from "vitest";
import {
  DRAG_RETENTION,
  AVG_TO_INITIAL,
  serveInitialSpeedKmh,
} from "@/components/calculators/Sports/TennisServeSpeedCalculator";

describe("Tennis serve speed drag model", () => {
  it("uses a 65% speed-retention factor at the bounce (~35% drag loss)", () => {
    expect(DRAG_RETENTION).toBe(0.65);
  });

  it("derives the avg→initial correction from exponential decay: −ln(r)/(1−r)", () => {
    const expected = Math.log(1 / 0.65) / (1 - 0.65);
    expect(AVG_TO_INITIAL).toBeCloseTo(expected, 12);
    expect(AVG_TO_INITIAL).toBeCloseTo(1.2308, 4);
  });

  it("computes initial speed off the racket, not average flight speed", () => {
    // 18.29 m in 0.35 s → avg 188.1 km/h → V0 ≈ 231.5 km/h
    const v0 = serveInitialSpeedKmh(18.29, 0.35);
    const avg = (18.29 / 0.35) * 3.6;
    expect(avg).toBeCloseTo(188.1, 1);
    expect(v0).toBeCloseTo(avg * AVG_TO_INITIAL, 8);
    expect(v0).toBeCloseTo(231.5, 1);
  });

  it("keeps V0 consistent with the retention model: speed at bounce = V0 × r", () => {
    const v0 = serveInitialSpeedKmh(18.29, 0.35);
    const bounce = v0 * DRAG_RETENTION;
    // bounce speed must sit below the average flight speed (ball decelerates)
    expect(bounce).toBeLessThan((18.29 / 0.35) * 3.6);
    expect(bounce).toBeCloseTo(150.5, 1);
  });

  it("scales linearly with distance and inversely with time", () => {
    expect(serveInitialSpeedKmh(20, 0.5)).toBeCloseTo(serveInitialSpeedKmh(10, 0.5) * 2, 8);
    expect(serveInitialSpeedKmh(20, 0.5)).toBeCloseTo(serveInitialSpeedKmh(20, 1) * 2, 8);
  });
});
