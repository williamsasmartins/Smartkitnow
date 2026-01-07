import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ItalianWeddingSoupCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Italian%20Wedding%20Soup%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5537"
  );

  // --- DATA ---
  const title = "Italian Wedding Soup";
  const description = "Broth with meatballs, greens, and tiny pasta like acini di pepe.";

  // INGREDIENTS
  const ingredients = [
    { name: "Ground Italian Sausage (mild or spicy)", baseAmount: 300, unit: "g" },
    { name: "Ground Beef", baseAmount: 200, unit: "g" },
    { name: "Italian Bread Crumbs", baseAmount: 50, unit: "g" },
    { name: "Parmesan Cheese, grated", baseAmount: 50, unit: "g" },
    { name: "Egg", baseAmount: 1, unit: "large" },
    { name: "Garlic, minced", baseAmount: 2, unit: "cloves" },
    { name: "Fresh Parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Chicken Broth", baseAmount: 1500, unit: "ml" },
    { name: "Acini di Pepe Pasta", baseAmount: 100, unit: "g" },
    { name: "Escarole or Spinach, chopped", baseAmount: 150, unit: "g" },
    { name: "Carrot, diced", baseAmount: 1, unit: "medium" },
    { name: "Celery stalk, diced", baseAmount: 1, unit: "medium" },
    { name: "Onion, diced", baseAmount: 1, unit: "medium" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "25g",
    carbs: "20g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Italian Wedding Soup?",
      answer:
        "Italian Wedding Soup is a traditional Italian-American soup featuring small meatballs, leafy greens, and tiny pasta in a flavorful chicken broth. Despite its name, it is not typically served at weddings but rather refers to the 'marriage' of flavors between the meat and greens.",
    },
    {
      question: "Can I make the meatballs ahead of time?",
      answer:
        "Yes, you can prepare the meatballs a day in advance and refrigerate them. This allows the flavors to meld and makes the cooking process quicker. Just be sure to keep them covered and refrigerated until ready to use.",
    },
    {
      question: "What greens can I use if I can't find escarole?",
      answer:
        "If escarole is unavailable, you can substitute with other sturdy greens like spinach, kale, or Swiss chard. These greens hold up well in soup and provide a similar texture and flavor profile.",
    },
    {
      question: "How do I prevent the pasta from getting mushy?",
      answer:
        "Add the acini di pepe pasta towards the end of cooking and cook it just until al dente. Overcooking pasta in soup can cause it to become mushy and absorb too much broth.",
    },
    {
      question: "Is there a vegetarian version of Italian Wedding Soup?",
      answer:
        "Yes, you can make a vegetarian version by omitting the meatballs and using vegetable broth. You can add plant-based meat alternatives or extra beans for protein, and plenty of vegetables to keep it hearty.",
    },
    {
      question: "How long can I store leftover soup?",
      answer:
        "Leftover Italian Wedding Soup can be stored in an airtight container in the refrigerator for up to 3 days. Reheat gently on the stove to avoid overcooking the pasta and greens.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Italian Wedding Soup"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 30m
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
                    {ing.unit === "large" || ing.unit === "medium"
                      ? `${Math.round(getAmount(ing.baseAmount))} ${ing.unit}`
                      : `${getAmount(ing.baseAmount)} ${ing.unit}`}
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

  // --- EDITORIAL CONTENT (BIGGER FONTS) ---
  const editorial = (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Italian Wedding Soup is a comforting and hearty soup that combines savory meatballs, tender greens, and delicate pasta in a rich chicken broth. This dish is beloved for its balanced flavors and satisfying texture, making it a perfect starter or light meal year-round.
          </p>
          <p>
            Traditionally, the meatballs are made with a mixture of ground beef and Italian sausage, seasoned with garlic, parsley, and Parmesan cheese. The greens, often escarole or spinach, add a fresh, slightly bitter contrast that complements the richness of the meat. The tiny acini di pepe pasta adds a delightful bite without overpowering the soup.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Meatballs</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the ground Italian sausage, ground beef, bread crumbs, grated Parmesan, minced garlic, chopped parsley, egg, salt, and pepper. Mix gently until just combined. Shape the mixture into small 1-inch meatballs and place them on a baking sheet or plate.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté the Vegetables</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pot, heat a tablespoon of olive oil over medium heat. Add the diced onion, carrot, and celery, and sauté until softened and fragrant, about 5-7 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Meatballs</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Carefully add the meatballs to the pot and brown them lightly on all sides, about 5 minutes. This step adds flavor and helps the meatballs hold together.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Broth and Simmer</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the chicken broth and bring the soup to a gentle boil. Reduce heat and simmer for 15 minutes, allowing the meatballs to cook through and the flavors to meld.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook Pasta and Add Greens</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the acini di pepe pasta to the simmering soup and cook for about 7 minutes until al dente. Then stir in the chopped escarole or spinach and cook for another 2-3 minutes until wilted.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Season and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Taste the soup and adjust seasoning with salt and pepper as needed. Serve hot, garnished with extra grated Parmesan and fresh parsley if desired.
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
            Use a mix of ground sausage and beef for flavorful, tender meatballs with a nice balance of fat and seasoning.
          </li>
          <li>
            If you prefer a lighter soup, substitute half the chicken broth with water or low-sodium broth.
          </li>
          <li>
            To keep the soup clear and flavorful, avoid stirring too vigorously once the meatballs are added.
          </li>
          <li>
            For a gluten-free version, use gluten-free bread crumbs and pasta alternatives like small rice or corn pasta.
          </li>
          <li>
            Leftover soup tastes even better the next day as the flavors continue to develop.
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