import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ItalianIceGranitaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Italian%20Ice%20Granita%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2861"
  );

  // --- DATA ---
  const title = "Italian Ice (Granita)";
  const description = "Icy refreshing dessert with intense fruit flavor, like lemon or almond.";

  // INGREDIENTS
  const ingredients = [
    { name: "Water", baseAmount: 600, unit: "ml" },
    { name: "Granulated Sugar", baseAmount: 200, unit: "g" },
    { name: "Fresh Lemon Juice", baseAmount: 150, unit: "ml" },
    { name: "Lemon Zest", baseAmount: 1, unit: "tbsp" },
    { name: "Almond Extract", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1 / 8, unit: "tsp" },
    { name: "Fresh Mint Leaves (optional)", baseAmount: 5, unit: "leaves" },
    { name: "Fresh Strawberries (optional)", baseAmount: 200, unit: "g" },
    { name: "Orange Juice (optional)", baseAmount: 100, unit: "ml" },
    { name: "Coffee (optional)", baseAmount: 100, unit: "ml" },
    { name: "Vanilla Extract (optional)", baseAmount: 1, unit: "tsp" },
    { name: "Ice Cubes (for serving)", baseAmount: 0, unit: "" },
  ];

  // Nutrition facts per serving (approximate)
  const nutrition = {
    calories: "150",
    protein: "0.1g",
    carbs: "38g",
    fat: "0g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the difference between Italian Ice and Granita?",
      answer:
        "Italian Ice and Granita are very similar frozen desserts made from sugar, water, and flavorings. Granita traditionally has a coarser, more crystalline texture and is often scraped during freezing to create a flaky consistency, while Italian Ice is smoother and more uniform. However, the terms are often used interchangeably depending on the region.",
    },
    {
      question: "Can I use other fruits besides lemon for Italian Ice?",
      answer:
        "Absolutely! Italian Ice is very versatile and can be made with a variety of fruit juices and purees such as strawberry, orange, watermelon, coffee, or almond flavoring. Adjust the sugar content depending on the sweetness of the fruit to maintain balance.",
    },
    {
      question: "How do I achieve the perfect texture for Italian Ice?",
      answer:
        "The key to perfect Italian Ice texture is to freeze the mixture while stirring or scraping it every 30 minutes to break up ice crystals. This prevents it from freezing solid and creates a light, granular texture. Using an ice cream maker can also help achieve a smooth consistency.",
    },
    {
      question: "Can I prepare Italian Ice ahead of time?",
      answer:
        "Yes, Italian Ice can be made ahead and stored in the freezer for up to a week. Before serving, let it sit at room temperature for 5-10 minutes and then scrape or stir to restore its granular texture.",
    },
    {
      question: "Is Italian Ice suitable for people with dietary restrictions?",
      answer:
        "Italian Ice is naturally dairy-free and vegan, making it suitable for those with lactose intolerance or following a plant-based diet. It is also gluten-free. However, always check ingredient labels if using extracts or flavorings to ensure they meet specific dietary needs.",
    },
    {
      question: "Can I use artificial sweeteners instead of sugar?",
      answer:
        "While you can use artificial sweeteners, sugar plays an important role in texture and freezing point depression. Using sugar substitutes may result in a harder or icier texture. If using sweeteners, experiment with small batches to find the best balance.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Italian Ice (Granita)"
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
                    {ing.baseAmount === 0
                      ? ""
                      : `${getAmount(ing.baseAmount)} ${ing.unit}`}
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
            Italian Ice, also known as Granita in Sicily, is a refreshing frozen
            dessert made from simple ingredients like water, sugar, and natural
            fruit flavors. Its icy texture and intense fruitiness make it a
            perfect treat for warm weather, offering a light and palate-cleansing
            experience. This recipe highlights the classic lemon flavor, but the
            versatility of Italian Ice allows for endless variations using fresh
            fruits and extracts.
          </p>
          <p>
            The origins of Italian Ice trace back to ancient times when crushed
            ice was combined with fruit juices or honey to create a cooling
            dessert. Granita, specifically from Sicily, is renowned for its
            granular texture achieved by periodically scraping the mixture during
            freezing. Over centuries, Italian Ice has become a beloved staple in
            Italian cuisine and beyond, celebrated for its simplicity, natural
            ingredients, and refreshing qualities.
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
              Prepare the Simple Syrup
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a medium saucepan, combine the water and granulated sugar. Heat
              gently over medium heat, stirring until the sugar dissolves
              completely. Remove from heat and let the syrup cool to room
              temperature.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Flavorings
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the fresh lemon juice, lemon zest, almond extract, and a
              pinch of salt into the cooled syrup. If using optional flavors like
              fresh strawberries or orange juice, blend them separately and mix
              into the syrup.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Freeze and Scrape
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the mixture into a shallow metal or glass pan and place it in
              the freezer. Every 30 minutes, use a fork to scrape and break up
              the forming ice crystals. Repeat this process 4-5 times until the
              granita is fully frozen with a fluffy, granular texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Enjoy
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Scoop the Italian Ice into chilled glasses or bowls. Garnish with
              fresh mint leaves or lemon slices if desired. Serve immediately for
              the best texture and refreshing taste.
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
            Use a shallow pan for freezing to increase the surface area and speed
            up the freezing and scraping process.
          </li>
          <li>
            Adjust sugar levels based on the sweetness and acidity of your fruit
            juice to maintain a balanced flavor.
          </li>
          <li>
            For a smoother texture, you can use an ice cream maker instead of
            manual scraping.
          </li>
          <li>
            Add a pinch of salt to enhance the fruit flavors and balance the
            sweetness.
          </li>
          <li>
            Experiment with herbs like basil or mint for unique flavor twists.
          </li>
          <li>
            Serve Italian Ice in chilled glasses to keep it from melting too
            quickly.
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
