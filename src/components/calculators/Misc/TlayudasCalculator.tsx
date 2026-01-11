import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TlayudasCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Tlayudas%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2274"
  );

  // --- DATA ---
  const title = "Tlayudas";
  const description = "“Pizza” oaxaqueña em tortilha grande, com feijão, queijo e coberturas.";

  // INGREDIENTS
  const ingredients = [
    { name: "Large Tlayuda Tortillas", baseAmount: 4, unit: "units" },
    { name: "Refried Black Beans (frijoles refritos)", baseAmount: 400, unit: "g" },
    { name: "Oaxaca Cheese (quesillo)", baseAmount: 300, unit: "g" },
    { name: "Chorizo (Mexican sausage)", baseAmount: 200, unit: "g" },
    { name: "Pork Lard (manteca de cerdo)", baseAmount: 50, unit: "g" },
    { name: "Avocado", baseAmount: 1, unit: "unit" },
    { name: "Salsa Roja (red salsa)", baseAmount: 150, unit: "ml" },
    { name: "Cabbage (shredded)", baseAmount: 100, unit: "g" },
    { name: "Tomato (sliced)", baseAmount: 2, unit: "units" },
    { name: "Onion (sliced)", baseAmount: 1, unit: "unit" },
    { name: "Fresh Cilantro (chopped)", baseAmount: 15, unit: "g" },
    { name: "Lime wedges", baseAmount: 2, unit: "units" },
    { name: "Salt", baseAmount: 5, unit: "g" },
    { name: "Black Pepper", baseAmount: 2, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "550",
    protein: "28g",
    carbs: "45g",
    fat: "25g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is a Tlayuda and where does it originate from?",
      answer:
        "A Tlayuda is a traditional Oaxacan dish often referred to as the 'Oaxacan pizza.' It consists of a large, thin, crispy tortilla topped with refried beans, cheese, meats, and fresh vegetables. Originating from Oaxaca, Mexico, it is a staple street food and a beloved regional specialty with roots dating back to pre-Hispanic times.",
    },
    {
      question: "Can I make Tlayudas vegetarian or vegan?",
      answer:
        "Absolutely! To make a vegetarian Tlayuda, omit the chorizo and pork lard, and load it with beans, cheese, avocado, and fresh vegetables. For a vegan version, substitute Oaxaca cheese with plant-based cheese alternatives and use vegetable oil instead of pork lard. The refried beans should be cooked without lard for a fully vegan dish.",
    },
    {
      question: "What is the best way to cook the Tlayuda tortilla?",
      answer:
        "Traditionally, the large tortilla is toasted on a comal (flat griddle) until it becomes crisp but still pliable. This process enhances the flavor and texture, providing a perfect base for toppings. If you don't have a comal, use a large non-stick skillet or oven broiler to achieve similar results.",
    },
    {
      question: "How do I store leftovers and reheat Tlayudas?",
      answer:
        "Leftover Tlayudas can be wrapped tightly in foil or plastic wrap and refrigerated for up to 2 days. To reheat, place them in a preheated oven at 180°C (350°F) for 5-7 minutes to restore crispness. Avoid microwaving as it can make the tortilla soggy.",
    },
    {
      question: "What are some common variations of Tlayudas?",
      answer:
        "Variations include using different meats such as tasajo (thinly sliced beef), cecina (salted pork), or chicken. Some versions add pickled jalapeños, radishes, or different salsas. The toppings can be customized to taste, making Tlayudas a versatile and creative dish.",
    },
    {
      question: "Where can I find authentic ingredients for Tlayudas?",
      answer:
        "Authentic ingredients like Oaxaca cheese and Mexican chorizo can often be found at Latin American grocery stores or specialty markets. Alternatively, you can order them online. Fresh tortillas may be available at Mexican bakeries or tortillerias.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Tlayudas"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Tlayudas are a quintessential Oaxacan street food that beautifully blend indigenous Mexican culinary traditions with Spanish influences. Often described as an "Oaxacan pizza," this dish features a large, thin, toasted tortilla as its base, generously layered with refried black beans, melted Oaxaca cheese, and a variety of savory toppings such as chorizo, avocado, and fresh vegetables. The combination of textures and flavors makes Tlayudas a beloved comfort food and a must-try for anyone exploring Mexican cuisine.
          </p>
          <p>
            The origins of Tlayudas trace back to pre-Hispanic times in Oaxaca, where corn tortillas were a dietary staple. Over centuries, the dish evolved with the introduction of new ingredients and cooking techniques, culminating in the modern Tlayuda. Traditionally cooked on a comal, the tortilla is toasted to a perfect crispness, providing a sturdy yet tender base for the toppings. This recipe honors the authentic preparation while offering flexibility for home cooks to customize their Tlayudas.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slice the tomato and onion thinly. Shred the cabbage finely. Chop the fresh cilantro and cut the lime into wedges. Crumble or shred the Oaxaca cheese if not pre-shredded.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Chorizo</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a skillet over medium heat, cook the chorizo until browned and cooked through, breaking it up into small pieces. Remove from heat and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Toast the Tortillas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat a comal or large non-stick skillet over medium-high heat. Toast each large tortilla for about 2-3 minutes per side until crisp but still flexible. Optionally, brush lightly with pork lard or vegetable oil for extra flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Assemble the Tlayudas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spread a generous layer of refried black beans over each toasted tortilla. Sprinkle the cooked chorizo evenly on top, followed by the Oaxaca cheese. Add sliced tomato, onion, shredded cabbage, and chopped cilantro.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Melt the Cheese and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the assembled Tlayudas back on the comal or under a broiler for 2-3 minutes until the cheese melts. Remove, garnish with avocado slices and a drizzle of salsa roja. Serve immediately with lime wedges on the side.
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
            Use fresh, high-quality Oaxaca cheese for authentic flavor and excellent melting properties.
          </li>
          <li>
            Toast the tortillas just until crisp but still pliable to avoid cracking when folding or cutting.
          </li>
          <li>
            Substitute pork lard with vegetable oil or butter for a lighter version without sacrificing flavor.
          </li>
          <li>
            Customize toppings with grilled tasajo, cecina, or chicken for regional variations.
          </li>
          <li>
            Serve with a side of pickled jalapeños or radishes for added crunch and acidity.
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
              href="https://en.wikipedia.org/wiki/Tlayuda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Tlayuda
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.mexicoinmykitchen.com/tlayuda-oaxacan-pizza/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Mexico In My Kitchen: Tlayuda Recipe & History
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