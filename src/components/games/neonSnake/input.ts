import type { Dir } from "./engine";

export function keyToDir(e: Pick<KeyboardEvent, "code" | "key">): Dir | null {
  const code = e.code;
  if (code === "ArrowUp" || code === "KeyW") return "up";
  if (code === "ArrowDown" || code === "KeyS") return "down";
  if (code === "ArrowLeft" || code === "KeyA") return "left";
  if (code === "ArrowRight" || code === "KeyD") return "right";

  const key = (e.key ?? "").trim().toLowerCase();
  if (key === "up") return "up";
  if (key === "down") return "down";
  if (key === "left") return "left";
  if (key === "right") return "right";
  if (key === "w") return "up";
  if (key === "s") return "down";
  if (key === "a") return "left";
  if (key === "d") return "right";

  return null;
}

