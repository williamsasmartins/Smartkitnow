import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BarbacoaTacosCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Barbacoa%20Tacos%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5122"
  );

  // --- DATA ---
  const title = "Barbacoa Tacos";
  const description = "Carne cozida lentamente, macia e bem temperada, servida em tacos.";

  // INGREDIENTS
  const ingredients = [
    { name: "Beef Chuck Roast", baseAmount: 800, unit: "g" },
    { name: "Dried Guajillo Chiles", baseAmount: 3, unit: "pcs" },
    { name: "Dried Ancho Chiles", baseAmount: 2, unit: "pcs" },
    { name: "White Vinegar", baseAmount: 60, unit: "ml" },
    { name: "Garlic Cloves", baseAmount: 4, unit: "pcs" },
    { name: "Onion", baseAmount: 1, unit: "medium" },
    { name: "Bay Leaves", baseAmount: 2, unit: "pcs" },
    { name: "Ground Cumin", baseAmount: 1, unit: "tsp" },
    { name: "Dried Oregano", baseAmount: 1, unit: "tsp" },
    { name: "Cloves", baseAmount: 3, unit: "pcs" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 1, unit: "tsp" },
    { name: "Beef Broth", baseAmount: 240, unit: "ml" },
    { name: "Corn Tortillas", baseAmount: 12, unit: "pcs" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "45g",
    carbs: "20g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of beef is best for barbacoa tacos?",
      answer:
        "The best cut for barbacoa is beef chuck roast due to its marbling and connective tissue, which breaks down during slow cooking, resulting in tender, flavorful meat. Some also use beef cheeks or brisket for even richer texture.",
    },
    {
      question: "Can I make barbacoa tacos without dried chiles?",
      answer:
        "While dried guajillo and ancho chiles provide the signature smoky and mildly spicy flavor, you can substitute with chipotle peppers in adobo or smoked paprika for a different but delicious twist. However, the authentic taste relies heavily on these dried chiles.",
    },
    {
      question: "How long should I cook the barbacoa for optimal tenderness?",
      answer:
        "Slow cooking for 6 to 8 hours at low heat (around 90-95°C / 195-205°F) is ideal to break down the collagen and fat, making the meat tender and juicy. Using a slow cooker, oven, or pressure cooker can achieve this.",
    },
    {
      question: "What toppings complement barbacoa tacos best?",
      answer:
        "Traditional toppings include finely chopped white onion, fresh cilantro, a squeeze of lime, and salsa verde or roja. You can also add pickled red onions or radishes for extra crunch and acidity.",
    },
    {
      question: "Can I prepare barbacoa tacos ahead of time?",
      answer:
        "Yes, barbacoa tastes even better the next day as the flavors meld. Store the cooked meat in an airtight container in the refrigerator for up to 3 days or freeze for longer storage. Reheat gently to preserve moisture.",
    },
    {
      question: "Are barbacoa tacos gluten-free?",
      answer:
        "Yes, barbacoa tacos are naturally gluten-free when served with corn tortillas and without any gluten-containing sauces or additives. Always check labels if using store-bought ingredients.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Barbacoa Tacos"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 6-8h
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
            Barbacoa tacos are a beloved Mexican dish featuring beef that is
            slow-cooked until tender and richly flavored. The meat is traditionally
            cooked in an underground pit, but modern recipes use slow cookers or
            ovens to achieve the same melt-in-your-mouth texture. Served on warm
            corn tortillas with fresh toppings, barbacoa tacos offer a perfect
            balance of smoky, spicy, and savory flavors.
          </p>
          <p>
            Originating from the indigenous peoples of Mexico, barbacoa has a long
            history as a communal cooking method. The word "barbacoa" itself is
            believed to have influenced the English term "barbecue." Over time,
            regional variations have emerged, with beef barbacoa becoming popular
            in northern Mexico and the southwestern United States.
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
              Prepare the Chiles
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove stems and seeds from the dried guajillo and ancho chiles. Toast
              them lightly in a dry skillet for 1-2 minutes until fragrant. Soak the
              toasted chiles in hot water for 15 minutes to soften.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Make the Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Blend the soaked chiles with garlic, onion, white vinegar, cumin,
              oregano, cloves, salt, and black pepper until smooth. Add a bit of the
              soaking water if needed to achieve a thick sauce consistency.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Meat
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut the beef chuck roast into large chunks. Place the meat in a slow
              cooker or heavy pot. Pour the chile sauce over the meat, add bay leaves
              and beef broth.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook Slowly
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cook on low heat for 6 to 8 hours until the meat is tender and shreds
              easily. If using an oven, cover tightly and cook at 300°F (150°C) for
              the same duration.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble Tacos
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Shred the cooked beef with forks. Warm the corn tortillas and fill
              each with a generous amount of barbacoa. Top with chopped onions,
              cilantro, lime juice, and your favorite salsa.
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
            Toast the dried chiles gently to enhance their smoky flavor but avoid
            burning them as it will add bitterness.
          </li>
          <li>
            Use fresh garlic and onion for the sauce to keep the flavors vibrant and
            balanced.
          </li>
          <li>
            If you prefer a spicier barbacoa, add a chipotle pepper or a pinch of
            cayenne to the sauce blend.
          </li>
          <li>
            For authentic texture, shred the meat by hand rather than using a food
            processor.
          </li>
          <li>
            Warm your corn tortillas on a hot skillet or comal before serving to
            enhance their flavor and pliability.
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
              href="https://en.wikipedia.org/wiki/Barbacoa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Barbacoa
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/authentic-mexican-barbacoa-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Authentic Mexican Barbacoa Recipe
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