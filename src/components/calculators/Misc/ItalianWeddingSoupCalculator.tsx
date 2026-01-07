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
    "https://image.pollinations.ai/prompt/Italian%20Wedding%20Soup%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4265"
  );

  // --- DATA ---
  const title = "Italian Wedding Soup";
  const description = "Broth with meatballs, greens, and tiny pasta like acini di pepe.";

  // INGREDIENTS
  const ingredients = [
    { name: "Ground Italian Sausage", baseAmount: 300, unit: "g" },
    { name: "Ground Beef", baseAmount: 200, unit: "g" },
    { name: "Breadcrumbs", baseAmount: 50, unit: "g" },
    { name: "Parmesan Cheese, grated", baseAmount: 40, unit: "g" },
    { name: "Egg", baseAmount: 1, unit: "large" },
    { name: "Garlic, minced", baseAmount: 2, unit: "cloves" },
    { name: "Fresh Parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Chicken Broth", baseAmount: 1.5, unit: "L" },
    { name: "Acini di Pepe Pasta", baseAmount: 100, unit: "g" },
    { name: "Escarole or Spinach, chopped", baseAmount: 150, unit: "g" },
    { name: "Carrot, diced", baseAmount: 1, unit: "medium" },
    { name: "Celery stalk, diced", baseAmount: 1, unit: "medium" },
    { name: "Onion, diced", baseAmount: 1, unit: "medium" },
    { name: "Olive Oil", baseAmount: 1, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "28g",
    carbs: "18g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Italian Wedding Soup and why is it called that?",
      answer:
        "Italian Wedding Soup is a traditional Italian-American soup featuring meatballs, greens, and small pasta in a flavorful broth. Despite its name, it is not typically served at weddings; the term 'wedding' refers to the 'marriage' of flavors between the meat and greens.",
    },
    {
      question: "Can I substitute the meat in the meatballs for a vegetarian option?",
      answer:
        "Yes, you can substitute meatballs with vegetarian alternatives such as lentil or mushroom-based balls, or use plant-based ground meat substitutes. Adjust cooking times accordingly to ensure they are cooked through.",
    },
    {
      question: "What type of greens work best in Italian Wedding Soup?",
      answer:
        "Traditionally, escarole is used for its slightly bitter flavor and sturdy texture. However, spinach, kale, or Swiss chard are excellent alternatives that hold up well in the broth and add vibrant color.",
    },
    {
      question: "How do I prevent the pasta from becoming mushy in the soup?",
      answer:
        "Add the pasta towards the end of cooking and cook it just until al dente. Alternatively, cook the pasta separately and add it to individual bowls before ladling the hot soup over it to maintain texture.",
    },
    {
      question: "Can I prepare Italian Wedding Soup in advance?",
      answer:
        "Yes, the soup can be made a day ahead. Store the soup and pasta separately to prevent the pasta from absorbing too much broth and becoming soggy. Reheat gently before serving.",
    },
    {
      question: "What wine pairs well with Italian Wedding Soup?",
      answer:
        "A light to medium-bodied white wine such as Pinot Grigio or Verdicchio complements the delicate flavors of the soup without overpowering it. For red wine lovers, a Chianti works well too.",
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
            Italian Wedding Soup is a comforting and hearty dish that combines savory meatballs, tender greens, and delicate pasta in a flavorful chicken broth. Originating from Southern Italy, this soup has become a beloved staple in Italian-American households, celebrated for its balance of textures and rich, yet light taste.
          </p>
          <p>
            The name "wedding" refers not to matrimonial celebrations but to the harmonious marriage of ingredients that create a perfect blend of flavors. This soup is perfect for any season, offering warmth in winter and a light, nourishing option in warmer months.
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
              In a large bowl, combine ground Italian sausage, ground beef, breadcrumbs, grated Parmesan, egg, minced garlic, chopped parsley, salt, and pepper. Mix gently until just combined. Form into small 1-inch meatballs and set aside on a tray.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté the Vegetables</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large pot over medium heat. Add diced onion, carrot, and celery. Cook until softened and fragrant, about 5-7 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Broth and Meatballs</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the chicken broth and bring to a gentle boil. Carefully add the meatballs to the broth and simmer for 15 minutes, or until cooked through.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Pasta and Greens</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add acini di pepe pasta to the simmering soup and cook until al dente, about 7-8 minutes. Stir in the chopped escarole or spinach and cook for an additional 2-3 minutes until wilted.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Season and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Taste and adjust seasoning with salt and pepper as needed. Ladle the soup into bowls and garnish with extra grated Parmesan and fresh parsley if desired. Serve hot.
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
            Use a mix of ground meats (sausage and beef) for flavorful, tender meatballs with a nice texture.
          </li>
          <li>
            Avoid overmixing the meatball mixture to keep them light and tender.
          </li>
          <li>
            If escarole is unavailable, spinach or kale are great substitutes that add color and nutrition.
          </li>
          <li>
            To keep pasta from getting mushy, cook it separately and add to bowls before ladling soup.
          </li>
          <li>
            Leftover soup tastes even better the next day as flavors meld; just store pasta separately.
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