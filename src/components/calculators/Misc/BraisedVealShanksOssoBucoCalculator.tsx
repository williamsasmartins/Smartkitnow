import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BraisedVealShanksOssoBucoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Braised%20Veal%20Shanks%20Osso%20Buco%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=70"
  );

  // --- DATA ---
  const title = "Braised Veal Shanks (Osso Buco)";
  const description = "Slow-braised veal shanks in wine and vegetables, served with gremolata.";

  // INGREDIENTS
  const ingredients = [
    { name: "Veal Shanks", baseAmount: 800, unit: "g" },
    { name: "Carrots, diced", baseAmount: 150, unit: "g" },
    { name: "Celery stalks, diced", baseAmount: 100, unit: "g" },
    { name: "Yellow onion, diced", baseAmount: 150, unit: "g" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Tomato paste", baseAmount: 2, unit: "tbsp" },
    { name: "Dry white wine", baseAmount: 250, unit: "ml" },
    { name: "Beef or veal stock", baseAmount: 500, unit: "ml" },
    { name: "Olive oil", baseAmount: 3, unit: "tbsp" },
    { name: "Fresh thyme sprigs", baseAmount: 3, unit: "sprigs" },
    { name: "Bay leaves", baseAmount: 2, unit: "leaves" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper, freshly ground", baseAmount: 1, unit: "tsp" },
    { name: "Lemon zest (for gremolata)", baseAmount: 1, unit: "tbsp" },
    { name: "Fresh parsley, chopped (for gremolata)", baseAmount: 2, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = { calories: "520", protein: "45g", carbs: "15g", fat: "25g" };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of veal is best for Osso Buco?",
      answer:
        "The best cut for Osso Buco is the veal shank, which is a cross-cut section of the leg containing a portion of the bone and marrow. This cut is ideal for slow braising as it becomes tender and flavorful while the marrow enriches the sauce.",
    },
    {
      question: "Can I substitute veal with other meats?",
      answer:
        "Yes, you can substitute veal with beef shanks or pork shanks if veal is not available. However, veal is preferred for its tenderness and delicate flavor. Cooking times may vary slightly with other meats.",
    },
    {
      question: "How long should I braise the veal shanks?",
      answer:
        "Typically, veal shanks should be braised for about 1.5 to 2 hours on low heat until the meat is fork-tender. This slow cooking process breaks down the connective tissue, resulting in a rich and tender dish.",
    },
    {
      question: "What is gremolata and why is it served with Osso Buco?",
      answer:
        "Gremolata is a fresh condiment made from lemon zest, garlic, and parsley. It adds a bright, zesty contrast to the rich, braised veal, enhancing the overall flavor and balancing the dish.",
    },
    {
      question: "Can I prepare Osso Buco in advance?",
      answer:
        "Absolutely! Osso Buco often tastes better the next day as the flavors meld together. You can braise it in advance, refrigerate, and gently reheat before serving. Just add fresh gremolata right before serving for the best experience.",
    },
    {
      question: "What side dishes pair well with Osso Buco?",
      answer:
        "Traditional side dishes include creamy risotto alla Milanese, polenta, or mashed potatoes. These sides complement the rich sauce and tender meat perfectly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Braised Veal Shanks (Osso Buco)"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 2h
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
            Osso Buco, meaning "bone with a hole" in Italian, is a classic Milanese dish
            featuring slow-braised veal shanks cooked in a rich broth of white wine,
            vegetables, and herbs. The marrow-filled bone adds a luxurious depth to the
            sauce, making it a hearty and comforting meal perfect for special occasions or
            cozy dinners.
          </p>
          <p>
            Originating from the Lombardy region of Italy, Osso Buco has been a beloved
            staple since the 19th century. Traditionally served with gremolata—a zesty mix
            of lemon zest, garlic, and parsley—it balances the richness of the braised meat
            with fresh, bright flavors. This recipe honors the authentic preparation while
            providing a user-friendly guide to achieve tender, flavorful results every time.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Veal Shanks</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pat the veal shanks dry with paper towels. Season generously with salt and
              freshly ground black pepper on all sides. This step ensures a flavorful crust
              when searing.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sear the Veal Shanks</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large heavy-bottomed pot or Dutch oven over medium-high
              heat. Sear the veal shanks for 4-5 minutes per side until golden brown.
              Remove and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté the Vegetables</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In the same pot, add diced carrots, celery, and onion. Cook over medium heat
              until softened, about 7-8 minutes. Add minced garlic and tomato paste, cooking
              for another 2 minutes to deepen the flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Deglaze and Braise</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the white wine to deglaze the pot, scraping up any browned bits from
              the bottom. Let it reduce by half, then add the stock, thyme, bay leaves, and
              return the veal shanks to the pot. Bring to a simmer, cover, and braise on low
              heat for 1.5 to 2 hours until the meat is tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Gremolata</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              While the veal is braising, combine lemon zest, minced garlic, and chopped
              parsley in a small bowl. This fresh garnish will be sprinkled over the finished
              dish.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the veal shanks from the pot and keep warm. Discard bay leaves and
              thyme stems. Adjust the sauce seasoning if needed and spoon over the meat.
              Sprinkle gremolata on top and serve with your choice of risotto, polenta, or
              mashed potatoes.
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
            For the best flavor, brown the veal shanks well on all sides before braising to
            develop a rich crust.
          </li>
          <li>
            Use homemade or high-quality veal or beef stock to enhance the depth of the
            sauce.
          </li>
          <li>
            If the sauce is too thin after braising, remove the meat and reduce the sauce
            uncovered over medium heat until it thickens to your liking.
          </li>
          <li>
            Serve Osso Buco with a side of saffron risotto (Risotto alla Milanese) for a
            traditional Milanese experience.
          </li>
          <li>
            Gremolata adds a fresh, zesty finish—don't skip it! Add it just before serving
            to preserve its bright flavors.
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