import React, { useState } from "react";
import { Helmet } from "react-helmet-async"; // ✅ Correção: Usa a lib correta para Vite
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, Users, Flame, ChefHat, Info, 
  Share2, MessageSquare, Copy, Facebook, Twitter, Mail 
} from "lucide-react";

// --- TIPOS ---
interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  text?: string;
}

interface Nutrition {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

interface RecipeLayoutProps {
  title: string;
  description: string;
  imagePath: string;
  prepTime: string;
  cookTime: string;
  difficulty: string;
  servingsDefault: number;
  ingredients: Ingredient[];
  nutrition: Nutrition;
  editorial: React.ReactNode;
  faqs: { question: string; answer: string }[];
  jsonLd: any;
  showSuggestionBox?: boolean;
  showShareButtons?: boolean;
}

export default function RecipeLayout({
  title,
  description,
  imagePath,
  prepTime,
  cookTime,
  difficulty,
  servingsDefault,
  ingredients,
  nutrition,
  editorial,
  faqs,
  jsonLd,
  showSuggestionBox = true,
  showShareButtons = true
}: RecipeLayoutProps) {
  
  const [servings, setServings] = useState(servingsDefault);

  const getAmount = (base: number) => {
    const val = (base * (servings / servingsDefault));
    return Number.isInteger(val) ? val : parseFloat(val.toFixed(2));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // Idealmente usar um toast aqui, mas alert funciona para teste
    alert("Link copied!");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 pb-20">
      
      {/* ✅ SEO COMPATÍVEL COM VITE */}
      <Helmet>
        <title>{title} | Smart Kit Now</title>
        <meta name="description" content={description} />
        <meta property="og:image" content={imagePath} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      {/* HERO SECTION */}
      <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-6">
              <div className="flex gap-2">
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200">
                  Authentic Recipe
                </Badge>
                <Badge variant="outline" className="text-slate-500 border-slate-300">
                  {difficulty}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {title}
              </h1>
              
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {description}
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase">Prep</span>
                    <span>{prepTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium">
                  <Flame className="w-4 h-4 text-red-500" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase">Cook</span>
                    <span>{cookTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 bg-slate-200 dark:bg-slate-800">
              <img 
                src={imagePath} 
                alt={title} 
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* SIDEBAR */}
          <aside className="lg:col-span-4 order-2 lg:order-2 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              
              <Card className="border-orange-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardHeader className="bg-orange-50/50 dark:bg-slate-900 border-b border-orange-100 dark:border-slate-800 pb-4">
                  <div className="flex flex-col gap-4">
                    <CardTitle className="text-xl flex items-center gap-2 text-orange-800 dark:text-orange-400">
                      <Users className="w-5 h-5" /> Ingredients
                    </CardTitle>
                    
                    <div className="flex items-center justify-between bg-white dark:bg-slate-950 p-2 rounded-lg border border-orange-100 dark:border-slate-800">
                      <span className="text-xs font-semibold text-slate-500 uppercase px-2">Servings:</span>
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full" onClick={() => setServings(s => Math.max(1, s - 1))}>-</Button>
                        <span className="font-bold text-lg w-6 text-center">{servings}</span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full" onClick={() => setServings(s => s + 1)}>+</Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 bg-white dark:bg-slate-950">
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {ingredients.map((ing, i) => (
                      <li key={i} className="flex justify-between items-start p-3 md:p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <div className="flex-1 pr-2">
                          <span className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium block">
                            {ing.text || ing.name}
                          </span>
                        </div>
                        <span className="text-orange-600 dark:text-orange-400 font-bold whitespace-nowrap bg-orange-50 dark:bg-orange-950/30 px-2 py-1 rounded text-xs md:text-sm">
                          {getAmount(ing.amount)} {ing.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500"/> Nutrition
                </h3>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  {Object.entries(nutrition).map(([key, val]) => (
                    <div key={key} className="text-center p-2 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{val}</div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{key}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="lg:col-span-8 order-1 lg:order-1">
            <div className="space-y-8 md:space-y-12">
                {editorial}

                <Separator className="my-8 md:my-12" />

                {/* SHARE & SUGGESTION */}
                <div className="grid gap-6">
                  {showShareButtons && (
                    <section className="bg-slate-50 dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                      <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                        <Share2 className="w-5 h-5 md:w-6 md:h-6 text-blue-500"/> Share Recipe
                      </h3>
                      <div className="flex flex-wrap justify-center gap-3">
                        <Button variant="outline" size="sm" className="gap-2" onClick={copyToClipboard}>
                          <Copy className="w-4 h-4"/> Copy
                        </Button>
                        <Button size="sm" className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white gap-2">
                          <Facebook className="w-4 h-4"/> Facebook
                        </Button>
                        <Button size="sm" className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white gap-2">
                          <Twitter className="w-4 h-4"/> Twitter
                        </Button>
                      </div>
                    </section>
                  )}

                  {showSuggestionBox && (
                    <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="flex flex-col md:flex-row items-start gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full hidden md:block">
                          <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Have a suggestion?</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                              Help us improve this recipe!
                            </p>
                          </div>
                          <div className="space-y-3">
                            <Textarea placeholder="Type your suggestion here..." className="bg-slate-50 dark:bg-slate-950 min-h-[80px]" />
                            <div className="flex justify-end">
                              <Button className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto">
                                Send
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
