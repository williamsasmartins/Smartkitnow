import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BakedStuffedMushroomsCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Baked%20Stuffed%20Mushrooms%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5094"
  );

  // --- DATA ---
  const title = "Baked Stuffed Mushrooms";
  const description =
    "Mushrooms filled with breadcrumbs, cheese, garlic, and herbs, then baked until golden.";

  // INGREDIENTS
  const ingredients = [
    { name: "Large white mushrooms (stems removed)", baseAmount: 500, unit: "g" },
    { name: "Breadcrumbs", baseAmount: 100, unit: "g" },
    { name: "Parmesan cheese (grated)", baseAmount: 80, unit: "g" },
    { name: "Cream cheese", baseAmount: 120, unit: "g" },
    { name: "Garlic cloves (minced)", baseAmount: 3, unit: "pcs" },
    { name: "Fresh parsley (chopped)", baseAmount: 15, unit: "g" },
    { name: "Olive oil", baseAmount: 30, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "Onion (finely chopped)", baseAmount: 50, unit: "g" },
    { name: "Butter", baseAmount: 20, unit: "g" },
    { name: "Lemon zest", baseAmount: 1, unit: "tsp" },
  ];

  // Approximate nutrition per serving (4 servings base)
  const nutrition = {
    calories: "280",
    protein: "12g",
    carbs: "18g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use other types of mushrooms for this recipe?",
      answer:
        "Yes, you can substitute white mushrooms with cremini, portobello, or shiitake mushrooms. Just ensure they are large enough to hold the stuffing and adjust cooking times slightly if needed.",
    },
    {
      question: "How do I store leftover baked stuffed mushrooms?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 2 days. Reheat gently in an oven or microwave before serving to maintain texture and flavor.",
    },
    {
      question: "Can I prepare the stuffing in advance?",
      answer:
        "Absolutely! The stuffing mixture can be prepared a day ahead and refrigerated. When ready to bake, stuff the mushrooms and proceed with baking as directed.",
    },
    {
      question: "What can I serve alongside baked stuffed mushrooms?",
      answer:
        "They pair wonderfully with fresh salads, roasted vegetables, or as an appetizer alongside a glass of white wine. They also complement pasta dishes and grilled meats.",
    },
    {
      question: "How do I make this recipe vegan?",
      answer:
        "To make it vegan, substitute the Parmesan and cream cheese with plant-based alternatives, and use vegan butter or olive oil instead of regular butter. Ensure breadcrumbs are free from dairy or eggs.",
    },
    {
      question: "Why is it important to remove mushroom stems?",
      answer:
        "Removing the stems creates a cavity for the stuffing. Additionally, mushroom stems can be tougher and contain more moisture, which might affect the texture and cooking of the stuffed caps.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Baked Stuffed Mushrooms"
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
            Baked Stuffed Mushrooms are a classic appetizer that combines the earthy
            flavor of mushrooms with a savory filling of breadcrumbs, cheeses, garlic,
            and fresh herbs. This recipe elevates simple ingredients into a restaurant-quality
            dish that is both comforting and elegant.
          </p>
          <p>
            Perfect for entertaining or a cozy night in, these mushrooms bake to a golden
            perfection with a crisp topping and a creamy, flavorful center. The recipe is
            versatile and can be adapted to suit various dietary preferences or ingredient
            availability.
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
              Prepare the Mushrooms
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Gently clean the mushrooms with a damp cloth and carefully remove the stems.
              Finely chop the stems and set aside for the stuffing mixture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Make the Stuffing
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a skillet, heat butter and olive oil over medium heat. Add chopped onion,
              garlic, and mushroom stems, sautéing until softened and fragrant. Remove from
              heat and stir in breadcrumbs, cream cheese, Parmesan, parsley, lemon zest,
              salt, and pepper until well combined.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Stuff the Mushrooms
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spoon the stuffing mixture generously into each mushroom cap, pressing lightly
              to fill. Arrange the stuffed mushrooms on a baking tray lined with parchment
              paper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake to Perfection
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat the oven to 190°C (375°F). Bake the mushrooms for 15 minutes or until
              the tops are golden brown and the mushrooms are tender. Remove from oven and
              let cool slightly before serving.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Enjoy
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Garnish with extra parsley if desired and serve warm as an appetizer or side
              dish. These stuffed mushrooms pair beautifully with a crisp white wine or a
              light salad.
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
            Use fresh, firm mushrooms for the best texture and flavor. Avoid mushrooms that
            are slimy or bruised.
          </li>
          <li>
            Toast the breadcrumbs lightly before mixing to add extra crunch and depth to
            the stuffing.
          </li>
          <li>
            For a spicy kick, add a pinch of red pepper flakes or finely chopped chili to
            the stuffing.
          </li>
          <li>
            To make cleanup easier, line your baking tray with parchment paper or a silicone
            baking mat.
          </li>
          <li>
            Experiment with different cheeses like mozzarella or goat cheese for varied
            flavors.
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