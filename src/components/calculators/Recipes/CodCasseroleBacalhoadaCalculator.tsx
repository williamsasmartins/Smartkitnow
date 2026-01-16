import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CodCasseroleBacalhoadaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Cod%20Casserole%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7694"
  );

  // --- DATA ---
  const title = "Brazilian Cod Casserole";
  const description = "Baked codfish with potatoes, olives, eggs, and olive oil.";

  // INGREDIENTS
  const ingredients = [
    { name: "Salted codfish (bacalhau), soaked and drained", baseAmount: 500, unit: "g" },
    { name: "Potatoes, peeled and sliced", baseAmount: 600, unit: "g" },
    { name: "Onions, thinly sliced", baseAmount: 200, unit: "g" },
    { name: "Garlic cloves, minced", baseAmount: 4, unit: "cloves" },
    { name: "Green olives, pitted", baseAmount: 100, unit: "g" },
    { name: "Hard-boiled eggs, sliced", baseAmount: 4, unit: "eggs" },
    { name: "Tomatoes, sliced", baseAmount: 200, unit: "g" },
    { name: "Red bell pepper, sliced", baseAmount: 1, unit: "medium" },
    { name: "Fresh parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Extra virgin olive oil", baseAmount: 120, unit: "ml" },
    { name: "Black pepper, freshly ground", baseAmount: 1, unit: "tsp" },
    { name: "Bay leaves", baseAmount: 2, unit: "leaves" },
    { name: "Water (for soaking and cooking)", baseAmount: 500, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "35g",
    carbs: "30g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Bacalhoada and why is it popular in Brazil?",
      answer:
        "Bacalhoada is a traditional Brazilian casserole made with salted codfish, potatoes, eggs, olives, and vegetables. It is popular due to its rich flavors and cultural significance, especially during festive occasions like Christmas and Easter. The dish reflects Portuguese culinary influence adapted to Brazilian tastes.",
    },
    {
      question: "How do I properly prepare salted codfish for this recipe?",
      answer:
        "Salted codfish must be soaked in cold water for 24 to 48 hours before cooking, changing the water several times to remove excess salt. This rehydrates the fish and makes it tender. After soaking, drain and pat dry before using in the casserole.",
    },
    {
      question: "Can I substitute fresh codfish instead of salted cod?",
      answer:
        "While fresh cod can be used, the traditional flavor of Bacalhoada comes from the salted cod. Using fresh cod will result in a milder taste and different texture. If using fresh cod, adjust seasoning accordingly and skip the soaking step.",
    },
    {
      question: "What side dishes pair well with Brazilian Cod Casserole?",
      answer:
        "Bacalhoada pairs wonderfully with white rice, sautéed greens like kale or collard greens, and a fresh green salad. A crisp white wine or citrusy beverage complements the rich flavors nicely.",
    },
    {
      question: "How can I store leftovers and reheat the casserole?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days. Reheat gently in the oven at 160°C (320°F) until warmed through to preserve texture and flavor. Avoid microwaving to prevent drying out.",
    },
    {
      question: "Is it possible to make Bacalhoada ahead of time?",
      answer:
        "Yes, Bacalhoada can be assembled a few hours ahead or even the day before. Refrigerate uncovered for about 30 minutes before baking to allow flavors to meld. This makes it a convenient dish for entertaining.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Cod Casserole"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 60m
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
            Brazilian Cod Casserole, known locally as Bacalhoada, is a beloved
            traditional dish that combines salted codfish with hearty potatoes,
            olives, eggs, and a generous drizzle of olive oil. This baked
            casserole is a celebration of textures and flavors, offering a
            comforting yet sophisticated meal that is perfect for family
            gatherings and festive occasions.
          </p>
          <p>
            The origins of Bacalhoada trace back to Portuguese settlers who
            brought salted codfish to Brazil, adapting their recipes to local
            ingredients and tastes. Over centuries, this dish has become a
            staple in Brazilian cuisine, especially in coastal regions where
            seafood is abundant. Its preparation is both an art and a ritual,
            reflecting the rich cultural heritage and culinary traditions of
            Brazil.
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
              Prepare the Codfish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Soak the salted codfish in cold water for 24 to 48 hours, changing
              the water every 6-8 hours to remove excess salt. After soaking,
              drain and pat dry. Remove any skin and bones, then shred the
              fish into bite-sized pieces.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Vegetables and Eggs
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Peel and slice the potatoes into thin rounds. Slice onions,
              tomatoes, and red bell pepper. Hard boil the eggs, peel, and slice
              them. Pit the olives if necessary.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Casserole
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large baking dish, layer half of the potatoes, followed by
              half of the onions, codfish, olives, eggs, tomatoes, and bell
              pepper. Sprinkle with minced garlic, parsley, black pepper, and
              bay leaves. Drizzle generously with olive oil. Repeat the layers
              with the remaining ingredients.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake the Casserole
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat the oven to 180°C (350°F). Cover the dish with foil and bake
              for 40 minutes. Remove the foil and bake for an additional 20
              minutes or until the potatoes are tender and the top is golden.
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
              Let the casserole rest for 10 minutes before serving. Garnish with
              extra parsley if desired. Serve warm alongside rice or a fresh
              salad.
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
            Soaking the salted codfish properly is crucial to avoid an overly
            salty dish; change the water multiple times for best results.
          </li>
          <li>
            Use a good quality extra virgin olive oil to enhance the flavor and
            richness of the casserole.
          </li>
          <li>
            Layering the ingredients evenly ensures every bite has a balanced
            taste of fish, potatoes, and vegetables.
          </li>
          <li>
            Adding bay leaves and fresh parsley infuses the dish with aromatic
            notes that elevate the overall flavor profile.
          </li>
          <li>
            Letting the casserole rest after baking helps the flavors meld and
            the texture to set, making it easier to serve.
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
              href="https://en.wikipedia.org/wiki/Bacalhau"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Bacalhau (Salted Cod) History and Uses
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Brazilian-Bacalhau-Baked-Codfish-Casserole/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Brazilian Bacalhoada Recipe
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