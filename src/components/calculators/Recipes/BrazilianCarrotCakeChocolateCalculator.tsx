import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BrazilianCarrotCakeChocolateCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Carrot%20Cake%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=490"
  );

  // --- DATA ---
  const title = "Brazilian Carrot Cake";
  const description = "Blender carrot cake with a hard chocolate fudge topping.";

  // INGREDIENTS
  const ingredients = [
    { name: "Carrots, peeled and chopped", baseAmount: 500, unit: "g" },
    { name: "Granulated sugar", baseAmount: 350, unit: "g" },
    { name: "Vegetable oil", baseAmount: 200, unit: "ml" },
    { name: "Large eggs", baseAmount: 4, unit: "pcs" },
    { name: "All-purpose flour", baseAmount: 300, unit: "g" },
    { name: "Baking powder", baseAmount: 1, unit: "tbsp" },
    { name: "Salt", baseAmount: 0.5, unit: "tsp" },
    { name: "Sweetened condensed milk", baseAmount: 395, unit: "g" },
    { name: "Unsweetened cocoa powder", baseAmount: 50, unit: "g" },
    { name: "Dark chocolate (70% cacao), chopped", baseAmount: 150, unit: "g" },
    { name: "Butter", baseAmount: 50, unit: "g" },
    { name: "Heavy cream", baseAmount: 100, unit: "ml" },
    { name: "Powdered sugar (for dusting)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition info per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "5g",
    carbs: "60g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes Brazilian carrot cake different from other carrot cakes?",
      answer:
        "Brazilian carrot cake is unique because the carrots are blended with oil, sugar, and eggs to create a smooth batter, resulting in a moist and dense texture. Additionally, it is traditionally topped with a rich, hard chocolate fudge glaze, which contrasts with the softness of the cake.",
    },
    {
      question: "Can I substitute the vegetable oil with another type of oil?",
      answer:
        "Yes, you can substitute vegetable oil with other neutral oils like canola or sunflower oil. Avoid using strongly flavored oils like olive oil as they may alter the taste of the cake.",
    },
    {
      question: "How do I store the Brazilian carrot cake to keep it fresh?",
      answer:
        "Store the cake covered in an airtight container in the refrigerator. The chocolate fudge topping helps seal in moisture, but refrigeration will keep it fresh for up to 4-5 days. Bring to room temperature before serving for best texture.",
    },
    {
      question: "Is it possible to make this cake gluten-free?",
      answer:
        "Yes, you can substitute the all-purpose flour with a gluten-free flour blend that includes xanthan gum for structure. The texture may vary slightly, but the cake will still be delicious.",
    },
    {
      question: "Can I prepare the chocolate fudge topping ahead of time?",
      answer:
        "Absolutely! The chocolate fudge topping can be made a day in advance and stored in the refrigerator. Reheat gently before spreading it over the cake to ensure it is smooth and spreadable.",
    },
    {
      question: "What is the best way to grate or chop carrots for this recipe?",
      answer:
        "For this recipe, carrots are blended in a food processor or blender until smooth rather than grated or chopped finely. This creates the signature moist and dense texture of the cake.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Carrot Cake"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 40m
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
            Brazilian Carrot Cake, or "Bolo de Cenoura," is a beloved dessert in Brazil known for its moist,
            tender crumb and distinctive chocolate fudge topping. Unlike traditional carrot cakes that often
            include nuts and spices, this version uses a blender to create a smooth batter, resulting in a
            uniquely soft texture. The cake is topped with a luscious, hard chocolate glaze that adds a rich,
            decadent finish.
          </p>
          <p>
            The origin of this cake dates back to the mid-20th century in Brazil, where home cooks adapted
            carrot cake recipes to local tastes and ingredients. The use of sweetened condensed milk and
            the chocolate fudge topping reflect Brazilian culinary influences, making it a staple at family
            gatherings and celebrations across the country.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Carrot Batter</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Peel and chop the carrots into chunks. In a blender, combine the carrots, granulated sugar,
              vegetable oil, and eggs. Blend until smooth and homogeneous, about 1-2 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Mix Dry Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, sift together the all-purpose flour, baking powder, and salt. Gradually pour
              the blended carrot mixture into the dry ingredients, stirring gently until just combined.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Bake the Cake</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat the oven to 180°C (350°F). Grease and flour a 9x13 inch (23x33 cm) baking pan. Pour
              the batter into the pan and bake for 35-40 minutes, or until a toothpick inserted in the center
              comes out clean. Let the cake cool completely.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Chocolate Fudge Topping</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a saucepan over low heat, combine the sweetened condensed milk, chopped dark chocolate,
              butter, cocoa powder, and heavy cream. Stir continuously until the mixture thickens and becomes
              glossy, about 5-7 minutes. Remove from heat and let cool slightly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Glaze the Cake</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the warm chocolate fudge topping evenly over the cooled cake, spreading it with a spatula
              to cover the surface. Allow the topping to set and harden at room temperature before slicing
              and serving.
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
            Use fresh, firm carrots for the best flavor and moisture content in the cake.
          </li>
          <li>
            Blend the carrot mixture until completely smooth to ensure a tender crumb and even texture.
          </li>
          <li>
            When making the chocolate fudge topping, stir constantly to prevent burning and achieve a silky finish.
          </li>
          <li>
            Allow the cake to cool fully before glazing to prevent the topping from melting and sliding off.
          </li>
          <li>
            For a festive touch, sprinkle chopped nuts or shredded coconut on the chocolate topping before it sets.
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
              href="https://en.wikipedia.org/wiki/Bolo_de_cenoura"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Bolo de Cenoura (Brazilian Carrot Cake)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.tasteatlas.com/bolo-de-cenoura"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              TasteAtlas: Bolo de Cenoura
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