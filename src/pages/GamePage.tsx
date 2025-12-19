import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import { getGameEntry } from "@/data/gamesRegistry";

function useLazyFromLoader(loader: () => Promise<any>) {
  const Lazy = React.lazy(async () => {
    const mod = await loader();
    return { default: mod.default ?? Object.values(mod)[0] };
  });
  return Lazy;
}

export default function GamePage() {
  const { slug } = useParams();
  const gameSlug = (slug ?? "").toLowerCase();
  const entry = gameSlug ? getGameEntry(gameSlug) : null;

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl px-4 lg:px-6 py-10">
        <h1 className="text-2xl font-bold text-[#5c82ee]">Game not found</h1>
        <p className="mt-2 text-muted-foreground">We couldn't find this game. Please use the site menu.</p>
      </div>
    );
  }

  const LazyGame = useLazyFromLoader(entry.loader);

  return (
    <div className="w-full px-4 md:px-8 lg:px-10">
      <div className="max-w-none">
        <Suspense fallback={<div className="py-10 text-muted-foreground text-center">Loading Game...</div>}>
          <main className="min-w-0">
            <LazyGame title={entry.title} description={entry.description} />
          </main>
        </Suspense>
      </div>
    </div>
  );
}
