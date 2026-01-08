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
    "https://image.pollinations.ai/prompt/Black%20Pepper%20and%20Pecorino%20Pasta%20Cacio%20e%20Pepe%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7658"
  );

  // --- DATA ---
  const title = "Black Pepper and Pecorino Pasta (Cacio e Pepe)";
  const description = "Simple yet bold pasta with Pecorino Romano and freshly ground black pepper.";

  // INGREDIENTS
  const ingredients = [
    { name: "Spaghetti or Tonarelli Pasta", baseAmount: 400, unit: "g" },
    { name: "Pecorino Romano Cheese, finely grated", baseAmount: 150, unit: "g" },
    { name: "Freshly ground black pepper", baseAmount: 2, unit: "tbsp" },
    { name: "Salt (for pasta water)", baseAmount: 1, unit: "tbsp" },
    { name: "Pasta cooking water", baseAmount: 500, unit: "ml" },
    { name: "Unsalted butter (optional, for creaminess)", baseAmount: 20, unit: "g" },
    { name: "Extra Pecorino Romano (for garnish)", baseAmount: 20, unit: "g" },
    { name: "Olive oil (optional, for finishing)", baseAmount: 1, unit: "tsp" },
    { name: "Black peppercorns (whole, for toasting)", baseAmount: 1, unit: "tbsp" },
  ];

  // Approximate nutrition per 4 servings
  const nutrition = {
    calories: "620",
    protein: "28g",
    carbs: "85g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of pasta is best for Cacio e Pepe?",
      answer:
        "Traditionally, tonarelli or spaghetti are used for Cacio e Pepe. Tonarelli, a thicker spaghetti-like pasta with a square cross-section, holds the sauce beautifully. However, spaghetti or even bucatini can work well if tonarelli is unavailable.",
    },
    {
      question: "How do I prevent the cheese from clumping when mixing?",
      answer:
        "To avoid clumping, grate the Pecorino Romano cheese finely and mix it gradually with hot pasta water to create a creamy emulsion before combining with the pasta. Stir vigorously and ensure the pasta is hot enough to melt the cheese but not so hot that it causes clumps.",
    },
    {
      question: "Can I use Parmesan instead of Pecorino Romano?",
      answer:
        "While Parmesan can be used, Pecorino Romano is preferred for its sharp, salty, and tangy flavor that defines Cacio e Pepe. Using Parmesan will result in a milder taste and less authentic experience.",
    },
    {
      question: "Why do we toast the black peppercorns?",
      answer:
        "Toasting whole black peppercorns enhances their aroma and flavor, adding a smoky, robust depth to the dish. Freshly grinding them after toasting releases essential oils that elevate the pasta’s peppery character.",
    },
    {
      question: "Is butter necessary in this recipe?",
      answer:
        "Butter is optional and can be added to enrich the sauce and improve creaminess. Traditional recipes often omit it, relying solely on cheese and pasta water for the sauce’s texture.",
    },
    {
      question: "How do I adjust the recipe for different serving sizes?",
      answer:
        "Use the serving size buttons to increase or decrease the number of servings. Ingredient quantities will adjust proportionally to maintain the recipe’s balance and flavor.",
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
            Cacio e Pepe, which translates to "cheese and pepper," is a classic Roman pasta dish
            that celebrates simplicity and bold flavors. This recipe combines just a few
            ingredients—Pecorino Romano cheese, freshly ground black pepper, and pasta—to create a
            creamy, peppery sauce that clings perfectly to every strand. Its minimalist approach
            highlights the quality of each component, making it a beloved staple in Italian
            cuisine.
          </p>
          <p>
            Originating from the shepherds of the Lazio region, Cacio e Pepe was a practical and
            hearty meal made with pantry staples. Over centuries, it has evolved into a refined
            dish served in trattorias and Michelin-starred restaurants alike. The technique of
            emulsifying cheese with pasta water to create a luscious sauce is a hallmark of Italian
            culinary artistry.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Toast the Pepper</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a dry skillet over medium heat, toast the whole black peppercorns until fragrant,
              about 2-3 minutes. Remove from heat and grind them coarsely using a mortar and pestle
              or pepper mill. Set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Pasta</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring a large pot of salted water to a boil. Add the pasta and cook until just shy of
              al dente (about 1-2 minutes less than package instructions). Reserve at least 500ml
              of pasta water, then drain the pasta.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large mixing bowl, combine the finely grated Pecorino Romano and freshly ground
              black pepper. Slowly add about 200ml of hot pasta water, stirring vigorously to create
              a smooth, creamy emulsion. Add butter if using, stirring until melted and incorporated.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine Pasta and Sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the hot pasta to the bowl with the sauce. Toss vigorously, adding more reserved
              pasta water as needed to achieve a silky, clingy sauce that coats the pasta evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve Immediately</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Plate the pasta and garnish with extra Pecorino Romano and a generous sprinkle of
              freshly ground black pepper. Optionally drizzle a little olive oil for added richness.
              Serve hot for the best experience.
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
            Use freshly grated Pecorino Romano cheese for the best flavor and smooth melting
            texture. Pre-grated cheese often contains anti-caking agents that prevent proper
            emulsification.
          </li>
          <li>
            Reserve ample pasta water; its starch content is essential for creating the creamy
            sauce without cream.
          </li>
          <li>
            Toasting and freshly grinding black peppercorns significantly enhances the aroma and
            flavor compared to pre-ground pepper.
          </li>
          <li>
            Work quickly when combining pasta and sauce to prevent the cheese from clumping or
            cooling too fast.
          </li>
          <li>
            If the sauce becomes too thick or clumpy, add a splash of hot pasta water and whisk
            vigorously to smooth it out.
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