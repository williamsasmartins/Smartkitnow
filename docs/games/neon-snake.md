# Neon Snake

Path: `/games/neon-snake`

Overview: Neon-themed Snake game built with the same page layout, controls, and overlay patterns as other games. Uses canvas rendering, keyboard controls (Arrow keys/WASD), difficulty selection, score, levels, and victory overlay with confetti and sound.

Basic controls:
- Arrow keys or WASD to move
- R to restart
- 1/2/3 to set difficulty
- P to pause

Controls reliability:
- Keyboard input mapping unified via `keyToDir` to support `e.code` and `e.key` across layouts.
- Arrow keys call `preventDefault()` to avoid page scrolling while playing.
- Canvas is focusable (`tabIndex=0`) to ensure consistent capture.
- Input errors are safely handled (console debug) without breaking the game loop.

Victory:
- Reach target length to win. Confetti and sound play, with auto-restart and Restart button.

Architecture:
- Component: `src/components/games/NeonSnake.tsx`
- Engine utilities: `src/components/games/neonSnake/engine.ts`
- Input utilities: `src/components/games/neonSnake/input.ts`
- Registry: `src/data/gamesRegistry.ts` with `loader: () => import("../components/games/NeonSnake")`
- Tests: `src/components/games/__tests__/neonSnake.spec.ts` (Vitest)
- Tests (input): `src/components/games/__tests__/neonSnake.input.spec.ts`

Deploy:
- Same Vite build and Vercel config as the project. No special requirements.
