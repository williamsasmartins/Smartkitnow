import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChickenEnchiladasCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chicken%20Enchiladas%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7724"
  );

  // --- DATA ---
  const title = "Chicken Enchiladas";
  const description = "Tortilhas recheadas de frango, cobertas com molho e assadas.";

  // INGREDIENTS
  const ingredients = [
    { name: "Chicken breast, cooked and shredded", baseAmount: 500, unit: "g" },
    { name: "Corn tortillas", baseAmount: 8, unit: "units" },
    { name: "Enchilada sauce", baseAmount: 400, unit: "ml" },
    { name: "Shredded cheddar cheese", baseAmount: 200, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Ground cumin", baseAmount: 1, unit: "tsp" },
    { name: "Chili powder", baseAmount: 1, unit: "tsp" },
    { name: "Fresh cilantro, chopped", baseAmount: 15, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Sour cream (for serving)", baseAmount: 100, unit: "g" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "wedges" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "38g",
    carbs: "30g",
    fat: "20g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use rotisserie chicken instead of cooking chicken breast?",
      answer:
        "Absolutely! Using rotisserie chicken is a great shortcut that adds extra flavor and saves time. Just shred the chicken and use it directly in the filling.",
    },
    {
      question: "How do I make homemade enchilada sauce?",
      answer:
        "To make homemade enchilada sauce, sauté some garlic and onion in oil, add chili powder, cumin, tomato paste, chicken broth, and simmer until thickened. Adjust seasoning to taste. This fresh sauce enhances the dish's flavor significantly.",
    },
    {
      question: "Can I prepare chicken enchiladas ahead of time?",
      answer:
        "Yes, you can assemble the enchiladas a day in advance and refrigerate them covered. Bake them fresh before serving to maintain the best texture and flavor.",
    },
    {
      question: "What can I substitute for corn tortillas if I have dietary restrictions?",
      answer:
        "Flour tortillas can be used as a substitute, though they have a different texture and flavor. For gluten-free options, look for certified gluten-free corn tortillas or use lettuce wraps for a low-carb alternative.",
    },
    {
      question: "How can I make this recipe spicier or milder?",
      answer:
        "Adjust the chili powder and add fresh chopped jalapeños or hot sauce for more heat. To make it milder, reduce or omit the chili powder and use a mild enchilada sauce.",
    },
    {
      question: "What side dishes pair well with chicken enchiladas?",
      answer:
        "Popular sides include Mexican rice, refried beans, guacamole, and a fresh green salad. These complement the rich flavors and add balance to the meal.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Chicken Enchiladas"
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
            Chicken enchiladas are a beloved Mexican dish featuring tender shredded chicken wrapped in corn tortillas, smothered in a rich, flavorful enchilada sauce, and baked to perfection with melted cheese on top. This recipe balances savory spices with creamy textures, delivering a comforting and satisfying meal perfect for family dinners or entertaining guests.
          </p>
          <p>
            The origins of enchiladas trace back to Aztec times, where corn tortillas were filled with various ingredients and covered in chili sauce. Over centuries, enchiladas evolved throughout Mexico, incorporating regional sauces and fillings. Today, chicken enchiladas are a staple in Mexican-American cuisine, celebrated for their versatility and bold flavors.
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
              Prepare the Chicken Filling
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a skillet over medium heat. Sauté the chopped onion and minced garlic until translucent and fragrant. Add shredded chicken, ground cumin, chili powder, salt, and pepper. Stir well to combine and cook for 3-4 minutes to blend the flavors. Remove from heat and stir in chopped cilantro.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Warm the Tortillas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              To prevent cracking, warm the corn tortillas in a dry skillet or microwave wrapped in a damp towel until pliable. This makes rolling easier and prevents breakage.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Enchiladas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour a thin layer of enchilada sauce into a baking dish. Spoon a generous amount of chicken filling onto each tortilla, roll tightly, and place seam-side down in the dish. Repeat with all tortillas.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Sauce and Cheese
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the remaining enchilada sauce evenly over the rolled tortillas. Sprinkle shredded cheddar cheese generously on top.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bake in a preheated oven at 180°C (350°F) for 20-25 minutes, until the cheese is melted and bubbly. Let cool slightly before serving with sour cream and lime wedges.
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
            For extra moist chicken, poach the breasts in seasoned broth before shredding.
          </li>
          <li>
            Lightly fry the tortillas in oil for a few seconds before assembling to add flavor and prevent sogginess.
          </li>
          <li>
            Use a blend of cheeses like Monterey Jack and cheddar for a creamier, richer topping.
          </li>
          <li>
            Garnish with fresh avocado slices, chopped green onions, or pickled jalapeños for added texture and flavor.
          </li>
          <li>
            Leftovers reheat well in the oven or microwave, but avoid overcooking to keep tortillas tender.
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
              href="https://en.wikipedia.org/wiki/Enchilada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Enchilada
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.simplyrecipes.com/recipes/chicken_enchiladas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Simply Recipes: Chicken Enchiladas
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