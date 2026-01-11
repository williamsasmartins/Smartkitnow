import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CarnitasTacosCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Carnitas%20Tacos%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=30"
  );

  // --- DATA ---
  const title = "Carnitas Tacos";
  const description = "Tacos de porco cozido lentamente e desfiado, suculento e dourado.";

  // INGREDIENTS
  const ingredients = [
    { name: "Pork shoulder (cubed)", baseAmount: 800, unit: "g" },
    { name: "Orange (juiced)", baseAmount: 1, unit: "unit" },
    { name: "Lime (juiced)", baseAmount: 1, unit: "unit" },
    { name: "Garlic cloves (minced)", baseAmount: 4, unit: "cloves" },
    { name: "Onion (chopped)", baseAmount: 1, unit: "unit" },
    { name: "Bay leaves", baseAmount: 2, unit: "leaves" },
    { name: "Ground cumin", baseAmount: 1, unit: "tsp" },
    { name: "Dried oregano", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper", baseAmount: 1, unit: "tsp" },
    { name: "Vegetable oil", baseAmount: 2, unit: "tbsp" },
    { name: "Corn tortillas", baseAmount: 8, unit: "units" },
    { name: "Fresh cilantro (chopped)", baseAmount: 0.25, unit: "cup" },
    { name: "Diced white onion", baseAmount: 0.25, unit: "cup" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "450",
    protein: "35g",
    carbs: "30g",
    fat: "20g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of pork is best for carnitas?",
      answer:
        "The best cut for carnitas is pork shoulder (also called pork butt or Boston butt) because it has the right balance of fat and meat, which becomes tender and flavorful when slow-cooked. The fat renders down, keeping the meat juicy and succulent.",
    },
    {
      question: "How do I get the crispy edges on carnitas?",
      answer:
        "After slow-cooking the pork, shred it and then crisp it up in a hot skillet with a bit of oil or under a broiler. This step caramelizes the edges, adding a delightful texture contrast to the tender meat.",
    },
    {
      question: "Can I make carnitas in a slow cooker or Instant Pot?",
      answer:
        "Yes! Carnitas can be made in a slow cooker by cooking the pork on low for 6-8 hours or in an Instant Pot using the pressure cook function for about 1 hour. Both methods yield tender meat, but finishing with a crisping step is recommended.",
    },
    {
      question: "What toppings are traditional for carnitas tacos?",
      answer:
        "Traditional toppings include diced white onion, fresh cilantro, a squeeze of lime, and salsa. Some also enjoy pickled jalapeños or radishes for added flavor and crunch.",
    },
    {
      question: "How should I store leftover carnitas?",
      answer:
        "Store leftover carnitas in an airtight container in the refrigerator for up to 4 days. To reheat, warm gently in a skillet to maintain moisture and crisp up the edges if desired. Carnitas also freeze well for up to 3 months.",
    },
    {
      question: "Are corn tortillas better than flour for carnitas tacos?",
      answer:
        "Corn tortillas are traditional and provide an authentic flavor and texture that complements the rich carnitas. They are also gluten-free. However, flour tortillas can be used based on personal preference.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Carnitas Tacos"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 3h 30m
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
                    {ing.unit === "unit" || ing.unit === "units"
                      ? `${getAmount(ing.baseAmount)}`
                      : `${getAmount(ing.baseAmount)} ${ing.unit}`}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Carnitas Tacos are a beloved Mexican classic featuring pork shoulder slow-cooked until tender,
            then shredded and crisped to perfection. The meat is infused with citrus, garlic, and aromatic
            spices, creating a rich and savory flavor profile that pairs beautifully with fresh toppings and
            warm corn tortillas. This recipe brings restaurant-quality carnitas to your kitchen with easy-to-follow
            steps and adjustable servings.
          </p>
          <p>
            Originating from the state of Michoacán, carnitas have been a staple in Mexican cuisine for centuries.
            Traditionally cooked in large copper pots, the slow braising method renders the pork juicy and flavorful,
            while the final crisping step adds a delightful texture contrast. Carnitas tacos have since become popular
            worldwide, celebrated for their bold flavors and comforting heartiness.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Pork</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut the pork shoulder into 2-inch cubes. In a large pot or Dutch oven, combine the pork with orange juice,
              lime juice, minced garlic, chopped onion, bay leaves, cumin, oregano, salt, and pepper. Add enough water
              to just cover the meat.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Slow Cook the Pork</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring the mixture to a boil, then reduce heat to low and simmer, uncovered, for about 3 hours or until the pork
              is very tender and easily shredded. Skim off any excess fat during cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Shred and Crisp</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the pork from the pot and shred it using two forks. Heat vegetable oil in a large skillet over medium-high heat.
              Add the shredded pork in batches and cook until the edges are crispy and golden brown, about 5-7 minutes per batch.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Warm the Tortillas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Warm the corn tortillas on a dry skillet or griddle until soft and pliable. Keep them warm wrapped in a clean kitchen towel.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Assemble the Tacos</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Fill each tortilla with a generous amount of crispy carnitas. Top with diced white onion, chopped cilantro, and a squeeze of fresh lime.
              Serve immediately with your favorite salsa.
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
            For extra flavor, marinate the pork overnight in the citrus and spices before cooking.
          </li>
          <li>
            Use fresh corn tortillas for the best texture and authentic taste.
          </li>
          <li>
            To keep carnitas moist, reserve some of the cooking liquid and drizzle it over the shredded pork before crisping.
          </li>
          <li>
            Experiment with toppings like pickled red onions, sliced radishes, or avocado for added freshness.
          </li>
          <li>
            Leftover carnitas make excellent fillings for burritos, quesadillas, or nachos.
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
              href="https://en.wikipedia.org/wiki/Carnitas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Carnitas
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/slow-cooker-carnitas-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Slow Cooker Carnitas Recipe
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