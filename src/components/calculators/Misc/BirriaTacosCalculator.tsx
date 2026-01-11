import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirriaTacosCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Birria%20Tacos%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6060"
  );

  // --- DATA ---
  const title = "Birria Tacos";
  const description = "Tacos de carne ensopada e especiada, muitas vezes com caldo para “dip”.";

  // INGREDIENTS
  const ingredients = [
    { name: "Beef Chuck Roast", baseAmount: 800, unit: "g" },
    { name: "Dried Guajillo Chiles", baseAmount: 4, unit: "pcs" },
    { name: "Dried Ancho Chiles", baseAmount: 3, unit: "pcs" },
    { name: "Dried Pasilla Chiles", baseAmount: 2, unit: "pcs" },
    { name: "White Onion", baseAmount: 1, unit: "medium" },
    { name: "Garlic Cloves", baseAmount: 5, unit: "pcs" },
    { name: "Tomato", baseAmount: 2, unit: "medium" },
    { name: "Bay Leaves", baseAmount: 3, unit: "pcs" },
    { name: "Ground Cumin", baseAmount: 1, unit: "tsp" },
    { name: "Dried Oregano", baseAmount: 1, unit: "tsp" },
    { name: "Ground Cinnamon", baseAmount: 0.5, unit: "tsp" },
    { name: "Cloves", baseAmount: 3, unit: "pcs" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 1, unit: "tsp" },
    { name: "Beef Broth", baseAmount: 500, unit: "ml" },
    { name: "Corn Tortillas", baseAmount: 12, unit: "pcs" },
    { name: "Chopped Cilantro", baseAmount: 0.5, unit: "cup" },
    { name: "Chopped White Onion", baseAmount: 0.5, unit: "cup" },
    { name: "Lime Wedges", baseAmount: 2, unit: "pcs" },
    { name: "Queso Fresco or Oaxaca Cheese", baseAmount: 150, unit: "g" },
  ];

  // Nutrition estimates per serving (approximate)
  const nutrition = {
    calories: "550",
    protein: "45g",
    carbs: "30g",
    fat: "25g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of meat is best for Birria Tacos?",
      answer:
        "Traditionally, beef chuck roast or short ribs are used for Birria because they become tender and flavorful after slow cooking. Some recipes also use goat or lamb, but beef is most common and accessible.",
    },
    {
      question: "How do I prepare the dried chiles for the sauce?",
      answer:
        "Start by removing the stems and seeds from the dried chiles. Toast them lightly in a dry skillet until fragrant, then soak them in hot water for 15-20 minutes to soften. Blend them with other ingredients to create the rich, spicy sauce.",
    },
    {
      question: "Can I make Birria Tacos without a slow cooker?",
      answer:
        "Yes, you can braise the meat in a heavy pot or Dutch oven on the stovetop or in the oven at low temperature (around 160°C/325°F) for 3-4 hours until tender. Slow cooking just makes the process more hands-off.",
    },
    {
      question: "What is the best way to serve Birria Tacos?",
      answer:
        "Birria Tacos are typically served with the meat dipped or dipped in the flavorful consommé (broth) from cooking. Garnish with chopped onions, cilantro, and a squeeze of lime. Adding melted cheese inside the tacos is also popular.",
    },
    {
      question: "How can I store and reheat leftover Birria?",
      answer:
        "Store leftover meat and consommé separately in airtight containers in the refrigerator for up to 3 days. Reheat gently on the stove or microwave, and dip the tortillas in consommé before frying again for best flavor.",
    },
    {
      question: "Are Birria Tacos spicy?",
      answer:
        "Birria has a mild to moderate heat level depending on the amount and type of dried chiles used. You can adjust the spiciness by reducing or increasing the chiles or by adding fresh jalapeños or hot sauce when serving.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Birria Tacos"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Birria Tacos are a beloved Mexican specialty originating from the state of Jalisco. This dish features tender, slow-cooked beef simmered in a rich, aromatic sauce made from a blend of dried chiles, spices, and herbs. The meat is shredded and served inside crispy corn tortillas, often dipped into the flavorful consommé for an indulgent experience. The combination of smoky, spicy, and savory flavors makes Birria Tacos a true comfort food and a favorite street food across Mexico and beyond.
          </p>
          <p>
            Historically, Birria was prepared using goat meat for special occasions and celebrations. Over time, beef became the more common protein due to availability and preference. The cooking method involves marinating the meat in a chile-based adobo sauce and slow braising it until it becomes melt-in-your-mouth tender. The consommé, the cooking broth, is served alongside for dipping the tacos, enhancing every bite with deep, complex flavors.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Chiles</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove stems and seeds from the dried guajillo, ancho, and pasilla chiles. Toast them lightly in a dry skillet over medium heat until fragrant, about 1-2 minutes per side. Transfer to a bowl and cover with hot water. Let soak for 15-20 minutes until softened.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Adobo Sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Drain the chiles and blend them with chopped tomato, garlic cloves, white onion, cumin, oregano, cinnamon, cloves, salt, and black pepper until smooth. Add a bit of the soaking water or beef broth to help blend. Strain the sauce if desired for a smoother texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Marinate and Cook the Meat</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut the beef chuck roast into large chunks and coat thoroughly with the adobo sauce. Place the meat in a large pot or slow cooker with bay leaves and beef broth. Cover and cook on low heat for 3 to 4 hours until the meat is tender and shreds easily.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Consommé and Toppings</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Once cooked, remove the meat and shred it with forks. Strain the cooking liquid to serve as consommé. Warm the corn tortillas on a skillet, then dip them briefly in the consommé before frying them lightly until crisp. Fill the tortillas with shredded meat and cheese.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the tacos hot with chopped white onion, cilantro, and lime wedges on the side. Use the consommé as a dipping sauce for an authentic Birria experience.
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
            Toast the dried chiles carefully to avoid burning, which can make the sauce bitter. A light toast enhances their flavor.
          </li>
          <li>
            For extra richness, add a small amount of beef fat or butter to the consommé before serving.
          </li>
          <li>
            Use fresh corn tortillas for the best texture and flavor; warming and dipping them in consommé before frying creates the perfect crispy yet tender shell.
          </li>
          <li>
            Leftover consommé can be used as a flavorful base for soups or stews.
          </li>
          <li>
            Experiment with adding a bit of smoked paprika or chipotle pepper for a smoky twist.
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
              href="https://en.wikipedia.org/wiki/Birria"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Birria
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Birria-Tacos/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Birria Tacos Recipe
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