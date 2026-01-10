import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EggplantParmesanCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Eggplant%20Parmesan%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=827"
  );

  // --- DATA ---
  const title = "Eggplant Parmesan";
  const description = "Breaded eggplant slices layered with tomato sauce and melted cheese.";

  // INGREDIENTS
  const ingredients = [
    { name: "Eggplant (medium, sliced 1/2 inch)", baseAmount: 2, unit: "pcs" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "All-purpose flour", baseAmount: 100, unit: "g" },
    { name: "Eggs (beaten)", baseAmount: 3, unit: "pcs" },
    { name: "Breadcrumbs", baseAmount: 150, unit: "g" },
    { name: "Olive oil (for frying)", baseAmount: 120, unit: "ml" },
    { name: "Marinara sauce", baseAmount: 400, unit: "g" },
    { name: "Mozzarella cheese (shredded)", baseAmount: 250, unit: "g" },
    { name: "Parmesan cheese (grated)", baseAmount: 100, unit: "g" },
    { name: "Fresh basil leaves", baseAmount: 10, unit: "g" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Garlic powder", baseAmount: 0.5, unit: "tsp" },
    { name: "Dried oregano", baseAmount: 0.5, unit: "tsp" },
    { name: "Sugar (optional, to balance acidity)", baseAmount: 1, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "18g",
    carbs: "30g",
    fat: "25g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    servings === 1 && Number.isInteger(base)
      ? base.toString()
      : (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I bake the eggplant instead of frying it?",
      answer:
        "Yes, baking the eggplant slices is a healthier alternative. To do so, brush the breaded slices lightly with olive oil and bake at 400°F (200°C) for about 20-25 minutes, flipping halfway through, until golden and crispy.",
    },
    {
      question: "How do I prevent the eggplant from becoming soggy?",
      answer:
        "Salting the eggplant slices and letting them sit for 20-30 minutes helps draw out excess moisture. After salting, rinse and pat dry thoroughly before breading and cooking to ensure a crisp texture.",
    },
    {
      question: "Can I prepare Eggplant Parmesan ahead of time?",
      answer:
        "Absolutely! You can assemble the dish a day ahead and refrigerate it covered. When ready, bake it in a preheated oven at 375°F (190°C) for 25-30 minutes until heated through and bubbly.",
    },
    {
      question: "What can I use as a substitute for mozzarella cheese?",
      answer:
        "If mozzarella is unavailable, provolone or fontina cheeses are good substitutes due to their melting qualities. For a dairy-free option, use vegan mozzarella alternatives.",
    },
    {
      question: "Is Eggplant Parmesan gluten-free?",
      answer:
        "Traditional recipes use wheat-based breadcrumbs and flour, which contain gluten. To make it gluten-free, substitute with gluten-free breadcrumbs and a suitable gluten-free flour for breading.",
    },
    {
      question: "How should I store leftovers?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days. Reheat in the oven at 350°F (175°C) to maintain crispness rather than microwaving, which can make it soggy.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Eggplant Parmesan"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 40m
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Eggplant Parmesan, or Melanzane alla Parmigiana, is a classic Italian dish featuring breaded and fried eggplant slices layered with rich marinara sauce and melted cheeses. This comforting casserole is beloved worldwide for its hearty flavors and satisfying textures, making it a staple in Italian-American households and gourmet restaurants alike.
          </p>
          <p>
            Originating from Southern Italy, particularly the Campania region, Eggplant Parmesan has roots dating back to the 18th century. The dish showcases the Italian culinary tradition of transforming humble vegetables into elegant, flavorful meals. Over time, it has evolved with regional variations, but the core elements of eggplant, tomato sauce, and cheese remain timeless.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Eggplant</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slice the eggplants into 1/2-inch thick rounds. Lay them out on a tray and sprinkle both sides generously with salt. Let them rest for 20-30 minutes to draw out moisture and bitterness. Rinse the slices under cold water and pat dry thoroughly with paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Bread the Eggplant</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Set up a breading station with three shallow dishes: one with flour, one with beaten eggs, and one with breadcrumbs mixed with garlic powder, dried oregano, and black pepper. Dredge each eggplant slice first in flour, then dip into the eggs, and finally coat with the breadcrumb mixture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Fry the Eggplant</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large skillet over medium heat. Fry the breaded eggplant slices in batches until golden brown on both sides, about 3-4 minutes per side. Drain on paper towels to remove excess oil.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Assemble the Dish</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 375°F (190°C). In a baking dish, spread a thin layer of marinara sauce. Arrange a layer of fried eggplant slices over the sauce, then sprinkle with shredded mozzarella and grated Parmesan. Repeat layers until all ingredients are used, finishing with cheese on top.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Bake and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bake the assembled dish for 30-35 minutes until the cheese is melted, bubbly, and golden brown. Garnish with fresh basil leaves before serving. Let it rest for 5 minutes to set, then enjoy your homemade Eggplant Parmesan.
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
            For extra crispy eggplant, double bread the slices by repeating the egg and breadcrumb steps before frying.
          </li>
          <li>
            Use a cast iron skillet for frying to maintain consistent heat and achieve a perfect golden crust.
          </li>
          <li>
            If marinara sauce is too acidic, add a pinch of sugar to balance the flavors.
          </li>
          <li>
            Let the dish rest after baking to allow the layers to set, making it easier to slice and serve.
          </li>
          <li>
            Fresh basil added just before serving brightens the dish and adds a lovely aroma.
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
