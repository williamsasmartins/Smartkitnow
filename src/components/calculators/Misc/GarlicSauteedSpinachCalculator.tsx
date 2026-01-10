import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GarlicSauteedSpinachCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Garlic%20Sauted%20Spinach%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1536"
  );

  // --- DATA ---
  const title = "Garlic Sautéed Spinach";
  const description = "Fresh spinach quickly sautéed with garlic and olive oil.";

  // INGREDIENTS
  const ingredients = [
    { name: "Fresh Spinach", baseAmount: 500, unit: "g" },
    { name: "Garlic Cloves (minced)", baseAmount: 4, unit: "cloves" },
    { name: "Extra Virgin Olive Oil", baseAmount: 3, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "Red Pepper Flakes (optional)", baseAmount: 0.25, unit: "tsp" },
    { name: "Lemon Juice (freshly squeezed)", baseAmount: 1, unit: "tbsp" },
    { name: "Butter (unsalted)", baseAmount: 1, unit: "tbsp" },
    { name: "Onion (finely chopped)", baseAmount: 0.5, unit: "small" },
    { name: "Water", baseAmount: 2, unit: "tbsp" },
    { name: "Parmesan Cheese (optional, grated)", baseAmount: 2, unit: "tbsp" },
    { name: "Fresh Parsley (chopped, optional)", baseAmount: 1, unit: "tbsp" },
  ];

  // Nutrition per 4 servings (approximate)
  const nutrition = {
    calories: "180",
    protein: "5g",
    carbs: "6g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use frozen spinach instead of fresh for this recipe?",
      answer:
        "While fresh spinach is preferred for its texture and flavor, you can use frozen spinach as a substitute. Be sure to thaw and thoroughly drain the frozen spinach to remove excess water before sautéing to avoid a soggy dish.",
    },
    {
      question: "How do I prevent the spinach from becoming too watery when sautéed?",
      answer:
        "Spinach naturally releases water when cooked. To prevent excess moisture, cook it over medium-high heat, stirring frequently to evaporate water quickly. Adding a small amount of butter or oil helps with flavor and texture. Also, avoid overcrowding the pan.",
    },
    {
      question: "Can I add other vegetables or ingredients to this sautéed spinach?",
      answer:
        "Absolutely! Sautéed spinach pairs well with ingredients like mushrooms, pine nuts, sun-dried tomatoes, or caramelized onions. Add these extras early in the cooking process to ensure they cook properly and complement the garlic flavor.",
    },
    {
      question: "What is the best type of garlic to use for sautéing spinach?",
      answer:
        "Fresh garlic cloves are best for this recipe because they provide a robust and aromatic flavor. Mince or thinly slice the garlic to release its oils quickly during sautéing. Avoid pre-minced garlic from jars as it tends to have a milder, less fresh taste.",
    },
    {
      question: "How long can I store leftover garlic sautéed spinach?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days. Reheat gently on the stovetop or microwave to preserve texture and flavor. Avoid freezing as spinach can become mushy upon thawing.",
    },
    {
      question: "Is this recipe suitable for a vegan diet?",
      answer:
        "Yes, this recipe can be made vegan by omitting the butter and Parmesan cheese or substituting them with plant-based alternatives such as vegan butter and nutritional yeast.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Garlic Sautéed Spinach"
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
            Garlic Sautéed Spinach is a simple yet flavorful side dish that
            highlights the fresh, vibrant taste of spinach enhanced by the
            aromatic punch of garlic and the richness of olive oil. This recipe
            is perfect for a quick weeknight meal or as an elegant accompaniment
            to a variety of main courses. Its minimal ingredients and fast
            cooking time make it a staple in both home kitchens and
            professional restaurants.
          </p>
          <p>
            The tradition of sautéing greens with garlic has roots in Mediterranean
            and Italian cuisines, where fresh, seasonal produce is celebrated.
            Spinach itself has been cultivated for centuries and prized for its
            nutritional benefits and versatility. This dish embodies the essence
            of rustic cooking—simple ingredients transformed into something
            delicious and nourishing.
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
              Prepare the Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the fresh spinach thoroughly to remove any grit or dirt. Peel
              and mince the garlic cloves finely. If using onion, chop it finely
              as well. Measure out the olive oil, butter, and other seasonings.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Aromatics
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat the olive oil and butter in a large skillet over medium heat.
              Add the minced garlic and chopped onion (if using) and sauté until
              fragrant and translucent, about 2-3 minutes. Be careful not to burn
              the garlic as it will turn bitter.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Spinach and Cook
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the fresh spinach to the skillet in batches, stirring to wilt
              each addition before adding more. Pour in the water to help steam
              the spinach and cover the pan for 2-3 minutes. Remove the lid and
              continue cooking until all the water evaporates and spinach is tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season and Finish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Season the spinach with salt, freshly ground black pepper, and red
              pepper flakes if desired. Stir in the fresh lemon juice for brightness.
              If using, sprinkle grated Parmesan cheese and chopped parsley on top
              before serving.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the sautéed spinach to a serving dish and enjoy immediately
              as a nutritious side dish or light main course.
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
            Use a large skillet or wok to avoid overcrowding the spinach, which
            helps it cook evenly and prevents steaming instead of sautéing.
          </li>
          <li>
            For a richer flavor, finish the dish with a small knob of butter just
            before serving.
          </li>
          <li>
            Adding a splash of lemon juice brightens the flavors and balances the
            richness of the oil and butter.
          </li>
          <li>
            If you prefer a milder garlic flavor, sauté the garlic with the onion
            and remove it before adding the spinach.
          </li>
          <li>
            To keep the spinach vibrant green, avoid overcooking; it should be
            tender but still bright and fresh-looking.
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
