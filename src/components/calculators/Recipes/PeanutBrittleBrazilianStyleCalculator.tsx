import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PeanutBrittleBrazilianStyleCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Peanut%20Brittle%20BrazilianStyle%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2973"
  );

  // --- DATA ---
  const title = "Peanut Brittle (Brazilian-Style)";
  const description = "Ground peanut sweet with a crumbly, melt-in-mouth texture.";

  // INGREDIENTS
  const ingredients = [
    { name: "Raw Peanuts (with skin)", baseAmount: 500, unit: "g" },
    { name: "Granulated Sugar", baseAmount: 400, unit: "g" },
    { name: "Water", baseAmount: 150, unit: "ml" },
    { name: "Unsalted Butter", baseAmount: 50, unit: "g" },
    { name: "Baking Soda", baseAmount: 1, unit: "tsp" },
    { name: "Vanilla Extract", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 0.5, unit: "tsp" },
    { name: "Lemon Juice", baseAmount: 1, unit: "tbsp" },
    { name: "Powdered Sugar (optional, for dusting)", baseAmount: 20, unit: "g" },
    { name: "Cornstarch (for dusting)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per 100g approx (Brazilian style peanut brittle)
  const nutrition = {
    calories: "520",
    protein: "12g",
    carbs: "55g",
    fat: "28g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes Brazilian-style peanut brittle different from other types?",
      answer:
        "Brazilian-style peanut brittle, known as 'pé-de-moleque,' typically uses raw peanuts with their skins on, giving it a rustic texture and deeper flavor. It often includes baking soda to create a lighter, crumbly texture, unlike the harder brittles common elsewhere.",
    },
    {
      question: "How do I prevent the peanut brittle from becoming too hard or burnt?",
      answer:
        "Monitor the sugar syrup temperature carefully and avoid cooking it beyond the hard crack stage (~150°C/300°F). Stir gently and remove from heat as soon as it reaches the right amber color. Using a candy thermometer helps ensure precision.",
    },
    {
      question: "Can I substitute raw peanuts with roasted peanuts?",
      answer:
        "While you can use roasted peanuts, raw peanuts with skins provide the authentic texture and flavor characteristic of Brazilian peanut brittle. Roasted peanuts may alter the final taste and texture slightly.",
    },
    {
      question: "What is the role of baking soda in this recipe?",
      answer:
        "Baking soda reacts with the hot sugar syrup, creating tiny air bubbles that lighten the brittle's texture, making it crumbly and melt-in-mouth rather than hard and glassy.",
    },
    {
      question: "How should I store the peanut brittle to maintain freshness?",
      answer:
        "Store the brittle in an airtight container at room temperature, away from moisture and heat. Properly stored, it can last up to 2 weeks while retaining its crispness.",
    },
    {
      question: "Is it possible to make this recipe vegan?",
      answer:
        "Yes, you can substitute unsalted butter with a plant-based margarine or coconut oil. Ensure the vanilla extract and other ingredients are vegan-friendly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Peanut Brittle (Brazilian-Style)"
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
            Peanut Brittle (Brazilian-Style), locally known as "pé-de-moleque," is a beloved
            traditional sweet treat in Brazil. This confection combines roasted or raw peanuts
            with caramelized sugar, resulting in a crumbly, melt-in-the-mouth texture that
            contrasts with the hard brittles found in other cultures. The addition of baking soda
            creates a light, aerated structure, making it uniquely Brazilian.
          </p>
          <p>
            The origins of pé-de-moleque trace back to colonial Brazil, where peanuts were
            abundant and sugarcane plantations flourished. This simple yet delicious sweet was
            often handmade by street vendors and families alike, becoming a staple during
            festivals and celebrations. Its rustic charm and rich flavor continue to captivate
            palates worldwide.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Peanuts</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              If using raw peanuts, roast them lightly in a dry pan over medium heat until fragrant
              and slightly golden, about 5-7 minutes. Let them cool. Keep the skins on for
              authentic texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Sugar Syrup</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a heavy-bottomed pan, combine granulated sugar, water, and lemon juice. Cook over
              medium heat without stirring until the syrup reaches a golden amber color (hard crack
              stage, about 150°C/300°F). Use a candy thermometer for accuracy.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Butter and Baking Soda</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the pan from heat and quickly stir in the butter, salt, vanilla extract, and
              baking soda. The mixture will foam and lighten in color—this is essential for the
              brittle's texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine with Peanuts</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Immediately fold in the roasted peanuts, mixing thoroughly to coat them evenly with
              the syrup.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Shape and Cool</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the mixture onto a buttered or cornstarch-dusted surface or baking sheet. Spread
              it out evenly to your desired thickness. Let it cool completely at room temperature
              until firm.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cut and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Once cooled and hardened, break or cut the brittle into pieces. Optionally, dust with
              powdered sugar for a delicate finish. Store in an airtight container.
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
            Use a candy thermometer to monitor sugar syrup temperature precisely to avoid burning.
          </li>
          <li>
            Stir the syrup gently when adding baking soda to ensure even aeration and texture.
          </li>
          <li>
            Dust your working surface with cornstarch to prevent sticking and ease removal.
          </li>
          <li>
            For extra flavor, lightly toast the peanuts before mixing to deepen their aroma.
          </li>
          <li>
            Store the brittle in a cool, dry place to maintain crispness and prevent moisture absorption.
          </li>
          <li>
            Experiment with adding a pinch of cinnamon or chili powder for a unique twist.
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
              href="https://en.wikipedia.org/wiki/P%C3%A9-de-moleque"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Pé-de-moleque (Brazilian Peanut Brittle)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.tasteatlas.com/pe-de-moleque"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              TasteAtlas: Pé-de-moleque Traditional Recipe
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