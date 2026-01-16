import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BrazilianBeefVegetableSoupCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Beef%20and%20Vegetable%20Soup%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9044"
  );

  // --- DATA ---
  const title = "Brazilian Beef and Vegetable Soup";
  const description = "Hearty, slow-cooked beef soup with seasonal Brazilian vegetables.";

  // INGREDIENTS
  const ingredients = [
    { name: "Beef chuck, cubed", baseAmount: 500, unit: "g" },
    { name: "Carrots, chopped", baseAmount: 200, unit: "g" },
    { name: "Potatoes, diced", baseAmount: 300, unit: "g" },
    { name: "Chayote squash, peeled and chopped", baseAmount: 150, unit: "g" },
    { name: "Green beans, trimmed and cut", baseAmount: 150, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 100, unit: "g" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "pcs" },
    { name: "Tomato, diced", baseAmount: 150, unit: "g" },
    { name: "Beef broth", baseAmount: 1.5, unit: "L" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Bay leaves", baseAmount: 2, unit: "pcs" },
    { name: "Fresh parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper, freshly ground", baseAmount: 1, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "350",
    protein: "35g",
    carbs: "25g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of beef is best for this soup?",
      answer:
        "For Brazilian Beef and Vegetable Soup, a cut like beef chuck or brisket is ideal because it becomes tender and flavorful when slow-cooked. These cuts have enough marbling to enrich the broth and hold up well during the simmering process.",
    },
    {
      question: "Can I substitute any vegetables if I can't find Brazilian-specific ones?",
      answer:
        "Absolutely! While chayote squash and green beans are traditional, you can substitute with zucchini or yellow squash for chayote and snap peas or asparagus for green beans. The key is to use fresh, seasonal vegetables that hold their shape during cooking.",
    },
    {
      question: "How long should I simmer the soup for the best flavor?",
      answer:
        "Simmer the soup gently for at least 1.5 to 2 hours. This slow cooking allows the beef to become tender and the flavors to meld beautifully. Avoid boiling vigorously to keep the broth clear and rich.",
    },
    {
      question: "Is this soup traditionally served with any accompaniments?",
      answer:
        "Yes, Brazilian Beef and Vegetable Soup is often served with white rice and a side of farofa (toasted cassava flour). Freshly chopped parsley or cilantro sprinkled on top adds a fresh herbal note.",
    },
    {
      question: "Can I prepare this soup in a slow cooker?",
      answer:
        "Definitely! Brown the beef and sauté the aromatics first, then transfer everything to a slow cooker. Cook on low for 6-8 hours or on high for 3-4 hours until the beef is tender and vegetables are cooked through.",
    },
    {
      question: "How should leftovers be stored and reheated?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days. Reheat gently on the stove over medium-low heat, adding a splash of water or broth if needed to loosen the soup. This soup also freezes well for up to 2 months.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Beef and Vegetable Soup"
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
            Brazilian Beef and Vegetable Soup, or "Sopa de Carne com Legumes," is a
            comforting and nourishing dish that showcases the rich culinary traditions
            of Brazil. This hearty soup combines tender slow-cooked beef with a vibrant
            medley of fresh vegetables, creating a balanced and flavorful meal perfect
            for any season.
          </p>
          <p>
            Originating from the diverse regions of Brazil, this soup reflects the
            country’s agricultural bounty and the influence of indigenous, Portuguese,
            and African cuisines. Traditionally prepared in family kitchens, it is
            enjoyed as a wholesome lunch or dinner, often accompanied by rice and
            farofa. The slow simmering technique tenderizes the beef and infuses the
            broth with deep, savory notes, making it a beloved comfort food across
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
              Prepare the Beef
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pat the beef chuck cubes dry with paper towels. Season generously with
              salt and freshly ground black pepper. Heat olive oil in a large heavy
              pot over medium-high heat and brown the beef in batches until all sides
              are nicely seared. Remove and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Aromatics and Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In the same pot, add chopped onions and garlic. Sauté until fragrant and
              translucent, about 3-4 minutes. Add diced tomatoes and cook until they
              soften, about 5 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Combine and Simmer
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Return the browned beef to the pot. Add beef broth, bay leaves, and bring
              to a gentle boil. Reduce heat to low, cover, and simmer for 1 hour,
              stirring occasionally.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add carrots, potatoes, chayote squash, and green beans to the pot. Season
              with salt and pepper to taste. Continue to simmer, uncovered, for another
              30-40 minutes until vegetables are tender.
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
              Remove bay leaves. Stir in freshly chopped parsley. Adjust seasoning if
              needed. Serve hot with white rice and farofa on the side for an authentic
              Brazilian experience.
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
            For deeper flavor, brown the beef well and deglaze the pot with a splash
            of red wine or beef broth before adding the rest of the liquid.
          </li>
          <li>
            Use fresh herbs like parsley or cilantro at the end to brighten the soup
            and add a fresh aroma.
          </li>
          <li>
            To keep the broth clear, avoid boiling vigorously; a gentle simmer is best.
          </li>
          <li>
            If you prefer a thicker soup, mash some of the potatoes into the broth to
            add body.
          </li>
          <li>
            This soup freezes well; store leftovers in airtight containers and thaw
            overnight in the fridge before reheating.
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
              href="https://en.wikipedia.org/wiki/Brazilian_cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Brazilian Cuisine Overview
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.tasteatlas.com/brazilian-beef-and-vegetable-soup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              TasteAtlas: Brazilian Beef and Vegetable Soup
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