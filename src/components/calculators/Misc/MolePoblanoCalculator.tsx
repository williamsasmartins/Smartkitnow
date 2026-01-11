import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MolePoblanoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Mole%20Chicken%20Mole%20Poblano%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5305"
  );

  // --- DATA ---
  const title = "Mole Chicken (Mole Poblano)";
  const description = "Frango ao mole poblano, molho complexo com pimentas e chocolate.";

  // INGREDIENTS
  const ingredients = [
    { name: "Chicken thighs (bone-in, skin-on)", baseAmount: 800, unit: "g" },
    { name: "Dried ancho chiles", baseAmount: 3, unit: "pcs" },
    { name: "Dried pasilla chiles", baseAmount: 2, unit: "pcs" },
    { name: "Dried mulato chiles", baseAmount: 2, unit: "pcs" },
    { name: "Tomato", baseAmount: 2, unit: "pcs" },
    { name: "White onion", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves", baseAmount: 4, unit: "pcs" },
    { name: "Almonds", baseAmount: 30, unit: "g" },
    { name: "Raisins", baseAmount: 30, unit: "g" },
    { name: "Tortilla (corn)", baseAmount: 1, unit: "pcs" },
    { name: "Mexican chocolate", baseAmount: 40, unit: "g" },
    { name: "Cinnamon stick", baseAmount: 1, unit: "stick" },
    { name: "Cloves", baseAmount: 3, unit: "pcs" },
    { name: "Chicken broth", baseAmount: 500, unit: "ml" },
    { name: "Vegetable oil", baseAmount: 3, unit: "tbsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper", baseAmount: 1, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "550",
    protein: "45g",
    carbs: "25g",
    fat: "25g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Mole Poblano and what makes it unique?",
      answer:
        "Mole Poblano is a traditional Mexican sauce originating from Puebla, known for its complex flavor profile combining various dried chiles, nuts, spices, and chocolate. Its uniqueness lies in the balance of smoky, spicy, sweet, and savory notes, making it a rich and layered sauce often served with chicken or turkey.",
    },
    {
      question: "Can I substitute the dried chiles if I can't find them?",
      answer:
        "While ancho, pasilla, and mulato chiles are traditional and provide the authentic flavor, you can substitute with other mild to medium dried chiles like guajillo or chipotle. However, the flavor profile will differ slightly. Toasting and soaking the chiles properly is essential to bring out their depth.",
    },
    {
      question: "Is Mexican chocolate different from regular chocolate?",
      answer:
        "Yes, Mexican chocolate typically contains sugar, cinnamon, and sometimes other spices, and has a grainier texture compared to regular baking chocolate. It adds a subtle spiced sweetness to the mole sauce, which is crucial for the authentic flavor.",
    },
    {
      question: "How long can I store leftover mole sauce?",
      answer:
        "Leftover mole sauce can be stored in an airtight container in the refrigerator for up to 5 days. For longer storage, it freezes well for up to 3 months. Always reheat gently and stir well before serving.",
    },
    {
      question: "Can mole sauce be made vegetarian or vegan?",
      answer:
        "Absolutely! To make mole vegetarian or vegan, substitute chicken broth with vegetable broth and omit any animal-based ingredients. The sauce itself is rich and flavorful enough to stand on its own or be served with tofu, vegetables, or grains.",
    },
    {
      question: "What dishes pair well with Mole Poblano?",
      answer:
        "Mole Poblano is traditionally served over chicken or turkey, but it also pairs wonderfully with enchiladas, roasted vegetables, rice, or even as a sauce for grilled meats. Its versatility makes it a staple in Mexican cuisine.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Mole Chicken (Mole Poblano)"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 1h 15m
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Mole Poblano is a celebrated Mexican dish featuring tender chicken
            smothered in a rich, complex sauce made from a blend of dried chiles,
            nuts, spices, and chocolate. This sauce is a masterpiece of flavor,
            balancing smoky, spicy, sweet, and savory elements to create a
            uniquely satisfying experience. The dish is often reserved for special
            occasions and is a symbol of Mexican culinary heritage.
          </p>
          <p>
            Originating from the city of Puebla, Mexico, Mole Poblano has roots
            tracing back to pre-Hispanic times, with influences from indigenous
            ingredients and Spanish colonial spices. The recipe has evolved over
            centuries, incorporating a variety of local chiles and chocolate,
            resulting in the iconic sauce known today. It remains a beloved staple
            in Mexican cuisine and a testament to the country's rich cultural
            history.
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
              Prepare the Chiles
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove stems and seeds from the dried ancho, pasilla, and mulato
              chiles. Toast them lightly in a dry skillet over medium heat until
              fragrant, about 1-2 minutes per side. Then soak the toasted chiles in
              hot water for 20 minutes until softened.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare Vegetables and Nuts
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Roast the tomatoes, onion halves, and garlic cloves until charred.
              Toast the almonds and raisins in a dry pan until golden. Lightly fry
              the tortilla until crisp and golden.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Blend the Mole Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Drain the softened chiles and blend them with roasted vegetables,
              toasted almonds, raisins, tortilla, cinnamon stick, cloves, and
              Mexican chocolate. Add chicken broth gradually to achieve a smooth,
              thick sauce.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Chicken
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Season chicken thighs with salt and pepper. In a large skillet,
              heat vegetable oil and brown the chicken on all sides. Remove and set
              aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Simmer Mole and Chicken
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the mole sauce into the skillet and bring to a gentle simmer.
              Add the browned chicken pieces, cover, and cook on low heat for 45
              minutes to 1 hour until the chicken is tender and fully cooked.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the mole chicken hot, garnished with sesame seeds or fresh
              cilantro if desired. Traditionally accompanied by rice and warm
              tortillas.
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
            Toast the dried chiles gently to avoid burning, which can cause
            bitterness in the sauce.
          </li>
          <li>
            Use authentic Mexican chocolate for the best flavor; if unavailable,
            bittersweet chocolate with a pinch of cinnamon can be a substitute.
          </li>
          <li>
            Blend the sauce in batches if your blender is small to ensure a smooth
            texture.
          </li>
          <li>
            Simmer the mole sauce slowly to allow flavors to meld and deepen.
          </li>
          <li>
            Mole improves in flavor when made a day ahead, allowing the spices to
            fully develop.
          </li>
          <li>
            Adjust the thickness of the sauce with chicken broth or water to your
            preference.
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
              href="https://en.wikipedia.org/wiki/Mole_poblano"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Mole Poblano
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Mole-Poblano/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Mole Poblano Recipe & History
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.mexicoinmykitchen.com/mole-poblano-recipe/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Mexico In My Kitchen: Mole Poblano Recipe
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