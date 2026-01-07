import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MinestroneSoupCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Minestrone%20Soup%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4518"
  );

  // --- DATA ---
  const title = "Minestrone Soup";
  const description =
    "Hearty vegetable soup with beans, pasta, and seasonal greens in a tomato broth.";

  // INGREDIENTS
  const ingredients = [
    { name: "Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Yellow Onion, diced", baseAmount: 1, unit: "medium" },
    { name: "Carrots, diced", baseAmount: 2, unit: "medium" },
    { name: "Celery stalks, diced", baseAmount: 2, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Zucchini, diced", baseAmount: 1, unit: "medium" },
    { name: "Green beans, chopped", baseAmount: 100, unit: "g" },
    { name: "Canned diced tomatoes", baseAmount: 400, unit: "g" },
    { name: "Vegetable broth", baseAmount: 1000, unit: "ml" },
    { name: "Cannellini beans, drained and rinsed", baseAmount: 240, unit: "g" },
    { name: "Small pasta (e.g. ditalini)", baseAmount: 75, unit: "g" },
    { name: "Fresh spinach or kale, chopped", baseAmount: 100, unit: "g" },
    { name: "Fresh parsley, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "280",
    protein: "12g",
    carbs: "40g",
    fat: "6g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the origin of Minestrone Soup?",
      answer:
        "Minestrone soup originates from Italy and is a traditional thick vegetable soup that varies regionally. It has roots dating back to ancient Roman times, evolving as a hearty, economical dish made from seasonal vegetables, beans, and pasta or rice.",
    },
    {
      question: "Can I make Minestrone Soup vegan or gluten-free?",
      answer:
        "Yes! Minestrone is naturally vegan if you use vegetable broth and omit any cheese toppings. For gluten-free, substitute regular pasta with gluten-free pasta or omit pasta altogether and add more beans or rice.",
    },
    {
      question: "How do I store and reheat Minestrone Soup?",
      answer:
        "Store Minestrone in an airtight container in the refrigerator for up to 4 days. Reheat gently on the stove over medium heat, adding a splash of broth or water if it has thickened. It also freezes well for up to 3 months.",
    },
    {
      question: "Can I prepare Minestrone Soup ahead of time?",
      answer:
        "Absolutely! Minestrone often tastes better the next day as the flavors meld. Prepare it a day ahead and refrigerate. Add delicate greens like spinach just before serving to keep them fresh.",
    },
    {
      question: "What variations can I try with Minestrone Soup?",
      answer:
        "You can customize Minestrone by using different seasonal vegetables, swapping beans (kidney, borlotti), adding meats like pancetta or sausage for non-vegetarian versions, or changing herbs such as basil or thyme to suit your taste.",
    },
    {
      question: "How do I prevent the pasta from getting mushy in Minestrone?",
      answer:
        "To avoid mushy pasta, cook it separately until al dente and add it to individual bowls before ladling the soup on top. Alternatively, add pasta towards the end of cooking and serve immediately.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Minestrone Soup"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 40m
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
            Minestrone Soup is a classic Italian vegetable soup that celebrates the
            bounty of seasonal produce. This hearty and nutritious dish combines a
            medley of fresh vegetables, beans, and small pasta in a savory tomato
            broth, making it a comforting meal perfect for any time of year.
          </p>
          <p>
            Traditionally a peasant dish, minestrone has evolved into countless
            regional variations, each reflecting local ingredients and tastes. Its
            versatility and wholesome flavors have made it a beloved staple in
            kitchens worldwide.
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
              Prepare the Base
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large pot over medium heat. Add diced onion,
              carrots, and celery, sautéing until softened and fragrant, about 7-8
              minutes. Stir in minced garlic and cook for another minute.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Vegetables and Tomatoes
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add diced zucchini and chopped green beans to the pot. Pour in the
              canned diced tomatoes with their juices and vegetable broth. Stir to
              combine.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Simmer the Soup
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring the soup to a boil, then reduce heat to low and simmer uncovered
              for 25 minutes, allowing flavors to meld and vegetables to become
              tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Beans and Pasta
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the cannellini beans and small pasta. Cook for an additional 10
              minutes or until the pasta is al dente.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Finish with Greens and Seasoning
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add chopped spinach or kale and cook until wilted, about 2-3 minutes.
              Season with salt, black pepper, and fresh parsley. Serve hot.
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
            Use homemade vegetable broth for a richer, more authentic flavor.
          </li>
          <li>
            To add depth, sauté a small amount of pancetta or smoked bacon with the
            vegetables if you’re not keeping it vegetarian.
          </li>
          <li>
            For a creamier texture, blend a portion of the soup and stir it back in.
          </li>
          <li>
            Add pasta just before serving or cook separately to prevent it from
            absorbing too much broth and becoming mushy.
          </li>
          <li>
            Garnish with freshly grated Parmesan cheese and a drizzle of good quality
            olive oil for an extra touch of indulgence.
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