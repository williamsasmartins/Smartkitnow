import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChickenCroquettesCoxinhaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chicken%20Croquettes%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7468"
  );

  // --- DATA ---
  const title = "Chicken Croquettes";
  const description = "Tear-drop shaped savory dough filled with shredded seasoned chicken.";

  // INGREDIENTS
  const ingredients = [
    { name: "Shredded Chicken Breast", baseAmount: 500, unit: "g" },
    { name: "Chicken Broth", baseAmount: 500, unit: "ml" },
    { name: "All-Purpose Flour", baseAmount: 150, unit: "g" },
    { name: "Unsalted Butter", baseAmount: 50, unit: "g" },
    { name: "Onion (finely chopped)", baseAmount: 1, unit: "medium" },
    { name: "Garlic Cloves (minced)", baseAmount: 2, unit: "cloves" },
    { name: "Parsley (chopped)", baseAmount: 15, unit: "g" },
    { name: "Cream Cheese", baseAmount: 100, unit: "g" },
    { name: "Eggs (for dough and coating)", baseAmount: 3, unit: "large" },
    { name: "Breadcrumbs", baseAmount: 200, unit: "g" },
    { name: "Vegetable Oil (for frying)", baseAmount: 1000, unit: "ml" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 1, unit: "tsp" },
    { name: "Nutmeg (optional)", baseAmount: 0.25, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "28g",
    carbs: "22g",
    fat: "14g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the origin of Chicken Croquettes (Coxinha)?",
      answer:
        "Chicken Croquettes, known as Coxinha in Brazil, originated as a popular street food inspired by European croquettes. The tear-drop shape mimics a chicken drumstick, and the dish has become a beloved snack throughout Brazil, often enjoyed at parties and casual gatherings.",
    },
    {
      question: "Can I make the dough gluten-free?",
      answer:
        "Yes, you can substitute all-purpose flour with a gluten-free flour blend suitable for cooking. However, the texture might be slightly different, so consider adding a binding agent like xanthan gum to improve elasticity.",
    },
    {
      question: "How do I prevent the croquettes from bursting during frying?",
      answer:
        "Ensure the dough is well sealed around the filling with no gaps or cracks. Also, fry at a consistent medium temperature (around 170-180°C / 340-355°F) to cook evenly without bursting. Avoid overcrowding the pan to maintain oil temperature.",
    },
    {
      question: "Can I bake the croquettes instead of frying?",
      answer:
        "While traditionally fried, you can bake them for a healthier alternative. Brush the croquettes with oil or egg wash and bake at 200°C (390°F) for about 20-25 minutes or until golden and crispy, turning halfway through.",
    },
    {
      question: "How long can I store leftover croquettes?",
      answer:
        "Cooked croquettes can be refrigerated in an airtight container for up to 3 days. For longer storage, freeze them uncooked or cooked, wrapped tightly, for up to 1 month. Reheat by frying or baking until heated through.",
    },
    {
      question: "What are some good dipping sauces for Chicken Croquettes?",
      answer:
        "Popular dipping sauces include spicy mayo, garlic aioli, chimichurri, or a simple squeeze of lime. You can also serve them with hot sauce or a creamy cheese dip for added flavor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Chicken Croquettes"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 15m
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
            Chicken Croquettes, or Coxinha as they are affectionately known in Brazil, are a
            beloved savory snack characterized by their distinctive tear-drop shape. These
            croquettes feature a creamy, seasoned shredded chicken filling wrapped in a soft,
            doughy shell, then breaded and fried to golden perfection. The result is a crispy
            exterior with a moist, flavorful interior that makes them irresistible as appetizers,
            party snacks, or street food.
          </p>
          <p>
            The origins of Coxinha trace back to São Paulo in the early 20th century, where it
            was inspired by European croquettes but adapted with local Brazilian flavors and
            ingredients. Traditionally shaped to resemble a chicken drumstick, Coxinha has become
            a cultural icon, enjoyed across Brazil and increasingly popular worldwide for its
            comforting taste and satisfying texture.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Filling</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a skillet, melt half the butter over medium heat. Sauté the chopped onion and
              minced garlic until translucent and fragrant. Add the shredded chicken, salt,
              pepper, nutmeg (if using), and half the parsley. Stir in the cream cheese until
              melted and well combined. Remove from heat and let cool.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a saucepan, bring the chicken broth, remaining butter, salt, and pepper to a
              boil. Gradually add the flour, stirring vigorously until the dough forms a ball
              and pulls away from the sides. Remove from heat and let it cool slightly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Shape the Croquettes</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Once the dough is cool enough to handle, knead it until smooth. Divide into equal
              portions. Flatten each portion in your palm, place a spoonful of filling in the
              center, then fold and shape into a tear-drop or drumstick shape, sealing the edges
              tightly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Coat and Fry</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Beat the eggs in a shallow bowl. Dip each croquette first in the egg, then coat
              thoroughly with breadcrumbs. Heat vegetable oil in a deep fryer or heavy pot to
              170-180°C (340-355°F). Fry croquettes in batches until golden brown and crispy,
              about 4-5 minutes. Drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve warm with your favorite dipping sauces. Garnish with remaining parsley for a
              fresh touch.
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
            Use warm chicken broth when making the dough to help it come together smoothly and
            create a tender texture.
          </li>
          <li>
            Make sure the filling is cool before stuffing the dough to prevent it from becoming
            too soft or sticky.
          </li>
          <li>
            For extra flavor, add finely chopped green olives or cream cheese to the filling.
          </li>
          <li>
            Maintain consistent oil temperature while frying to ensure even cooking and avoid
            greasy croquettes.
          </li>
          <li>
            If you want to prepare ahead, freeze shaped but uncooked croquettes on a tray, then
            transfer to a bag. Fry directly from frozen, adding a couple of extra minutes to
            cooking time.
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
              href="https://en.wikipedia.org/wiki/Coxinha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Coxinha (Chicken Croquettes)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.tasteatlas.com/coxinha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              TasteAtlas: Coxinha Recipe & History
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