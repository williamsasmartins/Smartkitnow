import { useParams } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { getGameBySlug } from "@/data/gameRegistry";
import GameLayout from "@/components/templates/GamePageLayout";

export default function GamePlayerPage() {
    const { slug } = useParams();
    const game = getGameBySlug(slug || "");

    if (!game) {
        return <NotFound />;
    }

    const GameComponent = game.component;

    return (
        <GameLayout
            title={game.title}
            description={game.description}
            slug={game.slug}
            category={game.category}
            gameComponent={<GameComponent />}
            instructions={
                <div className="space-y-4">
                    <p>
                        Welcome to <strong>{game.title}</strong>! This game is part of our {game.category} collection.
                    </p>
                    <p>
                        <strong>Objective:</strong> {game.description}
                    </p>
                    <p>
                        <strong>Controls:</strong> Most games can be played with a mouse or touch screen.
                        For some arcade games, use the Arrow Keys to move and Spacebar to perform actions.
                    </p>
                    <p className="text-sm text-slate-500 italic">
                        Tip: Use the "Fullscreen" button for the best experience.
                    </p>
                </div>
            }
            relatedGames={[]} // Could implement a logic to find related games here
        />
    );
}
