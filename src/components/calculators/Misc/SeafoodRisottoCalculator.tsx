import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SeafoodRisottoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Seafood%20Risotto%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9569"
  );

  // --- DATA ---
  const title = "Seafood Risotto";
  const description = "Creamy rice with shrimp, mussels, clams, and fish stock.";

  // INGREDIENTS
  const ingredients = [
    { name: "Arborio Rice", baseAmount: 320, unit: "g" },
    { name: "Shrimp (peeled & deveined)", baseAmount: 200, unit: "g" },
    { name: "Mussels (cleaned)", baseAmount: 200, unit: "g" },
    { name: "Clams (cleaned)", baseAmount: 150, unit: "g" },
    { name: "White Fish Fillet (e.g., cod)", baseAmount: 150, unit: "g" },
    { name: "Fish Stock", baseAmount: 1.2, unit: "L" },
    { name: "Dry White Wine", baseAmount: 150, unit: "ml" },
    { name: "Shallots (finely chopped)", baseAmount: 80, unit: "g" },
    { name: "Garlic Cloves (minced)", baseAmount: 3, unit: "cloves" },
    { name: "Parmesan Cheese (grated)", baseAmount: 80, unit: "g" },
    { name: "Unsalted Butter", baseAmount: 60, unit: "g" },
    { name: "Olive Oil", baseAmount: 30, unit: "ml" },
    { name: "Fresh Parsley (chopped)", baseAmount: 15, unit: "g" },
    { name: "Salt", baseAmount: 5, unit: "g" },
    { name: "Black Pepper (freshly ground)", baseAmount: 2, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "520",
    protein: "38g",
    carbs: "60g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of rice is best for seafood risotto?",
      answer:
        "Arborio rice is the preferred choice for risotto due to its high starch content, which creates the creamy texture characteristic of this dish. Other short-grain varieties like Carnaroli or Vialone Nano can also be used for excellent results.",
    },
    {
      question: "Can I use frozen seafood instead of fresh?",
      answer:
        "Yes, frozen seafood can be used if fresh is not available. Thaw it properly in the refrigerator before cooking to maintain texture and flavor. Avoid overcooking frozen seafood as it can become rubbery.",
    },
    {
      question: "How do I make a good fish stock for the risotto?",
      answer:
        "Use fish bones and heads from white fish, combined with aromatic vegetables like onion, celery, and carrot. Simmer gently with herbs for about 30-40 minutes, then strain. Avoid boiling vigorously to keep the stock clear and flavorful.",
    },
    {
      question: "Can I prepare seafood risotto in advance?",
      answer:
        "Risotto is best served fresh to enjoy its creamy texture. However, you can prepare the stock and chop ingredients ahead of time. If you must reheat, add a splash of stock or water and gently warm while stirring to restore creaminess.",
    },
    {
      question: "What wine pairs well with seafood risotto?",
      answer:
        "A crisp, dry white wine such as Pinot Grigio, Sauvignon Blanc, or Vermentino pairs beautifully with seafood risotto, complementing the delicate flavors without overpowering them.",
    },
    {
      question: "How do I prevent the risotto from becoming too thick or dry?",
      answer:
        "Add the warm fish stock gradually while stirring continuously. This allows the rice to release starch evenly, creating a creamy texture. Avoid adding all the liquid at once and keep the heat moderate to prevent drying out.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Seafood Risotto"
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
            Seafood Risotto is a luxurious Italian dish that perfectly balances the creamy texture of Arborio rice with the delicate flavors of fresh seafood. This recipe combines shrimp, mussels, clams, and white fish simmered gently in a rich fish stock and finished with Parmesan cheese and fresh herbs. The result is a comforting yet elegant meal that showcases the bounty of the sea.
          </p>
          <p>
            Originating from the northern regions of Italy, risotto has long been a staple in Italian cuisine, prized for its creamy consistency and versatility. Seafood risotto, in particular, reflects the coastal culinary traditions where fresh catches are abundant. This dish has evolved over centuries, blending simple ingredients with refined cooking techniques to create a timeless classic enjoyed worldwide.
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
              Prepare the Seafood and Stock
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Clean and devein the shrimp, scrub the mussels and clams, and cut the fish fillet into bite-sized pieces. Prepare the fish stock by simmering fish bones with aromatic vegetables and herbs for 30-40 minutes, then strain and keep warm.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Aromatics and Toast Rice
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil and half the butter in a large pan over medium heat. Add finely chopped shallots and minced garlic, cooking until translucent. Add the Arborio rice and toast it for 2-3 minutes, stirring constantly to coat the grains.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Deglaze and Begin Adding Stock
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the dry white wine and stir until mostly absorbed. Begin adding warm fish stock one ladle at a time, stirring continuously and allowing the liquid to absorb before adding more. Continue this process for about 15 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Seafood and Finish Cooking
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the shrimp, mussels, clams, and fish pieces to the risotto. Continue adding stock and stirring until the seafood is cooked through and the rice is tender but al dente, about 10 more minutes. Discard any unopened mussels or clams.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Finish and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the pan from heat and stir in the remaining butter, grated Parmesan cheese, and chopped fresh parsley. Season with salt and freshly ground black pepper to taste. Serve immediately, garnished with extra parsley if desired.
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
            Use warm fish stock throughout the cooking process to maintain an even temperature and ensure the rice cooks evenly.
          </li>
          <li>
            Stir the risotto gently but continuously to release the rice’s starch, which creates the creamy texture.
          </li>
          <li>
            Avoid overcooking seafood; add it towards the end to keep it tender and flavorful.
          </li>
          <li>
            If you prefer a richer flavor, finish the risotto with a splash of good quality extra virgin olive oil in addition to butter.
          </li>
          <li>
            For an extra touch of freshness, add a squeeze of lemon juice just before serving.
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