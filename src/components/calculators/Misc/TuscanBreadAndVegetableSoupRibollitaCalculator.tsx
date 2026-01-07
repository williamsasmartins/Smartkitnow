import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TuscanBreadAndVegetableSoupRibollitaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Tuscan%20Bread%20and%20Vegetable%20Soup%20Ribollita%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3090"
  );

  // --- DATA ---
  const title = "Tuscan Bread and Vegetable Soup (Ribollita)";
  const description =
    "Thick rustic soup with bread, beans, kale, and vegetables, reheated for extra flavor.";

  // INGREDIENTS
  const ingredients = [
    { name: "Stale Tuscan bread (preferably unsalted)", baseAmount: 250, unit: "g" },
    { name: "Cannellini beans (cooked or canned)", baseAmount: 400, unit: "g" },
    { name: "Kale (Tuscan kale or cavolo nero)", baseAmount: 200, unit: "g" },
    { name: "Savoy cabbage", baseAmount: 150, unit: "g" },
    { name: "Carrots", baseAmount: 100, unit: "g" },
    { name: "Celery stalks", baseAmount: 100, unit: "g" },
    { name: "Yellow onion", baseAmount: 150, unit: "g" },
    { name: "Garlic cloves", baseAmount: 3, unit: "cloves" },
    { name: "Tomato paste", baseAmount: 2, unit: "tbsp" },
    { name: "Vegetable broth", baseAmount: 1000, unit: "ml" },
    { name: "Extra virgin olive oil", baseAmount: 4, unit: "tbsp" },
    { name: "Fresh rosemary", baseAmount: 1, unit: "tsp" },
    { name: "Fresh thyme", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
  ];

  // Approximate nutrition per serving (4 servings)
  const nutrition = {
    calories: "320",
    protein: "15g",
    carbs: "45g",
    fat: "7g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Ribollita and why is it called that?",
      answer:
        "Ribollita is a traditional Tuscan soup made with leftover bread and vegetables. The name 'Ribollita' means 'reboiled' in Italian, referring to the practice of reheating the soup to enhance its flavors. It is a hearty, rustic dish that embodies the frugality and resourcefulness of Tuscan peasant cuisine.",
    },
    {
      question: "Can I use fresh bread instead of stale bread?",
      answer:
        "Stale bread is preferred because it absorbs the soup's liquid without disintegrating into mush, helping to thicken the soup. If you only have fresh bread, you can dry it in the oven at low heat until it becomes firm and slightly dry before using it in the recipe.",
    },
    {
      question: "What vegetables are essential for an authentic Ribollita?",
      answer:
        "Traditional Ribollita includes Tuscan kale (cavolo nero), savoy cabbage, carrots, celery, and onions. These vegetables provide the characteristic earthy and robust flavors. You can also add other seasonal vegetables, but kale and cabbage are essential for authenticity.",
    },
    {
      question: "How long should I cook Ribollita for the best flavor?",
      answer:
        "After sautéing the vegetables and simmering the soup, it’s best to let Ribollita cool and then refrigerate it overnight. Reheat (reboil) the soup the next day before serving. This resting period allows the flavors to meld and intensify, making the soup richer and more delicious.",
    },
    {
      question: "Can Ribollita be made vegan or gluten-free?",
      answer:
        "Yes, Ribollita is naturally vegan if you use vegetable broth and omit any animal products. For a gluten-free version, substitute the traditional Tuscan bread with gluten-free bread. However, the texture and taste might vary slightly from the classic version.",
    },
    {
      question: "How should Ribollita be served?",
      answer:
        "Ribollita is traditionally served hot, drizzled with extra virgin olive oil. It pairs wonderfully with a glass of robust red wine and is often enjoyed as a main course during colder months due to its hearty nature.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Tuscan Bread and Vegetable Soup (Ribollita)"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 60m
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
            Ribollita is a classic Tuscan bread and vegetable soup that has been a staple of
            Italian peasant cuisine for centuries. The name means "reboiled," reflecting the
            traditional method of reheating leftover soup to deepen its flavors. This hearty,
            rustic dish is perfect for colder months and showcases the simplicity and resourcefulness
            of Tuscan cooking.
          </p>
          <p>
            The soup combines stale bread with nutrient-rich vegetables like kale, cabbage,
            carrots, and cannellini beans, simmered slowly in a savory vegetable broth. The
            use of unsalted Tuscan bread is key to achieving the authentic texture and flavor.
            Ribollita is not only delicious but also a wonderful way to reduce food waste by
            repurposing day-old bread and leftover vegetables.
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
              Finely chop the onion, carrots, celery, and garlic. Remove the tough stems from the kale and cabbage, then chop the leaves into bite-sized pieces.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté the Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat 2 tablespoons of olive oil in a large pot over medium heat. Add the onion, carrots, celery, and garlic, cooking gently until softened and fragrant, about 8-10 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Greens and Tomato Paste</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the kale and cabbage, cooking until they begin to wilt. Add the tomato paste, rosemary, thyme, salt, and pepper, stirring to combine.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Broth and Beans</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the vegetable broth and add the cannellini beans. Bring the soup to a boil, then reduce heat and simmer gently for 40 minutes, stirring occasionally.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Bread and Simmer</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Tear the stale bread into chunks and add to the pot. Stir well and simmer for another 10 minutes until the bread breaks down and thickens the soup.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Rest and Reheat</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Let the soup cool, then refrigerate overnight. Reheat the next day by gently boiling (reboiling) before serving. Drizzle with remaining olive oil and enjoy.
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
            Use authentic Tuscan unsalted bread if possible; its firm texture and lack of salt balance the soup perfectly.
          </li>
          <li>
            Don’t skip the resting step — letting the soup sit overnight and reheating it enhances the depth of flavor.
          </li>
          <li>
            Adjust the thickness by adding more broth if you prefer a soupier consistency or more bread for a thicker stew.
          </li>
          <li>
            Finish with a generous drizzle of high-quality extra virgin olive oil to add richness and aroma.
          </li>
          <li>
            For added flavor, consider adding a Parmesan rind during simmering, removing it before serving.
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