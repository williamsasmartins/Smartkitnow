import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GuavaCheeseDessertRomeuEJulietaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Guava%20and%20Cheese%20Dessert%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=850"
  );

  // --- DATA ---
  const title = "Guava and Cheese Dessert";
  const description = "The perfect pairing of guava paste and mild white cheese.";

  // INGREDIENTS
  const ingredients = [
    { name: "Guava Paste (Goiabada)", baseAmount: 300, unit: "g" },
    { name: "Mild White Cheese (e.g., Minas Cheese or Mozzarella)", baseAmount: 200, unit: "g" },
    { name: "Cream Cheese", baseAmount: 100, unit: "g" },
    { name: "Sweetened Condensed Milk", baseAmount: 150, unit: "ml" },
    { name: "Heavy Cream", baseAmount: 100, unit: "ml" },
    { name: "Granulated Sugar", baseAmount: 50, unit: "g" },
    { name: "Butter (unsalted)", baseAmount: 30, unit: "g" },
    { name: "All-purpose Flour", baseAmount: 100, unit: "g" },
    { name: "Eggs", baseAmount: 2, unit: "pcs" },
    { name: "Vanilla Extract", baseAmount: 5, unit: "ml" },
    { name: "Lime Zest", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "pinch" },
    { name: "Powdered Sugar (for dusting)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition estimates per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "7g",
    carbs: "40g",
    fat: "14g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the origin of the Guava and Cheese Dessert?",
      answer:
        "This dessert, known as 'Romeu e Julieta' in Brazil, combines guava paste and white cheese, symbolizing the perfect harmony of sweet and savory flavors. It originated in Brazilian cuisine and is inspired by the classic pairing of fruit preserves and cheese found in many cultures.",
    },
    {
      question: "Can I use other types of cheese for this dessert?",
      answer:
        "Yes, while Minas cheese is traditional, you can substitute with mild, creamy cheeses like mozzarella, ricotta, or even cream cheese for a smoother texture. Avoid strong or aged cheeses as they may overpower the delicate sweetness of the guava paste.",
    },
    {
      question: "How should I store leftovers of this dessert?",
      answer:
        "Store leftovers covered in an airtight container in the refrigerator for up to 3 days. Bring to room temperature before serving to enhance the flavors and soften the cheese.",
    },
    {
      question: "Is this dessert suitable for special dietary needs?",
      answer:
        "This recipe contains dairy and eggs, so it is not suitable for vegans or those with lactose intolerance unless you use dairy-free substitutes. You can experiment with plant-based cream cheese and condensed milk alternatives to make it vegan-friendly.",
    },
    {
      question: "Can I prepare this dessert in advance?",
      answer:
        "Absolutely! The dessert can be assembled a few hours ahead or even the day before. Refrigerate it well-covered to allow the flavors to meld beautifully. Just add any fresh garnishes right before serving.",
    },
    {
      question: "What are some serving suggestions for this dessert?",
      answer:
        "Serve chilled or at room temperature, optionally dusted with powdered sugar or paired with fresh mint leaves. It pairs wonderfully with a cup of strong coffee or a light dessert wine.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Guava and Cheese Dessert"
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
            The Guava and Cheese Dessert, popularly known as "Romeu e Julieta," is a beloved Brazilian
            treat that masterfully combines the sweet, fruity richness of guava paste with the creamy,
            mild flavor of white cheese. This dessert is celebrated for its simplicity and the perfect
            balance of contrasting flavors and textures, making it a staple in Brazilian households and
            restaurants alike.
          </p>
          <p>
            The origin of this pairing dates back to colonial Brazil, where Portuguese culinary influences
            merged with local ingredients. The name "Romeu e Julieta" (Romeo and Juliet) poetically
            represents the harmonious union of two distinct elements, much like the famous Shakespearean
            lovers. Over time, this dessert has evolved into various forms, including cakes, tarts, and
            creamy desserts, but the classic combination remains a timeless favorite.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Guava Paste</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut the guava paste into small cubes or thin slices. If the paste is too firm, warm it slightly
              to soften for easier handling.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Cheese Layer</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slice the mild white cheese into thin pieces or crumble it if using cream cheese. Mix cream cheese,
              sweetened condensed milk, heavy cream, sugar, vanilla extract, lime zest, and a pinch of salt in a
              bowl until smooth and creamy.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Cake Base</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat the oven to 180°C (350°F). Cream the butter and sugar until fluffy. Add eggs one at a time,
              mixing well. Gradually add flour and mix until just combined. Pour the batter into a greased baking
              dish.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Layer the Dessert</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spread half of the guava paste evenly over the cake batter. Add a layer of the cheese mixture on top,
              then cover with the remaining guava paste. Optionally, add slices of white cheese on top for extra
              texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Bake and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bake for about 25-30 minutes or until the cake is golden and set. Let it cool slightly before slicing.
              Dust with powdered sugar and serve warm or at room temperature.
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
            Use a mild, creamy cheese to balance the sweetness of the guava paste without overpowering it.
          </li>
          <li>
            For a smoother texture, blend the cheese mixture until completely creamy before layering.
          </li>
          <li>
            If guava paste is too firm, warm it gently in a microwave or double boiler to soften for easier spreading.
          </li>
          <li>
            Adding a pinch of lime zest enhances the freshness and complexity of the dessert.
          </li>
          <li>
            Serve with a drizzle of honey or a sprinkle of toasted nuts for added texture and flavor contrast.
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
              href="https://en.wikipedia.org/wiki/Guava_paste"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Guava Paste
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Brazilian-cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Brazilian Cuisine
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Romeu-e-Julieta-Brazilian-Guava-and-Cheese-Dessert/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Romeu e Julieta Recipe
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