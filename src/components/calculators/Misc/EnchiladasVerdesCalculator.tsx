import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EnchiladasVerdesCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Enchiladas%20Verdes%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8357"
  );

  // --- DATA ---
  const title = "Enchiladas Verdes";
  const description = "Enchiladas com salsa verde (tomatillo), geralmente com frango e creme.";

  // INGREDIENTS
  const ingredients = [
    { name: "Chicken breast, cooked and shredded", baseAmount: 500, unit: "g" },
    { name: "Corn tortillas", baseAmount: 12, unit: "pieces" },
    { name: "Tomatillos, husked and rinsed", baseAmount: 500, unit: "g" },
    { name: "Jalapeño peppers", baseAmount: 2, unit: "pieces" },
    { name: "White onion, chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves", baseAmount: 3, unit: "pieces" },
    { name: "Fresh cilantro leaves", baseAmount: 30, unit: "g" },
    { name: "Chicken broth", baseAmount: 250, unit: "ml" },
    { name: "Sour cream or Mexican crema", baseAmount: 200, unit: "ml" },
    { name: "Queso fresco or shredded cheese", baseAmount: 150, unit: "g" },
    { name: "Vegetable oil (for frying tortillas)", baseAmount: 100, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "pieces" },
  ];

  const nutrition = {
    calories: "480",
    protein: "38g",
    carbs: "35g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes the salsa verde in Enchiladas Verdes unique?",
      answer:
        "The salsa verde is primarily made from tomatillos, which give it a bright, tangy flavor distinct from red sauces. The combination of tomatillos, jalapeños, garlic, onion, and fresh cilantro creates a vibrant, slightly spicy sauce that perfectly complements the enchiladas.",
    },
    {
      question: "Can I make Enchiladas Verdes vegetarian?",
      answer:
        "Absolutely! You can substitute the chicken with sautéed mushrooms, roasted vegetables, or beans. The salsa verde remains the same, providing a fresh and tangy flavor that pairs well with vegetarian fillings.",
    },
    {
      question: "How do I prevent tortillas from breaking when rolling enchiladas?",
      answer:
        "To prevent breaking, lightly fry the corn tortillas in hot oil for a few seconds on each side until pliable, then drain on paper towels. This softens them and makes rolling easier without cracking.",
    },
    {
      question: "What cheese works best for topping Enchiladas Verdes?",
      answer:
        "Queso fresco is traditional and adds a mild, crumbly texture. Alternatively, shredded Monterey Jack or mozzarella can be used for a meltier topping. Choose based on your texture preference.",
    },
    {
      question: "Can I prepare Enchiladas Verdes ahead of time?",
      answer:
        "Yes, you can assemble the enchiladas a few hours before baking and refrigerate them. Bring them to room temperature before baking to ensure even cooking. The salsa verde can also be made in advance and stored refrigerated for up to 3 days.",
    },
    {
      question: "What side dishes pair well with Enchiladas Verdes?",
      answer:
        "Common sides include Mexican rice, refried beans, fresh guacamole, and a simple green salad. Lime wedges and extra crema also enhance the meal.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Enchiladas Verdes"
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
            Enchiladas Verdes is a classic Mexican dish featuring tender corn tortillas filled with shredded chicken and smothered in a vibrant green tomatillo salsa. This recipe balances tangy, spicy, and creamy flavors, making it a beloved comfort food across Mexico and beyond. The dish is typically topped with Mexican crema and queso fresco, adding richness and texture.
          </p>
          <p>
            The origins of Enchiladas Verdes trace back to traditional Mexican home cooking, where fresh tomatillos and chiles were staples in the kitchen. The green sauce, or salsa verde, highlights the bright acidity of tomatillos combined with aromatic herbs and peppers. Over time, this dish has evolved into a restaurant favorite, celebrated for its fresh flavors and satisfying heartiness.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Salsa Verde</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a pot, boil the tomatillos, jalapeños, and chopped onion until soft, about 10 minutes. Drain and transfer to a blender along with garlic, cilantro, chicken broth, salt, and pepper. Blend until smooth and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Chicken Filling</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Use cooked shredded chicken breast seasoned lightly with salt and pepper. You can poach chicken breasts or use leftovers.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Tortillas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a skillet over medium heat. Lightly fry each corn tortilla for about 10 seconds per side until pliable but not crispy. Drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Assemble the Enchiladas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Dip each tortilla briefly in the salsa verde, then fill with shredded chicken and roll tightly. Place seam-side down in a baking dish.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Bake and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour remaining salsa verde over the enchiladas, top with sour cream or crema and crumbled queso fresco. Bake in a preheated oven at 180°C (350°F) for 10 minutes until heated through. Serve with lime wedges.
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
            Use fresh tomatillos for the best salsa verde flavor; canned tomatillos can be used in a pinch but lack brightness.
          </li>
          <li>
            Lightly frying the tortillas before assembling prevents them from tearing and adds a subtle richness.
          </li>
          <li>
            Adjust the heat by removing seeds from jalapeños or substituting with milder peppers if preferred.
          </li>
          <li>
            For extra creaminess, drizzle additional crema or sour cream on top just before serving.
          </li>
          <li>
            Leftover enchiladas can be refrigerated and reheated covered with foil to retain moisture.
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
              href="https://en.wikipedia.org/wiki/Enchilada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Enchilada
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/enchiladas-verdes-recipe-2342798"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Enchiladas Verdes Recipe
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