import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function SidesFarofaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Toasted%20Cassava%20Flour%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4572"
  );

  // --- DATA ---
  const title = "Toasted Cassava Flour";
  const description = "Crunchy side dish that adds texture to beans and meats.";

  // INGREDIENTS
  const ingredients = [
    { name: "Cassava flour", baseAmount: 250, unit: "g" },
    { name: "Butter or olive oil", baseAmount: 50, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 100, unit: "g" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "pcs" },
    { name: "Bacon, diced", baseAmount: 100, unit: "g" },
    { name: "Green onions, chopped", baseAmount: 50, unit: "g" },
    { name: "Parsley, chopped", baseAmount: 30, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Dried chili flakes (optional)", baseAmount: 0.25, unit: "tsp" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "pcs" },
    { name: "Olive oil (extra for drizzling)", baseAmount: 10, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "220",
    protein: "4g",
    carbs: "20g",
    fat: "14g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is toasted cassava flour (farofa)?",
      answer:
        "Toasted cassava flour, commonly known as farofa, is a traditional Brazilian side dish made by toasting cassava flour with ingredients like butter, onions, and bacon. It provides a crunchy texture and nutty flavor that complements beans, meats, and stews.",
    },
    {
      question: "Can I make farofa gluten-free?",
      answer:
        "Yes! Cassava flour is naturally gluten-free, making farofa an excellent gluten-free side dish option. Just ensure that any added ingredients, such as bacon or seasonings, are also gluten-free.",
    },
    {
      question: "How do I store leftover farofa?",
      answer:
        "Store leftover farofa in an airtight container at room temperature for up to 2 days. For longer storage, keep it refrigerated for up to 5 days. Reheat gently in a skillet to restore its crispiness before serving.",
    },
    {
      question: "Can I customize the ingredients in farofa?",
      answer:
        "Absolutely! Farofa is very versatile. You can add nuts, dried fruits, herbs, or substitute bacon with sausage or mushrooms for different flavors. Adjust seasonings to your taste preferences.",
    },
    {
      question: "What dishes pair well with toasted cassava flour?",
      answer:
        "Farofa pairs wonderfully with Brazilian feijoada (black bean stew), grilled meats, roasted chicken, and barbecues. It adds a delightful crunch and absorbs sauces beautifully.",
    },
    {
      question: "Is farofa served hot or cold?",
      answer:
        "Farofa is typically served warm or at room temperature. Toasting the cassava flour just before serving ensures it remains crunchy and flavorful.",
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
    keywords: "farofa, toasted cassava flour, brazilian side dish, crunchy side, bacon farofa, traditional recipe",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Finely chop onion, garlic, parsley, and dice bacon.",
      "Sauté bacon in butter or oil until crispy, then add onion and garlic until fragrant.",
      "Gradually add cassava flour, stirring constantly over medium-low heat.",
      "Toast for 8-10 minutes until golden brown and nutty.",
      "Stir in green onions, parsley, and seasonings; serve with lime."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Toasted Cassava Flour"
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
            Toasted cassava flour, or farofa, is a beloved Brazilian side dish
            known for its crunchy texture and rich, nutty flavor. Made by
            toasting cassava flour with butter, onions, garlic, and often bacon,
            it adds a delightful contrast to hearty dishes like beans, stews,
            and grilled meats. This recipe captures the authentic taste and
            versatility of farofa, perfect for enhancing your meals with a
            traditional Brazilian touch.
          </p>
          <p>
            The origins of farofa trace back to indigenous Brazilian cuisine,
            where cassava (also called manioc or yuca) was a staple food. Over
            centuries, the dish evolved with influences from Portuguese and
            African culinary traditions, becoming a ubiquitous accompaniment in
            Brazilian households and churrascarias (barbecue restaurants).
            Today, farofa is enjoyed across Brazil in countless variations,
            each reflecting regional tastes and ingredients.
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
              Prepare Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Finely chop the onion, garlic, green onions, and parsley. Dice the
              bacon into small pieces. Measure out the cassava flour and other
              ingredients.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook Bacon and Aromatics
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large skillet over medium heat, melt the butter or heat olive
              oil. Add the diced bacon and cook until crispy. Add the chopped
              onion and garlic, sautéing until translucent and fragrant.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Toast Cassava Flour
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Lower the heat to medium-low and gradually add the cassava flour,
              stirring constantly to toast it evenly. Continue toasting until the
              flour turns golden brown and emits a nutty aroma, about 8-10 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season and Finish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the chopped green onions, parsley, salt, black pepper, and
              chili flakes if using. Adjust seasoning to taste. Drizzle with a bit
              of olive oil for extra richness if desired.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the farofa to a serving dish and offer lime wedges on the
              side for squeezing over. Serve warm alongside beans, grilled meats,
              or your favorite Brazilian dishes.
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
            Use fresh cassava flour for the best flavor and texture. Pre-packaged
            flour can sometimes be stale.
          </li>
          <li>
            Stir constantly while toasting the flour to prevent burning and ensure
            even color.
          </li>
          <li>
            For a vegetarian version, omit the bacon and add chopped nuts or
            sautéed mushrooms for umami.
          </li>
          <li>
            Adjust the amount of butter or oil to your preference for richness and
            moisture.
          </li>
          <li>
            Farofa can be made ahead and reheated gently in a dry skillet to
            restore crispness.
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
              href="https://www.brazil.org.za/brazilian-food.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Brazil.org.za: Brazilian Food Overview
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