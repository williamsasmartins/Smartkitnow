import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TiramisuCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Tiramisu%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9782"
  );

  // --- DATA ---
  const title = "Tiramisu";
  const description = "Layered dessert of coffee-soaked ladyfingers, mascarpone, and cocoa.";

  // INGREDIENTS
  const ingredients = [
    { name: "Mascarpone Cheese", baseAmount: 500, unit: "g" },
    { name: "Egg Yolks", baseAmount: 5, unit: "large" },
    { name: "Granulated Sugar", baseAmount: 150, unit: "g" },
    { name: "Ladyfingers (Savoiardi)", baseAmount: 200, unit: "g" },
    { name: "Strong Espresso Coffee", baseAmount: 300, unit: "ml" },
    { name: "Marsala Wine (or Coffee Liqueur)", baseAmount: 60, unit: "ml" },
    { name: "Heavy Cream", baseAmount: 200, unit: "ml" },
    { name: "Unsweetened Cocoa Powder", baseAmount: 15, unit: "g" },
    { name: "Dark Chocolate Shavings (optional)", baseAmount: 30, unit: "g" },
    { name: "Vanilla Extract", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "pinch" },
  ];

  // Approximate nutrition per serving (4 servings)
  const nutrition = {
    calories: "450",
    protein: "7g",
    carbs: "35g",
    fat: "30g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the origin of Tiramisu?",
      answer:
        "Tiramisu originated in the Veneto region of Italy during the 1960s or 1970s. It is believed to have been created as a luxurious yet simple dessert combining coffee, mascarpone, and cocoa, quickly gaining popularity worldwide for its rich flavors and creamy texture.",
    },
    {
      question: "Can I make Tiramisu without raw eggs?",
      answer:
        "Yes, you can substitute raw egg yolks with pasteurized eggs or use whipped heavy cream to achieve a similar creamy texture. Some recipes also use mascarpone combined with whipped cream and gelatin for a safer alternative.",
    },
    {
      question: "How should I store Tiramisu?",
      answer:
        "Tiramisu should be refrigerated and covered tightly with plastic wrap or a lid. It is best consumed within 2-3 days to enjoy optimal freshness and texture. The flavors tend to meld and improve after a few hours in the fridge.",
    },
    {
      question: "Can I prepare Tiramisu in advance?",
      answer:
        "Absolutely! Tiramisu is often made a day ahead to allow the flavors to develop fully. Just ensure it is refrigerated and covered properly to prevent it from drying out or absorbing other fridge odors.",
    },
    {
      question: "What type of coffee is best for soaking ladyfingers?",
      answer:
        "Use freshly brewed strong espresso or very strong coffee for soaking the ladyfingers. Avoid overly diluted coffee to maintain the dessert’s rich coffee flavor without making the ladyfingers soggy.",
    },
    {
      question: "Can I use alcohol-free versions of Tiramisu?",
      answer:
        "Yes, you can omit the Marsala wine or coffee liqueur and replace it with additional coffee or a flavored syrup. This makes the dessert suitable for all ages while retaining its characteristic taste.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Tiramisu"
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
            Tiramisu is a classic Italian dessert that masterfully combines layers
            of coffee-soaked ladyfingers with a luscious mascarpone cream, dusted
            generously with cocoa powder. Its name, meaning "pick me up" in Italian,
            reflects the energizing combination of espresso and rich ingredients,
            making it a beloved treat worldwide.
          </p>
          <p>
            Originating from the Veneto region in the late 20th century, tiramisu
            has become a symbol of Italian culinary ingenuity. The dessert's
            harmonious balance of bold coffee flavors, creamy texture, and subtle
            sweetness has inspired countless variations while preserving its
            authentic charm.
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
              Prepare the Coffee Mixture
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Brew strong espresso and let it cool slightly. Mix in the Marsala wine
              or coffee liqueur. Set aside for soaking the ladyfingers.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Whisk Egg Yolks and Sugar
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a heatproof bowl, whisk egg yolks and sugar over a simmering water
              bath until the mixture is pale, thick, and doubled in volume. Remove
              from heat and let cool.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Combine Mascarpone and Egg Mixture
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Gently fold the mascarpone cheese into the cooled egg yolk mixture
              until smooth and creamy.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Whip the Cream
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a separate bowl, whip the heavy cream with vanilla extract and a
              pinch of salt until soft peaks form. Fold the whipped cream gently
              into the mascarpone mixture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Tiramisu
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Quickly dip each ladyfinger into the coffee mixture (do not soak),
              then layer them in a serving dish. Spread half of the mascarpone cream
              over the ladyfingers. Repeat with another layer of dipped ladyfingers
              and the remaining cream.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Chill and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Refrigerate the tiramisu for at least 4 hours or overnight to allow
              flavors to meld. Before serving, dust the top generously with
              unsweetened cocoa powder and sprinkle optional dark chocolate
              shavings.
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
            Use fresh, high-quality mascarpone for the creamiest texture and best
            flavor.
          </li>
          <li>
            Avoid soaking ladyfingers too long in coffee to prevent a soggy dessert;
            a quick dip is sufficient.
          </li>
          <li>
            For a safer alternative to raw eggs, consider using pasteurized eggs or
            substituting with whipped cream.
          </li>
          <li>
            Letting the tiramisu rest overnight enhances the melding of flavors and
            improves texture.
          </li>
          <li>
            Dust cocoa powder just before serving to keep it vibrant and prevent
            moisture absorption.
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
