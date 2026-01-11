import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AlbondigasSoupCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Albondigas%20Soup%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4372"
  );

  // --- DATA ---
  const title = "Albondigas Soup";
  const description = "Sopa com almôndegas e legumes em caldo temperado.";

  // INGREDIENTS
  const ingredients = [
    { name: "Ground beef", baseAmount: 500, unit: "g" },
    { name: "White rice", baseAmount: 100, unit: "g" },
    { name: "Egg", baseAmount: 1, unit: "unit" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Carrots, diced", baseAmount: 2, unit: "medium" },
    { name: "Zucchini, diced", baseAmount: 1, unit: "medium" },
    { name: "Potatoes, peeled and diced", baseAmount: 2, unit: "medium" },
    { name: "Tomato sauce", baseAmount: 400, unit: "ml" },
    { name: "Beef broth", baseAmount: 1500, unit: "ml" },
    { name: "Fresh cilantro, chopped", baseAmount: 15, unit: "g" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper", baseAmount: 1, unit: "tsp" },
    { name: "Ground cumin", baseAmount: 0.5, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "28g",
    carbs: "25g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What are albondigas and how do they differ from regular meatballs?",
      answer:
        "Albondigas are traditional Mexican-style meatballs typically made with ground beef or pork mixed with rice and spices. Unlike some European meatballs that are often fried or baked, albondigas are usually simmered in a flavorful broth or tomato-based soup, giving them a tender texture and rich taste.",
    },
    {
      question: "Can I substitute the ground beef with other meats or plant-based options?",
      answer:
        "Absolutely! Ground pork, turkey, or chicken can be used as alternatives. For a vegetarian version, consider using lentils, textured vegetable protein (TVP), or finely chopped mushrooms combined with cooked rice and binding agents like egg or flaxseed meal.",
    },
    {
      question: "How do I prevent the albondigas from falling apart while cooking?",
      answer:
        "Ensure the meat mixture is well combined and chilled before shaping the meatballs. Adding rice and egg helps bind the mixture. When simmering, avoid vigorous boiling; instead, maintain a gentle simmer to keep the meatballs intact.",
    },
    {
      question: "What vegetables work best in albondigas soup?",
      answer:
        "Common vegetables include carrots, zucchini, potatoes, and sometimes chayote or green beans. These vegetables complement the meatballs and absorb the soup’s flavors well, adding texture and nutrition.",
    },
    {
      question: "Can I prepare albondigas soup in advance?",
      answer:
        "Yes, albondigas soup tastes even better the next day as the flavors meld. Store it in an airtight container in the refrigerator for up to 3 days. Reheat gently on the stove to avoid breaking the meatballs.",
    },
    {
      question: "What side dishes pair well with albondigas soup?",
      answer:
        "Albondigas soup pairs wonderfully with warm corn tortillas, crusty bread, or a simple green salad. A squeeze of fresh lime and some chopped cilantro on top enhances the flavors.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Albondigas Soup"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 40m
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
            Albondigas Soup is a comforting Mexican classic featuring tender meatballs
            simmered in a savory tomato and beef broth with a medley of fresh vegetables.
            This hearty soup combines the rich flavors of seasoned ground beef and rice,
            creating a satisfying meal perfect for any season.
          </p>
          <p>
            The origins of albondigas trace back to Spanish cuisine, where meatballs were
            introduced to the Americas and adapted with local ingredients and spices.
            Over time, albondigas soup has become a beloved dish throughout Mexico and
            beyond, celebrated for its warmth, nutrition, and homestyle appeal.
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
              In a large bowl, combine ground beef, cooked rice, finely chopped onion,
              minced garlic, egg, salt, black pepper, and ground cumin. Mix thoroughly
              until all ingredients are evenly incorporated. Chill the mixture for 15
              minutes to help it firm up.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shape the Albondigas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Using wet hands, form the meat mixture into small balls about 1.5 inches in
              diameter. Place them on a tray and set aside while you prepare the soup base.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Soup Base
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pot, heat a splash of oil over medium heat. Sauté the diced onion
              and garlic until translucent and fragrant. Add the tomato sauce and beef
              broth, stirring to combine. Bring the mixture to a gentle simmer.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Albondigas and Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Gently drop the meatballs into the simmering soup. Add diced carrots,
              potatoes, and zucchini. Cover and cook for 30-40 minutes, or until the
              meatballs are cooked through and the vegetables are tender.
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
              Adjust seasoning with salt and pepper to taste. Stir in chopped fresh
              cilantro just before serving. Ladle the soup into bowls and enjoy warm,
              optionally with warm tortillas or crusty bread.
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
            For tender albondigas, avoid overmixing the meat mixture; mix just until
            combined.
          </li>
          <li>
            Use freshly cooked rice rather than leftover rice to maintain the right
            texture inside the meatballs.
          </li>
          <li>
            Simmer the soup gently to prevent the meatballs from breaking apart.
          </li>
          <li>
            Add a squeeze of fresh lime juice and extra cilantro when serving for a
            bright, fresh finish.
          </li>
          <li>
            Leftover soup can be frozen in airtight containers for up to 3 months.
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
              href="https://en.wikipedia.org/wiki/Albondigas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Albondigas
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.mexicoinmykitchen.com/albondigas-soup/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Mexico In My Kitchen: Albondigas Soup Recipe
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