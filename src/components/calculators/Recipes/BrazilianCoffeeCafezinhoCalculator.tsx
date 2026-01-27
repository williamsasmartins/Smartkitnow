import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function BrazilianCoffeeCafezinhoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Coffee%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5751"
  );

  // --- DATA ---
  const title = "Brazilian Coffee";
  const description = "Strong, hot, and sugary coffee served in a small cup.";

  // INGREDIENTS
  const ingredients = [
    { name: "Freshly ground dark roast coffee", baseAmount: 50, unit: "g" },
    { name: "Filtered water", baseAmount: 500, unit: "ml" },
    { name: "Granulated sugar", baseAmount: 60, unit: "g" },
    { name: "Optional: cinnamon stick", baseAmount: 1, unit: "stick" },
    { name: "Optional: cloves", baseAmount: 2, unit: "pcs" },
    { name: "Optional: orange peel", baseAmount: 1, unit: "slice" },
    { name: "Optional: star anise", baseAmount: 1, unit: "piece" },
    { name: "Optional: sweetened condensed milk (for serving)", baseAmount: 30, unit: "ml" },
    { name: "Optional: whole milk (for serving)", baseAmount: 30, unit: "ml" },
    { name: "Small coffee cups (cafezinho cups)", baseAmount: 4, unit: "pcs" },
  ];

  // Nutrition per serving (approximate, per 1 serving)
  const nutrition = {
    calories: "80",
    protein: "0.5g",
    carbs: "20g",
    fat: "0g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes Brazilian coffee (cafezinho) unique?",
      answer:
        "Brazilian coffee, or cafezinho, is unique due to its strong, sweet, and hot profile served in small cups. It is traditionally brewed with finely ground dark roast coffee and generously sweetened with sugar during brewing, creating a distinctive balance of boldness and sweetness that reflects Brazilian coffee culture.",
    },
    {
      question: "Can I use regular coffee instead of dark roast for cafezinho?",
      answer:
        "While you can use regular coffee, dark roast is preferred for cafezinho because it provides the deep, robust flavor that characterizes this drink. Using a lighter roast may result in a less intense and less authentic flavor profile.",
    },
    {
      question: "Is it necessary to add spices like cinnamon or cloves?",
      answer:
        "Adding spices such as cinnamon, cloves, star anise, or orange peel is optional but highly recommended. These spices add aromatic complexity and warmth, enhancing the traditional flavor experience of cafezinho.",
    },
    {
      question: "How sweet should Brazilian coffee be?",
      answer:
        "Cafezinho is traditionally quite sweet, with sugar added during brewing rather than after. The sweetness balances the strong coffee flavor, but you can adjust the sugar amount to your personal taste.",
    },
    {
      question: "Can I serve cafezinho with milk or condensed milk?",
      answer:
        "Yes, while traditional cafezinho is served black and sweet, some variations include serving it with a splash of whole milk or sweetened condensed milk for a creamier texture and richer flavor.",
    },
    {
      question: "What is the best way to brew cafezinho at home?",
      answer:
        "The best way is to use a small stovetop coffee pot or a French press with finely ground dark roast coffee, boiling filtered water, and adding sugar directly to the coffee grounds before brewing. This method ensures the coffee is strong, sweet, and aromatic.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description: description,
    image: imgSrc,
    prepTime: "PT5M",
    cookTime: "PT10M",
    totalTime: "PT15M",
    recipeYield: `${servings} servings`,
    recipeCategory: "Drink",
    recipeCuisine: "Brazilian",
    keywords: "brazilian coffee, cafezinho, brazilian drink, morning coffee, sweet coffee",
    recipeIngredient: ingredients.map(ing => `${getAmount(ing.baseAmount)}${ing.unit} ${ing.name}`),
    recipeInstructions: [
      "Use freshly ground dark roast coffee, finely ground to a powdery consistency.",
      "In a small stovetop coffee pot or saucepan, combine the coffee grounds and granulated sugar (and optional spices).",
      "Bring filtered water to a boil, then pour it over the coffee and sugar mixture. Stir well.",
      "Place the pot over medium heat and bring to a gentle boil, then reduce heat and simmer for 5-7 minutes.",
      "Strain the coffee into small cafezinho cups. Serve immediately while hot."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Coffee"
          width="1280"
          height="720"
          className="w-full h-auto object-cover aspect-video transition-transform duration-700 group-hover:scale-105"
          onError={() =>
            setImgSrc(
              "https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=1280&auto=format&fit=crop"
            )
          }
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className="text-white font-bold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 5m | Cook: 10m
          </span>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 bg-slate-50 dark:bg-slate-900/50">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg">
              <Utensils className="h-5 w-5 text-orange-500" /> Ingredients
            </span>
            <div className="flex items-center gap-2 text-sm bg-white dark:bg-slate-800 border p-1 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setServings((s) => Math.max(1, s - 1))}
              >
                -
              </Button>
              <span className="w-6 text-center font-bold text-lg">{servings}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setServings((s) => s + 1)}
              >
                +
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableBody>
              {ingredients.map((ing, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-base">{ing.name}</TableCell>
                  <TableCell className="text-right font-bold text-base text-slate-700 dark:text-slate-200">
                    {ing.unit === "pcs" || ing.unit === "stick" || ing.unit === "slice" || ing.unit === "piece"
                      ? getAmount(ing.baseAmount)
                      : getAmount(ing.baseAmount)}{" "}
                    {ing.unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-slate-50 dark:bg-slate-900/50">
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-sm">
          <div>
            <div className="font-bold text-lg">{nutrition.calories}</div>
            <span className="text-xs font-bold uppercase text-slate-500">Kcal</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.protein}</div>
            <span className="text-xs font-bold uppercase text-slate-500">Prot</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.carbs}</div>
            <span className="text-xs font-bold uppercase text-slate-500">Carb</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.fat}</div>
            <span className="text-xs font-bold uppercase text-slate-500">Fat</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // --- EDITORIAL CONTENT ---
  const editorial = (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Brazilian Coffee, commonly known as <em>cafezinho</em>, is a beloved cultural staple in Brazil. It is characterized by its strong, hot, and sweet flavor, traditionally served in small cups to be enjoyed throughout the day. This coffee is brewed with finely ground dark roast coffee and sugar added during the brewing process, creating a uniquely balanced and aromatic beverage that energizes and comforts.
          </p>
          <p>
            The origins of cafezinho trace back to Brazil's rich coffee-growing history, where coffee cultivation has been a major economic and cultural force since the 18th century. Cafezinho became a symbol of hospitality and social connection, often offered to guests as a warm welcome. Its preparation and consumption reflect the Brazilian way of life—simple, communal, and joyful.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-orange-500" /> Instructions
        </h2>
        <ol className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-10">
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              1
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Coffee Grounds</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Use freshly ground dark roast coffee, finely ground to a powdery consistency similar to espresso grind. Measure the amount according to the number of servings.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Coffee and Sugar to Pot</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small stovetop coffee pot or saucepan, combine the coffee grounds and granulated sugar. Optionally, add spices such as cinnamon stick, cloves, star anise, or orange peel for added aroma.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Boil Water and Brew</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring filtered water to a boil, then pour it over the coffee and sugar mixture. Stir well to dissolve the sugar. Place the pot over medium heat and bring to a gentle boil, then reduce heat and simmer for about 5-7 minutes, stirring occasionally.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Strain and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove from heat and strain the coffee into small cafezinho cups. Serve immediately while hot. Optionally, offer sweetened condensed milk or whole milk on the side for guests who prefer a creamier coffee.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Enjoy and Share</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Enjoy your cafezinho hot and sweet, ideally with friends or family. This coffee is a symbol of warmth and hospitality in Brazilian culture.
            </p>
          </li>
        </ol>
      </section>

      <section className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-2xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-xl mb-4 text-amber-900 dark:text-amber-100 flex items-center gap-2">
          <Flame className="h-6 w-6 text-amber-500" /> Chef's Tips
        </h3>
        <ul className="list-disc pl-5 space-y-3 text-amber-900 dark:text-amber-100 text-base">
          <li>
            Use freshly ground coffee just before brewing to maximize aroma and flavor.
          </li>
          <li>
            Adjust sugar quantity to your taste, but remember that traditional cafezinho is notably sweet.
          </li>
          <li>
            Experiment with spices like cinnamon or orange peel to add a unique twist to your cafezinho.
          </li>
          <li>
            Serve cafezinho in small cups to replicate the authentic Brazilian experience.
          </li>
          <li>
            If you prefer a creamier coffee, add a splash of sweetened condensed milk or whole milk after brewing.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i} className="border-b pb-4 last:border-0">
              <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">{f.question}</h3>
              <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="h-6 w-6" /> References
        </h3>
        <ul className="space-y-3 text-base text-slate-700 dark:text-slate-300">
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://en.wikipedia.org/wiki/Coffee_culture_in_Brazil"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Coffee Culture in Brazil
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.nationalgeographic.com/culture/article/brazil-coffee-culture-history"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              National Geographic: Brazil's Coffee History
            </a>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={title}
      description={description}
      widget={widget}
      editorial={editorial}
      jsonLd={[faqJsonLd, recipeJsonLd]}
      hideLegalDisclaimer={true}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}