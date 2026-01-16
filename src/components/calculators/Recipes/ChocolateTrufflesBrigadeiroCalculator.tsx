import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChocolateTrufflesBrigadeiroCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chocolate%20Truffles%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=490"
  );

  // --- DATA ---
  const title = "Chocolate Truffles";
  const description = "Iconic fudge balls made of cocoa and condensed milk.";

  // INGREDIENTS
  const ingredients = [
    { name: "Sweetened Condensed Milk", baseAmount: 395, unit: "g" },
    { name: "Unsweetened Cocoa Powder", baseAmount: 60, unit: "g" },
    { name: "Unsalted Butter", baseAmount: 30, unit: "g" },
    { name: "Dark Chocolate (70% cocoa), chopped", baseAmount: 100, unit: "g" },
    { name: "Vanilla Extract", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 0.25, unit: "tsp" },
    { name: "Granulated Sugar (for rolling)", baseAmount: 50, unit: "g" },
    { name: "Unsweetened Cocoa Powder (for rolling)", baseAmount: 40, unit: "g" },
    { name: "Chopped Nuts (optional, for rolling)", baseAmount: 40, unit: "g" },
    { name: "Powdered Sugar (optional, for rolling)", baseAmount: 40, unit: "g" },
    { name: "Heavy Cream (optional, for richer texture)", baseAmount: 60, unit: "ml" },
    { name: "Instant Coffee Powder (optional, enhances chocolate flavor)", baseAmount: 1, unit: "tsp" },
    { name: "Cinnamon (optional, for subtle warmth)", baseAmount: 0.5, unit: "tsp" },
    { name: "Rum or Brandy (optional, for flavor)", baseAmount: 1, unit: "tbsp" },
  ];

  // Nutrition estimates per serving (4 servings base)
  const nutrition = {
    calories: "320",
    protein: "5g",
    carbs: "45g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the difference between brigadeiro and classic chocolate truffles?",
      answer:
        "Brigadeiro is a traditional Brazilian sweet made primarily from condensed milk, cocoa powder, and butter, cooked until thick and rolled into balls, often coated with chocolate sprinkles. Classic chocolate truffles typically use heavy cream and chocolate ganache as a base and are coated with cocoa powder or nuts. Brigadeiros have a fudgier, denser texture and a sweeter profile compared to the creamier, richer classic truffles.",
    },
    {
      question: "How do I prevent my chocolate truffle mixture from sticking to my hands?",
      answer:
        "To avoid sticking, lightly butter your hands or dust them with cocoa powder or granulated sugar before rolling the truffles. You can also chill the mixture thoroughly before shaping, which makes it less sticky and easier to handle.",
    },
    {
      question: "Can I make these truffles vegan or dairy-free?",
      answer:
        "Yes! To make vegan brigadeiro truffles, substitute sweetened condensed milk with a vegan condensed milk alternative (such as coconut condensed milk), use dairy-free butter or coconut oil, and ensure your chocolate is dairy-free. The texture and flavor will be slightly different but still delicious.",
    },
    {
      question: "How should I store chocolate truffles to maintain freshness?",
      answer:
        "Store truffles in an airtight container in the refrigerator for up to 1 week. For longer storage, freeze them in a sealed container for up to 3 months. Allow frozen truffles to thaw in the refrigerator before serving to preserve texture and flavor.",
    },
    {
      question: "Can I add flavors or coatings to customize my truffles?",
      answer:
        "Absolutely! You can mix in flavorings like coffee, cinnamon, rum, or vanilla into the base mixture. For coatings, try rolling truffles in chopped nuts, shredded coconut, powdered sugar, or colored sprinkles to add texture and visual appeal.",
    },
    {
      question: "Why is my brigadeiro mixture grainy or not smooth?",
      answer:
        "Graininess can result from overheating or using low-quality cocoa powder. Stir continuously over medium-low heat to avoid burning and ensure smoothness. Using high-quality cocoa powder and good-quality butter also helps achieve a silky texture.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Chocolate Truffles"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 15m | Cook: 15m
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
            Chocolate truffles, particularly the Brazilian brigadeiro style, are beloved
            confections known for their rich, fudgy texture and intense chocolate flavor.
            Made primarily from sweetened condensed milk, cocoa powder, and butter, these
            bite-sized treats are cooked to a luscious consistency, then rolled and coated
            to perfection. Their simplicity and indulgence make them a staple at celebrations
            and a favorite comfort dessert worldwide.
          </p>
          <p>
            The brigadeiro originated in Brazil in the 1940s and quickly became a cultural
            icon. Named after Brigadeiro Eduardo Gomes, a Brazilian Air Force brigadier,
            this sweet was initially popularized during his presidential campaign. Over
            time, brigadeiros evolved from a simple homemade treat to a gourmet dessert,
            inspiring countless variations and adaptations globally.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Gather all ingredients. Chop the dark chocolate finely and set aside. If using optional flavorings like coffee powder or rum, have them ready.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Mixture</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a medium non-stick saucepan, combine sweetened condensed milk, cocoa powder, butter, salt, and optional instant coffee powder. Cook over medium-low heat, stirring constantly with a wooden spoon or silicone spatula to prevent burning.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Chocolate & Flavorings</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              When the mixture thickens and starts to pull away from the pan (about 10-15 minutes), remove from heat. Stir in the chopped dark chocolate, vanilla extract, and optional rum or brandy until smooth and glossy.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cool the Mixture</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the mixture to a greased bowl and cover with plastic wrap, pressing it directly onto the surface to prevent a skin from forming. Refrigerate for at least 4 hours or until firm enough to handle.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Shape and Coat</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Butter your hands lightly or dust with cocoa powder. Scoop small portions (about 1 tablespoon) and roll into balls. Roll each truffle in your choice of coating: granulated sugar, cocoa powder, chopped nuts, or powdered sugar.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve and Enjoy</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Arrange the truffles on a serving plate or in mini paper cups. Serve immediately or refrigerate until ready to enjoy. They pair wonderfully with coffee or dessert wine.
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
            Use a non-stick pan and stir continuously to prevent the mixture from burning or sticking.
          </li>
          <li>
            For a creamier texture, add a splash of heavy cream while cooking.
          </li>
          <li>
            Chill the mixture thoroughly before rolling to make shaping easier and less sticky.
          </li>
          <li>
            Experiment with coatings like toasted coconut, crushed freeze-dried raspberries, or matcha powder for unique flavors.
          </li>
          <li>
            Store truffles in a cool place but avoid freezing if you want to preserve the best texture.
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
              href="https://en.wikipedia.org/wiki/Brigadeiro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Brigadeiro (Brazilian Chocolate Truffle)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/brigadeiro-brazilian-chocolate-truffles-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Authentic Brigadeiro Recipe
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/chocolate-truffle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Chocolate Truffle Overview
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