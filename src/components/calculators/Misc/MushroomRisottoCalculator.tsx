import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MushroomRisottoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Mushroom%20Risotto%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=731"
  );

  // --- DATA ---
  const title = "Mushroom Risotto";
  const description = "Rich earthy risotto with mixed wild mushrooms and white wine.";

  // INGREDIENTS
  const ingredients = [
    { name: "Arborio Rice", baseAmount: 320, unit: "g" },
    { name: "Mixed Wild Mushrooms (e.g., shiitake, cremini, oyster)", baseAmount: 400, unit: "g" },
    { name: "Vegetable Stock", baseAmount: 1.2, unit: "L" },
    { name: "Dry White Wine", baseAmount: 150, unit: "ml" },
    { name: "Yellow Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic Cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Unsalted Butter", baseAmount: 60, unit: "g" },
    { name: "Parmesan Cheese, grated", baseAmount: 80, unit: "g" },
    { name: "Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Fresh Thyme Leaves", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Freshly Ground Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh Parsley, chopped (for garnish)", baseAmount: 2, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "15g",
    carbs: "65g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of rice is best for making risotto?",
      answer:
        "Arborio rice is the preferred choice for risotto due to its high starch content, which creates the creamy texture characteristic of this dish. Other suitable varieties include Carnaroli and Vialone Nano, which also have excellent absorption and creaminess.",
    },
    {
      question: "Can I use chicken stock instead of vegetable stock?",
      answer:
        "Yes, chicken stock can be used and will add a richer flavor to the risotto. However, for a vegetarian or vegan version, vegetable stock is recommended. Always use a good quality, flavorful stock for the best results.",
    },
    {
      question: "How do I know when the risotto is perfectly cooked?",
      answer:
        "The risotto should be creamy and slightly loose in texture, with the rice grains tender but still firm to the bite (al dente). It should not be mushy or dry. Taste frequently towards the end of cooking to check the texture.",
    },
    {
      question: "Can I prepare risotto in advance?",
      answer:
        "Risotto is best served fresh immediately after cooking to enjoy its creamy texture. If you must prepare it in advance, slightly undercook the rice and reheat gently with a splash of stock or water, stirring to restore creaminess.",
    },
    {
      question: "What are some good mushroom alternatives for this recipe?",
      answer:
        "You can use a variety of mushrooms such as button, portobello, chanterelle, or porcini. Dried porcini mushrooms soaked in warm water add an intense earthy flavor. Mixing different types enhances the depth and complexity of the dish.",
    },
    {
      question: "How can I make this risotto vegan?",
      answer:
        "To make a vegan mushroom risotto, substitute the butter with vegan margarine or olive oil, and use nutritional yeast or vegan cheese alternatives instead of Parmesan. Ensure the stock used is vegetable-based.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Mushroom Risotto"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 30m
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
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-base">
          <div>
            <div className="font-bold text-lg">{nutrition.calories}</div>
            <span className="font-bold uppercase text-slate-500">Kcal</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.protein}</div>
            <span className="font-bold uppercase text-slate-500">Prot</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.carbs}</div>
            <span className="font-bold uppercase text-slate-500">Carb</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.fat}</div>
            <span className="font-bold uppercase text-slate-500">Fat</span>
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
            Mushroom Risotto is a classic Italian dish celebrated for its creamy
            texture and rich, earthy flavors. This recipe combines the delicate
            taste of mixed wild mushrooms with the subtle acidity of white wine,
            creating a harmonious balance that delights the palate. Perfect as a
            comforting main course or an elegant side, this risotto showcases the
            art of slow cooking and careful stirring to achieve its signature
            creaminess.
          </p>
          <p>
            Originating from the northern regions of Italy, risotto has been a
            staple in Italian cuisine since the 19th century. Traditionally made
            with Arborio rice, the dish reflects the Italian philosophy of using
            simple, high-quality ingredients to create something truly special.
            Over time, mushroom risotto has become a beloved variation, highlighting
            the bounty of forest mushrooms and seasonal produce.
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
              Prepare the Stock and Mushrooms
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Warm the vegetable stock in a saucepan over low heat. Clean and slice
              the mixed wild mushrooms. Set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Aromatics and Mushrooms
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pan, heat olive oil and half the butter over medium heat.
              Add the chopped onion and garlic, cooking until translucent. Add the
              mushrooms and thyme leaves, sautéing until they release their moisture
              and become golden brown. Season with salt and pepper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Toast the Rice and Deglaze
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the Arborio rice to the pan and stir for 2-3 minutes until the
              grains are well coated and slightly translucent at the edges. Pour in
              the white wine and cook, stirring, until the wine has mostly evaporated.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Gradually Add Stock and Stir
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add a ladleful of warm stock to the rice and stir continuously until
              the liquid is mostly absorbed. Repeat this process, adding stock one
              ladle at a time, stirring often, until the rice is creamy and cooked
              al dente (about 18-20 minutes).
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Finish with Butter and Parmesan
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the pan from heat and stir in the remaining butter and grated
              Parmesan cheese until melted and well combined. Adjust seasoning with
              salt and pepper as needed.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Garnish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spoon the risotto onto plates and garnish with freshly chopped parsley.
              Serve immediately while warm and creamy.
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
            Use warm stock throughout the cooking process to maintain an even
            temperature and ensure the rice cooks evenly.
          </li>
          <li>
            Stir frequently but gently to release the rice’s starch without breaking
            the grains, which helps achieve the perfect creamy texture.
          </li>
          <li>
            For an extra depth of flavor, add a splash of truffle oil or a handful
            of sautéed porcini mushrooms before serving.
          </li>
          <li>
            If you prefer a lighter risotto, reduce the amount of butter and
            Parmesan slightly, but keep enough to maintain creaminess.
          </li>
          <li>
            Always taste the risotto near the end of cooking to adjust seasoning and
            texture to your preference.
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
              href="https://en.wikipedia.org/wiki/Italian_cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: History of this Dish
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Italian-cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Culinary Reference
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