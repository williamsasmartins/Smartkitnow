import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ToastedCassavaFlourFarofaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Toasted%20Cassava%20Flour%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1824"
  );

  // --- DATA ---
  const title = "Toasted Cassava Flour";
  const description = "Savory manioc flour crumble with various seasonings.";

  // INGREDIENTS
  const ingredients = [
    { name: "Toasted Cassava Flour (Farofa)", baseAmount: 500, unit: "g" },
    { name: "Unsalted Butter", baseAmount: 60, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Bacon, diced", baseAmount: 100, unit: "g" },
    { name: "Fresh Parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Green Onions, chopped", baseAmount: 30, unit: "g" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper, freshly ground", baseAmount: 0.5, unit: "tsp" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "wedges" },
    { name: "Olive Oil (optional)", baseAmount: 1, unit: "tbsp" },
    { name: "Dried Red Chili Flakes (optional)", baseAmount: 0.25, unit: "tsp" },
    { name: "Roasted Cashews, chopped (optional)", baseAmount: 50, unit: "g" },
    { name: "Grated Parmesan Cheese (optional)", baseAmount: 30, unit: "g" },
  ];

  // Approximate nutrition per 4 servings (values are estimates)
  const nutrition = {
    calories: "450",
    protein: "8g",
    carbs: "45g",
    fat: "25g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is toasted cassava flour farofa?",
      answer:
        "Toasted cassava flour farofa is a traditional Brazilian side dish made by toasting manioc (cassava) flour with butter, onions, garlic, and various seasonings. It has a crumbly texture and is often served alongside grilled meats, stews, and rice dishes to add flavor and texture.",
    },
    {
      question: "Can I make farofa without bacon or butter?",
      answer:
        "Yes, farofa can be made vegetarian or vegan by omitting bacon and substituting butter with olive oil or vegan margarine. The flavor will be slightly different but still delicious. You can also add nuts or mushrooms for extra texture and umami.",
    },
    {
      question: "How do I store leftover farofa?",
      answer:
        "Store leftover farofa in an airtight container at room temperature for up to 2 days. For longer storage, refrigerate it for up to 5 days. Reheat gently in a skillet to restore its toasted texture before serving.",
    },
    {
      question: "What dishes pair well with toasted cassava flour farofa?",
      answer:
        "Farofa pairs excellently with Brazilian barbecue (churrasco), feijoada (black bean stew), grilled fish, roasted chicken, and rice dishes. It adds a crunchy, savory element that complements rich and hearty meals.",
    },
    {
      question: "Is cassava flour gluten-free?",
      answer:
        "Yes, cassava flour is naturally gluten-free, making farofa a great side dish option for those with gluten intolerance or celiac disease. However, always check packaging to ensure no cross-contamination.",
    },
    {
      question: "Can I use pre-toasted cassava flour?",
      answer:
        "Yes, pre-toasted cassava flour can be used to save time. However, toasting it yourself with butter and aromatics enhances the flavor and texture significantly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
            Toasted cassava flour farofa is a beloved Brazilian side dish known for its
            crunchy texture and rich, savory flavor. Made primarily from toasted manioc
            flour, it is enhanced with butter, onions, garlic, and often bacon or nuts,
            creating a versatile accompaniment that complements a wide range of dishes.
            Farofa is a staple at Brazilian barbecues and festive meals, adding a
            delightful contrast to meats, stews, and rice.
          </p>
          <p>
            The origins of farofa trace back to indigenous Brazilian cuisine, where
            manioc (cassava) was a fundamental crop. Over centuries, the dish evolved
            with influences from Portuguese and African culinary traditions, incorporating
            ingredients like bacon and butter. Today, farofa remains a cultural icon,
            celebrated for its simplicity, flavor, and ability to bring people together
            around the table.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Finely chop the onion, mince the garlic, dice the bacon, and chop the fresh
              parsley and green onions. Set aside all ingredients for easy access during cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook Bacon and Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large skillet over medium heat, melt the butter. Add the diced bacon and cook
              until crispy, about 5 minutes. Add the chopped onion and garlic, sautéing until
              translucent and fragrant, about 3-4 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Toast the Cassava Flour</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Lower the heat to medium-low and gradually add the toasted cassava flour to the skillet,
              stirring constantly to evenly coat the flour with the butter and aromatics. Toast for
              about 5-7 minutes until the flour is golden and fragrant.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Season and Finish</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the chopped parsley, green onions, salt, and black pepper. Optionally, add
              chili flakes, roasted cashews, or grated Parmesan cheese for extra flavor. Mix well
              and remove from heat.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the farofa to a serving dish and garnish with lime wedges. Serve warm as a
              side dish to grilled meats, stews, or rice dishes.
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
            Use fresh toasted cassava flour for the best texture and flavor. If unavailable,
            pre-toasted flour works but toast it lightly in a dry pan before cooking.
          </li>
          <li>
            Adjust the amount of butter and bacon to your preference for a richer or lighter
            farofa.
          </li>
          <li>
            Adding nuts like cashews or Brazil nuts adds a delightful crunch and depth of flavor.
          </li>
          <li>
            For a vegetarian version, omit bacon and use olive oil or vegan butter instead.
          </li>
          <li>
            Toast the flour slowly on medium-low heat to avoid burning and to develop a
            nutty aroma.
          </li>
          <li>
            Serve with a squeeze of fresh lime juice to brighten the flavors and balance the richness.
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
              Brazil.org.za: Brazilian Food Guide
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