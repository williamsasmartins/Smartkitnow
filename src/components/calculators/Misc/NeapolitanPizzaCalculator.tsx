import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function NeapolitanPizzaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Neapolitan%20Pizza%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=947"
  );

  // --- DATA ---
  const title = "Neapolitan Pizza";
  const description = "Traditional thin-crust pizza with San Marzano tomatoes and mozzarella.";

  // INGREDIENTS
  const ingredients = [
    { name: "00 Flour", baseAmount: 500, unit: "g" },
    { name: "Water (lukewarm)", baseAmount: 325, unit: "ml" },
    { name: "Fresh Active Yeast", baseAmount: 3, unit: "g" },
    { name: "Sea Salt", baseAmount: 12, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 15, unit: "ml" },
    { name: "San Marzano Tomatoes (crushed)", baseAmount: 250, unit: "g" },
    { name: "Fresh Mozzarella di Bufala", baseAmount: 200, unit: "g" },
    { name: "Fresh Basil Leaves", baseAmount: 10, unit: "g" },
    { name: "Garlic Clove (optional)", baseAmount: 1, unit: "clove" },
    { name: "Grated Parmesan Cheese (optional)", baseAmount: 20, unit: "g" },
    { name: "Coarse Cornmeal (for dusting)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "280",
    protein: "12g",
    carbs: "35g",
    fat: "8g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes Neapolitan pizza dough unique?",
      answer:
        "Neapolitan pizza dough is characterized by its simple ingredients—00 flour, water, yeast, and salt—and a long fermentation process that develops flavor and texture. The dough is soft, elastic, and slightly chewy with a puffy, charred crust when baked at very high temperatures.",
    },
    {
      question: "Can I use regular mozzarella instead of Mozzarella di Bufala?",
      answer:
        "While fresh Mozzarella di Bufala is traditional and offers a creamy, tangy flavor, you can substitute it with high-quality fresh cow's milk mozzarella. Avoid pre-shredded mozzarella as it contains anti-caking agents that affect melting and texture.",
    },
    {
      question: "Why is San Marzano tomato preferred for the sauce?",
      answer:
        "San Marzano tomatoes are prized for their sweet flavor, low acidity, and thick flesh, making them ideal for pizza sauce. They provide a balanced, rich tomato taste that complements the other ingredients without overpowering them.",
    },
    {
      question: "How hot should my oven be for baking Neapolitan pizza?",
      answer:
        "Traditional Neapolitan pizza is baked in wood-fired ovens at temperatures between 430°C to 480°C (800°F to 900°F). Home ovens typically max out around 250°C to 300°C (480°F to 570°F), so preheat your oven fully and use a pizza stone or steel to mimic the intense heat for best results.",
    },
    {
      question: "Can I prepare the dough in advance?",
      answer:
        "Yes, preparing the dough in advance and allowing it to ferment slowly in the refrigerator for 24 to 48 hours enhances flavor and texture. Just bring it back to room temperature before shaping and baking.",
    },
    {
      question: "What is the best way to shape Neapolitan pizza dough?",
      answer:
        "Neapolitan pizza dough is traditionally hand-stretched by gently pressing and stretching from the center outward, leaving a thicker edge for the crust. Avoid using a rolling pin to preserve the dough's air bubbles and texture.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Neapolitan Pizza"
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
            Neapolitan pizza is a culinary masterpiece originating from Naples,
            Italy. Renowned for its thin, soft crust with a slightly charred
            edge, this pizza is crafted using simple, high-quality ingredients
            like 00 flour, San Marzano tomatoes, fresh mozzarella, and fresh
            basil. The dough undergoes a slow fermentation process, resulting in
            a tender yet chewy base that perfectly balances the fresh toppings.
          </p>
          <p>
            Historically, Neapolitan pizza emerged in the late 18th century as a
            humble street food for working-class Neapolitans. Its popularity
            soared worldwide, becoming a symbol of Italian culinary tradition.
            The Associazione Verace Pizza Napoletana (True Neapolitan Pizza
            Association) now protects the authentic preparation methods,
            ensuring this iconic dish remains true to its roots.
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
              Prepare the Dough
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Dissolve the fresh yeast in lukewarm water. In a large bowl,
              combine the 00 flour and sea salt. Gradually add the yeast water
              and mix until a sticky dough forms. Add olive oil and knead on a
              floured surface for about 10 minutes until smooth and elastic.
              Place the dough in a lightly oiled bowl, cover with a damp cloth,
              and let it rise for 2 hours at room temperature.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Divide and Rest
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Once risen, punch down the dough and divide it into 4 equal balls.
              Place them on a floured tray, cover, and let rest for another hour
              to develop flavor and elasticity.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Sauce and Toppings
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Crush the San Marzano tomatoes by hand or blend lightly. Tear the
              fresh mozzarella into small pieces and wash the basil leaves.
              Optionally, mince the garlic for added aroma.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shape the Dough
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              On a floured surface, gently stretch each dough ball by hand,
              pressing from the center outward to form a 10-12 inch circle,
              leaving a slightly thicker edge for the crust. Avoid using a
              rolling pin to preserve air bubbles.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble and Bake
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to its highest setting with a pizza stone or
              steel inside. Dust a pizza peel with coarse cornmeal and place the
              dough on it. Spread a thin layer of tomato sauce, add mozzarella,
              basil leaves, and a drizzle of olive oil. Slide the pizza onto the
              hot stone and bake for 7-10 minutes until the crust is puffed and
              charred, and cheese melted.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Enjoy
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the pizza from the oven, optionally sprinkle with grated
              Parmesan and a little extra fresh basil. Slice and serve
              immediately to enjoy the authentic Neapolitan experience.
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
            Use 00 flour for the best texture; it’s finely milled and has a lower
            protein content than bread flour.
          </li>
          <li>
            Let the dough ferment slowly in the fridge overnight for enhanced
            flavor and digestibility.
          </li>
          <li>
            Preheat your pizza stone or steel for at least 45 minutes to mimic
            wood-fired oven heat.
          </li>
          <li>
            Stretch the dough gently by hand to preserve air bubbles that create
            the characteristic light crust.
          </li>
          <li>
            Avoid overloading the pizza with toppings to keep the crust crisp and
            light.
          </li>
          <li>
            If you don’t have San Marzano tomatoes, use high-quality canned
            plum tomatoes as a substitute.
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