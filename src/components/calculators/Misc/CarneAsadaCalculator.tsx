import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CarneAsadaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Carne%20Asada%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=474"
  );

  // --- DATA ---
  const title = "Carne Asada";
  const description = "Carne grelhada e temperada, servida com guarnições e tortilhas.";

  // INGREDIENTS
  const ingredients = [
    { name: "Flank Steak or Skirt Steak", baseAmount: 500, unit: "g" },
    { name: "Lime Juice", baseAmount: 60, unit: "ml" },
    { name: "Orange Juice", baseAmount: 60, unit: "ml" },
    { name: "Olive Oil", baseAmount: 30, unit: "ml" },
    { name: "Garlic Cloves (minced)", baseAmount: 3, unit: "pcs" },
    { name: "Cilantro (chopped)", baseAmount: 15, unit: "g" },
    { name: "Jalapeño (seeded and chopped)", baseAmount: 1, unit: "pcs" },
    { name: "Ground Cumin", baseAmount: 1, unit: "tsp" },
    { name: "Chili Powder", baseAmount: 1, unit: "tsp" },
    { name: "Paprika", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 1, unit: "tsp" },
    { name: "Tortillas (corn or flour)", baseAmount: 8, unit: "pcs" },
    { name: "Chopped Onions (for garnish)", baseAmount: 80, unit: "g" },
    { name: "Fresh Cilantro (for garnish)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "350",
    protein: "35g",
    carbs: "15g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of beef is best for Carne Asada?",
      answer:
        "Flank steak or skirt steak are the preferred cuts for Carne Asada due to their rich flavor and ability to absorb marinades well. They are also relatively thin, which allows for quick grilling and tender results when sliced against the grain.",
    },
    {
      question: "How long should I marinate the steak?",
      answer:
        "For optimal flavor and tenderness, marinate the steak for at least 2 hours, but preferably 4 to 6 hours. Avoid marinating for more than 24 hours as the acidity from the citrus juices can start to break down the meat fibers excessively, resulting in a mushy texture.",
    },
    {
      question: "Can I use a grill pan or stovetop instead of an outdoor grill?",
      answer:
        "Yes, a grill pan or cast iron skillet on the stovetop works well if you don’t have access to an outdoor grill. Preheat the pan over high heat and cook the steak for 3-5 minutes per side to achieve a nice sear and caramelization.",
    },
    {
      question: "How do I know when the Carne Asada is cooked perfectly?",
      answer:
        "Aim for medium-rare to medium doneness for the best texture and juiciness. Use a meat thermometer to check for an internal temperature of 130-135°F (54-57°C) for medium-rare. Let the steak rest for 5-10 minutes before slicing to allow juices to redistribute.",
    },
    {
      question: "What are some traditional sides to serve with Carne Asada?",
      answer:
        "Carne Asada is traditionally served with warm corn or flour tortillas, chopped onions, fresh cilantro, lime wedges, and sometimes guacamole or pico de gallo. Refried beans and Mexican rice are also popular accompaniments.",
    },
    {
      question: "Can I prepare Carne Asada in advance?",
      answer:
        "You can marinate the steak up to 24 hours in advance and keep it refrigerated. Cooked Carne Asada is best served fresh but can be stored in an airtight container in the refrigerator for up to 3 days. Reheat gently to avoid drying out the meat.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Carne Asada"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Carne Asada is a classic Latin American dish featuring marinated and grilled beef, typically flank or skirt steak, sliced thin and served with fresh garnishes and warm tortillas. The name translates to "grilled meat," and it is beloved for its smoky, citrusy, and slightly spicy flavor profile. This dish is perfect for gatherings and celebrations, offering a delicious balance of savory, tangy, and fresh elements.
          </p>
          <p>
            Originating from Mexico and popular throughout Latin America, Carne Asada has roots in traditional grilling techniques used by ranchers and families. The marinade often includes citrus juices, garlic, and spices that tenderize the meat and infuse it with vibrant flavors. Over time, Carne Asada has become a staple in Mexican cuisine and has inspired countless variations and accompaniments.
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
              Prepare the Marinade
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, combine lime juice, orange juice, olive oil, minced garlic, chopped cilantro, jalapeño, ground cumin, chili powder, paprika, salt, and black pepper. Whisk together until well blended.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Marinate the Steak
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the flank or skirt steak in a large resealable plastic bag or shallow dish. Pour the marinade over the steak, ensuring it is fully coated. Seal and refrigerate for 2 to 6 hours, turning occasionally.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Preheat the Grill
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat your grill to high heat, about 450°F (230°C). Oil the grates lightly to prevent sticking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Grill the Steak
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the steak from the marinade and shake off excess. Grill for 3-5 minutes per side for medium-rare, or until desired doneness. Avoid overcooking to keep the meat tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Rest and Slice
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Let the steak rest for 5-10 minutes to allow juices to redistribute. Slice thinly against the grain for maximum tenderness.
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
              Serve the sliced Carne Asada with warm tortillas, chopped onions, fresh cilantro, and lime wedges. Add guacamole or salsa if desired.
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
            For the best flavor, use fresh citrus juice rather than bottled. The bright acidity tenderizes the meat and adds vibrant notes.
          </li>
          <li>
            Always slice the steak against the grain to ensure tenderness and a pleasant chew.
          </li>
          <li>
            Letting the steak rest after grilling is crucial to keep it juicy; don’t skip this step.
          </li>
          <li>
            If you prefer a smoky flavor, add wood chips to your grill or use a charcoal grill.
          </li>
          <li>
            Warm your tortillas on the grill for a few seconds before serving to enhance their flavor and pliability.
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
              href="https://en.wikipedia.org/wiki/Carne_asada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Carne Asada
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/carne-asada-recipe-2342806"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Carne Asada Recipe
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