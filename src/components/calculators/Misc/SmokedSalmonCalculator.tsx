import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SmokedSalmonCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Smoked%20Salmon%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3455"
  );

  // --- DATA ---
  const title = "Smoked Salmon";
  const description = "Make smoked salmon with gentle heat, simple cure options, and flaky, silky texture.";

  // INGREDIENTS
  const ingredients = [
    { name: "Fresh Salmon Fillet (skin-on, pin bones removed)", baseAmount: 500, unit: "g" },
    { name: "Coarse Sea Salt", baseAmount: 60, unit: "g" },
    { name: "Granulated Sugar", baseAmount: 40, unit: "g" },
    { name: "Black Peppercorns (crushed)", baseAmount: 1, unit: "tbsp" },
    { name: "Dill (fresh, chopped)", baseAmount: 3, unit: "tbsp" },
    { name: "Lemon Zest", baseAmount: 1, unit: "tsp" },
    { name: "Juniper Berries (crushed)", baseAmount: 1, unit: "tsp" },
    { name: "Olive Oil (for finishing)", baseAmount: 2, unit: "tbsp" },
    { name: "Wood Chips (for smoking, e.g. alder or applewood)", baseAmount: 50, unit: "g" },
    { name: "Optional: Vodka (to rinse fillet)", baseAmount: 2, unit: "tbsp" },
    { name: "Optional: Fresh Thyme Sprigs", baseAmount: 2, unit: "pcs" },
    { name: "Optional: Bay Leaf", baseAmount: 1, unit: "pc" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = { calories: "280", protein: "25g", carbs: "1g", fat: "20g" };

  // --- LOGIC ---
  const getAmount = (base: number) => (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of wood chips are best for smoking salmon?",
      answer:
        "Alder and applewood chips are traditionally preferred for smoking salmon because they impart a delicate, slightly sweet smoky flavor that complements the fish without overpowering it. Hickory and mesquite can be too strong and may mask the salmon's natural taste.",
    },
    {
      question: "How long should I cure the salmon before smoking?",
      answer:
        "Typically, the salmon should be cured for 12 to 24 hours in the refrigerator. This curing time allows the salt and sugar mixture to draw out moisture and season the fish evenly, resulting in a firmer texture and enhanced flavor before smoking.",
    },
    {
      question: "Can I cold smoke salmon instead of hot smoking?",
      answer:
        "Yes, cold smoking is a popular method for smoked salmon, producing a silky texture and delicate flavor. Cold smoking is done at temperatures below 90°F (32°C) and requires longer smoking times and careful temperature control to ensure food safety.",
    },
    {
      question: "How should I store smoked salmon after preparation?",
      answer:
        "Once smoked, salmon should be wrapped tightly in plastic wrap or vacuum-sealed and refrigerated. It can last up to 1-2 weeks in the fridge or be frozen for up to 3 months. Always keep it chilled to maintain freshness and prevent spoilage.",
    },
    {
      question: "Is it necessary to remove the skin before smoking?",
      answer:
        "No, it is recommended to keep the skin on during smoking as it helps hold the fillet together and protects the flesh from direct heat. The skin can be removed easily after smoking if desired.",
    },
    {
      question: "Can I use pre-smoked salmon for this recipe?",
      answer:
        "Pre-smoked salmon is already cooked and flavored, so this recipe is intended for fresh salmon fillets. Using pre-smoked salmon would not require curing or smoking again and would alter the intended texture and flavor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Smoked Salmon"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cure: 12-24h | Smoke: 1-2h
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
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setServings((s) => Math.max(1, s - 1))}>
                -
              </Button>
              <span className="w-6 text-center font-bold text-lg">{servings}</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setServings((s) => s + 1)}>
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
            Smoked salmon is a culinary classic that combines the rich, buttery texture of fresh salmon with the deep, aromatic flavors imparted by smoking. This recipe guides you through a gentle curing process followed by a delicate smoking technique to achieve flaky, silky salmon that melts in your mouth. Perfect for appetizers, salads, or elegant brunches, homemade smoked salmon elevates any meal with its gourmet appeal.
          </p>
          <p>
            The tradition of smoking salmon dates back centuries, originating in indigenous cultures of the Pacific Northwest and Scandinavia, where preservation was essential. Over time, it evolved into a refined delicacy enjoyed worldwide. This recipe honors those roots while offering a modern, accessible approach for home cooks to create restaurant-quality smoked salmon.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Cure Mix</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, combine the coarse sea salt, granulated sugar, crushed black peppercorns, crushed juniper berries, lemon zest, and chopped fresh dill. Mix thoroughly to create an even curing blend that will season and preserve the salmon.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Salmon</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the salmon fillet under cold water and optionally rinse with vodka to remove any fishy odors. Pat dry thoroughly with paper towels. Place the fillet skin-side down on a large piece of plastic wrap.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Apply the Cure</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Evenly spread the cure mix over the flesh side of the salmon, pressing gently to adhere. Optionally, add fresh thyme sprigs and a bay leaf on top for extra aroma. Wrap the fillet tightly in plastic wrap.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cure in Refrigerator</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the wrapped salmon on a tray and refrigerate for 12 to 24 hours, depending on thickness and desired firmness. Flip the package halfway through to ensure even curing.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Rinse and Dry</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              After curing, unwrap the salmon and rinse off the cure mixture under cold water. Pat dry thoroughly with paper towels. Place on a rack and refrigerate uncovered for 1-2 hours to form a pellicle (a tacky surface) which helps smoke adhere.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Smoke the Salmon</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your smoker to 90-110°F (32-43°C) for cold smoking or 160-180°F (71-82°C) for hot smoking. Add alder or applewood chips to the smoker. Smoke the salmon for 1-2 hours until it reaches your preferred smokiness and texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              7
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Finish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Brush the smoked salmon lightly with olive oil for shine and flavor. Slice thinly against the grain and serve chilled or at room temperature with accompaniments like cream cheese, capers, and fresh bread.
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
            Use a digital thermometer to monitor smoker temperature precisely, especially for cold smoking, to ensure food safety and optimal texture.
          </li>
          <li>
            Forming a pellicle on the salmon surface before smoking is crucial; it helps the smoke flavor penetrate and creates a beautiful glossy finish.
          </li>
          <li>
            Experiment with different herbs and spices in the cure mix to customize flavor profiles, such as adding crushed coriander seeds or smoked paprika.
          </li>
          <li>
            If you don't have a smoker, you can simulate smoking by using a stovetop smoker or smoking gun, but results may vary.
          </li>
          <li>
            Always use fresh, high-quality salmon for the best flavor and texture; wild-caught tends to have richer taste than farmed.
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
              href="https://en.wikipedia.org/wiki/Smoked_salmon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Smoked Salmon
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.finecooking.com/article/how-to-make-smoked-salmon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Fine Cooking: How to Make Smoked Salmon
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