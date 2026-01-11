import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HuevosRancherosCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Huevos%20Rancheros%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4987"
  );

  // --- DATA ---
  const title = "Huevos Rancheros";
  const description =
    "Ovos com salsa sobre tortilla, geralmente com feijão e guarnições.";

  // INGREDIENTS
  const ingredients = [
    { name: "Corn tortillas", baseAmount: 4, unit: "units" },
    { name: "Large eggs", baseAmount: 4, unit: "units" },
    { name: "Refried black beans", baseAmount: 400, unit: "g" },
    { name: "Tomato salsa (fresh or store-bought)", baseAmount: 250, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 2, unit: "units" },
    { name: "Jalapeño, seeded and chopped", baseAmount: 1, unit: "unit" },
    { name: "Fresh cilantro, chopped", baseAmount: 15, unit: "g" },
    { name: "Avocado, sliced", baseAmount: 1, unit: "unit" },
    { name: "Lime wedges", baseAmount: 2, unit: "units" },
    { name: "Vegetable oil (for frying)", baseAmount: 30, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Queso fresco or crumbled feta", baseAmount: 50, unit: "g" },
  ];

  const nutrition = {
    calories: "520",
    protein: "24g",
    carbs: "48g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What are Huevos Rancheros?",
      answer:
        "Huevos Rancheros is a traditional Mexican breakfast dish consisting of fried eggs served on lightly fried corn tortillas topped with a fresh tomato-chili salsa, often accompanied by refried beans, avocado, and cheese. It's hearty, flavorful, and perfect for starting the day.",
    },
    {
      question: "Can I make Huevos Rancheros vegetarian or vegan?",
      answer:
        "Yes! The classic recipe is vegetarian-friendly. For a vegan version, you can replace eggs with tofu scramble or chickpea flour omelets and use vegan cheese or omit cheese altogether. Ensure the refried beans are cooked without lard.",
    },
    {
      question: "What type of salsa is best for Huevos Rancheros?",
      answer:
        "A fresh tomato salsa with onions, garlic, jalapeño, and cilantro works best, providing a bright and mildly spicy flavor. You can use store-bought salsa ranchera or make your own for a fresher taste.",
    },
    {
      question: "How do I keep the tortillas from getting soggy?",
      answer:
        "Lightly frying the corn tortillas in oil until just crisp helps them hold up under the eggs and salsa without becoming soggy. Avoid soaking them in salsa; instead, spoon salsa on top just before serving.",
    },
    {
      question: "Can Huevos Rancheros be prepared ahead of time?",
      answer:
        "You can prepare the salsa and refried beans in advance and store them refrigerated. However, it's best to fry the tortillas and eggs fresh to maintain texture and flavor. Assemble just before serving.",
    },
    {
      question: "What sides pair well with Huevos Rancheros?",
      answer:
        "Common sides include Mexican rice, fresh fruit, sliced avocado, pickled jalapeños, or a simple green salad. A hot cup of Mexican coffee or fresh juice complements the meal perfectly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Huevos Rancheros"
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
            <span className="font-bold uppercase text-slate-500">Kcal</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.protein}</div>
            <span className="font-bold uppercase text-slate-500">Prot</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.carbs}</div>
            <span className="font-bold uppercase text-slate-500">Carb</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.fat}</div>
            <span className="font-bold uppercase text-slate-500">Fat</span>
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
            Huevos Rancheros is a beloved Mexican breakfast classic that combines
            crispy corn tortillas topped with perfectly fried eggs and a vibrant,
            tangy tomato salsa. This dish is traditionally served with refried
            beans, fresh avocado slices, and crumbled cheese, creating a hearty
            and satisfying meal that balances textures and flavors beautifully.
          </p>
          <p>
            Originating from rural Mexico, Huevos Rancheros was a popular meal
            among farm workers ("rancheros") who needed a nutritious and filling
            breakfast to start their day. Over time, it has become a staple in
            Mexican cuisine and is enjoyed worldwide for its simplicity and bold
            flavors.
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
              Prepare the Salsa
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a medium skillet, heat a tablespoon of oil over medium heat. Add
              the chopped onion, garlic, and jalapeño, sautéing until softened and
              fragrant, about 3-4 minutes. Add the fresh tomatoes or store-bought
              salsa and simmer for 5-7 minutes until slightly thickened. Stir in
              chopped cilantro and season with salt to taste.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Heat the Refried Beans
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Warm the refried beans in a small saucepan over low heat, stirring
              occasionally. Add a splash of water if needed to loosen the texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Fry the Tortillas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large skillet, heat vegetable oil over medium-high heat. Fry
              each corn tortilla for about 30 seconds per side until lightly crisp
              but still pliable. Drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Eggs
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a clean skillet, fry the eggs sunny-side up or to your preferred
              doneness. Season with salt and pepper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place a fried tortilla on each plate, spread a layer of warm refried
              beans, then top with a fried egg. Spoon salsa over the eggs, garnish
              with avocado slices, crumbled queso fresco, and extra cilantro. Serve
              with lime wedges on the side.
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
            Use fresh, ripe tomatoes for the salsa to get the best flavor and
            brightness.
          </li>
          <li>
            Lightly fry tortillas just until they start to crisp but remain
            flexible to avoid breaking when topped.
          </li>
          <li>
            For extra richness, add a dollop of Mexican crema or sour cream on top.
          </li>
          <li>
            If you prefer spicier salsa, keep the jalapeño seeds or add a pinch of
            cayenne pepper.
          </li>
          <li>
            To save time, prepare the salsa and beans a day ahead; reheat gently
            before serving.
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
              href="https://en.wikipedia.org/wiki/Huevos_rancheros"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Huevos Rancheros
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/huevos-rancheros-recipe-2342796"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Authentic Huevos Rancheros Recipe
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