import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TexasStyleBrisketCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/TexasStyle%20Brisket%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8866"
  );

  // --- DATA ---
  const title = "Texas-Style Brisket";
  const description =
    "Smoke tender Texas-style brisket with a peppery bark, juicy slices, and simple timing cues.";

  // INGREDIENTS
  const ingredients = [
    { name: "Beef Brisket (whole packer)", baseAmount: 2000, unit: "g" },
    { name: "Kosher Salt", baseAmount: 30, unit: "g" },
    { name: "Coarse Black Pepper", baseAmount: 30, unit: "g" },
    { name: "Garlic Powder", baseAmount: 10, unit: "g" },
    { name: "Onion Powder", baseAmount: 10, unit: "g" },
    { name: "Paprika", baseAmount: 10, unit: "g" },
    { name: "Beef Broth (for spritzing)", baseAmount: 120, unit: "ml" },
    { name: "Wood Chips (post oak or hickory)", baseAmount: 100, unit: "g" },
    { name: "Yellow Mustard (as binder)", baseAmount: 30, unit: "g" },
    { name: "Brown Sugar (optional, for slight sweetness)", baseAmount: 15, unit: "g" },
    { name: "Black Peppercorns (whole, for grinding fresh)", baseAmount: 5, unit: "g" },
    { name: "Chili Powder (optional, for extra heat)", baseAmount: 5, unit: "g" },
    { name: "Apple Cider Vinegar (for spritzing mix)", baseAmount: 60, unit: "ml" },
    { name: "Water (for spritzing mix)", baseAmount: 60, unit: "ml" },
  ];

  // Nutrition estimates per serving (4 servings base)
  const nutrition = {
    calories: "850",
    protein: "75g",
    carbs: "5g",
    fat: "55g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of brisket is best for Texas-style smoking?",
      answer:
        "The whole packer brisket, which includes both the flat and the point, is preferred for Texas-style smoking. It offers a balance of lean and fatty meat, which results in tender, juicy slices with a flavorful bark. Avoid pre-trimmed briskets to maintain authentic texture and flavor.",
    },
    {
      question: "How long should I smoke the brisket for optimal tenderness?",
      answer:
        "Smoking time varies depending on the size of the brisket and smoker temperature, but generally, it takes about 1 to 1.5 hours per pound at 225°F (107°C). For a 5-pound brisket, expect around 5 to 7.5 hours. Use a meat thermometer to check for an internal temperature of 195°F to 205°F (90°C to 96°C) for perfect tenderness.",
    },
    {
      question: "What type of wood is ideal for authentic Texas brisket smoke flavor?",
      answer:
        "Post oak is the traditional wood used in Texas for smoking brisket, prized for its mild, slightly sweet smoke that complements beef without overpowering it. Hickory is also popular for a stronger smoky flavor. Avoid fruit woods like apple or cherry for authentic Texas-style brisket.",
    },
    {
      question: "Should I wrap the brisket during smoking?",
      answer:
        "Wrapping the brisket in butcher paper or foil (the Texas Crutch) is optional. Wrapping helps retain moisture and speeds up cooking during the stall phase but can soften the bark. Many pitmasters prefer unwrapped brisket for a firmer bark and more intense smoke flavor, but wrapping after several hours is a common technique.",
    },
    {
      question: "How do I make the perfect Texas-style dry rub?",
      answer:
        "A classic Texas dry rub is simple and pepper-forward, typically consisting of coarse black pepper and kosher salt in roughly equal parts. Additional spices like garlic powder, onion powder, paprika, and a touch of brown sugar can be added for complexity, but the focus remains on salt and pepper to highlight the beef's natural flavor.",
    },
    {
      question: "Can I prepare the brisket the night before smoking?",
      answer:
        "Yes, applying the dry rub and letting the brisket rest uncovered in the refrigerator overnight helps the flavors penetrate the meat and dries the surface for better bark formation. Bring the brisket to room temperature before placing it in the smoker for even cooking.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Texas-Style Brisket"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 8-12h
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
            Texas-style brisket is a revered barbecue classic known for its
            tender, juicy meat and robust peppery bark. This recipe guides you
            through the traditional smoking process that transforms a humble cut
            of beef into a mouthwatering centerpiece. The focus is on simple,
            quality ingredients and patient, low-and-slow cooking to develop
            deep smoky flavors and a perfect texture.
          </p>
          <p>
            Originating from Central Texas, this style of brisket has roots in
            the region's German and Czech immigrant communities who brought
            meat-smoking traditions with them. Over time, Texas pitmasters
            refined the technique, emphasizing post oak wood smoke and a
            straightforward salt-and-pepper rub to highlight the natural beef
            flavors. Today, Texas brisket is celebrated worldwide as a symbol of
            authentic barbecue mastery.
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
              Prepare the Brisket
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Trim excess fat from the brisket, leaving about ¼ inch for moisture
              retention. Apply a thin layer of yellow mustard as a binder, then
              generously coat the entire brisket with the dry rub mixture of kosher
              salt, coarse black pepper, garlic powder, onion powder, and paprika.
              Wrap tightly in plastic wrap and refrigerate overnight for best flavor
              penetration.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Smoker
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your smoker to a steady 225°F (107°C). Add post oak or hickory
              wood chips for authentic Texas smoke flavor. Maintain consistent
              temperature throughout the cook. Place a water pan inside the smoker
              to help regulate humidity and keep the brisket moist.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Smoke the Brisket
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the brisket fat side up on the smoker grate. Smoke for about 1 to
              1.5 hours per pound, spritzing every hour with a mixture of beef broth,
              apple cider vinegar, and water to keep the surface moist and enhance
              bark formation. Monitor internal temperature with a meat thermometer.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Wrap and Finish Cooking
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              When the brisket reaches an internal temperature of about 160°F (71°C),
              wrap it tightly in butcher paper or foil to help push through the stall
              and retain moisture. Continue smoking until the internal temperature
              reaches 195°F to 205°F (90°C to 96°C) and the meat is tender.
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
              Remove the brisket from the smoker and let it rest wrapped for at least
              1 hour to allow juices to redistribute. Slice thinly against the grain
              for maximum tenderness. Serve with your favorite barbecue sauce or
              enjoy it au naturel to savor the authentic Texas flavor.
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
            Use a digital probe thermometer to monitor the brisket’s internal
            temperature accurately without opening the smoker frequently.
          </li>
          <li>
            Let the brisket rest for at least an hour after smoking; this step is
            crucial for juicy, tender slices.
          </li>
          <li>
            Avoid over-salting the rub; Texas brisket relies on simplicity and
            balance, so salt and pepper should be the stars.
          </li>
          <li>
            If you want a stronger smoke flavor, add wood chips gradually rather
            than all at once to avoid bitterness.
          </li>
          <li>
            Slice brisket against the grain to maximize tenderness and mouthfeel.
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
              href="https://en.wikipedia.org/wiki/Barbecue_in_Texas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Barbecue in Texas
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.texasmonthly.com/food/the-texas-brisket-guide/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Texas Monthly: The Texas Brisket Guide
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