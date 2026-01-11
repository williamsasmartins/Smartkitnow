import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EnchiladasRojasCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Enchiladas%20Rojas%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1192"
  );

  // --- DATA ---
  const title = "Enchiladas Rojas";
  const description = "Enchiladas com molho vermelho de pimentas e tomate.";

  // INGREDIENTS
  const ingredients = [
    { name: "Corn Tortillas", baseAmount: 12, unit: "units" },
    { name: "Chicken Breast (cooked & shredded)", baseAmount: 500, unit: "g" },
    { name: "Dried Guajillo Chiles", baseAmount: 5, unit: "units" },
    { name: "Dried Ancho Chiles", baseAmount: 3, unit: "units" },
    { name: "Roma Tomatoes", baseAmount: 4, unit: "units" },
    { name: "White Onion", baseAmount: 1, unit: "medium" },
    { name: "Garlic Cloves", baseAmount: 3, unit: "units" },
    { name: "Vegetable Oil", baseAmount: 3, unit: "tbsp" },
    { name: "Chicken Broth", baseAmount: 500, unit: "ml" },
    { name: "Ground Cumin", baseAmount: 1, unit: "tsp" },
    { name: "Dried Oregano", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Queso Fresco (crumbled)", baseAmount: 150, unit: "g" },
    { name: "Fresh Cilantro (chopped)", baseAmount: 0.25, unit: "cup" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "450",
    protein: "35g",
    carbs: "40g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes the red sauce in Enchiladas Rojas unique?",
      answer:
        "The red sauce is primarily made from dried red chiles such as guajillo and ancho, blended with tomatoes, garlic, and spices. This combination gives the sauce its deep, smoky, and slightly sweet flavor that distinguishes it from other enchilada sauces.",
    },
    {
      question: "Can I use store-bought red enchilada sauce instead of making my own?",
      answer:
        "Yes, store-bought red enchilada sauce can be used for convenience, but making your own sauce from dried chiles and fresh ingredients results in a richer and more authentic flavor. Homemade sauce also allows you to adjust the spice level and seasoning to your preference.",
    },
    {
      question: "How do I prevent the tortillas from breaking when rolling the enchiladas?",
      answer:
        "To prevent tortillas from breaking, lightly warm them on a skillet or microwave to make them pliable. Also, briefly dipping them in the warm red sauce before filling and rolling helps soften them and reduces cracking.",
    },
    {
      question: "Can I substitute chicken with other proteins or make it vegetarian?",
      answer:
        "Absolutely! You can substitute chicken with shredded beef, pork, or even sautéed vegetables like mushrooms and zucchini for a vegetarian version. Just adjust cooking times accordingly and ensure the filling is well-seasoned.",
    },
    {
      question: "How should I store leftover enchiladas?",
      answer:
        "Store leftover enchiladas in an airtight container in the refrigerator for up to 3 days. Reheat them covered in the oven or microwave until warmed through. You can also freeze them for up to 1 month; thaw overnight in the fridge before reheating.",
    },
    {
      question: "What side dishes pair well with Enchiladas Rojas?",
      answer:
        "Traditional sides include Mexican rice, refried beans, fresh guacamole, and a simple salad with lime dressing. These sides complement the rich flavors of the enchiladas and create a balanced meal.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Enchiladas Rojas"
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
            Enchiladas Rojas are a classic Mexican dish featuring tender corn tortillas
            filled with shredded chicken and smothered in a rich, smoky red chile and
            tomato sauce. This recipe balances vibrant flavors and textures, delivering
            a comforting yet sophisticated meal perfect for any occasion.
          </p>
          <p>
            The origins of enchiladas date back to Aztec times, where corn tortillas
            were filled with various ingredients and topped with chili sauces. The
            "rojas" or red sauce variation highlights the use of dried red chiles,
            which were introduced to Mexican cuisine after the Spanish conquest. Over
            centuries, this dish has evolved into a beloved staple, celebrated for its
            bold flavors and cultural significance.
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
              Prepare the Red Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove stems and seeds from the dried guajillo and ancho chiles. Toast
              them lightly in a dry skillet until fragrant, about 1-2 minutes. Soak
              the chiles in hot water for 15 minutes until softened. Blend the soaked
              chiles with roasted roma tomatoes, garlic, onion, cumin, oregano, salt,
              and chicken broth until smooth. Strain the sauce through a fine sieve
              and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a skillet over medium heat. Pour in the red sauce
              and simmer for 10 minutes, stirring occasionally, to deepen the flavors.
              Adjust salt and seasoning as needed.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Tortillas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Warm the corn tortillas on a hot skillet or microwave until pliable.
              Lightly dip each tortilla in the warm red sauce to soften and flavor
              them.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Enchiladas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place a generous amount of shredded chicken on each tortilla, roll it up,
              and place seam-side down in a baking dish. Pour remaining red sauce over
              the enchiladas evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Sprinkle crumbled queso fresco over the top and bake in a preheated oven
              at 180°C (350°F) for 10 minutes until cheese melts and enchiladas are
              heated through. Garnish with fresh cilantro and serve immediately.
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
            Toast the dried chiles gently to enhance their smoky flavor but avoid
            burning them, which can cause bitterness.
          </li>
          <li>
            Use fresh, ripe roma tomatoes for a naturally sweet and rich sauce base.
          </li>
          <li>
            When warming tortillas, cover them with a clean kitchen towel to keep
            them soft and pliable.
          </li>
          <li>
            If you prefer a spicier sauce, add a few dried arbol chiles or a pinch of
            cayenne pepper.
          </li>
          <li>
            Leftover sauce can be refrigerated for up to 3 days or frozen for longer
            storage.
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
              href="https://www.thespruceeats.com/authentic-mexican-red-enchilada-sauce-2342797"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Authentic Mexican Red Enchilada Sauce
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