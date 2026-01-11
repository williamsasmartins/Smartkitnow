import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChickenWingsCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chicken%20Wings%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4143"
  );

  // --- DATA ---
  const title = "Chicken Wings";
  const description =
    "Smoke or grill chicken wings for crunchy skin, saucy finishes, and party-batch timing.";

  // INGREDIENTS
  const ingredients = [
    { name: "Chicken Wings (whole)", baseAmount: 500, unit: "g" },
    { name: "Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Garlic Powder", baseAmount: 1, unit: "tsp" },
    { name: "Onion Powder", baseAmount: 1, unit: "tsp" },
    { name: "Smoked Paprika", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Cayenne Pepper", baseAmount: 0.25, unit: "tsp" },
    { name: "Honey", baseAmount: 2, unit: "tbsp" },
    { name: "Soy Sauce", baseAmount: 1, unit: "tbsp" },
    { name: "Apple Cider Vinegar", baseAmount: 1, unit: "tbsp" },
    { name: "Butter", baseAmount: 2, unit: "tbsp" },
    { name: "Chopped Fresh Parsley (optional)", baseAmount: 1, unit: "tbsp" },
    { name: "Lemon Wedges (for serving)", baseAmount: 4, unit: "pieces" },
  ];

  // Nutrition per 4 servings approx.
  const nutrition = {
    calories: "420",
    protein: "38g",
    carbs: "8g",
    fat: "25g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the best way to get crispy skin on chicken wings?",
      answer:
        "To achieve crispy skin, pat the wings dry thoroughly before seasoning and cooking. Baking or air frying at a high temperature helps render the fat and crisp the skin. Avoid overcrowding the pan or grill to allow even heat circulation.",
    },
    {
      question: "Can I prepare chicken wings ahead of time?",
      answer:
        "Yes, you can marinate the wings up to 24 hours in advance to enhance flavor. For best texture, cook them fresh, but cooked wings can be refrigerated for up to 3 days and reheated in the oven to retain crispiness.",
    },
    {
      question: "What are some popular sauces to serve with chicken wings?",
      answer:
        "Classic sauces include Buffalo hot sauce, BBQ sauce, honey garlic glaze, teriyaki, and spicy Korean gochujang. You can customize sauces to your taste by adjusting sweetness, heat, and acidity.",
    },
    {
      question: "Is it better to smoke or grill chicken wings?",
      answer:
        "Both methods yield delicious results. Smoking imparts a deep smoky flavor and tender texture, ideal for slow cooking. Grilling is faster and gives a nice char and crispiness. Choose based on your time and flavor preference.",
    },
    {
      question: "How do I know when chicken wings are fully cooked?",
      answer:
        "Chicken wings should reach an internal temperature of 165°F (74°C). Use a meat thermometer inserted into the thickest part without touching bone. The juices should run clear, and the meat should not be pink.",
    },
    {
      question: "Can I use frozen chicken wings for this recipe?",
      answer:
        "Yes, but thaw them completely in the refrigerator before cooking to ensure even cooking and safety. Pat dry after thawing to help the seasoning stick and promote crispiness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Chicken Wings"
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
            Chicken wings are a beloved dish worldwide, prized for their crispy skin
            and juicy meat. This recipe focuses on smoking or grilling the wings to
            achieve a perfect balance of crunch and flavor, finished with a
            deliciously sticky sauce that makes them ideal for gatherings and parties.
          </p>
          <p>
            Historically, chicken wings gained popularity in the United States in the
            1960s, particularly with the invention of Buffalo wings in Buffalo, New
            York. Since then, they have evolved into countless variations, from spicy
            to sweet, smoky to tangy, reflecting regional tastes and culinary
            creativity.
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
              Prepare the Wings
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the chicken wings and pat them dry with paper towels. This step is
              crucial for crispy skin. Trim any excess fat or wing tips if desired.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season the Wings
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Toss the wings in olive oil, garlic powder, onion powder, smoked paprika,
              salt, black pepper, and cayenne pepper. Ensure each wing is evenly coated.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Smoke or Grill
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your smoker to 225°F (107°C) and smoke the wings for about 45
              minutes until cooked through. Alternatively, grill over medium-high heat,
              turning frequently, until skin is crisp and internal temperature reaches
              165°F (74°C).
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small saucepan, melt butter and whisk in honey, soy sauce, and apple
              cider vinegar. Simmer gently until slightly thickened, about 3-5 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Toss and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Toss the cooked wings in the warm sauce until evenly coated. Garnish with
              chopped fresh parsley and serve immediately with lemon wedges on the
              side.
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
            For extra crispy skin, let the wings air-dry uncovered in the fridge for a
            few hours before cooking.
          </li>
          <li>
            Use a wire rack on a baking sheet when baking or smoking to allow air to
            circulate around the wings.
          </li>
          <li>
            Adjust the cayenne pepper to control the heat level of your wings.
          </li>
          <li>
            If you don't have a smoker, adding a small amount of smoked paprika or
            liquid smoke to the seasoning mix can mimic smoky flavor.
          </li>
          <li>
            Serve with cooling dips like blue cheese or ranch to balance the spice.
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
              href="https://en.wikipedia.org/wiki/Chicken_wings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Chicken Wings
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/how-to-make-crispy-baked-chicken-wings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Make Crispy Baked Chicken Wings
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