import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ItalianMeatballsInTomatoSauceCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Italian%20Meatballs%20in%20Tomato%20Sauce%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3581"
  );

  // --- DATA ---
  const title = "Italian Meatballs in Tomato Sauce";
  const description = "Tender beef and pork meatballs simmered in marinara sauce.";

  // INGREDIENTS
  const ingredients = [
    { name: "Ground beef", baseAmount: 300, unit: "g" },
    { name: "Ground pork", baseAmount: 200, unit: "g" },
    { name: "Breadcrumbs", baseAmount: 100, unit: "g" },
    { name: "Parmesan cheese, grated", baseAmount: 50, unit: "g" },
    { name: "Eggs", baseAmount: 2, unit: "pcs" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "pcs" },
    { name: "Fresh parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper, ground", baseAmount: 1, unit: "tsp" },
    { name: "Olive oil", baseAmount: 3, unit: "tbsp" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "pcs" },
    { name: "Canned crushed tomatoes", baseAmount: 800, unit: "g" },
    { name: "Tomato paste", baseAmount: 2, unit: "tbsp" },
    { name: "Dried oregano", baseAmount: 1, unit: "tsp" },
    { name: "Fresh basil leaves", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "35g",
    carbs: "20g",
    fat: "28g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I make the meatballs ahead of time?",
      answer:
        "Yes, you can prepare the meatballs a day in advance and store them covered in the refrigerator. This allows the flavors to meld and makes cooking faster the next day. For longer storage, freeze the uncooked meatballs on a tray, then transfer to a sealed container for up to 3 months.",
    },
    {
      question: "What type of meat is best for Italian meatballs?",
      answer:
        "A combination of ground beef and pork is traditional and provides a good balance of flavor and fat content. Beef adds richness, while pork contributes tenderness. You can also add veal for a more delicate texture or use all beef if preferred.",
    },
    {
      question: "How do I prevent meatballs from falling apart during cooking?",
      answer:
        "Make sure to properly bind the mixture with eggs and breadcrumbs, and avoid overmixing which can make them tough. Chill the formed meatballs for at least 30 minutes before cooking to help them hold their shape. Cooking gently in sauce rather than frying aggressively also helps maintain integrity.",
    },
    {
      question: "Can I use fresh tomatoes instead of canned crushed tomatoes?",
      answer:
        "Yes, fresh ripe tomatoes can be used. You'll need to peel and crush them before cooking. Fresh tomatoes may result in a lighter, fresher sauce but might require longer simmering to achieve the desired thickness and depth of flavor.",
    },
    {
      question: "What can I serve with Italian meatballs in tomato sauce?",
      answer:
        "This dish pairs wonderfully with spaghetti or any pasta of your choice. It also goes well with creamy polenta, crusty Italian bread, or a simple green salad for a balanced meal.",
    },
    {
      question: "How do I store leftovers and reheat them safely?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days. Reheat gently on the stovetop over low heat until warmed through, stirring occasionally. Avoid microwaving at high power to prevent drying out the meatballs.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Italian Meatballs in Tomato Sauce"
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
            Italian Meatballs in Tomato Sauce is a beloved classic that combines
            tender, flavorful meatballs made from a blend of beef and pork with a
            rich, aromatic marinara sauce. This dish is a staple in Italian
            households and restaurants alike, offering a comforting and hearty
            meal that is perfect for family dinners or special occasions.
          </p>
          <p>
            The tradition of meatballs, or "polpette," dates back centuries in Italy,
            with regional variations reflecting local ingredients and tastes. The
            tomato sauce, often simmered slowly with garlic, onions, and fresh herbs,
            complements the savory meatballs perfectly, creating a harmonious blend
            of flavors that has captivated palates worldwide.
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
              Prepare the Meatball Mixture
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the ground beef, ground pork, breadcrumbs,
              grated Parmesan, minced garlic, chopped parsley, eggs, salt, and black
              pepper. Mix gently with your hands or a spoon until just combined,
              being careful not to overwork the mixture to keep the meatballs tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Form the Meatballs
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Shape the mixture into evenly sized meatballs, about 1.5 inches in
              diameter. Place them on a baking sheet or plate and refrigerate for at
              least 30 minutes to help them firm up and hold their shape during cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Tomato Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large skillet or saucepan over medium heat. Add the
              chopped onion and sauté until translucent, about 5 minutes. Stir in the
              tomato paste and cook for 1-2 minutes to deepen the flavor. Add the canned
              crushed tomatoes, dried oregano, salt, and pepper. Bring to a simmer.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Meatballs in Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Gently add the chilled meatballs to the simmering tomato sauce. Cover and
              cook over low heat for 25-30 minutes, turning occasionally to ensure even
              cooking. The meatballs should be cooked through and tender.
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
              Stir in fresh basil leaves just before serving. Serve the meatballs hot,
              spooned over cooked pasta or alongside crusty bread. Garnish with extra
              grated Parmesan and chopped parsley if desired.
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
            Use a mix of beef and pork for the best flavor and texture; pork adds
            juiciness while beef provides richness.
          </li>
          <li>
            Let the meatball mixture rest in the fridge before shaping to make them
            easier to handle and to develop flavors.
          </li>
          <li>
            Simmer meatballs gently in the sauce rather than frying aggressively to
            keep them tender and moist.
          </li>
          <li>
            For a gluten-free version, substitute breadcrumbs with almond flour or
            gluten-free crumbs.
          </li>
          <li>
            Fresh herbs like basil and parsley added at the end brighten the sauce and
            add freshness.
          </li>
          <li>
            If sauce thickens too much during simmering, add a splash of water or red
            wine to loosen it.
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