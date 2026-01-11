import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CochinitaPibilCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Cochinita%20Pibil%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4136"
  );

  // --- DATA ---
  const title = "Cochinita Pibil";
  const description = "Porco marinado com achiote e cítricos, cozido lentamente (Yucatán).";

  // INGREDIENTS
  const ingredients = [
    { name: "Pork shoulder (cubed)", baseAmount: 1000, unit: "g" },
    { name: "Achiote paste", baseAmount: 100, unit: "g" },
    { name: "Orange juice (fresh)", baseAmount: 200, unit: "ml" },
    { name: "Lime juice", baseAmount: 60, unit: "ml" },
    { name: "Garlic cloves (minced)", baseAmount: 4, unit: "pcs" },
    { name: "White vinegar", baseAmount: 60, unit: "ml" },
    { name: "Cumin powder", baseAmount: 2, unit: "tsp" },
    { name: "Oregano (dried)", baseAmount: 1, unit: "tsp" },
    { name: "Bay leaves", baseAmount: 3, unit: "pcs" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper", baseAmount: 1, unit: "tsp" },
    { name: "Banana leaves (optional, for wrapping)", baseAmount: 2, unit: "pcs" },
    { name: "Red onion (thinly sliced, for garnish)", baseAmount: 1, unit: "pcs" },
    { name: "Fresh cilantro (chopped, for garnish)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "45g",
    carbs: "6g",
    fat: "30g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) => (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Cochinita Pibil?",
      answer:
        "Cochinita Pibil is a traditional Mexican slow-roasted pork dish from the Yucatán Peninsula. It is marinated in achiote paste and citrus juices, wrapped in banana leaves, and cooked until tender, resulting in a flavorful and aromatic meal.",
    },
    {
      question: "Can I use other cuts of pork for this recipe?",
      answer:
        "Yes, while pork shoulder is preferred for its fat content and tenderness, you can also use pork butt or picnic roast. Avoid very lean cuts as they may dry out during the slow cooking process.",
    },
    {
      question: "What can I substitute for banana leaves if unavailable?",
      answer:
        "If banana leaves are not available, you can use aluminum foil to wrap the meat during cooking. The banana leaves impart a unique aroma, but foil will still help retain moisture and flavor.",
    },
    {
      question: "How long should I marinate the pork?",
      answer:
        "For best results, marinate the pork for at least 4 hours, preferably overnight. This allows the achiote and citrus flavors to deeply penetrate the meat, enhancing the dish's signature taste.",
    },
    {
      question: "What are traditional accompaniments for Cochinita Pibil?",
      answer:
        "Cochinita Pibil is traditionally served with pickled red onions, fresh cilantro, warm corn tortillas, and sometimes refried beans or rice. The pickled onions add a tangy contrast to the rich pork.",
    },
    {
      question: "Can I cook Cochinita Pibil in a slow cooker?",
      answer:
        "Absolutely! After marinating, place the pork and marinade in a slow cooker and cook on low for 6-8 hours until the meat is tender and easily shredded.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Cochinita Pibil"
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
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setServings((s) => Math.max(1, s - 1))}>
                -
              </Button>
              <span className="w-6 text-center font-bold text-lg">{servings}</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setServings((s) => s + 1)}>
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
            Cochinita Pibil is a classic Mexican dish originating from the Yucatán Peninsula, renowned for its vibrant flavors and tender texture. The pork is marinated in a mixture of achiote paste, citrus juices, and spices, then traditionally wrapped in banana leaves and slow-cooked to perfection. This method infuses the meat with a unique earthy aroma and a subtle tang, making it a beloved staple in Mexican cuisine.
          </p>
          <p>
            Historically, Cochinita Pibil was prepared by the Mayan people using underground pits called "pib," where the wrapped meat would cook slowly over several hours. This technique not only tenderized the pork but also imparted smoky flavors from the pit. Today, while modern ovens and slow cookers are commonly used, the essence of the dish remains true to its ancient roots, celebrating the rich culinary heritage of the Yucatán region.
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
              In a large bowl, dissolve the achiote paste in the orange juice, lime juice, and white vinegar. Add minced garlic, cumin, oregano, salt, and black pepper. Mix thoroughly until the marinade is smooth and evenly combined.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Marinate the Pork</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the cubed pork shoulder to the marinade, ensuring all pieces are well coated. Cover and refrigerate for at least 4 hours, preferably overnight, to allow the flavors to penetrate deeply.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Wrap and Cook</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 150°C (300°F). If using banana leaves, briefly pass them over an open flame to make them pliable. Line a baking dish with banana leaves, place the marinated pork on top, add bay leaves, and cover with more banana leaves. Seal tightly with foil.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Slow Roast</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Roast the pork in the oven for about 4 hours, or until the meat is very tender and easily shredded with a fork. Alternatively, use a slow cooker on low for 6-8 hours.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the pork from the oven and shred it with two forks. Serve hot with warm corn tortillas, pickled red onions, and fresh cilantro for a traditional and delicious meal.
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
            For an authentic smoky flavor, try cooking the wrapped pork in a charcoal grill or smoker if possible.
          </li>
          <li>
            If fresh orange juice is unavailable, a mix of orange and pineapple juice can add a nice sweetness and acidity.
          </li>
          <li>
            Use gloves when handling achiote paste as it can stain your hands and surfaces.
          </li>
          <li>
            Leftover Cochinita Pibil makes excellent tacos or tortas and can be reheated gently with a splash of orange juice to keep it moist.
          </li>
          <li>
            Pickled red onions can be made by soaking thinly sliced onions in lime juice and a pinch of salt for at least 30 minutes.
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
              href="https://en.wikipedia.org/wiki/Cochinita_pibil"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Cochinita Pibil
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.mexicoinmykitchen.com/cochinita-pibil-recipe/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Mexico In My Kitchen: Authentic Cochinita Pibil Recipe
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