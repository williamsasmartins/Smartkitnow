import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BrazilianLimeadeSucoSuicoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Limeade%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5173"
  );

  // --- DATA ---
  const title = "Brazilian Limeade";
  const description = "Refreshing drink made with whole limes and condensed milk.";

  // INGREDIENTS
  const ingredients = [
    { name: "Whole Limes (washed and quartered)", baseAmount: 4, unit: "pieces" },
    { name: "Cold Water", baseAmount: 4, unit: "cups" },
    { name: "Sweetened Condensed Milk", baseAmount: 1, unit: "cup" },
    { name: "Granulated Sugar", baseAmount: 2, unit: "tbsp" },
    { name: "Ice Cubes", baseAmount: 2, unit: "cups" },
    { name: "Fresh Mint Leaves (optional)", baseAmount: 10, unit: "leaves" },
    { name: "Lime Slices (for garnish)", baseAmount: 4, unit: "slices" },
    { name: "Salt (a pinch, optional)", baseAmount: 0.1, unit: "tsp" },
    { name: "Lime Zest (optional)", baseAmount: 1, unit: "tsp" },
    { name: "Powdered Sugar (optional, for sweetness adjustment)", baseAmount: 1, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "180",
    protein: "2g",
    carbs: "38g",
    fat: "3g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes Brazilian Limeade different from regular limeade?",
      answer:
        "Brazilian Limeade is unique because it uses whole limes—including the peel—blended with water, sweetened condensed milk, and sugar. This method gives it a creamy texture and a slightly bitter, aromatic flavor from the lime peel, distinguishing it from traditional limeades that use only lime juice.",
    },
    {
      question: "Can I use regular milk instead of sweetened condensed milk?",
      answer:
        "Sweetened condensed milk is key to achieving the creamy sweetness and rich texture characteristic of Brazilian Limeade. Using regular milk will result in a thinner, less sweet drink. If you prefer a lighter version, you can try evaporated milk with added sugar, but the flavor will differ.",
    },
    {
      question: "How do I prevent the lime peel from making the drink too bitter?",
      answer:
        "To avoid excessive bitterness, use fresh, thin-skinned limes and blend them briefly—just enough to break down the peel without pulverizing it completely. Straining the mixture after blending also helps remove pulp and peel bits that contribute to bitterness.",
    },
    {
      question: "Is it necessary to add sugar if sweetened condensed milk is used?",
      answer:
        "Sweetened condensed milk adds significant sweetness, but adding a small amount of granulated sugar balances the tartness of the limes and enhances the overall flavor. You can adjust the sugar quantity or omit it based on your sweetness preference.",
    },
    {
      question: "Can I prepare Brazilian Limeade in advance?",
      answer:
        "It's best enjoyed fresh to retain its vibrant flavor and frothy texture. If you prepare it in advance, store it refrigerated and stir well before serving. Note that the lime peel may darken and the drink can become more bitter over time.",
    },
    {
      question: "Are there any variations of Brazilian Limeade?",
      answer:
        "Yes! Some variations include adding fresh mint leaves for a refreshing twist, using coconut milk instead of condensed milk for a tropical flavor, or incorporating other citrus fruits like lemon or orange for a mixed citrus version.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Limeade"
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
            Brazilian Limeade, or "Limonada Suíça," is a refreshingly creamy and
            tangy beverage beloved throughout Brazil. Unlike traditional limeades,
            this drink is made by blending whole limes—including the peel—with
            cold water and sweetened condensed milk, resulting in a uniquely
            smooth texture and vibrant citrus flavor. It’s a perfect thirst-quencher
            on hot days and a staple at Brazilian gatherings.
          </p>
          <p>
            The origins of Brazilian Limeade trace back to the country's rich
            tropical fruit culture and inventive use of condensed milk, a common
            ingredient in Brazilian desserts and drinks. The method of blending
            whole limes is inspired by Swiss culinary techniques, which is why it’s
            sometimes called "Limonada Suíça" (Swiss Lemonade). This drink has
            become a symbol of Brazilian hospitality and creativity in the kitchen.
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
              Prepare the Limes
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Wash the limes thoroughly to remove any wax or residues. Cut each lime
              into quarters, removing the seeds carefully to avoid bitterness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Blend the Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a blender, combine the quartered limes, cold water, granulated sugar,
              and a pinch of salt if using. Blend on high speed for about 10-15 seconds,
              just enough to break down the peel without pulverizing it completely.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Strain the Mixture
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the blended mixture through a fine mesh strainer or cheesecloth into
              a pitcher to remove pulp and peel bits, ensuring a smooth texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Sweetened Condensed Milk and Ice
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the sweetened condensed milk until fully incorporated. Add ice
              cubes to chill the drink, and stir gently to combine.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Garnish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the limeade into glasses and garnish with fresh lime slices and
              optional mint leaves. Serve immediately for the best flavor and texture.
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
            Use thin-skinned limes like Persian or Tahiti limes for less bitterness
            and more juice.
          </li>
          <li>
            Blend the limes briefly to avoid releasing too much bitterness from the
            peel.
          </li>
          <li>
            Adjust sweetness by varying the amount of condensed milk and sugar to
            your taste.
          </li>
          <li>
            For a dairy-free version, substitute sweetened condensed milk with coconut
            cream and add a bit of sugar.
          </li>
          <li>
            Serve immediately after preparation to enjoy the fresh, frothy texture.
          </li>
          <li>
            Adding a pinch of salt enhances the lime flavor and balances sweetness.
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
              href="https://en.wikipedia.org/wiki/Limeade"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Limeade
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.tasteatlas.com/limonada-suica"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              TasteAtlas: Limonada Suíça (Brazilian Limeade)
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