// src/pages/DailyQuotesPage.tsx
import { useState } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import DailyHoroscopeWidget from "@/components/calculators/DailyQuotes/DailyHoroscopeWidget";
import QuoteCard, { DailyQuoteItem } from "@/components/calculators/DailyQuotes/QuoteCard";
import { 
  Briefcase, Rocket, Camera, Laptop, 
  Smile, HeartHandshake, Brain, Moon, import { useState, useMemo } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import DailyHoroscopeWidget from "@/components/calculators/DailyQuotes/DailyHoroscopeWidget";
import QuoteCard from "@/components/calculators/DailyQuotes/QuoteCard";
import { 
  Briefcase, Rocket, Camera, Laptop, 
  Smile, HeartHandshake, Brain, Moon, 
  ArrowLeft, Sparkles, RefreshCw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// --- MOCK DATA ---
// (No futuro, o n8n vai gerar 20 frases por categoria, não apenas 3)
const MOCK_DATA = {
  date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" }),
  hero: {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  content: {
    professional: [
      { id: 1, text: "Success is not final, failure is not fatal.", author: "Winston Churchill", tags: ["career"] },
      { id: 2, text: "Work hard in silence, let your success be your noise.", author: "Frank Ocean", tags: ["hustle"] },
      { id: 3, text: "Opportunities don't happen, you create them.", author: "Chris Grosser", tags: ["business"] },
      { id: 101, text: "Quality means doing it right when no one is looking.", author: "Henry Ford", tags: ["quality"] },
      { id: 102, text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", tags: ["focus"] }
    ],
    motivation: [
      { id: 4, text: "Your only limit is your mind.", author: null, tags: ["gym"] },
      { id: 5, text: "Do something today that your future self will thank you for.", author: null, tags: ["focus"] },
      { id: 6, text: "Wake up with determination. Go to bed with satisfaction.", author: null, tags: ["daily"] },
      { id: 103, text: "Little things make big days.", author: null, tags: ["mindset"] }
    ],
    captions: [
      { id: 7, text: "Life is better when you're laughing.", author: null, tags: ["selfie"] },
      { id: 8, text: "Collecting moments, not things. ✈️", author: null, tags: ["travel"] },
      { id: 9, text: "Golden hour glow. ✨", author: null, tags: ["aesthetic"] },
      { id: 104, text: "Sunday Kind of Love.", author: null, tags: ["weekend"] }
    ],
    tech: [
      { id: 10, text: "I don't always test my code, but when I do, I do it in production.", author: null, tags: ["dev"] },
      { id: 11, text: "There is no place like 127.0.0.1", author: null, tags: ["geek"] },
      { id: 105, text: "It works on my machine.", author: null, tags: ["classic"] }
    ],
    fun: [
      { id: 12, text: "I'm not lazy, I'm just on energy saving mode.", author: null, tags: ["funny"] },
      { id: 13, text: "Maybe she's born with it. Maybe it's caffeine.", author: null, tags: ["coffee"] }
    ],
    faith: [
      { id: 14, text: "Faith is taking the first step even when you don't see the whole staircase.", author: "MLK Jr.", tags: ["hope"] },
      { id: 15, text: "Be still, and know that I am God.", author: "Psalm 46:10", tags: ["bible"] }
    ],
    wisdom: [
      { id: 16, text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost", tags: ["life"] },
      { id: 17, text: "The unexamined life is not worth living.", author: "Socrates", tags: ["philosophy"] }
    ]
  }
};

type CategoryKey = keyof typeof MOCK_DATA.content | "horoscope" | "dream";

export default function DailyQuotesPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [shuffleSeed, setShuffleSeed] = useState(0); // Para forçar re-renderização aleatória

  // Função para curtir (Like)
  const toggleLike = (id: number) => {
    const next = new Set(liked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setLiked(next);
  };

  // Função para embaralhar
  const handleShuffle = () => {
    setShuffleSeed(prev => prev + 1);
  };

  // Menu de Categorias (HUB) - REORDENADO
  const CATEGORIES = [
    { id: "horoscope", label: "Daily Horoscope", icon: Sparkles, color: "text-purple-500", desc: "Your zodiac forecast" },
    { id: "dream", label: "Dream Interpreter", icon: Moon, color: "text-indigo-400", desc: "Find the meaning (AI)" },
    { id: "professional", label: "Professional", icon: Briefcase, color: "text-blue-500", desc: "Career & Success" },
    { id: "motivation", label: "Motivation", icon: Rocket, color: "text-orange-500", desc: "Energy & Mindset" },
    { id: "captions", label: "Social Captions", icon: Camera, color: "text-pink-500", desc: "For Instagram/TikTok" },
    { id: "tech", label: "Tech & Geek", icon: Laptop, color: "text-cyan-500", desc: "Coding humor" },
    { id: "fun", label: "Fun & Sarcasm", icon: Smile, color: "text-yellow-500", desc: "Witty & Relatable" },
    { id: "faith", label: "Faith & Verses", icon: HeartHandshake, color: "text-emerald-500", desc: "Spiritual comfort" },
    { id: "wisdom", label: "Wisdom", icon: Brain, color: "text-violet-500", desc: "Famous quotes" },
  ];

  // Filtra e embaralha os itens baseado na categoria
  const currentItems = useMemo(() => {
    if (!selectedCategory || selectedCategory === "horoscope" || selectedCategory === "dream") return [];
    
    const allItems = [...MOCK_DATA.content[selectedCategory as keyof typeof MOCK_DATA.content]];
    
    // Embaralhamento simples (Fisher-Yates shuffle)
    // Usamos 'shuffleSeed' como dependência para re-executar quando clicar no botão
    if (shuffleSeed >= 0) { // Check dummy para usar a variável
        for (let i = allItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
        }
    }
    
    // Retorna apenas os 3 ou 6 primeiros após embaralhar
    return allItems.slice(0, 6); 
  }, [selectedCategory, shuffleSeed]);

  // Componente: Lista de Frases (View Detalhada)
  const renderContent = () => {
    if (selectedCategory === "horoscope") {
      return <DailyHoroscopeWidget showNavigation={false} />;
    }

    if (selectedCategory === "dream") {
      return (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border animate-in fade-in zoom-in-95">
          <div className="w-20 h-20 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
            <Moon className="w-10 h-10 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Dream Interpreter AI</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
            Did you dream about flying, falling, or losing teeth? Our AI interpretation tool is being calibrated to uncover the hidden meanings of your subconscious.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              Go Back
            </Button>
            <Button disabled>Coming Soon</Button>
          </div>
        </div>
      );
    }

    if (currentItems.length === 0) return null;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item) => (
            <QuoteCard
              key={item.id}
              item={item}
              categoryLabel={selectedCategory?.toString() || ""}
              isLiked={liked.has(item.id)}
              onToggleLike={toggleLike}
              tone={selectedCategory === "tech" ? "tech" : "default"}
            />
          ))}
        </div>
        
        {/* Botão de Shuffle */}
        <div className="flex justify-center pt-8 pb-4">
            <Button 
                variant="secondary" 
                size="lg" 
                onClick={handleShuffle}
                className="gap-2 shadow-sm hover:shadow-md transition-all"
            >
                <RefreshCw className="w-4 h-4" />
                Shuffle Suggestions
            </Button>
        </div>
      </div>
    );
  };

  const seoDescription = (
    <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 text-muted-foreground">
      <p className="text-lg leading-relaxed">
        Start your day with clarity and purpose. Explore our comprehensive <strong>Daily Inspiration Hub</strong> featuring 
        accurate <span className="text-foreground font-medium">Horoscope forecasts</span>, 
        deep <span className="text-foreground font-medium">Dream Meanings</span>, and a curated collection of 
        <span className="text-foreground font-medium"> Motivational Quotes</span>.
      </p>
      <p className="text-sm md:text-base opacity-80 hidden sm:block">
        Whether you need the perfect <strong>Instagram caption</strong>, professional wisdom for your career, 
        or spiritual guidance, find the exact words to elevate your mindset every single day.
      </p>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Daily Inspiration Hub"
      description="" // Deixamos vazio aqui para usar o nosso SEO customizado abaixo
      widget={
        <div className="min-h-[600px]">
          {/* SEO Customizado */}
          {!selectedCategory && seoDescription}

          {/* Header da Seção Interna */}
          {selectedCategory && (
            <div className="flex items-center justify-between mb-8">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCategory(null)}
                className="gap-2 pl-0 hover:bg-transparent hover:text-primary group"
              >
                <div className="p-1 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="font-semibold text-lg">Back to Hub</span>
              </Button>
            </div>
          )}

          {/* Estado 1: O HUB (Menu de Categorias) */}
          {!selectedCategory ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => (
                <Card 
                  key={cat.id} 
                  className="cursor-pointer hover:border-primary/50 hover:bg-accent/5 hover:-translate-y-1 transition-all duration-300 group shadow-sm hover:shadow-md"
                  onClick={() => setSelectedCategory(cat.id as CategoryKey)}
                >
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-muted/50 group-hover:bg-background border border-transparent group-hover:border-border transition-colors ${cat.color}`}>
                      <cat.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-none mb-2 group-hover:text-primary transition-colors">
                        {cat.label}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-snug">
                        {cat.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Estado 2: O Conteúdo (Lista)
            <div>
              <div className="mb-6 border-b border-border pb-4">
                <h2 className="text-3xl font-extrabold capitalize flex items-center gap-3">
                  {/* Ícone Dinâmico no Título */}
                  {(() => {
                      const CatIcon = CATEGORIES.find(c => c.id === selectedCategory)?.icon;
                      return CatIcon ? <CatIcon className={`w-8 h-8 ${CATEGORIES.find(c => c.id === selectedCategory)?.color}`} /> : null;
                  })()}
                  {selectedCategory.replace("_", " ")} 
                </h2>
                <p className="text-muted-foreground mt-1 ml-11">
                    Fresh selections for {MOCK_DATA.date}
                </p>
              </div>
              {renderContent()}
            </div>
          )}
        </div>
      }
      showTopBanner
      showSidebar
      showBottomBanner
      hideLegalDisclaimer
    />
  );
}
  ArrowLeft, Share2, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

// --- MOCK DATA (Simulando o que o n8n vai gerar em Lote) ---
// No futuro, isso virá do JSON do GitHub
const MOCK_DATA = {
  date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" }),
  hero: {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  content: {
    professional: [
      { id: 1, text: "Success is not final, failure is not fatal.", author: "Winston Churchill", tags: ["career"] },
      { id: 2, text: "Work hard in silence, let your success be your noise.", author: "Frank Ocean", tags: ["hustle"] },
      { id: 3, text: "Opportunities don't happen, you create them.", author: "Chris Grosser", tags: ["business"] }
    ],
    motivation: [
      { id: 4, text: "Your only limit is your mind.", author: null, tags: ["gym"] },
      { id: 5, text: "Do something today that your future self will thank you for.", author: null, tags: ["focus"] },
      { id: 6, text: "Wake up with determination. Go to bed with satisfaction.", author: null, tags: ["daily"] }
    ],
    captions: [
      { id: 7, text: "Life is better when you're laughing.", author: null, tags: ["selfie"] },
      { id: 8, text: "Collecting moments, not things. ✈️", author: null, tags: ["travel"] },
      { id: 9, text: "Golden hour glow. ✨", author: null, tags: ["aesthetic"] }
    ],
    tech: [
      { id: 10, text: "I don't always test my code, but when I do, I do it in production.", author: null, tags: ["dev"] },
      { id: 11, text: "There is no place like 127.0.0.1", author: null, tags: ["geek"] }
    ],
    fun: [
      { id: 12, text: "I'm not lazy, I'm just on energy saving mode.", author: null, tags: ["funny"] },
      { id: 13, text: "Maybe she's born with it. Maybe it's caffeine.", author: null, tags: ["coffee"] }
    ],
    faith: [
      { id: 14, text: "Faith is taking the first step even when you don't see the whole staircase.", author: "MLK Jr.", tags: ["hope"] },
      { id: 15, text: "Be still, and know that I am God.", author: "Psalm 46:10", tags: ["bible"] }
    ],
    wisdom: [
      { id: 16, text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost", tags: ["life"] },
      { id: 17, text: "The unexamined life is not worth living.", author: "Socrates", tags: ["philosophy"] }
    ]
  }
};

type CategoryKey = keyof typeof MOCK_DATA.content | "horoscope" | "dream";

export default function DailyQuotesPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  // Função para curtir (Like)
  const toggleLike = (id: number) => {
    const next = new Set(liked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setLiked(next);
  };

  // Menu de Categorias (HUB)
  const CATEGORIES = [
    { id: "horoscope", label: "Daily Horoscope", icon: Sparkles, color: "text-purple-500", desc: "Your zodiac forecast" },
    { id: "professional", label: "Professional", icon: Briefcase, color: "text-blue-500", desc: "Career & Success" },
    { id: "motivation", label: "Motivation", icon: Rocket, color: "text-orange-500", desc: "Energy & Mindset" },
    { id: "captions", label: "Social Captions", icon: Camera, color: "text-pink-500", desc: "For Instagram/TikTok" },
    { id: "tech", label: "Tech & Geek", icon: Laptop, color: "text-cyan-500", desc: "Coding humor" },
    { id: "fun", label: "Fun & Sarcasm", icon: Smile, color: "text-yellow-500", desc: "Witty & Relatable" },
    { id: "faith", label: "Faith & Verses", icon: HeartHandshake, color: "text-emerald-500", desc: "Spiritual comfort" },
    { id: "wisdom", label: "Wisdom", icon: Brain, color: "text-indigo-500", desc: "Famous quotes" },
    { id: "dream", label: "Dream Interpreter", icon: Moon, color: "text-slate-400", desc: "Find the meaning (Coming Soon)" },
  ];

  // Componente: Lista de Frases (View Detalhada)
  const renderContent = () => {
    if (selectedCategory === "horoscope") {
      return <DailyHoroscopeWidget showNavigation={false} />;
    }

    if (selectedCategory === "dream") {
      return (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
          <Moon className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Dream Interpreter</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            This AI-powered tool is being calibrated. Soon you will be able to type your dream and get an instant interpretation!
          </p>
          <Button variant="outline" className="mt-6" onClick={() => setSelectedCategory(null)}>
            Go Back
          </Button>
        </div>
      );
    }

    const items = MOCK_DATA.content[selectedCategory as keyof typeof MOCK_DATA.content];

    if (!items) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <QuoteCard
              key={item.id}
              item={item}
              categoryLabel={selectedCategory?.toString() || ""}
              isLiked={liked.has(item.id)}
              onToggleLike={toggleLike}
              tone={selectedCategory === "tech" ? "tech" : "default"}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <CalculatorVerticalLayout
      title="Daily Inspiration Hub"
      description={`Start your day right. Updated for ${MOCK_DATA.date}.`}
      widget={
        <div className="min-h-[600px]">
          {/* Header da Seção */}
          <div className="flex items-center justify-between mb-8">
            {selectedCategory ? (
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCategory(null)}
                className="gap-2 pl-0 hover:bg-transparent hover:text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Categories
              </Button>
            ) : (
              <div className="text-sm text-muted-foreground">
                Select a category to explore today's content
              </div>
            )}
          </div>

          {/* Estado 1: O HUB (Menu de Categorias) */}
          {!selectedCategory ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => (
                <Card 
                  key={cat.id} 
                  className="cursor-pointer hover:border-primary/50 hover:bg-accent/5 transition-all group"
                  onClick={() => setSelectedCategory(cat.id as CategoryKey)}
                >
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-muted group-hover:bg-background border border-transparent group-hover:border-border transition-colors ${cat.color}`}>
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-none mb-2 group-hover:text-primary transition-colors">
                        {cat.label}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-snug">
                        {cat.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Estado 2: O Conteúdo (Lista)
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold capitalize flex items-center gap-2">
                  {selectedCategory.replace("_", " ")} 
                  <span className="text-sm font-normal text-muted-foreground ml-2">(Today's Selection)</span>
                </h2>
              </div>
              {renderContent()}
            </div>
          )}
        </div>
      }
      showTopBanner
      showSidebar
      showBottomBanner
      hideLegalDisclaimer
    />
  );
}
