import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BabyBackRibsCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Baby%20Back%20Ribs%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1946"
  );

  // --- DATA ---
  const title = "Baby Back Ribs";
  const description =
    "Smoke baby back ribs until tender with a sweet-savory rub and reliable doneness checks.";

  // INGREDIENTS
  const ingredients = [
    { name: "Baby Back Ribs", baseAmount: 1000, unit: "g" },
    { name: "Brown Sugar", baseAmount: 50, unit: "g" },
    { name: "Paprika", baseAmount: 15, unit: "g" },
    { name: "Salt", baseAmount: 10, unit: "g" },
    { name: "Black Pepper", baseAmount: 5, unit: "g" },
    { name: "Garlic Powder", baseAmount: 5, unit: "g" },
    { name: "Onion Powder", baseAmount: 5, unit: "g" },
    { name: "Chili Powder", baseAmount: 5, unit: "g" },
    { name: "Cayenne Pepper", baseAmount: 2, unit: "g" },
    { name: "Apple Cider Vinegar", baseAmount: 60, unit: "ml" },
    { name: "Honey", baseAmount: 30, unit: "ml" },
    { name: "Olive Oil", baseAmount: 15, unit: "ml" },
    { name: "BBQ Sauce", baseAmount: 120, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
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
      question: "What is the best way to ensure tender baby back ribs?",
      answer:
        "To achieve tender baby back ribs, slow smoking at a low temperature (around 225°F or 107°C) for several hours is key. Wrapping the ribs in foil during the cooking process helps retain moisture, and using a water pan in the smoker can maintain humidity. Additionally, letting the ribs rest after cooking allows the juices to redistribute, resulting in tender meat.",
    },
    {
      question: "Can I use an oven instead of a smoker for this recipe?",
      answer:
        "Yes, you can cook baby back ribs in the oven if you don't have a smoker. Preheat your oven to 275°F (135°C), season the ribs as directed, and wrap them tightly in foil. Bake for about 2.5 to 3 hours until tender. Finish by brushing with BBQ sauce and broiling or grilling briefly to caramelize the sauce.",
    },
    {
      question: "How do I know when the ribs are done?",
      answer:
        "Ribs are done when the meat has shrunk back from the bones by about 1/4 inch and a toothpick or probe slides in with little resistance. The internal temperature should be around 195°F to 203°F (90°C to 95°C) for optimal tenderness. Avoid overcooking to prevent dryness.",
    },
    {
      question: "What type of wood is best for smoking baby back ribs?",
      answer:
        "Fruitwoods like apple, cherry, or peach are excellent choices for smoking baby back ribs as they impart a mild, sweet flavor that complements pork well. Hickory and oak provide a stronger, smokier taste but should be used sparingly to avoid overpowering the ribs.",
    },
    {
      question: "Can I prepare the rub and ribs ahead of time?",
      answer:
        "Absolutely! Applying the dry rub and wrapping the ribs in plastic wrap or foil allows the flavors to penetrate the meat more deeply if refrigerated overnight. This step enhances the taste and can make your cooking day more efficient.",
    },
    {
      question: "How should I store leftover ribs?",
      answer:
        "Leftover ribs should be cooled to room temperature, then wrapped tightly in foil or placed in an airtight container and refrigerated. They can be stored safely for up to 3-4 days. Reheat gently in the oven or on the grill to preserve moisture and flavor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Baby Back Ribs"
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
            Baby back ribs are a beloved cut of pork ribs prized for their tenderness and rich flavor.
            This recipe guides you through slow smoking the ribs to perfection, using a balanced sweet-savory rub that enhances the natural pork flavor without overpowering it.
            The method ensures juicy, fall-off-the-bone ribs with a beautiful bark and smoky aroma.
          </p>
          <p>
            Historically, baby back ribs have been a staple in American barbecue culture, especially in the southern United States.
            Their name derives from the fact that they come from the top of the rib cage between the spine and the spare ribs, near the loin.
            Over time, regional variations have emerged, but the classic smoked baby back ribs remain a favorite for backyard cookouts and Michelin-starred restaurants alike.
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
              Prepare the Ribs
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the membrane from the back of the ribs for better seasoning penetration and tenderness.
              Pat the ribs dry with paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Apply the Dry Rub
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Mix brown sugar, paprika, salt, black pepper, garlic powder, onion powder, chili powder, and cayenne pepper.
              Generously coat both sides of the ribs with the rub, pressing it into the meat.
              Let rest for at least 30 minutes or refrigerate overnight for deeper flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Preheat and Smoke
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your smoker to 225°F (107°C).
              Place the ribs bone side down on the smoker grate.
              Smoke for about 3 hours, maintaining steady temperature and adding wood chips as needed.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Wrap and Continue Cooking
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Wrap the ribs tightly in foil with apple cider vinegar and honey to steam and tenderize.
              Return to the smoker and cook for another 1 hour.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauce and Finish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Unwrap the ribs and brush with your favorite BBQ sauce.
              Place back on the smoker or grill for 15-20 minutes to caramelize the sauce.
              Let rest for 10 minutes before slicing and serving.
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
            Remove the silver skin membrane on the back of the ribs to allow better smoke penetration and tenderness.
          </li>
          <li>
            Use a water pan in your smoker to maintain humidity and prevent the ribs from drying out.
          </li>
          <li>
            Experiment with different wood chips like apple or cherry for a sweeter smoke flavor.
          </li>
          <li>
            Let the ribs rest after cooking to allow juices to redistribute for moist, tender meat.
          </li>
          <li>
            If you prefer a spicier kick, increase the cayenne pepper in the rub or add a hot sauce glaze.
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
              href="https://en.wikipedia.org/wiki/Barbecue_in_the_United_States"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Barbecue in the United States
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/how-to-smoke-baby-back-ribs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Smoke Baby Back Ribs
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