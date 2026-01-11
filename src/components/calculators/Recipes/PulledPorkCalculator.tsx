import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PulledPorkCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Pulled%20Pork%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8027"
  );

  // --- DATA ---
  const title = "Pulled Pork";
  const description =
    "Slow-smoke pork shoulder for pull-apart strands, balanced rub, and tangy finishing sauce ideas.";

  // INGREDIENTS
  const ingredients = [
    { name: "Pork Shoulder (bone-in)", baseAmount: 1000, unit: "g" },
    { name: "Brown Sugar", baseAmount: 50, unit: "g" },
    { name: "Paprika", baseAmount: 15, unit: "g" },
    { name: "Salt", baseAmount: 10, unit: "g" },
    { name: "Black Pepper", baseAmount: 5, unit: "g" },
    { name: "Garlic Powder", baseAmount: 5, unit: "g" },
    { name: "Onion Powder", baseAmount: 5, unit: "g" },
    { name: "Cayenne Pepper", baseAmount: 2, unit: "g" },
    { name: "Apple Cider Vinegar", baseAmount: 120, unit: "ml" },
    { name: "Worcestershire Sauce", baseAmount: 30, unit: "ml" },
    { name: "Yellow Mustard", baseAmount: 30, unit: "ml" },
    { name: "BBQ Sauce (optional)", baseAmount: 100, unit: "ml" },
    { name: "Water or Apple Juice", baseAmount: 240, unit: "ml" },
    { name: "Wood Chips (for smoking)", baseAmount: 50, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "450",
    protein: "35g",
    carbs: "15g",
    fat: "25g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of pork is best for pulled pork?",
      answer:
        "The best cut for pulled pork is the pork shoulder, also known as pork butt or Boston butt. It has a good amount of fat and connective tissue that breaks down during slow cooking, resulting in tender, juicy meat that's easy to shred.",
    },
    {
      question: "How long should I smoke the pork shoulder?",
      answer:
        "Smoking time varies depending on the size of the pork shoulder and the smoker temperature. Typically, it takes about 1.5 to 2 hours per pound at 225°F (107°C). The internal temperature should reach around 195°F to 205°F (90°C to 96°C) for perfect pull-apart texture.",
    },
    {
      question: "Can I make pulled pork without a smoker?",
      answer:
        "Yes, you can make pulled pork in an oven or slow cooker. For the oven, cook low and slow at around 250°F (120°C) for several hours until tender. In a slow cooker, cook on low for 8-10 hours. While you won't get the smoky flavor, you can add smoked paprika or liquid smoke to mimic it.",
    },
    {
      question: "How do I store leftover pulled pork?",
      answer:
        "Store leftover pulled pork in an airtight container in the refrigerator for up to 4 days. For longer storage, freeze it in freezer-safe bags or containers for up to 3 months. Reheat gently to avoid drying out the meat.",
    },
    {
      question: "What sauces pair well with pulled pork?",
      answer:
        "Pulled pork pairs well with a variety of sauces including tangy vinegar-based sauces, sweet and smoky BBQ sauces, mustard-based sauces, or spicy chipotle sauces. You can also serve it with coleslaw for added texture and flavor contrast.",
    },
    {
      question: "Should I wrap the pork during smoking?",
      answer:
        "Wrapping the pork shoulder in foil or butcher paper (the 'Texas Crutch') during the latter half of smoking helps retain moisture and speeds up cooking. It also helps push through the 'stall' where the internal temperature plateaus.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Pulled Pork"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 8-10h
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
            Pulled pork is a classic Southern American dish that involves slow-cooking a pork shoulder until it becomes tender enough to be easily shredded by hand or fork. The process of slow smoking infuses the meat with deep, smoky flavors while breaking down the connective tissues, resulting in a juicy, flavorful dish perfect for sandwiches, tacos, or served with sides like coleslaw and baked beans.
          </p>
          <p>
            The origins of pulled pork trace back to the American South, where barbecue traditions have been passed down through generations. This dish reflects a rich culinary heritage influenced by Native American, African, and European cooking techniques. Today, pulled pork is enjoyed worldwide and celebrated for its versatility and comforting taste.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Pork Shoulder</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Trim excess fat from the pork shoulder if necessary, leaving a thin layer for moisture and flavor. Pat the meat dry with paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Apply the Dry Rub</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Mix brown sugar, paprika, salt, black pepper, garlic powder, onion powder, and cayenne pepper. Generously coat the pork shoulder on all sides with the rub. Let it rest for at least 1 hour or overnight in the refrigerator for deeper flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Smoker</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your smoker to 225°F (107°C). Add wood chips such as hickory or applewood for a balanced smoky flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Smoke the Pork</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the pork shoulder fat side up on the smoker grate. Smoke for about 1.5 to 2 hours per pound, maintaining a steady temperature. Spritz with apple juice or water every hour to keep the meat moist.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Wrap and Finish Cooking</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              When the internal temperature reaches about 160°F (71°C), wrap the pork tightly in foil or butcher paper to push through the stall. Continue cooking until the internal temperature hits 195°F to 205°F (90°C to 96°C).
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Rest and Shred</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Let the pork rest wrapped for at least 30 minutes to redistribute juices. Then shred the meat using forks or meat claws. Mix with your favorite BBQ sauce or serve as is.
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
            Use a meat thermometer to monitor internal temperature for perfectly tender pulled pork.
          </li>
          <li>
            Letting the pork rest after cooking is crucial to keep it juicy and flavorful.
          </li>
          <li>
            Experiment with different wood chips like cherry or pecan for unique smoky flavors.
          </li>
          <li>
            If you prefer a tangier finish, add a splash of apple cider vinegar or a vinegar-based sauce when serving.
          </li>
          <li>
            For a crispy crust, unwrap the pork in the last 30 minutes of cooking to firm up the bark.
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
              href="https://en.wikipedia.org/wiki/Pulled_pork"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Pulled Pork
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/how-to-make-pulled-pork-bbq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Make Pulled Pork
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