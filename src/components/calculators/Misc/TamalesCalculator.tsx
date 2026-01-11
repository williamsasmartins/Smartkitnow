import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TamalesCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Tamales%20Chicken%20Pork%20or%20Sweet%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8842"
  );

  // --- DATA ---
  const title = "Tamales (Chicken, Pork, or Sweet)";
  const description = "Massa de milho no vapor em palha, com recheios salgados ou doces.";

  // INGREDIENTS
  const ingredients = [
    { name: "Masa harina (corn dough flour)", baseAmount: 400, unit: "g" },
    { name: "Chicken breast (shredded)", baseAmount: 300, unit: "g" },
    { name: "Pork shoulder (shredded)", baseAmount: 300, unit: "g" },
    { name: "Sweet corn kernels", baseAmount: 150, unit: "g" },
    { name: "Lard or vegetable shortening", baseAmount: 150, unit: "g" },
    { name: "Chicken broth", baseAmount: 500, unit: "ml" },
    { name: "Baking powder", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 2, unit: "tsp" },
    { name: "Ancho chili powder", baseAmount: 2, unit: "tbsp" },
    { name: "Garlic cloves (minced)", baseAmount: 3, unit: "pcs" },
    { name: "Onion (finely chopped)", baseAmount: 1, unit: "medium" },
    { name: "Brown sugar (for sweet tamales)", baseAmount: 100, unit: "g" },
    { name: "Cinnamon (for sweet tamales)", baseAmount: 1, unit: "tsp" },
    { name: "Corn husks (soaked)", baseAmount: 20, unit: "pcs" },
  ];

  // Nutrition per serving (approximate average for savory tamales)
  const nutrition = {
    calories: "350",
    protein: "18g",
    carbs: "30g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What are tamales and where do they originate from?",
      answer:
        "Tamales are traditional Mesoamerican dishes made of masa (corn dough) steamed in a corn husk or banana leaf wrapper. They have been a staple food in Mexico and Central America for thousands of years, dating back to ancient Aztec and Mayan civilizations. Tamales can be filled with a variety of savory or sweet fillings and are often prepared for special occasions and celebrations.",
    },
    {
      question: "How do I choose between chicken, pork, or sweet tamales?",
      answer:
        "The choice depends on your taste preference and occasion. Chicken and pork tamales are savory and often seasoned with chili sauces or spices, making them hearty and flavorful. Sweet tamales use ingredients like brown sugar, cinnamon, and corn kernels for a dessert-like treat. You can also mix and match fillings or prepare all three varieties for variety.",
    },
    {
      question: "Can I prepare tamales ahead of time and freeze them?",
      answer:
        "Yes, tamales freeze very well. After cooking, allow them to cool completely, then wrap individually in plastic wrap or foil and place in an airtight container or freezer bag. They can be frozen for up to 3 months. To reheat, steam them directly from frozen or microwave wrapped in a damp paper towel until heated through.",
    },
    {
      question: "What is the best way to soak and prepare corn husks?",
      answer:
        "Corn husks should be soaked in warm water for at least 30 minutes to make them pliable and easier to fold. After soaking, rinse them thoroughly to remove any dirt or debris. Pat dry before spreading masa and filling on them. If you cannot find corn husks, banana leaves can be used as an alternative wrapper.",
    },
    {
      question: "How do I know when tamales are fully cooked?",
      answer:
        "Tamales are fully cooked when the masa dough is firm and separates easily from the husk. This usually takes about 1 to 1.5 hours of steaming, depending on the size and quantity. To test, carefully unwrap one tamale and check the texture of the masa; it should be moist but not doughy or sticky.",
    },
    {
      question: "Can I make tamales vegetarian or vegan?",
      answer:
        "Absolutely! For vegetarian or vegan tamales, substitute meat fillings with ingredients like roasted vegetables, mushrooms, beans, or vegan cheese. Use vegetable broth instead of chicken broth and replace lard with vegetable shortening or oil. Sweet tamales are naturally vegan if you use plant-based fats.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Tamales (Chicken, Pork, or Sweet)"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 90m
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
            Tamales are a beloved traditional dish originating from Mesoamerica,
            consisting of a flavorful corn dough called masa, steamed inside
            corn husks or banana leaves. This recipe offers three popular
            variations: chicken, pork, and sweet tamales, showcasing the
            versatility of this ancient culinary art. Each tamale is a perfect
            balance of tender masa and rich fillings, wrapped and steamed to
            perfection.
          </p>
          <p>
            Historically, tamales date back thousands of years to the Aztec and
            Mayan civilizations, where they were used as portable food for
            warriors and travelers. Over centuries, tamales have evolved into
            festive dishes enjoyed during holidays, family gatherings, and
            celebrations throughout Mexico and Central America, with regional
            variations adding unique flavors and ingredients.
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
              Prepare the Corn Husks
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Soak the corn husks in warm water for at least 30 minutes until
              pliable. Rinse thoroughly to remove any dirt, then drain and set
              aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Filling
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              For chicken or pork tamales, cook and shred the meat. Sauté onion,
              garlic, and chili powder, then mix with the shredded meat. For
              sweet tamales, combine corn kernels with brown sugar and cinnamon.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Make the Masa Dough
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, beat the lard or shortening until fluffy. Mix in
              masa harina, baking powder, salt, and gradually add chicken broth
              until a soft dough forms.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Tamales
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spread a thin layer of masa dough on each corn husk, add a spoonful
              of filling in the center, then fold the sides and bottom to
              enclose the filling securely.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Steam the Tamales
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Arrange tamales upright in a steamer basket. Cover with a damp
              cloth and steam over boiling water for about 1 to 1.5 hours,
              checking occasionally to ensure water doesn’t run dry.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Enjoy
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Let tamales rest for a few minutes after steaming. Serve warm,
              unwrapped from the husks, accompanied by salsa, crema, or your
              favorite sides.
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
            Use fresh masa harina for the best texture and flavor; if unavailable,
            pre-packaged masa harina works well too.
          </li>
          <li>
            Beat the lard or shortening until fluffy to incorporate air, which
            makes the tamales lighter and fluffier.
          </li>
          <li>
            Keep the steamer water level consistent by checking every 30 minutes
            to prevent burning or drying out the tamales.
          </li>
          <li>
            For extra flavor, marinate the meat overnight with spices and chili
            sauce before cooking.
          </li>
          <li>
            Sweet tamales can be enhanced by adding raisins, nuts, or dried fruit
            to the filling.
          </li>
          <li>
            Leftover tamales can be pan-fried for a crispy exterior and served
            with eggs for breakfast.
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
              href="https://en.wikipedia.org/wiki/Tamale"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Tamale
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/authentic-mexican-tamales-2342739"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Authentic Mexican Tamales Recipe
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Mexican-Tamales/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Mexican Tamales
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