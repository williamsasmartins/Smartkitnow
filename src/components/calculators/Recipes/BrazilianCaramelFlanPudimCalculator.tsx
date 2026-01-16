import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BrazilianCaramelFlanPudimCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Caramel%20Flan%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9195"
  );

  // --- DATA ---
  const title = "Brazilian Caramel Flan";
  const description = "Silky condensed milk custard with golden caramel sauce.";

  // INGREDIENTS
  const ingredients = [
    { name: "Sweetened Condensed Milk", baseAmount: 395, unit: "g" }, // 1 can
    { name: "Whole Milk", baseAmount: 500, unit: "ml" },
    { name: "Large Eggs", baseAmount: 4, unit: "pcs" },
    { name: "Granulated Sugar (for caramel)", baseAmount: 150, unit: "g" },
    { name: "Water (for caramel)", baseAmount: 60, unit: "ml" },
    { name: "Vanilla Extract", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1 / 4, unit: "tsp" },
    { name: "Lemon Juice (optional, for caramel)", baseAmount: 1, unit: "tsp" },
    { name: "Butter (for greasing mold)", baseAmount: 1, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "9g",
    carbs: "45g",
    fat: "8g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Pudim and how is it different from other flans?",
      answer:
        "Pudim is the Brazilian version of caramel flan, characterized by its silky texture and use of sweetened condensed milk which gives it a richer, creamier flavor compared to traditional flans. It is typically baked in a water bath to ensure a smooth custard.",
    },
    {
      question: "How do I prevent the caramel from hardening too much?",
      answer:
        "When making caramel, cook the sugar and water until it reaches a deep amber color, then immediately pour it into the mold and swirl to coat evenly. Adding a small amount of lemon juice helps prevent crystallization. Avoid stirring once the sugar dissolves to keep the caramel smooth.",
    },
    {
      question: "Can I make Pudim without a water bath?",
      answer:
        "While a water bath (bain-marie) is recommended to ensure gentle, even cooking and prevent cracking, you can bake Pudim without it by using a lower oven temperature and covering the mold with foil. However, the texture might be less silky and more prone to curdling.",
    },
    {
      question: "How long can I store Brazilian Caramel Flan?",
      answer:
        "Pudim can be stored covered in the refrigerator for up to 4 days. Ensure it is well covered to prevent it from absorbing other odors. For best texture and flavor, consume within 2 days.",
    },
    {
      question: "Can I substitute whole milk with other types of milk?",
      answer:
        "Yes, you can substitute whole milk with evaporated milk for a richer custard or use plant-based milks like coconut milk for a dairy-free version. Keep in mind that substitutions may alter the texture and flavor slightly.",
    },
    {
      question: "How do I unmold the Pudim without breaking it?",
      answer:
        "Run a thin knife or spatula gently around the edges of the mold to loosen the custard. Warm the bottom of the mold briefly by dipping it in warm water to help release the caramel. Then invert onto a serving plate carefully.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Caramel Flan"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 50m
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
            Brazilian Caramel Flan, known locally as Pudim, is a beloved dessert
            that combines the rich sweetness of sweetened condensed milk with a
            luscious caramel sauce. This silky custard is a staple in Brazilian
            households and celebrations, cherished for its smooth texture and
            perfectly balanced sweetness.
          </p>
          <p>
            The origins of Pudim trace back to Portuguese culinary traditions,
            which were adapted in Brazil using local ingredients and tastes.
            The use of sweetened condensed milk became popular in Brazil due to
            its availability and long shelf life, making Pudim a convenient yet
            indulgent dessert. Over time, it has become a symbol of Brazilian
            comfort food and hospitality.
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
              Prepare the Caramel
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a medium saucepan, combine granulated sugar and water over
              medium heat. Without stirring, let the sugar dissolve and cook
              until it turns a deep amber color. Add lemon juice to prevent
              crystallization. Quickly pour the caramel into a bundt or flan
              mold, swirling to coat the bottom evenly. Set aside to cool and
              harden.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Make the Custard
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, whisk together the sweetened condensed milk,
              whole milk, eggs, vanilla extract, and salt until smooth and
              fully combined. Strain the mixture through a fine sieve to ensure
              a silky texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble and Bake
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 160°C (320°F). Pour the custard mixture over
              the set caramel in the mold. Place the mold inside a larger
              baking dish and fill the outer dish with hot water halfway up the
              sides of the mold to create a water bath.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake Until Set
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bake for about 50 minutes or until the custard is just set but
              still slightly jiggly in the center. Remove from the oven and
              water bath, then let cool to room temperature before refrigerating
              for at least 4 hours or overnight.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Unmold and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              To unmold, run a thin knife around the edges of the mold. Warm
              the bottom of the mold briefly in warm water to loosen the caramel,
              then invert onto a serving plate. Slice and serve chilled.
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
            Use fresh eggs at room temperature for a smoother custard and to
            avoid curdling.
          </li>
          <li>
            Straining the custard mixture before baking removes any chalaza or
            egg bits, ensuring a silky texture.
          </li>
          <li>
            When making caramel, avoid stirring once sugar dissolves to prevent
            crystallization.
          </li>
          <li>
            Baking in a water bath helps cook the custard gently and evenly,
            preventing cracks.
          </li>
          <li>
            Let the Pudim chill overnight for the best flavor and texture.
          </li>
          <li>
            If caramel hardens too much, warm the mold slightly before pouring
            custard to help it dissolve and create a smooth sauce.
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
              href="https://en.wikipedia.org/wiki/Pudim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Pudim (Brazilian Flan)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.tasteatlas.com/pudim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              TasteAtlas: Pudim Recipe & History
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