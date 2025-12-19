import { describe, it, expect, vi } from "vitest";
import { move, collision, spawnFood, step, type Pos, type Dir } from "@/components/games/neonSnake/engine";

describe("neonSnake engine", () => {
  it("move computes next position", () => {
    expect(move({ x: 2, y: 2 }, "up")).toEqual({ x: 2, y: 1 });
    expect(move({ x: 2, y: 2 }, "down")).toEqual({ x: 2, y: 3 });
    expect(move({ x: 2, y: 2 }, "left")).toEqual({ x: 1, y: 2 });
    expect(move({ x: 2, y: 2 }, "right")).toEqual({ x: 3, y: 2 });
  });

  it("collision detects walls and self", () => {
    const snake: Pos[] = [{ x: 2, y: 2 }, { x: 1, y: 2 }];
    expect(collision({ x: -1, y: 2 }, snake, 10, 10)).toBe("wall");
    expect(collision({ x: 2, y: 2 }, snake, 10, 10)).toBe("self");
    expect(collision({ x: 3, y: 2 }, snake, 10, 10)).toBe("none");
  });

  it("spawnFood never spawns on snake", () => {
    const snake: Pos[] = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
    const f = spawnFood(snake, 4, 4);
    expect(snake.some((p) => p.x === f.x && p.y === f.y)).toBe(false);
  });

  it("step grows when eating and moves forward otherwise", () => {
    const snake: Pos[] = [{ x: 1, y: 1 }];
    const food: Pos = { x: 2, y: 1 };
    const s1 = step(snake, "right", 5, 5, food);
    expect(s1.ate).toBe(true);
    expect(s1.snake.length).toBe(2);
    const rnd = vi.spyOn(Math, "random").mockReturnValue(0.1);
    const s2 = step(s1.snake, "right", 5, 5, s1.food);
    rnd.mockRestore();
    expect(s2.ate).toBe(false);
    expect(s2.hit).toBe("none");
  });
});
