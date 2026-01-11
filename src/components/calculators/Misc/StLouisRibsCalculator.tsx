import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function StLouisRibsCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/St%20Louis%20Ribs%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7981"
  );

  // --- DATA ---
  const title = "St. Louis Ribs";
  const description =
    "Trim and smoke St. Louis ribs for even cooking, bite-through texture, and glaze-friendly bark.";

  // INGREDIENTS
  const ingredients = [
    { name: "St. Louis Style Pork Ribs", baseAmount: 1000, unit: "g" },
    { name: "Brown Sugar", baseAmount: 50, unit: "g" },
    { name: "Paprika", baseAmount: 15, unit: "g" },
    { name: "Kosher Salt", baseAmount: 10, unit: "g" },
    { name: "Black Pepper", baseAmount: 8, unit: "g" },
    { name: "Garlic Powder", baseAmount: 5, unit: "g" },
    { name: "Onion Powder", baseAmount: 5, unit: "g" },
    { name: "Cayenne Pepper", baseAmount: 2, unit: "g" },
    { name: "Mustard Powder", baseAmount: 5, unit: "g" },
    { name: "Apple Cider Vinegar", baseAmount: 60, unit: "ml" },
    { name: "Apple Juice", baseAmount: 120, unit: "ml" },
    { name: "BBQ Sauce", baseAmount: 120, unit: "ml" },
    { name: "Wood Chips (Hickory or Applewood)", baseAmount: 50, unit: "g" },
  ];

  // Nutrition per serving (approximate)
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
      question: "What makes St. Louis ribs different from baby back ribs?",
      answer:
        "St. Louis ribs are trimmed spare ribs with the sternum bone, cartilage, and rib tips removed, resulting in a rectangular, uniform rack. This cut offers more meat and fat compared to baby back ribs, which are leaner and smaller. The St. Louis style is favored for its even cooking and better bark formation.",
    },
    {
      question: "How long should I smoke St. Louis ribs for optimal tenderness?",
      answer:
        "Typically, St. Louis ribs are smoked low and slow at around 225°F (107°C) for 4 to 5 hours. This allows the connective tissues to break down, resulting in tender, juicy ribs. Wrapping the ribs in foil after 3 hours (the 'Texas Crutch') can help retain moisture and speed up cooking.",
    },
    {
      question: "Can I use other types of wood chips for smoking?",
      answer:
        "Yes, while hickory and applewood are classic choices for pork ribs, you can experiment with other woods like cherry, pecan, or maple. Each wood imparts a distinct flavor profile, so choose based on your taste preference. Avoid resinous woods like pine as they produce unpleasant flavors.",
    },
    {
      question: "How do I know when the ribs are done?",
      answer:
        "Ribs are done when the internal temperature reaches about 195°F to 203°F (90°C to 95°C) and the meat has pulled back from the bones by about 1/4 inch. Another test is the 'bend test'—when you pick up the rack with tongs, it should bend easily and the surface should crack slightly.",
    },
    {
      question: "What is the best way to apply BBQ sauce?",
      answer:
        "Apply BBQ sauce during the last 30 minutes of cooking to prevent burning due to the sugars in the sauce. Brush a thin, even layer on both sides of the ribs, then return them to the smoker or grill to let the sauce set and caramelize slightly.",
    },
    {
      question: "Can I prepare the ribs ahead of time?",
      answer:
        "Absolutely! You can trim and apply the dry rub the night before to allow the flavors to penetrate the meat deeply. Store the ribs wrapped in plastic wrap in the refrigerator. This prep step enhances the taste and reduces cooking day workload.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="St. Louis Ribs"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 4h 30m
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
            St. Louis ribs are a beloved cut of pork ribs known for their rectangular shape and balanced meat-to-bone ratio. This recipe guides you through trimming, seasoning, and smoking these ribs to perfection, achieving a tender, flavorful bite with a beautiful bark and glaze. The process emphasizes low and slow cooking, allowing the meat to develop deep smoky flavors and a succulent texture.
          </p>
          <p>
            Originating from the city of St. Louis, Missouri, this rib style became popular in the mid-20th century as a standardized cut for commercial sale. The trimming removes the rib tips and cartilage, creating a uniform rack that cooks evenly and presents beautifully. This style has become a staple in American barbecue culture, celebrated for its rich flavor and satisfying texture.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Ribs</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the membrane from the back of the ribs for better smoke penetration and tenderness. Trim any excess fat and square off the edges to create a uniform rack.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Apply the Dry Rub</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Mix brown sugar, paprika, salt, pepper, garlic powder, onion powder, cayenne, and mustard powder. Generously coat both sides of the ribs with the rub, pressing it into the meat. Let rest for at least 30 minutes or refrigerate overnight for deeper flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Smoker</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your smoker to 225°F (107°C). Add soaked wood chips such as hickory or applewood for a balanced smoky flavor. Maintain consistent temperature throughout the cook.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Smoke the Ribs</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place ribs bone-side down on the smoker rack. Smoke for about 3 hours, spritzing occasionally with apple juice or apple cider vinegar to maintain moisture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Wrap and Continue Cooking</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Wrap ribs tightly in foil with a splash of apple juice and smoke for another 1 to 1.5 hours to tenderize the meat further.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauce and Finish</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Unwrap ribs and brush with BBQ sauce. Return to smoker for 20-30 minutes to set the glaze and develop a sticky, flavorful bark.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              7
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Rest and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Let the ribs rest for 10 minutes before slicing between the bones. Serve with your favorite sides and enjoy!
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
            Remove the silver skin membrane on the back of the ribs for better smoke absorption and tenderness.
          </li>
          <li>
            Use a water pan in your smoker to maintain humidity and prevent the ribs from drying out.
          </li>
          <li>
            Spritz the ribs every 45 minutes with apple juice or apple cider vinegar to keep them moist and add subtle tang.
          </li>
          <li>
            Wrapping ribs in foil during the cook (the "Texas Crutch") helps speed up cooking and tenderizes the meat.
          </li>
          <li>
            Let the ribs rest after cooking to allow juices to redistribute, ensuring a juicy bite.
          </li>
          <li>
            Experiment with different wood chips to find your preferred smoke flavor profile.
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
              href="https://en.wikipedia.org/wiki/St._Louis-style_ribs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: St. Louis-style ribs
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://amazingribs.com/tested-recipes/pork-ribs/how-to-cook-st-louis-style-ribs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              AmazingRibs.com: How to Cook St. Louis Style Ribs
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