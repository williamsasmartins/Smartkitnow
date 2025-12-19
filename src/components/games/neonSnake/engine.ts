export type Pos = { x: number; y: number };
export type Dir = "up" | "down" | "left" | "right";

export function move(head: Pos, dir: Dir): Pos {
  if (dir === "up") return { x: head.x, y: head.y - 1 };
  if (dir === "down") return { x: head.x, y: head.y + 1 };
  if (dir === "left") return { x: head.x - 1, y: head.y };
  return { x: head.x + 1, y: head.y };
}

export function isSame(a: Pos, b: Pos): boolean {
  return a.x === b.x && a.y === b.y;
}

export function collision(next: Pos, snake: Pos[], w: number, h: number): "none" | "wall" | "self" {
  if (next.x < 0 || next.y < 0 || next.x >= w || next.y >= h) return "wall";
  for (let i = 0; i < snake.length; i++) {
    if (isSame(next, snake[i])) return "self";
  }
  return "none";
}

export function spawnFood(snake: Pos[], w: number, h: number): Pos {
  const used = new Set(snake.map((p) => `${p.x}:${p.y}`));
  let x = 0, y = 0;
  do {
    x = Math.floor(Math.random() * w);
    y = Math.floor(Math.random() * h);
  } while (used.has(`${x}:${y}`));
  return { x, y };
}

export function step(
  snake: Pos[],
  dir: Dir,
  w: number,
  h: number,
  food: Pos
): { snake: Pos[]; food: Pos; ate: boolean; hit: "none" | "wall" | "self" } {
  const head = snake[0];
  const nextHead = move(head, dir);
  const hit = collision(nextHead, snake, w, h);
  if (hit !== "none") {
    return { snake, food, ate: false, hit };
  }
  const ate = isSame(nextHead, food);
  const nextSnake = [nextHead, ...snake];
  if (!ate) nextSnake.pop();
  const nextFood = ate ? spawnFood(nextSnake, w, h) : food;
  return { snake: nextSnake, food: nextFood, ate, hit: "none" };
}
