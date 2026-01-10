import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BroccoliRabeWithGarlicAndChiliCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Broccoli%20Rabe%20with%20Garlic%20and%20Chili%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4414"
  );

  // --- DATA ---
  const title = "Broccoli Rabe with Garlic and Chili";
  const description = "Bitter greens sautéed with garlic and red chili flakes.";

  // INGREDIENTS
  const ingredients = [
    { name: "Broccoli Rabe (Rapini)", baseAmount: 500, unit: "g" },
    { name: "Garlic Cloves, thinly sliced", baseAmount: 4, unit: "pcs" },
    { name: "Extra Virgin Olive Oil", baseAmount: 3, unit: "tbsp" },
    { name: "Red Chili Flakes", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper, freshly ground", baseAmount: 0.5, unit: "tsp" },
    { name: "Lemon Juice (freshly squeezed)", baseAmount: 1, unit: "tbsp" },
    { name: "Water (for blanching)", baseAmount: 2, unit: "l" },
    { name: "Kosher Salt (for blanching water)", baseAmount: 1, unit: "tbsp" },
    { name: "Parmesan Cheese (optional, for serving)", baseAmount: 30, unit: "g" },
    { name: "Crusty Bread (optional, for serving)", baseAmount: 4, unit: "slices" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "120",
    protein: "5g",
    carbs: "8g",
    fat: "8g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is broccoli rabe and how does it taste?",
      answer:
        "Broccoli rabe, also known as rapini, is a leafy green vegetable related to the turnip family. It has a slightly bitter and earthy flavor with a hint of nuttiness, making it a perfect complement to garlic and chili in this recipe.",
    },
    {
      question: "How do I properly prepare broccoli rabe before cooking?",
      answer:
        "To prepare broccoli rabe, trim the tough ends of the stems and wash thoroughly to remove any grit. Blanching it briefly in salted boiling water helps reduce its bitterness and softens the stems, making it more palatable.",
    },
    {
      question: "Can I adjust the spiciness of this dish?",
      answer:
        "Absolutely! You can increase or decrease the amount of red chili flakes according to your heat preference. For a milder version, reduce the chili flakes or omit them entirely.",
    },
    {
      question: "What are some good side dishes to serve with broccoli rabe with garlic and chili?",
      answer:
        "This dish pairs wonderfully with crusty bread, roasted potatoes, grilled meats, or pasta. It can also be served as a flavorful side to complement rich or hearty main courses.",
    },
    {
      question: "Is broccoli rabe healthy?",
      answer:
        "Yes, broccoli rabe is highly nutritious. It is rich in vitamins A, C, and K, as well as minerals like calcium and iron. It also contains antioxidants and dietary fiber, making it a healthy addition to your diet.",
    },
    {
      question: "Can I make this recipe vegan?",
      answer:
        "Yes, this recipe is naturally vegan if you omit the optional Parmesan cheese. You can also substitute it with a vegan cheese alternative or nutritional yeast for a cheesy flavor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Broccoli Rabe with Garlic and Chili"
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
            Broccoli Rabe with Garlic and Chili is a classic Italian side dish that
            celebrates the bold, bitter flavors of rapini balanced with the pungency
            of garlic and the heat of red chili flakes. This simple yet vibrant recipe
            is perfect for those who appreciate robust, savory greens that add depth
            and color to any meal.
          </p>
          <p>
            Originating from Southern Italy, broccoli rabe has long been a staple in
            rustic Italian cooking. Traditionally sautéed with garlic and chili, it
            embodies the Mediterranean philosophy of using fresh, seasonal ingredients
            to create dishes that are both healthy and flavorful. This recipe honors
            that heritage while being easy enough for home cooks to prepare any day of
            the week.
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
              Prepare the Broccoli Rabe
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Trim the tough ends of the broccoli rabe stems and wash thoroughly under
              cold running water to remove any dirt or grit.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Blanch the Greens
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring a large pot of salted water to a boil. Add the broccoli rabe and
              blanch for 2-3 minutes until bright green and slightly tender. Drain and
              immediately plunge into ice water to stop cooking and preserve color.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Garlic and Chili
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large skillet over medium heat. Add the sliced garlic
              and red chili flakes, cooking gently until the garlic is golden and
              fragrant, about 2-3 minutes. Be careful not to burn the garlic.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Broccoli Rabe and Season
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Drain the broccoli rabe from the ice water and add it to the skillet.
              Toss to coat in the garlic-chili oil. Season with salt and freshly ground
              black pepper. Cook for another 3-4 minutes until heated through.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Finish and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove from heat and drizzle with fresh lemon juice. Optionally, sprinkle
              with grated Parmesan cheese and serve immediately with crusty bread or as
              a side dish.
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
            Blanching broccoli rabe reduces bitterness and preserves its vibrant green
            color—don’t skip this step for best results.
          </li>
          <li>
            Use good quality extra virgin olive oil for a richer flavor and aroma.
          </li>
          <li>
            Adjust the chili flakes to your heat tolerance; start with less and add
            more if desired.
          </li>
          <li>
            For a nuttier flavor, toast some pine nuts and sprinkle on top before
            serving.
          </li>
          <li>
            Leftovers can be refrigerated and gently reheated; they also make a great
            addition to pasta or grain bowls.
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
