import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the calculator registry so tests don't depend on real data
vi.mock("@/data/calculatorRegistry", () => {
  return {
    getEntry: vi.fn((slug?: string) => {
      if (!slug) return undefined;
      switch (slug) {
        case "turkey-cooking-time":
          return { category: "cooking", subcategory: "turkey" };
        case "pizza":
          return { category: "cooking" }; // no subcategory
        case "amps-to-watts":
          return { category: "electrical" };
        default:
          return undefined;
      }
    }),
  };
});

import { computeBackPath } from "@/lib/navigation";
import { getEntry } from "@/data/calculatorRegistry";

const mockedGetEntry = getEntry as unknown as ReturnType<typeof vi.fn>;

describe("computeBackPath", () => {
  beforeEach(() => {
    // Reset mock calls state between tests
    vi.clearAllMocks();
  });

  it("returns / when no category and no defaults", () => {
    const path = computeBackPath(undefined);
    expect(path).toBe("/");
  });

  it("uses default category when slug is missing", () => {
    const path = computeBackPath(undefined, "math");
    expect(path).toBe("/math");
  });

  it("uses fallback subcategory when provided without registry entry", () => {
    const path = computeBackPath(undefined, "cooking", "turkey");
    expect(path).toBe("/cooking/turkey");
  });

  it("returns /category when registry has category only", () => {
    const path = computeBackPath("pizza");
    expect(path).toBe("/cooking");
  });

  it("returns /category/subcategory when both exist in registry", () => {
    const path = computeBackPath("turkey-cooking-time");
    expect(path).toBe("/cooking/turkey");
  });

  it("prefers registry subcategory over fallbackSubcategory when both provided", () => {
    const path = computeBackPath("turkey-cooking-time", "cooking", "other-subcat");
    expect(path).toBe("/cooking/turkey");
  });

  it("falls back to defaultCategory when slug not found", () => {
    const path = computeBackPath("non-existent-slug", "science");
    expect(path).toBe("/science");
  });
});