import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HuevosMexicanosConSalsaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Mexican%20Scrambled%20Eggs%20with%20Salsa%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9752"
  );

  // --- DATA ---
  const title = "Mexican Scrambled Eggs (with Salsa)";
  const description = "Ovos mexidos com salsa para um sabor mais marcante e úmido.";

  // INGREDIENTS
  const ingredients = [
    { name: "Large Eggs", baseAmount: 8, unit: "pcs" },
    { name: "Tomato", baseAmount: 200, unit: "g" },
    { name: "White Onion", baseAmount: 50, unit: "g" },
    { name: "Fresh Cilantro", baseAmount: 15, unit: "g" },
    { name: "Jalapeño Pepper", baseAmount: 1, unit: "pc" },
    { name: "Garlic Clove", baseAmount: 2, unit: "pcs" },
    { name: "Vegetable Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Lime Juice", baseAmount: 1, unit: "tbsp" },
    { name: "Queso Fresco (optional)", baseAmount: 50, unit: "g" },
    { name: "Tortillas (for serving)", baseAmount: 4, unit: "pcs" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "280",
    protein: "18g",
    carbs: "10g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I make this recipe vegan or dairy-free?",
      answer:
        "Yes! To make this recipe vegan, replace the eggs with scrambled tofu seasoned with turmeric and kala namak for an eggy flavor. Omit queso fresco or substitute with a plant-based cheese alternative. Use oil instead of butter if preferred.",
    },
    {
      question: "How do I adjust the spice level in the salsa?",
      answer:
        "The jalapeño pepper provides the heat in this recipe. For milder salsa, remove the seeds and membranes before chopping. For more heat, add an extra jalapeño or substitute with serrano peppers. Always taste as you go to suit your preference.",
    },
    {
      question: "What type of tortillas work best with these scrambled eggs?",
      answer:
        "Traditional corn tortillas are ideal for authentic Mexican flavor and texture. Warm them lightly on a skillet before serving. Flour tortillas can also be used if preferred, especially for a softer wrap.",
    },
    {
      question: "Can I prepare the salsa in advance?",
      answer:
        "Absolutely! The fresh salsa can be made a few hours ahead and refrigerated to allow flavors to meld. Just add the lime juice right before serving to keep it fresh and vibrant.",
    },
    {
      question: "What is the best way to cook the scrambled eggs for this dish?",
      answer:
        "Cook the eggs gently over medium-low heat, stirring slowly to achieve soft, creamy curds. Avoid high heat to prevent dryness. Adding the salsa towards the end helps keep the eggs moist and flavorful.",
    },
    {
      question: "Are there any traditional variations of Mexican scrambled eggs?",
      answer:
        "Yes, Mexican scrambled eggs, or 'Huevos a la Mexicana,' often include ingredients like diced tomatoes, onions, and chili peppers cooked together with the eggs. Some variations add chorizo, cheese, or beans for extra richness and texture.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Mexican Scrambled Eggs (with Salsa)"
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
            Mexican Scrambled Eggs with Salsa, or "Huevos a la Mexicana," is a vibrant and flavorful breakfast staple that combines fluffy eggs with a fresh, zesty salsa made from tomatoes, onions, jalapeños, and cilantro. This dish offers a perfect balance of creaminess and spice, making it a beloved morning meal across Mexico and beyond.
          </p>
          <p>
            The origins of this dish trace back to traditional Mexican home cooking, where simple, fresh ingredients are transformed into comforting and satisfying meals. The salsa adds moisture and brightness to the eggs, elevating the humble scramble into a colorful and aromatic dish that celebrates the essence of Mexican cuisine.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Salsa</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Finely chop the tomatoes, white onion, jalapeño (remove seeds for less heat), garlic, and cilantro. In a medium bowl, combine these ingredients with lime juice, salt, and pepper. Set aside to let the flavors meld while you prepare the eggs.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Beat the Eggs</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Crack the eggs into a bowl and whisk them lightly with salt and pepper until just combined. Avoid overbeating to keep the eggs tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Salsa</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat the vegetable oil in a non-stick skillet over medium heat. Add the chopped garlic and sauté for 30 seconds until fragrant. Add the tomato mixture and cook for 3-4 minutes until softened and slightly saucy.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add and Scramble the Eggs</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the beaten eggs into the skillet with the salsa. Reduce heat to medium-low and gently stir the eggs with a spatula, cooking slowly to create soft curds. Cook until eggs are just set but still moist, about 3-5 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove from heat and sprinkle with crumbled queso fresco if using. Serve immediately with warm corn tortillas on the side for a complete and authentic Mexican breakfast experience.
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
            Use fresh, ripe tomatoes for the salsa to ensure a bright and juicy flavor.
          </li>
          <li>
            Cook the eggs gently on medium-low heat to keep them creamy and avoid rubberiness.
          </li>
          <li>
            If you prefer a chunkier salsa, chop the ingredients coarsely; for a smoother texture, finely mince or pulse briefly in a food processor.
          </li>
          <li>
            Toast the tortillas on a dry skillet or comal to enhance their flavor and pliability.
          </li>
          <li>
            Add a pinch of smoked paprika or chipotle powder to the salsa for a smoky depth.
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
              href="https://en.wikipedia.org/wiki/Huevos_a_la_Mexicana"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Huevos a la Mexicana
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/mexican-scrambled-eggs-huevos-a-la-mexicana-2342796"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Mexican Scrambled Eggs Recipe
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