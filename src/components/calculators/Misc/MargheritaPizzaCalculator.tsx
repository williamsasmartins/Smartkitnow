import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MargheritaPizzaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Margherita%20Pizza%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2472"
  );

  // --- DATA ---
  const title = "Margherita Pizza";
  const description = "Classic pizza with tomato, mozzarella, basil, and olive oil.";

  // INGREDIENTS
  const ingredients = [
    { name: "All-purpose flour", baseAmount: 500, unit: "g" },
    { name: "Warm water", baseAmount: 325, unit: "ml" },
    { name: "Active dry yeast", baseAmount: 7, unit: "g" },
    { name: "Salt", baseAmount: 10, unit: "g" },
    { name: "Extra virgin olive oil", baseAmount: 30, unit: "ml" },
    { name: "San Marzano tomatoes (crushed)", baseAmount: 400, unit: "g" },
    { name: "Fresh mozzarella cheese", baseAmount: 250, unit: "g" },
    { name: "Fresh basil leaves", baseAmount: 15, unit: "g" },
    { name: "Granulated sugar", baseAmount: 5, unit: "g" },
    { name: "Garlic (minced)", baseAmount: 2, unit: "g" },
    { name: "Sea salt (for sauce)", baseAmount: 3, unit: "g" },
    { name: "Black pepper (freshly ground)", baseAmount: 1, unit: "g" },
    { name: "Cornmeal (for dusting)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "14g",
    carbs: "40g",
    fat: "10g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of flour is best for Margherita pizza dough?",
      answer:
        "For authentic Margherita pizza, use high-protein all-purpose flour or Italian '00' flour if available. '00' flour is finely milled and produces a tender yet chewy crust with excellent elasticity.",
    },
    {
      question: "Can I use fresh tomatoes instead of canned San Marzano tomatoes?",
      answer:
        "Yes, you can use fresh ripe tomatoes, but San Marzano canned tomatoes are preferred for their balanced sweetness and low acidity. If using fresh tomatoes, peel and crush them, then cook briefly to reduce excess moisture.",
    },
    {
      question: "How do I achieve a crispy crust at home without a pizza oven?",
      answer:
        "Preheat your oven to its highest temperature (usually 250-280°C / 480-550°F) and use a pizza stone or steel to mimic the intense heat of a pizza oven. Bake the pizza directly on the hot stone for 7-10 minutes to get a crispy crust.",
    },
    {
      question: "Can I prepare the dough in advance?",
      answer:
        "Absolutely! Preparing the dough a day ahead and allowing it to ferment slowly in the refrigerator enhances flavor and texture. Just bring it to room temperature before shaping and baking.",
    },
    {
      question: "What is the best way to store leftover Margherita pizza?",
      answer:
        "Store leftover pizza in an airtight container or wrapped tightly in foil in the refrigerator for up to 2 days. Reheat in a hot oven or skillet to restore crispiness rather than using a microwave.",
    },
    {
      question: "Is fresh mozzarella better than low-moisture mozzarella for this recipe?",
      answer:
        "Fresh mozzarella is preferred for Margherita pizza due to its creamy texture and delicate flavor. However, it contains more moisture, so slice it thinly and pat dry to avoid soggy crusts. Low-moisture mozzarella melts well but lacks the fresh taste.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Margherita Pizza"
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
            The Margherita pizza is a timeless classic originating from Naples,
            Italy. Known for its simple yet vibrant combination of fresh
            ingredients—ripe tomatoes, creamy mozzarella, fragrant basil, and
            quality olive oil—this pizza celebrates the colors of the Italian
            flag. Its thin, chewy crust and balanced flavors make it a favorite
            worldwide, embodying the essence of Italian culinary tradition.
          </p>
          <p>
            Legend has it that the pizza was named in honor of Queen Margherita
            of Savoy during her visit to Naples in 1889. Chef Raffaele Esposito
            created this pizza to represent the Italian flag with red tomato,
            white mozzarella, and green basil. Since then, it has become a
            symbol of authentic Italian pizza, inspiring countless variations
            and adaptations globally.
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
              In a large bowl, dissolve the active dry yeast and sugar in warm
              water. Let it sit for 5-10 minutes until frothy. Add the flour,
              salt, and olive oil, mixing until a sticky dough forms. Knead on a
              floured surface for about 10 minutes until smooth and elastic.
              Place the dough in a lightly oiled bowl, cover, and let it rise
              for 1-2 hours until doubled in size.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, combine crushed San Marzano tomatoes, minced garlic,
              salt, pepper, and a drizzle of olive oil. Stir gently to blend
              flavors. No cooking is necessary; the sauce should be fresh and
              vibrant.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shape the Dough
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Once risen, punch down the dough and divide it into equal portions
              based on servings. On a floured surface or a board dusted with
              cornmeal, stretch each dough ball into a 10-12 inch round,
              maintaining a slightly thicker edge for the crust.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Pizza
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spread a thin layer of tomato sauce evenly over the dough,
              leaving the edges free. Tear fresh mozzarella into small pieces
              and distribute evenly on top. Add fresh basil leaves and drizzle
              with olive oil.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake the Pizza
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to the highest temperature with a pizza stone
              inside. Transfer the pizza onto the hot stone and bake for 7-10
              minutes until the crust is golden and cheese is bubbling and
              slightly browned.
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
              Remove the pizza from the oven, add a few fresh basil leaves for
              garnish, and drizzle with a little more olive oil if desired.
              Slice and serve immediately for the best flavor and texture.
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
            Use a pizza stone or steel preheated in the oven to mimic the high
            heat of traditional pizza ovens for a crispier crust.
          </li>
          <li>
            Let the dough ferment slowly in the refrigerator overnight to
            develop deeper flavor and better texture.
          </li>
          <li>
            Pat fresh mozzarella dry with paper towels to reduce moisture and
            prevent soggy pizza.
          </li>
          <li>
            Avoid overloading the pizza with sauce or cheese to maintain a
            balanced, light texture.
          </li>
          <li>
            Fresh basil should be added after baking or in the last minute of
            cooking to preserve its vibrant flavor and color.
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