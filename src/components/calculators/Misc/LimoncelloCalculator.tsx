import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LimoncelloCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Limoncello%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8901"
  );

  // --- DATA ---
  const title = "Limoncello";
  const description = "Sweet lemon liqueur served chilled as a digestif.";

  // INGREDIENTS
  const ingredients = [
    { name: "Organic Lemon Zest (about 8 large lemons)", baseAmount: 120, unit: "g" },
    { name: "High-proof Neutral Grain Alcohol (95% ABV)", baseAmount: 500, unit: "ml" },
    { name: "Filtered Water", baseAmount: 700, unit: "ml" },
    { name: "Granulated Sugar", baseAmount: 400, unit: "g" },
    { name: "Lemon Juice (freshly squeezed)", baseAmount: 100, unit: "ml" },
    { name: "Vanilla Bean (optional, split)", baseAmount: 1, unit: "piece" },
    { name: "Organic Lemon Peel (for garnish)", baseAmount: 4, unit: "pieces" },
    { name: "Ice Cubes (for serving)", baseAmount: 0, unit: "as needed" },
    { name: "Glass Bottles (for storage)", baseAmount: 2, unit: "pieces" },
    { name: "Cheesecloth (for straining)", baseAmount: 1, unit: "piece" },
    { name: "Sterilized Funnel", baseAmount: 1, unit: "piece" },
  ];

  const nutrition = { calories: "150", protein: "0g", carbs: "38g", fat: "0g" };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of lemons should I use for the best limoncello?",
      answer:
        "For authentic and flavorful limoncello, use organic, unwaxed lemons with thick, fragrant zest. Sorrento or Amalfi Coast lemons are ideal due to their intense aroma and bright flavor, but any fresh organic lemons will work well. Avoid using regular supermarket lemons with wax coatings, as the zest flavor will be diminished and may contain unwanted chemicals.",
    },
    {
      question: "How long should I steep the lemon zest in alcohol?",
      answer:
        "Steeping the lemon zest in alcohol is a crucial step to extract the essential oils and vibrant lemon flavor. Typically, you should macerate the zest in high-proof alcohol for at least 7 to 10 days in a cool, dark place. Some traditional recipes recommend up to 30 days for a more intense flavor. Shake the jar gently every day to help release the oils evenly.",
    },
    {
      question: "Can I use vodka instead of grain alcohol?",
      answer:
        "Yes, you can substitute vodka if you cannot find high-proof grain alcohol. However, vodka usually has a lower alcohol content (40-50% ABV), which will result in a less potent extraction and a slightly different flavor profile. To compensate, you might need to steep the zest longer or adjust the sugar and water ratios to balance the taste.",
    },
    {
      question: "How should I store limoncello after preparation?",
      answer:
        "Once prepared and filtered, store limoncello in sterilized glass bottles with tight caps. Keep the bottles in the freezer or refrigerator to maintain the best flavor and chill the liqueur for serving. Properly stored limoncello can last up to 6 months or longer without losing quality.",
    },
    {
      question: "Is it necessary to add lemon juice to limoncello?",
      answer:
        "Adding fresh lemon juice is optional but recommended to enhance the natural acidity and brightness of the liqueur. It balances the sweetness and adds a fresh citrus tang. If you prefer a sweeter, less tart limoncello, you can omit the lemon juice, but the flavor will be less complex.",
    },
    {
      question: "Can I make limoncello without alcohol?",
      answer:
        "Traditional limoncello requires alcohol for extraction and preservation. However, you can make a non-alcoholic lemon syrup inspired by limoncello by simmering lemon zest with sugar and water, then adding lemon juice. This syrup can be used in cocktails or desserts but will not have the same preservation qualities or depth of flavor as authentic limoncello.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Limoncello"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 10m
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
                    {ing.baseAmount === 0
                      ? ing.unit
                      : getAmount(ing.baseAmount) + " " + ing.unit}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Limoncello is a traditional Italian lemon liqueur known for its bright,
            sweet, and refreshing flavor. Typically served chilled as a digestif,
            this vibrant yellow elixir is made by infusing lemon zest in high-proof
            alcohol, then sweetening the infusion with a simple syrup. Its crisp
            citrus aroma and smooth sweetness make it a beloved treat after meals,
            especially during warm weather.
          </p>
          <p>
            Originating from the Amalfi Coast and Sorrento regions of Italy, limoncello
            has a rich history dating back to the early 1900s. It was traditionally
            crafted in family homes using locally grown lemons, passed down through
            generations as a symbol of hospitality and celebration. Today, limoncello
            enjoys worldwide popularity, celebrated for its artisanal charm and
            authentic Italian heritage.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Lemons
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Wash the lemons thoroughly with warm water to remove any impurities.
              Using a vegetable peeler or microplane, carefully zest the lemons,
              avoiding the white pith which can impart bitterness. Collect about 120g
              of zest for 4 servings.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Infuse the Alcohol
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the lemon zest into a large, airtight glass jar. Pour in 500ml of
              high-proof neutral grain alcohol (95% ABV). Optionally, add a split
              vanilla bean for depth. Seal the jar tightly and store it in a cool,
              dark place for 7 to 10 days, shaking gently once daily to release the
              oils.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Simple Syrup
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a saucepan, combine 400g granulated sugar with 700ml filtered water.
              Heat gently over medium heat, stirring until the sugar dissolves
              completely. Remove from heat and let cool to room temperature.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Combine and Sweeten
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Strain the infused alcohol through a cheesecloth or fine mesh sieve to
              remove zest and vanilla bean. Mix the infused alcohol with the cooled
              simple syrup and add 100ml freshly squeezed lemon juice for brightness.
              Stir well to combine.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bottle and Age
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Using a sterilized funnel, pour the limoncello into clean glass bottles.
              Seal tightly and refrigerate or freeze for at least 1 week to allow
              flavors to meld and mellow. Serve chilled, garnished with a twist of
              lemon peel and ice cubes if desired.
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
            Use organic lemons to avoid pesticides and ensure the zest is flavorful
            and safe to consume.
          </li>
          <li>
            Avoid the white pith when zesting, as it can impart bitterness to your
            limoncello.
          </li>
          <li>
            For a smoother finish, strain the infusion multiple times through a
            cheesecloth or coffee filter.
          </li>
          <li>
            Adjust sweetness by varying the sugar amount in the simple syrup to suit
            your taste.
          </li>
          <li>
            Store limoncello in the freezer for a refreshing, slushy texture when
            served.
          </li>
          <li>
            Experiment with adding herbs like mint or basil during infusion for a
            unique twist.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i} className="border-b pb-4 last:border-0">
              <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
                {f.question}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                {f.answer}
              </p>
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
              href="https://en.wikipedia.org/wiki/Italian_cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: History of this Dish
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Italian-cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Culinary Reference
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