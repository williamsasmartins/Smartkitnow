import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SaffronRisottoRisottoAllaMilaneseCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Saffron%20Risotto%20Risotto%20alla%20Milanese%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4863"
  );

  // --- DATA ---
  const title = "Saffron Risotto (Risotto alla Milanese)";
  const description = "Creamy Arborio rice infused with saffron and Parmesan.";

  // INGREDIENTS
  const ingredients = [
    { name: "Arborio Rice", baseAmount: 320, unit: "g" },
    { name: "Unsalted Butter", baseAmount: 60, unit: "g" },
    { name: "Yellow Onion (finely chopped)", baseAmount: 1, unit: "medium" },
    { name: "Dry White Wine", baseAmount: 125, unit: "ml" },
    { name: "Chicken or Vegetable Stock (hot)", baseAmount: 1.2, unit: "L" },
    { name: "Saffron Threads", baseAmount: 0.15, unit: "g" },
    { name: "Parmesan Cheese (freshly grated)", baseAmount: 80, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "Olive Oil", baseAmount: 1, unit: "tbsp" },
    { name: "Water (to soak saffron)", baseAmount: 2, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "14g",
    carbs: "70g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(2).replace(/\.00$/, "").replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of rice is best for Risotto alla Milanese?",
      answer:
        "Arborio rice is the traditional choice for Risotto alla Milanese due to its high starch content, which creates the creamy texture characteristic of risotto. Carnaroli or Vialone Nano rice can also be used as excellent alternatives.",
    },
    {
      question: "How do I properly infuse saffron in the risotto?",
      answer:
        "To maximize saffron's flavor and color, soak the saffron threads in a small amount of warm water or stock for about 10-15 minutes before adding it to the risotto. This helps release the pigments and aroma evenly throughout the dish.",
    },
    {
      question: "Can I make Risotto alla Milanese vegetarian?",
      answer:
        "Yes, you can use vegetable stock instead of chicken stock to make a vegetarian version. Ensure the stock is flavorful to maintain the depth of taste in the risotto.",
    },
    {
      question: "Why is constant stirring important when making risotto?",
      answer:
        "Constant stirring helps release the rice's starch gradually, which is essential for achieving the creamy consistency of risotto. It also prevents the rice from sticking to the pan and ensures even cooking.",
    },
    {
      question: "How do I know when the risotto is perfectly cooked?",
      answer:
        "The risotto should be creamy and slightly fluid but not soupy, with the rice grains tender yet still firm to the bite (al dente). Taste frequently during cooking to check the texture.",
    },
    {
      question: "Can I prepare Risotto alla Milanese in advance?",
      answer:
        "Risotto is best served fresh. If you need to prepare it in advance, slightly undercook the rice and finish cooking just before serving by reheating gently with a bit of stock or water.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Saffron Risotto (Risotto alla Milanese)"
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
            Risotto alla Milanese is a classic Italian dish renowned for its luxurious creamy texture and
            vibrant golden hue, imparted by the delicate saffron threads. This recipe combines Arborio rice,
            slow-cooked in a rich broth and finished with Parmesan cheese and butter, creating a comforting yet
            elegant plate perfect for any occasion.
          </p>
          <p>
            Originating from Milan in the Lombardy region of Italy, this risotto has a storied history dating back
            to the 16th century. Legend credits a glassblower's apprentice who introduced saffron to the dish,
            giving it its signature color and flavor. Today, Risotto alla Milanese remains a beloved staple of
            Italian cuisine, celebrated for its simplicity and depth.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the saffron infusion</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Soak the saffron threads in 2 tablespoons of warm water or hot stock for 10-15 minutes to release
              their color and aroma.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté the onion</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pan, heat the olive oil and half the butter over medium heat. Add the finely chopped
              onion and cook gently until translucent but not browned, about 5-7 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Toast the rice</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the Arborio rice to the pan and stir continuously for 2-3 minutes until the grains are well
              coated and slightly translucent at the edges.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Deglaze with wine</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the white wine and stir until it has mostly evaporated, infusing the rice with flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add stock gradually</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Begin adding the hot stock one ladle at a time, stirring frequently and allowing the liquid to be
              absorbed before adding more. Continue this process for about 18-20 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Incorporate saffron and season</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the saffron infusion along with salt and freshly ground black pepper. Continue cooking until
              the rice is al dente and creamy.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              7
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Finish with butter and Parmesan</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the pan from heat and stir in the remaining butter and grated Parmesan cheese until melted
              and well combined. Adjust seasoning if needed.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              8
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve immediately</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the risotto hot, garnished with extra Parmesan or a sprinkle of fresh herbs if desired.
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
            Use a heavy-bottomed pan to ensure even heat distribution and prevent the rice from burning.
          </li>
          <li>
            Keep your stock hot throughout the cooking process to maintain a consistent temperature and speed up
            cooking.
          </li>
          <li>
            Stir gently but consistently; vigorous stirring can break the rice grains and affect texture.
          </li>
          <li>
            For an extra depth of flavor, toast the saffron threads lightly before soaking them.
          </li>
          <li>
            Finish with a knob of cold butter (mantecatura) off the heat to enrich the risotto’s creaminess.
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