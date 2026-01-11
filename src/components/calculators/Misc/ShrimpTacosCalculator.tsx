import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ShrimpTacosCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Shrimp%20Tacos%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8295"
  );

  // --- DATA ---
  const title = "Shrimp Tacos";
  const description = "Tacos de camarão temperado, com acompanhamentos frescos.";

  // INGREDIENTS
  const ingredients = [
    { name: "Shrimp (peeled and deveined)", baseAmount: 500, unit: "g" },
    { name: "Corn tortillas", baseAmount: 8, unit: "units" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Garlic cloves (minced)", baseAmount: 3, unit: "cloves" },
    { name: "Chili powder", baseAmount: 1, unit: "tsp" },
    { name: "Smoked paprika", baseAmount: 1, unit: "tsp" },
    { name: "Ground cumin", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh lime juice", baseAmount: 2, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Red cabbage (thinly sliced)", baseAmount: 150, unit: "g" },
    { name: "Fresh cilantro (chopped)", baseAmount: 15, unit: "g" },
    { name: "Avocado (sliced)", baseAmount: 1, unit: "unit" },
    { name: "Sour cream or Mexican crema", baseAmount: 100, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = { calories: "350", protein: "28g", carbs: "30g", fat: "12g" };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use frozen shrimp for this recipe?",
      answer:
        "Yes, frozen shrimp can be used. Make sure to thaw them completely and pat dry before cooking to avoid excess moisture, which can prevent proper searing.",
    },
    {
      question: "What type of tortillas work best for shrimp tacos?",
      answer:
        "Traditional corn tortillas are preferred for authentic flavor and texture. Warm them on a skillet or grill before assembling to enhance pliability and taste.",
    },
    {
      question: "How can I make the shrimp tacos spicier?",
      answer:
        "Increase the amount of chili powder or add cayenne pepper to the shrimp seasoning. You can also add sliced jalapeños or a spicy salsa as a topping.",
    },
    {
      question: "Is there a good substitute for sour cream?",
      answer:
        "Mexican crema is ideal, but you can substitute with Greek yogurt for a tangy and creamy alternative that’s also healthier.",
    },
    {
      question: "How do I keep the tacos from getting soggy?",
      answer:
        "Avoid over-saucing the tacos and serve immediately after assembly. Toasting the tortillas lightly before filling also helps prevent sogginess.",
    },
    {
      question: "Can I prepare any components ahead of time?",
      answer:
        "Yes, you can slice the cabbage, chop cilantro, and prepare the sour cream sauce in advance. Cook the shrimp just before serving for best texture and flavor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Shrimp Tacos"
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
            Shrimp Tacos are a vibrant and flavorful dish that combines succulent,
            seasoned shrimp with fresh, crisp toppings wrapped in warm corn tortillas.
            This recipe balances smoky spices, zesty lime, and creamy avocado to create
            a perfect harmony of textures and tastes that delight the palate.
          </p>
          <p>
            Originating from the coastal regions of Mexico, shrimp tacos have become a
            beloved staple in Mexican-American cuisine. Traditionally enjoyed as street
            food, they showcase the bounty of fresh seafood and bold flavors that define
            the culinary heritage of the area. Today, shrimp tacos are celebrated worldwide
            for their simplicity, freshness, and versatility.
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
              Prepare the Shrimp Marinade
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a medium bowl, combine olive oil, minced garlic, chili powder, smoked
              paprika, ground cumin, lime juice, salt, and black pepper. Add the peeled
              and deveined shrimp and toss to coat evenly. Let marinate for 10-15 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Shrimp
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat a large skillet over medium-high heat. Add the shrimp and cook for 2-3
              minutes per side until pink and opaque. Remove from heat and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Warm the Tortillas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Warm the corn tortillas on a dry skillet or griddle over medium heat for
              about 30 seconds per side until soft and pliable. Keep warm wrapped in a
              clean kitchen towel.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Tacos
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place a few shrimp on each tortilla. Top with sliced avocado, shredded red
              cabbage, and chopped cilantro. Drizzle with sour cream or Mexican crema.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve Immediately
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the shrimp tacos immediately with extra lime wedges on the side for
              squeezing. Enjoy the fresh and vibrant flavors at their best.
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
            For extra smoky flavor, consider grilling the shrimp instead of pan-frying.
          </li>
          <li>
            Use fresh lime juice for the marinade and as a finishing squeeze to brighten
            the flavors.
          </li>
          <li>
            To keep tortillas warm and soft, wrap them in a clean kitchen towel and place
            in a low oven (about 150°C/300°F) until ready to serve.
          </li>
          <li>
            Customize toppings with pickled onions, sliced radishes, or a spicy salsa for
            added texture and flavor.
          </li>
          <li>
            If you prefer less heat, reduce the chili powder or omit it entirely.
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
              href="https://www.thespruceeats.com/shrimp-tacos-recipe-4162636"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Shrimp Tacos Recipe
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/shrimp-tacos-with-cabbage-slaw-and-crema"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Shrimp Tacos with Cabbage Slaw and Crema
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