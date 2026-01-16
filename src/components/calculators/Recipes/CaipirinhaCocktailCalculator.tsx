import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CaipirinhaCocktailCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Caipirinha%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=516"
  );

  // --- DATA ---
  const title = "Caipirinha";
  const description = "Brazil's national cocktail: Cachaça, lime, sugar, and ice.";

  // INGREDIENTS
  const ingredients = [
    { name: "Cachaça", baseAmount: 120, unit: "ml" },
    { name: "Fresh Lime", baseAmount: 1, unit: "whole" },
    { name: "Granulated Sugar", baseAmount: 2, unit: "tbsp" },
    { name: "Crushed Ice", baseAmount: 150, unit: "g" },
    { name: "Lime Wedges (for garnish)", baseAmount: 2, unit: "pieces" },
    { name: "Simple Syrup (optional)", baseAmount: 10, unit: "ml" },
    { name: "Mint Leaves (optional)", baseAmount: 5, unit: "leaves" },
    { name: "Angostura Bitters (optional)", baseAmount: 2, unit: "dashes" },
    { name: "Sugar Cane Stick (for garnish)", baseAmount: 1, unit: "piece" },
    { name: "Sparkling Water (optional)", baseAmount: 30, unit: "ml" },
  ];

  // Nutrition facts per serving (approximate)
  const nutrition = { calories: "150", protein: "0g", carbs: "14g", fat: "0g" };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    base === 1
      ? "1"
      : base > 1 && Number.isInteger(base)
      ? (base * (servings / 4)).toFixed(0)
      : (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the traditional way to prepare a Caipirinha?",
      answer:
        "The traditional Caipirinha is made by muddling fresh lime wedges with granulated sugar to release the lime's oils and juice, then adding cachaça and crushed ice. It is stirred gently to chill and dilute slightly, served in a short glass with a lime wedge garnish.",
    },
    {
      question: "Can I substitute cachaça with another spirit?",
      answer:
        "While cachaça is the authentic spirit for Caipirinha, you can substitute it with white rum to make a Caipirissima, which has a similar flavor profile but lacks the distinctive earthy notes of cachaça. However, for the true Brazilian experience, cachaça is recommended.",
    },
    {
      question: "How do I adjust the sweetness of the cocktail?",
      answer:
        "Sweetness can be adjusted by varying the amount of granulated sugar or by adding simple syrup for a smoother dissolve. Start with 2 tablespoons of sugar per 4 servings and adjust to taste. Using superfine sugar can also help it dissolve more easily.",
    },
    {
      question: "What type of glassware is best for serving Caipirinha?",
      answer:
        "Caipirinha is traditionally served in a short, wide old-fashioned or rocks glass. This allows room for muddling the lime and sugar directly in the glass and accommodates the crushed ice comfortably.",
    },
    {
      question: "Can I prepare Caipirinha in advance?",
      answer:
        "Caipirinha is best enjoyed fresh to preserve the bright citrus flavors and effervescence. However, you can prepare the lime and sugar mixture in advance and store it refrigerated for a few hours, then add cachaça and ice just before serving.",
    },
    {
      question: "What are some popular variations of Caipirinha?",
      answer:
        "Popular variations include substituting lime with other fruits like passion fruit, strawberries, or kiwi, creating a 'Caipifruta.' Another variation is the Caipiroska, which uses vodka instead of cachaça. Adding herbs like mint can also add a refreshing twist.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Caipirinha"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 10m | Cook: 0m
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
                    {getAmount(ing.baseAmount)} {ing.unit}
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
            The Caipirinha is Brazil’s beloved national cocktail, celebrated for its refreshing simplicity and vibrant flavors. Combining the earthy spirit cachaça with fresh lime and sugar, this cocktail perfectly balances tartness, sweetness, and strength. Traditionally served over crushed ice, the Caipirinha is a staple at Brazilian gatherings and a symbol of the country’s lively culture.
          </p>
          <p>
            Originating in the early 20th century in Brazil, the Caipirinha’s roots are tied to rural traditions where cachaça was a common homemade spirit. The name “Caipirinha” roughly translates to “little country bumpkin,” reflecting its humble origins. Over time, it has gained international acclaim and is now enjoyed worldwide as a quintessential tropical cocktail.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Lime</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Wash the lime thoroughly. Cut it into 8 wedges. Remove the white pith if you prefer less bitterness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Muddle Lime and Sugar</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the lime wedges and granulated sugar into a sturdy glass. Using a muddler or the back of a spoon, press and twist to release the lime juice and essential oils from the peel, dissolving the sugar.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Cachaça and Ice</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the cachaça over the muddled lime and sugar mixture. Fill the glass with crushed ice, almost to the top.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Mix and Garnish</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir gently to combine and chill the cocktail. Garnish with a lime wedge or a sugar cane stick if desired. Serve immediately.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Optional Variations</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              For a twist, add a few mint leaves before muddling or substitute some lime with passion fruit pulp. You can also top with a splash of sparkling water for a lighter version.
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
            Use fresh, ripe limes for the best flavor. Avoid limes that are too dry or overly green.
          </li>
          <li>
            Muddle gently to release oils without pulverizing the peel, which can add bitterness.
          </li>
          <li>
            Crushed ice chills the drink faster and dilutes it more evenly than cubed ice.
          </li>
          <li>
            Adjust sugar to taste; some prefer a tarter or sweeter cocktail.
          </li>
          <li>
            Experiment with artisanal cachaças for unique flavor profiles.
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
              href="https://en.wikipedia.org/wiki/Caipirinha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Caipirinha
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.diffordsguide.com/cocktails/recipe/1103/caipirinha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Difford's Guide: Caipirinha Recipe
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
      jsonLd={faqJsonLd}
      hideLegalDisclaimer={true}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}