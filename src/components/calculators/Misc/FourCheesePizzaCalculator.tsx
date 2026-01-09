import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FourCheesePizzaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Four%20Cheese%20Pizza%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9886"
  );

  // --- DATA ---
  const title = "Four Cheese Pizza";
  const description = "Pizza topped with mozzarella, Gorgonzola, fontina, and Parmesan.";

  // INGREDIENTS
  const ingredients = [
    { name: "Pizza Dough", baseAmount: 500, unit: "g" },
    { name: "Mozzarella Cheese", baseAmount: 150, unit: "g" },
    { name: "Gorgonzola Cheese", baseAmount: 100, unit: "g" },
    { name: "Fontina Cheese", baseAmount: 100, unit: "g" },
    { name: "Parmesan Cheese (grated)", baseAmount: 50, unit: "g" },
    { name: "Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Garlic (minced)", baseAmount: 1, unit: "clove" },
    { name: "Fresh Basil Leaves", baseAmount: 10, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "Cornmeal (for dusting)", baseAmount: 1, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "22g",
    carbs: "38g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What types of cheese are best for a four cheese pizza?",
      answer:
        "The classic four cheese pizza uses mozzarella for its meltiness, Gorgonzola for a sharp tang, fontina for creaminess, and Parmesan for a nutty, salty finish. These cheeses complement each other to create a rich and balanced flavor profile.",
    },
    {
      question: "Can I substitute any of the cheeses?",
      answer:
        "Yes, you can substitute cheeses based on availability or preference. For example, you might use provolone instead of fontina or asiago instead of Parmesan. Just keep in mind the balance of flavors and melting properties to maintain the pizza's texture and taste.",
    },
    {
      question: "How do I prevent the pizza dough from becoming soggy?",
      answer:
        "To avoid soggy dough, ensure your dough is well-prepared and preheated your oven to a high temperature (around 250°C/480°F). Using a pizza stone or steel helps achieve a crispy crust. Also, avoid overloading the pizza with wet ingredients and use a light hand with olive oil.",
    },
    {
      question: "What is the best way to bake this pizza at home?",
      answer:
        "Preheat your oven to its highest setting with a pizza stone or steel inside for at least 30 minutes. Assemble the pizza on a peel dusted with cornmeal, then slide it onto the hot stone. Bake for 8-12 minutes until the crust is golden and cheese is bubbling and slightly browned.",
    },
    {
      question: "Can I prepare the dough in advance?",
      answer:
        "Absolutely! Preparing the dough a day ahead allows for better fermentation and flavor development. Store it tightly wrapped in the refrigerator and bring it to room temperature before shaping and baking.",
    },
    {
      question: "How should leftover pizza be stored and reheated?",
      answer:
        "Store leftover pizza in an airtight container in the refrigerator for up to 2 days. Reheat in a hot skillet or oven to preserve the crust's crispiness rather than using a microwave, which can make it soggy.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Four Cheese Pizza"
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
            Four Cheese Pizza, or "Quattro Formaggi," is a beloved Italian classic that
            celebrates the rich, creamy, and complex flavors of four distinct cheeses
            harmoniously melted atop a crisp, thin crust. This pizza is a perfect
            indulgence for cheese lovers, offering a luscious texture and a savory
            depth that is both comforting and sophisticated.
          </p>
          <p>
            Originating from Italy, the quattro formaggi pizza has roots in traditional
            Italian cuisine where regional cheeses are combined to create unique flavor
            profiles. The blend typically includes mozzarella for its meltability,
            Gorgonzola for a sharp bite, fontina for creaminess, and Parmesan for a
            nutty finish. This recipe honors that tradition while providing a simple,
            approachable method for home cooks to recreate this gourmet favorite.
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
              If using store-bought dough, bring it to room temperature. If making from
              scratch, prepare your dough at least 2 hours ahead or the day before for
              best results. Lightly dust your work surface with flour and roll out the
              dough into a 12-inch circle.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Preheat Oven and Prepare Surface
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 250°C (480°F) or the highest setting. Place a pizza
              stone or steel inside to heat for at least 30 minutes. Dust a pizza peel
              or baking sheet with cornmeal to prevent sticking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Pizza
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Brush the dough lightly with olive oil and minced garlic. Evenly distribute
              the shredded mozzarella, crumbled Gorgonzola, diced fontina, and grated
              Parmesan over the surface. Season with salt and freshly ground black
              pepper. Scatter fresh basil leaves on top.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake the Pizza
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the pizza onto the preheated stone or steel using the peel. Bake
              for 8-12 minutes until the crust is golden and cheese is melted and bubbly
              with slight browning.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Enjoy
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the pizza from the oven and let it rest for a couple of minutes.
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
            Use a blend of whole milk and low-moisture mozzarella for optimal melt and
            flavor.
          </li>
          <li>
            Let the dough ferment slowly in the refrigerator overnight to develop more
            complex flavors.
          </li>
          <li>
            If you don't have a pizza stone, use an inverted baking sheet preheated in
            the oven to mimic the effect.
          </li>
          <li>
            Adding a light drizzle of high-quality olive oil right before serving
            enhances richness and aroma.
          </li>
          <li>
            Fresh basil can be added after baking to preserve its bright flavor and
            color.
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