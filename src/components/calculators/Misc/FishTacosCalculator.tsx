import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FishTacosCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Fish%20Tacos%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8010"
  );

  // --- DATA ---
  const title = "Fish Tacos";
  const description = "Tacos de peixe com molho, repolho e toque cítrico.";

  // INGREDIENTS
  const ingredients = [
    { name: "White fish fillets (cod, tilapia, or halibut)", baseAmount: 500, unit: "g" },
    { name: "Corn tortillas", baseAmount: 8, unit: "pieces" },
    { name: "Green cabbage, shredded", baseAmount: 200, unit: "g" },
    { name: "Fresh cilantro, chopped", baseAmount: 15, unit: "g" },
    { name: "Lime juice", baseAmount: 30, unit: "ml" },
    { name: "Sour cream", baseAmount: 120, unit: "ml" },
    { name: "Mayonnaise", baseAmount: 60, unit: "ml" },
    { name: "Garlic powder", baseAmount: 1, unit: "tsp" },
    { name: "Smoked paprika", baseAmount: 1, unit: "tsp" },
    { name: "Ground cumin", baseAmount: 0.5, unit: "tsp" },
    { name: "Chili powder", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "350",
    protein: "30g",
    carbs: "25g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of fish is best for fish tacos?",
      answer:
        "White, flaky fish such as cod, tilapia, or halibut are ideal for fish tacos because they have a mild flavor and firm texture that holds up well during cooking. Avoid oily fish as they can overpower the delicate balance of flavors.",
    },
    {
      question: "Can I make fish tacos gluten-free?",
      answer:
        "Absolutely! Using corn tortillas instead of flour tortillas makes this recipe naturally gluten-free. Just ensure any additional sauces or seasonings you use are also gluten-free.",
    },
    {
      question: "How do I keep the fish moist and tender?",
      answer:
        "Marinating the fish briefly with lime juice and spices helps tenderize it. Cooking it quickly over medium-high heat prevents drying out. Avoid overcooking by watching for opaque, flaky flesh.",
    },
    {
      question: "What are some good toppings for fish tacos?",
      answer:
        "Classic toppings include shredded cabbage, fresh cilantro, lime wedges, and a creamy sauce made from sour cream and mayonnaise. You can also add sliced avocado, pickled onions, or fresh salsa for extra flavor and texture.",
    },
    {
      question: "Can I prepare fish tacos ahead of time?",
      answer:
        "You can prep the fish marinade, shred the cabbage, and make the sauce ahead of time. However, cook the fish and assemble the tacos just before serving to maintain freshness and texture.",
    },
    {
      question: "How do I reheat leftover fish tacos?",
      answer:
        "Reheat the fish gently in a skillet over low heat to avoid drying it out. Warm the tortillas separately wrapped in foil or in a dry pan. Add fresh toppings after reheating for the best taste.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Fish Tacos"
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
            Fish tacos are a vibrant and flavorful dish originating from the coastal regions of Mexico, especially Baja California. Combining tender, flaky white fish with fresh, crisp cabbage and a tangy creamy sauce, these tacos offer a perfect balance of textures and bright, zesty flavors. They are beloved worldwide for their simplicity and deliciousness.
          </p>
          <p>
            The tradition of fish tacos dates back to the mid-20th century in Baja, where fishermen would grill or fry freshly caught fish and serve it wrapped in warm tortillas with simple toppings. Over time, this humble street food has evolved into a gourmet favorite, inspiring countless variations and creative twists in kitchens globally.
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
              Prepare the Fish Marinade
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, combine lime juice, garlic powder, smoked paprika, ground cumin, chili powder, salt, and black pepper. Add the fish fillets and toss gently to coat. Let marinate for 10-15 minutes to infuse flavors and tenderize the fish.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Creamy Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Mix sour cream, mayonnaise, a squeeze of lime juice, and a pinch of salt in a small bowl. Adjust seasoning to taste and refrigerate until ready to serve.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Fish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a skillet over medium-high heat. Add the marinated fish fillets and cook for 3-4 minutes per side, until opaque and flaky. Remove from heat and break into bite-sized pieces.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Warm the Tortillas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Warm the corn tortillas in a dry skillet or wrapped in foil in the oven until pliable and slightly toasted.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Tacos
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place a portion of cooked fish on each tortilla. Top with shredded cabbage, a drizzle of creamy sauce, and sprinkle with fresh cilantro. Serve immediately with lime wedges on the side.
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
            Use fresh lime juice for the marinade and sauce to brighten flavors and add a refreshing citrus note.
          </li>
          <li>
            For extra crunch, add pickled red onions or jalapeños as toppings.
          </li>
          <li>
            If you prefer a spicier kick, sprinkle some cayenne pepper or hot sauce over the assembled tacos.
          </li>
          <li>
            To keep tortillas warm during serving, wrap them in a clean kitchen towel or place in a tortilla warmer.
          </li>
          <li>
            Experiment with grilling the fish for a smoky flavor instead of pan-frying.
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
              href="https://www.bonappetit.com/recipe/fish-tacos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Bon Appétit: Fish Tacos Recipe
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