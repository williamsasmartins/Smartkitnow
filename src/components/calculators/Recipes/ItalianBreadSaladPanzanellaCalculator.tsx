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
    "https://image.pollinations.ai/prompt/Italian%20Bread%20Salad%20Panzanella%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=465"
  );

  const title = "Italian Bread Salad (Panzanella)";
  const description = "Tuscan salad of stale bread, tomatoes, onions, cucumber, and basil in a vinaigrette.";

  const ingredients = [
    { name: "Stale rustic bread (cubed)", baseAmount: 300, unit: "g" },
    { name: "Ripe tomatoes (chopped)", baseAmount: 400, unit: "g" },
    { name: "Cucumber (peeled and sliced)", baseAmount: 150, unit: "g" },
    { name: "Red onion (thinly sliced)", baseAmount: 80, unit: "g" },
    { name: "Fresh basil leaves", baseAmount: 15, unit: "g" },
    { name: "Extra virgin olive oil", baseAmount: 60, unit: "ml" },
    { name: "Red wine vinegar", baseAmount: 30, unit: "ml" },
    { name: "Salt", baseAmount: 5, unit: "g" },
    { name: "Black pepper (freshly ground)", baseAmount: 2, unit: "g" },
    { name: "Garlic clove (minced)", baseAmount: 1, unit: "clove" },
    { name: "Capers (optional)", baseAmount: 15, unit: "g" },
    { name: "Olives (pitted and halved, optional)", baseAmount: 50, unit: "g" },
  ];

  const nutrition = {
    calories: "320",
    protein: "7g",
    carbs: "35g",
    fat: "15g",
  };

  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  const faqs = [
    {
      question: "What type of bread is best for Panzanella?",
      answer:
        "Traditionally, stale rustic or country-style bread with a firm crust is ideal for Panzanella. It soaks up the dressing without becoming too mushy. Avoid soft sandwich bread as it won't hold texture well.",
    },
    {
      question: "Can I prepare Panzanella in advance?",
      answer:
        "Panzanella is best served fresh to maintain the bread's texture and the brightness of the vegetables. However, you can prepare the vegetables and dressing a few hours ahead and combine them with the bread just before serving.",
    },
    {
      question: "How do I prevent the bread from becoming soggy?",
      answer:
        "Use stale or toasted bread cubes that are dry and firm. Toss the bread with the dressing just before serving to keep it from absorbing too much liquid and becoming soggy.",
    },
    {
      question: "Can I add other vegetables or ingredients?",
      answer:
        "Absolutely! Panzanella is versatile. You can add ingredients like bell peppers, radishes, capers, or olives to enhance flavor and texture. Just ensure they complement the fresh, vibrant profile of the salad.",
    },
    {
      question: "Is Panzanella suitable for vegans?",
      answer:
        "Yes, Panzanella is naturally vegan as it contains bread, vegetables, olive oil, and vinegar. Just ensure the bread you use does not contain dairy or eggs if you want to keep it strictly vegan.",
    },
    {
      question: "What wine pairs well with Panzanella?",
      answer:
        "A crisp, light-bodied white wine like Pinot Grigio or Vermentino pairs beautifully with Panzanella, complementing its fresh and tangy flavors without overpowering the salad.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
                    {ing.unit === "clove"
                      ? getAmount(ing.baseAmount)
                      : getAmount(ing.baseAmount)}{" "}
                    {ing.unit}
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

  const editorial = (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Panzanella is a classic Tuscan bread salad that celebrates the
            simplicity and freshness of Italian cuisine. Traditionally made
            with stale bread, ripe tomatoes, cucumbers, onions, fragrant
            basil, this salad is dressed with a tangy vinaigrette of olive oil
            and red wine vinegar. It’s a perfect way to use up leftover bread
            while enjoying a refreshing, vibrant dish especially popular in
            summer.
          </p>
          <p>
            The beauty of Panzanella lies in its rustic charm and the balance of
            textures — crunchy bread cubes softened just enough by the dressing,
            juicy tomatoes bursting with flavor, and the aromatic lift from fresh
            herbs. This recipe is easy to customize with optional ingredients like
            olives or capers, making it a versatile and crowd-pleasing salad for
            any occasion.
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
              Cut the stale rustic bread into 2 cm cubes. If the bread is not
              stale, toast the cubes lightly in the oven at 180°C (350°F) for 10
              minutes until crisp but not browned. Set aside to cool.
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
              Chop the ripe tomatoes into bite-sized pieces. Peel and slice the
              cucumber, thinly slice the red onion, and roughly tear the fresh
              basil leaves. If using, halve the olives and rinse the capers.
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
              In a small bowl, whisk together the extra virgin olive oil, red wine
              vinegar, minced garlic, salt, and freshly ground black pepper until
              emulsified.
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
              In a large bowl, combine the bread cubes, tomatoes, cucumber, onion,
              basil, and optional olives and capers. Pour the dressing over and
              toss gently to combine, ensuring the bread absorbs the flavors.
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
              Let the salad rest at room temperature for 15-20 minutes to allow the
              bread to soak up the dressing. Serve fresh as a side dish or light
              meal.
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
            Use day-old or slightly stale bread for the best texture; fresh bread
            will become too mushy.
          </li>
          <li>
            Toast the bread cubes lightly if your bread is very soft to add crunch.
          </li>
          <li>
            Adjust the acidity of the dressing by adding more or less red wine
            vinegar to taste.
          </li>
          <li>
            For a more robust flavor, add a splash of balsamic vinegar or a pinch
            of chili flakes.
          </li>
          <li>
            Serve Panzanella at room temperature rather than chilled to preserve
            the flavors and texture.
          </li>
          <li>
            Garnish with extra fresh basil leaves just before serving for a
            vibrant aroma.
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

