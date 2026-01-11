import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BeefShortRibsCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Beef%20Short%20Ribs%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=62"
  );

  // --- DATA ---
  const title = "Beef Short Ribs";
  const description =
    "Cook meaty beef short ribs low-and-slow for rich bark, deep smoke, and buttery tenderness.";

  // INGREDIENTS
  const ingredients = [
    { name: "Beef Short Ribs", baseAmount: 1000, unit: "g" },
    { name: "Kosher Salt", baseAmount: 15, unit: "g" },
    { name: "Freshly Ground Black Pepper", baseAmount: 10, unit: "g" },
    { name: "Garlic Powder", baseAmount: 5, unit: "g" },
    { name: "Onion Powder", baseAmount: 5, unit: "g" },
    { name: "Paprika", baseAmount: 7, unit: "g" },
    { name: "Brown Sugar", baseAmount: 10, unit: "g" },
    { name: "Olive Oil", baseAmount: 30, unit: "ml" },
    { name: "Yellow Onion (sliced)", baseAmount: 150, unit: "g" },
    { name: "Carrots (chopped)", baseAmount: 100, unit: "g" },
    { name: "Celery Stalks (chopped)", baseAmount: 100, unit: "g" },
    { name: "Beef Broth", baseAmount: 500, unit: "ml" },
    { name: "Red Wine (optional)", baseAmount: 250, unit: "ml" },
    { name: "Fresh Thyme Sprigs", baseAmount: 5, unit: "g" },
    { name: "Bay Leaves", baseAmount: 2, unit: "leaves" },
  ];

  // Nutrition estimates per serving (4 servings)
  const nutrition = {
    calories: "650",
    protein: "55g",
    carbs: "12g",
    fat: "40g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the best cooking method for beef short ribs?",
      answer:
        "The best method is low-and-slow cooking, such as braising or smoking, which breaks down the connective tissue and renders the meat tender and flavorful. This recipe uses braising with aromatics and broth to achieve a rich, melt-in-your-mouth texture.",
    },
    {
      question: "Can I prepare beef short ribs in advance?",
      answer:
        "Yes, beef short ribs benefit from resting and even refrigerating overnight after cooking. This allows the flavors to meld and the meat to firm up, making it easier to slice and serve. Reheat gently before serving.",
    },
    {
      question: "What cut of beef short ribs should I use?",
      answer:
        "Look for well-marbled, bone-in beef short ribs, ideally from the chuck or plate section. English cut ribs (cut parallel to the bone) or flanken cut (cut across the bone) both work well, but English cut is preferred for braising.",
    },
    {
      question: "Can I substitute red wine in the braising liquid?",
      answer:
        "Yes, if you prefer not to use alcohol, substitute with additional beef broth or a mixture of broth and a splash of balsamic vinegar or grape juice to add acidity and depth of flavor.",
    },
    {
      question: "How do I achieve a good bark on smoked beef short ribs?",
      answer:
        "To develop a rich bark, apply a dry rub with sugar, salt, and spices, and smoke the ribs at a low temperature (225-250°F) for several hours. Avoid wrapping too early to let the bark form, and maintain consistent smoke and temperature.",
    },
    {
      question: "What side dishes pair well with beef short ribs?",
      answer:
        "Classic sides include creamy mashed potatoes, roasted root vegetables, sautéed greens, or a fresh herb salad. The rich, savory ribs balance well with both hearty and bright, fresh accompaniments.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Beef Short Ribs"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 3h 30m
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Beef short ribs are a richly marbled cut prized for their deep flavor and tender texture when cooked properly. This recipe embraces the classic low-and-slow braising technique, allowing the collagen and connective tissues to break down slowly, resulting in meat that is buttery soft and infused with aromatic herbs and spices. The combination of a savory dry rub and a flavorful braising liquid creates a complex, restaurant-quality dish perfect for special occasions or comforting family meals.
          </p>
          <p>
            Historically, short ribs have been a staple in many cuisines worldwide, from Korean galbi to French pot-au-feu. Their affordability and robust flavor made them popular among home cooks and chefs alike. This recipe draws inspiration from traditional American barbecue and French braising methods, marrying smoky, sweet, and savory elements for a truly indulgent experience.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Dry Rub</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small bowl, combine kosher salt, black pepper, garlic powder, onion powder, paprika, and brown sugar. Mix well to create a balanced dry rub that will enhance the ribs' flavor and help develop a beautiful crust.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Season the Ribs</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pat the beef short ribs dry with paper towels. Generously apply the dry rub on all sides, pressing it into the meat. Let the ribs rest at room temperature for 20 minutes to absorb the seasoning.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sear the Ribs</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a heavy-bottomed Dutch oven or large skillet over medium-high heat. Sear the ribs on all sides until deeply browned, about 3-4 minutes per side. This step locks in flavor and adds richness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the ribs and set aside. In the same pot, add sliced onions, chopped carrots, and celery. Cook until softened and fragrant, about 5-7 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Deglaze and Braise</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in red wine (if using) to deglaze the pot, scraping up browned bits. Let it reduce by half, then add beef broth, fresh thyme, and bay leaves. Return the ribs to the pot, ensuring they are partially submerged. Bring to a simmer.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook Low and Slow</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cover the pot with a tight-fitting lid and transfer to a preheated oven at 150°C (300°F). Braise for 3 to 3.5 hours until the meat is fork-tender and falling off the bone.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              7
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Finish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove ribs and strain the braising liquid. Optionally, reduce the liquid on the stovetop to a sauce consistency. Serve ribs hot, drizzled with sauce, alongside your favorite sides.
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
            For extra depth, marinate the ribs with the dry rub overnight in the refrigerator before cooking.
          </li>
          <li>
            Use a heavy Dutch oven or cast iron pot to ensure even heat distribution during braising.
          </li>
          <li>
            Skim excess fat from the braising liquid before reducing it to keep the sauce balanced.
          </li>
          <li>
            Rest the ribs for 10-15 minutes after cooking to allow juices to redistribute.
          </li>
          <li>
            Experiment with smoked paprika or chipotle powder in the rub for a smoky twist.
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
              href="https://www.seriouseats.com/how-to-cook-beef-short-ribs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Cook Beef Short Ribs
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.bonappetit.com/recipe/braised-beef-short-ribs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Bon Appétit: Braised Beef Short Ribs Recipe
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://en.wikipedia.org/wiki/Short_rib"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Short Rib
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