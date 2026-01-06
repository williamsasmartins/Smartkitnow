export type Pos = { x: number; y: number };

export type Dir = "up" | "down" | "left" | "right";

export type Hit = "none" | "wall" | "self";

export function move(pos: Pos, dir: Dir): Pos {
  switch (dir) {
    case "up":
      return { x: pos.x, y: pos.y - 1 };
    case "down":
      return { x: pos.x, y: pos.y + 1 };
    case "left":
      return { x: pos.x - 1, y: pos.y };
    case "right":
      return { x: pos.x + 1, y: pos.y };
  }
}

export function collision(head: Pos, snake: Pos[], width: number, height: number): Hit {
  if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) return "wall";
  if (snake.some((p) => p.x === head.x && p.y === head.y)) return "self";
  return "none";
}

export function spawnFood(snake: Pos[], width: number, height: number): Pos {
  const maxAttempts = Math.max(1, width * height * 4);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const p: Pos = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!snake.some((s) => s.x === x && s.y === y)) return { x, y };
    }
  }
  return { x: 0, y: 0 };
}

export function step(snake: Pos[], dir: Dir, width: number, height: number, food: Pos) {
  const head = snake[0];
  const nextHead = move(head, dir);

  const hit = collision(nextHead, snake, width, height);
  if (hit !== "none") {
    return { snake, food, ate: false, hit };
  }

  const nextSnake = [nextHead, ...snake];
  const ate = nextHead.x === food.x && nextHead.y === food.y;
  if (!ate) {
    nextSnake.pop();
    return { snake: nextSnake, food, ate: false, hit: "none" as const };
  }

  const nextFood = spawnFood(nextSnake, width, height);
  return { snake: nextSnake, food: nextFood, ate: true, hit: "none" as const };
}

