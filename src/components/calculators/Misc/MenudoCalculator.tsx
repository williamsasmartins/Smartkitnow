import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MenudoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Menudo%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3038"
  );

  // --- DATA ---
  const title = "Menudo";
  const description = "Sopa clássica com dobradinha e caldo apimentado, bem reconfortante.";

  // INGREDIENTS
  const ingredients = [
    { name: "Beef Tripe (dobradinha)", baseAmount: 500, unit: "g" },
    { name: "Pork Hocks", baseAmount: 300, unit: "g" },
    { name: "White Hominy (dried corn kernels)", baseAmount: 200, unit: "g" },
    { name: "Onion, chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 4, unit: "cloves" },
    { name: "Dried Oregano", baseAmount: 1, unit: "tsp" },
    { name: "Crushed Red Pepper Flakes", baseAmount: 1, unit: "tsp" },
    { name: "Bay Leaves", baseAmount: 2, unit: "leaves" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper, freshly ground", baseAmount: 1, unit: "tsp" },
    { name: "Water or Beef Broth", baseAmount: 2000, unit: "ml" },
    { name: "Green Onions, chopped", baseAmount: 3, unit: "stalks" },
    { name: "Fresh Cilantro, chopped", baseAmount: 0.5, unit: "cup" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "wedges" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "350",
    protein: "35g",
    carbs: "25g",
    fat: "8g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Menudo and where does it originate from?",
      answer:
        "Menudo is a traditional Mexican soup made primarily with beef tripe and hominy, simmered in a rich, spicy broth. It is a beloved comfort food often served during special occasions and family gatherings. The dish has roots in Mexican culinary traditions, with influences from indigenous and Spanish cuisines.",
    },
    {
      question: "How do I properly clean beef tripe for Menudo?",
      answer:
        "Cleaning beef tripe thoroughly is essential to remove any residual odors and impurities. Rinse the tripe under cold running water, then soak it in a mixture of water and vinegar or lemon juice for about 30 minutes. Scrub gently with a brush if needed, rinse again, and blanch in boiling water for 5 minutes before cooking.",
    },
    {
      question: "Can I prepare Menudo in advance and reheat it?",
      answer:
        "Yes, Menudo often tastes better the next day as the flavors meld together. Store it in an airtight container in the refrigerator for up to 3 days. Reheat gently on the stove over low heat, stirring occasionally. You may need to add a little water or broth to adjust the consistency.",
    },
    {
      question: "What are some common garnishes served with Menudo?",
      answer:
        "Typical garnishes include chopped fresh cilantro, sliced green onions, lime wedges, and crushed red pepper flakes or chili powder. Some also enjoy adding chopped raw onions or oregano on top. These garnishes add freshness and extra layers of flavor to the hearty soup.",
    },
    {
      question: "Is Menudo suitable for people new to offal dishes?",
      answer:
        "Menudo can be an acquired taste due to its use of beef tripe, which has a unique texture and flavor. However, when prepared well with proper cleaning and slow cooking, it becomes tender and flavorful. It's a great introduction to offal dishes for adventurous eaters and those interested in traditional Mexican cuisine.",
    },
    {
      question: "Can I substitute ingredients if I can't find hominy?",
      answer:
        "If hominy is unavailable, you can substitute with canned white corn kernels or even cooked white beans for texture, though the flavor and authenticity will differ. Hominy provides a distinctive chewy texture and slightly nutty flavor that is characteristic of Menudo.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Menudo"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 3h
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
            Menudo is a hearty and traditional Mexican soup known for its rich, spicy broth and tender beef tripe. This dish is a staple in Mexican households and is often enjoyed during celebrations or as a comforting meal to warm the soul. The combination of hominy, aromatic spices, and slow-cooked offal creates a unique and deeply satisfying flavor profile that has been cherished for generations.
          </p>
          <p>
            The origins of Menudo trace back to indigenous Mexican cuisine, where corn and offal were common ingredients. Over time, Spanish influences introduced new spices and cooking techniques, evolving Menudo into the beloved dish it is today. It is often considered a restorative meal, traditionally served at family gatherings and special occasions, symbolizing warmth and community.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Clean the Tripe</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the beef tripe thoroughly under cold running water. Soak it in a mixture of water and vinegar or lemon juice for 30 minutes to remove odors. Scrub gently if needed, then rinse again and blanch in boiling water for 5 minutes. Drain and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Hominy</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              If using dried hominy, soak overnight and rinse well. If using canned hominy, drain and rinse under cold water. Set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pot, heat a small amount of oil over medium heat. Add chopped onions and minced garlic, sautéing until fragrant and translucent, about 3-4 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Meat and Spices</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the cleaned tripe and pork hocks to the pot. Stir in dried oregano, crushed red pepper flakes, bay leaves, salt, and black pepper. Cook for a few minutes to combine flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Simmer the Soup</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in water or beef broth to cover the ingredients. Bring to a boil, then reduce heat to low and simmer, covered, for about 2.5 to 3 hours or until the tripe is tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Hominy and Finish Cooking</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the prepared hominy to the pot and continue simmering for another 30-45 minutes until hominy is tender and flavors meld together.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              7
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve and Garnish</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Ladle the Menudo into bowls and garnish with chopped green onions, fresh cilantro, and lime wedges. Serve hot with warm tortillas or crusty bread.
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
            For best texture, simmer the tripe slowly over low heat to avoid toughness.
          </li>
          <li>
            Use fresh lime juice just before serving to brighten the flavors.
          </li>
          <li>
            If you prefer less spice, reduce or omit the crushed red pepper flakes.
          </li>
          <li>
            Hominy can be found canned or dried; canned is quicker but dried offers better texture after soaking.
          </li>
          <li>
            Menudo tastes even better the next day as the flavors deepen—consider making it in advance.
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
              href="https://en.wikipedia.org/wiki/Menudo_(soup)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Menudo (Soup)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/authentic-mexican-menudo-recipe-2342639"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Authentic Mexican Menudo Recipe
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