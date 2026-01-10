import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RoastedPeppersWithOliveOilCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Roasted%20Peppers%20with%20Olive%20Oil%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8754"
  );

  // --- DATA ---
  const title = "Roasted Peppers with Olive Oil";
  const description = "Charred bell peppers marinated in olive oil, garlic, and herbs.";

  // INGREDIENTS
  const ingredients = [
    { name: "Red Bell Peppers", baseAmount: 600, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 60, unit: "ml" },
    { name: "Garlic Cloves, minced", baseAmount: 3, unit: "pcs" },
    { name: "Fresh Parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Fresh Basil Leaves, chopped", baseAmount: 10, unit: "g" },
    { name: "Red Wine Vinegar", baseAmount: 15, unit: "ml" },
    { name: "Sea Salt", baseAmount: 2, unit: "g" },
    { name: "Freshly Ground Black Pepper", baseAmount: 1, unit: "g" },
    { name: "Crushed Red Pepper Flakes (optional)", baseAmount: 0.5, unit: "g" },
    { name: "Capers (optional)", baseAmount: 10, unit: "g" },
    { name: "Lemon Zest", baseAmount: 1, unit: "tsp" },
    { name: "Olive Oil for Drizzling", baseAmount: 10, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "180",
    protein: "1g",
    carbs: "6g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of peppers work best for roasting?",
      answer:
        "Sweet bell peppers, especially red, yellow, or orange varieties, are ideal for roasting due to their natural sweetness and tender flesh. They char beautifully, developing a smoky flavor that complements the olive oil marinade perfectly.",
    },
    {
      question: "How do I know when the peppers are properly roasted?",
      answer:
        "The peppers are done when their skins are blackened and blistered all over. This usually takes about 10-15 minutes under a broiler or on an open flame. The skin should peel off easily once cooled, revealing the soft, smoky flesh underneath.",
    },
    {
      question: "Can I prepare this recipe ahead of time?",
      answer:
        "Yes, roasted peppers taste even better after marinating for several hours or overnight. This allows the flavors of the garlic, herbs, and olive oil to fully infuse the peppers, making it a great make-ahead dish for entertaining.",
    },
    {
      question: "What are some serving suggestions for roasted peppers with olive oil?",
      answer:
        "Serve them as a side dish, on toasted bread as bruschetta, tossed into salads, or alongside grilled meats and seafood. They also pair wonderfully with fresh cheeses like mozzarella or burrata.",
    },
    {
      question: "How should I store leftover roasted peppers?",
      answer:
        "Store leftovers in an airtight container in the refrigerator, submerged in the olive oil marinade to keep them moist. They will keep well for up to 5 days and can be enjoyed cold or gently warmed.",
    },
    {
      question: "Is it necessary to peel the peppers after roasting?",
      answer:
        "Yes, peeling the charred skin off the peppers is essential as the skin can be tough and bitter. Once peeled, the flesh is tender and flavorful, making the dish much more enjoyable.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Roasted Peppers with Olive Oil"
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
            Roasted Peppers with Olive Oil is a simple yet elegant dish that
            highlights the natural sweetness and smoky depth of charred bell
            peppers. This recipe combines the rich, fruity notes of extra virgin
            olive oil with fresh herbs and garlic to create a vibrant,
            Mediterranean-inspired appetizer or side dish. Perfect for warm
            weather dining or as a colorful addition to any meal, these peppers
            are as versatile as they are delicious.
          </p>
          <p>
            The tradition of roasting peppers dates back centuries in Southern
            European cuisines, particularly in Italy and Spain, where the
            technique was used to preserve the peppers and intensify their
            flavor. Marinating the roasted peppers in olive oil and herbs not
            only enhances their taste but also keeps them moist and tender,
            making this dish a timeless classic that celebrates simple,
            high-quality ingredients.
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
              Prepare the Peppers
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Wash the bell peppers thoroughly and dry them. Place them whole on
              a baking sheet lined with foil or directly on a grill rack.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Roast the Peppers
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Roast under a broiler or on a grill over medium-high heat, turning
              occasionally, until the skins are blackened and blistered all over,
              about 10-15 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Steam and Peel
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the hot peppers to a bowl and cover tightly with plastic
              wrap or a lid to steam for 15 minutes. Once cooled, peel off the
              charred skins, remove stems and seeds, and slice into strips.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Marinade
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, whisk together the extra virgin olive oil, minced garlic,
              chopped parsley and basil, red wine vinegar, lemon zest, salt,
              pepper, and optional crushed red pepper flakes and capers.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Marinate and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Toss the peeled pepper strips gently in the marinade. Let them sit
              for at least 30 minutes before serving to allow flavors to meld.
              Drizzle with a little extra olive oil before plating.
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
            Use a gas stove flame or grill for authentic smoky char marks and
            flavor, but a broiler works well too.
          </li>
          <li>
            Don’t rush peeling the peppers; steaming helps loosen the skin for
            easy removal without damaging the flesh.
          </li>
          <li>
            Adjust the garlic and herbs to your taste; fresh oregano or thyme
            also pair beautifully with roasted peppers.
          </li>
          <li>
            Serve chilled or at room temperature for best flavor and texture.
          </li>
          <li>
            Leftover peppers can be blended into sauces, dips, or spreads for
            versatile use.
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
