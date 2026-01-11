import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ReverseSearRibeyeCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Reverse%20Sear%20Ribeye%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9538"
  );

  // --- DATA ---
  const title = "Reverse Sear Ribeye";
  const description =
    "Reverse-sear ribeye for edge-to-edge doneness, crisp crust, and precise temperature control.";

  // INGREDIENTS
  const ingredients = [
    { name: "Ribeye steak (bone-in or boneless)", baseAmount: 500, unit: "g" },
    { name: "Kosher salt", baseAmount: 10, unit: "g" },
    { name: "Freshly ground black pepper", baseAmount: 5, unit: "g" },
    { name: "Garlic cloves, smashed", baseAmount: 3, unit: "pcs" },
    { name: "Fresh rosemary sprigs", baseAmount: 2, unit: "pcs" },
    { name: "Unsalted butter", baseAmount: 30, unit: "g" },
    { name: "Olive oil", baseAmount: 15, unit: "ml" },
    { name: "Vegetable oil (high smoke point)", baseAmount: 15, unit: "ml" },
    { name: "Fresh thyme sprigs", baseAmount: 2, unit: "pcs" },
    { name: "Coarse sea salt (for finishing)", baseAmount: 2, unit: "g" },
    { name: "Freshly ground white pepper (optional)", baseAmount: 1, unit: "g" },
    { name: "Steak thermometer (tool, optional)", baseAmount: 1, unit: "pc" },
  ];

  const nutrition = {
    calories: "650",
    protein: "55g",
    carbs: "0g",
    fat: "48g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the reverse sear method and why is it preferred for ribeye?",
      answer:
        "The reverse sear method involves slowly cooking the ribeye steak at a low temperature first, usually in an oven or sous vide, until it reaches just below the desired internal temperature. Then, it is seared at high heat to develop a flavorful crust. This technique ensures even cooking edge-to-edge, precise temperature control, and a tender, juicy steak with a perfect crust.",
    },
    {
      question: "How do I know when my ribeye is cooked to the right temperature?",
      answer:
        "Using a reliable meat thermometer is the best way to ensure perfect doneness. For medium-rare, aim for an internal temperature of about 125°F (52°C) before searing, as the temperature will rise slightly during the sear. Adjust according to your preferred doneness: rare (120°F), medium (135°F), medium-well (145°F).",
    },
    {
      question: "Can I use the reverse sear method without an oven?",
      answer:
        "Yes, you can use a sous vide machine or even a low-temperature grill to slowly bring the steak up to temperature before searing. The key is to cook the steak gently and evenly before finishing with a high-heat sear for the crust.",
    },
    {
      question: "Why is it important to rest the steak after searing?",
      answer:
        "Resting allows the juices to redistribute throughout the meat, preventing them from spilling out when you cut into the steak. This results in a juicier and more flavorful eating experience. Typically, rest the steak for 5 to 10 minutes covered loosely with foil.",
    },
    {
      question: "What oils and fats are best for searing ribeye?",
      answer:
        "Use oils with a high smoke point such as vegetable oil or grapeseed oil for the initial sear to achieve a crisp crust without burning. Adding butter and aromatics like garlic and herbs towards the end of the sear enhances flavor and adds richness.",
    },
    {
      question: "Can I reverse sear thicker or thinner cuts of ribeye?",
      answer:
        "The reverse sear method works best with thicker cuts (1.5 inches or more) because it allows for even cooking without overcooking the exterior. For thinner cuts, traditional searing methods may be more efficient, but you can still use reverse sear with careful temperature monitoring.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Reverse Sear Ribeye"
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
            The reverse sear ribeye is a culinary technique that elevates the classic steak
            experience by ensuring perfectly even cooking and a beautifully caramelized crust.
            Unlike traditional searing first, this method starts by gently cooking the steak at a
            low temperature, allowing the heat to penetrate evenly from edge to center. The final
            sear then crisps the exterior, locking in juices and flavor.
          </p>
          <p>
            This method has gained popularity among chefs and home cooks alike for its precision
            and reliability. It traces its roots to professional kitchens where controlling
            temperature and texture is paramount. The reverse sear technique is particularly
            effective for thick cuts like ribeye, which benefit from slow, even cooking to avoid
            overdone edges and undercooked centers.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Steak</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the ribeye from the refrigerator and pat dry with paper towels. Season
              generously with kosher salt and freshly ground black pepper on all sides. Let it
              rest at room temperature for 30-45 minutes to ensure even cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Slow Cook in Oven</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 225°F (107°C). Place the steak on a wire rack over a baking
              sheet to allow air circulation. Insert a meat thermometer probe if available. Cook
              until the internal temperature reaches about 10-15°F below your target doneness
              (e.g., 110°F for medium-rare).
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Rest Before Searing</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the steak from the oven and let it rest for 10 minutes. This resting period
              helps redistribute juices and prepares the steak for the final sear.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sear the Steak</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat a cast-iron skillet over high heat until smoking hot. Add vegetable oil and
              sear the steak for 1-2 minutes per side until a deep brown crust forms. Add butter,
              smashed garlic, rosemary, and thyme to the pan and baste the steak continuously for
              extra flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Final Rest and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the steak to a cutting board and rest for 5-10 minutes. Sprinkle with coarse
              sea salt and freshly ground white pepper if desired. Slice against the grain and
              serve immediately.
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
            Use a cast-iron skillet for the sear to achieve the best crust due to its excellent heat
            retention.
          </li>
          <li>
            Pat the steak very dry before seasoning to ensure a crisp crust during searing.
          </li>
          <li>
            Baste the steak with butter and aromatics during the sear to infuse rich flavors and
            keep the meat moist.
          </li>
          <li>
            Let the steak rest after both the oven and the sear to maximize juiciness and tenderness.
          </li>
          <li>
            If you don’t have a thermometer, use the finger test method to estimate doneness, but a
            thermometer is highly recommended for precision.
          </li>
          <li>
            For an extra smoky flavor, finish the steak briefly on a hot grill after searing.
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
              href="https://www.seriouseats.com/reverse-sear-steak-method-explained"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: The Reverse Sear Method Explained
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.foodnetwork.com/recipes/articles/how-to-reverse-sear-steak"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Food Network: How to Reverse Sear Steak
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