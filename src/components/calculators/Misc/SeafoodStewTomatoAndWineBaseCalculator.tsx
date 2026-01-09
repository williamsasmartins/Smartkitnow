import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SeafoodStewTomatoAndWineBaseCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Seafood%20Stew%20Tomato%20and%20Wine%20Base%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2578"
  );

  // --- DATA ---
  const title = "Seafood Stew (Tomato and Wine Base)";
  const description = "Mixed seafood simmered in a rich tomato and white wine broth.";

  // INGREDIENTS
  const ingredients = [
    { name: "Mixed Seafood (shrimp, mussels, squid, clams)", baseAmount: 500, unit: "g" },
    { name: "Olive Oil", baseAmount: 30, unit: "ml" },
    { name: "Yellow Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic Cloves, minced", baseAmount: 4, unit: "cloves" },
    { name: "Carrot, diced", baseAmount: 1, unit: "medium" },
    { name: "Celery Stalks, diced", baseAmount: 2, unit: "stalks" },
    { name: "Canned Crushed Tomatoes", baseAmount: 400, unit: "g" },
    { name: "Dry White Wine", baseAmount: 150, unit: "ml" },
    { name: "Fish Stock or Seafood Broth", baseAmount: 500, unit: "ml" },
    { name: "Fresh Parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Red Pepper Flakes", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper, freshly ground", baseAmount: 0.5, unit: "tsp" },
    { name: "Lemon Juice", baseAmount: 15, unit: "ml" },
  ];

  // Approximate nutrition per serving (4 servings)
  const nutrition = {
    calories: "320",
    protein: "35g",
    carbs: "12g",
    fat: "10g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What types of seafood work best for this stew?",
      answer:
        "A mix of firm, fresh seafood such as shrimp, mussels, clams, and squid works best. These varieties hold their texture well during simmering and complement the tomato and wine broth beautifully. Avoid delicate fish that may fall apart quickly.",
    },
    {
      question: "Can I substitute the white wine in the recipe?",
      answer:
        "Yes, if you prefer not to use alcohol, you can substitute the white wine with additional fish stock or a combination of white grape juice and a splash of vinegar to mimic the acidity and depth that wine provides.",
    },
    {
      question: "How do I ensure the seafood is cooked perfectly?",
      answer:
        "Add seafood in stages based on their cooking times: start with squid and clams, then mussels, and finally shrimp, which cooks quickly. Overcooking seafood can make it tough, so simmer gently and remove from heat as soon as they turn opaque or shells open.",
    },
    {
      question: "Can I prepare the stew in advance?",
      answer:
        "You can prepare the tomato and wine broth base a day ahead and refrigerate it. Add the seafood just before serving to maintain freshness and texture. Reheating seafood stew with seafood already in it can lead to overcooked, rubbery seafood.",
    },
    {
      question: "What side dishes pair well with this seafood stew?",
      answer:
        "Crusty bread or garlic baguette slices are perfect for soaking up the flavorful broth. A light green salad or steamed vegetables complement the richness of the stew without overpowering it.",
    },
    {
      question: "How can I make this stew spicier?",
      answer:
        "Increase the amount of red pepper flakes or add a diced fresh chili pepper during the sautéing stage. Alternatively, a dash of hot sauce can be added to taste just before serving.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Seafood Stew (Tomato and Wine Base)"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 30m
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
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-base">
          <div>
            <div className="font-bold text-lg">{nutrition.calories}</div>
            <span className="font-bold uppercase text-slate-500">Kcal</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.protein}</div>
            <span className="font-bold uppercase text-slate-500">Prot</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.carbs}</div>
            <span className="font-bold uppercase text-slate-500">Carb</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.fat}</div>
            <span className="font-bold uppercase text-slate-500">Fat</span>
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
            This Seafood Stew with a tomato and white wine base is a celebration of
            fresh ocean flavors combined with the rich, tangy depth of slow-simmered
            tomatoes and aromatic herbs. The stew is hearty yet light, perfect for
            showcasing the natural sweetness and briny notes of assorted seafood.
            Ideal for a cozy dinner or an elegant restaurant-style presentation,
            this dish balances rustic charm with refined technique.
          </p>
          <p>
            The origins of tomato and wine-based seafood stews can be traced to
            Mediterranean coastal cuisines, particularly Italian and French
            traditions such as Cioppino and Bouillabaisse. These dishes evolved as
            fishermen’s meals, utilizing the freshest catch of the day simmered in
            flavorful broths enriched with local wine and garden vegetables. This
            recipe honors that heritage while offering a versatile base adaptable to
            various seafood combinations.
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
              Prepare the Base
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large heavy-bottomed pot over medium heat. Add
              chopped onion, carrot, and celery, sautéing until softened and fragrant,
              about 5-7 minutes. Stir in minced garlic and red pepper flakes, cooking
              for another minute until aromatic.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Deglaze and Simmer
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the white wine to deglaze the pot, scraping up any browned bits.
              Let it reduce by half, about 3-4 minutes. Add crushed tomatoes, fish
              stock, salt, and pepper. Bring to a gentle simmer and cook uncovered for
              15 minutes to develop flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Seafood in Stages
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add squid and clams first, simmering for 5 minutes. Then add mussels and
              cook until shells open, about 3-4 minutes. Finally, add shrimp and cook
              until pink and opaque, about 2-3 minutes. Discard any unopened shells.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Finish and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in fresh parsley and lemon juice to brighten the stew. Adjust
              seasoning with salt and pepper as needed. Serve hot with crusty bread
              for dipping.
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
            Use the freshest seafood available for the best flavor and texture. If
            using frozen, thaw completely and pat dry before cooking.
          </li>
          <li>
            To deepen flavor, toast the crushed tomatoes in the pot for a few minutes
            before adding liquids.
          </li>
          <li>
            Keep the heat gentle when simmering seafood to avoid toughening proteins.
          </li>
          <li>
            Customize the stew by adding fennel or fresh thyme for an aromatic twist.
          </li>
          <li>
            Serve with a squeeze of fresh lemon or a drizzle of good quality olive oil
            for added brightness.
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