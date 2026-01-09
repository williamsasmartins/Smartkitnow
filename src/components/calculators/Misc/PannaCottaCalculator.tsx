import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PannaCottaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Panna%20Cotta%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4390"
  );

  // --- DATA ---
  const title = "Panna Cotta";
  const description = "Silky cooked cream dessert, often served with berry sauce.";

  // INGREDIENTS
  const ingredients = [
    { name: "Heavy Cream", baseAmount: 500, unit: "ml" },
    { name: "Whole Milk", baseAmount: 120, unit: "ml" },
    { name: "Granulated Sugar", baseAmount: 100, unit: "g" },
    { name: "Gelatin Sheets", baseAmount: 4, unit: "sheets" },
    { name: "Vanilla Bean (split and scraped)", baseAmount: 1, unit: "bean" },
    { name: "Water (for gelatin bloom)", baseAmount: 60, unit: "ml" },
    { name: "Fresh Berries (for serving)", baseAmount: 150, unit: "g" },
    { name: "Lemon Juice (optional, for berry sauce)", baseAmount: 15, unit: "ml" },
    { name: "Powdered Sugar (for berry sauce)", baseAmount: 30, unit: "g" },
    { name: "Mint Leaves (for garnish)", baseAmount: 8, unit: "leaves" },
    { name: "Salt (a pinch)", baseAmount: 1, unit: "pinch" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "350",
    protein: "4g",
    carbs: "20g",
    fat: "30g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the best type of gelatin to use for panna cotta?",
      answer:
        "The best gelatin for panna cotta is high-quality, unflavored gelatin sheets or powder. Gelatin sheets provide a smoother texture and are easier to measure consistently. Always bloom gelatin in cold water before dissolving it into the warm cream mixture to ensure even setting without lumps.",
    },
    {
      question: "Can I make panna cotta vegan or dairy-free?",
      answer:
        "Yes, panna cotta can be made vegan or dairy-free by substituting dairy cream with coconut cream or other plant-based creams, and using agar-agar instead of gelatin as a setting agent. Agar-agar requires different preparation and setting times, so follow specific instructions for agar-based panna cotta.",
    },
    {
      question: "How long should panna cotta be chilled before serving?",
      answer:
        "Panna cotta should be chilled for at least 4 hours, preferably overnight, to allow it to fully set and develop its silky texture. Chilling it longer improves firmness and flavor melding. Avoid freezing as it can alter the texture negatively.",
    },
    {
      question: "What are some popular toppings or sauces for panna cotta?",
      answer:
        "Popular toppings include fresh berries, berry coulis, caramel sauce, chocolate ganache, or a drizzle of honey. Fresh mint leaves or edible flowers add a beautiful garnish. The subtle flavor of panna cotta pairs well with both tart and sweet accompaniments.",
    },
    {
      question: "How can I tell if my panna cotta has set properly?",
      answer:
        "Properly set panna cotta should be firm enough to hold its shape when unmolded or scooped, yet still tender and silky on the palate. It should not be runny or overly stiff. If it jiggles slightly when shaken, it’s a good sign of perfect set.",
    },
    {
      question: "Can panna cotta be prepared in advance for events?",
      answer:
        "Absolutely! Panna cotta is an excellent make-ahead dessert. Prepare and chill it up to 2 days in advance, keeping it covered in the refrigerator. Add fresh toppings just before serving to maintain freshness and presentation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Panna Cotta"
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
                    {ing.unit === "sheets" || ing.unit === "bean" || ing.unit === "pinch" || ing.unit === "leaves"
                      ? getAmount(ing.baseAmount).replace(".0", "") + " " + ing.unit
                      : getAmount(ing.baseAmount) + " " + ing.unit}
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
            Panna Cotta is a classic Italian dessert known for its silky, creamy texture and delicate flavor. Made primarily from cream, sugar, and gelatin, it is gently cooked and then chilled until set. Often served with a vibrant berry sauce or fresh fruit, panna cotta offers a perfect balance of richness and lightness, making it a favorite in fine dining and home kitchens alike.
          </p>
          <p>
            Originating from the Piedmont region of Northern Italy, panna cotta translates to "cooked cream." Traditionally, it was a rustic dessert prepared by farmers using simple ingredients. Over time, it has evolved into a sophisticated dish celebrated worldwide for its elegant simplicity and versatility in flavor pairings.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare Gelatin</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Soak the gelatin sheets in cold water for about 5-10 minutes until soft. If using powdered gelatin, sprinkle it over the cold water and let it bloom for 5 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Heat Cream Mixture</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a saucepan, combine heavy cream, whole milk, granulated sugar, a pinch of salt, and the scraped vanilla bean along with its pod. Heat gently over medium heat until the sugar dissolves and the mixture is hot but not boiling.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Incorporate Gelatin</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the vanilla pod from the cream mixture. Squeeze excess water from the gelatin sheets and stir them into the warm cream until fully dissolved. If using powdered gelatin, stir it in until smooth.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Pour and Chill</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the mixture into individual molds or serving glasses. Allow to cool slightly at room temperature, then refrigerate for at least 4 hours or until fully set.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare Berry Sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small saucepan, combine fresh berries, powdered sugar, and lemon juice. Cook over medium heat until the berries break down and the sauce thickens slightly. Cool before serving.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Unmold panna cotta onto plates or serve directly in glasses. Spoon the berry sauce over the top and garnish with fresh mint leaves for a refreshing finish.
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
            Use high-quality fresh cream and vanilla beans for the best flavor and texture.
          </li>
          <li>
            Bloom gelatin properly to avoid lumps and ensure a smooth set.
          </li>
          <li>
            Avoid boiling the cream mixture as it can affect the texture and flavor.
          </li>
          <li>
            Customize your panna cotta by infusing the cream with herbs like lavender or citrus zest.
          </li>
          <li>
            For easy unmolding, lightly oil molds or dip them briefly in hot water before inverting.
          </li>
          <li>
            Chill panna cotta overnight for optimal texture and flavor development.
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