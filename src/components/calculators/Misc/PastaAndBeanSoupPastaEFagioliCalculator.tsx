import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PastaAndBeanSoupPastaEFagioliCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Pasta%20and%20Bean%20Soup%20Pasta%20e%20Fagioli%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3562"
  );

  // --- DATA ---
  const title = "Pasta and Bean Soup (Pasta e Fagioli)";
  const description = "Comforting soup of pasta, cannellini beans, tomatoes, and herbs.";

  // INGREDIENTS
  const ingredients = [
    { name: "Cannellini Beans (cooked)", baseAmount: 400, unit: "g" },
    { name: "Ditalini Pasta", baseAmount: 100, unit: "g" },
    { name: "Carrot (finely chopped)", baseAmount: 1, unit: "medium" },
    { name: "Celery Stalk (finely chopped)", baseAmount: 1, unit: "stalk" },
    { name: "Yellow Onion (finely chopped)", baseAmount: 1, unit: "medium" },
    { name: "Garlic Cloves (minced)", baseAmount: 3, unit: "cloves" },
    { name: "Canned Diced Tomatoes", baseAmount: 400, unit: "g" },
    { name: "Vegetable Broth", baseAmount: 1, unit: "L" },
    { name: "Extra Virgin Olive Oil", baseAmount: 3, unit: "tbsp" },
    { name: "Fresh Rosemary (chopped)", baseAmount: 1, unit: "tsp" },
    { name: "Fresh Thyme (chopped)", baseAmount: 1, unit: "tsp" },
    { name: "Bay Leaf", baseAmount: 1, unit: "leaf" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Parmesan Cheese (optional, for serving)", baseAmount: 50, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "15g",
    carbs: "45g",
    fat: "6g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    base * (servings / 4) % 1 === 0
      ? (base * (servings / 4)).toFixed(0)
      : (base * (servings / 4)).toFixed(1);

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of pasta is best for Pasta e Fagioli?",
      answer:
        "Traditionally, small pasta shapes like ditalini or small shells are used because they hold the soup well and provide a pleasant texture. However, you can substitute with any small pasta you prefer, such as elbow macaroni or small tubetti.",
    },
    {
      question: "Can I use dried beans instead of canned beans?",
      answer:
        "Yes, you can use dried cannellini beans, but they require soaking overnight and longer cooking times. Using canned beans is a convenient shortcut that saves time without compromising flavor.",
    },
    {
      question: "How can I make this soup vegan?",
      answer:
        "To make this soup vegan, simply omit the Parmesan cheese or use a plant-based cheese alternative. Ensure your vegetable broth is vegan-friendly as well.",
    },
    {
      question: "Can I prepare Pasta e Fagioli in advance?",
      answer:
        "Absolutely! This soup tastes even better the next day as the flavors meld. Store it in an airtight container in the refrigerator for up to 3 days. Reheat gently on the stove and add extra broth if it thickens too much.",
    },
    {
      question: "What are some good garnishes for this soup?",
      answer:
        "Freshly grated Parmesan cheese, a drizzle of high-quality extra virgin olive oil, chopped fresh parsley, or a sprinkle of crushed red pepper flakes all complement the flavors beautifully.",
    },
    {
      question: "Can I freeze Pasta e Fagioli?",
      answer:
        "Yes, you can freeze this soup for up to 3 months. It's best to undercook the pasta slightly before freezing to prevent it from becoming mushy upon reheating.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Pasta and Bean Soup (Pasta e Fagioli)"
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
            Pasta e Fagioli, literally translating to "pasta and beans," is a classic Italian
            comfort food that has been enjoyed for centuries. This hearty soup combines simple,
            wholesome ingredients like cannellini beans, small pasta, fresh vegetables, and
            fragrant herbs to create a nourishing and flavorful dish. Originating from humble
            peasant roots, it showcases the Italian philosophy of making the most out of pantry
            staples.
          </p>
          <p>
            This recipe balances creamy beans with tender pasta and a rich tomato broth, making it
            perfect for chilly days or whenever you crave a satisfying, nutritious meal. Its
            versatility allows for easy adjustments to suit dietary preferences, and it pairs
            beautifully with crusty bread or a fresh green salad.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Vegetables</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Finely chop the carrot, celery stalk, and yellow onion. Mince the garlic cloves.
              These aromatics form the flavorful base of the soup.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat the olive oil in a large pot over medium heat. Add the chopped onion, carrot,
              and celery, cooking until softened and fragrant, about 5-7 minutes. Stir in the
              minced garlic and cook for another minute.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Tomatoes and Herbs</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the canned diced tomatoes along with their juices. Add the rosemary,
              thyme, bay leaf, salt, and black pepper. Stir well to combine.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Simmer the Soup</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the vegetable broth and bring the mixture to a boil. Reduce heat to low and
              simmer uncovered for 20 minutes to allow flavors to meld.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Beans and Pasta</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the cooked cannellini beans and ditalini pasta. Continue to simmer until
              the pasta is tender, about 10-12 minutes. Adjust seasoning with salt and pepper as
              needed.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the bay leaf. Ladle the soup into bowls and garnish with freshly grated
              Parmesan cheese and a drizzle of extra virgin olive oil if desired. Serve hot.
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
            Use homemade vegetable broth if possible for a richer, more complex flavor.
          </li>
          <li>
            To save time, cook dried beans in advance or use canned beans rinsed well to reduce
            sodium.
          </li>
          <li>
            Avoid overcooking the pasta; it should be al dente to maintain texture in the soup.
          </li>
          <li>
            For a smoky depth, add a small piece of pancetta or smoked bacon during the sauté
            step (optional).
          </li>
          <li>
            Fresh herbs elevate the dish, but dried herbs can be used in a pinch—just reduce the
            quantity by half.
          </li>
          <li>
            Leftover soup thickens as it cools; add a splash of broth or water when reheating to
            loosen it up.
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