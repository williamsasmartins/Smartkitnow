import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SweetAndSourEggplantRelishCaponataCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Sweet%20and%20Sour%20Eggplant%20Relish%20Caponata%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9681"
  );

  // --- DATA ---
  const title = "Sweet and Sour Eggplant Relish (Caponata)";
  const description = "Sicilian eggplant stew with celery, olives, capers, and vinegar.";

  // INGREDIENTS
  const ingredients = [
    { name: "Eggplant (aubergine), diced", baseAmount: 500, unit: "g" },
    { name: "Celery stalks, chopped", baseAmount: 150, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 120, unit: "g" },
    { name: "Tomatoes, peeled and chopped", baseAmount: 200, unit: "g" },
    { name: "Green olives, pitted and sliced", baseAmount: 80, unit: "g" },
    { name: "Capers, rinsed", baseAmount: 30, unit: "g" },
    { name: "Pine nuts, toasted", baseAmount: 30, unit: "g" },
    { name: "Raisins", baseAmount: 40, unit: "g" },
    { name: "Red wine vinegar", baseAmount: 60, unit: "ml" },
    { name: "Sugar", baseAmount: 40, unit: "g" },
    { name: "Extra virgin olive oil", baseAmount: 80, unit: "ml" },
    { name: "Salt", baseAmount: 5, unit: "g" },
    { name: "Black pepper, freshly ground", baseAmount: 2, unit: "g" },
    { name: "Fresh basil leaves, chopped", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per 4 servings approx.
  const nutrition = {
    calories: "320",
    protein: "4g",
    carbs: "28g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Caponata and where does it originate from?",
      answer:
        "Caponata is a traditional Sicilian sweet and sour eggplant relish or stew. It combines eggplant with celery, olives, capers, and a tangy vinegar-sugar dressing. Originating from Sicily, it reflects the island's rich history of Mediterranean influences and is often served as an appetizer, side dish, or condiment.",
    },
    {
      question: "Can I make Caponata ahead of time?",
      answer:
        "Yes, Caponata actually tastes better after resting for several hours or overnight in the refrigerator. This resting time allows the flavors to meld and deepen. Store it in an airtight container and bring it to room temperature before serving for the best taste.",
    },
    {
      question: "How do I prevent the eggplant from becoming soggy?",
      answer:
        "To avoid soggy eggplant, salt the diced pieces and let them sit for about 30 minutes to draw out excess moisture and bitterness. Then rinse and pat dry before frying or roasting. Also, frying in hot oil until golden helps maintain a firm texture.",
    },
    {
      question: "Can I substitute any ingredients for dietary preferences?",
      answer:
        "Certainly! You can omit pine nuts or replace them with toasted almonds or walnuts. For a lower-sodium version, reduce or omit the olives and capers. Use a sugar substitute like honey or maple syrup if preferred. The recipe is quite flexible to accommodate various dietary needs.",
    },
    {
      question: "How should I serve Caponata?",
      answer:
        "Caponata is versatile: serve it chilled or at room temperature as an antipasto with crusty bread or crostini. It also pairs wonderfully as a side dish with grilled meats, fish, or pasta. Some enjoy it as a topping for bruschetta or even as a flavorful sandwich spread.",
    },
    {
      question: "What is the best way to store leftover Caponata?",
      answer:
        "Store leftover Caponata in an airtight container in the refrigerator for up to 5 days. Because of its vinegar content, it keeps well and can even improve in flavor over time. For longer storage, you can freeze it in portions, though texture may slightly change upon thawing.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Sweet and Sour Eggplant Relish (Caponata)"
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
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-base">
          <div>
            <div className="font-bold text-lg">{nutrition.calories}</div>
            <span className="font-bold uppercase text-slate-500">Kcal</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.protein}</div>
            <span className="font-bold uppercase text-slate-500">Prot</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.carbs}</div>
            <span className="font-bold uppercase text-slate-500">Carb</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.fat}</div>
            <span className="font-bold uppercase text-slate-500">Fat</span>
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
            Caponata is a classic Sicilian dish that masterfully balances sweet,
            sour, and savory flavors. This vibrant eggplant relish is a celebration
            of Mediterranean ingredients like olives, capers, celery, and tomatoes,
            all brought together with a tangy vinegar and sugar dressing. Perfect
            as an appetizer, side dish, or condiment, Caponata offers a complex
            flavor profile that delights the palate.
          </p>
          <p>
            The origins of Caponata trace back to Sicily, where the island's rich
            history of cultural exchanges influenced its cuisine. The dish reflects
            Arab, Spanish, and Italian culinary traditions, showcasing the use of
            sweet and sour elements that were popularized during these periods.
            Traditionally served at room temperature, Caponata has become a beloved
            staple in Italian households and restaurants worldwide.
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
              Prepare the Eggplant
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Dice the eggplant into roughly 2 cm cubes. Place them in a colander,
              sprinkle with salt, and let sit for 30 minutes to draw out moisture
              and bitterness. Rinse well and pat dry with paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Fry the Eggplant and Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large skillet over medium heat. Fry the eggplant
              cubes until golden and tender, then remove and drain on paper towels.
              In the same skillet, sauté chopped onion and celery until softened.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Combine Ingredients and Simmer
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add chopped tomatoes, olives, capers, pine nuts, and raisins to the
              skillet. Stir well and cook for 5 minutes. Then add the fried eggplant
              back in.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Vinegar and Sugar
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the red wine vinegar and sugar, mixing thoroughly. Simmer the
              mixture gently for another 5 minutes until the flavors meld and the
              sauce thickens slightly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season and Garnish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Season with salt and freshly ground black pepper to taste. Remove from
              heat and stir in chopped fresh basil leaves. Allow to cool to room
              temperature before serving.
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
            Salting and draining the eggplant is key to preventing sogginess and
            bitterness.
          </li>
          <li>
            Use good quality red wine vinegar for the best balance of acidity and
            sweetness.
          </li>
          <li>
            Toast pine nuts lightly in a dry pan to enhance their nutty flavor before
            adding.
          </li>
          <li>
            Caponata improves in flavor after resting for several hours or overnight
            in the fridge.
          </li>
          <li>
            Serve with crusty bread or as a topping for grilled meats and fish for a
            delicious Mediterranean touch.
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
              href="https://en.wikipedia.org/wiki/Italian_cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: History of this Dish
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Italian-cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Culinary Reference
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
