import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CoconutTrufflesBeijinhoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Coconut%20Truffles%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5372"
  );

  // --- DATA ---
  const title = "Coconut Truffles";
  const description = `"Little kiss" coconut truffles rolled in crystal sugar, a beloved Brazilian sweet treat known as Beijinho. These luscious truffles combine creamy condensed milk with shredded coconut for a melt-in-your-mouth experience perfect for celebrations or everyday indulgence.`;

  // INGREDIENTS
  const ingredients = [
    { name: "Sweetened Condensed Milk", baseAmount: 395, unit: "g (1 can)" },
    { name: "Unsweetened Shredded Coconut", baseAmount: 100, unit: "g" },
    { name: "Unsalted Butter", baseAmount: 20, unit: "g" },
    { name: "Granulated Sugar (for rolling)", baseAmount: 50, unit: "g" },
    { name: "Cloves (for decoration)", baseAmount: 16, unit: "pieces" },
    { name: "Vanilla Extract", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 0.25, unit: "tsp" },
    { name: "Desiccated Coconut (optional, for rolling)", baseAmount: 50, unit: "g" },
    { name: "Powdered Sugar (optional, for rolling)", baseAmount: 50, unit: "g" },
    { name: "Lime Zest (optional, for flavor)", baseAmount: 1, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "210",
    protein: "3g",
    carbs: "35g",
    fat: "6g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Beijinho and how is it different from Brigadeiro?",
      answer:
        "Beijinho, meaning 'little kiss' in Portuguese, is a traditional Brazilian coconut truffle made primarily with condensed milk and shredded coconut. Unlike Brigadeiro, which is a chocolate truffle, Beijinho has a distinct coconut flavor and is often decorated with a clove on top for aroma and presentation.",
    },
    {
      question: "Can I use fresh coconut instead of shredded coconut?",
      answer:
        "Fresh coconut can be used, but shredded dried coconut is preferred for texture and consistency. If using fresh coconut, ensure it is finely grated and drained to avoid excess moisture that can affect the truffle's firmness.",
    },
    {
      question: "How do I prevent the truffles from sticking to my hands when rolling?",
      answer:
        "Lightly butter your hands or dust them with granulated sugar or desiccated coconut before rolling the truffles. This creates a barrier that prevents sticking and helps form smooth, uniform balls.",
    },
    {
      question: "Can I make Beijinho vegan or dairy-free?",
      answer:
        "Yes! Substitute the sweetened condensed milk with a vegan condensed milk alternative made from coconut milk or other plant-based milks. Use vegan butter or coconut oil instead of unsalted butter for similar texture and flavor.",
    },
    {
      question: "How should I store Coconut Truffles and how long do they last?",
      answer:
        "Store the truffles in an airtight container in the refrigerator for up to 5 days. Before serving, let them sit at room temperature for 10-15 minutes to soften slightly for the best texture and flavor.",
    },
    {
      question: "Can I add flavors or coatings to customize the truffles?",
      answer:
        "Absolutely! You can add lime zest, cinnamon, or even a splash of rum to the mixture for extra flavor. For coatings, try rolling the truffles in powdered sugar, cocoa powder, or toasted coconut flakes for variety.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Coconut Truffles"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 15m | Cook: 15m
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
                    {ing.unit.includes("can")
                      ? ing.unit
                      : `${getAmount(ing.baseAmount)} ${ing.unit}`}
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
            Coconut Truffles, or Beijinho, are a classic Brazilian confection that
            delight with their creamy texture and sweet coconut flavor. Traditionally
            served at birthday parties and festive occasions, these truffles are
            simple to make yet irresistibly delicious. The combination of condensed
            milk and shredded coconut creates a luscious base that is gently cooked
            to a perfect consistency, then rolled into bite-sized balls and coated
            with sugar or coconut flakes.
          </p>
          <p>
            The origin of Beijinho dates back to the mid-20th century in Brazil,
            where it emerged as a variation of Brigadeiro, the famous chocolate
            truffle. Its name, meaning "little kiss," reflects the affectionate
            nature of this treat, often shared among friends and family. Over time,
            Beijinho has become a symbol of Brazilian culinary tradition, cherished
            for its simplicity and comforting sweetness.
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
              Prepare the Mixture
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a medium non-stick saucepan, combine the sweetened condensed milk,
              unsalted butter, shredded coconut, vanilla extract, salt, and lime zest
              if using. Stir well to combine all ingredients evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Mixture
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the saucepan over medium-low heat. Cook the mixture, stirring
              constantly with a wooden spoon or silicone spatula, scraping the sides
              and bottom to prevent burning. Continue until the mixture thickens and
              starts to pull away from the pan, about 12-15 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cool the Mixture
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the cooked mixture to a greased plate or bowl and let it cool
              to room temperature. For faster cooling, cover with plastic wrap pressed
              directly onto the surface to avoid a skin forming.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shape the Truffles
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Butter your hands lightly or dust with sugar/desiccated coconut. Scoop
              small portions of the mixture and roll into 2-3 cm balls. Roll each ball
              in granulated sugar, desiccated coconut, or powdered sugar for coating.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Decorate and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place a clove on top of each truffle for a traditional touch and aroma.
              Arrange on a serving platter or place in mini paper cups. Serve at room
              temperature for best flavor.
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
            Use a non-stick pan and stir constantly to avoid burning the mixture,
            which can ruin the texture and flavor.
          </li>
          <li>
            If the mixture is too sticky to roll, refrigerate it for 30 minutes to
            firm up before shaping.
          </li>
          <li>
            Experiment with coatings like toasted coconut flakes or cinnamon sugar
            for unique flavor profiles.
          </li>
          <li>
            For a festive presentation, use colorful mini paper cups or sprinkle
            edible glitter on top.
          </li>
          <li>
            To make vegan Beijinho, try coconut condensed milk alternatives and
            coconut oil instead of butter.
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
              href="https://en.wikipedia.org/wiki/Beijinho"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Beijinho (Brazilian Coconut Truffle)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.tasteatlas.com/beijinho"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              TasteAtlas: Beijinho Traditional Recipe
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