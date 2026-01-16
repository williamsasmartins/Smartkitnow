import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FriedPlantainsCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Fried%20Plantains%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2319"
  );

  // --- DATA ---
  const title = "Fried Plantains";
  const description = "Very sweet, caramelized sautéed or fried ripe plantains.";

  // INGREDIENTS
  const ingredients = [
    { name: "Ripe Plantains (about 2 large)", baseAmount: 500, unit: "g" },
    { name: "Vegetable Oil (for frying)", baseAmount: 500, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Ground Cinnamon (optional)", baseAmount: 0.5, unit: "tsp" },
    { name: "Brown Sugar (optional)", baseAmount: 1, unit: "tbsp" },
    { name: "Lime Juice (optional, for serving)", baseAmount: 1, unit: "tbsp" },
    { name: "Butter (optional, for richer flavor)", baseAmount: 20, unit: "g" },
    { name: "Honey or Maple Syrup (optional, for drizzling)", baseAmount: 15, unit: "ml" },
    { name: "Chopped Fresh Cilantro (optional, garnish)", baseAmount: 5, unit: "g" },
    { name: "Crushed Red Pepper Flakes (optional, for heat)", baseAmount: 0.25, unit: "tsp" },
    { name: "Garlic Powder (optional)", baseAmount: 0.5, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.25, unit: "tsp" },
    { name: "Lemon Zest (optional)", baseAmount: 1, unit: "tsp" },
    { name: "Vanilla Extract (optional, for sweetness)", baseAmount: 0.5, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "220",
    protein: "1.5g",
    carbs: "30g",
    fat: "10g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of plantains should I use for frying?",
      answer:
        "For fried plantains, always use ripe (yellow to black) plantains. They are sweeter and softer, which caramelizes beautifully when fried. Green plantains are starchy and better suited for savory dishes like tostones.",
    },
    {
      question: "Can I bake plantains instead of frying them?",
      answer:
        "Yes, baking is a healthier alternative. Slice ripe plantains, lightly brush with oil, and bake at 400°F (200°C) for about 20-25 minutes, flipping halfway, until golden and caramelized. The texture will be slightly different but still delicious.",
    },
    {
      question: "How do I prevent plantains from sticking to the pan?",
      answer:
        "Make sure to use enough oil to cover the bottom of the pan and heat it properly before adding the plantains. Avoid overcrowding the pan, as this lowers the oil temperature and causes sticking. Using a non-stick skillet also helps.",
    },
    {
      question: "Can I use other oils for frying plantains?",
      answer:
        "Yes, oils with a high smoke point like peanut oil, canola oil, or refined coconut oil work well. Avoid extra virgin olive oil as it has a lower smoke point and can impart a strong flavor.",
    },
    {
      question: "How do I store leftover fried plantains?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 2 days. Reheat in a skillet or oven to restore crispiness. Avoid microwaving as it can make them soggy.",
    },
    {
      question: "What are some popular ways to serve fried plantains?",
      answer:
        "Fried plantains can be served as a side dish with savory meals, topped with cinnamon sugar for dessert, or paired with dips like guacamole or spicy sauces. They also complement Caribbean and Latin American dishes wonderfully.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Fried Plantains"
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
            Fried plantains are a beloved dish across many tropical regions,
            celebrated for their natural sweetness and caramelized texture.
            Made from ripe plantains, this simple yet flavorful recipe transforms
            the humble fruit into a golden, crispy treat that pairs perfectly
            with savory or sweet accompaniments. The frying process enhances the
            sugars in the plantains, creating a delightful balance of crispy
            edges and tender centers.
          </p>
          <p>
            Originating in West Africa and widely embraced throughout the
            Caribbean, Latin America, and parts of Southeast Asia, fried
            plantains have become a staple comfort food. They are often served
            as a side dish, snack, or dessert, reflecting the versatility and
            cultural significance of plantains in global cuisines.
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
              Prepare the Plantains
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Peel the ripe plantains by cutting off the ends and slicing
              through the skin lengthwise. Remove the peel carefully, then slice
              the plantains diagonally into 1/2-inch thick pieces for optimal
              caramelization.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Heat the Oil
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour vegetable oil into a large skillet to a depth of about 1/2
              inch. Heat over medium heat until the oil reaches 350°F (175°C) or
              until a small piece of plantain sizzles immediately when added.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Fry the Plantains
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Carefully add the plantain slices in a single layer, avoiding
              overcrowding. Fry for 2-3 minutes per side or until golden brown
              and caramelized. Use a slotted spoon to transfer them to a paper
              towel-lined plate to drain excess oil.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              While still warm, sprinkle the fried plantains with salt and
              optional spices like cinnamon or garlic powder. Serve immediately,
              optionally drizzled with honey or lime juice for extra flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Optional Garnishes
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Garnish with chopped fresh cilantro, a sprinkle of crushed red
              pepper flakes, or a zest of lemon for a fresh twist. These add
              complexity and elevate the dish to restaurant quality.
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
            Use ripe plantains with black spots for maximum sweetness and
            caramelization.
          </li>
          <li>
            Maintain oil temperature between 325°F and 350°F to ensure even
            frying without burning.
          </li>
          <li>
            Avoid overcrowding the pan; fry in batches if necessary to keep oil
            hot and crispy texture.
          </li>
          <li>
            For a richer flavor, add a small knob of butter to the oil during
            the last minute of frying.
          </li>
          <li>
            Experiment with toppings like cinnamon sugar, chili powder, or a
            squeeze of fresh lime juice to customize the flavor profile.
          </li>
          <li>
            Leftover fried plantains can be reheated in a hot skillet or oven
            to restore crispiness.
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
              href="https://en.wikipedia.org/wiki/Plantain"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Plantain
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/plantain-plant"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Plantain (Plant)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/how-to-fry-plantains"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Fry Plantains
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