import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function GrilledPicanhaSteakCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Grilled%20Picanha%20Steak%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=790"
  );

  // --- DATA ---
  const title = "Grilled Picanha Steak";
  const description = "The most prized Brazilian cut: Top Sirloin Cap with fat cap.";

  // INGREDIENTS
  const ingredients = [
    { name: "Picanha (Top Sirloin Cap) steak", baseAmount: 500, unit: "g" },
    { name: "Coarse sea salt", baseAmount: 15, unit: "g" },
    { name: "Freshly ground black pepper", baseAmount: 2, unit: "g" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "pcs" },
    { name: "Olive oil", baseAmount: 15, unit: "ml" },
    { name: "Fresh rosemary sprigs", baseAmount: 2, unit: "pcs" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "pcs" },
    { name: "Chopped fresh parsley (optional garnish)", baseAmount: 10, unit: "g" },
    { name: "Butter (optional, for finishing)", baseAmount: 20, unit: "g" },
    { name: "Smoked paprika (optional)", baseAmount: 1, unit: "tsp" },
    { name: "Coarse ground pink peppercorns (optional)", baseAmount: 1, unit: "tsp" },
    { name: "Chimichurri sauce (optional, for serving)", baseAmount: 50, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "450",
    protein: "48g",
    carbs: "0g",
    fat: "28g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Picanha and why is it special?",
      answer:
        "Picanha is a prized cut of beef popular in Brazil, known as the top sirloin cap. It features a thick fat cap that imparts rich flavor and juiciness when grilled properly. Its unique texture and taste make it a favorite for churrasco-style barbecues.",
    },
    {
      question: "How do I properly grill Picanha steak?",
      answer:
        "To grill Picanha, start by scoring the fat cap and seasoning generously with coarse salt. Grill fat-side down first over medium-high heat to render the fat, then flip to cook the meat side to desired doneness. Rest before slicing against the grain for maximum tenderness.",
    },
    {
      question: "Can I marinate Picanha steak?",
      answer:
        "Traditional Brazilian preparation relies mostly on salt to highlight the beef’s natural flavor. However, you can marinate with garlic, olive oil, and herbs like rosemary for added aroma. Avoid heavy marinades that mask the meat’s taste.",
    },
    {
      question: "What side dishes pair well with Grilled Picanha?",
      answer:
        "Classic accompaniments include farofa (toasted cassava flour), vinaigrette salsa, rice, black beans, and fresh salads. Chimichurri sauce also complements the rich flavors beautifully.",
    },
    {
      question: "How do I know when the steak is cooked perfectly?",
      answer:
        "Use a meat thermometer to check internal temperature: 130°F (54°C) for medium-rare, 140°F (60°C) for medium. The fat should be nicely rendered and crispy, while the meat remains juicy and tender.",
    },
    {
      question: "Can I cook Picanha steak indoors?",
      answer:
        "Yes, you can use a cast-iron skillet or grill pan on the stovetop. Sear the fat cap first to render the fat, then cook the meat side. Finish in the oven if needed to reach desired doneness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT10M",
    totalTime: "PT30M",
    recipeYield: `${servings} servings`,
    recipeCategory: "Main Course",
    recipeCuisine: "Brazilian",
    keywords: "picanha, grilled steak, brazilian bbq, churrasco, top sirloin cap",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Score the picanha fat cap in a crosshatch pattern and pat dry.",
      "Rub with olive oil, coarse sea salt, pepper, garlic, and optional paprika.",
      "Preheat grill to medium-high (400°F / 200°C).",
      "Grill fat-side down for 5-7 minutes to render fat, then flip.",
      "Grill meat-side for 4-6 minutes, rest for 5-10 minutes, and slice against the grain."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Grilled Picanha Steak"
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
            Grilled Picanha Steak is a celebration of Brazilian barbecue culture,
            showcasing the top sirloin cap's rich flavor and tender texture. This
            cut, prized for its thick fat cap, delivers a juicy and flavorful
            experience when cooked over high heat. The simplicity of seasoning
            with coarse salt allows the natural beef taste to shine, making it a
            favorite among grill masters worldwide.
          </p>
          <p>
            Originating from Brazil, Picanha has become synonymous with churrasco,
            the traditional Brazilian style of grilling meat over open flames.
            Historically, it was a humble cut often overlooked in other countries,
            but Brazilian chefs elevated it to a star ingredient by perfecting the
            grilling technique that renders its fat and enhances its succulence.
            Today, it is enjoyed globally, celebrated for its unique combination
            of flavor, texture, and cultural heritage.
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
              Trim the Picanha steak if needed, leaving the fat cap intact. Score
              the fat in a crosshatch pattern about 0.5 cm deep to help render the
              fat evenly. Pat dry with paper towels.
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
              Rub the steak with olive oil, then season liberally with coarse sea
              salt and freshly ground black pepper. Add minced garlic and sprinkle
              smoked paprika if using. Let it rest at room temperature for 15-20
              minutes.
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
              Heat your grill to medium-high (around 400°F / 200°C). Ensure the
              grates are clean and lightly oiled to prevent sticking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Grill Fat Side First
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the steak fat-side down on the grill. Cook for about 5-7
              minutes until the fat renders and crisps up nicely. Watch carefully
              to avoid flare-ups.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Flip and Cook Meat Side
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Flip the steak and grill the meat side for 4-6 minutes for medium-rare,
              adjusting time for preferred doneness. Use a meat thermometer to check
              internal temperature.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Rest and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the steak from the grill and let it rest for 5-10 minutes to
              redistribute juices. Optionally, top with a pat of butter and sprinkle
              chopped parsley. Slice against the grain and serve with lime wedges
              and chimichurri sauce if desired.
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
            Always score the fat cap to help it render evenly and avoid curling
            during grilling.
          </li>
          <li>
            Use coarse sea salt instead of fine salt to create a delicious crust
            and enhance flavor without drawing out too much moisture.
          </li>
          <li>
            Let the steak rest after grilling to ensure juicy, tender slices.
          </li>
          <li>
            For extra flavor, brush the steak with melted butter mixed with garlic
            and herbs just before serving.
          </li>
          <li>
            Serve with fresh lime wedges to add a bright, acidic contrast to the
            rich meat.
          </li>
          <li>
            If grilling indoors, a cast-iron skillet works great to mimic the
            searing effect of a grill.
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
              Wikipedia: Picanha
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.braziliansteakhouse.com/blogs/news/what-is-picanha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Brazilian Steakhouse: What is Picanha?
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/how-to-grill-picanha-brazilian-top-sirloin-cap"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Grill Picanha
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
      jsonLd={[faqJsonLd, recipeJsonLd]}
      hideLegalDisclaimer={true}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}