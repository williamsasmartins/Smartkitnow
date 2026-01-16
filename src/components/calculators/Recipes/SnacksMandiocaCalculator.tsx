import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SnacksMandiocaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Fried%20Cassava%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1473"
  );

  // --- DATA ---
  const title = "Fried Cassava";
  const description = "Golden sticks of manioc, the Brazilian version of potatoes.";

  // INGREDIENTS
  const ingredients = [
    { name: "Cassava (peeled and cut into sticks)", baseAmount: 500, unit: "g" },
    { name: "Vegetable oil (for frying)", baseAmount: 1000, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Garlic powder", baseAmount: 0.5, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.25, unit: "tsp" },
    { name: "Fresh parsley (chopped)", baseAmount: 2, unit: "tbsp" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "pcs" },
    { name: "Water (for boiling)", baseAmount: 1000, unit: "ml" },
    { name: "Bay leaf", baseAmount: 1, unit: "pc" },
    { name: "Optional: chili flakes", baseAmount: 0.25, unit: "tsp" },
    { name: "Optional: grated Parmesan cheese", baseAmount: 30, unit: "g" },
  ];

  // Nutrition estimates per 100g fried cassava (approximate)
  const nutrition = {
    calories: "320",
    protein: "1.5g",
    carbs: "38g",
    fat: "17g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is cassava and why is it used in this recipe?",
      answer:
        "Cassava, also known as manioc or yuca, is a starchy root vegetable native to South America. It is widely used in Brazilian cuisine due to its versatility and unique texture. In this recipe, cassava is fried to create crispy, golden sticks that serve as a delicious alternative to potatoes.",
    },
    {
      question: "How do I properly prepare cassava for frying?",
      answer:
        "First, peel the tough outer skin carefully to reveal the white flesh. Cut the cassava into sticks, then boil them in salted water with a bay leaf until tender but not falling apart (about 10-15 minutes). Drain and pat dry thoroughly before frying to ensure crispiness.",
    },
    {
      question: "Can I bake the cassava instead of frying it?",
      answer:
        "Yes, baking is a healthier alternative. After boiling and drying the cassava sticks, toss them with a little oil and seasoning, then bake at 220°C (425°F) for about 25-30 minutes, turning halfway through, until golden and crispy.",
    },
    {
      question: "What oil is best for frying cassava?",
      answer:
        "Use a neutral oil with a high smoke point such as vegetable oil, canola oil, or peanut oil. These oils ensure even frying and crisp texture without imparting strong flavors.",
    },
    {
      question: "How should I store leftover fried cassava?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 2 days. To reheat, bake them in a preheated oven at 200°C (400°F) for 5-10 minutes to restore crispiness. Avoid microwaving as it can make them soggy.",
    },
    {
      question: "Can I add flavors or dips to enhance the fried cassava?",
      answer:
        "Absolutely! Fried cassava pairs wonderfully with garlic aioli, spicy mayonnaise, or chimichurri sauce. You can also sprinkle chili flakes, grated Parmesan, or fresh herbs like parsley for extra flavor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Fried Cassava"
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
            Fried Cassava, also known as mandioca frita in Brazil, is a beloved snack that transforms the humble cassava root into crispy, golden sticks reminiscent of French fries. This dish is cherished for its satisfying crunch and creamy interior, making it a perfect accompaniment to a variety of meals or a delicious standalone treat.
          </p>
          <p>
            Cassava has been a staple food in South America for centuries, prized for its versatility and energy-rich starch content. Traditionally, cassava is boiled, fried, or baked, and in Brazil, frying it to perfection is a popular way to enjoy its unique texture and flavor. This recipe honors that tradition while providing easy-to-follow steps for home cooks.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Cassava</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Peel the cassava roots carefully, removing the thick brown skin and the pinkish layer beneath. Cut the peeled cassava into sticks about the size of French fries. Rinse them under cold water to remove excess starch.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Boil Until Tender</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the cassava sticks in a pot of boiling salted water with a bay leaf. Boil for 10-15 minutes until the cassava is tender but still holds its shape. Drain well and pat dry with paper towels to remove moisture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Heat the Oil</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a deep frying pan or pot, heat the vegetable oil to 180°C (350°F). Use a thermometer for accuracy to ensure the cassava fries evenly without absorbing too much oil.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Fry the Cassava</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Fry the boiled cassava sticks in batches, avoiding overcrowding. Fry for 3-5 minutes or until golden and crispy. Remove with a slotted spoon and drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Season and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              While still hot, season the fried cassava with salt, garlic powder, and black pepper. Garnish with chopped fresh parsley and serve with lime wedges on the side for a zesty finish.
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
            Always dry the cassava sticks thoroughly after boiling to prevent oil splatter and ensure crispiness.
          </li>
          <li>
            Use a deep-fry thermometer to maintain consistent oil temperature for perfect frying results.
          </li>
          <li>
            For extra flavor, toss the fried cassava with chili flakes or grated Parmesan cheese immediately after frying.
          </li>
          <li>
            Serve fried cassava with dipping sauces like garlic aioli, spicy mayo, or chimichurri to elevate the snack.
          </li>
          <li>
            If you prefer a healthier option, try baking the cassava sticks after boiling, tossing them lightly in oil and seasoning.
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
              href="https://en.wikipedia.org/wiki/Cassava"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Cassava
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/plant/cassava"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Cassava Plant Overview
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/fried-cassava-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Make Fried Cassava
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