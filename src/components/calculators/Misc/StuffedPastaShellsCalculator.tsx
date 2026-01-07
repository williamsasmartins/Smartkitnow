import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function StuffedPastaShellsCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Stuffed%20Pasta%20Shells%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9291"
  );

  // --- DATA ---
  const title = "Stuffed Pasta Shells";
  const description = "Jumbo shells filled with ricotta and spinach, baked in marinara.";

  // INGREDIENTS
  const ingredients = [
    { name: "Jumbo Pasta Shells", baseAmount: 24, unit: "pieces" },
    { name: "Ricotta Cheese", baseAmount: 450, unit: "g" },
    { name: "Fresh Spinach (chopped)", baseAmount: 200, unit: "g" },
    { name: "Mozzarella Cheese (shredded)", baseAmount: 200, unit: "g" },
    { name: "Parmesan Cheese (grated)", baseAmount: 100, unit: "g" },
    { name: "Eggs", baseAmount: 2, unit: "large" },
    { name: "Garlic (minced)", baseAmount: 3, unit: "cloves" },
    { name: "Marinara Sauce", baseAmount: 700, unit: "ml" },
    { name: "Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh Basil (chopped)", baseAmount: 2, unit: "tbsp" },
    { name: "Red Pepper Flakes (optional)", baseAmount: 0.25, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutritionPerServing = {
    calories: 480,
    protein: "28g",
    carbs: "45g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  const nutrition = {
    calories: (nutritionPerServing.calories * servings / 4).toFixed(0),
    protein: `${(parseFloat(nutritionPerServing.protein) * servings / 4).toFixed(1)}g`,
    carbs: `${(parseFloat(nutritionPerServing.carbs) * servings / 4).toFixed(1)}g`,
    fat: `${(parseFloat(nutritionPerServing.fat) * servings / 4).toFixed(1)}g`,
  };

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I prepare the stuffed shells ahead of time?",
      answer:
        "Yes, you can assemble the stuffed pasta shells a day in advance and keep them covered in the refrigerator. When ready to serve, bake them as directed, adding a few extra minutes if baking from cold.",
    },
    {
      question: "What can I substitute for ricotta cheese?",
      answer:
        "If you don't have ricotta, you can use cottage cheese or cream cheese as alternatives. For a smoother texture, blend cottage cheese before mixing. Keep in mind the flavor and texture will vary slightly.",
    },
    {
      question: "How do I prevent the pasta shells from sticking together?",
      answer:
        "After boiling the jumbo shells, rinse them under cold water and toss lightly with a bit of olive oil. This helps prevent sticking and makes them easier to handle when stuffing.",
    },
    {
      question: "Can I make this recipe vegan or dairy-free?",
      answer:
        "To make a vegan version, substitute ricotta and mozzarella with plant-based cheeses or tofu-based ricotta alternatives. Use flax eggs or other egg replacers, and ensure the marinara sauce is free from animal products.",
    },
    {
      question: "What is the best way to reheat leftover stuffed shells?",
      answer:
        "Reheat leftovers covered with foil in a 350°F (175°C) oven for about 20 minutes until warmed through. Alternatively, microwave individual portions covered to retain moisture.",
    },
    {
      question: "Can I freeze stuffed pasta shells?",
      answer:
        "Absolutely! Freeze the assembled but unbaked stuffed shells in an airtight container for up to 3 months. Bake them directly from frozen, adding extra baking time and covering with foil to prevent drying out.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Stuffed Pasta Shells"
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
            Stuffed pasta shells are a classic Italian-American comfort food that combines tender jumbo pasta shells with a rich and creamy ricotta and spinach filling. Baked in a flavorful marinara sauce and topped with melted mozzarella and parmesan, this dish is perfect for family dinners or special occasions.
          </p>
          <p>
            This recipe balances fresh ingredients and simple techniques to create a hearty, satisfying meal. The combination of cheeses and spinach adds both creaminess and a touch of freshness, while the marinara sauce brings acidity and depth. Adjust the seasoning and cheese blend to your preference for a personalized touch.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Pasta Shells</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring a large pot of salted water to a boil. Add the jumbo pasta shells and cook according to package instructions until al dente (usually 10-12 minutes). Drain and rinse under cold water to stop cooking and prevent sticking. Toss with a little olive oil and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Filling</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine ricotta cheese, chopped spinach, shredded mozzarella, grated parmesan, minced garlic, eggs, salt, black pepper, and chopped fresh basil. Mix well until all ingredients are evenly incorporated.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Stuff the Shells</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 375°F (190°C). Spread a thin layer of marinara sauce on the bottom of a baking dish. Using a spoon, carefully fill each pasta shell with the cheese and spinach mixture and place them seam side up in the dish.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Bake the Dish</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the remaining marinara sauce evenly over the stuffed shells. Sprinkle additional shredded mozzarella and parmesan cheese on top. Cover the dish with foil and bake for 25 minutes. Remove the foil and bake for another 5-10 minutes until the cheese is bubbly and golden.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve and Enjoy</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Let the stuffed shells cool for a few minutes before serving. Garnish with fresh basil or parsley if desired. Serve warm with a side salad or garlic bread for a complete meal.
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
            For extra flavor, sauté the spinach with garlic and a pinch of salt before mixing it into the cheese filling to reduce moisture and intensify taste.
          </li>
          <li>
            Use fresh herbs like basil and parsley to brighten the dish and add aromatic notes.
          </li>
          <li>
            If you prefer a creamier filling, add a splash of heavy cream or substitute part of the ricotta with mascarpone cheese.
          </li>
          <li>
            To save time, prepare the filling and stuff the shells the day before baking.
          </li>
          <li>
            Cover the baking dish tightly with foil to keep the shells moist during baking and prevent the cheese from drying out.
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