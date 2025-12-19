import { describe, it, expect } from "vitest";
import { keyToDir } from "@/components/games/neonSnake/input";

function mockEvent(code: string, key?: string): KeyboardEvent {
  // Create a minimal KeyboardEvent-like object
  return { code, key: key ?? "" } as KeyboardEvent;
}

describe("neonSnake input mapping", () => {
  it("maps Arrow keys correctly", () => {
    expect(keyToDir(mockEvent("ArrowUp"))).toBe("up");
    expect(keyToDir(mockEvent("ArrowDown"))).toBe("down");
    expect(keyToDir(mockEvent("ArrowLeft"))).toBe("left");
    expect(keyToDir(mockEvent("ArrowRight"))).toBe("right");
  });

  it("maps WASD codes correctly", () => {
    expect(keyToDir(mockEvent("KeyW"))).toBe("up");
    expect(keyToDir(mockEvent("KeyS"))).toBe("down");
    expect(keyToDir(mockEvent("KeyA"))).toBe("left");
    expect(keyToDir(mockEvent("KeyD"))).toBe("right");
  });

  it("maps by key fallback for different layouts", () => {
    expect(keyToDir(mockEvent("Unknown", "Up"))).toBe("up");
    expect(keyToDir(mockEvent("Unknown", "down"))).toBe("down");
    expect(keyToDir(mockEvent("Unknown", "LEFT"))).toBe("left");
    expect(keyToDir(mockEvent("Unknown", "right"))).toBe("right");
    expect(keyToDir(mockEvent("Unknown", "w"))).toBe("up");
    expect(keyToDir(mockEvent("Unknown", "S"))).toBe("down");
    expect(keyToDir(mockEvent("Unknown", "a"))).toBe("left");
    expect(keyToDir(mockEvent("Unknown", "D"))).toBe("right");
  });

  it("returns null for unrecognized keys", () => {
    expect(keyToDir(mockEvent("Space"))).toBeNull();
    expect(keyToDir(mockEvent("Unknown", "space"))).toBeNull();
  });
});
