import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function SugarcaneMolassesCandyRapaduraCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Sugarcane%20Molasses%20Candy%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6339"
  );

  // --- DATA ---
  const title = "Sugarcane Molasses Candy";
  const description = "Unrefined whole cane sugar brick, a Northeast staple.";

  // INGREDIENTS
  const ingredients = [
    { name: "Fresh Sugarcane Juice", baseAmount: 1000, unit: "ml" },
    { name: "Lime Juice (freshly squeezed)", baseAmount: 15, unit: "ml" },
    { name: "Water", baseAmount: 100, unit: "ml" },
    { name: "Optional: Ground Cinnamon", baseAmount: 2, unit: "g" },
    { name: "Optional: Clove Powder", baseAmount: 1, unit: "g" },
    { name: "Optional: Nutmeg Powder", baseAmount: 1, unit: "g" },
    { name: "Optional: Vanilla Extract", baseAmount: 5, unit: "ml" },
    { name: "Butter (for greasing molds)", baseAmount: 10, unit: "g" },
    { name: "Optional: Chopped Nuts (cashews or peanuts)", baseAmount: 30, unit: "g" },
    { name: "Optional: Cardamom Powder", baseAmount: 1, unit: "g" },
    { name: "Optional: Salt (a pinch)", baseAmount: 0.5, unit: "g" },
  ];

  // Nutritional info per 100g approx (values for rapadura candy)
  const nutrition = {
    calories: "380",
    protein: "0.5g",
    carbs: "95g",
    fat: "0.1g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Sugarcane Molasses Candy (Rapadura)?",
      answer:
        "Sugarcane Molasses Candy, also known as Rapadura, is an unrefined whole cane sugar product made by boiling fresh sugarcane juice until it solidifies into a dense, rich, and flavorful block or candy. It retains the natural molasses and nutrients, giving it a deep caramel flavor and a slightly grainy texture.",
    },
    {
      question: "How do I know when the sugarcane juice is cooked enough?",
      answer:
        "The sugarcane juice is cooked until it thickens and reaches a soft ball stage (about 115°C or 240°F). At this point, a small amount dropped into cold water will form a soft, pliable ball. This ensures the candy will harden properly but remain slightly chewy.",
    },
    {
      question: "Can I add spices or nuts to the candy?",
      answer:
        "Yes, adding ground spices like cinnamon, clove, nutmeg, or cardamom enhances the flavor complexity. Chopped nuts such as cashews or peanuts can add texture and richness. These are usually added near the end of cooking or mixed into the mold before setting.",
    },
    {
      question: "How should I store Sugarcane Molasses Candy?",
      answer:
        "Store the candy in an airtight container at room temperature, away from moisture and direct sunlight. Properly stored, it can last for several months. Avoid refrigeration as it may cause condensation and affect texture.",
    },
    {
      question: "Is Sugarcane Molasses Candy healthier than regular sugar?",
      answer:
        "Rapadura retains more minerals and vitamins compared to refined white sugar because it is less processed. However, it is still a form of sugar and should be consumed in moderation as part of a balanced diet.",
    },
    {
      question: "Can I make Sugarcane Molasses Candy without fresh sugarcane juice?",
      answer:
        "Fresh sugarcane juice is ideal for authentic flavor and texture. However, some use concentrated cane syrup or molasses as a substitute, though the final product may differ in taste and consistency.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description: description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT1H",
    totalTime: "PT1H20M",
    recipeYield: `${servings} portions`,
    recipeCategory: "Dessert",
    recipeCuisine: "Brazilian",
    keywords: "rapadura, sugarcane molasses candy, traditional brazilian sweet, unrefined sugar, northeast brazil",
    recipeIngredient: ingredients.map(ing => `${getAmount(ing.baseAmount)}${ing.unit} ${ing.name}`),
    recipeInstructions: [
      "Strain fresh sugarcane juice and add lime juice to clarify.",
      "Boil juice in a wide pan, skimming off foam.",
      "Simmer for 45-60 minutes until it reaches 115°C (soft ball stage).",
      "Stir in optional spices/nuts and pour into buttered molds.",
      "Cool at room temperature for several hours until set. Unmold and serve."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Sugarcane Molasses Candy"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 1h
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Sugarcane Molasses Candy, commonly known as Rapadura, is a traditional
            sweetener made by boiling fresh sugarcane juice until it solidifies into a
            dense, flavorful block. This unrefined whole cane sugar retains the natural
            molasses and nutrients, offering a rich caramel flavor with hints of earthiness
            and complexity. Popular in Northeast Brazil and other tropical regions, Rapadura
            is cherished both as a sweet treat and a natural sweetener in cooking and baking.
          </p>
          <p>
            Historically, Rapadura has been produced by small-scale farmers and artisans
            using traditional methods that date back centuries. The process involves
            extracting juice from freshly crushed sugarcane, clarifying it with lime juice,
            and then slowly boiling it down to concentrate the sugars. Once thickened,
            the syrup is poured into molds to cool and harden. This candy not only serves
            as a delicious sweetener but also preserves the cultural heritage of sugarcane
            cultivation and artisanal craftsmanship.
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
              Extract and Prepare Sugarcane Juice
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Crush fresh sugarcane stalks to extract about 1000ml of juice per 4 servings.
              Strain the juice through a fine sieve or cheesecloth to remove fibers and impurities.
              Add the lime juice and water to the strained juice to help clarify it during cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Boil and Clarify the Juice
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the juice mixture into a wide, heavy-bottomed pan and bring to a boil over medium heat.
              Skim off any foam or scum that rises to the surface to keep the syrup clear.
              Reduce heat to low and simmer gently, stirring occasionally to prevent burning.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Concentrate the Syrup
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Continue simmering the juice for about 45-60 minutes until it thickens and reaches
              the soft ball stage (115°C / 240°F). To test, drop a small amount into cold water;
              it should form a soft, pliable ball.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Flavorings and Pour into Molds
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove from heat and stir in optional spices like cinnamon, clove, nutmeg,
              vanilla extract, or chopped nuts if desired. Grease molds or a shallow tray
              with butter and pour the hot syrup in evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cool and Set
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Allow the syrup to cool and harden at room temperature for several hours or overnight.
              Once set, unmold and cut into desired shapes. Store in an airtight container.
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
            Use a heavy-bottomed pan to ensure even heat distribution and prevent scorching
            of the sugarcane juice.
          </li>
          <li>
            Constantly skim off impurities during boiling to keep the syrup clear and improve
            the final candy's texture.
          </li>
          <li>
            Test the syrup's readiness frequently using the cold water test to avoid overcooking,
            which can make the candy too hard or brittle.
          </li>
          <li>
            Adding a small amount of lime juice helps clarify the juice and prevents crystallization.
          </li>
          <li>
            For a richer flavor, experiment with adding spices like cinnamon or vanilla, but keep
            them subtle to let the natural molasses shine.
          </li>
          <li>
            Store the candy in a cool, dry place in an airtight container to maintain freshness and
            prevent moisture absorption.
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
              href="https://en.wikipedia.org/wiki/Rapadura"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Rapadura
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/sugarcane"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Sugarcane
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.fao.org/3/y4351e/y4351e05.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              FAO: Sugarcane Processing and Products
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