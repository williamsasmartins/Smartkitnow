import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EnchiladasSuizasCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Enchiladas%20Suizas%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2104"
  );

  // --- DATA ---
  const title = "Enchiladas Suizas";
  const description = "Enchiladas com molho cremoso (geralmente verde) e bastante queijo.";

  // INGREDIENTS
  const ingredients = [
    { name: "Corn tortillas", baseAmount: 12, unit: "pieces" },
    { name: "Cooked shredded chicken breast", baseAmount: 500, unit: "g" },
    { name: "Tomatillos (husked and rinsed)", baseAmount: 400, unit: "g" },
    { name: "Jalapeño peppers", baseAmount: 2, unit: "pieces" },
    { name: "White onion", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves", baseAmount: 3, unit: "pieces" },
    { name: "Fresh cilantro", baseAmount: 30, unit: "g" },
    { name: "Sour cream (crema mexicana)", baseAmount: 200, unit: "ml" },
    { name: "Chicken broth", baseAmount: 250, unit: "ml" },
    { name: "Grated Swiss cheese", baseAmount: 300, unit: "g" },
    { name: "Vegetable oil (for frying tortillas)", baseAmount: 100, unit: "ml" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper", baseAmount: 1, unit: "tsp" },
    { name: "Lime juice", baseAmount: 1, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "520",
    protein: "38g",
    carbs: "35g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes Enchiladas Suizas different from other enchiladas?",
      answer:
        "Enchiladas Suizas are distinguished by their creamy, cheesy green sauce made primarily from tomatillos, cream, and Swiss cheese. Unlike traditional red or mole sauces, this sauce is rich and smooth, giving the dish a unique Swiss-Mexican fusion flavor.",
    },
    {
      question: "Can I use other types of cheese instead of Swiss cheese?",
      answer:
        "Yes, while Swiss cheese is traditional for its meltability and mild flavor, you can substitute with other melting cheeses like Monterey Jack, mozzarella, or even a mild cheddar. However, the flavor profile will vary slightly.",
    },
    {
      question: "How do I prevent the tortillas from breaking when rolling?",
      answer:
        "To prevent tortillas from breaking, lightly fry them in hot oil for a few seconds on each side until pliable but not crispy. This softens them and makes rolling easier without tearing.",
    },
    {
      question: "Is it possible to make this recipe vegetarian?",
      answer:
        "Absolutely! You can replace the shredded chicken with sautéed mushrooms, roasted vegetables, or beans. The creamy tomatillo sauce and cheese will still provide a rich and satisfying flavor.",
    },
    {
      question: "Can I prepare the sauce in advance?",
      answer:
        "Yes, the tomatillo cream sauce can be made a day ahead and stored in the refrigerator. Reheat gently before assembling the enchiladas to maintain its creamy texture.",
    },
    {
      question: "What side dishes pair well with Enchiladas Suizas?",
      answer:
        "Common side dishes include Mexican rice, refried beans, a fresh green salad, or pickled vegetables. A squeeze of fresh lime and some sliced avocado also complement the dish beautifully.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Enchiladas Suizas"
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
            Enchiladas Suizas are a beloved Mexican dish known for their luscious,
            creamy green sauce made from fresh tomatillos, cream, and Swiss cheese.
            The name "Suizas" means "Swiss" in Spanish, a nod to the Swiss cheese
            that enriches the sauce, creating a delightful fusion of flavors. This
            recipe combines tender shredded chicken wrapped in soft corn tortillas,
            bathed in the velvety sauce, and baked until bubbly and golden.
          </p>
          <p>
            Originating in Mexico City, Enchiladas Suizas reflect the influence of
            European ingredients and techniques on traditional Mexican cuisine.
            The creamy tomatillo sauce differentiates it from other enchilada styles,
            offering a fresh, tangy, and rich taste that has become a staple in
            Mexican households and restaurants alike.
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
              Prepare the Tomatillo Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Boil the husked tomatillos and jalapeños in water for about 10 minutes
              until soft. Drain and blend with chopped onion, garlic, cilantro, chicken
              broth, sour cream, lime juice, salt, and pepper until smooth. Set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Tortillas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a skillet over medium heat. Lightly fry each corn
              tortilla for about 10-15 seconds per side until pliable but not crispy.
              Drain on paper towels to remove excess oil.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Enchiladas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Dip each tortilla briefly in the tomatillo sauce, then fill with shredded
              chicken. Roll tightly and place seam-side down in a baking dish. Repeat
              with remaining tortillas.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Top and Bake
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the remaining tomatillo sauce over the rolled enchiladas and sprinkle
              generously with grated Swiss cheese. Bake in a preheated oven at 180°C
              (350°F) for 10 minutes or until the cheese is melted and bubbly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Garnish with extra cilantro or a dollop of sour cream if desired. Serve
              hot alongside Mexican rice or refried beans for a complete meal.
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
            Use fresh tomatillos for the best tangy flavor; canned tomatillos can be
            used in a pinch but may alter the sauce's brightness.
          </li>
          <li>
            Lightly frying the tortillas helps prevent them from breaking and adds a
            subtle crispness that contrasts nicely with the creamy sauce.
          </li>
          <li>
            Adjust the heat level by adding or reducing jalapeños; removing seeds will
            make the sauce milder.
          </li>
          <li>
            For extra richness, stir a bit of Mexican crema or heavy cream into the
            sauce before baking.
          </li>
          <li>
            Leftover sauce freezes well and can be used as a base for other Mexican
            dishes.
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
              href="https://en.wikipedia.org/wiki/Enchilada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Enchilada
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Enchiladas-Suizas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Enchiladas Suizas Recipe
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