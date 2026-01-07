import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CapreseSaladCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Caprese%20Salad%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5655"
  );

  // --- DATA ---
  const title = "Caprese Salad";
  const description =
    "Layers of fresh mozzarella, ripe tomatoes, and basil drizzled with olive oil and balsamic.";

  // INGREDIENTS
  const ingredients = [
    { name: "Fresh Mozzarella Cheese", baseAmount: 250, unit: "g" },
    { name: "Ripe Tomatoes", baseAmount: 300, unit: "g" },
    { name: "Fresh Basil Leaves", baseAmount: 20, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 30, unit: "ml" },
    { name: "Balsamic Vinegar", baseAmount: 15, unit: "ml" },
    { name: "Sea Salt", baseAmount: 1, unit: "tsp" },
    { name: "Freshly Ground Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Garlic (optional, minced)", baseAmount: 1, unit: "clove" },
    { name: "Arugula (optional)", baseAmount: 50, unit: "g" },
    { name: "Pine Nuts (optional, toasted)", baseAmount: 15, unit: "g" },
    { name: "Capers (optional)", baseAmount: 10, unit: "g" },
    { name: "Lemon Zest (optional)", baseAmount: 1, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "220",
    protein: "12g",
    carbs: "5g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of mozzarella is best for Caprese Salad?",
      answer:
        "Fresh mozzarella, preferably mozzarella di bufala or fior di latte, is ideal for Caprese Salad. It has a soft, creamy texture and mild flavor that complements the tomatoes and basil perfectly. Avoid pre-shredded or low-moisture mozzarella as they lack the authentic texture and taste.",
    },
    {
      question: "Can I prepare Caprese Salad ahead of time?",
      answer:
        "Caprese Salad is best served fresh to preserve the vibrant flavors and textures. However, you can prepare the ingredients in advance and assemble the salad just before serving. If you must prepare it earlier, keep the mozzarella and tomatoes refrigerated separately and add olive oil and basil just before serving to avoid sogginess.",
    },
    {
      question: "What variations can I try with this classic recipe?",
      answer:
        "You can add arugula or baby spinach for extra greens, sprinkle toasted pine nuts for crunch, or add a drizzle of pesto instead of plain basil. Some also like to add avocado slices or substitute balsamic vinegar with a balsamic glaze for a sweeter finish.",
    },
    {
      question: "How do I select the best tomatoes for Caprese Salad?",
      answer:
        "Choose ripe, firm, and fragrant tomatoes such as heirloom, vine-ripened, or Roma tomatoes. They should be juicy but not overly soft or mealy. The quality of tomatoes greatly influences the overall taste, so opt for fresh, in-season tomatoes whenever possible.",
    },
    {
      question: "Is Caprese Salad suitable for special diets?",
      answer:
        "Yes, Caprese Salad is naturally gluten-free, low-carb, and vegetarian. It can also be adapted for keto diets due to its high fat and protein content from mozzarella and olive oil. Just ensure any optional ingredients align with your dietary needs.",
    },
    {
      question: "How should I store leftovers?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 1 day. To maintain freshness, keep the dressing separate and add it just before serving. Note that the salad may release water and the texture of the mozzarella might change after refrigeration.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Caprese Salad"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 10m | Cook: 0m
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
            Caprese Salad is a quintessential Italian dish that celebrates the
            simplicity and freshness of its ingredients. Originating from the
            island of Capri, this salad combines ripe tomatoes, creamy fresh
            mozzarella, and fragrant basil leaves, all drizzled with high-quality
            extra virgin olive oil and a splash of balsamic vinegar. Its vibrant
            colors mirror the Italian flag, making it as visually appealing as it
            is delicious.
          </p>
          <p>
            This salad is perfect as a light appetizer or a refreshing side dish,
            especially during the summer months when tomatoes and basil are at
            their peak. The balance of creamy, tangy, and herbaceous flavors makes
            it a timeless classic that’s easy to prepare yet impressive to serve.
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
              Prepare the Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slice the fresh mozzarella and ripe tomatoes into even, approximately
              1/4-inch thick slices. Rinse the basil leaves gently and pat dry.
              If using optional ingredients like arugula or pine nuts, prepare them
              accordingly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Arrange the Salad
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              On a large serving plate, alternate slices of tomato and mozzarella,
              slightly overlapping them. Tuck fresh basil leaves between the slices
              for an aromatic touch. If using arugula, spread it as a bed beneath
              the slices.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Dress the Salad
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Drizzle extra virgin olive oil evenly over the salad, followed by a
              light splash of balsamic vinegar. Season with sea salt and freshly
              ground black pepper to taste. Optionally, sprinkle toasted pine nuts
              or capers for added texture and flavor.
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
              Serve the Caprese Salad immediately to enjoy the fresh flavors and
              textures at their best. It pairs wonderfully with crusty bread or as
              a side to grilled meats and seafood.
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
            Use the freshest ingredients possible — the quality of mozzarella,
            tomatoes, and basil makes all the difference.
          </li>
          <li>
            For a sweeter balsamic flavor, consider using a balsamic glaze or
            reduction instead of plain vinegar.
          </li>
          <li>
            Toast pine nuts lightly in a dry pan until golden to add a delightful
            crunch and nutty aroma.
          </li>
          <li>
            If you prefer a garlicky note, rub the serving plate lightly with a
            cut garlic clove before arranging the salad.
          </li>
          <li>
            Serve the salad at room temperature to maximize flavor and aroma.
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