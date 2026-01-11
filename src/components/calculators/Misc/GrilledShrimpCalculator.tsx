import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GrilledShrimpCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Grilled%20Shrimp%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5392"
  );

  // --- DATA ---
  const title = "Grilled Shrimp";
  const description = "Grill shrimp fast with marinades, skewering tips, and no-overcook timing.";

  // INGREDIENTS
  const ingredients = [
    { name: "Shrimp (peeled & deveined)", baseAmount: 500, unit: "g" },
    { name: "Olive Oil", baseAmount: 3, unit: "tbsp" },
    { name: "Garlic (minced)", baseAmount: 3, unit: "cloves" },
    { name: "Lemon Juice", baseAmount: 2, unit: "tbsp" },
    { name: "Paprika", baseAmount: 1, unit: "tsp" },
    { name: "Cayenne Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh Parsley (chopped)", baseAmount: 2, unit: "tbsp" },
    { name: "Wooden Skewers (soaked)", baseAmount: 8, unit: "pcs" },
    { name: "Butter (optional, melted)", baseAmount: 2, unit: "tbsp" },
    { name: "Red Pepper Flakes (optional)", baseAmount: 0.25, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "220",
    protein: "30g",
    carbs: "2g",
    fat: "9g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "How do I prevent shrimp from overcooking on the grill?",
      answer:
        "Shrimp cook very quickly, usually within 2-3 minutes per side. To prevent overcooking, preheat the grill to medium-high heat, and watch the shrimp closely. Remove them as soon as they turn opaque and pink with slight char marks. Using a marinade with oil helps keep them moist.",
    },
    {
      question: "Can I use frozen shrimp for this recipe?",
      answer:
        "Yes, you can use frozen shrimp, but make sure to thaw them completely and pat dry before marinating and grilling. Excess moisture can cause flare-ups on the grill and prevent proper searing.",
    },
    {
      question: "What are good alternatives to wooden skewers?",
      answer:
        "If you don’t have wooden skewers, metal skewers are a great alternative as they conduct heat and help cook shrimp evenly. Just be sure to handle them carefully as they get hot. You can also grill shrimp directly on a grill basket or tray.",
    },
    {
      question: "How long should I marinate the shrimp?",
      answer:
        "Marinate shrimp for at least 15-30 minutes to allow flavors to penetrate without breaking down the texture. Avoid marinating for more than 2 hours as the acid in lemon juice or vinegar can start to 'cook' the shrimp and make them mushy.",
    },
    {
      question: "Can I make this recipe spicy?",
      answer:
        "Absolutely! Add cayenne pepper, red pepper flakes, or a dash of hot sauce to the marinade to increase the heat level. Adjust the spice to your preference for a flavorful kick.",
    },
    {
      question: "What side dishes pair well with grilled shrimp?",
      answer:
        "Grilled shrimp pairs wonderfully with fresh salads, grilled vegetables, rice pilaf, or crusty bread. A light citrusy or herbaceous side complements the smoky flavors perfectly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Grilled Shrimp"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Grilled shrimp is a quick, flavorful dish perfect for summer cookouts or elegant dinners. This recipe highlights the natural sweetness of shrimp enhanced by a zesty marinade of garlic, lemon, and spices. The grilling process imparts a smoky char that complements the tender, juicy texture of the shrimp.
          </p>
          <p>
            Shrimp grilling has roots in coastal cuisines worldwide, where fresh seafood is abundant. From Mediterranean to Southeast Asian traditions, grilling shrimp over open flames is a beloved method that preserves freshness while adding depth of flavor. This recipe draws inspiration from classic marinades and modern grilling techniques to deliver a foolproof, delicious result.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Shrimp</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the shrimp under cold water, then peel and devein if not already done. Pat them dry thoroughly with paper towels to ensure the marinade adheres well.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Marinade</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, whisk together olive oil, minced garlic, lemon juice, paprika, cayenne pepper, salt, black pepper, and chopped parsley. Optionally, add melted butter and red pepper flakes for extra richness and heat.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Marinate the Shrimp</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Toss the shrimp in the marinade, ensuring each piece is well coated. Cover and refrigerate for 15-30 minutes, but no longer than 2 hours to avoid mushy texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Preheat the Grill</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat your grill to medium-high heat (about 400°F / 200°C). If using wooden skewers, soak them in water for at least 30 minutes to prevent burning.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Skewer and Grill</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Thread shrimp onto skewers, leaving a little space between each. Grill for 2-3 minutes per side until shrimp are opaque and have nice grill marks. Avoid overcooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove shrimp from grill and serve immediately with lemon wedges, fresh herbs, or your favorite dipping sauce.
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
            Use fresh shrimp whenever possible for the best texture and flavor. Wild-caught shrimp often have a sweeter taste.
          </li>
          <li>
            Soaking wooden skewers in water prevents them from burning and helps keep the shrimp moist.
          </li>
          <li>
            Avoid overcrowding the grill to ensure even cooking and proper charring.
          </li>
          <li>
            For an extra smoky flavor, add soaked wood chips to your grill.
          </li>
          <li>
            If you prefer, grill shrimp directly on a grill basket or foil tray to avoid skewering.
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
              href="https://en.wikipedia.org/wiki/Shrimp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Shrimp Overview
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/how-to-grill-shrimp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Grill Shrimp Perfectly
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