import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GuaranaSodaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Guarana%20Soda%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9331"
  );

  // --- DATA ---
  const title = "Guarana Soda";
  const description = "Famous soda made from the energy-rich Amazonian berry.";

  // INGREDIENTS
  const ingredients = [
    { name: "Guarana Berry Extract", baseAmount: 50, unit: "g" },
    { name: "Carbonated Water", baseAmount: 1000, unit: "ml" },
    { name: "Cane Sugar", baseAmount: 150, unit: "g" },
    { name: "Citric Acid", baseAmount: 5, unit: "g" },
    { name: "Natural Guarana Flavor", baseAmount: 10, unit: "ml" },
    { name: "Lemon Juice", baseAmount: 30, unit: "ml" },
    { name: "Caramel Color", baseAmount: 5, unit: "ml" },
    { name: "Preservative (Sodium Benzoate)", baseAmount: 1, unit: "g" },
    { name: "Caffeine", baseAmount: 20, unit: "mg" },
    { name: "Ice Cubes", baseAmount: 200, unit: "g" },
    { name: "Fresh Mint Leaves (optional)", baseAmount: 5, unit: "g" },
    { name: "Lime Wedge (for garnish)", baseAmount: 1, unit: "piece" },
  ];

  const nutrition = {
    calories: "180",
    protein: "0g",
    carbs: "45g",
    fat: "0g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Guarana and why is it used in this soda?",
      answer:
        "Guarana is a climbing plant native to the Amazon basin, especially Brazil. Its seeds contain about twice the concentration of caffeine found in coffee beans, making it a natural stimulant. In Guarana Soda, the extract provides a unique, slightly fruity and earthy flavor along with an energizing effect.",
    },
    {
      question: "Can I make Guarana Soda without carbonated water?",
      answer:
        "While carbonated water is essential for the classic soda fizz and mouthfeel, you can substitute it with still water for a non-carbonated version. However, the texture and refreshing quality will differ significantly from traditional Guarana Soda.",
    },
    {
      question: "How long does homemade Guarana Soda last?",
      answer:
        "When stored in a sealed bottle in the refrigerator, homemade Guarana Soda can last up to 5 days. The preservative sodium benzoate helps extend shelf life, but it’s best consumed fresh for optimal flavor and carbonation.",
    },
    {
      question: "Is Guarana Soda suitable for children?",
      answer:
        "Due to its caffeine content derived from guarana seeds, Guarana Soda is not recommended for young children or individuals sensitive to caffeine. Always check caffeine levels and consume responsibly.",
    },
    {
      question: "Where can I buy guarana extract or powder?",
      answer:
        "Guarana extract or powder can be found in specialty health food stores, online retailers, or stores that sell Brazilian or Amazonian products. Ensure you purchase food-grade quality suitable for beverage preparation.",
    },
    {
      question: "Can I adjust the sweetness of Guarana Soda?",
      answer:
        "Absolutely! The amount of cane sugar can be adjusted to your taste preferences. For a lower-calorie option, consider using natural sweeteners like stevia or erythritol, but this may slightly alter the flavor profile.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Guarana Soda"
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
            Guarana Soda is a refreshing and energizing beverage originating from the Amazon rainforest, where the guarana berry has been cherished for centuries. Known for its natural caffeine content, this soda combines the unique flavor of guarana with the effervescence of carbonated water and a hint of citrus, creating a delicious and invigorating drink perfect for any occasion.
          </p>
          <p>
            The guarana berry, native to Brazil, has a rich history of use by indigenous tribes who valued it for its stimulating properties and health benefits. Today, Guarana Soda is popular throughout South America and gaining recognition worldwide as a natural alternative to traditional caffeinated soft drinks.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Guarana Extract</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              If using guarana powder, dissolve it in a small amount of warm water to create a concentrated extract. If you have a ready-made guarana extract, measure out the required amount.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Mix Sugar and Citric Acid</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pitcher, combine cane sugar and citric acid. Add a small amount of warm water and stir until fully dissolved to create a syrup base.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the guarana extract, natural guarana flavor, caramel color, lemon juice, preservative, and caffeine to the syrup. Stir well to combine all ingredients evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Carbonated Water</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slowly pour in the carbonated water to the mixture, stirring gently to preserve the carbonation and blend flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve Chilled</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the Guarana Soda over ice cubes in glasses. Garnish with fresh mint leaves and a lime wedge if desired. Serve immediately for best taste and fizz.
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
            Use chilled carbonated water to maintain maximum fizz and refreshment in your soda.
          </li>
          <li>
            Adjust the sweetness by varying the cane sugar amount or substituting with natural sweeteners for a healthier option.
          </li>
          <li>
            For a more intense guarana flavor, increase the extract slightly but be mindful of caffeine content.
          </li>
          <li>
            Adding a splash of fresh lime juice right before serving enhances the soda's brightness and balances sweetness.
          </li>
          <li>
            Store leftover soda in airtight bottles to preserve carbonation and consume within a few days.
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
              href="https://en.wikipedia.org/wiki/Guarana"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Guarana
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/plant/guarana"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Guarana Plant
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.healthline.com/nutrition/guarana"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Healthline: Benefits of Guarana
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