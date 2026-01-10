import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CalzoneCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Calzone%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=783"
  );

  // --- DATA ---
  const title = "Calzone";
  const description = "Folded pizza stuffed with ricotta, mozzarella, and ham.";

  // INGREDIENTS
  const ingredients = [
    { name: "All-purpose flour", baseAmount: 500, unit: "g" },
    { name: "Warm water", baseAmount: 300, unit: "ml" },
    { name: "Active dry yeast", baseAmount: 7, unit: "g" },
    { name: "Sugar", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Ricotta cheese", baseAmount: 250, unit: "g" },
    { name: "Mozzarella cheese (shredded)", baseAmount: 200, unit: "g" },
    { name: "Cooked ham (diced)", baseAmount: 150, unit: "g" },
    { name: "Parmesan cheese (grated)", baseAmount: 50, unit: "g" },
    { name: "Fresh basil leaves", baseAmount: 10, unit: "g" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Tomato sauce", baseAmount: 150, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "520",
    protein: "28g",
    carbs: "55g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is a calzone and how does it differ from a pizza?",
      answer:
        "A calzone is an Italian folded pizza, typically stuffed with cheeses, meats, and vegetables, then baked. Unlike a traditional pizza which is flat and open-faced, a calzone is folded over to enclose the fillings, creating a pocket that seals in moisture and flavors.",
    },
    {
      question: "Can I prepare calzone dough in advance?",
      answer:
        "Yes, you can prepare the dough a day ahead and refrigerate it tightly wrapped. This slow fermentation enhances flavor and texture. Just bring it to room temperature before shaping and baking.",
    },
    {
      question: "What are some common fillings for calzones?",
      answer:
        "Traditional fillings include ricotta, mozzarella, ham, salami, mushrooms, spinach, and tomato sauce. You can customize fillings to your preference, but avoid overly watery ingredients to prevent sogginess.",
    },
    {
      question: "How do I ensure the calzone crust is crispy and cooked through?",
      answer:
        "Preheat your oven to a high temperature (around 220°C/425°F) and bake on a pizza stone or preheated baking sheet. Brush the crust lightly with olive oil before baking to promote browning and crispiness.",
    },
    {
      question: "Can calzones be frozen for later use?",
      answer:
        "Absolutely! You can freeze assembled but unbaked calzones by wrapping them tightly in plastic wrap and foil. Bake them directly from frozen, adding a few extra minutes to the baking time.",
    },
    {
      question: "What is the best way to reheat leftover calzones?",
      answer:
        "Reheat calzones in a preheated oven at 180°C (350°F) for about 10-15 minutes to restore crispiness. Avoid microwaving as it can make the crust soggy.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Calzone"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 15m
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
            The calzone is a classic Italian dish that originated in Naples, Italy. It is essentially a folded pizza, designed to enclose a variety of savory fillings such as ricotta, mozzarella, ham, and fresh herbs. This pocket-style pizza offers a delightful combination of crispy crust and gooey, melted cheese inside, making it a beloved comfort food worldwide.
          </p>
          <p>
            Historically, calzones were created as a portable meal for workers and travelers, allowing them to enjoy the flavors of pizza without the mess. Over time, the recipe has evolved with regional variations and creative fillings, but the essence remains the same: a delicious, hand-held Italian treat that combines the best of pizza and stuffed bread.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, dissolve the yeast and sugar in warm water. Let it sit for 5-10 minutes until foamy. Add the flour, salt, and olive oil, then knead the mixture until a smooth, elastic dough forms. Cover and let it rise in a warm place for about 1 hour or until doubled in size.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Filling</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, combine ricotta, shredded mozzarella, diced ham, grated Parmesan, chopped basil, black pepper, and a few tablespoons of tomato sauce. Mix gently to combine all ingredients evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Shape the Calzones</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Divide the dough into equal portions based on servings. Roll each portion into a circle about 20 cm (8 inches) in diameter. Spread a thin layer of tomato sauce on one half, then add the filling mixture, leaving a border around the edge.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Seal and Bake</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Fold the dough over the filling to create a half-moon shape. Press the edges firmly to seal, then crimp or pinch to ensure no filling escapes. Brush the top with olive oil and optionally sprinkle with extra Parmesan. Bake in a preheated oven at 220°C (425°F) for 12-15 minutes or until golden brown and crispy.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve and Enjoy</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Let the calzones cool for a few minutes before slicing. Serve warm with extra tomato sauce or a side salad for a complete meal.
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
            Use a pizza stone or preheated baking sheet to achieve a crispier crust.
          </li>
          <li>
            Avoid overfilling the calzone to prevent leaks and soggy dough.
          </li>
          <li>
            For extra flavor, add fresh herbs like oregano or thyme to the filling.
          </li>
          <li>
            Brush the calzone with olive oil or an egg wash before baking for a golden finish.
          </li>
          <li>
            Let the dough rest after kneading to develop gluten and improve texture.
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
