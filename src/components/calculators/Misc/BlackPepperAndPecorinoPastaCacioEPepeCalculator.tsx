import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BlackPepperAndPecorinoPastaCacioEPepeCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Black%20Pepper%20and%20Pecorino%20Pasta%20Cacio%20e%20Pepe%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6412"
  );

  // --- DATA ---
  const title = "Black Pepper and Pecorino Pasta (Cacio e Pepe)";
  const description = "Simple yet bold pasta with Pecorino Romano and freshly ground black pepper.";

  // INGREDIENTS
  const ingredients = [
    { name: "Spaghetti", baseAmount: 400, unit: "g" },
    { name: "Pecorino Romano Cheese, finely grated", baseAmount: 150, unit: "g" },
    { name: "Freshly ground black pepper", baseAmount: 2, unit: "tbsp" },
    { name: "Salt (for pasta water)", baseAmount: 1, unit: "tbsp" },
    { name: "Unsalted butter", baseAmount: 30, unit: "g" },
    { name: "Pasta cooking water", baseAmount: 500, unit: "ml" },
    { name: "Extra Pecorino Romano (for garnish)", baseAmount: 20, unit: "g" },
    { name: "Extra black pepper (for garnish)", baseAmount: 1, unit: "tsp" },
    { name: "Olive oil (optional)", baseAmount: 1, unit: "tsp" },
    { name: "Garlic clove (optional, crushed)", baseAmount: 1, unit: "clove" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "520",
    protein: "22g",
    carbs: "70g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the origin of Cacio e Pepe?",
      answer:
        "Cacio e Pepe is a traditional Roman pasta dish dating back to ancient times. Its name literally means 'cheese and pepper' in Italian, highlighting its simple yet flavorful ingredients. It was originally a shepherd's meal, relying on pantry staples like Pecorino Romano cheese and black pepper.",
    },
    {
      question: "How do I prevent the sauce from clumping?",
      answer:
        "To avoid clumping, ensure you use hot pasta water and add it gradually while vigorously stirring the cheese and pepper mixture. The starch in the pasta water helps emulsify the sauce, creating a creamy texture. Also, grate the Pecorino Romano finely for easier melting.",
    },
    {
      question: "Can I use other types of pasta for this recipe?",
      answer:
        "While spaghetti is traditional, you can use other long pasta types like tonnarelli, bucatini, or linguine. The key is that the pasta surface should be able to hold the creamy sauce well. Avoid very thick or short pasta shapes as they may not coat evenly.",
    },
    {
      question: "Is it necessary to use Pecorino Romano cheese?",
      answer:
        "Pecorino Romano is preferred for its sharp, salty flavor that defines the dish. However, if unavailable, you can substitute with aged Parmesan or a mix of Parmesan and Pecorino, but the taste will be slightly different from the authentic Roman flavor.",
    },
    {
      question: "Can I prepare this dish vegan or lactose-free?",
      answer:
        "Traditional Cacio e Pepe relies heavily on cheese and butter, making it challenging to veganize authentically. However, you can experiment with vegan hard cheeses and plant-based butter substitutes. Keep in mind the flavor and texture will differ from the classic recipe.",
    },
    {
      question: "How do I adjust the pepper intensity to my taste?",
      answer:
        "Black pepper is the star spice here. Start with the recommended amount and taste the sauce before plating. You can always add more freshly ground black pepper to increase the heat and aroma. Toasting the pepper lightly before adding can also enhance its flavor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Black Pepper and Pecorino Pasta (Cacio e Pepe)"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 10m
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
            Cacio e Pepe is a quintessential Roman pasta dish that celebrates
            simplicity and bold flavors. The name translates to "cheese and
            pepper," which perfectly encapsulates the essence of this recipe.
            Using just a few pantry staples, it delivers a creamy, peppery,
            and deeply satisfying meal that has stood the test of time.
          </p>
          <p>
            The magic lies in the technique: combining finely grated Pecorino
            Romano cheese with freshly cracked black pepper and starchy pasta
            water to create a luscious sauce that clings to every strand of
            spaghetti. This dish is perfect for those who appreciate authentic
            Italian cuisine with minimal fuss but maximum flavor.
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
              Prepare the Pasta Water
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring a large pot of water to a boil. Add salt generously to the
              water to season the pasta. This is crucial for flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Spaghetti
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add spaghetti to the boiling water and cook until al dente,
              usually about 8-9 minutes. Reserve about 500ml of pasta water
              before draining.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Toast the Black Pepper
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large skillet over medium heat, toast freshly ground black
              pepper for 1-2 minutes until fragrant. Optionally, add crushed
              garlic and butter to infuse flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Create the Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add a ladle of reserved pasta water to the skillet and bring to a
              simmer. Gradually add the grated Pecorino Romano cheese off the
              heat, stirring vigorously to create a creamy emulsion without
              clumps.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Combine Pasta and Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Toss the drained spaghetti into the sauce, adding more pasta
              water if needed to achieve a silky consistency. Mix well to coat
              evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve Immediately
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Plate the pasta and garnish with extra Pecorino Romano and a
              generous sprinkle of freshly ground black pepper. Serve hot for
              the best experience.
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
            Use freshly cracked black pepper rather than pre-ground for a more
            vibrant aroma and flavor.
          </li>
          <li>
            Finely grate the Pecorino Romano cheese to help it melt smoothly
            and avoid clumping.
          </li>
          <li>
            Reserve ample pasta water as its starch content is essential for
            creating the creamy sauce texture.
          </li>
          <li>
            Work off the heat when mixing cheese into the pasta water to
            prevent the cheese from overheating and clumping.
          </li>
          <li>
            Toasting the pepper gently in butter or olive oil enhances its
            flavor and adds depth to the dish.
          </li>
          <li>
            Serve immediately after preparation as the sauce thickens and
            clumps if left to sit.
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