import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BrazilianPicanhaTopSirloinCapCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Picanha%20Top%20Sirloin%20Cap%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6526"
  );

  // --- DATA ---
  const title = 'Brazilian Picanha "Top Sirloin Cap"';
  const description =
    "Grill Brazilian picanha (top sirloin cap) with a crisp fat cap, coarse salt, and perfect slicing.";

  // INGREDIENTS
  const ingredients = [
    { name: "Picanha (Top Sirloin Cap) Beef", baseAmount: 800, unit: "g" },
    { name: "Coarse Sea Salt (Kosher or Rock Salt)", baseAmount: 15, unit: "g" },
    { name: "Black Pepper (freshly ground)", baseAmount: 2, unit: "g" },
    { name: "Garlic Cloves (optional)", baseAmount: 2, unit: "cloves" },
    { name: "Olive Oil (for brushing)", baseAmount: 10, unit: "ml" },
    { name: "Fresh Rosemary (optional)", baseAmount: 5, unit: "g" },
    { name: "Lime Wedges (for serving)", baseAmount: 2, unit: "wedges" },
    { name: "Chimichurri Sauce (optional, for serving)", baseAmount: 60, unit: "ml" },
    { name: "Wood or Charcoal (for grilling)", baseAmount: 1, unit: "unit" },
    { name: "Skewers or Grill Rack", baseAmount: 1, unit: "unit" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "450",
    protein: "55g",
    carbs: "0g",
    fat: "25g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Picanha and why is it special in Brazilian cuisine?",
      answer:
        "Picanha is a prized cut of beef in Brazil, known as the top sirloin cap in the U.S. It features a thick fat cap that renders during grilling, keeping the meat juicy and flavorful. Its unique preparation and presentation make it a centerpiece in Brazilian churrasco (barbecue) culture.",
    },
    {
      question: "How do I properly grill Picanha to get the perfect crust and tenderness?",
      answer:
        "Start by scoring the fat cap lightly to help render the fat evenly. Grill over medium-high heat fat-side down first to crisp it, then sear the meat side. Use coarse salt liberally and avoid over-flipping. Rest the meat after grilling to allow juices to redistribute before slicing against the grain.",
    },
    {
      question: "Can I prepare Picanha without a charcoal grill?",
      answer:
        "Yes, while traditional churrasco uses charcoal or wood for smoky flavor, you can grill Picanha on a gas grill or even pan-sear it in a cast-iron skillet. Just ensure high heat to achieve a good crust and monitor cooking times carefully to avoid overcooking.",
    },
    {
      question: "What are some traditional sides or sauces served with Picanha?",
      answer:
        "Picanha is often served with simple sides like rice, black beans, farofa (toasted cassava flour), and vinaigrette salsa. Chimichurri sauce is a popular accompaniment, adding a fresh, herby contrast to the rich meat.",
    },
    {
      question: "How should I slice Picanha for serving?",
      answer:
        "After resting, slice Picanha against the grain into thin, bite-sized pieces. This ensures tenderness and makes it easier to enjoy the juicy, flavorful meat with its crispy fat cap intact.",
    },
    {
      question: "Is it necessary to marinate Picanha before grilling?",
      answer:
        "Traditional Brazilian Picanha is not marinated. The flavor comes from the quality of the meat, the fat cap, and the seasoning with coarse salt. Marinating can mask the natural beef flavor and is generally not recommended.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt='Brazilian Picanha "Top Sirloin Cap"'
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 15m
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
            Brazilian Picanha, also known as the top sirloin cap, is a beloved cut
            of beef famous for its rich flavor and tender texture. This recipe
            celebrates the traditional Brazilian churrasco method, grilling the
            meat over high heat to achieve a crispy fat cap and juicy interior.
            Perfect for gatherings, this dish highlights simplicity and quality
            ingredients.
          </p>
          <p>
            Originating from Brazil’s southern regions, Picanha has become a
            national icon in Brazilian barbecue culture. The cut is prized for its
            thick fat layer, which bastes the meat as it cooks, creating a
            succulent and flavorful experience. Traditionally, it is skewered and
            cooked over open flames, often served sliced thinly to showcase its
            perfect doneness.
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
              Prepare the Picanha
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Trim excess silver skin but keep the thick fat cap intact. Score the
              fat in a crosshatch pattern about 1/4 inch deep to help render the
              fat evenly during grilling. Let the meat come to room temperature for
              about 30 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season Generously
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rub the entire piece of meat, especially the fat cap, with coarse sea
              salt. Optionally, add freshly ground black pepper and minced garlic for
              extra aroma. Let it rest for 10 minutes to absorb the seasoning.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Preheat the Grill
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Prepare your charcoal or wood grill for medium-high heat. If using a
              gas grill, preheat to about 400°F (204°C). Ensure the grill grates are
              clean and lightly oiled to prevent sticking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Grill the Picanha
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the picanha fat-side down on the grill first. Grill for about 6-8
              minutes until the fat is crispy and golden. Flip and grill the meat
              side for another 6-8 minutes for medium-rare, adjusting time for your
              preferred doneness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Rest and Slice
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the picanha from the grill and let it rest for 10 minutes to
              allow juices to redistribute. Slice thinly against the grain and serve
              immediately with lime wedges and optional chimichurri sauce.
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
            Use a meat thermometer to check doneness: 130°F (54°C) for medium-rare.
          </li>
          <li>
            Letting the meat rest is crucial to keep it juicy and tender after
            grilling.
          </li>
          <li>
            Avoid over-salting; coarse salt enhances flavor without overpowering the
            natural beef taste.
          </li>
          <li>
            If you don’t have a charcoal grill, a cast iron skillet on high heat
            can replicate the sear well.
          </li>
          <li>
            Serve with fresh lime wedges to add a bright, acidic contrast to the
            rich meat.
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
              href="https://en.wikipedia.org/wiki/Picanha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Picanha
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/brazilian-picanha-steak-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Brazilian Picanha Steak Recipe
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