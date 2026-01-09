import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BiscottiCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Biscotti%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3412"
  );

  // --- DATA ---
  const title = "Biscotti";
  const description = "Twice-baked almond cookies, perfect for dipping in coffee or vin santo.";

  // INGREDIENTS
  const ingredients = [
    { name: "All-purpose flour", baseAmount: 300, unit: "g" },
    { name: "Granulated sugar", baseAmount: 200, unit: "g" },
    { name: "Whole almonds (toasted)", baseAmount: 150, unit: "g" },
    { name: "Large eggs", baseAmount: 3, unit: "pcs" },
    { name: "Baking powder", baseAmount: 1.5, unit: "tsp" },
    { name: "Vanilla extract", baseAmount: 1, unit: "tsp" },
    { name: "Almond extract", baseAmount: 0.5, unit: "tsp" },
    { name: "Salt", baseAmount: 0.5, unit: "tsp" },
    { name: "Unsalted butter (melted)", baseAmount: 50, unit: "g" },
    { name: "Zest of 1 lemon", baseAmount: 1, unit: "pcs" },
    { name: "Powdered sugar (for dusting)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per 4 servings (approximate)
  const nutrition = {
    calories: "420",
    protein: "9g",
    carbs: "60g",
    fat: "14g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes biscotti different from other cookies?",
      answer:
        "Biscotti are unique because they are baked twice. The first bake shapes the dough into logs, and after cooling, the logs are sliced and baked again to create their signature dry, crunchy texture. This twice-baking process makes them perfect for dipping in coffee or sweet wines without becoming soggy.",
    },
    {
      question: "Can I use other nuts besides almonds?",
      answer:
        "Absolutely! While traditional biscotti often use almonds, you can substitute or combine with other nuts like pistachios, hazelnuts, or walnuts. Toasting the nuts beforehand enhances their flavor and crunch.",
    },
    {
      question: "How should I store biscotti to keep them fresh?",
      answer:
        "Store biscotti in an airtight container at room temperature. They can stay fresh for up to two weeks. For longer storage, you can freeze them in a sealed bag for up to three months and thaw before serving.",
    },
    {
      question: "Can biscotti dough be made ahead of time?",
      answer:
        "Yes, you can prepare the dough a day in advance and refrigerate it tightly wrapped. This can help the flavors meld and make shaping easier. Just bring the dough back to room temperature before baking.",
    },
    {
      question: "How do I achieve the perfect crunch without overbaking?",
      answer:
        "Bake the biscotti logs until golden but not fully cooked in the first bake. After slicing, bake the slices at a lower temperature to dry them out evenly. Keep a close eye during the second bake to avoid burning; the goal is a dry, crisp texture rather than a hard, burnt cookie.",
    },
    {
      question: "Are biscotti gluten-free or can they be made gluten-free?",
      answer:
        "Traditional biscotti use wheat flour and are not gluten-free. However, you can substitute with gluten-free all-purpose flour blends designed for baking. Keep in mind that texture and rise might vary slightly, so some experimentation may be needed.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Biscotti"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 50m
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
            Biscotti, also known as cantucci, are traditional Italian twice-baked cookies originating from the Tuscan region. Known for their dry, crunchy texture, these almond-studded treats are perfect for dipping into coffee, tea, or sweet dessert wines like vin santo. Their unique preparation involves baking the dough twice, which gives them their signature crispness and long shelf life.
          </p>
          <p>
            Historically, biscotti were made as a durable travel snack for Roman soldiers, prized for their ability to stay fresh for long periods. Over centuries, they evolved into a beloved Italian dessert enjoyed worldwide. The classic almond biscotti recipe has inspired countless variations, incorporating different nuts, spices, and flavorings, but the essence remains the same: a crunchy, flavorful cookie that pairs beautifully with beverages.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the almonds</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 350°F (175°C). Spread the whole almonds on a baking sheet and toast them for about 8-10 minutes until fragrant and lightly browned. Let them cool, then roughly chop and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Mix dry ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, whisk together the all-purpose flour, baking powder, salt, and granulated sugar until evenly combined.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine wet ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a separate bowl, beat the eggs with vanilla extract, almond extract, melted butter, and lemon zest until smooth.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Form the dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Gradually add the wet ingredients to the dry ingredients, mixing with a spatula or your hands until a sticky dough forms. Fold in the toasted almonds evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Shape and first bake</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Divide the dough into two equal parts. On a parchment-lined baking sheet, shape each portion into a log about 12 inches long and 2-3 inches wide. Bake at 350°F (175°C) for 25-30 minutes until golden and firm to the touch. Remove from oven and let cool for 10 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Slice and second bake</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Using a serrated knife, slice the logs diagonally into 1/2-inch thick pieces. Arrange the slices cut side down on the baking sheet. Bake again at 325°F (160°C) for 15-20 minutes, flipping halfway through, until crisp and dry. Let cool completely.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              7
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve and store</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Dust with powdered sugar if desired. Serve biscotti with coffee, tea, or dessert wine. Store in an airtight container at room temperature for up to two weeks.
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
            Toast the almonds lightly to enhance their flavor and crunch, but avoid burning them as it will impart bitterness.
          </li>
          <li>
            Use a serrated knife for slicing the biscotti logs to prevent crumbling and achieve clean edges.
          </li>
          <li>
            Adjust the second bake time depending on your oven and desired crunchiness; biscotti should be dry but not burnt.
          </li>
          <li>
            For a festive twist, dip one end of the cooled biscotti in melted dark or white chocolate and let it set.
          </li>
          <li>
            If the dough feels too sticky to handle, chill it for 15-20 minutes before shaping the logs.
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