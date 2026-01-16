import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CoconutCandyCocadaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Coconut%20Candy%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6909"
  );

  // --- DATA ---
  const title = "Coconut Candy";
  const description = "Traditional chewy sweet made with fresh shredded coconut.";

  // INGREDIENTS
  const ingredients = [
    { name: "Fresh Shredded Coconut", baseAmount: 500, unit: "g" },
    { name: "Granulated Sugar", baseAmount: 400, unit: "g" },
    { name: "Sweetened Condensed Milk", baseAmount: 200, unit: "ml" },
    { name: "Water", baseAmount: 100, unit: "ml" },
    { name: "Butter", baseAmount: 50, unit: "g" },
    { name: "Vanilla Extract", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 0.25, unit: "tsp" },
    { name: "Lime Juice", baseAmount: 1, unit: "tbsp" },
    { name: "Powdered Sugar (for dusting)", baseAmount: 20, unit: "g" },
    { name: "Cornstarch (optional, for dusting)", baseAmount: 10, unit: "g" },
    { name: "Coconut Flakes (optional, for garnish)", baseAmount: 30, unit: "g" },
    { name: "Almonds or Peanuts (optional, chopped)", baseAmount: 50, unit: "g" },
    { name: "Cinnamon Powder (optional)", baseAmount: 0.5, unit: "tsp" },
    { name: "Brown Sugar (optional, for deeper flavor)", baseAmount: 100, unit: "g" },
  ];

  // Nutrition estimates per 4 servings (approximate)
  const nutrition = {
    calories: "450",
    protein: "3g",
    carbs: "65g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of coconut is best for making Coconut Candy?",
      answer:
        "Freshly shredded mature coconut is ideal for making Coconut Candy (Cocada) because it provides the best texture and natural sweetness. If fresh coconut is unavailable, unsweetened frozen shredded coconut can be used, but avoid sweetened varieties to control sugar levels.",
    },
    {
      question: "How do I prevent the candy from sticking to the pan?",
      answer:
        "To prevent sticking, use a non-stick pan or a well-seasoned heavy-bottomed pan. Adding butter during cooking helps create a smooth texture and reduces sticking. Also, stirring continuously and cooking on medium heat prevents burning and sticking.",
    },
    {
      question: "Can I store Coconut Candy for later consumption?",
      answer:
        "Yes, Coconut Candy can be stored in an airtight container at room temperature for up to one week. For longer storage, refrigerate it for up to two weeks. Before serving, bring it to room temperature for the best texture and flavor.",
    },
    {
      question: "How can I make Coconut Candy vegan?",
      answer:
        "To make a vegan version, substitute sweetened condensed milk with coconut condensed milk or a homemade vegan condensed milk alternative. Use plant-based butter or coconut oil instead of dairy butter. This will maintain the creamy texture while keeping it vegan-friendly.",
    },
    {
      question: "What variations can I try with this recipe?",
      answer:
        "You can add chopped nuts like almonds or peanuts for crunch, sprinkle cinnamon or nutmeg for warmth, or incorporate lime zest for a citrusy twist. Some variations include adding brown sugar for a richer flavor or using coconut flakes as garnish to enhance presentation.",
    },
    {
      question: "Why is lime juice added to the recipe?",
      answer:
        "Lime juice acts as a natural acid that helps balance the sweetness and enhances the overall flavor. It also helps prevent crystallization of sugar during cooking, ensuring a smooth and chewy texture in the final candy.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Coconut Candy"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Coconut Candy, also known as Cocada in many Latin American countries, is a beloved traditional sweet treat made primarily from fresh shredded coconut, sugar, and condensed milk. This chewy, rich candy is cherished for its natural coconut flavor and delightful texture, making it a popular dessert and snack across tropical regions. The recipe is simple yet rewarding, perfect for those who appreciate authentic, handcrafted sweets.
          </p>
          <p>
            The origins of Coconut Candy trace back to the coastal regions of Latin America, where coconuts are abundant. It is believed to have been influenced by indigenous cooking techniques combined with European sugar confectionery traditions. Over time, Cocada has evolved into many regional variations, each adding unique ingredients or flavors, but the core essence remains the luscious coconut sweetness that defines this candy.
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
              Measure out all ingredients according to the number of servings desired. Freshly shred the coconut if using fresh coconut. Have your sugar, condensed milk, butter, vanilla extract, salt, and lime juice ready.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Sugar Syrup</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a heavy-bottomed pan, combine granulated sugar and water. Heat over medium heat, stirring gently until sugar dissolves completely. Bring to a gentle boil and cook until the syrup reaches a soft-ball stage (about 115°C/240°F).
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Coconut and Condensed Milk</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Lower the heat and stir in the shredded coconut, sweetened condensed milk, butter, vanilla extract, salt, and lime juice. Stir continuously to combine all ingredients evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook Until Thickened</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Continue cooking over low heat, stirring constantly to prevent burning. The mixture will thicken and start to pull away from the sides of the pan, forming a sticky, fudge-like consistency. This usually takes about 8-10 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Shape the Candy</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove from heat and let the mixture cool slightly. While still warm, spoon the candy onto a parchment-lined tray or mold into small squares or balls. Optionally, dust with powdered sugar or cornstarch to prevent sticking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cool and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Allow the candy to cool completely at room temperature until firm. Store in an airtight container. Serve as a delightful sweet snack or dessert.
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
            Use a candy thermometer to monitor the sugar syrup temperature precisely for perfect texture.
          </li>
          <li>
            Stir constantly during cooking to avoid burning and ensure even caramelization.
          </li>
          <li>
            If the candy is too sticky after cooling, dust with a mixture of powdered sugar and cornstarch.
          </li>
          <li>
            Experiment with adding toasted nuts or a pinch of cinnamon for added flavor complexity.
          </li>
          <li>
            For a glossy finish, brush the shaped candies lightly with melted butter before cooling.
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
              href="https://en.wikipedia.org/wiki/Cocada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Cocada (Coconut Candy)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/cocada-coconut-candy-recipe-3029334"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Cocada Recipe
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