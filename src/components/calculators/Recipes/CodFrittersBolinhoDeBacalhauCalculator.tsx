import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CodFrittersBolinhoDeBacalhauCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Cod%20Fritters%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1960"
  );

  // --- DATA ---
  const title = "Cod Fritters";
  const description = "Golden, crispy potato and salted cod croquettes.";

  // INGREDIENTS
  const ingredients = [
    { name: "Salted Cod (Bacalhau), soaked and shredded", baseAmount: 500, unit: "g" },
    { name: "Potatoes, peeled and diced", baseAmount: 500, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 2, unit: "cloves" },
    { name: "Fresh parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Eggs", baseAmount: 2, unit: "large" },
    { name: "All-purpose flour", baseAmount: 50, unit: "g" },
    { name: "Baking powder", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper, freshly ground", baseAmount: 0.5, unit: "tsp" },
    { name: "Salt", baseAmount: 0.5, unit: "tsp" },
    { name: "Vegetable oil (for frying)", baseAmount: 500, unit: "ml" },
    { name: "Lemon wedges (for serving)", baseAmount: 4, unit: "wedges" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "25g",
    carbs: "30g",
    fat: "10g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of cod should I use for authentic Cod Fritters?",
      answer:
        "Traditionally, salted dried cod (bacalhau) is used for Cod Fritters. It needs to be soaked in water for 24-48 hours, changing the water several times to remove excess salt and rehydrate the fish. Fresh cod can be used as a substitute but will result in a different texture and flavor.",
    },
    {
      question: "Can I prepare the cod fritter mixture in advance?",
      answer:
        "Yes, you can prepare the mixture a day ahead and keep it refrigerated in an airtight container. This allows the flavors to meld together. Before frying, bring the mixture to room temperature for best results.",
    },
    {
      question: "How do I prevent the fritters from falling apart while frying?",
      answer:
        "Ensure the mixture is well combined and not too wet. The addition of eggs and flour helps bind the ingredients. Also, fry in hot oil (around 180°C/350°F) so the fritters set quickly and hold their shape.",
    },
    {
      question: "What oil is best for frying Cod Fritters?",
      answer:
        "Use a neutral oil with a high smoke point such as vegetable, canola, or sunflower oil. Olive oil can be used but may impart a stronger flavor and has a lower smoke point.",
    },
    {
      question: "Can Cod Fritters be baked instead of fried?",
      answer:
        "While traditional Cod Fritters are deep-fried for a crispy exterior, you can bake them at 200°C (400°F) for about 20-25 minutes, turning halfway through. The texture will be less crispy but still delicious and healthier.",
    },
    {
      question: "How should I serve Cod Fritters?",
      answer:
        "Serve Cod Fritters hot with lemon wedges to squeeze over. They pair well with a simple green salad, aioli, or a fresh tomato salsa for a delightful appetizer or snack.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Cod Fritters"
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
                    {ing.unit.match(/[a-zA-Z]/) // if unit is text like "medium" or "cloves", don't scale
                      ? servings === 4
                        ? `${ing.baseAmount} ${ing.unit}`
                        : `${Math.round(ing.baseAmount * (servings / 4))} ${ing.unit}`
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Cod Fritters, or Bolinho de Bacalhau, are a beloved Portuguese appetizer featuring golden,
            crispy croquettes made from salted cod and potatoes. These fritters boast a perfect balance of
            flaky fish and creamy potato, seasoned with fresh herbs and aromatics, then fried to a delightful
            crisp. They are a staple in Portuguese cuisine and enjoyed worldwide for their comforting texture
            and rich flavor.
          </p>
          <p>
            The origins of Bolinho de Bacalhau trace back centuries to Portugal’s maritime culture, where salted
            cod was a vital preserved food source for sailors and coastal communities. Over time, this humble
            ingredient was transformed into a cherished dish, combining practicality with culinary finesse.
            Today, Cod Fritters are served in homes and restaurants alike, often accompanied by lemon wedges
            and fresh salads, embodying the spirit of Portuguese hospitality.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Cod</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Soak the salted cod in cold water for 24 to 48 hours, changing the water every 8 hours to remove excess salt.
              Drain, then poach the cod gently in simmering water for 10 minutes until cooked through. Drain and let cool.
              Once cooled, shred the cod finely, removing any bones and skin.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Potatoes</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Boil the peeled and diced potatoes in salted water until tender, about 15 minutes. Drain well and mash
              until smooth. Let cool slightly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Mixture</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the shredded cod, mashed potatoes, finely chopped onion, minced garlic, and chopped parsley.
              Add the eggs, flour, baking powder, salt, and black pepper. Mix thoroughly until you get a smooth, sticky batter.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Shape the Fritters</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Using wet hands or two spoons, shape the mixture into small oval or round fritters, about the size of a walnut.
              Place them on a tray lined with parchment paper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Fry the Fritters</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a deep pan or fryer to 180°C (350°F). Fry the fritters in batches, turning occasionally,
              until golden brown and crispy, about 3-4 minutes. Remove with a slotted spoon and drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the Cod Fritters hot with fresh lemon wedges on the side for squeezing. They pair wonderfully with a crisp green salad or a garlic aioli dip.
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
            Soaking the salted cod properly is essential to avoid overly salty fritters. Change the soaking water frequently for best results.
          </li>
          <li>
            Use a thermometer to maintain the oil temperature around 180°C (350°F) to ensure the fritters cook evenly and absorb minimal oil.
          </li>
          <li>
            If the mixture feels too wet, add a little more flour to help bind it without making the fritters dense.
          </li>
          <li>
            For an extra touch of flavor, add a pinch of nutmeg or a dash of smoked paprika to the mixture.
          </li>
          <li>
            Leftover fritters can be reheated in a hot oven or air fryer to restore crispiness.
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
              href="https://en.wikipedia.org/wiki/Bolinhos_de_bacalhau"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Bolinhos de Bacalhau
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Bolinhos-de-Bacalhau-Portuguese-Cod-Fritters/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Portuguese Cod Fritters Recipe
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