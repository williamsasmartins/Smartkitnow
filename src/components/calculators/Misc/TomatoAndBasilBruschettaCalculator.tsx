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
    "https://image.pollinations.ai/prompt/Tomato%20and%20Basil%20Bruschetta%2C%20diced%20ingredients%2C%20chopped%20topping%2C%20small%20pieces%2C%20rustic%20bread%20slices%2C%20cinematic%20lighting%2C%20macro%20food%20photography%2C%20steam%20rising%2C%20michelin%20plating?width=1280&height=720&nologo=true&seed=2160"
  );

  // --- DATA ---
  const title = "Tomato and Basil Bruschetta";
  const description = "Toasted bread topped with fresh tomatoes, basil, garlic, and olive oil.";

  // INGREDIENTS
  const ingredients = [
    { name: "San Marzano Tomatoes, diced", baseAmount: 500, unit: "g" },
    { name: "Fresh Basil Leaves, finely chopped", baseAmount: 15, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 60, unit: "ml" },
    { name: "Garlic Cloves, minced", baseAmount: 2, unit: "cloves" },
    { name: "Rustic Italian Bread (Ciabatta or Baguette), sliced", baseAmount: 200, unit: "g" },
    { name: "Sea Salt", baseAmount: 3, unit: "g" },
    { name: "Freshly Ground Black Pepper", baseAmount: 1, unit: "g" },
    { name: "Balsamic Vinegar (optional)", baseAmount: 10, unit: "ml" },
    { name: "Lemon Juice, freshly squeezed", baseAmount: 5, unit: "ml" },
    { name: "Fresh Oregano (optional), chopped", baseAmount: 5, unit: "g" },
    { name: "Parmesan Cheese Shavings (optional)", baseAmount: 20, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "210",
    protein: "4g",
    carbs: "22g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH CONTENT) ---
  const faqs = [
    {
      question: "Why is fresh basil preferred over dried in bruschetta?",
      answer:
        "Fresh basil provides vibrant, aromatic essential oils that are volatile and degrade quickly when dried. These oils contribute to the bright, peppery, and slightly sweet flavor profile essential to authentic bruschetta. Dried basil lacks this freshness and can impart a muted, sometimes bitter taste due to oxidation and loss of volatile compounds during drying.",
    },
    {
      question: "How does acidity affect the flavor balance in bruschetta?",
      answer:
        "Acidity from ingredients like lemon juice or balsamic vinegar brightens the overall flavor by balancing the natural sweetness of tomatoes and the richness of olive oil. Acids stimulate salivation and enhance taste receptor sensitivity, making the dish more vibrant and refreshing. Proper acidity also helps preserve the freshness of the tomatoes and prevents the olive oil from tasting flat or greasy.",
    },
    {
      question: "Why should the bread be toasted just before serving?",
      answer:
        "Toasting bread just before serving ensures a crisp exterior while maintaining a slightly tender crumb inside, providing a satisfying textural contrast to the juicy tomato topping. If toasted too early, the bread absorbs moisture from the topping and becomes soggy due to starch retrogradation and moisture migration. Freshly toasted bread also has a warm aroma from Maillard reactions, enhancing the sensory experience.",
    },
    {
      question: "Can I prepare the tomato topping in advance without losing flavor?",
      answer:
        "Preparing the tomato topping a short time in advance (up to 1 hour) allows flavors to meld as the salt draws out tomato juices, creating a natural dressing. However, prolonged storage causes enzymatic breakdown and oxidation, which dulls the bright flavors and softens the texture. To preserve freshness, store the topping chilled and add delicate herbs like basil just before serving to maintain their vibrant aroma and color.",
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

  // --- EDITORIAL CONTENT ---
  const editorial = (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4">About this Recipe</h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed">
          <p className="lead">
            Tomato and Basil Bruschetta is a quintessential Italian antipasto that
            dates back to the 15th century, originating in the rustic kitchens of
            central Italy. Traditionally, it was a way to salvage stale bread by
            toasting it and topping it with fresh, seasonal ingredients. The
            combination of ripe tomatoes and aromatic basil atop crunchy bread has
            since become a beloved classic worldwide, celebrated for its simplicity
            and vibrant flavors.
          </p>
          <p>
            The chemistry behind this flavor combination is fascinating: the
            sweetness and slight acidity of San Marzano tomatoes complement the
            herbaceous, slightly peppery notes of fresh basil. Olive oil acts as a
            flavor carrier, enhancing the release of fat-soluble aromatic compounds
            from the basil and garlic. The Maillard reaction on toasted bread adds
            a nutty, caramelized depth that contrasts beautifully with the fresh,
            juicy topping, creating a multi-sensory experience.
          </p>
          <p>
            When served, the bruschetta offers a delightful interplay of textures and
            flavors — the crisp, warm bread provides a sturdy base for the cool,
            juicy tomato mixture, while the fragrant basil and garlic awaken the
            palate. This dish is perfect as a light appetizer or a refreshing snack,
            embodying the essence of Mediterranean freshness and culinary artistry.
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
            <h3 className="font-bold text-lg mb-1">Prepare the Tomatoes</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Start by washing and dicing the San Marzano tomatoes into small,
              uniform pieces to ensure even flavor distribution. Place them in a
              mixing bowl and sprinkle with sea salt to draw out excess moisture,
              enhancing their natural sweetness and concentrating flavor through
              osmosis.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              2
            </span>
            <h3 className="font-bold text-lg mb-1">Add Aromatics and Herbs</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Mince the garlic finely to release its pungent oils and add it to the
              tomatoes. Gently fold in the chopped fresh basil and optional oregano,
              taking care not to bruise the leaves, which can cause bitterness.
              Incorporate freshly ground black pepper and a splash of lemon juice or
              balsamic vinegar to brighten the mixture.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              3
            </span>
            <h3 className="font-bold text-lg mb-1">Drizzle with Olive Oil</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Slowly drizzle extra virgin olive oil over the tomato mixture while
              gently folding to emulsify the dressing. This coats the ingredients,
              enhances mouthfeel, and helps release fat-soluble flavor compounds from
              the herbs and garlic.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              4
            </span>
            <h3 className="font-bold text-lg mb-1">Toast the Bread</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Slice the rustic Italian bread into 1/2-inch thick pieces and toast
              them until golden brown and crisp on the outside but still tender
              inside. Use a grill pan or oven broiler for even toasting and a
              slightly smoky aroma.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              5
            </span>
            <h3 className="font-bold text-lg mb-1">Rub Bread with Garlic</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Immediately after toasting, rub one side of each bread slice with a
              peeled garlic clove. This infuses a subtle garlic aroma without
              overpowering the topping, leveraging the volatile sulfur compounds
              released by crushing.
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-600 font-bold text-xs">
              6
            </span>
            <h3 className="font-bold text-lg mb-1">Assemble and Serve</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Spoon the tomato and basil mixture generously onto each bread slice,
              allowing some of the juices to soak in for flavor. Optionally, garnish
              with Parmesan shavings for umami depth. Serve immediately to enjoy the
              contrast of textures and fresh flavors at their peak.
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
            Use room temperature tomatoes to maximize flavor release and aroma;
            chilling dulls taste receptors and mutes volatile compounds.
          </li>
          <li>
            Balance acidity carefully: too much lemon or vinegar can overpower the
            sweetness, so add incrementally and taste as you go.
          </li>
          <li>
            Toast bread until just golden — over-toasting creates bitterness and
            masks the delicate topping flavors.
          </li>
          <li>
            Add fresh basil last and fold gently to avoid bruising, which releases
            chlorophyll and causes bitterness.
          </li>
          <li>
            For extra depth, lightly drizzle aged balsamic vinegar just before
            serving to add a subtle sweetness and complexity.
          </li>
          <li>
            If using Parmesan, add thin shavings instead of grated cheese to preserve
            texture and visual appeal.
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

      <section className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" /> References
        </h3>
        <ul className="space-y-2 text-sm text-slate-500">
          <li>
            <ExternalLink className="inline h-3 w-3 mr-1" />{" "}
            <a
              href="https://en.wikipedia.org/wiki/Bruschetta"
              target="_blank"
              className="hover:underline"
              rel="noopener noreferrer"
            >
              Wikipedia: History of Bruschetta
            </a>
          </li>
          <li>
            <ExternalLink className="inline h-3 w-3 mr-1" />{" "}
            <a
              href="https://www.silverspoonkitchen.org/authentic-italian-recipes"
              target="_blank"
              className="hover:underline"
              rel="noopener noreferrer"
            >
              The Silver Spoon: Authentic Italian Recipes
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