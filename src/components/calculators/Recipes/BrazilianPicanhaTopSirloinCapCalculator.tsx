import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BrazilianPicanhaTopSirloinCapCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Picanha%20Top%20Sirloin%20Cap%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5955"
  );

  // --- DATA ---
  const title = 'Brazilian Picanha "Top Sirloin Cap"';
  const description =
    "Grill Brazilian picanha (top sirloin cap) with a crisp fat cap, coarse salt, and perfect slicing.";

  // INGREDIENTS
  const ingredients = [
    { name: "Picanha (Top Sirloin Cap) Beef", baseAmount: 800, unit: "g" },
    { name: "Coarse Sea Salt (Kosher or Rock Salt)", baseAmount: 15, unit: "g" },
    { name: "Black Pepper (freshly ground)", baseAmount: 2, unit: "g" },
    { name: "Garlic Cloves (optional)", baseAmount: 2, unit: "cloves" },
    { name: "Olive Oil", baseAmount: 10, unit: "ml" },
    { name: "Fresh Rosemary (optional)", baseAmount: 5, unit: "g" },
    { name: "Lime Wedges (for serving)", baseAmount: 2, unit: "wedges" },
    { name: "Chimichurri Sauce (optional)", baseAmount: 50, unit: "g" },
    { name: "Fresh Parsley (for garnish)", baseAmount: 5, unit: "g" },
    { name: "Salt for Chimichurri (if used)", baseAmount: 3, unit: "g" },
    { name: "Red Pepper Flakes (optional for Chimichurri)", baseAmount: 1, unit: "g" },
    { name: "White Vinegar (for Chimichurri)", baseAmount: 15, unit: "ml" },
    { name: "Olive Oil (for Chimichurri)", baseAmount: 60, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "550",
    protein: "48g",
    carbs: "2g",
    fat: "38g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is picanha and why is it special in Brazilian cuisine?",
      answer:
        "Picanha is a prized cut of beef in Brazil, known as the top sirloin cap in the U.S. It is distinguished by its thick fat cap which adds flavor and juiciness when grilled. This cut is traditionally cooked over open flames or charcoal, making it a centerpiece of Brazilian churrasco (barbecue).",
    },
    {
      question: "How do I properly season picanha for authentic flavor?",
      answer:
        "The traditional seasoning for picanha is very simple: coarse sea salt applied generously just before grilling. This allows the natural beef flavor to shine. Some variations include adding freshly ground black pepper or rubbing with garlic and herbs, but salt is the essential seasoning.",
    },
    {
      question: "What is the best way to grill picanha to achieve the perfect crust and tenderness?",
      answer:
        "Grill picanha fat-side down first over medium-high heat to render the fat and create a crispy crust. Then flip and cook the meat side until medium-rare or desired doneness. Avoid overcooking to keep it tender and juicy. Rest the meat before slicing against the grain.",
    },
    {
      question: "Can I cook picanha indoors if I don’t have a grill?",
      answer:
        "Yes, you can cook picanha indoors using a cast iron skillet or broiler. Sear the fat cap side first on high heat to render fat and crisp it, then cook the meat side to your preferred doneness. However, grilling over charcoal or wood imparts the authentic smoky flavor.",
    },
    {
      question: "What side dishes traditionally accompany Brazilian picanha?",
      answer:
        "Picanha is often served with simple sides like farofa (toasted cassava flour), rice, black beans, vinaigrette salsa, and fresh lime wedges. Chimichurri sauce is also a popular accompaniment to add a fresh, herby contrast to the rich meat.",
    },
    {
      question: "How should I slice picanha for serving?",
      answer:
        "After resting, slice the picanha against the grain into thin, bite-sized pieces. This ensures tenderness and makes it easier to enjoy the juicy meat with its flavorful fat cap intact.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt='Brazilian Picanha "Top Sirloin Cap"'
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 15m
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
            Brazilian Picanha, also known as the top sirloin cap, is a beloved cut of beef renowned for its rich flavor and succulent texture. This recipe celebrates the traditional Brazilian method of grilling picanha with a thick fat cap that crisps beautifully over high heat, locking in juices and flavor. Simple seasoning with coarse salt enhances the natural beef taste, making it a favorite at churrascarias and backyard barbecues alike.
          </p>
          <p>
            Originating from Brazil’s southern regions, picanha has become a symbol of Brazilian barbecue culture. Traditionally cooked over open flames or charcoal, this cut is prized for its tenderness and the unique flavor imparted by the fat cap. The technique of slicing the meat against the grain after resting ensures every bite is tender and juicy. This recipe guides you through the authentic preparation and grilling process to bring a taste of Brazil to your table.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Picanha</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Trim any excess silver skin from the picanha, but keep the thick fat cap intact. Score the fat lightly in a crosshatch pattern to help render it during grilling. Pat the meat dry with paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Season Generously</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Just before grilling, sprinkle coarse sea salt evenly over the fat cap and meat sides. Optionally, add freshly ground black pepper. Let the meat rest at room temperature for 10-15 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Grill Fat Side Down</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your grill to medium-high heat. Place the picanha fat side down first and grill for about 6-8 minutes until the fat renders and crisps. Watch carefully to avoid flare-ups.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Flip and Finish Cooking</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Flip the picanha and grill the meat side for another 6-7 minutes for medium-rare, adjusting time for desired doneness. Use a meat thermometer for accuracy (130-135°F for medium-rare).
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Rest and Slice</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the picanha from the grill and let it rest for 10 minutes. Slice thinly against the grain to maximize tenderness. Serve with lime wedges and optional chimichurri sauce.
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
            Use a charcoal grill or wood chips to impart authentic smoky flavor reminiscent of Brazilian churrasco.
          </li>
          <li>
            Score the fat cap lightly to help render fat evenly without cutting into the meat.
          </li>
          <li>
            Let the meat come to room temperature before grilling to ensure even cooking.
          </li>
          <li>
            Resting the meat after grilling is crucial to retain juices and improve tenderness.
          </li>
          <li>
            Serve with fresh lime wedges to add a bright acidity that complements the rich beef.
          </li>
          <li>
            Chimichurri sauce pairs beautifully with picanha, adding a fresh herbaceous contrast.
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
              href="https://en.wikipedia.org/wiki/Picanha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Picanha
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.brazilianfood.com/picanha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              BrazilianFood.com: Picanha Guide
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