import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function SweetCornCoconutPuddingCanjicaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Sweet%20Corn%20and%20Coconut%20Pudding%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4748"
  );

  // --- DATA ---
  const title = "Sweet Corn and Coconut Pudding";
  const description = "Hominy corn cooked with milk, sugar, and cinnamon.";

  // INGREDIENTS
  const ingredients = [
    { name: "Hominy Corn (Canjica)", baseAmount: 500, unit: "g" },
    { name: "Coconut Milk", baseAmount: 400, unit: "ml" },
    { name: "Whole Milk", baseAmount: 500, unit: "ml" },
    { name: "Granulated Sugar", baseAmount: 150, unit: "g" },
    { name: "Sweetened Condensed Milk", baseAmount: 200, unit: "ml" },
    { name: "Cinnamon Stick", baseAmount: 2, unit: "sticks" },
    { name: "Cloves", baseAmount: 4, unit: "pcs" },
    { name: "Vanilla Extract", baseAmount: 1, unit: "tsp" },
    { name: "Grated Coconut (fresh or desiccated)", baseAmount: 100, unit: "g" },
    { name: "Salt", baseAmount: 0.5, unit: "tsp" },
    { name: "Butter", baseAmount: 20, unit: "g" },
    { name: "Toasted Coconut Flakes (for garnish)", baseAmount: 30, unit: "g" },
  ];

  // Nutrition per 4 servings (approximate)
  const nutrition = {
    calories: "420",
    protein: "7g",
    carbs: "65g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is canjica and how is it different from regular corn?",
      answer:
        "Canjica is a type of hominy corn, which means the corn kernels have been treated with an alkali solution to remove the hull and germ. This process makes the kernels larger, softer, and ideal for slow cooking in puddings and stews. Unlike regular cornmeal or fresh corn, canjica has a chewy texture and absorbs flavors deeply, making it perfect for this traditional Brazilian dessert.",
    },
    {
      question: "Can I substitute coconut milk with another ingredient?",
      answer:
        "While coconut milk provides a rich, creamy texture and distinct flavor essential to this pudding, you can substitute it with heavy cream or evaporated milk for a less pronounced coconut taste. However, this will alter the authentic flavor profile. For a dairy-free version, use full-fat coconut milk exclusively and omit whole milk.",
    },
    {
      question: "How long should I soak the hominy corn before cooking?",
      answer:
        "Soaking the hominy corn overnight (8-12 hours) in plenty of water helps to soften the kernels and reduce cooking time significantly. If short on time, a quick soak of 2-3 hours can work, but the texture may be firmer and cooking will take longer. Always rinse the soaked corn well before cooking.",
    },
    {
      question: "Can I prepare this pudding in advance?",
      answer:
        "Yes, Sweet Corn and Coconut Pudding can be prepared a day ahead and refrigerated. The flavors tend to meld and improve overnight. Reheat gently on the stove or microwave, stirring occasionally. If the pudding thickens too much after chilling, add a splash of milk or coconut milk to loosen the texture before serving.",
    },
    {
      question: "What are some popular variations of this pudding?",
      answer:
        "Variations include adding nuts such as cashews or almonds for crunch, mixing in raisins or dried fruits for sweetness, or topping with caramel sauce or toasted coconut flakes. Some recipes incorporate spices like nutmeg or star anise for additional aroma. You can also adjust sweetness by varying the amount of sugar or condensed milk.",
    },
    {
      question: "Is this dessert gluten-free and suitable for vegans?",
      answer:
        "This dessert is naturally gluten-free as it uses hominy corn and no wheat-based ingredients. To make it vegan, substitute whole milk and condensed milk with plant-based alternatives such as almond milk and coconut condensed milk. Ensure that any added ingredients like butter are replaced with vegan-friendly options.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const recipeJsonLd = getRecipeSchema({
    name: title,
    description: description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT1H30M",
    totalTime: "PT1H50M",
    recipeYield: "4 servings",
    recipeCategory: "Dessert",
    recipeCuisine: "Brazilian",
    keywords: "canjica, sweet corn pudding, coconut pudding, brazilian dessert, festa junina",
    recipeIngredient: ingredients.map(ing => `${ing.baseAmount}${ing.unit} ${ing.name}`),
    recipeInstructions: [
      "Rinse the hominy corn thoroughly and soak it in plenty of water overnight (8-12 hours) to soften the kernels.",
      "Drain the soaked corn and place it in a large pot. Cover with fresh water and bring to a boil. Reduce heat and simmer for about 1 hour or until tender. Drain.",
      "In the same pot, combine whole milk, coconut milk, sugar, condensed milk, cinnamon sticks, cloves, and salt. Heat gently until sugar dissolves.",
      "Add the cooked hominy corn to the milk mixture. Simmer on low heat, stirring occasionally, for 30-40 minutes until thickened.",
      "Remove cinnamon sticks and cloves. Stir in vanilla extract, butter, and grated coconut. Serve warm or chilled, garnished with toasted coconut flakes."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Sweet Corn and Coconut Pudding"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 1h 30m
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
            Sweet Corn and Coconut Pudding, known as Canjica in Brazil, is a
            comforting and creamy dessert made from hominy corn slowly cooked
            with coconut milk, whole milk, sugar, and aromatic spices like
            cinnamon and cloves. This pudding is beloved for its rich texture,
            subtle sweetness, and the warm, inviting flavors that evoke
            traditional Brazilian festivities and family gatherings.
          </p>
          <p>
            The origins of Canjica trace back to indigenous Brazilian cuisine,
            where hominy corn was a staple ingredient. Over time, influences
            from Portuguese colonizers introduced dairy and sugar, evolving the
            dish into the luscious pudding enjoyed today. Traditionally served
            during Festa Junina (June Festivals), Canjica celebrates the
            harvest season and Brazilian cultural heritage with every creamy
            spoonful.
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
              Soak the Hominy Corn
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the hominy corn thoroughly and soak it in plenty of water
              overnight (8-12 hours) to soften the kernels and reduce cooking
              time.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Corn
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Drain the soaked corn and place it in a large pot. Cover with
              fresh water and bring to a boil. Reduce heat and simmer for about
              1 hour or until the kernels are tender but still hold their shape.
              Drain and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Pudding Base
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In the same pot, combine whole milk, coconut milk, sugar,
              condensed milk, cinnamon sticks, cloves, and salt. Heat gently
              until sugar dissolves and the mixture is warm.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Combine and Simmer
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the cooked hominy corn to the milk mixture. Stir well and
              simmer on low heat, stirring occasionally, for 30-40 minutes until
              the pudding thickens and the flavors meld.
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
              Remove cinnamon sticks and cloves. Stir in vanilla extract,
              butter, and grated coconut. Serve warm or chilled, garnished with
              toasted coconut flakes.
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
            Soaking the hominy corn overnight is essential for tender kernels
            and shorter cooking time.
          </li>
          <li>
            Stir the pudding frequently during simmering to prevent sticking
            and ensure even cooking.
          </li>
          <li>
            Use full-fat coconut milk for the creamiest texture and richest
            flavor.
          </li>
          <li>
            Toast coconut flakes in a dry pan until golden for a crunchy,
            aromatic garnish.
          </li>
          <li>
            Adjust sweetness by varying the amount of sugar and condensed milk
            to your preference.
          </li>
          <li>
            For a vegan version, substitute dairy milk and butter with plant-based
            alternatives.
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
              href="https://en.wikipedia.org/wiki/Canjica"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Canjica (Brazilian Hominy Corn Pudding)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.tasteatlas.com/canjica"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              TasteAtlas: Canjica Traditional Recipe
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
      jsonLd={[faqJsonLd, recipeJsonLd]}
      hideLegalDisclaimer={true}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}