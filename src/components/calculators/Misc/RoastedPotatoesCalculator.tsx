import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RoastedPotatoesCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Roasted%20Potatoes%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1438"
  );

  // --- DATA ---
  const title = "Roasted Potatoes";
  const description = "Crispy potatoes roasted with rosemary, garlic, and olive oil.";

  // INGREDIENTS
  const ingredients = [
    { name: "Potatoes (Yukon Gold or Russet)", baseAmount: 500, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 3, unit: "tbsp" },
    { name: "Fresh Rosemary (chopped)", baseAmount: 2, unit: "tsp" },
    { name: "Garlic Cloves (minced)", baseAmount: 3, unit: "cloves" },
    { name: "Sea Salt", baseAmount: 1, unit: "tsp" },
    { name: "Freshly Ground Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Paprika (optional)", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh Parsley (chopped, for garnish)", baseAmount: 1, unit: "tbsp" },
    { name: "Lemon Zest (optional)", baseAmount: 1, unit: "tsp" },
    { name: "Onion Powder (optional)", baseAmount: 0.5, unit: "tsp" },
    { name: "Chili Flakes (optional)", baseAmount: 0.25, unit: "tsp" },
    { name: "Grated Parmesan Cheese (optional)", baseAmount: 2, unit: "tbsp" },
  ];

  // Nutrition per 4 servings approx.
  const nutrition = {
    calories: "320",
    protein: "6g",
    carbs: "50g",
    fat: "10g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of potatoes are best for roasting?",
      answer:
        "Starchy potatoes like Russet or all-purpose Yukon Gold potatoes are ideal for roasting because they develop a crispy exterior while remaining fluffy inside. Waxy potatoes tend to stay firm and may not crisp up as well.",
    },
    {
      question: "How do I ensure my roasted potatoes are crispy?",
      answer:
        "To achieve maximum crispiness, parboil the potatoes before roasting to remove excess starch, dry them thoroughly, and toss them in enough oil. Also, roasting at a high temperature (around 220°C/425°F) and turning them halfway through helps develop an even golden crust.",
    },
    {
      question: "Can I prepare roasted potatoes ahead of time?",
      answer:
        "Yes, you can parboil and season the potatoes a few hours ahead and keep them refrigerated. Roast them just before serving to maintain crispiness. Avoid roasting too far in advance as they may lose texture and flavor.",
    },
    {
      question: "What are some good seasoning variations for roasted potatoes?",
      answer:
        "Besides classic rosemary and garlic, you can experiment with thyme, smoked paprika, cumin, chili flakes, lemon zest, or parmesan cheese to add different flavor profiles to your roasted potatoes.",
    },
    {
      question: "How do I store and reheat leftover roasted potatoes?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days. Reheat in a hot oven or air fryer to restore crispiness rather than microwaving, which can make them soggy.",
    },
    {
      question: "Is it necessary to peel the potatoes before roasting?",
      answer:
        "Peeling is optional and depends on personal preference. Leaving the skin on adds texture, nutrients, and flavor, but make sure to wash and scrub the potatoes thoroughly if you keep the skin.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Roasted Potatoes"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 40m
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
            Roasted potatoes are a timeless classic, beloved for their crispy,
            golden exterior and fluffy interior. This recipe combines simple
            ingredients like fresh rosemary, garlic, and high-quality olive oil
            to elevate humble potatoes into a restaurant-quality side dish.
            Perfectly roasted potatoes complement a wide range of meals,
            offering comfort and flavor in every bite.
          </p>
          <p>
            The tradition of roasting potatoes dates back centuries and is
            rooted in European cuisine, particularly in Mediterranean and
            British cooking. Over time, variations have emerged worldwide,
            adapting to local herbs and spices. This recipe honors the classic
            approach while allowing room for customization to suit your taste.
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
              Prepare the Potatoes
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Wash and peel the potatoes if desired. Cut them into evenly sized
              chunks, about 2-3 cm pieces, to ensure uniform cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Parboil the Potatoes
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the potato chunks in a pot of salted boiling water and cook
              for 8-10 minutes until just tender but not falling apart. Drain
              well and let them steam dry for a few minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Toss with Oil and Seasonings
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the potatoes with olive oil, minced
              garlic, chopped rosemary, sea salt, black pepper, and any optional
              spices like paprika or onion powder. Toss gently to coat evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Roast the Potatoes
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spread the potatoes in a single layer on a baking sheet lined with
              parchment paper. Roast in a preheated oven at 220°C (425°F) for 35-40
              minutes, turning halfway through, until golden and crispy.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Garnish and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove from the oven and sprinkle with fresh parsley and optional
              lemon zest or grated parmesan. Serve immediately for best texture
              and flavor.
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
            Parboiling potatoes before roasting removes excess starch and helps
            create a fluffy interior with a crispy crust.
          </li>
          <li>
            Use a generous amount of olive oil to coat the potatoes evenly for
            optimal browning and flavor.
          </li>
          <li>
            Spread potatoes out on the baking sheet to avoid overcrowding, which
            can cause steaming instead of roasting.
          </li>
          <li>
            Toss the potatoes halfway through cooking to ensure even crisping on
            all sides.
          </li>
          <li>
            Experiment with herbs like thyme or spices such as smoked paprika to
            customize the flavor profile.
          </li>
          <li>
            For an extra crunch, sprinkle grated parmesan cheese during the last 5
            minutes of roasting.
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
              href="https://en.wikipedia.org/wiki/Roast_potato"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Roast Potato
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.bbcgoodfood.com/recipes/perfect-roast-potatoes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              BBC Good Food: Perfect Roast Potatoes
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