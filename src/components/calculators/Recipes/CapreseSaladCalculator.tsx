import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, Info } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CapreseSaladCalculator() {
  const [servings, setServings] = useState(4);

  // --- DATA ---
  const title = "Caprese Salad";
  const description =
    "Layers of fresh mozzarella, ripe San Marzano tomatoes, and fragrant basil drizzled with extra virgin olive oil and aged balsamic vinegar.";

  // INGREDIENTS: Use 'baseAmount' (number) for scaling
  const ingredients = [
    { name: "Fresh Mozzarella (preferably buffalo)", baseAmount: 250, unit: "g" },
    { name: "San Marzano Tomatoes", baseAmount: 400, unit: "g" },
    { name: "Fresh Basil Leaves", baseAmount: 15, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 30, unit: "ml" },
    { name: "Aged Balsamic Vinegar", baseAmount: 15, unit: "ml" },
    { name: "Sea Salt (preferably flaky)", baseAmount: 2, unit: "g" },
    { name: "Freshly Ground Black Pepper", baseAmount: 1, unit: "g" },
    { name: "Optional: Crusty Bread", baseAmount: 100, unit: "g" },
  ];

  // Nutrition estimate per serving (approximate)
  const nutrition = {
    calories: "220",
    protein: "14g",
    carbs: "6g",
    fat: "16g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ ---
  const faqs = [
    {
      question: "Can I prepare Caprese Salad ahead of time?",
      answer:
        "For the freshest taste and texture, assemble just before serving. Tomatoes release water over time, which can dilute flavors.",
    },
    {
      question: "What type of mozzarella is best?",
      answer:
        "Fresh buffalo mozzarella offers creaminess and delicate flavor, but high-quality cow's milk mozzarella works well too.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT (Left Column) ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 relative group">
        <img
          src="https://pollinations.ai/p/Caprese%20Salad%20food%20photography%2C%20michelin%20star%20plating%2C%208k%2C%20delicious%2C%20cinematic%20lighting%2C%20rustic?width=1200&height=675&nologo=true&seed=1599"
          alt="Caprese Salad"
          className="w-full h-auto object-cover aspect-video transform transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className="text-white font-bold text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 15m | Cook: 0m
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
                className="h-6 w-6 p-0"
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                aria-label="Decrease servings"
              >
                -
              </Button>
              <span className="w-4 text-center font-bold">{servings}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
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
                  <TableCell className="font-medium">{ing.name}</TableCell>
                  <TableCell className="text-right font-bold text-slate-600 dark:text-slate-400">
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
            <div className="font-bold">{nutrition.calories}</div>
            <span className="text-xs text-slate-500">Kcal</span>
          </div>
          <div>
            <div className="font-bold">{nutrition.protein}</div>
            <span className="text-xs text-slate-500">Prot</span>
          </div>
          <div>
            <div className="font-bold">{nutrition.carbs}</div>
            <span className="text-xs text-slate-500">Carb</span>
          </div>
          <div>
            <div className="font-bold">{nutrition.fat}</div>
            <span className="text-xs text-slate-500">Fat</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // --- EDITORIAL CONTENT (Right Column) ---
  const editorial = (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4">About this Recipe</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p className="lead">
            Imagine the vibrant aroma of sun-ripened San Marzano tomatoes mingling
            with the creamy, milky softness of fresh mozzarella. The gentle rustle
            of basil leaves releases a sweet, peppery fragrance that dances in the
            air. Each bite offers a symphony of textures: the juicy burst of tomato,
            the tender silkiness of cheese, and the crisp freshness of basil,
            all harmonized by a drizzle of golden olive oil and a tangy kiss of aged
            balsamic vinegar.
          </p>
          <p>
            The Caprese Salad, hailing from the picturesque island of Capri in Italy,
            is a celebration of simplicity and quality. Traditionally served as an
            antipasto, it honors the colors of the Italian flag and the bounty of
            Mediterranean ingredients, embodying the essence of Italian summer dining.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ChefHat className="h-6 w-6 text-orange-500" /> Instructions
        </h2>
        <ol className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-8">
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              1
            </span>
            <h3 className="font-bold text-lg mb-1">Prepare Ingredients</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Gently slice the fresh mozzarella into 1cm thick rounds, allowing its
              creamy texture to shine. Slice the San Marzano tomatoes into similar
              thickness, revealing their vibrant red flesh and juicy interior.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              2
            </span>
            <h3 className="font-bold text-lg mb-1">Layer the Salad</h3>
            <p className="text-slate-600 dark:text-slate-400">
              On a rustic platter, alternate slices of tomato and mozzarella, slightly
              overlapping each piece. Tuck fresh basil leaves between the layers,
              releasing their aromatic oils with gentle pressure.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              3
            </span>
            <h3 className="font-bold text-lg mb-1">Season and Dress</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Drizzle the salad evenly with high-quality extra virgin olive oil,
              letting its fruity aroma envelop the ingredients. Follow with a delicate
              stream of aged balsamic vinegar for a subtle tang. Sprinkle flaky sea salt
              and freshly ground black pepper to taste.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              4
            </span>
            <h3 className="font-bold text-lg mb-1">Serve Immediately</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Serve the salad promptly to enjoy the fresh textures and vibrant flavors.
              Optionally, accompany with slices of crusty bread to soak up the luscious
              dressing.
            </p>
          </li>
        </ol>
      </section>

      <section className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-4 text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <Flame className="h-5 w-5" /> Chef's Secrets
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-amber-900 dark:text-amber-100 text-sm">
          <li>
            Use the freshest, ripest San Marzano tomatoes for a naturally sweet and
            balanced acidity that elevates the salad.
          </li>
          <li>
            Let the mozzarella rest at room temperature for 15 minutes before slicing
            to enhance its creamy texture and flavor.
          </li>
          <li>
            Gently tear basil leaves instead of chopping to avoid bruising and preserve
            their aromatic oils.
          </li>
          <li>
            Drizzle olive oil and balsamic vinegar slowly and evenly to create a
            harmonious flavor coating every bite.
          </li>
          <li>
            Serve immediately; the salad’s freshness and texture are best enjoyed
            right after assembly.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="border-b pb-2">
              <h3 className="font-semibold">{f.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{f.answer}</p>
            </div>
          ))}
        </div>
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
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}