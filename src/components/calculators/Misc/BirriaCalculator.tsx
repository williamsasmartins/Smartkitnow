import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirriaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Birria%20Beef%20or%20Goat%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2973"
  );

  // --- DATA ---
  const title = "Birria (Beef or Goat)";
  const description = "Ensopado especiado de boi ou cabra, servido com caldo e tortilhas.";

  // INGREDIENTS
  const ingredients = [
    { name: "Beef chuck or goat meat", baseAmount: 1000, unit: "g" },
    { name: "Dried guajillo chiles", baseAmount: 5, unit: "pcs" },
    { name: "Dried ancho chiles", baseAmount: 3, unit: "pcs" },
    { name: "Dried pasilla chiles", baseAmount: 2, unit: "pcs" },
    { name: "White onion", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves", baseAmount: 5, unit: "pcs" },
    { name: "Cinnamon stick", baseAmount: 1, unit: "stick" },
    { name: "Cloves", baseAmount: 4, unit: "pcs" },
    { name: "Black peppercorns", baseAmount: 1, unit: "tsp" },
    { name: "Bay leaves", baseAmount: 2, unit: "pcs" },
    { name: "Oregano (dried)", baseAmount: 1, unit: "tsp" },
    { name: "Thyme (dried)", baseAmount: 1, unit: "tsp" },
    { name: "Vinegar (white or apple cider)", baseAmount: 2, unit: "tbsp" },
    { name: "Beef broth or water", baseAmount: 1000, unit: "ml" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Corn tortillas", baseAmount: 8, unit: "pcs" },
    { name: "Chopped cilantro (for garnish)", baseAmount: 0.25, unit: "cup" },
    { name: "Chopped white onion (for garnish)", baseAmount: 0.25, unit: "cup" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "pcs" },
  ];

  const nutrition = {
    calories: "550",
    protein: "45g",
    carbs: "20g",
    fat: "30g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Birria and where does it originate from?",
      answer:
        "Birria is a traditional Mexican stew originating from the state of Jalisco. It is typically made with goat meat but can also be prepared with beef or lamb. The dish is known for its rich, spicy, and aromatic broth, slow-cooked until the meat is tender and flavorful.",
    },
    {
      question: "Can I substitute goat meat with beef in Birria?",
      answer:
        "Yes, beef is a common substitute for goat meat in Birria, especially in regions where goat is less available. Cuts like beef chuck or brisket work well due to their marbling and tenderness after slow cooking.",
    },
    {
      question: "How do I prepare the chili sauce for Birria?",
      answer:
        "The chili sauce is made by rehydrating dried guajillo, ancho, and pasilla chiles, then blending them with garlic, onion, vinegar, and spices such as cinnamon, cloves, and oregano. This sauce is then used to marinate the meat and flavor the broth.",
    },
    {
      question: "What is the best way to serve Birria?",
      answer:
        "Birria is traditionally served with its broth (consommé) alongside warm corn tortillas. Garnishes like chopped cilantro, diced onions, and lime wedges enhance the flavors. It can be enjoyed as a stew or used as a filling for tacos.",
    },
    {
      question: "How long should I cook Birria for optimal tenderness?",
      answer:
        "Birria should be slow-cooked for at least 3 to 4 hours, either in a slow cooker, oven, or stovetop simmer, until the meat is tender and easily shredded. This slow cooking allows the flavors to meld and the meat to absorb the spices deeply.",
    },
    {
      question: "Can Birria be made ahead and stored?",
      answer:
        "Absolutely. Birria tastes even better the next day as the flavors continue to develop. Store it in an airtight container in the refrigerator for up to 3 days or freeze for longer storage. Reheat gently before serving.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Birria (Beef or Goat)"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 4h
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
            Birria is a deeply flavorful Mexican stew traditionally made with goat
            meat, though beef is often used as a popular alternative. This
            dish is celebrated for its rich, spicy broth infused with a blend of
            dried chiles, aromatic spices, and slow-cooked tender meat. Served
            with warm corn tortillas and garnished with fresh cilantro, onions,
            and lime, Birria offers a comforting and festive culinary experience.
          </p>
          <p>
            Originating from the state of Jalisco, Birria has roots tracing back
            to indigenous cooking methods combined with Spanish influences. It
            was originally prepared for special occasions and celebrations, and
            today it remains a beloved dish across Mexico and beyond, often
            enjoyed as tacos or a hearty stew accompanied by its flavorful
            consommé.
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
              Remove stems and seeds from the dried guajillo, ancho, and pasilla
              chiles. Toast them lightly in a dry skillet over medium heat until
              fragrant, about 1-2 minutes. Then soak the toasted chiles in hot
              water for 20 minutes until softened.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Make the Marinade
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Blend the soaked chiles with garlic, white onion, vinegar, cinnamon,
              cloves, black peppercorns, oregano, thyme, and a pinch of salt until
              smooth. Adjust consistency with some soaking liquid if needed.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Marinate the Meat
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Coat the beef or goat meat thoroughly with the chili marinade. Cover
              and refrigerate for at least 2 hours, preferably overnight, to allow
              flavors to penetrate.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Birria
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the marinated meat in a large pot or slow cooker. Add bay leaves
              and beef broth or water to cover the meat. Simmer gently for 3-4 hours
              until the meat is tender and shreds easily.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Garnish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Shred the meat and serve with warm corn tortillas and a bowl of the
              flavorful broth (consommé). Garnish with chopped cilantro, diced
              onions, and lime wedges for a traditional experience.
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
            Marinate the meat overnight if possible to deepen the flavor profile.
          </li>
          <li>
            Use a slow cooker or oven braise method for consistent low heat and
            tender results.
          </li>
          <li>
            Strain the consommé before serving for a clear, rich broth.
          </li>
          <li>
            For tacos, dip the tortillas in the consommé before grilling for extra
            flavor and texture.
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
              href="https://www.saveur.com/article/Recipes/Birria-Goat-Stew/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Birria Recipe and History
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