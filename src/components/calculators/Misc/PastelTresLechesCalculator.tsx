import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PastelTresLechesCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Tres%20Leches%20Cake%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9512"
  );

  // --- DATA ---
  const title = "Tres Leches Cake";
  const description = "Bolo embebido em três leites, bem úmido e doce.";

  // INGREDIENTS
  const ingredients = [
    { name: "All-purpose flour", baseAmount: 120, unit: "g" },
    { name: "Baking powder", baseAmount: 1.5, unit: "tsp" },
    { name: "Salt", baseAmount: 0.25, unit: "tsp" },
    { name: "Large eggs (room temperature)", baseAmount: 4, unit: "pcs" },
    { name: "Granulated sugar", baseAmount: 200, unit: "g" },
    { name: "Whole milk", baseAmount: 120, unit: "ml" },
    { name: "Vanilla extract", baseAmount: 1, unit: "tsp" },
    { name: "Sweetened condensed milk", baseAmount: 400, unit: "g" },
    { name: "Evaporated milk", baseAmount: 370, unit: "ml" },
    { name: "Heavy cream", baseAmount: 240, unit: "ml" },
    { name: "Powdered sugar (for whipped cream)", baseAmount: 30, unit: "g" },
    { name: "Heavy cream (for whipped cream)", baseAmount: 240, unit: "ml" },
    { name: "Ground cinnamon (optional, for garnish)", baseAmount: 1, unit: "tsp" },
    { name: "Fresh strawberries or cherries (optional, for garnish)", baseAmount: 100, unit: "g" },
  ];

  // Nutrition estimates per serving (approximate)
  const nutrition = {
    calories: "450",
    protein: "8g",
    carbs: "60g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Tres Leches Cake?",
      answer:
        "Tres Leches Cake is a traditional Latin American dessert consisting of a light sponge cake soaked in three types of milk: evaporated milk, condensed milk, and heavy cream. This soaking process makes the cake incredibly moist and rich, giving it its signature texture and flavor.",
    },
    {
      question: "Can I make Tres Leches Cake dairy-free?",
      answer:
        "Yes, you can substitute dairy milks with plant-based alternatives such as coconut milk, almond milk, or oat milk. Use sweetened condensed coconut milk and coconut cream to maintain the creamy texture. However, the flavor and texture will differ slightly from the traditional version.",
    },
    {
      question: "How do I store Tres Leches Cake?",
      answer:
        "Because Tres Leches Cake is soaked with milk, it should be stored in the refrigerator in an airtight container. It is best consumed within 3 to 4 days. The cake may become soggier over time, so serving it fresh is ideal.",
    },
    {
      question: "Can I prepare Tres Leches Cake in advance?",
      answer:
        "Yes, you can bake the cake and prepare the milk mixture a day ahead. After soaking the cake with the milk mixture, refrigerate it overnight to allow the flavors to meld and the cake to absorb the liquid fully. Add whipped cream and garnish just before serving.",
    },
    {
      question: "What are some common garnishes for Tres Leches Cake?",
      answer:
        "Common garnishes include freshly whipped cream, a dusting of ground cinnamon, fresh fruits like strawberries or cherries, and sometimes toasted coconut flakes. These add texture, color, and complementary flavors to the rich cake.",
    },
    {
      question: "Why is my Tres Leches Cake soggy?",
      answer:
        "If the cake is overly soggy, it may have absorbed too much milk or the milk mixture was poured too quickly. To avoid this, poke holes gently and pour the milk mixture slowly, allowing the cake to absorb it gradually. Using a denser cake base can also help control sogginess.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Tres Leches Cake"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 25m
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
            Tres Leches Cake is a luscious and moist dessert beloved throughout Latin America. Its name means
            "three milks," referring to the trio of dairy products—evaporated milk, condensed milk, and heavy cream—that
            saturate the light sponge cake, creating a rich and creamy texture that melts in your mouth. This cake is
            perfect for celebrations or any time you crave a sweet, indulgent treat.
          </p>
          <p>
            The origins of Tres Leches Cake are debated, with influences from Mexican, Nicaraguan, and other Latin American
            cuisines. It likely evolved from European sponge cakes soaked in milk mixtures, adapted with local ingredients
            and tastes. Today, it stands as a cultural icon, enjoyed across borders and cherished for its unique moistness
            and sweet flavor.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Cake Batter</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 175°C (350°F). In a bowl, sift together the flour, baking powder, and salt. In a
              separate large bowl, beat the eggs and granulated sugar with an electric mixer on high speed until pale,
              fluffy, and tripled in volume (about 5-7 minutes). Gently fold in the dry ingredients alternately with the
              milk and vanilla extract, being careful not to deflate the batter.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Bake the Cake</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the batter into a greased 9x13 inch (23x33 cm) baking pan. Bake for 25-30 minutes or until a toothpick
              inserted into the center comes out clean. Remove from the oven and allow the cake to cool completely in the
              pan.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Milk Mixture</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large measuring cup or bowl, whisk together the sweetened condensed milk, evaporated milk, and heavy
              cream until fully combined.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Soak the Cake</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Using a fork or skewer, poke holes all over the cooled cake. Slowly pour the milk mixture evenly over the
              cake, allowing it to absorb the liquid gradually. Cover and refrigerate for at least 4 hours, preferably
              overnight.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Whipped Cream Topping</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a chilled bowl, beat the heavy cream with powdered sugar until stiff peaks form. Spread the whipped
              cream evenly over the soaked cake.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Garnish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Optionally, dust the top with ground cinnamon and garnish with fresh strawberries or cherries. Slice and
              serve chilled.
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
            Use room temperature eggs for better volume when whipping the batter, resulting in a lighter cake.
          </li>
          <li>
            Pour the milk mixture slowly and evenly to avoid oversaturating one area and making the cake soggy.
          </li>
          <li>
            Refrigerate the cake overnight to allow the flavors to meld and the cake to fully absorb the milk mixture.
          </li>
          <li>
            For a festive touch, add fresh fruit or a sprinkle of toasted coconut on top of the whipped cream.
          </li>
          <li>
            If you prefer a less sweet cake, reduce the amount of sweetened condensed milk slightly.
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
              href="https://en.wikipedia.org/wiki/Tres_leches_cake"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Tres Leches Cake
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Tres-Leches-Cake/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Tres Leches Cake Recipe & History
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