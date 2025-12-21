/* SmartKitNow — Games Registry (single source of truth)
   - Each game must have a unique slug under /games/:slug
   - loader must point to the game component default export
*/

export type GameRegistryEntry = {
  slug: string;
  title: string;
  description: string;
  loader: () => Promise<any>;
  comingSoon?: boolean;
};

export const GAMES: GameRegistryEntry[] = [
  {
    slug: "join-dots-connect-four",
    title: "Join Dots (Connect Four)",
    description: "Play Connect Four against a smart AI with difficulty levels and live analysis.",
    loader: () => import("../components/games/JoinDotsConnectFour"),
    comingSoon: false,
  },
  {
    slug: "neon-snake",
    title: "Neon Snake",
    description: "Slither through a neon grid. Eat, grow, and avoid collisions. Arrow keys or WASD to move.",
    loader: () => import("../components/games/NeonSnake"),
    comingSoon: false,
  },
  {
    slug: "astro-breakout",
    title: "Astro Breakout",
    description:
      "A premium Breakout experience: power-ups, multi-ball, smooth physics, mobile controls, and full-screen theater mode.",
    loader: () => import("../components/games/AstroBreakout"),
    comingSoon: false,
  },
  {
    slug: "brick-dash",
    title: "Brick Dash",
    description:
      "Dodge falling brick walls and dash through tight gaps. Desktop + mobile controls, fullscreen, combos, and power-ups.",
    loader: () => import("../components/games/BrickDash"),
    comingSoon: false,
  },
];

function normalizeSlug(slugOrAlias: string) {
  return (slugOrAlias || "").trim().toLowerCase();
}

const bySlug = new Map<string, GameRegistryEntry>(GAMES.map((g) => [g.slug, g]));

// Keep aliases minimal; add only when you change a slug later.
const ALIASES: Record<string, string> = {
  // example:
  // "join-dots": "join-dots-connect-four",
};

export function getGameEntry(slugOrAlias: string | undefined | null): GameRegistryEntry | null {
  const key = normalizeSlug(slugOrAlias || "");
  if (!key) return null;

  const canonical = ALIASES[key] ?? key;
  return bySlug.get(canonical) ?? null;
}

export function listGames(): GameRegistryEntry[] {
  return GAMES.slice();
}
