import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SmokedTurkeyCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Smoked%20Turkey%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8154"
  );

  // --- DATA ---
  const title = "Smoked Turkey";
  const description =
    "Smoke turkey for juicy breast meat, crispy skin tips, and safe internal temperature guidance.";

  // INGREDIENTS
  const ingredients = [
    { name: "Whole Turkey (fresh or thawed)", baseAmount: 4000, unit: "g" },
    { name: "Kosher Salt", baseAmount: 80, unit: "g" },
    { name: "Brown Sugar", baseAmount: 50, unit: "g" },
    { name: "Black Pepper (freshly ground)", baseAmount: 15, unit: "g" },
    { name: "Paprika", baseAmount: 20, unit: "g" },
    { name: "Garlic Powder", baseAmount: 15, unit: "g" },
    { name: "Onion Powder", baseAmount: 15, unit: "g" },
    { name: "Dried Thyme", baseAmount: 10, unit: "g" },
    { name: "Dried Rosemary", baseAmount: 10, unit: "g" },
    { name: "Olive Oil", baseAmount: 60, unit: "ml" },
    { name: "Apple Wood Chips (for smoking)", baseAmount: 100, unit: "g" },
    { name: "Water (for pan)", baseAmount: 500, unit: "ml" },
    { name: "Fresh Sage (optional)", baseAmount: 15, unit: "g" },
    { name: "Fresh Parsley (optional)", baseAmount: 15, unit: "g" },
  ];

  // Nutrition estimate per serving (approximate)
  const nutrition = {
    calories: "450",
    protein: "55g",
    carbs: "5g",
    fat: "20g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the ideal internal temperature for smoked turkey?",
      answer:
        "The ideal internal temperature for smoked turkey is 165°F (74°C) measured at the thickest part of the breast and thigh. This ensures the meat is safe to eat while remaining juicy and tender.",
    },
    {
      question: "How long does it take to smoke a whole turkey?",
      answer:
        "Smoking a whole turkey typically takes about 30 to 40 minutes per pound at a temperature of 225°F to 250°F (107°C to 121°C). For a 4 kg (approx. 9 lb) turkey, expect around 4.5 to 6 hours of smoking time.",
    },
    {
      question: "Can I brine the turkey before smoking?",
      answer:
        "Yes, brining the turkey for 12 to 24 hours before smoking helps to enhance moisture retention and flavor. Use a saltwater brine with aromatics like herbs, garlic, and citrus for best results.",
    },
    {
      question: "What type of wood is best for smoking turkey?",
      answer:
        "Mild fruitwoods like apple, cherry, or pecan are ideal for smoking turkey as they impart a subtle, sweet smoke flavor without overpowering the delicate poultry taste.",
    },
    {
      question: "How do I achieve crispy skin on smoked turkey?",
      answer:
        "To get crispy skin, pat the turkey dry before applying the rub, smoke at a consistent temperature, and finish by increasing the smoker temperature or briefly placing the turkey under a broiler to crisp the skin.",
    },
    {
      question: "Can I smoke a frozen turkey?",
      answer:
        "It is not recommended to smoke a frozen turkey. Always fully thaw the turkey in the refrigerator for several days before smoking to ensure even cooking and food safety.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Smoked Turkey"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 5h
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
            Smoking turkey is a time-honored technique that infuses the meat with
            rich, smoky flavors while preserving its natural juiciness. This recipe
            guides you through the process of preparing a whole turkey for smoking,
            ensuring tender breast meat and crispy, flavorful skin. The use of a
            balanced dry rub and apple wood chips creates a harmonious flavor
            profile that elevates this classic poultry dish to restaurant quality.
          </p>
          <p>
            Historically, smoking meat was a preservation method used by indigenous
            peoples and early settlers. Over time, it evolved into a culinary art
            form, especially in American barbecue traditions. Turkey, often
            associated with festive occasions, benefits greatly from smoking,
            which adds depth and complexity to its mild flavor. This recipe blends
            traditional smoking techniques with modern culinary insights for the
            perfect smoked turkey experience.
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
              Prepare the Turkey
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the turkey from packaging, discard giblets, and pat dry with
              paper towels. If desired, brine the turkey in a saltwater solution for
              12-24 hours to enhance moisture and flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Apply the Dry Rub
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Mix kosher salt, brown sugar, black pepper, paprika, garlic powder,
              onion powder, thyme, and rosemary. Rub the mixture evenly over the
              entire turkey, including under the skin where possible.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Smoker
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your smoker to 225°F (107°C). Add soaked apple wood chips to
              the smoker box or directly on coals for a steady smoke. Place a water
              pan inside to maintain humidity.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Smoke the Turkey
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the turkey breast side up on the smoker grate. Smoke for about 30
              to 40 minutes per pound, maintaining a consistent temperature. Use a
              meat thermometer to monitor internal temperature.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Rest and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Once the turkey reaches 165°F (74°C), remove it from the smoker and
              tent with foil. Let it rest for 20-30 minutes before carving to allow
              juices to redistribute.
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
            For extra flavor, stuff the turkey cavity with fresh herbs like sage,
            parsley, and lemon wedges before smoking.
          </li>
          <li>
            Keep the smoker closed as much as possible to maintain steady smoke and
            temperature.
          </li>
          <li>
            Use a digital probe thermometer for accurate temperature monitoring
            without opening the smoker.
          </li>
          <li>
            If skin isn’t crispy enough after smoking, finish the turkey under a
            broiler for a few minutes, watching closely to prevent burning.
          </li>
          <li>
            Let the turkey rest properly; carving too soon will cause juices to run
            out and dry the meat.
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
              href="https://www.fda.gov/food/consumers/safe-food-handling"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              FDA: Safe Food Handling Guidelines
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.smokedturkeyrecipes.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Smoked Turkey Recipes & Tips
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