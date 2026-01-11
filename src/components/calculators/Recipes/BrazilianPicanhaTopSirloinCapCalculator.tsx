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
    "https://image.pollinations.ai/prompt/Brazilian%20Picanha%20Top%20Sirloin%20Cap%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8295"
  );

  // --- DATA ---
  const title = "Brazilian Picanha (Top Sirloin Cap)";
  const description =
    "Grill Brazilian picanha (top sirloin cap) with a crisp fat cap, coarse salt, and perfect slicing.";

  // INGREDIENTS
  const ingredients = [
    { name: "Picanha (Top Sirloin Cap) Beef", baseAmount: 800, unit: "g" },
    { name: "Coarse Sea Salt (Kosher or Maldon)", baseAmount: 15, unit: "g" },
    { name: "Black Pepper (freshly ground)", baseAmount: 2, unit: "g" },
    { name: "Garlic Cloves (optional)", baseAmount: 2, unit: "cloves" },
    { name: "Olive Oil", baseAmount: 15, unit: "ml" },
    { name: "Fresh Rosemary (optional)", baseAmount: 5, unit: "g" },
    { name: "Lime Wedges (for serving)", baseAmount: 2, unit: "wedges" },
    { name: "Chimichurri Sauce (optional)", baseAmount: 50, unit: "g" },
    { name: "Salt for seasoning", baseAmount: 5, unit: "g" },
    { name: "Black Pepper for seasoning", baseAmount: 1, unit: "g" },
    { name: "Wood or Charcoal for Grill", baseAmount: 1, unit: "unit" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "550",
    protein: "55g",
    carbs: "0g",
    fat: "35g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of beef is picanha and why is it special?",
      answer:
        "Picanha is a prized Brazilian cut from the top sirloin cap, known for its thick fat cap that renders during grilling, keeping the meat juicy and flavorful. Its unique shape and fat layer make it ideal for high-heat grilling, resulting in a tender, succulent steak with a crispy crust.",
    },
    {
      question: "How do I properly season picanha for authentic flavor?",
      answer:
        "Traditionally, picanha is simply seasoned with coarse sea salt just before grilling to enhance its natural flavors. Some variations include freshly ground black pepper or garlic, but the key is to keep seasoning minimal to let the beef shine.",
    },
    {
      question: "What is the best way to grill picanha?",
      answer:
        "Grill picanha over high heat using charcoal or wood for authentic smoky flavor. Start fat side down to render the fat and crisp it up, then sear the meat on all sides. Cook to medium-rare or medium for optimal tenderness, resting the meat before slicing.",
    },
    {
      question: "How should I slice picanha after cooking?",
      answer:
        "Slice picanha against the grain into thin, bite-sized pieces. This ensures maximum tenderness and a pleasant texture. The fat cap should be left intact on each slice to enjoy its rich flavor.",
    },
    {
      question: "Can I cook picanha indoors if I don’t have a grill?",
      answer:
        "Yes, you can pan-sear picanha on a heavy skillet or use an oven broiler. Start by crisping the fat cap in the pan, then sear all sides. Finish cooking in the oven to desired doneness. While it won’t have the smoky flavor of a grill, it will still be delicious.",
    },
    {
      question: "What sides and sauces pair well with Brazilian picanha?",
      answer:
        "Traditional accompaniments include farofa (toasted cassava flour), rice, black beans, and vinaigrette salsa. Chimichurri sauce also pairs beautifully, adding a fresh, herbaceous contrast to the rich meat.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Picanha (Top Sirloin Cap)"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Brazilian Picanha, also known as the top sirloin cap, is a beloved cut
            of beef in Brazil, famous for its rich flavor and tender texture. This
            recipe highlights the traditional grilling method that crisps the fat
            cap to perfection while keeping the meat juicy and succulent. Perfect
            for gatherings and celebrations, picanha is a centerpiece that brings
            authentic Brazilian churrasco to your table.
          </p>
          <p>
            Originating from Brazil’s southern regions, picanha has been a staple
            in Brazilian barbecue culture for centuries. The cut is prized for its
            distinctive fat layer which bastes the meat as it cooks, creating a
            unique combination of textures and flavors. Traditionally cooked over
            open flames or charcoal, this recipe embraces the simplicity and
            authenticity that makes picanha a global favorite.
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
              Prepare the Picanha
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Trim any excess silver skin from the picanha, but keep the thick fat
              cap intact. Score the fat lightly in a crosshatch pattern to help it
              render evenly during grilling. Pat the meat dry with paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season Generously
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Just before grilling, season the picanha liberally with coarse sea
              salt on all sides, including the fat cap. Optionally, add freshly
              ground black pepper and rub with crushed garlic and rosemary for
              extra aroma.
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
              Light your charcoal or wood grill and let it reach high heat (around
              450-500°F / 230-260°C). Ensure the grill grates are clean and oiled to
              prevent sticking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Grill the Picanha Fat Side Down
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the picanha fat side down on the grill to render and crisp the
              fat, about 5-7 minutes. Flip and sear the meat side for 3-4 minutes,
              then rotate to get grill marks on all sides.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook to Desired Doneness
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Move the picanha to indirect heat and cook until the internal
              temperature reaches 130°F (54°C) for medium-rare, about 10-15 minutes.
              Use a meat thermometer for accuracy.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Rest and Slice
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the picanha from the grill and let it rest for 10 minutes to
              redistribute juices. Slice thinly against the grain, keeping the fat
              cap on each piece for maximum flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              7
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Enjoy
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve your Brazilian picanha with lime wedges, chimichurri sauce, and
              traditional sides like farofa and black beans for an authentic
              churrasco experience.
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
            Always grill picanha fat side down first to render the fat and create a
            crispy crust that bastes the meat.
          </li>
          <li>
            Use coarse sea salt instead of fine salt to avoid drawing out too much
            moisture before grilling.
          </li>
          <li>
            Let the meat rest after grilling to ensure juices redistribute and the
            steak remains tender.
          </li>
          <li>
            Slice against the grain in thin strips to maximize tenderness and
            mouthfeel.
          </li>
          <li>
            For an extra smoky flavor, add wood chips like oak or hickory to your
            charcoal grill.
          </li>
          <li>
            If you don’t have a grill, a cast-iron skillet and oven broiler can
            mimic the high heat needed to cook picanha well.
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
              href="https://en.wikipedia.org/wiki/Picanha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Picanha (Top Sirloin Cap)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/brazilian-picanha-steak-grilling-technique"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Grill Brazilian Picanha
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Beef"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Beef Cuts and Preparation
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