import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BajaFishTacosCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/BajaStyle%20Fish%20Tacos%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2964"
  );

  // --- DATA ---
  const title = "Baja-Style Fish Tacos";
  const description = "Tacos de peixe empanado, com molho cremoso e repolho (estilo Baja).";

  // INGREDIENTS
  const ingredients = [
    { name: "White fish fillets (cod or halibut)", baseAmount: 500, unit: "g" },
    { name: "All-purpose flour", baseAmount: 120, unit: "g" },
    { name: "Cornstarch", baseAmount: 30, unit: "g" },
    { name: "Baking powder", baseAmount: 1, unit: "tsp" },
    { name: "Cold beer (lager or pilsner)", baseAmount: 180, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Vegetable oil (for frying)", baseAmount: 500, unit: "ml" },
    { name: "Small corn tortillas", baseAmount: 8, unit: "pieces" },
    { name: "Shredded green cabbage", baseAmount: 200, unit: "g" },
    { name: "Mayonnaise", baseAmount: 120, unit: "g" },
    { name: "Sour cream", baseAmount: 60, unit: "g" },
    { name: "Fresh lime juice", baseAmount: 30, unit: "ml" },
    { name: "Hot sauce (like chipotle or sriracha)", baseAmount: 15, unit: "ml" },
    { name: "Fresh cilantro (chopped)", baseAmount: 15, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "35g",
    carbs: "40g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of fish is best for Baja-style fish tacos?",
      answer:
        "White, flaky fish such as cod, halibut, or tilapia are ideal for Baja-style fish tacos because they hold up well during frying and have a mild flavor that pairs perfectly with the crispy batter and fresh toppings.",
    },
    {
      question: "Can I make the batter without beer?",
      answer:
        "Yes, you can substitute beer with sparkling water or club soda to achieve a light and crispy batter. The carbonation helps create air bubbles in the batter, making it crispier when fried.",
    },
    {
      question: "How do I keep the fish tacos crispy when assembling?",
      answer:
        "To maintain crispiness, drain the fried fish on paper towels to remove excess oil and assemble the tacos just before serving. Warm the tortillas separately and avoid adding too much sauce directly on the fish until ready to eat.",
    },
    {
      question: "What can I use instead of corn tortillas?",
      answer:
        "While corn tortillas are traditional, you can use small flour tortillas if preferred. Just be aware that flour tortillas have a softer texture and slightly different flavor, which may alter the authentic Baja taco experience.",
    },
    {
      question: "How do I make the creamy Baja sauce?",
      answer:
        "The creamy Baja sauce is a simple blend of mayonnaise, sour cream, fresh lime juice, and hot sauce. Adjust the hot sauce amount to your preferred spice level. This sauce adds a tangy, spicy creaminess that complements the crispy fish and fresh cabbage.",
    },
    {
      question: "Can I prepare parts of this recipe ahead of time?",
      answer:
        "Yes, you can shred the cabbage and prepare the creamy sauce a day ahead, storing them separately in the refrigerator. However, fry the fish and assemble the tacos just before serving for the best texture and flavor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Baja-Style Fish Tacos"
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
            Baja-Style Fish Tacos are a vibrant and flavorful dish originating from the
            Baja California peninsula in Mexico. Known for their crispy beer-battered
            fish, fresh cabbage slaw, and creamy tangy sauce, these tacos offer a perfect
            balance of textures and flavors. They have become a beloved staple in coastal
            Mexican cuisine and have gained popularity worldwide for their simplicity and
            deliciousness.
          </p>
          <p>
            The tradition of Baja fish tacos dates back to the mid-20th century, where
            local fishermen would prepare their catch in a simple batter and serve it
            wrapped in warm tortillas with fresh toppings. Over time, the recipe has
            evolved with regional variations, but the core elements remain the same,
            celebrating fresh seafood and vibrant accompaniments.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Batter</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, whisk together the all-purpose flour, cornstarch, baking
              powder, salt, and black pepper. Gradually add the cold beer, whisking until
              the batter is smooth and slightly thick. Refrigerate the batter for 10-15
              minutes to chill.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Sauce and Slaw</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small bowl, mix mayonnaise, sour cream, lime juice, and hot sauce until
              smooth. Adjust seasoning to taste. In another bowl, toss the shredded cabbage
              with a pinch of salt and some chopped cilantro for freshness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Heat the Oil</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour vegetable oil into a deep skillet or fryer to a depth of about 5 cm (2
              inches). Heat the oil to 180°C (350°F). Use a thermometer to maintain the
              temperature for even frying.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Batter and Fry the Fish</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut the fish fillets into taco-sized strips. Pat dry with paper towels. Dip
              each piece into the chilled batter, allowing excess to drip off, then carefully
              lower into the hot oil. Fry in batches for 3-4 minutes until golden and crispy.
              Drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Warm Tortillas and Assemble</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Warm the corn tortillas on a dry skillet or in the oven until pliable. Place
              a few pieces of fried fish on each tortilla, top with shredded cabbage, drizzle
              with the creamy sauce, and garnish with fresh cilantro and a squeeze of lime.
              Serve immediately.
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
            Use very cold beer and batter to ensure a light, crispy coating on the fish.
          </li>
          <li>
            Maintain consistent oil temperature to avoid greasy or undercooked fish.
          </li>
          <li>
            For extra flavor, marinate the fish briefly in lime juice, garlic, and chili powder before battering.
          </li>
          <li>
            Warm tortillas wrapped in a clean kitchen towel keep them soft and pliable.
          </li>
          <li>
            Customize the creamy sauce by adding minced garlic or smoked paprika for a smoky twist.
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
              href="https://en.wikipedia.org/wiki/Fish_taco"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Fish Taco
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/baja-style-fish-tacos-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Baja-Style Fish Tacos Recipe
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