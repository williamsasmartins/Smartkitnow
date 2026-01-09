import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CiabattaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Ciabatta%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1701"
  );

  // --- DATA ---
  const title = "Ciabatta";
  const description = "Rustic Italian bread with open crumb and crisp crust.";

  // INGREDIENTS
  const ingredients = [
    { name: "Bread Flour", baseAmount: 500, unit: "g" },
    { name: "Water (room temperature)", baseAmount: 400, unit: "ml" },
    { name: "Active Dry Yeast", baseAmount: 7, unit: "g" },
    { name: "Salt", baseAmount: 10, unit: "g" },
    { name: "Olive Oil", baseAmount: 30, unit: "ml" },
    { name: "Sugar", baseAmount: 5, unit: "g" },
    { name: "Optional: Bread Improver", baseAmount: 2, unit: "g" },
    { name: "Semolina Flour (for dusting)", baseAmount: 20, unit: "g" },
    { name: "Cornmeal (for dusting)", baseAmount: 10, unit: "g" },
    { name: "Water for steaming oven", baseAmount: 50, unit: "ml" },
  ];

  // Nutrition per 4 servings (approximate)
  const nutrition = {
    calories: "320",
    protein: "10g",
    carbs: "65g",
    fat: "4g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes ciabatta bread different from other breads?",
      answer:
        "Ciabatta is distinguished by its rustic, elongated shape, open crumb structure with large holes, and a crisp, chewy crust. This texture is achieved by using a high hydration dough and a long fermentation process, which develops flavor and the characteristic airy interior.",
    },
    {
      question: "How important is the hydration level in ciabatta dough?",
      answer:
        "Hydration is critical for ciabatta’s signature open crumb and chewy texture. Typically, ciabatta dough has a hydration level of around 75-80%, meaning it contains a high proportion of water relative to flour. This wet dough requires gentle handling and proper fermentation to develop gluten and structure.",
    },
    {
      question: "Can I use instant yeast instead of active dry yeast?",
      answer:
        "Yes, instant yeast can be used as a substitute. Use about 25% less instant yeast than active dry yeast since it is more concentrated. Also, instant yeast can be mixed directly with the flour without proofing, which can simplify the process.",
    },
    {
      question: "Why do I need to dust the baking surface with semolina or cornmeal?",
      answer:
        "Dusting with semolina or cornmeal prevents the sticky, high-hydration dough from adhering to the baking surface or peel. It also adds a subtle texture and slight crunch to the bottom crust of the bread.",
    },
    {
      question: "How do I achieve a crispy crust when baking ciabatta?",
      answer:
        "To get a crispy crust, bake the bread in a very hot oven (around 230°C/450°F) with steam during the first 10 minutes. The steam keeps the crust moist initially, allowing it to expand fully before hardening, resulting in a crisp, crackly crust.",
    },
    {
      question: "Can I make ciabatta dough ahead of time?",
      answer:
        "Yes, ciabatta dough benefits from slow fermentation. You can prepare the dough and refrigerate it overnight for a cold ferment, which enhances flavor and texture. Just bring it back to room temperature before shaping and baking.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Ciabatta"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 25m
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
            Ciabatta is a classic Italian white bread known for its rustic
            appearance, open crumb, and crisp crust. Originating in the northern
            regions of Italy in the early 1980s, it was created as a response to
            the popularity of French baguettes, offering a softer, airier
            alternative that pairs perfectly with olive oil, cheeses, and cured
            meats. The dough’s high hydration and long fermentation produce its
            signature texture and flavor, making it a favorite among bakers and
            bread lovers worldwide.
          </p>
          <p>
            The name "ciabatta" means "slipper" in Italian, inspired by the bread’s
            flat, elongated shape resembling a slipper. Its creation is credited to
            Arnaldo Cavallari, a baker from Verona, who developed the recipe in
            1982. Since then, ciabatta has become a staple in Italian cuisine and
            beyond, celebrated for its versatility and delightful texture.
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
              Prepare the Sponge (Biga)
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, mix 150g of bread flour, 150ml water, and 2g active
              dry yeast until combined. Cover and let ferment at room temperature
              for 12-16 hours until bubbly and doubled in size. This sponge
              develops flavor and improves dough structure.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Mix the Dough
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the remaining 350g bread flour, 250ml water, salt, sugar, olive
              oil, and yeast to the sponge. Mix gently until all ingredients are
              incorporated. The dough will be very sticky and wet; this is normal
              for ciabatta.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bulk Fermentation and Stretch & Fold
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cover the dough and let it ferment for 1 hour at room temperature.
              Every 20 minutes, perform a gentle stretch and fold to develop gluten
              structure. After the final fold, let the dough rest until doubled in
              size, about 1-2 hours.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shape the Loaves
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Lightly flour your work surface with semolina or cornmeal. Gently
              transfer the dough onto it without deflating too much. Divide into
              two equal pieces and shape each into a rough rectangle or slipper
              shape. Place on a parchment-lined baking tray dusted with semolina.
              Cover and proof for 45-60 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake with Steam
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 230°C (450°F) with a baking stone or steel
              inside. Place a shallow pan with water at the bottom to create steam.
              Slide the loaves onto the hot stone and bake for 10 minutes with
              steam, then remove the water pan and bake for another 15 minutes or
              until golden brown and crusty.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cool and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the ciabatta from the oven and cool on a wire rack for at least
              30 minutes before slicing. This resting time allows the crumb to set
              and flavors to develop fully. Enjoy fresh with olive oil, cheese, or
              your favorite toppings.
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
            Use a high-protein bread flour for better gluten development and
            structure.
          </li>
          <li>
            Handle the dough gently to preserve the air bubbles that create the
            open crumb.
          </li>
          <li>
            If you don’t have a baking stone, use an inverted heavy baking sheet
            preheated in the oven.
          </li>
          <li>
            For extra flavor, try a cold overnight fermentation in the fridge.
            Just bring the dough back to room temperature before shaping.
          </li>
          <li>
            Creating steam in the oven is essential for a crisp crust; use a pan
            with hot water or spray water inside the oven before baking.
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