import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GAME_REGISTRY, CATEGORY_LABELS, GameCategory } from "@/data/gameRegistry";
import { Gamepad2, Trophy, Flame } from "lucide-react";

export default function GamesPage() {
    const categories = Array.from(new Set(GAME_REGISTRY.map(g => g.category))) as GameCategory[];

    return (
        <>
            <Helmet>
                <title>Play Free Online Games - Arcade, Puzzle & More | Smart Kit Now</title>
                <meta name="description" content="Play 70+ free online games including Arcade, Puzzle, Board, Card, and Strategy games. No download required. Play now on Smart Kit Now." />
            </Helmet>

            <main className="container mx-auto px-4 pt-48 sm:pt-20 pb-8 max-w-7xl">
                {/* HERO SECTION */}
                <section className="text-center mb-12 py-12 bg-slate-900 rounded-3xl relative overflow-hidden text-white">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                            GAME <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">ZONE</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                            Dive into our collection of 70+ addicting browser games. <br />
                            Free to play. No install needed.
                        </p>
                        <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
                            <Badge variant="secondary" className="px-4 py-2 text-sm md:text-md flex items-center gap-2">
                                <Gamepad2 className="w-4 h-4" /> 70+ Games
                            </Badge>
                            <Badge variant="secondary" className="px-4 py-2 text-sm md:text-md flex items-center gap-2">
                                <Trophy className="w-4 h-4" /> Leaderboards
                            </Badge>
                            <Badge variant="secondary" className="px-4 py-2 text-sm md:text-md flex items-center gap-2">
                                <Flame className="w-4 h-4" /> New Weekly
                            </Badge>
                        </div>
                    </div>
                </section>

                {/* GAME CATEGORY GRIDS */}
                <div className="space-y-12">
                    {categories.map((category) => {
                        const games = GAME_REGISTRY.filter(g => g.category === category);

                        return (
                            <section key={category} id={category}>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white capitalize">
                                    <span className="w-2 h-8 bg-blue-600 rounded-full inline-block" />
                                    {CATEGORY_LABELS[category]}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {games.map((game) => (
                                        <Link to={`/games/${game.slug}`} key={game.slug} className="group">
                                            <Card className="h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700">
                                                <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                                    {/* Placeholder for Thumbnails - Could use gradients or icons */}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 group-hover:scale-105 transition-transform duration-500">
                                                        <Gamepad2 className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                                                    </div>

                                                    {game.slug === 'tic-tac-toe-prime' && (
                                                        <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                                                            PLAYABLE
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardContent className="p-4">
                                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {game.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                                        {game.description}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>
        </>
    );
}
