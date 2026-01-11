import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function NachosCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Nachos%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8938"
  );

  // --- DATA ---
  const title = "Nachos";
  const description = "Tortilla chips com queijo e coberturas como feijões, salsa e jalapeño.";

  // INGREDIENTS
  const ingredients = [
    { name: "Tortilla Chips", baseAmount: 200, unit: "g" },
    { name: "Cheddar Cheese (shredded)", baseAmount: 150, unit: "g" },
    { name: "Monterey Jack Cheese (shredded)", baseAmount: 100, unit: "g" },
    { name: "Black Beans (cooked)", baseAmount: 120, unit: "g" },
    { name: "Jalapeño Peppers (sliced)", baseAmount: 30, unit: "g" },
    { name: "Salsa", baseAmount: 100, unit: "g" },
    { name: "Sour Cream", baseAmount: 80, unit: "g" },
    { name: "Green Onions (chopped)", baseAmount: 30, unit: "g" },
    { name: "Cilantro (fresh, chopped)", baseAmount: 15, unit: "g" },
    { name: "Olive Oil", baseAmount: 10, unit: "ml" },
    { name: "Ground Cumin", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Lime (for garnish)", baseAmount: 1, unit: "unit" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "22g",
    carbs: "45g",
    fat: "25g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What are the best types of cheese for nachos?",
      answer:
        "The best cheeses for nachos are those that melt well and provide a creamy texture. Cheddar and Monterey Jack are classic choices because they melt smoothly and have a rich flavor. You can also experiment with Pepper Jack for a spicy kick or a blend of cheeses for depth.",
    },
    {
      question: "Can I make nachos vegetarian or vegan?",
      answer:
        "Absolutely! To make vegetarian nachos, simply omit any meat toppings and load up on beans, vegetables, and cheese. For vegan nachos, use dairy-free cheese alternatives and plant-based sour cream. Ensure your tortilla chips are free from animal products as well.",
    },
    {
      question: "How do I keep nachos crispy when serving?",
      answer:
        "To keep nachos crispy, avoid layering wet ingredients directly on the chips before baking. Instead, bake the chips with cheese first, then add fresh toppings like salsa, sour cream, and guacamole after baking. Serving immediately also helps maintain crispiness.",
    },
    {
      question: "What are some popular toppings to add to nachos?",
      answer:
        "Popular nacho toppings include black beans, jalapeños, diced tomatoes, green onions, olives, guacamole, sour cream, and fresh cilantro. You can also add cooked ground beef, shredded chicken, or pulled pork for a heartier dish.",
    },
    {
      question: "Can I prepare nachos ahead of time?",
      answer:
        "While you can prepare individual components like salsa, beans, and shredded cheese ahead of time, it's best to assemble and bake nachos just before serving to ensure they remain crispy and fresh.",
    },
    {
      question: "How can I add more protein to my nachos?",
      answer:
        "To boost protein content, add cooked ground beef, shredded chicken, pulled pork, or beans such as black or pinto beans. You can also sprinkle some cooked lentils or tofu crumbles for a vegetarian protein boost.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Nachos"
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
            Nachos are a beloved Tex-Mex dish featuring crispy tortilla chips
            layered with melted cheese and a variety of savory toppings. This
            dish is perfect for sharing and offers a delightful combination of
            textures and flavors, from crunchy chips to creamy cheese and
            zesty jalapeños. Whether served as a snack or a meal, nachos bring
            a festive and comforting experience to the table.
          </p>
          <p>
            The origin of nachos dates back to 1943 in Piedras Negras, Mexico,
            when Ignacio "Nacho" Anaya improvised a snack for some hungry guests
            by topping tortilla chips with cheese and jalapeños. Since then,
            nachos have evolved into countless variations worldwide, becoming a
            staple in Mexican-American cuisine and popular in restaurants and
            home kitchens alike.
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
              Prepare Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 180°C (350°F). Shred the cheddar and Monterey
              Jack cheeses. Rinse and drain the black beans if using canned.
              Slice the jalapeños, chop green onions and cilantro, and prepare
              any additional toppings.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Layer the Nachos
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spread the tortilla chips evenly on a large oven-safe platter or
              baking sheet. Sprinkle half of the shredded cheeses over the chips,
              then evenly distribute the black beans and jalapeño slices. Add
              the remaining cheese on top.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake Until Melted
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the platter in the preheated oven and bake for 8-10 minutes,
              or until the cheese is fully melted and bubbly. Keep an eye to
              avoid burning the chips.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Fresh Toppings
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the nachos from the oven and immediately top with salsa,
              sour cream, chopped green onions, and fresh cilantro. Squeeze lime
              juice over the top for added brightness.
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
              Serve the nachos hot and fresh to enjoy the perfect balance of
              crispy chips and gooey cheese. Nachos are best enjoyed right away
              to maintain their texture.
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
            Use a mix of cheeses for richer flavor and better melting
            properties.
          </li>
          <li>
            Toast the tortilla chips lightly before layering to enhance crunch.
          </li>
          <li>
            Add fresh toppings like guacamole and sour cream after baking to
            keep them cool and creamy.
          </li>
          <li>
            For extra heat, add pickled jalapeños or a dash of hot sauce on top.
          </li>
          <li>
            To make it a meal, add cooked ground beef, shredded chicken, or
            beans for protein.
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
              href="https://en.wikipedia.org/wiki/Nachos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Nachos History and Origin
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/how-to-make-nachos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Make Perfect Nachos
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