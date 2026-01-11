import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AguaDeJamaicaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Agua%20de%20Jamaica%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1718"
  );

  // --- DATA ---
  const title = "Agua de Jamaica";
  const description = "Chá gelado de hibisco, ácido e refrescante.";

  // INGREDIENTS
  const ingredients = [
    { name: "Dried Hibiscus Flowers (Flor de Jamaica)", baseAmount: 100, unit: "g" },
    { name: "Water (for boiling)", baseAmount: 1000, unit: "ml" },
    { name: "Water (for diluting)", baseAmount: 1500, unit: "ml" },
    { name: "Granulated Sugar", baseAmount: 150, unit: "g" },
    { name: "Fresh Lime Juice", baseAmount: 30, unit: "ml" },
    { name: "Ice Cubes", baseAmount: 500, unit: "g" },
    { name: "Fresh Mint Leaves (optional)", baseAmount: 10, unit: "g" },
    { name: "Cinnamon Stick (optional)", baseAmount: 1, unit: "stick" },
    { name: "Cloves (optional)", baseAmount: 3, unit: "pcs" },
    { name: "Orange Peel (optional)", baseAmount: 1, unit: "piece" },
    { name: "Filtered Water (for rinsing hibiscus)", baseAmount: 200, unit: "ml" },
    { name: "Lemon Slices (for garnish)", baseAmount: 4, unit: "slices" },
    { name: "Strawberries (for garnish, optional)", baseAmount: 50, unit: "g" },
  ];

  const nutrition = { calories: "70", protein: "0g", carbs: "18g", fat: "0g" };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Agua de Jamaica?",
      answer:
        "Agua de Jamaica is a traditional Mexican beverage made from dried hibiscus flowers, known as 'flor de jamaica'. It is a refreshing, tart, and slightly sweet iced tea that is popular throughout Mexico and other Latin American countries.",
    },
    {
      question: "How do I make Agua de Jamaica less tart?",
      answer:
        "To reduce the tartness, you can add more sugar or dilute the concentrate with additional water. Adjust the sweetness and tartness to your preference by tasting as you go.",
    },
    {
      question: "Can I prepare Agua de Jamaica in advance?",
      answer:
        "Yes, Agua de Jamaica can be prepared a day ahead and stored in the refrigerator. This allows the flavors to meld and intensify. Just add ice and fresh lime juice before serving for the best taste.",
    },
    {
      question: "Are there any health benefits to drinking Agua de Jamaica?",
      answer:
        "Hibiscus tea is rich in antioxidants and vitamin C. It has been traditionally used to help lower blood pressure and support heart health. However, it should be consumed in moderation and not as a substitute for medical treatment.",
    },
    {
      question: "Can I use fresh hibiscus flowers instead of dried?",
      answer:
        "Dried hibiscus flowers are preferred for their concentrated flavor and availability. Fresh hibiscus can be used if available, but you may need to adjust the quantity and steeping time to achieve the desired flavor.",
    },
    {
      question: "How do I store leftover Agua de Jamaica?",
      answer:
        "Store leftover Agua de Jamaica in a sealed container in the refrigerator for up to 3 days. Stir well before serving as some sediment may settle at the bottom.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Agua de Jamaica"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 10m | Cook: 15m
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
                aria-label="Decrease servings"
              >
                -
              </Button>
              <span className="w-6 text-center font-bold text-lg">{servings}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setServings((s) => s + 1)}
                aria-label="Increase servings"
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
            Agua de Jamaica is a vibrant and refreshing hibiscus iced tea that
            perfectly balances tartness and sweetness. This beloved Mexican
            beverage is made by steeping dried hibiscus flowers, known as "flor
            de jamaica," in hot water, then sweetening and chilling the infusion
            to create a thirst-quenching drink ideal for warm weather. Its deep
            ruby-red color and floral aroma make it as visually appealing as it
            is delicious.
          </p>
          <p>
            The origins of Agua de Jamaica trace back to indigenous Mesoamerican
            cultures, where hibiscus was used for both culinary and medicinal
            purposes. Over time, the drink became a staple in Mexican cuisine,
            enjoyed in homes, markets, and restaurants alike. Today, it remains
            a symbol of Mexican tradition and hospitality, often served at
            celebrations and family gatherings.
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
              Rinse and Boil Hibiscus
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the dried hibiscus flowers under cold water to remove any
              dust or impurities. In a medium pot, bring 1000 ml of water to a
              boil. Add the rinsed hibiscus flowers, cinnamon stick, cloves,
              and orange peel if using. Reduce heat and simmer for 10 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Strain and Sweeten
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the pot from heat and strain the hibiscus infusion into a
              large pitcher, discarding solids. While still warm, stir in the
              granulated sugar until fully dissolved.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Dilute and Chill
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the remaining 1500 ml of cold water to the pitcher and stir
              well. Refrigerate the Agua de Jamaica for at least 1 hour to chill
              and allow flavors to meld.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Garnish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Fill glasses with ice cubes and pour the chilled Agua de Jamaica
              over the ice. Add fresh lime juice to taste and garnish with mint
              leaves, lemon slices, or strawberries if desired. Serve immediately
              for a refreshing treat.
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
            Use organic dried hibiscus flowers for the best flavor and to avoid
            pesticides.
          </li>
          <li>
            Adjust sweetness by adding honey or agave syrup instead of sugar for
            a different flavor profile.
          </li>
          <li>
            For a spiced twist, experiment with adding star anise or ginger
            during the boiling step.
          </li>
          <li>
            To make a sparkling version, mix chilled Agua de Jamaica with soda
            water just before serving.
          </li>
          <li>
            Hibiscus tea can stain surfaces and clothing, so handle with care.
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
              href="https://en.wikipedia.org/wiki/Hibiscus_tea"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Hibiscus Tea
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/agua-de-jamaica-hibiscus-2342795"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Agua de Jamaica Recipe
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