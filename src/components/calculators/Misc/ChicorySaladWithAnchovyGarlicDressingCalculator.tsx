import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChicorySaladWithAnchovyGarlicDressingCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chicory%20Salad%20with%20AnchovyGarlic%20Dressing%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8676"
  );

  // --- DATA ---
  const title = "Chicory Salad with Anchovy-Garlic Dressing";
  const description = "Bitter chicory greens in a bold anchovy, garlic, and lemon vinaigrette.";

  // INGREDIENTS
  const ingredients = [
    { name: "Belgian Chicory (Endive), trimmed and chopped", baseAmount: 500, unit: "g" },
    { name: "Anchovy Fillets (packed in oil)", baseAmount: 6, unit: "pieces" },
    { name: "Garlic Cloves, minced", baseAmount: 2, unit: "cloves" },
    { name: "Extra Virgin Olive Oil", baseAmount: 60, unit: "ml" },
    { name: "Fresh Lemon Juice", baseAmount: 30, unit: "ml" },
    { name: "Dijon Mustard", baseAmount: 10, unit: "g" },
    { name: "Capers, rinsed and chopped", baseAmount: 15, unit: "g" },
    { name: "Flat-leaf Parsley, finely chopped", baseAmount: 10, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Freshly Ground Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Toasted Pine Nuts (optional)", baseAmount: 20, unit: "g" },
    { name: "Grated Parmesan Cheese (optional)", baseAmount: 30, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "210",
    protein: "7g",
    carbs: "6g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the best type of chicory to use for this salad?",
      answer:
        "Belgian chicory, also known as endive, is ideal for this salad due to its slightly bitter flavor and crisp texture. It holds up well against the bold anchovy-garlic dressing. You can also use radicchio or curly endive as alternatives for a similar bitter note.",
    },
    {
      question: "Can I substitute anchovy fillets in the dressing?",
      answer:
        "Anchovy fillets provide a unique umami depth and saltiness that is key to this dressing. If you prefer a milder taste or have dietary restrictions, you can substitute with capers or miso paste, but the flavor profile will be different. Avoid skipping anchovies entirely to maintain the dressing's character.",
    },
    {
      question: "How should I store leftovers of this salad?",
      answer:
        "Because of the lemon and anchovy dressing, the salad is best eaten fresh. If you have leftovers, store them in an airtight container in the refrigerator for up to 1 day. The chicory may wilt and the dressing can intensify in flavor, so it's recommended to dress the salad just before serving.",
    },
    {
      question: "Can I prepare the dressing in advance?",
      answer:
        "Yes, the anchovy-garlic dressing can be made up to 2 days ahead and stored in the refrigerator in a sealed container. Allow it to come to room temperature and whisk well before using, as the olive oil may solidify when chilled.",
    },
    {
      question: "What are some good accompaniments for this salad?",
      answer:
        "This chicory salad pairs beautifully with grilled meats, roasted chicken, or seafood dishes. It also works well as a light starter or side dish alongside rustic bread or antipasti platters.",
    },
    {
      question: "How can I make this salad vegan-friendly?",
      answer:
        "To make a vegan version, omit the anchovies and Parmesan cheese. Replace anchovies with finely chopped capers or a splash of soy sauce for umami, and use nutritional yeast or vegan cheese as a substitute for Parmesan. Adjust seasoning to taste.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Chicory Salad with Anchovy-Garlic Dressing"
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
            Chicory Salad with Anchovy-Garlic Dressing is a classic Italian-inspired dish that
            celebrates the balance of bitter greens with a savory, umami-packed dressing. The
            slightly sharp and crunchy Belgian chicory leaves provide a perfect canvas for the
            bold flavors of anchovy, garlic, and lemon, creating a refreshing yet deeply flavorful
            salad.
          </p>
          <p>
            This salad is ideal as a light starter or a side dish to grilled meats and seafood. Its
            simplicity and elegance make it a favorite in Michelin-star kitchens, where quality
            ingredients and precise technique elevate humble components into a memorable culinary
            experience.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Chicory</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Trim the base of the Belgian chicory heads, remove any wilted outer leaves, and chop
              the leaves into bite-sized pieces. Rinse under cold water and spin dry thoroughly to
              remove excess moisture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Dressing</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small bowl, mash the anchovy fillets and minced garlic into a paste. Whisk in the
              Dijon mustard, lemon juice, and chopped capers. Slowly drizzle in the olive oil while
              whisking continuously until the dressing emulsifies. Season with salt and freshly
              ground black pepper to taste.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Toss the Salad</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the chopped chicory in a large bowl. Pour the dressing over the greens and toss
              gently but thoroughly to coat all leaves evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Garnishes</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Sprinkle the salad with chopped flat-leaf parsley, toasted pine nuts, and grated
              Parmesan cheese if using. Give a final gentle toss.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve Immediately</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the salad immediately to enjoy the crisp texture and fresh flavors at their
              peak.
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
            Use fresh, high-quality anchovy fillets packed in olive oil for the best flavor and
            smooth dressing texture.
          </li>
          <li>
            Toast pine nuts gently in a dry skillet over medium heat until golden and fragrant,
            stirring constantly to avoid burning.
          </li>
          <li>
            If the dressing tastes too strong, balance it with a touch more olive oil or a pinch of
            sugar to mellow the acidity.
          </li>
          <li>
            For added texture and color, consider adding thinly sliced radishes or shaved fennel to
            the salad.
          </li>
          <li>
            Always dress the salad just before serving to keep the chicory crisp and prevent
            wilting.
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