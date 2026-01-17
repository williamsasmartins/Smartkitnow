import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function IcedMateTeaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Iced%20Mate%20Tea%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9630"
  );

  // --- DATA ---
  const title = "Iced Mate Tea";
  const description = "Rio de Janeiro beach classic: toasted Erva Mate cold tea.";

  // INGREDIENTS
  const ingredients = [
    { name: "Erva Mate (toasted)", baseAmount: 50, unit: "g" },
    { name: "Filtered Water (hot)", baseAmount: 1000, unit: "ml" },
    { name: "Filtered Water (cold)", baseAmount: 500, unit: "ml" },
    { name: "Ice Cubes", baseAmount: 300, unit: "g" },
    { name: "Lemon Juice (freshly squeezed)", baseAmount: 30, unit: "ml" },
    { name: "Honey or Agave Syrup", baseAmount: 20, unit: "g" },
    { name: "Mint Leaves (fresh)", baseAmount: 10, unit: "g" },
    { name: "Orange Peel (for garnish)", baseAmount: 5, unit: "g" },
    { name: "Lime Slices (for garnish)", baseAmount: 4, unit: "slices" },
    { name: "Optional: Sparkling Water", baseAmount: 200, unit: "ml" },
    { name: "Optional: Stevia or Sweetener", baseAmount: 5, unit: "g" },
  ];

  const nutrition = { calories: "45", protein: "0.3g", carbs: "11g", fat: "0g" };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Erva Mate and why is it toasted for this recipe?",
      answer:
        "Erva Mate is a traditional South American herb used to make mate tea. Toasting the leaves enhances the flavor by adding a subtle smoky note and reduces bitterness, making it perfect for a refreshing iced tea.",
    },
    {
      question: "Can I use regular green tea instead of Erva Mate?",
      answer:
        "While green tea can be a substitute, it lacks the unique earthy and smoky flavor of toasted Erva Mate. Using Erva Mate preserves the authentic taste and cultural essence of this Brazilian iced tea.",
    },
    {
      question: "How do I adjust the sweetness to my preference?",
      answer:
        "You can adjust sweetness by varying the amount of honey, agave syrup, or using alternative sweeteners like stevia. Start with the base amount and add gradually, tasting as you go to achieve your desired balance.",
    },
    {
      question: "Is it necessary to use both hot and cold water?",
      answer:
        "Yes, hot water is used to steep and extract flavors from the toasted Erva Mate leaves, while cold water is added later to cool the infusion before serving over ice, ensuring a refreshing and balanced iced tea.",
    },
    {
      question: "Can I prepare this iced mate tea in advance?",
      answer:
        "Absolutely! Prepare the mate infusion ahead of time and refrigerate it. Add fresh ice, lemon juice, and garnishes just before serving to maintain freshness and flavor.",
    },
    {
      question: "What are some popular garnishes for Iced Mate Tea?",
      answer:
        "Common garnishes include fresh mint leaves, citrus slices like lime or orange, and a twist of orange peel. These add aroma, color, and a refreshing zest to the drink.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Iced Mate Tea"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 10m | Cook: 10m
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Iced Mate Tea is a refreshing beverage deeply rooted in South American culture,
            especially popular along the sunny beaches of Rio de Janeiro. This recipe
            transforms the traditional hot mate infusion into a chilled, invigorating drink
            perfect for warm weather. The use of toasted Erva Mate leaves imparts a subtle
            smoky flavor that balances beautifully with fresh citrus and natural sweeteners.
          </p>
          <p>
            Historically, mate tea has been consumed for centuries by indigenous peoples of
            the region, prized for its energizing properties and social significance. The
            iced variation emerged as a modern twist, adapting this cherished tradition to
            contemporary tastes and climates, making it a beloved classic in Brazilian
            beach culture.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Toast the Erva Mate</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a dry pan over medium heat, gently toast the Erva Mate leaves until they
              release a fragrant, smoky aroma, about 3-5 minutes. Stir frequently to avoid
              burning. Remove from heat and let cool.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Steep the Mate</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the toasted mate leaves in a teapot or heatproof container. Pour hot
              filtered water (around 80°C/176°F) over the leaves and steep for 8-10 minutes.
              Strain the infusion to remove the leaves.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sweeten and Chill</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              While the infusion is still warm, stir in honey or agave syrup until dissolved.
              Add freshly squeezed lemon juice and mint leaves. Then add cold filtered water
              to cool the mixture. Refrigerate for at least 30 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve Over Ice</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Fill glasses with ice cubes and pour the chilled mate tea over them. Garnish
              with lime slices and a twist of orange peel. Optionally, top with sparkling
              water for a fizzy finish.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Enjoy and Store</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Sip and enjoy your refreshing Iced Mate Tea! Store any leftovers in a sealed
              container in the refrigerator for up to 2 days. Add fresh ice and garnishes
              before serving again.
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
            Toast the Erva Mate gently and evenly to avoid bitterness and bring out a rich,
            smoky flavor.
          </li>
          <li>
            Use filtered water for the best taste, both hot for steeping and cold for
            dilution.
          </li>
          <li>
            Adjust sweetness gradually; the natural bitterness of mate balances well with
            mild sweetness.
          </li>
          <li>
            Fresh mint leaves add a refreshing aroma but avoid oversteeping them to prevent
            bitterness.
          </li>
          <li>
            For a sparkling version, add chilled sparkling water just before serving to keep
            the fizz.
          </li>
          <li>
            Experiment with citrus garnishes like lime, lemon, or orange peel to find your
            preferred flavor profile.
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
              href="https://en.wikipedia.org/wiki/Mate_(beverage)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Mate (Beverage)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/mate-beverage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Mate Beverage Overview
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/mate-tea-4690985"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: How to Make Mate Tea
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