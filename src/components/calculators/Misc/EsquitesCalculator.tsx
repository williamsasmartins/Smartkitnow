import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EsquitesCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Mexican%20Corn%20Cup%20Esquites%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=696"
  );

  // --- DATA ---
  const title = "Mexican Corn Cup (Esquites)";
  const description = "Milho em copo com creme, queijo, limão e temperos.";

  // INGREDIENTS
  const ingredients = [
    { name: "Fresh Corn Kernels", baseAmount: 500, unit: "g" },
    { name: "Mayonnaise", baseAmount: 120, unit: "g" },
    { name: "Mexican Crema or Sour Cream", baseAmount: 100, unit: "g" },
    { name: "Cotija Cheese, crumbled", baseAmount: 80, unit: "g" },
    { name: "Lime Juice", baseAmount: 30, unit: "ml" },
    { name: "Butter", baseAmount: 30, unit: "g" },
    { name: "Chili Powder", baseAmount: 5, unit: "g" },
    { name: "Salt", baseAmount: 3, unit: "g" },
    { name: "Black Pepper", baseAmount: 2, unit: "g" },
    { name: "Chopped Cilantro", baseAmount: 15, unit: "g" },
    { name: "Chopped Green Onion", baseAmount: 20, unit: "g" },
    { name: "Optional: Tajín Seasoning", baseAmount: 5, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "280",
    protein: "6g",
    carbs: "20g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Esquites and how is it different from Elote?",
      answer:
        "Esquites is a popular Mexican street food consisting of cooked corn kernels served in a cup with creamy, tangy, and spicy toppings. Unlike Elote, which is corn on the cob typically grilled and eaten directly, Esquites is served off the cob, making it easier to eat and share.",
    },
    {
      question: "Can I use frozen corn for Esquites?",
      answer:
        "Yes, frozen corn can be used as a convenient alternative to fresh corn. However, fresh corn kernels provide a sweeter, more vibrant flavor and better texture. If using frozen, thaw and drain well before cooking to avoid excess moisture.",
    },
    {
      question: "What can I substitute for Cotija cheese if unavailable?",
      answer:
        "Cotija cheese is a salty, crumbly Mexican cheese. If unavailable, you can substitute with feta cheese or grated Parmesan for a similar salty and tangy flavor profile.",
    },
    {
      question: "How spicy is Esquites typically?",
      answer:
        "Esquites usually has a mild to moderate spiciness, primarily from chili powder or Tajín seasoning. You can adjust the amount of chili powder or add fresh jalapeños to increase the heat according to your preference.",
    },
    {
      question: "Can Esquites be served cold or is it best warm?",
      answer:
        "Esquites is traditionally served warm or at room temperature, which enhances the flavors and creaminess. However, it can also be enjoyed chilled as a refreshing snack, especially in hot weather.",
    },
    {
      question: "Is Esquites gluten-free and vegetarian?",
      answer:
        "Yes, Esquites is naturally gluten-free and vegetarian, making it suitable for many dietary preferences. Just ensure that any added seasonings or toppings are gluten-free.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Mexican Corn Cup (Esquites)"
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
            Esquites, often called Mexican Corn Cup, is a beloved street food
            snack that captures the essence of Mexican flavors in a simple,
            creamy, and spicy dish. It features tender corn kernels cooked and
            tossed with a luscious blend of mayonnaise, crema, tangy lime juice,
            and crumbly Cotija cheese, finished with a sprinkle of chili powder
            and fresh herbs. Served in a cup, it’s a perfect handheld treat that
            balances sweet, savory, and zesty notes.
          </p>
          <p>
            Originating from Mexican street vendors, Esquites has a rich cultural
            history as a popular snack enjoyed across Mexico and beyond. Traditionally
            made with fresh corn roasted or boiled, it reflects the country’s deep
            agricultural roots and love for bold, layered flavors. Today, Esquites
            is celebrated worldwide for its comforting taste and versatility.
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
              Prepare the Corn
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              If using fresh corn, remove the husks and silk, then cut the kernels
              off the cob using a sharp knife. If using frozen corn, thaw and drain
              well. Set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Corn
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large skillet, melt the butter over medium heat. Add the corn
              kernels and sauté for about 5-7 minutes until they are tender and
              slightly charred for extra flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Mix the Creamy Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, combine mayonnaise, Mexican crema (or sour cream), lime
              juice, chili powder, salt, and black pepper. Adjust seasoning to taste.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Combine and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Toss the warm corn kernels with the creamy sauce until well coated.
              Spoon into cups or bowls, then sprinkle generously with crumbled
              Cotija cheese, chopped cilantro, green onions, and optional Tajín
              seasoning. Serve immediately with extra lime wedges.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Enjoy!
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Enjoy your delicious Mexican Corn Cup as a snack, side dish, or party
              appetizer. It pairs wonderfully with grilled meats and fresh salsas.
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
            For a smoky flavor, char the corn kernels directly on a grill or in a
            cast-iron skillet before mixing with the sauce.
          </li>
          <li>
            Adjust the creaminess by varying the ratio of mayonnaise to crema or
            sour cream to suit your taste.
          </li>
          <li>
            Use fresh lime juice for the best tangy brightness; bottled lime juice
            can alter the flavor.
          </li>
          <li>
            Add a pinch of smoked paprika or chipotle powder for a deeper smoky
            heat.
          </li>
          <li>
            Serve immediately after preparation to enjoy the best texture and
            flavor; leftovers can be refrigerated but may lose some creaminess.
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
              href="https://en.wikipedia.org/wiki/Esquites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Esquites
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/mexican-corn-cup-esquites-recipe-2342794"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Mexican Corn Cup (Esquites) Recipe
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