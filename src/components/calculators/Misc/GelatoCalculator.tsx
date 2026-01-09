import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GelatoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Gelato%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8953"
  );

  // --- DATA ---
  const title = "Gelato";
  const description = "Dense and creamy Italian ice cream in various flavors.";

  // INGREDIENTS
  const ingredients = [
    { name: "Whole Milk", baseAmount: 500, unit: "ml" },
    { name: "Heavy Cream", baseAmount: 150, unit: "ml" },
    { name: "Granulated Sugar", baseAmount: 150, unit: "g" },
    { name: "Glucose Syrup", baseAmount: 50, unit: "g" },
    { name: "Egg Yolks", baseAmount: 5, unit: "pcs" },
    { name: "Vanilla Bean (split and scraped)", baseAmount: 1, unit: "pc" },
    { name: "Salt", baseAmount: 1, unit: "pinch" },
    { name: "Cornstarch", baseAmount: 15, unit: "g" },
    { name: "Natural Flavorings (e.g. pistachio paste, cocoa powder)", baseAmount: 50, unit: "g" },
    { name: "Optional: Lemon Zest", baseAmount: 1, unit: "tsp" },
    { name: "Optional: Espresso Powder", baseAmount: 5, unit: "g" },
    { name: "Optional: Fresh Fruit Puree", baseAmount: 100, unit: "g" },
  ];

  // Nutrition values per 100g approx for classic vanilla gelato
  const nutrition = {
    calories: "210",
    protein: "4g",
    carbs: "24g",
    fat: "10g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes gelato different from regular ice cream?",
      answer:
        "Gelato contains less fat and air than traditional ice cream, resulting in a denser, creamier texture. It is churned at a slower speed, which incorporates less air, and is served at a slightly warmer temperature to enhance flavor and softness.",
    },
    {
      question: "Can I make gelato without an ice cream machine?",
      answer:
        "While an ice cream machine helps achieve the smooth texture of gelato by churning and freezing simultaneously, you can make gelato without one by freezing the mixture and stirring it vigorously every 30 minutes to break up ice crystals until fully frozen.",
    },
    {
      question: "How do I store gelato to maintain its quality?",
      answer:
        "Store gelato in an airtight container in the coldest part of your freezer. To prevent ice crystals, cover the surface with plastic wrap before sealing. Consume within 1-2 weeks for best texture and flavor.",
    },
    {
      question: "What are some popular gelato flavors?",
      answer:
        "Classic flavors include vanilla, pistachio, chocolate, hazelnut, stracciatella (chocolate chip), and fruit-based flavors like lemon, strawberry, and mango. Gelato often uses natural ingredients and less sugar to highlight authentic flavors.",
    },
    {
      question: "Can I substitute ingredients for dietary restrictions?",
      answer:
        "Yes, you can use plant-based milks like almond or oat milk and coconut cream for a dairy-free version, though texture and flavor will differ. For egg-free gelato, omit yolks and increase cornstarch slightly to maintain creaminess.",
    },
    {
      question: "Why is glucose syrup used in gelato recipes?",
      answer:
        "Glucose syrup helps prevent crystallization, improving the smoothness and scoopability of gelato. It also adds sweetness without overpowering the natural flavors.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Gelato"
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
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-base">
          <div>
            <div className="font-bold text-lg">{nutrition.calories}</div>
            <span className="font-bold uppercase text-slate-500">Kcal</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.protein}</div>
            <span className="font-bold uppercase text-slate-500">Prot</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.carbs}</div>
            <span className="font-bold uppercase text-slate-500">Carb</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.fat}</div>
            <span className="font-bold uppercase text-slate-500">Fat</span>
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
            Gelato is a traditional Italian frozen dessert known for its dense, creamy texture and intense flavors. Unlike typical ice cream, gelato uses more milk and less cream, and it is churned at a slower speed to incorporate less air, resulting in a richer mouthfeel. This recipe guides you through crafting authentic gelato at home, balancing classic ingredients like whole milk, egg yolks, and natural flavorings to create a luscious treat.
          </p>
          <p>
            Originating in Italy during the Renaissance, gelato has evolved into a beloved dessert worldwide. Its roots trace back to Sicilian and Florentine culinary traditions, where artisans perfected the art of freezing sweetened mixtures with natural ingredients. Today, gelato remains a symbol of Italian craftsmanship and culinary excellence, celebrated for its purity and vibrant flavors.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Base</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a medium saucepan, combine the whole milk, heavy cream, and vanilla bean (split and scraped). Heat gently over medium heat until just below boiling, then remove from heat and let infuse for 15 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Mix Egg Yolks and Sugar</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a separate bowl, whisk the egg yolks with granulated sugar and cornstarch until pale and slightly thickened. This mixture will help thicken the gelato base.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Temper the Eggs</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slowly pour about a third of the hot milk mixture into the egg yolk mixture while whisking constantly to temper the eggs. Then pour this combined mixture back into the saucepan with the remaining milk.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Custard</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Return the saucepan to medium-low heat and cook, stirring constantly with a wooden spoon or spatula, until the mixture thickens enough to coat the back of the spoon (about 80°C/176°F). Do not boil.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cool and Add Flavorings</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove from heat and strain the custard through a fine sieve into a clean bowl. Stir in glucose syrup, salt, and any additional flavorings like pistachio paste or fruit puree. Cover and chill in the refrigerator for at least 4 hours or overnight.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Churn and Freeze</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the chilled custard into an ice cream machine and churn according to the manufacturer's instructions until it reaches a soft-serve consistency. Transfer to a container and freeze for at least 2 hours before serving.
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
            Use fresh, high-quality ingredients, especially milk and eggs, to ensure the best flavor and texture.
          </li>
          <li>
            Avoid overheating the custard to prevent curdling; cook gently and stir constantly.
          </li>
          <li>
            For a silkier texture, strain the custard before chilling to remove any cooked egg bits.
          </li>
          <li>
            Experiment with natural flavorings like fresh fruit purees, nuts, or espresso to create unique gelato varieties.
          </li>
          <li>
            Serve gelato slightly softened at room temperature for the best creamy mouthfeel.
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