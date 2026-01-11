import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GuacamoleCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Guacamole%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5521"
  );

  // --- DATA ---
  const title = "Guacamole";
  const description = "Creme de abacate com limão, sal e temperos, servido com chips.";

  // INGREDIENTS
  const ingredients = [
    { name: "Ripe Avocados", baseAmount: 500, unit: "g" },
    { name: "Fresh Lime Juice", baseAmount: 30, unit: "ml" },
    { name: "Red Onion, finely chopped", baseAmount: 60, unit: "g" },
    { name: "Tomato, diced", baseAmount: 100, unit: "g" },
    { name: "Fresh Cilantro, chopped", baseAmount: 15, unit: "g" },
    { name: "Jalapeño, seeded and minced", baseAmount: 10, unit: "g" },
    { name: "Garlic Clove, minced", baseAmount: 5, unit: "g" },
    { name: "Salt", baseAmount: 3, unit: "g" },
    { name: "Ground Black Pepper", baseAmount: 1, unit: "g" },
    { name: "Olive Oil (optional)", baseAmount: 10, unit: "ml" },
    { name: "Tortilla Chips (for serving)", baseAmount: 100, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "180",
    protein: "3g",
    carbs: "12g",
    fat: "14g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of avocado is best for guacamole?",
      answer:
        "The best avocados for guacamole are ripe Hass avocados. They have a creamy texture and rich flavor that blends perfectly. Avoid underripe or overripe avocados as they can affect the taste and texture.",
    },
    {
      question: "How can I prevent my guacamole from turning brown?",
      answer:
        "To slow browning, add fresh lime juice which contains antioxidants and acid that help preserve color. Also, cover the guacamole tightly with plastic wrap, pressing it directly onto the surface to minimize air exposure.",
    },
    {
      question: "Can I make guacamole ahead of time?",
      answer:
        "Yes, you can prepare guacamole a few hours in advance. Store it in an airtight container with a layer of plastic wrap pressed onto the surface to prevent oxidation. For best freshness, consume within 24 hours.",
    },
    {
      question: "What are some good variations to traditional guacamole?",
      answer:
        "Variations include adding diced mango or pineapple for sweetness, roasted corn for texture, or crumbled queso fresco for creaminess. You can also experiment with different peppers like serrano for more heat.",
    },
    {
      question: "Is guacamole healthy?",
      answer:
        "Guacamole is nutritious, rich in heart-healthy monounsaturated fats, fiber, vitamins C, E, K, and B-6, as well as potassium. However, portion control is key due to its calorie density from fats.",
    },
    {
      question: "What should I serve with guacamole?",
      answer:
        "Guacamole pairs excellently with tortilla chips, fresh vegetable sticks, tacos, grilled meats, or as a topping for salads and sandwiches. It adds a fresh, creamy element to many dishes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Guacamole"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 15m | Cook: 0m
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
            Guacamole is a classic Mexican dip made primarily from ripe avocados,
            blended with fresh lime juice, salt, and a medley of vibrant ingredients
            like onions, tomatoes, cilantro, and chili peppers. Its creamy texture
            and bright flavors make it a beloved accompaniment to tortilla chips,
            tacos, and grilled dishes worldwide.
          </p>
          <p>
            Originating from the Aztecs in Central Mexico, guacamole has a rich
            history dating back centuries. The name derives from the Nahuatl word
            "āhuacamolli," meaning avocado sauce. Over time, this simple yet
            flavorful dish has evolved and become a staple in Mexican cuisine and
            beyond, celebrated for its freshness, versatility, and health benefits.
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
              Prepare the Avocados
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut the ripe avocados in half, remove the pits, and scoop the flesh
              into a medium bowl. Use a fork or potato masher to mash the avocado to
              your preferred consistency—chunky or smooth.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Fresh Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the finely chopped red onion, diced tomato, minced jalapeño,
              chopped cilantro, and minced garlic. Mix gently to combine all flavors
              evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season and Finish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add fresh lime juice, salt, and ground black pepper to taste. Optionally,
              drizzle a little olive oil for extra richness. Mix everything until
              well combined.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve Immediately
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the guacamole to a serving bowl and enjoy with tortilla chips
              or as a topping for your favorite dishes. For best flavor and color,
              serve fresh.
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
            Use ripe Hass avocados for the creamiest texture and best flavor.
          </li>
          <li>
            Add lime juice not only for flavor but also to prevent browning.
          </li>
          <li>
            Adjust the heat by controlling the amount of jalapeño or substituting
            with milder peppers.
          </li>
          <li>
            For a smoother guacamole, blend ingredients briefly in a food processor.
          </li>
          <li>
            Store leftovers tightly covered with plastic wrap pressed onto the
            surface to minimize oxidation.
          </li>
          <li>
            Experiment with add-ins like diced mango, roasted corn, or crumbled
            cheese for unique twists.
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
              href="https://en.wikipedia.org/wiki/Guacamole"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Guacamole
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/guacamole"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Guacamole Overview
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