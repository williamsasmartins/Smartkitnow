import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChilesRellenosCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chile%20Rellenos%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6825"
  );

  // --- DATA ---
  const title = "Chile Rellenos";
  const description =
    "Pimentas recheadas (geralmente com queijo), empanadas e servidas com molho.";

  // INGREDIENTS
  const ingredients = [
    { name: "Poblano Peppers", baseAmount: 8, unit: "large" },
    { name: "Queso Fresco or Monterey Jack Cheese", baseAmount: 400, unit: "g" },
    { name: "Eggs (separated)", baseAmount: 4, unit: "large" },
    { name: "All-purpose Flour", baseAmount: 120, unit: "g" },
    { name: "Vegetable Oil (for frying)", baseAmount: 500, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Garlic Cloves (minced)", baseAmount: 2, unit: "cloves" },
    { name: "Onion (chopped)", baseAmount: 1, unit: "medium" },
    { name: "Tomato Sauce", baseAmount: 400, unit: "ml" },
    { name: "Ground Cumin", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh Cilantro (chopped)", baseAmount: 2, unit: "tbsp" },
    { name: "Lime Wedges (for serving)", baseAmount: 4, unit: "wedges" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "22g",
    carbs: "18g",
    fat: "30g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of peppers are best for Chile Rellenos?",
      answer:
        "Poblano peppers are traditionally used for Chile Rellenos due to their mild heat and large size, which makes them ideal for stuffing. They have a thick flesh that holds up well during frying. If poblanos are unavailable, you can substitute with Anaheim or other mild green chilies.",
    },
    {
      question: "How do I prevent the peppers from breaking while frying?",
      answer:
        "To prevent the peppers from breaking, make sure to dry them thoroughly after roasting and peeling. When battering, use a light egg batter and fry in hot oil to quickly set the coating. Avoid overcrowding the pan and flip gently with a slotted spatula.",
    },
    {
      question: "Can I prepare Chile Rellenos ahead of time?",
      answer:
        "Yes, you can prepare the stuffed peppers and keep them refrigerated for a few hours before frying. However, for best texture and flavor, fry them just before serving. The batter tends to lose its crispness if fried too far in advance.",
    },
    {
      question: "What are some common fillings besides cheese?",
      answer:
        "Besides cheese, common fillings include picadillo (a seasoned ground meat mixture), refried beans, or a combination of vegetables. However, cheese remains the most popular and traditional filling for Chile Rellenos.",
    },
    {
      question: "How should I serve Chile Rellenos?",
      answer:
        "Chile Rellenos are typically served hot, topped with a fresh tomato sauce or salsa, and garnished with chopped cilantro and lime wedges. They pair well with Mexican rice, refried beans, or a simple green salad.",
    },
    {
      question: "Is there a gluten-free way to make Chile Rellenos?",
      answer:
        "Yes, you can substitute all-purpose flour with gluten-free flour blends or cornstarch for dusting the peppers before battering. Ensure the batter ingredients are gluten-free as well. Frying technique remains the same.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Chile Rellenos"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 25m | Cook: 15m
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
            Chile Rellenos is a classic Mexican dish featuring roasted poblano
            peppers stuffed with cheese or meat, battered in a fluffy egg
            coating, and fried to golden perfection. This dish is beloved for
            its rich flavors and satisfying textures, combining the smoky
            pepper with creamy, melted cheese and a crisp exterior. It is often
            served with a fresh tomato sauce that balances the richness with
            acidity.
          </p>
          <p>
            The origins of Chile Rellenos trace back to colonial Mexico, where
            indigenous ingredients met Spanish culinary techniques. The name
            literally means "stuffed chili," and the dish has evolved with
            regional variations across Mexico and beyond. Traditionally,
            poblano peppers are used due to their mild heat and size, making
            them perfect for stuffing. Over time, Chile Rellenos has become a
            staple in Mexican cuisine, celebrated for its comforting and
            festive qualities.
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
              Roast and Peel the Peppers
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Char the poblano peppers over an open flame or under a broiler,
              turning until the skin is blackened and blistered all over. Place
              them in a sealed plastic bag or covered bowl to steam for 15
              minutes. Peel off the charred skin carefully, keeping the peppers
              intact. Make a small slit down one side and remove the seeds and
              membranes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Filling
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stuff each pepper generously with crumbled queso fresco or
              shredded Monterey Jack cheese. Be careful not to overfill to
              prevent tearing. Set aside the stuffed peppers on a plate.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Make the Batter
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Separate the eggs. Beat the egg whites with a pinch of salt until
              stiff peaks form. In a separate bowl, lightly beat the yolks. Gently
              fold the yolks into the whites to create a fluffy batter.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Coat and Fry the Peppers
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Lightly dust each stuffed pepper with flour, shaking off excess.
              Dip into the egg batter, coating evenly. Heat vegetable oil in a
              large skillet over medium-high heat. Fry the peppers until golden
              brown on all sides, about 3-4 minutes per side. Drain on paper
              towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Sauce and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a saucepan, sauté chopped onion and garlic until translucent.
              Add tomato sauce, ground cumin, salt, and pepper. Simmer for 10
              minutes. Spoon the sauce over the fried peppers. Garnish with
              chopped cilantro and serve with lime wedges.
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
            Roast the peppers until the skin is evenly charred for easy peeling
            and smoky flavor.
          </li>
          <li>
            Use fresh cheese that melts well, like Monterey Jack, for a creamy
            filling.
          </li>
          <li>
            Whip the egg whites to stiff peaks to create a light, airy batter
            that crisps beautifully.
          </li>
          <li>
            Fry in hot oil and avoid overcrowding the pan to maintain oil
            temperature and crispiness.
          </li>
          <li>
            Serve immediately after frying to enjoy the best texture and flavor.
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
              href="https://en.wikipedia.org/wiki/Chile_relleno"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Chile Relleno
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/chile-relleno-recipe-2342823"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Authentic Chile Relleno Recipe
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