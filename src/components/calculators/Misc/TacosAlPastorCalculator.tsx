import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TacosAlPastorCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Tacos%20al%20Pastor%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6734"
  );

  // --- DATA ---
  const title = "Tacos al Pastor";
  const description = "Porco marinado com especiarias, abacaxi e cebola, estilo pastor.";

  // INGREDIENTS
  const ingredients = [
    { name: "Pork shoulder, thinly sliced", baseAmount: 500, unit: "g" },
    { name: "Dried guajillo chilies, seeded and soaked", baseAmount: 4, unit: "pcs" },
    { name: "Achiote paste", baseAmount: 3, unit: "tbsp" },
    { name: "Pineapple, sliced", baseAmount: 150, unit: "g" },
    { name: "White onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Fresh cilantro, chopped", baseAmount: 15, unit: "g" },
    { name: "Garlic cloves", baseAmount: 3, unit: "pcs" },
    { name: "White vinegar", baseAmount: 60, unit: "ml" },
    { name: "Orange juice", baseAmount: 60, unit: "ml" },
    { name: "Ground cumin", baseAmount: 1, unit: "tsp" },
    { name: "Dried oregano", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Corn tortillas", baseAmount: 8, unit: "pcs" },
  ];

  // Nutrition estimates per serving (4 servings base)
  const nutrition = {
    calories: "450",
    protein: "35g",
    carbs: "30g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of pork is best for Tacos al Pastor?",
      answer:
        "The best cut for Tacos al Pastor is pork shoulder (also called pork butt). It has the right balance of fat and meat to stay tender and juicy after marinating and cooking. Thinly slicing the shoulder helps it absorb the marinade flavors deeply.",
    },
    {
      question: "Can I make the marinade ahead of time?",
      answer:
        "Absolutely! Preparing the marinade a day in advance allows the flavors to meld beautifully. Marinate the pork for at least 4 hours, preferably overnight, to achieve the authentic depth of flavor characteristic of Tacos al Pastor.",
    },
    {
      question: "How do I cook Tacos al Pastor without a vertical spit?",
      answer:
        "If you don't have a vertical spit (trompo), you can cook the marinated pork on a grill, cast iron skillet, or broiler. Cook in thin layers, turning frequently until nicely charred and cooked through. Adding pineapple slices during cooking enhances caramelization and flavor.",
    },
    {
      question: "What toppings are traditional for Tacos al Pastor?",
      answer:
        "Traditional toppings include finely chopped white onion, fresh cilantro, and small pineapple chunks. A squeeze of fresh lime and a drizzle of salsa (red or green) complete the authentic experience.",
    },
    {
      question: "Can I substitute corn tortillas with flour tortillas?",
      answer:
        "While corn tortillas are traditional and provide the authentic texture and flavor, you can use flour tortillas if preferred. Just note that corn tortillas offer a slightly firmer base that holds the juicy pork better.",
    },
    {
      question: "How spicy are Tacos al Pastor?",
      answer:
        "Tacos al Pastor have a mild to medium spiciness, mainly from the guajillo chilies in the marinade. You can adjust the heat by adding more or fewer chilies or balancing with fresh pineapple sweetness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Tacos al Pastor"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 10m
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
            Tacos al Pastor is a quintessential Mexican street food that features marinated pork cooked with pineapple, onions, and cilantro, served on warm corn tortillas. The pork is traditionally marinated in a blend of dried chilies, achiote paste, and citrus juices, giving it a vibrant red color and a complex, tangy flavor profile. This recipe captures the essence of the classic preparation, balancing savory, sweet, and smoky notes for an unforgettable taco experience.
          </p>
          <p>
            The origins of Tacos al Pastor trace back to Lebanese immigrants who introduced shawarma-style spit-grilled meats to Mexico. Over time, the recipe evolved using local ingredients like pork and pineapple, resulting in the unique and beloved dish known today. It remains a staple in Mexican cuisine, celebrated for its rich cultural fusion and bold flavors.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Marinade</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove seeds from guajillo chilies and soak them in hot water for 15 minutes until soft. Blend the softened chilies with achiote paste, garlic, white vinegar, orange juice, cumin, oregano, salt, and black pepper until smooth to create a vibrant marinade.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Marinate the Pork</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Thinly slice the pork shoulder and coat it thoroughly with the marinade. Cover and refrigerate for at least 4 hours, preferably overnight, to allow the flavors to penetrate deeply.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Pork</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat a grill, cast iron skillet, or broiler to medium-high. Cook the marinated pork slices in batches, turning frequently until charred and cooked through. Add pineapple slices during cooking to caramelize and infuse sweetness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Warm the Tortillas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Warm corn tortillas on a dry skillet or comal until pliable and slightly toasted. Keep them wrapped in a clean kitchen towel to stay warm.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Assemble the Tacos</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place cooked pork and pineapple on each tortilla. Top with finely chopped white onion and fresh cilantro. Serve with lime wedges and your favorite salsa for an authentic finish.
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
            For the best texture, slice the pork shoulder as thinly as possible; partially freezing the meat before slicing can help achieve this.
          </li>
          <li>
            Toast the dried guajillo chilies lightly before soaking to deepen their smoky flavor.
          </li>
          <li>
            Use fresh pineapple during cooking and as a topping to balance the savory and spicy notes with natural sweetness.
          </li>
          <li>
            If you want extra smoky flavor, finish the cooked pork briefly over an open flame or grill.
          </li>
          <li>
            Keep tortillas warm by wrapping them in a clean towel or placing them in a tortilla warmer to maintain softness.
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
              href="https://en.wikipedia.org/wiki/Al_pastor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Al Pastor
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Tacos-Al-Pastor/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Tacos al Pastor Recipe & History
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