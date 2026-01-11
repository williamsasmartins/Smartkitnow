import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorchataCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Horchata%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4205"
  );

  // --- DATA ---
  const title = "Horchata";
  const description = "Bebida doce e cremosa de arroz, canela e baunilha.";

  // INGREDIENTS
  const ingredients = [
    { name: "White Rice (uncooked)", baseAmount: 150, unit: "g" },
    { name: "Water (for soaking)", baseAmount: 500, unit: "ml" },
    { name: "Whole Milk", baseAmount: 500, unit: "ml" },
    { name: "Sweetened Condensed Milk", baseAmount: 120, unit: "ml" },
    { name: "Granulated Sugar", baseAmount: 80, unit: "g" },
    { name: "Ground Cinnamon", baseAmount: 2, unit: "tsp" },
    { name: "Vanilla Extract", baseAmount: 1, unit: "tsp" },
    { name: "Ice Cubes", baseAmount: 200, unit: "g" },
    { name: "Almonds (optional)", baseAmount: 30, unit: "g" },
    { name: "Evaporated Milk (optional)", baseAmount: 100, unit: "ml" },
    { name: "Salt", baseAmount: 0.25, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "210",
    protein: "5g",
    carbs: "35g",
    fat: "4g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is horchata and where does it originate from?",
      answer:
        "Horchata is a traditional sweet and creamy beverage made primarily from rice, cinnamon, and vanilla. It originates from Spain but has become especially popular in Mexico and other Latin American countries, where regional variations exist. The drink is known for its refreshing qualities and subtle spice notes.",
    },
    {
      question: "Can I make horchata vegan or dairy-free?",
      answer:
        "Yes, you can easily make horchata vegan by substituting whole milk and condensed milk with plant-based alternatives such as almond milk, oat milk, or coconut milk. Use a vegan sweetened condensed milk or simply increase the sugar to maintain sweetness.",
    },
    {
      question: "How long should I soak the rice for the best flavor?",
      answer:
        "Soaking the rice for at least 4 hours, preferably overnight, allows the grains to soften and release their starches, which contributes to the creamy texture and rich flavor of horchata. Longer soaking results in a smoother and more flavorful drink.",
    },
    {
      question: "Can I prepare horchata in advance and store it?",
      answer:
        "Absolutely! Horchata can be prepared a day ahead and stored in the refrigerator for up to 3 days. Make sure to stir or shake well before serving, as some ingredients may settle or separate over time.",
    },
    {
      question: "What are some common variations of horchata?",
      answer:
        "Besides the classic rice-based horchata, variations include using tiger nuts (known as 'horchata de chufa' in Spain), almonds, or other grains. Some recipes add evaporated milk for extra creaminess or spices like nutmeg and cloves for additional aroma.",
    },
    {
      question: "Is horchata served hot or cold?",
      answer:
        "Horchata is traditionally served chilled or over ice, making it a refreshing beverage especially during warm weather. However, some variations can be gently warmed for a comforting drink in cooler seasons.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Horchata"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 10m | Soak: 4h+ | Blend: 10m
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Horchata is a beloved traditional beverage known for its sweet, creamy texture and aromatic cinnamon flavor. Made primarily from soaked rice, milk, sugar, and vanilla, this refreshing drink is perfect for warm days or as a delightful accompaniment to spicy meals. Its smooth consistency and subtle spices make it a comforting and indulgent treat enjoyed by many.
          </p>
          <p>
            The origins of horchata trace back to Spain, where it was originally made from tiger nuts (chufa). The recipe evolved as it traveled to Latin America, especially Mexico, where rice became the primary base ingredient. Over time, horchata has become a cultural staple, with each region adding its own unique touches and variations to this classic drink.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Soak the Rice and Almonds</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the white rice thoroughly under cold water until the water runs clear. Place the rice and optional almonds in a large bowl and cover with 500 ml of water. Let soak for at least 4 hours or overnight to soften the grains and nuts.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Blend the Mixture</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Drain the soaking water, reserving it. Add the soaked rice and almonds to a blender along with 500 ml fresh water and blend until smooth, about 2-3 minutes. Strain the mixture through a fine mesh sieve or cheesecloth into a pitcher to remove solids.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Milk and Flavorings</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the whole milk, sweetened condensed milk, granulated sugar, ground cinnamon, vanilla extract, evaporated milk (if using), and a pinch of salt. Mix well until the sugar dissolves completely.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Chill and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Refrigerate the horchata for at least 1 hour before serving. Serve over ice cubes for a refreshing experience. Stir well before pouring as ingredients may settle.
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
            For a smoother texture, blend the soaked rice and almonds longer and strain twice through a fine sieve or cheesecloth.
          </li>
          <li>
            Adjust sweetness by varying the amount of sweetened condensed milk and sugar to your preference.
          </li>
          <li>
            Adding a pinch of salt enhances the flavors and balances the sweetness.
          </li>
          <li>
            Use fresh cinnamon sticks to infuse the soaking water for a more intense cinnamon aroma.
          </li>
          <li>
            Horchata tastes best chilled; prepare it a few hours ahead to let the flavors meld.
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
              href="https://en.wikipedia.org/wiki/Horchata"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Horchata
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/mexican-horchata-recipe-2342825"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Mexican Horchata Recipe
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