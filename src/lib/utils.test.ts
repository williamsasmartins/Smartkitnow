import { describe, expect, it } from "vitest";
import { LB_PER_KG, convertWeight, formatNumberForInput, kgToWeight, weightToKg } from "@/lib/utils";

describe("weight units", () => {
  it("converts lb to kg", () => {
    expect(weightToKg(LB_PER_KG, "lb")).toBeCloseTo(1, 10);
  });

  it("converts kg to lb", () => {
    expect(kgToWeight(1, "lb")).toBeCloseTo(LB_PER_KG, 10);
  });

  it("round-trips kg→lb→kg", () => {
    const kg = 12.34;
    const lb = convertWeight(kg, "kg", "lb");
    const back = convertWeight(lb, "lb", "kg");
    expect(back).toBeCloseTo(kg, 10);
  });
});

describe("formatNumberForInput", () => {
  it("returns empty string for non-finite values", () => {
    expect(formatNumberForInput(Number.NaN)).toBe("");
    expect(formatNumberForInput(Number.POSITIVE_INFINITY)).toBe("");
  });

  it("trims trailing zeros", () => {
    expect(formatNumberForInput(10)).toBe("10");
    expect(formatNumberForInput(10.5)).toBe("10.5");
    expect(formatNumberForInput(10.2)).toBe("10.2");
  });

  it("respects max fraction digits", () => {
    expect(formatNumberForInput(10.129, 2)).toBe("10.13");
    expect(formatNumberForInput(10.1, 2)).toBe("10.1");
  });
});

