import React, { useState } from "react";
import Head from "next/head";
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
  // Props de controle dos boxes
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
  
  // Estado para ajustar porções
  const [servings, setServings] = useState(servingsDefault);

  // Lógica de cálculo de ingredientes
  const getAmount = (base: number) => {
    const val = (base * (servings / servingsDefault));
    // Se for inteiro (ex: 2), mostra 2. Se decimal (ex: 2.5), mostra 2.5
    return Number.isInteger(val) ? val : parseFloat(val.toFixed(2));
  };

  // Função fictícia de copiar link
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 pb-20">
      <Head>
        <title>{title} | Smart Kit Now</title>
        <meta name="description" content={description} />
        {/* Open Graph Image */}
        <meta property="og:image" content={imagePath} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      {/* --- HERO SECTION --- */}
      <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Texto Hero */}
            <div className="space-y-6">
              <div className="flex gap-2">
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200">
                  Authentic Recipe
                </Badge>
                <Badge variant="outline" className="text-slate-500 border-slate-300">
                  {difficulty}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {title}
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {description}
              </p>
              
              {/* Meta Stats */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase">Prep</span>
                    <span>{prepTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium">
                  <Flame className="w-4 h-4 text-red-500" />
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase">Cook</span>
                    <span>{cookTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium">
                  <ChefHat className="w-4 h-4 text-blue-500" />
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase">Difficulty</span>
                    <span>{difficulty}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Imagem Hero */}
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

      {/* --- CONTENT LAYOUT --- */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* SIDEBAR (Sticky on Desktop) */}
          <aside className="lg:col-span-4 order-2 lg:order-2 space-y-8">
            <div className="lg:sticky lg:top-24 space-y-6">
              
              {/* CARD DE INGREDIENTES */}
              <Card className="border-orange-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardHeader className="bg-orange-50/50 dark:bg-slate-900 border-b border-orange-100 dark:border-slate-800 pb-4">
                  <div className="flex flex-col gap-4">
                    <CardTitle className="text-xl flex items-center gap-2 text-orange-800 dark:text-orange-400">
                      <Users className="w-5 h-5" /> Ingredients
                    </CardTitle>
                    
                    {/* Controlador de Porções */}
                    <div className="flex items-center justify-between bg-white dark:bg-slate-950 p-2 rounded-lg border border-orange-100 dark:border-slate-800">
                      <span className="text-xs font-semibold text-slate-500 uppercase px-2">Servings:</span>
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="ghost" size="sm" className="h-8 w-8 rounded-full"
                          onClick={() => setServings(s => Math.max(1, s - 1))}
                        >-</Button>
                        <span className="font-bold text-lg w-6 text-center">{servings}</span>
                        <Button 
                          variant="ghost" size="sm" className="h-8 w-8 rounded-full"
                          onClick={() => setServings(s => s + 1)}
                        >+</Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 bg-white dark:bg-slate-950">
                  <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {ingredients.map((ing, i) => (
                      <li key={i} className="flex justify-between items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <div className="flex-1 pr-4">
                          <span className="text-slate-700 dark:text-slate-300 font-medium block">
                            {ing.text || ing.name}
                          </span>
                        </div>
                        <span className="text-orange-600 dark:text-orange-400 font-bold whitespace-nowrap bg-orange-50 dark:bg-orange-950/30 px-2 py-1 rounded text-sm">
                          {getAmount(ing.amount)} {ing.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* CARD DE NUTRIÇÃO */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500"/> Nutrition per Serving
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-xl font-bold text-slate-900 dark:text-white">{nutrition.calories}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Calories</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{nutrition.protein}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Protein</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{nutrition.carbs}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Carbs</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{nutrition.fat}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Fat</div>
                  </div>
                </div>
              </div>

            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="lg:col-span-8 order-1 lg:order-1">
            <div className="space-y-12">
                {/* Conteúdo Editorial da Receita */}
                {editorial}

                <Separator className="my-12" />

                {/* SHARE THIS PAGE */}
                {showShareButtons && (
                  <section className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                    <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                      <Share2 className="w-6 h-6 text-blue-500"/> Share this Recipe
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Did you like this recipe? Share it with your friends and family!
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <Button variant="outline" className="gap-2" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4"/> Copy Link
                      </Button>
                      <Button className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white gap-2">
                        <Facebook className="w-4 h-4"/> Facebook
                      </Button>
                      <Button className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white gap-2">
                        <Twitter className="w-4 h-4"/> Twitter
                      </Button>
                      <Button className="bg-slate-800 hover:bg-slate-700 text-white gap-2">
                        <Mail className="w-4 h-4"/> Email
                      </Button>
                    </div>
                  </section>
                )}

                {/* SUGGESTION BOX */}
                {showSuggestionBox && (
                  <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full hidden md:block">
                        <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Have a suggestion?</h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                            Found a typo? Have a better way to cook this? Or just want to say hi? We'd love to hear from you.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <Input placeholder="Your name (optional)" className="bg-slate-50 dark:bg-slate-950" />
                          <Input placeholder="Your email (optional)" className="bg-slate-50 dark:bg-slate-950" />
                          <Textarea placeholder="Type your suggestion here..." className="bg-slate-50 dark:bg-slate-950 min-h-[100px]" />
                          <div className="flex justify-end">
                            <Button className="bg-green-600 hover:bg-green-700 text-white">
                              Send Suggestion
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}