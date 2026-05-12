import { ReactNode, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { safeJsonLd } from "@/lib/utils";
import { Maximize2, Minimize2, Share2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GameLayoutProps {
  title: string;
  description: string;
  slug: string; // Ex: 'neon-snake' (usado para canonical URL)
  category: string;
  gameComponent: ReactNode; // Aqui entra o componente do jogo (Canvas/Divs)
  instructions: ReactNode; // Texto explicativo para SEO
  relatedGames?: { title: string; href: string }[];
}

export default function GameLayout({
  title,
  description,
  slug,
  category,
  gameComponent,
  instructions,
  relatedGames = [],
}: GameLayoutProps) {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Lógica de Tela Cheia
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      gameContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Canonical URL limpa (Resolve o erro do Google Search Console)
  const canonicalUrl = `https://www.smartkitnow.com/games/${slug}`;

  return (
    <>
      <Helmet>
        <title>{title} - Play Free Online | Smart Kit Now</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Schema.org para Jogos (Google adora isso) */}
        <script type="application/ld+json">
          {safeJsonLd({
            "@context": "https://schema.org",
            "@type": "VideoGame",
            "name": title,
            "description": description,
            "genre": category,
            "playMode": "SinglePlayer",
            "url": canonicalUrl,
            "inLanguage": "en",
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* --- AD SPACE (TOP BANNER) --- */}
        <div className="w-full h-[90px] bg-slate-100 dark:bg-slate-800 mb-6 flex items-center justify-center rounded-lg border border-dashed border-slate-300">
          <span className="text-xs text-slate-400">ADVERTISEMENT (Top Banner)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- COLUNA PRINCIPAL (JOGO) --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Cabeçalho do Jogo */}
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">{category}</Badge>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => {/* Lógica de Share */}}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* CONTAINER DO JOGO */}
            <Card className="overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-950 shadow-2xl">
              <div 
                ref={gameContainerRef} 
                className={`relative w-full ${isFullscreen ? 'h-screen flex items-center justify-center bg-black' : 'aspect-video'}`}
              >
                {/* O Jogo é renderizado AQUI */}
                {gameComponent}

                {/* Botão Flutuante de Fullscreen */}
                <div className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity z-50">
                   <Button 
                    size="icon" 
                    variant="secondary" 
                    className="rounded-full bg-black/50 text-white hover:bg-black/70 border-none"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              
              {/* Barra de Controles Inferior (Opcional) */}
              <div className="bg-slate-100 dark:bg-slate-900 p-3 flex justify-between items-center text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <Info className="h-4 w-4" /> Use arrow keys or touch to play
                </span>
                <span>Best Score saved automatically</span>
              </div>
            </Card>

            {/* --- AD SPACE (MOBILE MIDDLE) --- */}
            <div className="lg:hidden w-full h-[250px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-lg border border-dashed border-slate-300">
              <span className="text-xs text-slate-400">AD SPACE (Mobile)</span>
            </div>

            {/* Texto Editorial (SEO) */}
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">How to Play {title}</h2>
              {instructions}
            </div>
          </div>

          {/* --- SIDEBAR (ADS + RELATED) --- */}
          <div className="space-y-6">
             {/* Ad Sidebar */}
            <div className="w-full h-[600px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-lg border border-dashed border-slate-300 sticky top-4">
              <span className="text-xs text-slate-400">AD SPACE (Sidebar Sticky)</span>
            </div>

            {/* Related Games */}
            {relatedGames.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-3">You might also like</h3>
                  <ul className="space-y-2">
                    {relatedGames.map((game, i) => (
                      <li key={i}>
                        <a href={game.href} className="text-blue-600 hover:underline text-sm block py-1">
                          {game.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
