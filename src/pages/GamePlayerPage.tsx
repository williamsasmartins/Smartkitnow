import { Suspense } from "react";
import { useParams } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { getGameBySlug } from "@/data/gameRegistry";
import { getGameContent } from "@/data/gameContent";
import GameLayout from "@/components/templates/GamePageLayout";

const GameLoadingFallback = () => (
    <div className="flex items-center justify-center py-20 text-slate-500 dark:text-slate-400">
        Loading game…
    </div>
);

export default function GamePlayerPage() {
    const { slug } = useParams();
    const game = getGameBySlug(slug || "");

    if (!game) {
        return <NotFound />;
    }

    const GameComponent = game.component;

    // Direct render for games that handle their own layout (page components, not just board components)
    if (game.useCustomLayout) {
        return (
            <Suspense fallback={<GameLoadingFallback />}>
                <GameComponent />
            </Suspense>
        );
    }

    // Category-aware, per-game copy so every game page carries distinctive text
    // (controls, strategy, tips) instead of shared boilerplate — avoids the
    // duplicate/thin-content risk across the ~70 indexed game pages.
    const content = getGameContent(game);

    return (
        <GameLayout
            title={game.title}
            description={game.description}
            slug={game.slug}
            category={game.category}
            gameComponent={
                <Suspense fallback={<GameLoadingFallback />}>
                    <GameComponent />
                </Suspense>
            }
            instructions={
                <div className="space-y-4">
                    <p>{content.intro}</p>
                    <p>
                        <strong>How to play {game.title}:</strong> {content.objective}
                    </p>
                    <p>
                        <strong>Controls:</strong> {content.controls}
                    </p>
                    <p>
                        <strong>Strategy:</strong> {content.strategy}
                    </p>
                    <p className="text-sm text-slate-500 italic">
                        Tip: {content.tip} Use the &ldquo;Fullscreen&rdquo; button for the best experience.
                    </p>
                </div>
            }
            relatedGames={[]} // Could implement a logic to find related games here
        />
    );
}
