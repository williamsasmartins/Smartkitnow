import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TostadasCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Tostadas%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2491"
  );

  // --- DATA ---
  const title = "Tostadas";
  const description = "Tortilha crocante com camadas de feijão, carne/vegetais e salsa.";

  // INGREDIENTS
  const ingredients = [
    { name: "Corn tortillas", baseAmount: 8, unit: "units" },
    { name: "Refried black beans", baseAmount: 400, unit: "g" },
    { name: "Ground beef or shredded chicken", baseAmount: 500, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Tomato, diced", baseAmount: 2, unit: "medium" },
    { name: "Lettuce, shredded", baseAmount: 150, unit: "g" },
    { name: "Cheddar cheese, shredded", baseAmount: 150, unit: "g" },
    { name: "Sour cream", baseAmount: 120, unit: "ml" },
    { name: "Avocado, sliced", baseAmount: 1, unit: "medium" },
    { name: "Fresh cilantro, chopped", baseAmount: 15, unit: "g" },
    { name: "Lime wedges", baseAmount: 2, unit: "units" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Ground black pepper", baseAmount: 0.5, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "28g",
    carbs: "45g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What are tostadas and how do they differ from tacos?",
      answer:
        "Tostadas are crispy fried or baked tortillas topped with various ingredients such as beans, meat, cheese, and vegetables. Unlike tacos, which use soft tortillas folded around fillings, tostadas are flat and crunchy, providing a different texture and eating experience.",
    },
    {
      question: "Can I make tostadas vegetarian or vegan?",
      answer:
        "Absolutely! You can substitute the meat with grilled vegetables, sautéed mushrooms, or plant-based protein alternatives. Use vegan cheese or omit dairy toppings like sour cream to keep it vegan-friendly.",
    },
    {
      question: "How do I make the tortillas crispy without deep frying?",
      answer:
        "You can bake the tortillas in a preheated oven at 375°F (190°C) for about 8-10 minutes, flipping halfway through, until they are golden and crisp. Alternatively, lightly brush them with oil and pan-fry until crispy.",
    },
    {
      question: "What toppings are traditional for tostadas?",
      answer:
        "Traditional toppings include refried beans, seasoned ground beef or shredded chicken, shredded lettuce, diced tomatoes, cheese, sour cream, avocado slices, and fresh cilantro. Lime wedges are often served on the side for added zest.",
    },
    {
      question: "How should tostadas be stored and reheated?",
      answer:
        "Tostadas are best enjoyed fresh to maintain their crispiness. If you have leftovers, store toppings separately from the tortillas. Reheat tortillas in the oven or toaster oven to restore crispness before assembling.",
    },
    {
      question: "Can I prepare tostadas ahead of time for a party?",
      answer:
        "Yes! Prepare all the toppings in advance and keep them chilled. Toast or fry the tortillas just before serving to ensure they remain crispy. This approach makes assembly quick and easy during your event.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Tostadas"
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
            Tostadas are a beloved Mexican dish featuring crispy fried or baked corn
            tortillas topped with a vibrant combination of beans, meats or vegetables,
            fresh vegetables, cheese, and zesty garnishes. This recipe layers flavors
            and textures to create a satisfying meal that is both simple and versatile,
            perfect for casual dinners or festive gatherings.
          </p>
          <p>
            Originating from traditional Mexican street food, tostadas have evolved
            over centuries, showcasing regional variations and local ingredients.
            Their crunchy base contrasts beautifully with creamy beans and fresh,
            tangy toppings, making them a staple in Mexican cuisine and a favorite
            worldwide.
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
              Prepare the Toppings
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Finely chop the onion, garlic, tomatoes, and cilantro. Shred the lettuce
              and cheese. Slice the avocado and cut lime wedges. Set all aside for
              assembly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Meat
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a skillet over medium heat. Sauté onion and garlic until
              fragrant. Add ground beef or shredded chicken, season with salt and pepper,
              and cook until browned and cooked through. Stir in diced tomatoes and cook
              for another 5 minutes. Keep warm.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Tortillas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              To crisp the tortillas, either fry them in hot oil until golden and crunchy,
              or bake them in a preheated oven at 375°F (190°C) for 8-10 minutes, flipping
              halfway through. Drain on paper towels if fried.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Tostadas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spread a generous layer of refried beans on each crispy tortilla. Top with
              the cooked meat, shredded lettuce, diced tomatoes, cheese, avocado slices,
              and a dollop of sour cream. Garnish with fresh cilantro and a squeeze of lime.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve Immediately
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the tostadas fresh to enjoy the contrast of crunchy tortilla and
              creamy toppings. Offer extra lime wedges and hot sauce on the side for
              added flavor.
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
            For extra flavor, warm the refried beans with a pinch of cumin and chili
            powder before spreading on the tortillas.
          </li>
          <li>
            Use fresh corn tortillas for the best texture and flavor; stale tortillas
            won't crisp well.
          </li>
          <li>
            To keep tostadas crispy when serving, assemble just before eating and keep
            toppings chilled separately.
          </li>
          <li>
            Experiment with toppings like pickled jalapeños, radishes, or queso fresco
            for authentic Mexican flair.
          </li>
          <li>
            If frying tortillas, use a thermometer to maintain oil temperature around
            350°F (175°C) for even crisping without absorbing excess oil.
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
              href="https://en.wikipedia.org/wiki/Tostada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Tostada
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/tostadas-recipe-2342764"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Tostadas Recipe
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