import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TuscanSteakFlorentineStyleCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Tuscan%20Steak%20FlorentineStyle%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5690"
  );

  // --- DATA ---
  const title = "Tuscan Steak (Florentine-Style)";
  const description = "Thick grilled T-bone steak seasoned simply with salt and pepper.";

  // INGREDIENTS
  const ingredients = [
    { name: "T-bone steak (thick cut)", baseAmount: 500, unit: "g" },
    { name: "Extra virgin olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Coarse sea salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Freshly ground black pepper", baseAmount: 1, unit: "tsp" },
    { name: "Fresh rosemary sprigs", baseAmount: 2, unit: "pcs" },
    { name: "Garlic cloves (crushed)", baseAmount: 3, unit: "pcs" },
    { name: "Lemon wedges (for serving)", baseAmount: 4, unit: "pcs" },
    { name: "Arugula (optional, for garnish)", baseAmount: 50, unit: "g" },
    { name: "Coarse sea salt flakes (for finishing)", baseAmount: 0.5, unit: "tsp" },
    { name: "Unsalted butter", baseAmount: 1, unit: "tbsp" },
    { name: "Red wine vinegar (optional, for drizzle)", baseAmount: 1, unit: "tsp" },
  ];

  // Nutrition estimates per serving (approximate)
  const nutrition = {
    calories: "650",
    protein: "60g",
    carbs: "0g",
    fat: "45g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of steak is best for Tuscan Florentine-style cooking?",
      answer:
        "The traditional Tuscan Florentine steak is a thick-cut T-bone or Porterhouse steak, typically weighing around 1 to 1.5 pounds (450-700g). The thickness is crucial to achieve the perfect rare interior with a beautifully charred crust.",
    },
    {
      question: "How do I achieve the perfect rare doneness for this steak?",
      answer:
        "Cook the steak over very high heat for a short time, about 3-4 minutes per side, depending on thickness. The goal is a charred exterior with a rare, warm center. Use a meat thermometer if unsure; rare is about 125°F (52°C). Let the steak rest before slicing.",
    },
    {
      question: "Can I use other herbs besides rosemary?",
      answer:
        "While rosemary is traditional and imparts a distinctive aroma, you can experiment with thyme or sage. However, keep the seasoning simple to let the natural flavor of the beef shine through.",
    },
    {
      question: "Why is coarse sea salt preferred over regular table salt?",
      answer:
        "Coarse sea salt adds texture and bursts of flavor when sprinkled on the steak after cooking. It also helps to create a slight crust and enhances the meat's natural taste without overpowering it.",
    },
    {
      question: "Is it necessary to marinate the steak before grilling?",
      answer:
        "No, traditional Florentine steak is not marinated. The simplicity of salt, pepper, and olive oil allows the quality of the meat to stand out. Over-marinating can mask the natural flavors.",
    },
    {
      question: "What sides traditionally accompany Tuscan steak?",
      answer:
        "Tuscan steak is often served with simple sides like fresh lemon wedges, arugula salad, roasted potatoes, or cannellini beans dressed with olive oil and herbs. The focus remains on the steak itself.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Tuscan Steak (Florentine-Style)"
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
            Tuscan Steak, or Bistecca alla Fiorentina, is a celebrated Italian
            classic originating from Florence, Tuscany. This dish showcases the
            beauty of simplicity by highlighting a thick, juicy T-bone steak,
            seasoned with just salt, pepper, and olive oil, then grilled to
            perfection over high heat. The result is a tender, flavorful steak
            with a smoky crust and rare, succulent interior that embodies the
            rustic elegance of Tuscan cuisine.
          </p>
          <p>
            Historically, this steak was a staple among Tuscan butchers and
            farmers, prized for its quality and minimal seasoning that allowed
            the natural flavors of the meat to shine. Traditionally cooked over
            a wood or charcoal fire, the steak is served rare and sliced thick,
            often accompanied by simple sides like fresh lemon wedges and
            peppery arugula. This recipe honors that tradition while making it
            accessible for home cooks.
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
              Prepare the Steak
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the T-bone steak from the refrigerator about 30 minutes
              before cooking to bring it to room temperature. Pat dry with
              paper towels to ensure a good sear. Lightly brush both sides with
              extra virgin olive oil and season generously with coarse sea salt
              and freshly ground black pepper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Preheat the Grill or Grill Pan
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat a grill or heavy cast-iron grill pan over very high heat
              until smoking hot. If using charcoal or wood, ensure the flames
              have died down and the coals are glowing red for even cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Grill the Steak
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the steak on the grill and cook for about 4 minutes without
              moving it to develop a charred crust. Flip and grill the other
              side for another 3-4 minutes for rare doneness. During the last
              minute, add crushed garlic cloves and rosemary sprigs to the
              grill or pan to infuse aroma.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Rest and Finish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the steak from the heat and transfer to a warm plate.
              Let it rest for 5-10 minutes to allow juices to redistribute.
              Optionally, melt a tablespoon of unsalted butter over the steak
              and sprinkle with coarse sea salt flakes for finishing.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slice the steak thickly against the grain and serve with fresh
              lemon wedges and a drizzle of red wine vinegar if desired.
              Garnish with arugula or your preferred simple side dishes.
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
            Use a meat thermometer to ensure perfect rare doneness: 125°F (52°C)
            internal temperature.
          </li>
          <li>
            Letting the steak rest after grilling is essential to keep it juicy.
          </li>
          <li>
            Avoid flipping the steak multiple times; one flip ensures a good crust.
          </li>
          <li>
            Use high-quality, fresh T-bone steak from a trusted butcher for best
            flavor and texture.
          </li>
          <li>
            If grilling outdoors, use hardwood charcoal or wood for authentic smoky
            flavor.
          </li>
          <li>
            Serve with simple sides to keep the focus on the steak’s rich flavor.
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
              href="https://en.wikipedia.org/wiki/Italian_cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: History of this Dish
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Italian-cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Culinary Reference
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
