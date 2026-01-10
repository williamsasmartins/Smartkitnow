import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CannoliCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Cannoli%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6777"
  );

  // --- DATA ---
  const title = "Cannoli";
  const description = "Crispy pastry tubes filled with sweetened ricotta and candied fruit.";

  // INGREDIENTS
  const ingredients = [
    { name: "All-purpose flour", baseAmount: 250, unit: "g" },
    { name: "Granulated sugar", baseAmount: 30, unit: "g" },
    { name: "Unsalted butter, cold and diced", baseAmount: 50, unit: "g" },
    { name: "Egg yolk", baseAmount: 1, unit: "large" },
    { name: "Marsala wine", baseAmount: 60, unit: "ml" },
    { name: "Ricotta cheese, drained", baseAmount: 500, unit: "g" },
    { name: "Powdered sugar", baseAmount: 150, unit: "g" },
    { name: "Vanilla extract", baseAmount: 1, unit: "tsp" },
    { name: "Candied orange peel, chopped", baseAmount: 50, unit: "g" },
    { name: "Mini chocolate chips", baseAmount: 50, unit: "g" },
    { name: "Vegetable oil (for frying)", baseAmount: 1000, unit: "ml" },
    { name: "Powdered sugar (for dusting)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "450",
    protein: "10g",
    carbs: "50g",
    fat: "20g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (typeof base === "number"
      ? (base * (servings / 4)).toFixed(1).replace(/\.0$/, "")
      : base) ?? base;

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the best type of ricotta to use for cannoli filling?",
      answer:
        "For authentic cannoli, use fresh, whole-milk ricotta that has been well-drained to avoid a watery filling. You can drain ricotta by placing it in a fine mesh sieve lined with cheesecloth and refrigerating it for several hours or overnight. This ensures a creamy yet firm texture that holds well inside the pastry shells.",
    },
    {
      question: "Can I make cannoli shells without frying?",
      answer:
        "Yes, while traditional cannoli shells are deep-fried to achieve their signature crispiness, you can bake them as a healthier alternative. Baking requires shaping the dough around cannoli tubes and baking at a moderate temperature until golden and crisp. However, frying imparts a unique texture and flavor that baking cannot fully replicate.",
    },
    {
      question: "How do I prevent cannoli shells from becoming soggy?",
      answer:
        "To keep shells crisp, fill them just before serving. If you fill them too early, the moisture from the ricotta filling will soften the shells. Alternatively, you can lightly brush the inside of the shells with melted chocolate or egg white before filling to create a moisture barrier.",
    },
    {
      question: "What variations can I try for the cannoli filling?",
      answer:
        "Besides the classic sweetened ricotta with candied fruit and chocolate chips, you can experiment with mascarpone cheese, adding citrus zest, cinnamon, or even pistachios. Some recipes incorporate a bit of liqueur like Marsala or amaretto for added depth of flavor.",
    },
    {
      question: "How long can I store cannoli and their filling?",
      answer:
        "Unfilled cannoli shells can be stored in an airtight container at room temperature for up to a week. The ricotta filling should be refrigerated and is best used within 2-3 days. Always fill the shells just before serving to maintain optimal texture and freshness.",
    },
    {
      question: "Is Marsala wine essential in the dough?",
      answer:
        "Marsala wine adds a subtle sweetness and helps tenderize the dough, contributing to the authentic flavor of cannoli shells. If unavailable, you can substitute with dry white wine or a mixture of water and a teaspoon of vinegar, but the flavor profile will be slightly different.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Cannoli"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Cannoli are a classic Sicilian dessert featuring crispy, fried pastry tubes filled with a
            luscious, sweetened ricotta cheese mixture. This iconic Italian treat is beloved worldwide
            for its delightful contrast of textures and rich flavors. The shells are perfectly crunchy,
            while the filling is creamy and subtly sweet, often enhanced with candied fruit and chocolate
            chips.
          </p>
          <p>
            Originating from Sicily, cannoli have a rich history dating back to the Arab rule of the
            island in the 9th century, where fried dough and sweetened cheese desserts were popular.
            Traditionally enjoyed during Carnevale, these pastries have become a year-round favorite,
            symbolizing Italian culinary artistry and festive indulgence.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the all-purpose flour and granulated sugar. Add the cold diced
              butter and rub it into the flour with your fingertips until the mixture resembles coarse
              crumbs. Stir in the egg yolk and Marsala wine, mixing until a smooth dough forms. Wrap in
              plastic wrap and refrigerate for at least 1 hour.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Roll and Shape Shells</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Roll the dough out on a lightly floured surface to about 2-3 mm thickness. Cut into 10-12 cm
              circles. Wrap each circle around a cannoli tube, sealing the edge with a little water or egg
              white.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Fry the Shells</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a deep fryer or heavy pot to 180°C (350°F). Fry the wrapped dough tubes
              in batches until golden and crisp, about 2-3 minutes. Remove and drain on paper towels. Let
              cool completely before removing the metal tubes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Filling</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, combine the drained ricotta cheese, powdered sugar, and vanilla extract. Mix until
              smooth and creamy. Fold in the chopped candied orange peel and mini chocolate chips.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Fill and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Using a piping bag or spoon, fill the cooled cannoli shells with the ricotta mixture just before
              serving. Dust with powdered sugar and garnish with extra candied peel or chopped pistachios if
              desired.
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
            Ensure the ricotta is well-drained to prevent a watery filling that can soggy the shells.
          </li>
          <li>
            Fry the shells at the correct temperature (around 180°C/350°F) to achieve a crisp, golden
            texture without absorbing excess oil.
          </li>
          <li>
            Fill the cannoli shells just before serving to maintain their crispness and avoid sogginess.
          </li>
          <li>
            For a decorative touch, dip the ends of the filled cannoli in melted chocolate or chopped
            pistachios.
          </li>
          <li>
            If you don’t have cannoli tubes, you can fashion them from aluminum foil tightly rolled into
            tubes.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i} className="border-b pb-4 last:border-0">
              <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">{f.question}</h3>
              <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">{f.answer}</p>
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
