import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function FarofaWithBaconCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Farofa%20with%20Bacon%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7778"
  );

  // --- DATA ---
  const title = "Farofa with Bacon";
  const description = "Smoky manioc flour crumble enriched with crispy bacon bits.";

  // INGREDIENTS
  const ingredients = [
    { name: "Manioc flour (farinha de mandioca)", baseAmount: 500, unit: "g" },
    { name: "Bacon, diced", baseAmount: 200, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Butter", baseAmount: 3, unit: "tbsp" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper, freshly ground", baseAmount: 0.5, unit: "tsp" },
    { name: "Parsley, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Green onions (scallions), chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Hard-boiled eggs, chopped (optional)", baseAmount: 2, unit: "eggs" },
    { name: "Red bell pepper, finely diced (optional)", baseAmount: 0.5, unit: "medium" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "350",
    protein: "12g",
    carbs: "30g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is farofa and why is it popular in Brazilian cuisine?",
      answer:
        "Farofa is a traditional Brazilian side dish made primarily from toasted manioc flour. It is beloved for its crunchy texture and ability to complement a variety of main dishes, especially grilled meats and stews. Its versatility and rich flavor make it a staple at many Brazilian meals and celebrations.",
    },
    {
      question: "Can I make farofa without bacon for a vegetarian option?",
      answer:
        "Absolutely! You can omit the bacon and instead use ingredients like sautéed mushrooms, nuts, or smoked paprika to add depth and smokiness. Butter or olive oil can be used to toast the manioc flour, and herbs like parsley and green onions will enhance the flavor.",
    },
    {
      question: "How do I store leftover farofa to keep it fresh and crunchy?",
      answer:
        "Store leftover farofa in an airtight container at room temperature for up to 2 days. To maintain its crunchiness, avoid refrigeration as moisture can make it soggy. If it softens, you can re-toast it gently in a dry skillet before serving.",
    },
    {
      question: "What are some traditional dishes to serve with farofa?",
      answer:
        "Farofa pairs wonderfully with Brazilian barbecue (churrasco), feijoada (black bean stew), roasted chicken, and grilled fish. It also complements rice and beans, adding texture and flavor contrast to these hearty dishes.",
    },
    {
      question: "Can I prepare farofa in advance for a party or gathering?",
      answer:
        "Yes, farofa can be prepared a day ahead. Toast the manioc flour and cook the bacon and aromatics, then combine and cool completely. Store in an airtight container. Before serving, you can warm it slightly in a skillet to refresh the flavors and texture.",
    },
    {
      question: "What is the difference between toasted manioc flour and regular flour?",
      answer:
        "Toasted manioc flour, also known as farinha de mandioca, is made from cassava root that has been peeled, grated, fermented, dried, and toasted. It has a coarse texture and nutty flavor, distinct from regular wheat flour, and is gluten-free. It’s essential for authentic farofa.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT10M",
    totalTime: "PT30M",
    recipeYield: `${servings} portions`,
    recipeCategory: "Side Dish",
    recipeCuisine: "Brazilian",
    keywords: "farofa com bacon, manioc flour with bacon, brazilian farofa, smoky side dish, traditional recipe, crunchy side",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Dice bacon and finely chop onion, garlic, and herbs.",
      "Sauté bacon in olive oil until crispy, then add butter, onions, and garlic until fragrant.",
      "Gradually add manioc flour, stirring constantly over medium-low heat.",
      "Toast for 5-8 minutes until golden and fragrant.",
      "Season with salt and pepper, then stir in fresh herbs and optional ingredients; serve warm."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Farofa with Bacon"
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
            Farofa with Bacon is a quintessential Brazilian side dish that combines the
            nutty crunch of toasted manioc flour with the smoky, savory richness of
            crispy bacon. This dish is a beloved accompaniment to grilled meats,
            stews, and feijoada, offering a delightful texture contrast and a burst of
            flavor that elevates any meal.
          </p>
          <p>
            Originating from indigenous Brazilian culinary traditions, farofa has evolved
            over centuries, incorporating influences from Portuguese and African
            cuisines. The addition of bacon and aromatics like onions and garlic
            reflects the fusion of flavors that characterize Brazilian cooking. Today,
            farofa remains a staple at family gatherings and festive occasions,
            celebrated for its simplicity and versatility.
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
              Prepare the Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Dice the bacon into small pieces. Finely chop the onion, garlic, parsley,
              and green onions. If using, chop the hard-boiled eggs and red bell pepper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Bacon and Aromatics
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large skillet, heat the olive oil over medium heat. Add the diced
              bacon and cook until crispy and golden, about 5-7 minutes. Remove some
              excess fat if desired. Add the butter, then sauté the onions and garlic
              until translucent and fragrant, about 3-4 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Toast the Manioc Flour
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Lower the heat to medium-low and gradually add the manioc flour to the
              skillet, stirring constantly to evenly toast it. Continue toasting for
              about 5-8 minutes until the flour is golden and fragrant, being careful
              not to burn it.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season and Add Fresh Herbs
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Season the farofa with salt and freshly ground black pepper to taste.
              Stir in the chopped parsley, green onions, and optional red bell pepper
              and hard-boiled eggs. Mix well to combine all flavors evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve Warm
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the farofa to a serving dish and serve warm alongside your
              favorite Brazilian dishes such as churrasco, feijoada, or roasted meats.
              Enjoy the crunchy, smoky, and savory flavors!
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
            Use a mix of butter and olive oil for toasting the manioc flour to achieve
            a richer flavor and perfect texture.
          </li>
          <li>
            Toast the manioc flour slowly over medium-low heat and stir constantly to
            avoid burning and ensure even browning.
          </li>
          <li>
            For extra smokiness, try adding a pinch of smoked paprika or a dash of
            liquid smoke if you prefer less bacon.
          </li>
          <li>
            Adding chopped hard-boiled eggs is traditional in some regions and adds a
            creamy texture contrast to the crunchy farofa.
          </li>
          <li>
            Customize your farofa by mixing in nuts like cashews or raisins for a
            unique twist.
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
              href="https://en.wikipedia.org/wiki/Farofa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Farofa
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.brazilianfoodie.com/recipes/farofa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Brazilian Foodie: Farofa Recipe & History
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