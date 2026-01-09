import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PolentaWithMeatRaguCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Polenta%20with%20Meat%20Rag%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5944"
  );

  // --- DATA ---
  const title = "Polenta with Meat Ragù";
  const description = "Grilled or fried polenta served with hearty meat sauce.";

  // INGREDIENTS
  const ingredients = [
    { name: "Coarse cornmeal (polenta)", baseAmount: 250, unit: "g" },
    { name: "Water", baseAmount: 1, unit: "L" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Ground beef", baseAmount: 300, unit: "g" },
    { name: "Ground pork", baseAmount: 200, unit: "g" },
    { name: "Carrot, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Celery stalk, finely chopped", baseAmount: 1, unit: "stalk" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 2, unit: "cloves" },
    { name: "Tomato paste", baseAmount: 2, unit: "tbsp" },
    { name: "Crushed tomatoes", baseAmount: 400, unit: "g" },
    { name: "Red wine", baseAmount: 125, unit: "ml" },
    { name: "Beef broth", baseAmount: 250, unit: "ml" },
    { name: "Fresh rosemary", baseAmount: 1, unit: "sprig" },
    { name: "Bay leaf", baseAmount: 1, unit: "leaf" },
    { name: "Salt and pepper", baseAmount: 1, unit: "to taste" },
    { name: "Parmesan cheese, grated", baseAmount: 50, unit: "g" },
  ];

  const nutrition = {
    calories: "620",
    protein: "38g",
    carbs: "55g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of cornmeal is best for making polenta?",
      answer:
        "For authentic polenta, use coarse ground cornmeal. It provides a hearty texture and absorbs liquids well. Fine cornmeal or instant polenta cooks faster but lacks the traditional creamy and slightly grainy texture.",
    },
    {
      question: "Can I prepare the meat ragù in advance?",
      answer:
        "Absolutely! Meat ragù benefits from resting as flavors meld over time. Prepare it a day ahead and refrigerate. Reheat gently before serving. This also makes the sauce thicker and richer.",
    },
    {
      question: "How do I prevent polenta from sticking to the pot?",
      answer:
        "Stir polenta frequently during cooking, especially at the beginning. Use a heavy-bottomed pot and add a bit of olive oil or butter to help prevent sticking. Cooking over medium-low heat also helps.",
    },
    {
      question: "Can I substitute the meats in the ragù?",
      answer:
        "Yes, you can substitute or combine meats like veal, lamb, or even turkey depending on preference. Mixing beef and pork is classic for balanced flavor and fat content, but feel free to experiment.",
    },
    {
      question: "What is the best way to serve polenta with meat ragù?",
      answer:
        "Serve the polenta hot, either creamy or allowed to set and then grilled or fried for a crispy texture. Ladle the warm meat ragù generously over the polenta and finish with freshly grated Parmesan cheese and a drizzle of olive oil.",
    },
    {
      question: "How long does the meat ragù need to simmer?",
      answer:
        "Simmer the ragù gently for at least 1.5 to 2 hours. Slow cooking breaks down the meat fibers, intensifies flavors, and creates a rich, thick sauce. Stir occasionally and add broth or water if it becomes too dry.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Polenta with Meat Ragù"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 120m
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
            Polenta with Meat Ragù is a classic Northern Italian dish that
            combines creamy, comforting polenta with a rich, slow-cooked meat
            sauce. The polenta serves as a perfect canvas, absorbing the deep,
            savory flavors of the ragù, making it a hearty and satisfying meal
            loved by many.
          </p>
          <p>
            Originating from the northern regions of Italy, particularly Veneto
            and Lombardy, polenta was historically a staple for peasants due to
            its affordability and versatility. The meat ragù, often made with a
            blend of beef and pork, is simmered slowly with aromatic vegetables,
            wine, and tomatoes to develop a robust flavor profile. This dish
            beautifully showcases the rustic elegance of Italian country
            cooking.
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
              Prepare the Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Finely chop the carrot, celery, and onion. Mince the garlic cloves.
              These aromatics form the flavor base of the ragù.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté the Aromatics and Meat
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large pan over medium heat. Add the chopped
              vegetables and garlic, cooking until softened. Add ground beef and
              pork, breaking it up with a spoon, and cook until browned.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Deglaze and Add Tomatoes
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the red wine to deglaze the pan, scraping up any browned bits.
              Let it reduce slightly, then stir in tomato paste and crushed tomatoes.
              Add beef broth, rosemary, and bay leaf.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Simmer the Ragù
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Reduce heat to low and let the ragù simmer gently for 1.5 to 2 hours,
              stirring occasionally. Add salt and pepper to taste. Remove rosemary
              and bay leaf before serving.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Polenta
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring water and salt to a boil in a large pot. Gradually whisk in the
              cornmeal. Reduce heat to low and cook, stirring frequently, until thick
              and creamy, about 30-40 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spoon the hot polenta onto plates or a serving dish. Ladle the meat ragù
              generously over the top. Sprinkle with freshly grated Parmesan cheese
              and drizzle with a little olive oil if desired.
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
            For a firmer polenta that can be sliced and grilled, pour cooked polenta
            into a greased tray and let it cool completely before slicing.
          </li>
          <li>
            Use a mix of beef and pork for a richer ragù with balanced fat content and
            flavor.
          </li>
          <li>
            Stir the polenta frequently during cooking to prevent lumps and sticking.
          </li>
          <li>
            If the ragù becomes too thick during simmering, add a splash of beef broth
            or water to loosen it.
          </li>
          <li>
            Finish the dish with freshly grated Parmesan and a drizzle of high-quality
            extra virgin olive oil for added depth.
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