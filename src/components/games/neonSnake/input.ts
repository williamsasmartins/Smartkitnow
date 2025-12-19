import type { Dir } from "./engine";

export function keyToDir(e: KeyboardEvent): Dir | null {
  const k = (e.key ?? "").toLowerCase();
  const code = e.code ?? "";

  if (k === "arrowup" || k === "up") return "up";
  if (k === "arrowdown" || k === "down") return "down";
  if (k === "arrowleft" || k === "left") return "left";
  if (k === "arrowright" || k === "right") return "right";
  if (code === "ArrowUp") return "up";
  if (code === "ArrowDown") return "down";
  if (code === "ArrowLeft") return "left";
  if (code === "ArrowRight") return "right";

  if (k === "w") return "up";
  if (k === "s") return "down";
  if (k === "a") return "left";
  if (k === "d") return "right";

  if (code === "KeyW") return "up";
  if (code === "KeyS") return "down";
  if (code === "KeyA") return "left";
  if (code === "KeyD") return "right";

  return null;
}
