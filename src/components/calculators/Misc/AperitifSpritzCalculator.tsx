import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AperitifSpritzCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Aperitif%20Spritz%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3743"
  );

  // --- DATA ---
  const title = "Aperitif Spritz";
  const description = "Refreshing cocktail of Prosecco, Aperol, and soda with orange slice.";

  // INGREDIENTS
  const ingredients = [
    { name: "Prosecco", baseAmount: 120, unit: "ml" },
    { name: "Aperol", baseAmount: 90, unit: "ml" },
    { name: "Soda Water", baseAmount: 60, unit: "ml" },
    { name: "Ice Cubes", baseAmount: 6, unit: "pieces" },
    { name: "Orange Slice", baseAmount: 1, unit: "slice" },
    { name: "Lemon Twist (optional)", baseAmount: 0.5, unit: "twist" },
    { name: "Simple Syrup (optional)", baseAmount: 5, unit: "ml" },
    { name: "Fresh Mint Leaves (garnish)", baseAmount: 2, unit: "leaves" },
    { name: "Orange Bitters (optional)", baseAmount: 2, unit: "dashes" },
    { name: "Sparkling Water (alternative to soda)", baseAmount: 60, unit: "ml" },
    { name: "Sugar Cube (optional)", baseAmount: 0.5, unit: "cube" },
    { name: "Fresh Orange Zest (garnish)", baseAmount: 1, unit: "twist" },
    { name: "Aperitif Glass", baseAmount: 1, unit: "glass" },
  ];

  const nutrition = { calories: "120", protein: "0g", carbs: "10g", fat: "0g" };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is an Aperitif Spritz?",
      answer:
        "The Aperitif Spritz is a classic Italian cocktail known for its refreshing and slightly bitter taste. It typically combines Prosecco, Aperol, and soda water, garnished with an orange slice. It's served as a pre-dinner drink to stimulate the appetite.",
    },
    {
      question: "Can I substitute Aperol with another ingredient?",
      answer:
        "Yes, you can substitute Aperol with Campari for a more bitter and intense flavor, creating a variation known as the Campari Spritz. Alternatively, Select or other Italian aperitifs can be used, but Aperol remains the most popular choice for its balanced sweetness and bitterness.",
    },
    {
      question: "How do I adjust the recipe for different serving sizes?",
      answer:
        "This recipe calculator automatically adjusts ingredient quantities based on the number of servings you select. Simply use the plus and minus buttons to increase or decrease servings, and the ingredient amounts will update accordingly to maintain the perfect balance.",
    },
    {
      question: "What glassware is best for serving an Aperitif Spritz?",
      answer:
        "Traditionally, an Aperitif Spritz is served in a large wine glass or a specialized spritz glass to allow room for ice and garnishes. The wide bowl enhances the aroma and presentation, making the drinking experience more enjoyable.",
    },
    {
      question: "Can I prepare Aperitif Spritz in advance?",
      answer:
        "While it's best enjoyed freshly made to preserve the fizz and freshness, you can prepare the Aperol and Prosecco mixture in advance and keep it chilled. Add soda water, ice, and garnish just before serving to maintain the cocktail's effervescence and flavor.",
    },
    {
      question: "What are some popular variations of the Aperitif Spritz?",
      answer:
        "Popular variations include the Campari Spritz (using Campari instead of Aperol), the Select Spritz (using Select aperitif), and the Hugo Spritz (which adds elderflower syrup and mint). Each variation offers a unique twist on the classic refreshing spritz.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Aperitif Spritz"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 5m | Cook: 0m
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
            The Aperitif Spritz is a quintessential Italian cocktail celebrated for its
            vibrant color, refreshing taste, and perfect balance of bitterness and
            sweetness. It combines the sparkling elegance of Prosecco with the bright,
            citrusy notes of Aperol, topped with soda water and garnished with a fresh
            orange slice. This cocktail is ideal for warm afternoons or as a delightful
            start to any social gathering.
          </p>
          <p>
            Originating from the Veneto region of Italy, the Spritz dates back to the
            19th century when Austrian soldiers diluted Italian wines with water to
            soften their strength. Over time, the recipe evolved, incorporating local
            aperitifs like Aperol and Campari, and became a symbol of Italian aperitivo
            culture. Today, the Aperitif Spritz is enjoyed worldwide as a light and
            elegant drink that embodies the spirit of Italian conviviality.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Chill Your Glass</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Begin by chilling your aperitif glass in the freezer or by filling it with
              ice and water for a few minutes. A cold glass ensures your cocktail stays
              refreshingly cool longer.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Ice Cubes</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Fill the chilled glass generously with fresh ice cubes to keep the drink
              perfectly cold and to help maintain the balance of flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Pour Aperol</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the measured amount of Aperol over the ice. This vibrant orange aperitif
              provides the signature bittersweet flavor and color.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Prosecco</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slowly pour chilled Prosecco into the glass to preserve its bubbles and
              create a delightful fizz. The Prosecco adds a crisp and fruity sparkle.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Top with Soda Water</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add a splash of soda water to lighten the cocktail and enhance its refreshing
              quality. Adjust the amount to your taste preference.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Garnish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Garnish with a fresh orange slice and optionally a lemon twist or mint leaves
              for added aroma and visual appeal. Serve immediately and enjoy your Aperitif
              Spritz!
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
            Use high-quality Prosecco for the best flavor and bubbles; avoid overly dry
            or sweet varieties.
          </li>
          <li>
            Chill all ingredients and glassware beforehand to keep the cocktail crisp and
            refreshing.
          </li>
          <li>
            Adjust the Aperol to Prosecco ratio to suit your taste; more Aperol for a
            stronger bitter flavor, more Prosecco for a lighter drink.
          </li>
          <li>
            Experiment with garnishes like fresh herbs or citrus twists to add complexity
            and aroma.
          </li>
          <li>
            For a lower-alcohol version, increase soda water and reduce Aperol and
            Prosecco proportionally.
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
              href="https://en.wikipedia.org/wiki/Spritz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Spritz Cocktail
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.diffordsguide.com/cocktails/recipe/1107/aperol-spritz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Difford's Guide: Aperol Spritz Recipe
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.liquor.com/recipes/aperol-spritz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Liquor.com: Aperol Spritz Cocktail
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