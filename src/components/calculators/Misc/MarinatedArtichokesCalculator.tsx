import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MarinatedArtichokesCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Marinated%20Artichokes%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7888"
  );

  // --- DATA ---
  const title = "Marinated Artichokes";
  const description = "Tender artichoke hearts marinated in olive oil, garlic, and herbs.";

  // INGREDIENTS
  const ingredients = [
    { name: "Artichoke Hearts (canned or fresh)", baseAmount: 500, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 120, unit: "ml" },
    { name: "Garlic Cloves, minced", baseAmount: 3, unit: "pcs" },
    { name: "Fresh Lemon Juice", baseAmount: 30, unit: "ml" },
    { name: "White Wine Vinegar", baseAmount: 30, unit: "ml" },
    { name: "Fresh Parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Dried Oregano", baseAmount: 1, unit: "tsp" },
    { name: "Red Pepper Flakes", baseAmount: 0.5, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper, freshly ground", baseAmount: 0.5, unit: "tsp" },
    { name: "Bay Leaf", baseAmount: 1, unit: "pc" },
    { name: "Water (for blanching if fresh artichokes)", baseAmount: 1000, unit: "ml" },
    { name: "Salt (for blanching water)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "220",
    protein: "2g",
    carbs: "4g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) => (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use fresh artichokes instead of canned for this recipe?",
      answer:
        "Yes, fresh artichokes can be used and will provide a more vibrant flavor. However, they require more preparation, including trimming, peeling, and blanching to remove bitterness and tough parts. The recipe includes blanching instructions if you prefer fresh artichokes.",
    },
    {
      question: "How long can marinated artichokes be stored?",
      answer:
        "Marinated artichokes can be stored in an airtight container in the refrigerator for up to 1 week. Ensure they are fully submerged in the marinade to maintain freshness and flavor.",
    },
    {
      question: "What are some serving suggestions for marinated artichokes?",
      answer:
        "Marinated artichokes are versatile and can be served as an antipasto, tossed into salads, added to pasta dishes, or served alongside grilled meats and cheeses. They also make a flavorful addition to sandwiches and flatbreads.",
    },
    {
      question: "Can I adjust the marinade to be less oily?",
      answer:
        "Absolutely! You can reduce the amount of olive oil or substitute part of it with vegetable broth or lemon juice for a lighter marinade. Keep in mind that olive oil helps preserve the artichokes and enhances flavor.",
    },
    {
      question: "Is it necessary to add vinegar to the marinade?",
      answer:
        "Vinegar adds acidity which balances the richness of the olive oil and helps tenderize the artichokes. White wine vinegar is traditional, but you can substitute with apple cider vinegar or lemon juice if preferred.",
    },
    {
      question: "How can I make this recipe vegan and gluten-free?",
      answer:
        "This recipe is naturally vegan and gluten-free, using only plant-based ingredients and no gluten-containing additives. Always check labels if using canned artichokes or other packaged ingredients to ensure no gluten contamination.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Marinated Artichokes"
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
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setServings((s) => s + 1)}>
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
            Marinated artichokes are a classic Mediterranean delicacy, prized for their tender texture and vibrant,
            tangy flavor. This recipe highlights the natural sweetness of artichoke hearts, enhanced by a fragrant
            marinade of extra virgin olive oil, garlic, fresh herbs, and a splash of acidity from lemon juice and white
            wine vinegar. Perfect as an appetizer, side dish, or ingredient in salads and antipasti platters.
          </p>
          <p>
            Whether using fresh or canned artichokes, this recipe is designed to be simple yet elegant, capturing the
            essence of Italian home cooking. The marinade not only infuses the artichokes with flavor but also helps
            preserve them, making it a great make-ahead dish that improves in taste after resting for a few hours or
            overnight.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Artichokes</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              If using fresh artichokes, trim the tough outer leaves and cut off the top third. Remove the fuzzy choke
              with a spoon. Immediately place trimmed artichokes in a bowl of water with lemon juice to prevent
              browning. Blanch in salted boiling water for 5-7 minutes until tender, then drain and cool. If using
              canned artichokes, drain and rinse well.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Marinade</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, whisk together olive oil, minced garlic, lemon juice, white wine vinegar, chopped parsley,
              dried oregano, red pepper flakes, salt, and black pepper until well combined.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine and Marinate</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Toss the prepared artichoke hearts gently with the marinade, adding the bay leaf. Transfer to a clean
              jar or airtight container, ensuring the artichokes are submerged in the marinade.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Rest and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Refrigerate for at least 4 hours, preferably overnight, to allow flavors to meld. Remove the bay leaf
              before serving. Serve chilled or at room temperature as part of an antipasto platter or salad.
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
            Use high-quality extra virgin olive oil for the best flavor and a smooth, rich mouthfeel.
          </li>
          <li>
            Marinate the artichokes for at least 24 hours if possible; the flavors deepen and become more harmonious.
          </li>
          <li>
            Add a splash of white wine or a few capers to the marinade for an extra layer of complexity.
          </li>
          <li>
            If you prefer a milder garlic flavor, lightly roast the garlic before adding it to the marinade.
          </li>
          <li>
            Serve with crusty bread to soak up the flavorful marinade, or use the marinated artichokes as a topping for
            crostini.
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
              href="https://en.wikipedia.org/wiki/Italian_cuisine"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
              rel="noopener noreferrer"
            >
              Wikipedia: History of this Dish
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Italian-cuisine"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
              rel="noopener noreferrer"
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