// src/data/gamesRegistry.ts

export type GameEntry = {
  slug: string;
  title: string;
  description: string;
  category?: string;
  loader: () => Promise<unknown>;
  aliases?: string[];
};

const normalize = (s: string) => (s ?? "").trim().toLowerCase();

export const GAMES: GameEntry[] = [
  {
    slug: "join-dots-connect-four",
    title: "Join Dots (Connect Four)",
    description: "Play Connect Four against a smart AI with difficulty levels and live analysis.",
    category: "Strategy",
    loader: () => import("@/components/games/JoinDotsConnectFour"),
    aliases: ["connect-four", "join-dots"],
  },

  // Everything else can point to ComingSoon until you implement them
  {
    slug: "coming-soon",
    title: "Coming Soon",
    description: "We are building more games for SmartKitNow.",
    category: "Misc",
    loader: () => import("@/components/games/ComingSoonGame"),
  },
];

const index: Record<string, GameEntry> = {};
for (const entry of GAMES) {
  index[normalize(entry.slug)] = entry;
  for (const a of entry.aliases ?? []) index[normalize(a)] = entry;
}

export function getGameEntry(slugOrAlias: string): GameEntry | null {
  return index[normalize(slugOrAlias)] ?? null;
}

export function listGames(): GameEntry[] {
  return GAMES.slice();
}
