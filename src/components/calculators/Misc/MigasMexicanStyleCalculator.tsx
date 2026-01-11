import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MigasMexicanStyleCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Migas%20MexicanStyle%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2294"
  );

  // --- DATA ---
  const title = "Migas (Mexican-Style)";
  const description = "Ovos mexidos com pedaços de tortilla e temperos.";

  // INGREDIENTS
  const ingredients = [
    { name: "Corn Tortillas (cut into strips)", baseAmount: 200, unit: "g" },
    { name: "Eggs", baseAmount: 4, unit: "large" },
    { name: "White Onion (finely chopped)", baseAmount: 100, unit: "g" },
    { name: "Tomato (diced)", baseAmount: 150, unit: "g" },
    { name: "Jalapeño (seeded and chopped)", baseAmount: 1, unit: "medium" },
    { name: "Garlic Cloves (minced)", baseAmount: 2, unit: "cloves" },
    { name: "Fresh Cilantro (chopped)", baseAmount: 15, unit: "g" },
    { name: "Queso Fresco (crumbled)", baseAmount: 100, unit: "g" },
    { name: "Vegetable Oil", baseAmount: 30, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Lime Wedges (for serving)", baseAmount: 2, unit: "wedges" },
    { name: "Sour Cream (optional, for serving)", baseAmount: 60, unit: "g" },
  ];

  const nutrition = {
    calories: "350",
    protein: "18g",
    carbs: "25g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What are Migas and how do they differ from other egg dishes?",
      answer:
        "Migas is a traditional Mexican breakfast dish made by scrambling eggs with fried strips of corn tortillas, combined with fresh vegetables and cheese. Unlike plain scrambled eggs, Migas incorporates the crispy texture and flavor of tortillas, making it heartier and more flavorful.",
    },
    {
      question: "Can I use flour tortillas instead of corn tortillas?",
      answer:
        "While flour tortillas can be used in a pinch, traditional Migas are made with corn tortillas for their distinctive texture and flavor. Corn tortillas crisp up better when fried and provide an authentic taste that flour tortillas lack.",
    },
    {
      question: "How do I make Migas spicier?",
      answer:
        "To add more heat, you can increase the amount of jalapeño or substitute it with hotter peppers like serrano or habanero. Additionally, serving with spicy salsa or hot sauce on the side can enhance the spiciness without overpowering the dish.",
    },
    {
      question: "Is Migas suitable for vegetarians?",
      answer:
        "Yes, Migas is naturally vegetarian as it contains eggs, vegetables, and cheese. However, it is not vegan due to the eggs and cheese. You can adapt it to vegan diets by using tofu scramble and vegan cheese alternatives.",
    },
    {
      question: "How should I store leftover Migas?",
      answer:
        "Store leftover Migas in an airtight container in the refrigerator for up to 2 days. Reheat gently in a skillet over low heat to maintain texture and avoid overcooking the eggs. Avoid microwaving as it can make the eggs rubbery.",
    },
    {
      question: "What are some common side dishes to serve with Migas?",
      answer:
        "Migas pairs well with refried beans, fresh avocado slices, warm tortillas, and a side of salsa or pico de gallo. A cup of Mexican coffee or fresh juice complements the meal perfectly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Migas (Mexican-Style)"
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
            Migas (Mexican-Style) is a beloved traditional breakfast dish that
            combines scrambled eggs with crispy fried strips of corn tortillas,
            fresh vegetables, and crumbly cheese. This hearty and flavorful dish
            is a staple in many Mexican households, celebrated for its comforting
            textures and vibrant flavors. Perfect for a satisfying morning meal,
            Migas offers a delightful balance of soft eggs and crunchy tortilla
            pieces, enhanced by the freshness of tomatoes, onions, and cilantro.
          </p>
          <p>
            The origins of Migas trace back to Spanish and Mexican culinary
            traditions where leftover tortillas were repurposed into new dishes.
            Over time, this practical approach evolved into a popular breakfast
            recipe across Mexico and the southwestern United States. The dish
            showcases the resourcefulness and rich flavors of Mexican cuisine,
            often customized with regional ingredients and spice levels to suit
            individual tastes.
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
              Prepare the Tortillas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut the corn tortillas into thin strips or bite-sized pieces. Heat
              the vegetable oil in a large skillet over medium heat and fry the
              tortilla strips until golden and crispy, about 3-5 minutes. Remove
              and drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In the same skillet, reduce heat to medium-low and sauté the chopped
              onion, jalapeño, and garlic until softened and fragrant, about 4-5
              minutes. Add the diced tomatoes and cook for another 2-3 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Eggs and Tortillas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Beat the eggs lightly with salt and pepper. Pour them into the skillet
              with the vegetables and stir gently. When eggs begin to set, fold in
              the crispy tortilla strips, mixing carefully to combine without
              breaking the tortillas.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Finish and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove from heat when eggs are softly cooked but still moist. Sprinkle
              crumbled queso fresco and chopped cilantro on top. Serve immediately
              with lime wedges and optional sour cream on the side.
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
            Use day-old corn tortillas for frying; they hold their shape better and
            crisp up nicely.
          </li>
          <li>
            Fry the tortillas in batches to avoid overcrowding the pan, ensuring
            even crispiness.
          </li>
          <li>
            For a smoky flavor, add a pinch of smoked paprika or chipotle powder to
            the eggs.
          </li>
          <li>
            Customize your Migas by adding sautéed bell peppers, mushrooms, or
            chorizo for extra depth.
          </li>
          <li>
            Serve with warm corn or flour tortillas to scoop up the Migas for a
            traditional experience.
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
              href="https://en.wikipedia.org/wiki/Migas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Migas (Mexican cuisine)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/migas-mexican-style-scrambled-eggs-2342737"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Mexican Migas Recipe
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