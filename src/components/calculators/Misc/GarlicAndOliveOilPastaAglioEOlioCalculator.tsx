import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GarlicAndOliveOilPastaAglioEOlioCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Garlic%20and%20Olive%20Oil%20Pasta%20Aglio%20e%20Olio%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1044"
  );

  // --- DATA ---
  const title = "Garlic and Olive Oil Pasta (Aglio e Olio)";
  const description = "Classic midnight pasta with garlic, olive oil, chili flakes, and parsley.";

  // INGREDIENTS
  const ingredients = [
    { name: "Spaghetti", baseAmount: 400, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 120, unit: "ml" },
    { name: "Garlic Cloves, thinly sliced", baseAmount: 6, unit: "pcs" },
    { name: "Red Chili Flakes", baseAmount: 1, unit: "tsp" },
    { name: "Fresh Flat-leaf Parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Salt", baseAmount: 10, unit: "g" },
    { name: "Black Pepper, freshly ground", baseAmount: 0.5, unit: "tsp" },
    { name: "Pecorino Romano or Parmesan Cheese, grated (optional)", baseAmount: 50, unit: "g" },
    { name: "Water for boiling pasta", baseAmount: 3000, unit: "ml" },
    { name: "Lemon Zest (optional)", baseAmount: 1, unit: "tsp" },
    { name: "Butter (optional, for richness)", baseAmount: 20, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "520",
    protein: "15g",
    carbs: "70g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) => (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of pasta is best for Aglio e Olio?",
      answer:
        "Traditionally, spaghetti is used for Aglio e Olio because its long, thin strands hold the garlic-infused olive oil beautifully. However, you can also use linguine or vermicelli as alternatives depending on your preference.",
    },
    {
      question: "How do I prevent the garlic from burning?",
      answer:
        "To avoid burning the garlic, slice it thinly and cook it gently over low to medium heat in olive oil. Stir frequently and remove the pan from heat if the garlic starts to brown too quickly. Burnt garlic tastes bitter and can ruin the dish.",
    },
    {
      question: "Can I make this recipe vegan?",
      answer:
        "Yes! The base recipe is naturally vegan if you omit the optional cheese and butter. Use extra virgin olive oil and fresh parsley for flavor. For a cheesy flavor, consider vegan Parmesan alternatives or nutritional yeast.",
    },
    {
      question: "How spicy is this dish?",
      answer:
        "The spiciness depends on the amount of red chili flakes you add. The recipe uses about 1 teaspoon for 4 servings, which provides a mild to moderate heat. Adjust the chili flakes to suit your heat tolerance.",
    },
    {
      question: "Can I prepare this dish ahead of time?",
      answer:
        "Aglio e Olio is best served fresh to enjoy the vibrant flavors and texture. However, you can prepare the garlic-infused oil in advance and reheat gently. Cook the pasta just before serving and toss everything together quickly.",
    },
    {
      question: "What wine pairs well with Aglio e Olio?",
      answer:
        "A crisp, light white wine such as Pinot Grigio or Vermentino pairs excellently with Aglio e Olio. The acidity complements the olive oil and garlic, balancing the richness of the dish.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Garlic and Olive Oil Pasta (Aglio e Olio)"
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
            Garlic and Olive Oil Pasta, or Aglio e Olio, is a timeless Italian classic that embodies simplicity and bold flavors. This dish is beloved for its minimalistic ingredients that come together to create a comforting and satisfying meal, perfect for any time of day but especially popular as a late-night treat. The combination of fragrant garlic, high-quality olive oil, a hint of chili heat, and fresh parsley makes it a staple in Italian households and restaurants worldwide.
          </p>
          <p>
            Originating from Naples, Italy, Aglio e Olio has humble beginnings as a peasant dish designed to be quick, affordable, and delicious. Its roots trace back to the Campania region, where local cooks relied on pantry staples to craft meals that were both nourishing and flavorful. Over time, this simple pasta has gained international acclaim, celebrated for its elegance through simplicity and its ability to highlight the quality of each ingredient.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Pasta</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring a large pot of salted water to a rolling boil. Add the spaghetti and cook until al dente, usually about 8-9 minutes or according to package instructions. Reserve about 1 cup of pasta water before draining.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Infuse the Olive Oil</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large skillet, heat the extra virgin olive oil over low to medium heat. Add the thinly sliced garlic and gently sauté until fragrant and golden but not browned, about 2-3 minutes. Stir frequently to prevent burning.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Chili and Seasoning</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the red chili flakes and freshly ground black pepper. Cook for another 30 seconds to release the flavors. Optionally, add butter for richness and lemon zest for brightness at this stage.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine Pasta and Sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the drained spaghetti to the skillet with the garlic oil. Toss well to coat the pasta evenly. Add reserved pasta water a little at a time to loosen the sauce and help it cling to the noodles.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Finish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the chopped fresh parsley. Serve immediately with a generous sprinkle of grated Pecorino Romano or Parmesan cheese if desired. Enjoy your authentic Aglio e Olio!
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
            Use the highest quality extra virgin olive oil you can find, as it is the star ingredient and greatly influences the flavor.
          </li>
          <li>
            Slice garlic uniformly thin to ensure even cooking and prevent some pieces from burning while others remain raw.
          </li>
          <li>
            Reserve pasta water before draining; its starchiness helps emulsify the sauce and coat the pasta perfectly.
          </li>
          <li>
            Adjust chili flakes to your heat preference, but avoid overpowering the delicate garlic flavor.
          </li>
          <li>
            For a creamier texture, add a small knob of butter at the end and toss well.
          </li>
          <li>
            Serve immediately; the sauce thickens and clumps if left to sit too long.
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