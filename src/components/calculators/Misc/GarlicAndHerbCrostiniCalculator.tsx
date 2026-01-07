import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GarlicAndHerbCrostiniCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Garlic%20and%20Herb%20Crostini%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8318"
  );

  // --- DATA ---
  const title = "Garlic and Herb Crostini";
  const description = "Crispy toasted bread rubbed with garlic and topped with fresh herbs.";

  // INGREDIENTS
  const ingredients = [
    { name: "Baguette or Italian bread", baseAmount: 1, unit: "loaf (about 300g)" },
    { name: "Extra virgin olive oil", baseAmount: 60, unit: "ml" },
    { name: "Garlic cloves", baseAmount: 4, unit: "cloves" },
    { name: "Fresh parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Fresh basil, chopped", baseAmount: 10, unit: "g" },
    { name: "Fresh thyme leaves", baseAmount: 5, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Freshly ground black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Lemon zest", baseAmount: 1, unit: "tsp" },
    { name: "Parmesan cheese, grated (optional)", baseAmount: 30, unit: "g" },
    { name: "Red pepper flakes (optional)", baseAmount: 0.25, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "180",
    protein: "3g",
    carbs: "20g",
    fat: "9g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of bread is best for crostini?",
      answer:
        "A crusty bread like a baguette or Italian bread works best for crostini because it crisps up nicely when toasted and holds the toppings well without becoming soggy.",
    },
    {
      question: "Can I prepare crostini ahead of time?",
      answer:
        "Yes, you can toast the bread slices a few hours ahead and store them in an airtight container. Rub with garlic and add herbs just before serving to keep the flavors fresh and the bread crisp.",
    },
    {
      question: "How do I store leftover crostini?",
      answer:
        "Store leftover crostini in an airtight container at room temperature for up to 2 days. To re-crisp, warm them in a preheated oven at 180°C (350°F) for 5 minutes.",
    },
    {
      question: "Can I customize the herb mixture?",
      answer:
        "Absolutely! Feel free to substitute or add herbs like rosemary, oregano, or chives depending on your preference. Fresh herbs provide the best flavor, but dried can be used in a pinch.",
    },
    {
      question: "Is it necessary to use Parmesan cheese?",
      answer:
        "Parmesan cheese is optional but adds a lovely savory depth and slight saltiness. You can omit it for a dairy-free version or substitute with nutritional yeast for a similar umami flavor.",
    },
    {
      question: "How do I prevent the crostini from becoming soggy?",
      answer:
        "Make sure to toast the bread slices until they are golden and crisp. When rubbing garlic, do so lightly to avoid excess moisture. Add toppings just before serving to maintain crispness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Garlic and Herb Crostini"
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
                    {typeof ing.baseAmount === "number"
                      ? `${getAmount(ing.baseAmount)} ${ing.unit}`
                      : ing.baseAmount + (ing.unit ? ` ${ing.unit}` : "")}
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
            Garlic and Herb Crostini is a timeless Italian appetizer that combines the
            crunch of toasted bread with the fresh, aromatic flavors of garlic and herbs.
            This simple yet elegant dish is perfect for entertaining or as a flavorful
            snack. The crostini’s crisp texture contrasts beautifully with the vibrant
            herbaceous topping, making it a crowd-pleaser at any table.
          </p>
          <p>
            The recipe is highly versatile, allowing you to customize the herbs and
            toppings to your liking. Whether served plain or with a sprinkle of Parmesan
            cheese, these crostini are sure to elevate your appetizer game with minimal
            effort and maximum flavor.
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
              Slice the baguette into 1/2-inch thick slices on a slight diagonal for
              larger surface area. Arrange the slices on a baking sheet in a single
              layer.
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
              Preheat your oven to 190°C (375°F). Brush each slice lightly with olive
              oil on both sides. Toast in the oven for 8-10 minutes, flipping halfway,
              until golden and crisp.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Herb Mixture
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small bowl, combine chopped parsley, basil, thyme, lemon zest, salt,
              pepper, and optional red pepper flakes. Mix well with the remaining olive
              oil.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Rub Garlic on Toasted Bread
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Peel garlic cloves and gently rub each toasted bread slice with the cut
              side of a garlic clove to infuse flavor without overpowering.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble Crostini
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spoon the herb and olive oil mixture generously over each slice. Sprinkle
              with grated Parmesan cheese if using. Serve immediately for best texture
              and flavor.
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
            Use day-old bread if possible; it toasts better and holds toppings without
            becoming soggy.
          </li>
          <li>
            For an extra burst of flavor, drizzle a little balsamic glaze over the
            crostini just before serving.
          </li>
          <li>
            Experiment with toppings like sun-dried tomatoes, roasted peppers, or
            olives to create variations.
          </li>
          <li>
            If you prefer a smoky flavor, toast the bread slices on a grill or grill
            pan.
          </li>
          <li>
            To keep crostini crisp longer, avoid adding wet toppings until just before
            serving.
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