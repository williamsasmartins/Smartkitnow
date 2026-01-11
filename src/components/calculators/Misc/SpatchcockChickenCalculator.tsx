import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SpatchcockChickenCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Spatchcock%20Chicken%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3668"
  );

  // --- DATA ---
  const title = "Spatchcock Chicken";
  const description =
    "Spatchcock chicken for faster, even grilling with crisp skin and smoky, juicy meat.";

  // INGREDIENTS
  const ingredients = [
    { name: "Whole chicken (about 1.8 kg)", baseAmount: 1800, unit: "g" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Kosher salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Freshly ground black pepper", baseAmount: 1, unit: "tsp" },
    { name: "Garlic cloves, minced", baseAmount: 4, unit: "cloves" },
    { name: "Fresh thyme leaves", baseAmount: 2, unit: "tsp" },
    { name: "Smoked paprika", baseAmount: 1, unit: "tsp" },
    { name: "Lemon zest", baseAmount: 1, unit: "tbsp" },
    { name: "Lemon juice", baseAmount: 2, unit: "tbsp" },
    { name: "Chopped fresh parsley", baseAmount: 2, unit: "tbsp" },
    { name: "Optional: chili flakes", baseAmount: 0.5, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "450",
    protein: "45g",
    carbs: "0g",
    fat: "30g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is spatchcocking and why is it used?",
      answer:
        "Spatchcocking is a technique where the backbone of the chicken is removed and the bird is flattened out. This allows the chicken to cook more evenly and quickly, especially on a grill or in the oven, resulting in crispier skin and juicier meat.",
    },
    {
      question: "Can I use spatchcocking for other poultry?",
      answer:
        "Yes, spatchcocking can be applied to other birds such as turkey, Cornish hens, or game birds. The principle remains the same: removing the backbone and flattening the bird for even cooking.",
    },
    {
      question: "How do I ensure the chicken skin gets crispy?",
      answer:
        "Pat the chicken skin dry with paper towels before seasoning. Applying olive oil and salt helps draw out moisture and promotes crisping. Cooking over medium-high heat and avoiding overcrowding the pan or grill also helps achieve crispy skin.",
    },
    {
      question: "What are some good side dishes to serve with spatchcock chicken?",
      answer:
        "Roasted vegetables, grilled asparagus, garlic mashed potatoes, or a fresh green salad complement spatchcock chicken beautifully. The quick cooking method pairs well with sides that can be prepared simultaneously.",
    },
    {
      question: "Can I marinate the chicken before spatchcocking?",
      answer:
        "You can marinate the chicken before or after spatchcocking. Marinating after spatchcocking allows the marinade to penetrate more evenly. However, avoid overly acidic marinades for long periods as they can break down the meat texture.",
    },
    {
      question: "How do I store leftovers?",
      answer:
        "Store leftover cooked spatchcock chicken in an airtight container in the refrigerator for up to 3-4 days. Reheat gently to avoid drying out the meat, preferably in the oven or covered skillet.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Spatchcock Chicken"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 25m
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
            Spatchcock chicken is a culinary technique that involves removing the backbone of a whole chicken and flattening it out before cooking. This method allows the chicken to cook more quickly and evenly, resulting in beautifully crisp skin and juicy, tender meat. It’s a favorite among chefs and home cooks alike for its efficiency and flavor enhancement.
          </p>
          <p>
            The origin of spatchcocking is somewhat debated, but it is believed to have roots in traditional Irish and British cooking, where the term “spatchcock” was used to describe a bird prepared for quick roasting or grilling. Over time, this technique has been embraced worldwide, especially in grilling and barbecue cultures, for its ability to maximize flavor and minimize cooking time.
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
              Prepare the Chicken
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the whole chicken breast-side down on a cutting board. Using kitchen shears, cut along both sides of the backbone to remove it completely. Flip the chicken over and press firmly on the breastbone to flatten the bird.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season the Chicken
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pat the chicken dry with paper towels. Mix olive oil, salt, pepper, garlic, thyme, smoked paprika, lemon zest, lemon juice, parsley, and optional chili flakes in a bowl. Rub this mixture evenly over both sides of the chicken.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Preheat and Cook
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your grill or oven to medium-high heat (about 200°C/400°F). Place the chicken skin-side up on the grill or a baking sheet. Cook for about 20-25 minutes, turning once halfway through if grilling, until the internal temperature reaches 75°C (165°F).
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Rest and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the chicken from heat and let it rest for 10 minutes to allow juices to redistribute. Carve and serve with your favorite sides.
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
            For extra crispy skin, let the spatchcocked chicken sit uncovered in the refrigerator for a few hours or overnight to dry out the skin before cooking.
          </li>
          <li>
            Use a meat thermometer to ensure perfect doneness without overcooking; the ideal internal temperature is 75°C (165°F).
          </li>
          <li>
            If grilling, use indirect heat after searing the skin side to prevent flare-ups and burning.
          </li>
          <li>
            Experiment with different herb blends and citrus zest to customize the flavor profile.
          </li>
          <li>
            Save the backbone for making rich homemade chicken stock.
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
              href="https://en.wikipedia.org/wiki/Spatchcock"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Spatchcock Technique
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/how-to-spatchcock-a-chicken"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Spatchcock a Chicken
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