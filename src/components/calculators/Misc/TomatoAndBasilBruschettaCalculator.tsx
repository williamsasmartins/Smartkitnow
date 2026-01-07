import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TomatoAndBasilBruschettaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Tomato%20and%20Basil%20Bruschetta%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5042"
  );

  // --- DATA ---
  const title = "Tomato and Basil Bruschetta";
  const description = "Toasted bread topped with fresh tomatoes, basil, garlic, and olive oil.";

  // INGREDIENTS
  const ingredients = [
    { name: "Ripe Tomatoes (chopped)", baseAmount: 400, unit: "g" },
    { name: "Fresh Basil Leaves", baseAmount: 15, unit: "g" },
    { name: "Garlic Cloves (minced)", baseAmount: 2, unit: "cloves" },
    { name: "Extra Virgin Olive Oil", baseAmount: 50, unit: "ml" },
    { name: "Balsamic Vinegar", baseAmount: 10, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "French Baguette (sliced)", baseAmount: 1, unit: "loaf" },
    { name: "Parmesan Cheese (optional, shaved)", baseAmount: 20, unit: "g" },
    { name: "Fresh Oregano (optional)", baseAmount: 5, unit: "g" },
    { name: "Lemon Zest (optional)", baseAmount: 1, unit: "tsp" },
  ];

  // Approximate nutrition per serving (4 servings)
  const nutrition = {
    calories: "180",
    protein: "4g",
    carbs: "20g",
    fat: "9g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & BIG FONT) ---
  const faqs = [
    {
      question: "Can I use other types of bread for bruschetta?",
      answer:
        "Absolutely! While a French baguette or Italian ciabatta is traditional due to their firm texture and ability to hold toppings well, you can experiment with sourdough, rustic country bread, or even gluten-free options. Just ensure the bread is sliced thick enough and toasted properly to avoid sogginess.",
    },
    {
      question: "How do I keep the bruschetta from becoming soggy?",
      answer:
        "To prevent sogginess, toast the bread slices until they are crisp and golden before adding the tomato mixture. Also, drain excess liquid from the chopped tomatoes and add olive oil just before serving. Serving immediately after assembling helps maintain the perfect texture.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Tomato and Basil Bruschetta"
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

  // --- EDITORIAL CONTENT (BIGGER FONTS) ---
  const editorial = (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Tomato and Basil Bruschetta is a classic Italian antipasto that celebrates the
            freshness of ripe tomatoes and aromatic basil. This simple yet flavorful dish
            combines toasted bread slices with a vibrant topping of chopped tomatoes,
            fragrant basil leaves, garlic, and a drizzle of extra virgin olive oil. It's a
            perfect starter or snack that embodies the essence of Mediterranean cuisine.
          </p>
          <p>
            Originating from the Italian region of Tuscany, bruschetta was traditionally a
            way to salvage stale bread by toasting it and topping it with seasonal
            ingredients. Today, it remains a beloved dish worldwide for its simplicity,
            freshness, and versatility. Whether served at a casual gathering or a refined
            dinner, this tomato and basil bruschetta recipe is sure to delight your palate.
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
              Prepare the Tomato Mixture
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a medium bowl, combine the chopped ripe tomatoes, minced garlic, chopped
              fresh basil leaves, balsamic vinegar, salt, and freshly ground black pepper.
              Drizzle with extra virgin olive oil and gently toss to combine. Let the
              mixture sit for 10-15 minutes to allow the flavors to meld.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Toast the Bread
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slice the French baguette into 1/2-inch thick slices. Toast the slices on a
              grill pan or in the oven until golden brown and crisp, about 2-3 minutes per
              side. For extra flavor, rub each toasted slice with a cut garlic clove while
              still warm.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Bruschetta
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spoon the tomato and basil mixture generously onto each toasted bread slice.
              Optionally, garnish with shaved Parmesan cheese, fresh oregano, or a sprinkle
              of lemon zest for added brightness and complexity.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve Immediately
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the bruschetta immediately to enjoy the contrast of crunchy bread and
              juicy tomato topping. This dish pairs wonderfully with a crisp white wine or
              a refreshing sparkling water with lemon.
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
            Use the freshest, ripest tomatoes you can find for the best flavor and juiciness.
          </li>
          <li>
            If tomatoes are very watery, drain excess liquid before mixing to avoid soggy
            bread.
          </li>
          <li>
            Toast the bread slices just before serving to keep them crisp and crunchy.
          </li>
          <li>
            Experiment with adding a pinch of red chili flakes for a subtle spicy kick.
          </li>
          <li>
            For a vegan version, omit Parmesan cheese or substitute with a plant-based
            alternative.
          </li>
          <li>
            Leftover tomato mixture can be refrigerated for up to 2 days and used as a
            topping for salads or pasta.
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