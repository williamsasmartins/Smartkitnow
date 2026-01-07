import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ItalianBreadSaladPanzanellaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Italian%20Bread%20Salad%20Panzanella%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9458"
  );

  // --- DATA ---
  const title = "Italian Bread Salad (Panzanella)";
  const description = "Tuscan salad of stale bread, tomatoes, onions, cucumber, and basil in a vinaigrette.";

  // INGREDIENTS
  const ingredients = [
    { name: "Stale rustic bread (preferably Tuscan)", baseAmount: 300, unit: "g" },
    { name: "Ripe tomatoes, chopped", baseAmount: 400, unit: "g" },
    { name: "Cucumber, peeled and sliced", baseAmount: 150, unit: "g" },
    { name: "Red onion, thinly sliced", baseAmount: 80, unit: "g" },
    { name: "Fresh basil leaves", baseAmount: 15, unit: "g" },
    { name: "Extra virgin olive oil", baseAmount: 60, unit: "ml" },
    { name: "Red wine vinegar", baseAmount: 30, unit: "ml" },
    { name: "Salt", baseAmount: 5, unit: "g" },
    { name: "Freshly ground black pepper", baseAmount: 2, unit: "g" },
    { name: "Garlic clove, minced", baseAmount: 1, unit: "clove" },
    { name: "Capers (optional)", baseAmount: 15, unit: "g" },
    { name: "Olives (optional), pitted and sliced", baseAmount: 50, unit: "g" },
  ];

  // Nutrition per 4 servings (approximate)
  const nutrition = {
    calories: "320",
    protein: "7g",
    carbs: "40g",
    fat: "14g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of bread is best for Panzanella?",
      answer:
        "Traditionally, stale Tuscan bread without salt is used for Panzanella. It should be firm enough to soak up the dressing without turning mushy. If Tuscan bread is unavailable, any rustic country bread or sourdough that is a day or two old works well.",
    },
    {
      question: "Can I prepare Panzanella in advance?",
      answer:
        "Panzanella is best served fresh to maintain the texture of the bread and vegetables. However, you can prepare the salad a few hours ahead and refrigerate it. Toss the salad again before serving to redistribute the dressing and flavors.",
    },
    {
      question: "How do I prevent the bread from becoming too soggy?",
      answer:
        "Use stale or toasted bread to ensure it absorbs the vinaigrette without disintegrating. Also, add the dressing gradually and toss gently. Letting the salad rest for 10-15 minutes before serving allows the bread to soak up flavors without becoming overly mushy.",
    },
    {
      question: "Can I customize the vegetables in Panzanella?",
      answer:
        "Absolutely! While tomatoes, cucumbers, and onions are classic, you can add bell peppers, radishes, or fresh herbs like parsley. Just ensure the vegetables are fresh and chopped uniformly for the best texture and flavor balance.",
    },
    {
      question: "Is Panzanella suitable for a vegan diet?",
      answer:
        "Yes, Panzanella is naturally vegan as it contains bread, vegetables, olive oil, and vinegar. Just ensure the bread you use does not contain dairy or eggs if you want to keep it strictly vegan.",
    },
    {
      question: "What wine pairs well with Panzanella?",
      answer:
        "A crisp, light-bodied white wine such as Vermentino or Pinot Grigio complements the fresh and tangy flavors of Panzanella beautifully. For red wine lovers, a chilled Chianti or a light Sangiovese works well.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Italian Bread Salad (Panzanella)"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 0m
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
            Panzanella is a classic Tuscan bread salad that celebrates the
            simplicity and freshness of Italian summer produce. Traditionally
            made with stale bread soaked in a tangy vinaigrette and combined
            with ripe tomatoes, cucumbers, onions, and fragrant basil, this
            salad is a perfect way to use up leftover bread while enjoying a
            refreshing, rustic dish.
          </p>
          <p>
            This salad is beloved for its vibrant flavors and contrasting
            textures — the crunch of fresh vegetables paired with the soft,
            soaked bread creates a delightful mouthfeel. Panzanella is often
            served as a light lunch or a side dish alongside grilled meats or
            seafood, embodying the essence of Italian cucina povera (peasant
            cooking) with its humble yet delicious ingredients.
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
              Prepare the Bread
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut the stale bread into roughly 2 cm cubes. If the bread is not
              stale, toast the cubes lightly in the oven at 180°C (350°F) for
              10 minutes until crisp but not browned. Set aside to cool.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Chop the tomatoes into bite-sized pieces, peel and slice the
              cucumber, and thinly slice the red onion. Mince the garlic and
              roughly tear the basil leaves.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Make the Dressing
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small bowl, whisk together the extra virgin olive oil, red
              wine vinegar, minced garlic, salt, and freshly ground black
              pepper until emulsified.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Salad
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the bread cubes, tomatoes, cucumber,
              onion, basil leaves, and optional capers or olives. Pour the
              dressing over and toss gently to coat all ingredients evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Rest and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Let the salad rest at room temperature for 10-15 minutes to allow
              the bread to absorb the dressing and flavors. Serve fresh,
              garnished with extra basil leaves if desired.
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
            Use day-old or slightly stale bread to ensure it soaks up the
            dressing without becoming mushy.
          </li>
          <li>
            For extra flavor, toast the bread cubes lightly before assembling
            the salad.
          </li>
          <li>
            Adjust the acidity of the dressing by balancing red wine vinegar
            with olive oil to your taste.
          </li>
          <li>
            Let the salad rest before serving to allow the flavors to meld
            perfectly.
          </li>
          <li>
            Add a pinch of sugar to the dressing if your tomatoes are not very
            sweet.
          </li>
          <li>
            Experiment with adding other fresh herbs like oregano or parsley for
            a different aromatic profile.
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