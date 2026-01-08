import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SpaghettiWithClamsCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Spaghetti%20with%20Clams%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8302"
  );

  // --- DATA ---
  const title = "Spaghetti with Clams";
  const description = "Clams cooked in white wine, garlic, and parsley sauce.";

  // INGREDIENTS
  const ingredients = [
    { name: "Spaghetti", baseAmount: 400, unit: "g" },
    { name: "Fresh clams (cleaned)", baseAmount: 1000, unit: "g" },
    { name: "Extra virgin olive oil", baseAmount: 60, unit: "ml" },
    { name: "Garlic cloves (minced)", baseAmount: 4, unit: "pcs" },
    { name: "Dry white wine", baseAmount: 150, unit: "ml" },
    { name: "Fresh flat-leaf parsley (chopped)", baseAmount: 15, unit: "g" },
    { name: "Red chili flakes", baseAmount: 1, unit: "tsp" },
    { name: "Sea salt", baseAmount: 1, unit: "tsp" },
    { name: "Freshly ground black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Lemon (zested and juiced)", baseAmount: 1, unit: "pc" },
    { name: "Water (for pasta cooking)", baseAmount: 4000, unit: "ml" },
    { name: "Coarse sea salt (for pasta water)", baseAmount: 20, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "28g",
    carbs: "70g",
    fat: "10g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of clams are best for Spaghetti with Clams?",
      answer:
        "The best clams for this dish are small, tender varieties such as littleneck or Manila clams. They open quickly when cooked and have a sweet, briny flavor that complements the sauce perfectly. Always ensure the clams are fresh and properly cleaned to avoid grit.",
    },
    {
      question: "How do I clean clams properly before cooking?",
      answer:
        "To clean clams, soak them in a bowl of cold salted water (about 35g salt per liter) for at least 20-30 minutes. This encourages them to expel sand and grit. Rinse them under cold running water afterward, scrubbing the shells gently if needed. Discard any clams that remain open or have broken shells.",
    },
    {
      question: "Can I use bottled clam juice instead of fresh clams?",
      answer:
        "While bottled clam juice can add flavor, it cannot replace the texture and freshness of whole clams. For an authentic and satisfying dish, fresh clams are highly recommended. If using clam juice, consider adding it to the sauce for extra depth but still use fresh or frozen clams if possible.",
    },
    {
      question: "How do I prevent the pasta from sticking together?",
      answer:
        "Use plenty of boiling salted water when cooking the spaghetti, and stir occasionally during cooking. Adding salt not only flavors the pasta but also helps prevent sticking. Once drained, toss the pasta immediately with a bit of olive oil or some of the sauce to keep it separated.",
    },
    {
      question: "Can I prepare Spaghetti with Clams ahead of time?",
      answer:
        "This dish is best served fresh to enjoy the clams at their peak tenderness and flavor. However, you can prepare the sauce and clean the clams in advance. Cook the pasta just before serving and combine everything quickly to maintain texture and taste.",
    },
    {
      question: "What wine pairs well with Spaghetti with Clams?",
      answer:
        "A crisp, dry white wine such as Pinot Grigio, Vermentino, or Sauvignon Blanc pairs beautifully with this dish. The acidity and minerality of these wines complement the briny clams and garlic sauce perfectly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Spaghetti with Clams"
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
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-base">
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
            Spaghetti with Clams, or "Spaghetti alle Vongole," is a classic Italian
            seafood pasta dish celebrated for its simplicity and vibrant flavors.
            Combining tender clams with garlic, white wine, olive oil, and fresh
            parsley, this dish captures the essence of coastal Italian cuisine.
            Perfect for a quick yet elegant meal, it balances the briny sweetness
            of clams with the comforting texture of al dente spaghetti.
          </p>
          <p>
            Originating from the coastal regions of Campania and Naples, Spaghetti
            alle Vongole has been a beloved staple for centuries. Traditionally
            prepared by fishermen and their families, it showcases the bounty of
            the sea with minimal ingredients to highlight freshness. Today, it is
            enjoyed worldwide as a symbol of Italian culinary heritage and coastal
            simplicity.
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
              Prepare the Clams
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the clams thoroughly under cold water. Soak them in salted cold
              water for 20-30 minutes to purge any sand. Discard any clams that do
              not close when tapped.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Pasta
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring a large pot of salted water to a boil. Add spaghetti and cook
              until al dente according to package instructions. Reserve about 1 cup
              of pasta water, then drain the pasta.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Garlic and Chili
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large skillet, heat olive oil over medium heat. Add minced garlic
              and red chili flakes, cooking gently until fragrant but not browned,
              about 1-2 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Clams and Wine
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the cleaned clams to the skillet and pour in the white wine.
              Cover with a lid and cook for 5-7 minutes, shaking the pan occasionally,
              until the clams open. Discard any unopened clams.
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
              Add the drained spaghetti to the skillet with clams. Toss gently to
              combine, adding reserved pasta water as needed to loosen the sauce.
              Stir in chopped parsley, lemon zest, and juice. Season with salt and
              pepper to taste.
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
              Plate the spaghetti with clams immediately while hot. Garnish with
              extra parsley and a drizzle of olive oil if desired. Enjoy with a
              chilled glass of white wine.
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
            Always use fresh clams and discard any that are cracked or remain open
            after tapping to ensure safety and quality.
          </li>
          <li>
            Reserve some pasta water before draining; its starchiness helps bind the
            sauce and pasta together for a silky finish.
          </li>
          <li>
            Avoid overcooking the clams to keep them tender and juicy; once they
            open, they are ready.
          </li>
          <li>
            For an extra burst of flavor, add a splash of high-quality extra virgin
            olive oil just before serving.
          </li>
          <li>
            If you prefer a milder heat, reduce or omit the red chili flakes.
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