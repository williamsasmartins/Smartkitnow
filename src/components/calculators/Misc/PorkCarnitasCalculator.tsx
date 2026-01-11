import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PorkCarnitasCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Pork%20Carnitas%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2817"
  );

  // --- DATA ---
  const title = "Pork Carnitas";
  const description = "Porco cozido lentamente até ficar macio, depois dourado e suculento.";

  // INGREDIENTS
  const ingredients = [
    { name: "Pork shoulder (boneless)", baseAmount: 800, unit: "g" },
    { name: "Orange juice (fresh)", baseAmount: 120, unit: "ml" },
    { name: "Lime juice (fresh)", baseAmount: 30, unit: "ml" },
    { name: "Garlic cloves (minced)", baseAmount: 4, unit: "pcs" },
    { name: "Onion (medium, chopped)", baseAmount: 1, unit: "pc" },
    { name: "Bay leaves", baseAmount: 2, unit: "pcs" },
    { name: "Ground cumin", baseAmount: 1, unit: "tsp" },
    { name: "Dried oregano", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Vegetable oil", baseAmount: 2, unit: "tbsp" },
    { name: "Water", baseAmount: 120, unit: "ml" },
    { name: "Fresh cilantro (chopped, optional)", baseAmount: 15, unit: "g" },
    { name: "Corn tortillas (for serving)", baseAmount: 8, unit: "pcs" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "450",
    protein: "38g",
    carbs: "12g",
    fat: "25g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of pork is best for carnitas?",
      answer:
        "The best cut for pork carnitas is pork shoulder (also called pork butt or Boston butt) because it has a good balance of fat and connective tissue that breaks down during slow cooking, resulting in tender, juicy meat with rich flavor.",
    },
    {
      question: "Can I make pork carnitas in a slow cooker or Instant Pot?",
      answer:
        "Yes! Pork carnitas can be made in a slow cooker by cooking on low for 6-8 hours or in an Instant Pot using the pressure cook setting for about 45 minutes. Both methods yield tender meat, but the stovetop or oven method allows for better caramelization when crisping the meat at the end.",
    },
    {
      question: "How do I get the crispy edges on pork carnitas?",
      answer:
        "After slow cooking the pork until tender, shred the meat and spread it in a hot skillet with a bit of oil. Cook over medium-high heat without stirring too much to allow the edges to brown and crisp up, creating the signature texture of carnitas.",
    },
    {
      question: "What are traditional toppings and sides for pork carnitas?",
      answer:
        "Traditional toppings include chopped onions, fresh cilantro, lime wedges, and salsa. Pork carnitas are often served with warm corn tortillas, refried beans, Mexican rice, and pickled jalapeños for a complete meal.",
    },
    {
      question: "Can I store leftover pork carnitas?",
      answer:
        "Yes, leftover pork carnitas can be stored in an airtight container in the refrigerator for up to 4 days or frozen for up to 3 months. Reheat gently in a skillet to restore crispiness before serving.",
    },
    {
      question: "Is pork carnitas spicy?",
      answer:
        "Pork carnitas itself is not inherently spicy, as it relies on citrus, garlic, and herbs for flavor. However, you can add chili powder or serve with spicy salsas to adjust the heat level to your preference.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Pork Carnitas"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 2h 30m
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
            Pork Carnitas is a classic Mexican dish featuring pork shoulder
            slowly braised until tender and then crisped to perfection. The
            slow cooking process allows the meat to absorb a vibrant blend of
            citrus, garlic, and spices, resulting in juicy, flavorful morsels
            perfect for tacos, burritos, or simply enjoyed on their own.
          </p>
          <p>
            Originating from the state of Michoacán, carnitas have been a
            beloved staple in Mexican cuisine for centuries. Traditionally,
            pork is simmered in lard, but modern adaptations often use broth or
            citrus juices for a lighter yet equally delicious result. This
            recipe balances authenticity with accessibility, delivering rich
            flavor and tender texture.
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
              Prepare the Pork
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Trim excess fat from the pork shoulder and cut it into large
              chunks (about 3-4 inches). This helps the meat cook evenly and
              absorb flavors better.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season and Sear
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Season the pork chunks generously with salt, pepper, cumin, and
              oregano. Heat vegetable oil in a heavy-bottomed pot over medium
              heat and sear the pork on all sides until golden brown. Remove
              and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Build the Braising Liquid
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In the same pot, add chopped onion, minced garlic, bay leaves,
              orange juice, lime juice, and water. Stir to combine and bring to
              a simmer.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Slow Cook the Pork
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Return the seared pork to the pot, cover, and reduce heat to low.
              Let it simmer gently for 2 to 2.5 hours, or until the pork is
              tender and easily shredded with a fork.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shred and Crisp
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the pork from the pot and shred it using two forks. Heat a
              skillet with a little oil over medium-high heat and crisp the
              shredded pork in batches until edges are golden and crunchy.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the crispy pork carnitas with warm corn tortillas, fresh
              cilantro, diced onions, lime wedges, and your favorite salsa.
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
            For the best flavor, marinate the pork in the orange and lime juice
            mixture with the spices overnight in the refrigerator.
          </li>
          <li>
            Use a heavy-bottomed pot or Dutch oven to ensure even heat
            distribution during slow cooking.
          </li>
          <li>
            When crisping the shredded pork, avoid overcrowding the pan to get
            maximum caramelization.
          </li>
          <li>
            Leftover carnitas make excellent fillings for quesadillas, burritos,
            or nachos.
          </li>
          <li>
            If you prefer a smokier flavor, add a chipotle pepper in adobo sauce
            to the braising liquid.
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
              href="https://en.wikipedia.org/wiki/Carnitas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Carnitas
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/authentic-mexican-carnitas-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Authentic Mexican Carnitas Recipe
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