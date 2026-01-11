import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FrijolesRefritosCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Refried%20Beans%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5373"
  );

  // --- DATA ---
  const title = "Refried Beans";
  const description = "Feijão amassado e refogado, cremoso e bem temperado.";

  // INGREDIENTS
  const ingredients = [
    { name: "Cooked Pinto Beans", baseAmount: 500, unit: "g" },
    { name: "Vegetable Oil", baseAmount: 60, unit: "ml" },
    { name: "Yellow Onion, finely chopped", baseAmount: 100, unit: "g" },
    { name: "Garlic Cloves, minced", baseAmount: 3, unit: "pcs" },
    { name: "Ground Cumin", baseAmount: 1, unit: "tsp" },
    { name: "Chili Powder", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Water or Bean Broth", baseAmount: 120, unit: "ml" },
    { name: "Fresh Cilantro, chopped (optional)", baseAmount: 10, unit: "g" },
    { name: "Lime Juice (optional)", baseAmount: 1, unit: "tbsp" },
    { name: "Cheddar Cheese, shredded (optional topping)", baseAmount: 50, unit: "g" },
    { name: "Sour Cream (optional topping)", baseAmount: 50, unit: "g" },
    { name: "Jalapeño, finely chopped (optional)", baseAmount: 1, unit: "pcs" },
  ];

  // Nutrition per 4 servings (approximate)
  const nutrition = {
    calories: "350",
    protein: "18g",
    carbs: "45g",
    fat: "8g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of beans are best for refried beans?",
      answer:
        "Traditionally, pinto beans are used for refried beans due to their creamy texture and mild flavor. However, black beans or kidney beans can also be used depending on regional preferences or dietary needs.",
    },
    {
      question: "Why are they called 'refried' beans?",
      answer:
        "The term 'refried' is a mistranslation of the Spanish 'frijoles refritos,' which actually means 'well-fried beans.' The beans are cooked and then fried again in oil or lard to develop flavor and texture, not fried twice.",
    },
    {
      question: "Can I make refried beans vegan?",
      answer:
        "Absolutely! Use vegetable oil instead of lard or animal fats, and skip any cheese or sour cream toppings or use plant-based alternatives. The recipe here uses vegetable oil by default.",
    },
    {
      question: "How can I make my refried beans creamier?",
      answer:
        "To achieve a creamier texture, mash the beans thoroughly while cooking and add warm water or bean broth gradually. Using a hand masher or immersion blender helps create a smooth consistency.",
    },
    {
      question: "How long do refried beans keep in the fridge?",
      answer:
        "Refried beans can be stored in an airtight container in the refrigerator for up to 4-5 days. Reheat gently on the stove or microwave, adding a splash of water if needed to loosen the texture.",
    },
    {
      question: "Can I freeze refried beans?",
      answer:
        "Yes, refried beans freeze well. Portion them into airtight containers or freezer bags and freeze for up to 3 months. Thaw overnight in the fridge before reheating.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Refried Beans"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 15m
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Refried beans, or "frijoles refritos," are a classic staple in Mexican and Tex-Mex cuisine. This creamy, flavorful dish is made by mashing cooked beans and frying them with aromatic ingredients like onions, garlic, and spices. It serves as a versatile side dish, a filling for burritos, or a hearty dip.
          </p>
          <p>
            The origins of refried beans trace back to indigenous Mesoamerican cultures, where beans were a dietary cornerstone. Over centuries, the recipe evolved, incorporating Spanish influences and cooking techniques. Today, refried beans are beloved worldwide for their comforting texture and rich taste.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Beans</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              If using dried beans, soak them overnight and cook until tender. Alternatively, use canned cooked pinto beans, rinsed and drained. Set aside 500g of cooked beans for 4 servings.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a skillet over medium heat. Add finely chopped onion and cook until translucent, about 5 minutes. Stir in minced garlic, ground cumin, and chili powder, cooking for another minute until fragrant.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook and Mash Beans</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the cooked beans to the skillet along with salt, pepper, and water or bean broth. Simmer gently for 5-7 minutes, then mash the beans using a potato masher or fork until creamy but still slightly chunky.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Adjust Seasoning and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Taste and adjust seasoning with additional salt, pepper, or lime juice if desired. Garnish with chopped cilantro, shredded cheddar cheese, sour cream, or jalapeño slices as preferred. Serve warm.
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
            For extra richness, substitute half of the vegetable oil with rendered pork lard or bacon fat if not vegan.
          </li>
          <li>
            Use a hand blender for ultra-smooth beans, or mash by hand for a rustic texture.
          </li>
          <li>
            To deepen flavor, cook the beans with a smoked chipotle pepper or add a splash of smoky hot sauce.
          </li>
          <li>
            Leftover refried beans make excellent fillings for tacos, burritos, or as a base for layered dips.
          </li>
          <li>
            If beans are too thick after mashing, add warm water gradually to reach desired consistency.
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
              href="https://en.wikipedia.org/wiki/Refried_beans"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Refried Beans
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/authentic-mexican-refried-beans-recipe-2342793"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Authentic Mexican Refried Beans Recipe
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