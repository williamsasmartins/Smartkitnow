import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ProsciuttoAndArugulaPizzaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Prosciutto%20and%20Arugula%20Pizza%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1148"
  );

  // --- DATA ---
  const title = "Prosciutto and Arugula Pizza";
  const description = "Pizza with prosciutto, fresh arugula, and shaved Parmesan.";

  // INGREDIENTS
  const ingredients = [
    { name: "Pizza dough", baseAmount: 500, unit: "g" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Garlic cloves (minced)", baseAmount: 2, unit: "pcs" },
    { name: "Mozzarella cheese (shredded)", baseAmount: 200, unit: "g" },
    { name: "Prosciutto slices", baseAmount: 100, unit: "g" },
    { name: "Fresh arugula", baseAmount: 80, unit: "g" },
    { name: "Parmesan cheese (shaved)", baseAmount: 40, unit: "g" },
    { name: "Tomato sauce", baseAmount: 120, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "Red chili flakes (optional)", baseAmount: 0.25, unit: "tsp" },
    { name: "Fresh basil leaves (optional)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "22g",
    carbs: "38g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use store-bought pizza dough for this recipe?",
      answer:
        "Absolutely! Store-bought pizza dough works well and can save time. Just make sure to let it come to room temperature before shaping for easier handling and better texture.",
    },
    {
      question: "How do I prevent the arugula from wilting on the pizza?",
      answer:
        "Add the fresh arugula after the pizza is baked and slightly cooled. This preserves its peppery flavor and crisp texture, providing a fresh contrast to the warm pizza.",
    },
    {
      question: "What can I substitute for prosciutto if I don't eat pork?",
      answer:
        "You can substitute prosciutto with thinly sliced turkey or chicken breast, smoked salmon, or even a vegetarian option like marinated grilled mushrooms for a similar savory touch.",
    },
    {
      question: "Is it necessary to use Parmesan cheese?",
      answer:
        "While Parmesan adds a nutty, salty flavor that complements the prosciutto and arugula, you can substitute it with Pecorino Romano or Grana Padano if preferred.",
    },
    {
      question: "Can I prepare this pizza ahead of time?",
      answer:
        "You can prepare the dough and tomato sauce in advance. Assemble the pizza just before baking to ensure the crust stays crisp and the arugula remains fresh.",
    },
    {
      question: "What type of oven is best for baking this pizza?",
      answer:
        "A very hot oven (450°F/230°C or higher) is ideal for a crispy crust and perfectly melted cheese. If you have a pizza stone or steel, preheat it for best results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Prosciutto and Arugula Pizza"
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
            This Prosciutto and Arugula Pizza is a delightful blend of savory and fresh flavors, combining the salty richness of thinly sliced prosciutto with the peppery bite of fresh arugula and the nutty sharpness of shaved Parmesan. The base is a crisp yet chewy pizza dough topped with a light layer of tomato sauce and melted mozzarella, creating a perfect balance of textures and tastes that make this pizza a standout choice for any occasion.
          </p>
          <p>
            Originating from Italy, this pizza style reflects the Italian culinary tradition of using high-quality, simple ingredients to create dishes that are both elegant and comforting. The addition of fresh arugula after baking is a modern twist that adds freshness and vibrancy, making it a popular choice in contemporary pizzerias worldwide.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              If using homemade dough, let it rise until doubled in size. Preheat your oven to 475°F (245°C) and, if available, place a pizza stone inside to heat. Roll out the dough on a floured surface to your desired thickness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Sauce and Cheese</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spread the tomato sauce evenly over the dough, leaving a small border around the edges. Sprinkle the shredded mozzarella cheese generously on top.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Bake the Pizza</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the pizza to the preheated oven or pizza stone. Bake for 8-10 minutes or until the crust is golden and cheese is bubbly and slightly browned.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Prosciutto and Arugula</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the pizza from the oven and immediately arrange the prosciutto slices evenly over the top. Then, pile fresh arugula on the pizza while it’s still warm but not too hot to wilt the greens.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Finish with Parmesan and Seasoning</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Sprinkle shaved Parmesan cheese over the top, drizzle with a little olive oil, and season with freshly ground black pepper and optional red chili flakes to taste. Slice and serve immediately.
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
            Use a pizza stone or steel preheated in the oven to achieve a crispier crust with a professional finish.
          </li>
          <li>
            Let the prosciutto come to room temperature before placing it on the pizza for better flavor and texture.
          </li>
          <li>
            For extra flavor, lightly toss the arugula with a splash of lemon juice and olive oil before adding it to the pizza.
          </li>
          <li>
            If you prefer a spicier kick, sprinkle some red chili flakes on top just before serving.
          </li>
          <li>
            Avoid overloading the pizza with toppings to ensure the crust cooks evenly and remains crispy.
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
