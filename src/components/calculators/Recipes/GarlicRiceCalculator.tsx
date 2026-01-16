import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GarlicRiceCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Garlic%20Rice%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4995"
  );

  // --- DATA ---
  const title = "Garlic Rice";
  const description = "A more intense, aromatic version of the standard white rice.";

  // INGREDIENTS
  const ingredients = [
    { name: "Long-grain white rice", baseAmount: 500, unit: "g" },
    { name: "Garlic cloves, minced", baseAmount: 8, unit: "pcs" },
    { name: "Unsalted butter", baseAmount: 50, unit: "g" },
    { name: "Vegetable oil", baseAmount: 2, unit: "tbsp" },
    { name: "Chicken broth or water", baseAmount: 700, unit: "ml" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper, freshly ground", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh parsley, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Green onions, sliced", baseAmount: 3, unit: "pcs" },
    { name: "Soy sauce (optional)", baseAmount: 1, unit: "tbsp" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "pcs" },
  ];

  const nutrition = {
    calories: "350",
    protein: "7g",
    carbs: "70g",
    fat: "6g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use brown rice instead of white rice for garlic rice?",
      answer:
        "Yes, you can substitute brown rice for white rice to make a healthier version of garlic rice. However, brown rice requires a longer cooking time and more liquid, so adjust accordingly. The texture will be nuttier and chewier compared to white rice.",
    },
    {
      question: "How do I prevent garlic from burning while cooking?",
      answer:
        "To avoid burning garlic, cook it over medium-low heat and stir frequently. Adding the garlic after heating the oil and butter ensures it sautés gently. Burnt garlic tastes bitter and can ruin the dish, so watch closely and remove from heat if it starts to brown too quickly.",
    },
    {
      question: "Can I make garlic rice vegan?",
      answer:
        "Absolutely! Replace the butter with extra vegetable oil or a vegan butter substitute. Use vegetable broth instead of chicken broth to keep the flavor rich and savory while maintaining a vegan-friendly recipe.",
    },
    {
      question: "What is the best way to store leftover garlic rice?",
      answer:
        "Store leftover garlic rice in an airtight container in the refrigerator for up to 3 days. When reheating, sprinkle a little water over the rice and cover it to retain moisture. Reheat gently on the stove or in the microwave to avoid drying out the rice.",
    },
    {
      question: "Can I add other ingredients to customize garlic rice?",
      answer:
        "Yes, garlic rice is very versatile. You can add vegetables like peas, carrots, or corn, proteins such as cooked shrimp or chicken, or spices like chili flakes for heat. Just add these ingredients during the last few minutes of cooking or as a topping.",
    },
    {
      question: "Why does my garlic rice sometimes turn mushy?",
      answer:
        "Mushy garlic rice usually results from using too much liquid or overcooking the rice. Measure your broth or water carefully and follow the cooking time closely. Also, rinsing the rice before cooking removes excess starch that can cause stickiness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Garlic Rice"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 15m
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
            Garlic rice is a beloved side dish known for its rich aroma and savory flavor,
            elevating simple white rice into a fragrant and satisfying accompaniment. This recipe
            intensifies the garlic essence by using generous amounts of fresh minced garlic,
            butter, and broth, resulting in a deeply flavorful rice that pairs beautifully with
            grilled meats, seafood, or vegetables.
          </p>
          <p>
            The origins of garlic rice trace back to various Asian and Mediterranean cuisines,
            where garlic is a staple aromatic ingredient. It has become a popular comfort food
            in Filipino cuisine, often served alongside fried dishes or as a base for flavorful
            meals. Its simplicity and versatility make it a kitchen favorite worldwide.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Rice</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the rice under cold water until the water runs clear to remove excess starch.
              Drain well. This helps prevent the rice from becoming sticky or mushy.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté the Garlic</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat the vegetable oil and butter in a large pan over medium heat. Add the minced
              garlic and sauté gently until fragrant and lightly golden, about 2-3 minutes. Avoid
              burning the garlic to prevent bitterness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Rice</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the rinsed rice to the pan and stir to coat the grains with the garlic butter
              mixture. Pour in the chicken broth (or water) and season with salt and pepper.
              Bring to a boil, then reduce heat to low, cover, and simmer for 15 minutes or until
              the liquid is absorbed and rice is tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Rest and Fluff</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the pan from heat and let the rice rest, covered, for 5 minutes. Then fluff
              the rice gently with a fork to separate the grains.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Garnish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in chopped parsley and sliced green onions. Optionally, drizzle soy sauce for
              extra umami. Serve hot with lime wedges on the side for a fresh citrus finish.
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
            Use fresh garlic for the best aroma and flavor; pre-minced garlic lacks intensity.
          </li>
          <li>
            Toast the rice lightly in the garlic butter before adding liquid to enhance its nutty flavor.
          </li>
          <li>
            For a richer taste, substitute half the water with coconut milk or add a bay leaf while cooking.
          </li>
          <li>
            Adjust garlic quantity to your preference; start with less if you’re new to garlic rice.
          </li>
          <li>
            Leftover garlic rice makes a great base for fried rice dishes—just add eggs and veggies.
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
              href="https://en.wikipedia.org/wiki/Garlic_rice"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Garlic Rice
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/garlic-rice-recipe-3030206"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Garlic Rice Recipe
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