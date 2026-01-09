import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MarinaraPizzaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Marinara%20Pizza%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5314"
  );

  // --- DATA ---
  const title = "Marinara Pizza";
  const description = "Simple vegan pizza with tomato sauce, garlic, and oregano.";

  // INGREDIENTS
  const ingredients = [
    { name: "Pizza Dough", baseAmount: 250, unit: "g" },
    { name: "Canned San Marzano Tomatoes", baseAmount: 180, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 15, unit: "ml" },
    { name: "Garlic Cloves (minced)", baseAmount: 3, unit: "pcs" },
    { name: "Fresh Oregano Leaves", baseAmount: 5, unit: "g" },
    { name: "Sea Salt", baseAmount: 3, unit: "g" },
    { name: "Fresh Basil Leaves", baseAmount: 6, unit: "g" },
    { name: "Black Pepper (freshly ground)", baseAmount: 1, unit: "g" },
    { name: "Capers (optional)", baseAmount: 10, unit: "g" },
    { name: "Red Chili Flakes (optional)", baseAmount: 1, unit: "g" },
    { name: "Water (for dough)", baseAmount: 150, unit: "ml" },
    { name: "Active Dry Yeast", baseAmount: 3, unit: "g" },
    { name: "Sugar", baseAmount: 2, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "280",
    protein: "7g",
    carbs: "45g",
    fat: "6g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes Marinara Pizza different from other pizzas?",
      answer:
        "Marinara Pizza is distinctively simple and vegan, featuring a thin crust topped with a flavorful tomato sauce, garlic, oregano, and olive oil. Unlike other pizzas, it contains no cheese or meat, highlighting the quality of its few ingredients.",
    },
    {
      question: "Can I use fresh tomatoes instead of canned San Marzano tomatoes?",
      answer:
        "Yes, fresh ripe tomatoes can be used, but canned San Marzano tomatoes are preferred for their consistent sweetness and acidity, which create a balanced sauce. If using fresh tomatoes, peel and seed them before blending for the best texture.",
    },
    {
      question: "How do I achieve a crispy crust at home?",
      answer:
        "To get a crispy crust, use a pizza stone or steel preheated in a very hot oven (250°C/480°F or higher). Stretch the dough thinly and bake quickly to avoid sogginess. Also, avoid overloading the pizza with sauce or toppings.",
    },
    {
      question: "Is Marinara Pizza suitable for gluten-free diets?",
      answer:
        "Traditional Marinara Pizza uses wheat-based dough, which contains gluten. However, you can substitute with a gluten-free pizza dough recipe to make it suitable for gluten-free diets.",
    },
    {
      question: "How long can I store leftover Marinara Pizza?",
      answer:
        "Leftover Marinara Pizza can be stored in an airtight container in the refrigerator for up to 2 days. Reheat in a hot oven or skillet to restore crispiness. Avoid microwaving as it can make the crust soggy.",
    },
    {
      question: "Can I add cheese or other toppings to Marinara Pizza?",
      answer:
        "While traditional Marinara Pizza is vegan and cheese-free, you can customize it by adding toppings like fresh basil, olives, or vegan cheese according to your preference.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Marinara Pizza"
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
            Marinara Pizza is a classic Italian pizza known for its simplicity and
            bold flavors. Originating from Naples, this pizza is traditionally made
            without cheese, focusing on a vibrant tomato sauce infused with garlic,
            oregano, and olive oil atop a thin, crispy crust. It's a perfect choice
            for vegans and those who appreciate the essence of pure, fresh
            ingredients.
          </p>
          <p>
            Historically, Marinara Pizza was favored by sailors ("marinai" in Italian)
            because its ingredients were easy to preserve on long sea voyages. Over
            time, it has become a beloved staple in Italian cuisine, celebrated for
            its rustic charm and straightforward preparation.
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
              In a bowl, dissolve the active dry yeast and sugar in warm water. Let
              it sit for 5-10 minutes until frothy. Add the flour and salt, then mix
              until a dough forms. Knead on a floured surface for about 10 minutes
              until smooth and elastic. Place in a lightly oiled bowl, cover, and let
              rise for 1-2 hours until doubled in size.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Make the Tomato Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Blend the canned San Marzano tomatoes with minced garlic, fresh oregano,
              sea salt, black pepper, and a splash of olive oil until smooth. Adjust
              seasoning to taste. Let the sauce rest for 15 minutes to develop
              flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Preheat the Oven
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place a pizza stone or baking steel in the oven and preheat to the
              highest temperature (250°C/480°F or above) for at least 45 minutes to
              ensure a hot surface.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shape and Top the Pizza
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Punch down the risen dough and stretch it into a thin round on a floured
              surface. Transfer to a pizza peel dusted with semolina or flour. Spread
              an even layer of tomato sauce over the dough, drizzle with olive oil,
              and scatter fresh basil leaves. Optionally, add capers or chili flakes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slide the pizza onto the preheated stone and bake for 8-10 minutes or
              until the crust is golden and crisp. Remove from the oven, drizzle with
              a little more olive oil if desired, slice, and serve immediately.
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
            Use high-quality canned San Marzano tomatoes for an authentic and rich
            tomato sauce flavor.
          </li>
          <li>
            Let the dough rest overnight in the refrigerator for improved flavor and
            texture.
          </li>
          <li>
            Avoid overloading the pizza with sauce to keep the crust crispy and
            prevent sogginess.
          </li>
          <li>
            Fresh oregano and basil are key to achieving the classic aromatic profile
            of Marinara Pizza.
          </li>
          <li>
            If you don't have a pizza stone, use an inverted baking sheet preheated
            in the oven as a substitute.
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