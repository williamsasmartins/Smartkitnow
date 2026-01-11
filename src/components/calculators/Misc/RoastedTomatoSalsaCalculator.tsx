import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RoastedTomatoSalsaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Roasted%20Tomato%20Salsa%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9607"
  );

  // --- DATA ---
  const title = "Roasted Tomato Salsa";
  const description = "Salsa de tomate assado com sabor defumado e mais profundo.";

  // INGREDIENTS
  const ingredients = [
    { name: "Ripe Roma Tomatoes", baseAmount: 500, unit: "g" },
    { name: "Red Onion", baseAmount: 100, unit: "g" },
    { name: "Jalapeño Pepper", baseAmount: 1, unit: "piece" },
    { name: "Garlic Cloves", baseAmount: 3, unit: "cloves" },
    { name: "Fresh Cilantro", baseAmount: 15, unit: "g" },
    { name: "Lime Juice", baseAmount: 30, unit: "ml" },
    { name: "Olive Oil", baseAmount: 15, unit: "ml" },
    { name: "Ground Cumin", baseAmount: 1, unit: "tsp" },
    { name: "Smoked Paprika", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Sugar", baseAmount: 0.5, unit: "tsp" },
    { name: "Water (optional)", baseAmount: 30, unit: "ml" },
  ];

  // Nutrition estimates per 4 servings
  const nutrition = {
    calories: "110",
    protein: "2g",
    carbs: "15g",
    fat: "5g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use other types of tomatoes for this salsa?",
      answer:
        "Absolutely! While Roma tomatoes are preferred for their firm texture and low moisture, you can use vine-ripened or heirloom tomatoes. Just be mindful that juicier tomatoes may require draining excess liquid or adjusting cooking times to avoid a watery salsa.",
    },
    {
      question: "How do I adjust the heat level of the salsa?",
      answer:
        "The heat primarily comes from the jalapeño pepper. To reduce spiciness, remove the seeds and membranes before roasting. For more heat, add extra jalapeños or include hotter peppers like serranos. Remember to taste as you go to achieve your preferred spice level.",
    },
    {
      question: "Can I prepare this salsa ahead of time?",
      answer:
        "Yes, roasted tomato salsa actually benefits from resting. Prepare it a few hours or even a day ahead and refrigerate. This allows the flavors to meld and deepen. Just bring it to room temperature before serving for the best taste.",
    },
    {
      question: "What are some good dishes to serve with roasted tomato salsa?",
      answer:
        "This salsa pairs wonderfully with grilled meats, tacos, quesadillas, roasted vegetables, or simply as a dip with tortilla chips. Its smoky and vibrant flavor enhances many Mexican and Southwestern dishes.",
    },
    {
      question: "How should I store leftover salsa?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 5 days. For longer storage, you can freeze the salsa in a freezer-safe container for up to 3 months. Thaw in the fridge and stir well before serving.",
    },
    {
      question: "Can I roast the ingredients on a grill instead of the oven?",
      answer:
        "Definitely! Grilling the tomatoes, peppers, and onions adds an extra smoky flavor that complements the salsa beautifully. Just turn them occasionally to get even charring and roasting.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Roasted Tomato Salsa"
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
            Roasted Tomato Salsa is a vibrant and smoky condiment that elevates
            any dish with its deep, rich flavors. By roasting fresh tomatoes,
            peppers, and aromatics, this salsa develops a complex, slightly
            charred taste that balances heat, acidity, and sweetness perfectly.
            It’s a versatile recipe that can be used as a dip, topping, or
            sauce.
          </p>
          <p>
            The origins of roasted tomato salsa trace back to traditional Mexican
            cuisine, where fire-roasting ingredients over open flames or hot
            comals imparts a signature smoky flavor. This technique has been
            passed down through generations and adapted worldwide, becoming a
            beloved staple in many kitchens for its bold and authentic taste.
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
              Prepare the Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Wash the Roma tomatoes, jalapeño, and cilantro thoroughly. Peel the
              red onion and garlic cloves. Cut the tomatoes in halves or quarters
              depending on size, and slice the onion into thick wedges.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Roast the Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 220°C (425°F). Arrange tomatoes, onion wedges,
              jalapeño, and garlic cloves on a baking sheet lined with parchment
              paper. Roast for 15-20 minutes until the skins are blistered and
              slightly charred, turning once halfway through.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Blend the Salsa
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Once roasted and cooled slightly, peel the skins off the garlic and
              jalapeño if desired (for less heat). Add all roasted ingredients to a
              blender or food processor along with fresh cilantro, lime juice,
              olive oil, cumin, smoked paprika, salt, pepper, and sugar. Blend to
              your preferred consistency, adding water if needed to thin.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Adjust and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Taste the salsa and adjust seasoning as needed. Transfer to a bowl
              and refrigerate for at least 30 minutes to let flavors meld. Serve
              chilled or at room temperature with your favorite dishes.
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
            For a deeper smoky flavor, char the tomatoes and peppers directly on
            a gas flame or grill before roasting.
          </li>
          <li>
            Remove seeds from the jalapeño to reduce heat without losing flavor.
          </li>
          <li>
            Use fresh lime juice instead of bottled for the brightest acidity.
          </li>
          <li>
            If you prefer chunkier salsa, pulse the blender instead of pureeing
            completely.
          </li>
          <li>
            Add a splash of apple cider vinegar for an extra tangy kick.
          </li>
          <li>
            Store leftovers in a glass jar to maintain freshness and flavor.
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
              href="https://en.wikipedia.org/wiki/Salsa_(sauce)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Salsa (Sauce)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/roasted-tomato-salsa-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Roasted Tomato Salsa Recipe
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