import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SnacksCoxinhaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chicken%20Croquettes%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6582"
  );

  // --- DATA ---
  const title = "Chicken Croquettes";
  const description = "The most popular Brazilian street snack, crispy and savory.";

  // INGREDIENTS
  const ingredients = [
    { name: "Shredded Chicken Breast", baseAmount: 500, unit: "g" },
    { name: "Chicken Broth", baseAmount: 500, unit: "ml" },
    { name: "All-Purpose Flour", baseAmount: 200, unit: "g" },
    { name: "Butter", baseAmount: 50, unit: "g" },
    { name: "Onion (finely chopped)", baseAmount: 1, unit: "medium" },
    { name: "Garlic Cloves (minced)", baseAmount: 2, unit: "cloves" },
    { name: "Parsley (chopped)", baseAmount: 15, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Eggs (for coating)", baseAmount: 2, unit: "large" },
    { name: "Breadcrumbs", baseAmount: 200, unit: "g" },
    { name: "Vegetable Oil (for frying)", baseAmount: 1000, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "350",
    protein: "28g",
    carbs: "30g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the origin of Chicken Croquettes (Coxinha)?",
      answer:
        "Chicken Croquettes, or Coxinha, originated in Brazil and are one of the most beloved street snacks. The name 'coxinha' means 'little thigh' in Portuguese, inspired by the croquette's shape resembling a chicken drumstick. It was initially created as a way to use leftover chicken, evolving into a popular savory treat enjoyed nationwide.",
    },
    {
      question: "Can I use other types of meat instead of chicken?",
      answer:
        "Yes, while traditional coxinha uses shredded chicken breast, you can experiment with other meats like turkey or even beef. However, chicken is preferred for its mild flavor and tenderness, which pairs well with the creamy dough and crispy coating.",
    },
    {
      question: "How do I ensure the croquettes don’t fall apart during frying?",
      answer:
        "To prevent croquettes from falling apart, make sure the dough is firm and well-chilled before shaping. Also, coat each croquette thoroughly with beaten egg and breadcrumbs to create a sturdy crust. Fry them in hot oil (around 180°C/350°F) to seal the exterior quickly, which helps maintain their shape.",
    },
    {
      question: "Can I bake the croquettes instead of frying?",
      answer:
        "Baking is a healthier alternative, but it will yield a different texture. To bake, preheat your oven to 200°C (400°F), place the croquettes on a greased baking sheet, and spray lightly with oil. Bake for about 20-25 minutes or until golden and crispy, flipping halfway through. Keep in mind, frying produces the classic crispy exterior.",
    },
    {
      question: "How long can I store uncooked croquettes?",
      answer:
        "Uncooked croquettes can be stored in the refrigerator for up to 24 hours, tightly covered to prevent drying out. For longer storage, freeze them on a tray until solid, then transfer to an airtight container or freezer bag for up to 1 month. Fry directly from frozen, adding a couple of extra minutes to the cooking time.",
    },
    {
      question: "What are some popular dipping sauces for Chicken Croquettes?",
      answer:
        "Popular dipping sauces include spicy ketchup, garlic aioli, chimichurri, or a simple squeeze of lime. In Brazil, they are often enjoyed plain or with a mild hot sauce. Feel free to experiment with your favorite condiments to complement the savory flavors.",
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
            Chicken Croquettes, known as Coxinha in Brazil, are a beloved street
            food snack characterized by their crispy golden crust and savory,
            tender shredded chicken filling. This recipe combines a creamy dough
            made from chicken broth and flour with a flavorful filling seasoned
            with garlic, onion, and fresh parsley. The croquettes are shaped
            traditionally like little chicken drumsticks, breaded, and deep-fried
            to perfection.
          </p>
          <p>
            The origin of Coxinha dates back to São Paulo in the 19th century,
            where it was created as a way to use leftover chicken meat. Over time,
            it evolved into a popular snack enjoyed across Brazil, often found in
            bakeries, street stalls, and homes. Its irresistible combination of
            textures and flavors has made it a staple of Brazilian cuisine and a
            favorite comfort food worldwide.
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
              Prepare the Filling
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a skillet, melt butter over medium heat. Add finely chopped onion
              and minced garlic, sautéing until translucent and fragrant. Add the
              shredded chicken, parsley, salt, and pepper. Stir well and cook for
              3-4 minutes to combine flavors. Remove from heat and set aside to cool.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Make the Dough
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a saucepan, bring chicken broth and butter to a boil. Gradually add
              the flour all at once, stirring vigorously with a wooden spoon until
              the dough forms a ball and pulls away from the sides. Remove from heat
              and let cool slightly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shape the Croquettes
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              When the dough is cool enough to handle, knead it until smooth. Pinch
              off a small piece, flatten it in your palm, and place a spoonful of
              filling in the center. Fold the dough around the filling and shape it
              into a teardrop or drumstick shape. Repeat with remaining dough and
              filling.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Coat the Croquettes
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Beat the eggs in a shallow bowl. Dip each croquette first into the
              egg, then roll in breadcrumbs until fully coated. Place on a tray and
              refrigerate for 15 minutes to firm up.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Fry Until Golden
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a deep fryer or large pot to 180°C (350°F). Fry
              croquettes in batches, turning occasionally, until golden brown and
              crispy, about 3-4 minutes. Drain on paper towels and serve warm.
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
            Use fresh chicken broth for the dough to enhance flavor and richness.
          </li>
          <li>
            Chill the shaped croquettes before frying to help them hold their shape
            better.
          </li>
          <li>
            Maintain oil temperature between 175-180°C (350-360°F) to ensure even
            cooking and prevent sogginess.
          </li>
          <li>
            For extra flavor, add a pinch of nutmeg or smoked paprika to the filling.
          </li>
          <li>
            Leftover croquettes can be reheated in a hot oven or air fryer to
            restore crispiness.
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
              href="https://en.wikipedia.org/wiki/Coxinha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Coxinha
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
              TasteAtlas: Coxinha - Brazilian Chicken Croquettes
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