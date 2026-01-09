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
    "https://image.pollinations.ai/prompt/Stuffed%20Pasta%20Shells%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5244"
  );

  // --- DATA ---
  const title = "Stuffed Pasta Shells";
  const description = "Jumbo shells filled with ricotta and spinach, baked in marinara.";

  // INGREDIENTS
  const ingredients = [
    { name: "Jumbo pasta shells", baseAmount: 24, unit: "pieces" },
    { name: "Ricotta cheese", baseAmount: 450, unit: "g" },
    { name: "Fresh spinach, chopped", baseAmount: 200, unit: "g" },
    { name: "Mozzarella cheese, shredded", baseAmount: 200, unit: "g" },
    { name: "Parmesan cheese, grated", baseAmount: 100, unit: "g" },
    { name: "Egg", baseAmount: 1, unit: "large" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Marinara sauce", baseAmount: 700, unit: "ml" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh basil, chopped", baseAmount: 15, unit: "g" },
    { name: "Red pepper flakes (optional)", baseAmount: 0.25, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "28g",
    carbs: "45g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I prepare stuffed pasta shells ahead of time?",
      answer:
        "Yes, you can prepare the stuffed shells a day in advance. Assemble the shells and place them in the baking dish covered tightly with plastic wrap. Refrigerate overnight and bake just before serving, adding a few extra minutes to the baking time if baking from cold.",
    },
    {
      question: "What cheese can I substitute for ricotta?",
      answer:
        "If ricotta is unavailable, you can substitute with cottage cheese (preferably well-drained) or a blend of cream cheese and mozzarella for a similar creamy texture. Keep in mind that the flavor and texture will vary slightly.",
    },
    {
      question: "How do I prevent the pasta shells from sticking together?",
      answer:
        "After boiling the jumbo pasta shells, drain them carefully and rinse with cold water to stop the cooking process. Toss them lightly with a bit of olive oil to prevent sticking. Handle gently when stuffing to avoid tearing.",
    },
    {
      question: "Can I make this recipe vegan?",
      answer:
        "To make a vegan version, substitute ricotta and mozzarella with plant-based cheeses or tofu-based ricotta alternatives. Use flax or chia egg as a binder instead of chicken egg. Ensure the marinara sauce is free from animal products.",
    },
    {
      question: "What is the best way to reheat leftovers?",
      answer:
        "Reheat stuffed pasta shells covered with foil in a preheated oven at 175°C (350°F) for about 20 minutes or until warmed through. You can also microwave individual portions covered with a microwave-safe lid, but the oven method preserves texture better.",
    },
    {
      question: "Can I freeze stuffed pasta shells?",
      answer:
        "Absolutely! Assemble the shells and freeze them in an airtight container before baking. When ready to cook, bake them covered with foil at 180°C (350°F) for about 45 minutes, removing the foil in the last 10 minutes to brown the cheese.",
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
            Stuffed pasta shells are a comforting Italian-American classic featuring large pasta shells filled with a creamy mixture of ricotta cheese,
            spinach, and herbs, then baked in a rich marinara sauce topped with melted mozzarella and parmesan. This dish is perfect for family dinners,
            special occasions, or meal prepping, offering a delicious balance of flavors and textures.
          </p>
          <p>
            The origins of stuffed pasta shells trace back to traditional Italian cuisine, where stuffed pastas like ravioli and cannelloni have been enjoyed for centuries.
            This particular preparation gained popularity in the United States, adapting Italian flavors with accessible ingredients and a baked presentation that
            appeals to many. It showcases the Italian culinary emphasis on fresh ingredients, simple techniques, and hearty, satisfying meals.
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
              Bring a large pot of salted water to a boil. Add the jumbo pasta shells and cook according to package instructions until al dente, usually 9-11 minutes.
              Drain carefully and rinse under cold water to stop cooking. Toss with a little olive oil to prevent sticking and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Filling</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a skillet, heat olive oil over medium heat. Add minced garlic and sauté until fragrant, about 1 minute. Add chopped spinach and cook until wilted,
              about 3-4 minutes. Remove from heat and let cool slightly. In a large bowl, combine ricotta, cooked spinach, egg, half of the mozzarella, parmesan,
              salt, pepper, and chopped basil. Mix well until creamy and evenly combined.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Stuff the Shells</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 180°C (350°F). Spread a thin layer of marinara sauce on the bottom of a baking dish. Using a spoon, fill each pasta shell generously
              with the ricotta-spinach mixture and place them in the baking dish seam side up.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Sauce and Cheese</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the remaining marinara sauce evenly over the stuffed shells. Sprinkle the remaining mozzarella and a little extra parmesan cheese on top.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Bake and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cover the baking dish with foil and bake for 25 minutes. Remove the foil and bake for an additional 5-10 minutes until the cheese is bubbly and golden.
              Let cool for 5 minutes before serving. Garnish with fresh basil or parsley if desired.
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
            For extra flavor, sauté the spinach with a pinch of red pepper flakes and a splash of white wine before mixing into the filling.
          </li>
          <li>
            Use fresh pasta shells if available for a more tender texture, but adjust cooking time accordingly.
          </li>
          <li>
            To make the dish gluten-free, substitute jumbo pasta shells with gluten-free pasta or use large blanched zucchini slices as a shell alternative.
          </li>
          <li>
            Let the baked shells rest for a few minutes before serving to allow the filling to set and make serving easier.
          </li>
          <li>
            Leftovers can be stored in an airtight container in the refrigerator for up to 3 days or frozen for up to 2 months.
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