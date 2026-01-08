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
    "https://image.pollinations.ai/prompt/Italian%20Bread%20Salad%20Panzanella%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4672"
  );

  // --- DATA ---
  const title = "Italian Bread Salad (Panzanella)";
  const description = "Tuscan salad of stale bread, tomatoes, onions, cucumber, and basil in a vinaigrette.";

  // INGREDIENTS
  const ingredients = [
    { name: "Stale rustic bread (preferably Tuscan)", baseAmount: 300, unit: "g" },
    { name: "Ripe tomatoes (heirloom or vine-ripened)", baseAmount: 400, unit: "g" },
    { name: "Cucumber, peeled and sliced", baseAmount: 150, unit: "g" },
    { name: "Red onion, thinly sliced", baseAmount: 80, unit: "g" },
    { name: "Fresh basil leaves", baseAmount: 15, unit: "g" },
    { name: "Extra virgin olive oil", baseAmount: 60, unit: "ml" },
    { name: "Red wine vinegar", baseAmount: 30, unit: "ml" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Freshly ground black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Capers (optional)", baseAmount: 15, unit: "g" },
    { name: "Cherry tomatoes (optional, halved)", baseAmount: 100, unit: "g" },
    { name: "Garlic clove, minced (optional)", baseAmount: 1, unit: "clove" },
    { name: "Olives (optional, pitted and sliced)", baseAmount: 50, unit: "g" },
  ];

  // Approximate nutrition per 4 servings (values rounded)
  const nutrition = {
    calories: "320",
    protein: "7g",
    carbs: "40g",
    fat: "14g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) => (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of bread is best for Panzanella?",
      answer:
        "Traditionally, stale rustic bread such as Tuscan or country-style bread is used because it soaks up the dressing without becoming too mushy. Avoid sliced sandwich bread as it lacks the texture and flavor needed for an authentic Panzanella.",
    },
    {
      question: "Can I prepare Panzanella in advance?",
      answer:
        "Panzanella is best served fresh to maintain the bread's texture and the brightness of the vegetables. However, you can prepare the ingredients a few hours ahead and combine them just before serving. If left too long, the bread may become overly soggy.",
    },
    {
      question: "How do I prevent the bread from becoming soggy?",
      answer:
        "Using stale or slightly dried bread helps it absorb the vinaigrette without disintegrating. Toasting the bread lightly before assembling can also add crunch and prevent sogginess.",
    },
    {
      question: "Can I customize the vegetables in Panzanella?",
      answer:
        "Absolutely! While tomatoes, cucumbers, and onions are classic, you can add ingredients like bell peppers, radishes, or olives to suit your taste. Just ensure the vegetables are fresh and chopped uniformly for the best texture.",
    },
    {
      question: "Is Panzanella suitable for vegans and vegetarians?",
      answer:
        "Yes, Panzanella is naturally vegan and vegetarian as it primarily consists of bread, fresh vegetables, herbs, and a simple vinaigrette. Just ensure the bread does not contain dairy or eggs if you are strictly vegan.",
    },
    {
      question: "What wine pairs well with Panzanella?",
      answer:
        "A crisp, light-bodied white wine like Pinot Grigio or Vermentino complements the fresh, tangy flavors of Panzanella beautifully. Alternatively, a light red such as Chianti can also work well.",
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Panzanella is a classic Italian bread salad originating from Tuscany, celebrated for its rustic simplicity and vibrant flavors. This dish transforms stale bread into a delightful base, soaked with a tangy vinaigrette and combined with fresh, sun-ripened tomatoes, crisp cucumbers, and fragrant basil. Perfect for summer, it embodies the Italian philosophy of using humble ingredients to create something extraordinary.
          </p>
          <p>
            Historically, Panzanella was a peasant dish designed to use up leftover bread and garden vegetables, making it both economical and sustainable. Over time, it has evolved into a beloved staple of Italian cuisine, enjoyed worldwide for its refreshing taste and satisfying texture. The salad’s balance of acidity, sweetness, and herbaceous notes makes it a versatile side or light meal.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Bread</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut the stale rustic bread into roughly 2 cm cubes. If the bread is not stale, toast the cubes lightly in a preheated oven at 180°C (350°F) for about 10 minutes until crisp but not browned.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Vegetables</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Wash and chop the tomatoes into bite-sized pieces. Peel and slice the cucumber, and thinly slice the red onion. Tear the basil leaves roughly by hand to release their aroma.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Vinaigrette</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small bowl, whisk together the extra virgin olive oil, red wine vinegar, minced garlic (if using), salt, and freshly ground black pepper until emulsified.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Assemble the Salad</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the bread cubes, chopped tomatoes, cucumber, red onion, basil leaves, capers, and olives if using. Pour the vinaigrette over the salad and toss gently to coat all ingredients evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Rest and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Let the salad rest at room temperature for 15-20 minutes to allow the bread to soak up the dressing and the flavors to meld. Serve fresh, garnished with extra basil leaves if desired.
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
            Use day-old or slightly stale bread to prevent the salad from becoming mushy. If fresh bread is your only option, toast it lightly before using.
          </li>
          <li>
            For a more intense flavor, rub the bread cubes with a cut garlic clove before assembling the salad.
          </li>
          <li>
            Adjust the acidity of the vinaigrette to your taste by balancing the red wine vinegar and olive oil.
          </li>
          <li>
            Letting the salad rest before serving allows the bread to absorb the dressing fully, enhancing the overall flavor.
          </li>
          <li>
            Experiment with adding other fresh herbs like mint or oregano for a unique twist.
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