import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BlackBeanDipCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Black%20Bean%20Dip%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9701"
  );

  // --- DATA ---
  const title = "Black Bean Dip";
  const description = "Dip cremoso de feijão preto temperado, ótimo para nachos.";

  // INGREDIENTS
  const ingredients = [
    { name: "Black Beans (cooked, drained)", baseAmount: 400, unit: "g" },
    { name: "Cream Cheese", baseAmount: 120, unit: "g" },
    { name: "Sour Cream", baseAmount: 80, unit: "g" },
    { name: "Fresh Lime Juice", baseAmount: 30, unit: "ml" },
    { name: "Garlic Cloves (minced)", baseAmount: 2, unit: "pcs" },
    { name: "Ground Cumin", baseAmount: 1, unit: "tsp" },
    { name: "Chili Powder", baseAmount: 1, unit: "tsp" },
    { name: "Cilantro (chopped)", baseAmount: 15, unit: "g" },
    { name: "Green Onions (sliced)", baseAmount: 30, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Olive Oil", baseAmount: 15, unit: "ml" },
    { name: "Jalapeño (seeded and chopped)", baseAmount: 1, unit: "pcs" },
    { name: "Water (to adjust consistency)", baseAmount: 30, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "180",
    protein: "8g",
    carbs: "20g",
    fat: "7g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use canned black beans for this dip?",
      answer:
        "Yes, canned black beans are a convenient option. Just be sure to rinse and drain them thoroughly to reduce excess sodium and improve the dip's texture.",
    },
    {
      question: "How can I make this dip vegan?",
      answer:
        "To make a vegan version, substitute the cream cheese and sour cream with plant-based alternatives such as cashew cream or vegan cream cheese. Adjust seasoning as needed.",
    },
    {
      question: "What is the best way to serve Black Bean Dip?",
      answer:
        "This dip pairs wonderfully with tortilla chips, fresh vegetable sticks, or as a spread on sandwiches and wraps. It can also be used as a topping for tacos or burritos.",
    },
    {
      question: "How long can I store the dip?",
      answer:
        "Store the dip in an airtight container in the refrigerator for up to 4 days. Stir well before serving, and if it thickens, add a splash of water or lime juice to loosen it.",
    },
    {
      question: "Can I prepare this dip ahead of time?",
      answer:
        "Absolutely! Preparing the dip a few hours or even a day ahead allows the flavors to meld beautifully. Just keep it refrigerated and bring it to room temperature before serving.",
    },
    {
      question: "What variations can I try with this recipe?",
      answer:
        "You can add roasted corn, diced tomatoes, or even a bit of smoked paprika for a smoky twist. For extra heat, increase the jalapeño or add a dash of hot sauce.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Black Bean Dip"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Black Bean Dip is a creamy, flavorful appetizer that combines the earthiness of black beans with zesty lime and aromatic spices. Perfectly balanced with cream cheese and sour cream, this dip is a crowd-pleaser at any gathering, especially when paired with crunchy nachos or fresh veggies.
          </p>
          <p>
            Originating from Latin American cuisine, black beans have long been a staple ingredient known for their rich flavor and nutritional benefits. This dip is a modern twist on traditional bean spreads, blending fresh herbs and spices to create a versatile and delicious dish enjoyed worldwide.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Beans</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              If using dried black beans, soak them overnight and cook until tender. For convenience, canned black beans can be rinsed and drained thoroughly to remove excess sodium.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Blend the Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a food processor, combine black beans, cream cheese, sour cream, lime juice, garlic, cumin, chili powder, jalapeño, salt, and pepper. Pulse until smooth but still slightly textured.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Adjust Consistency</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add water or additional lime juice a tablespoon at a time to reach your desired dip consistency. Blend briefly after each addition.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Fresh Herbs</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in chopped cilantro and sliced green onions by hand to preserve their freshness and texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Chill and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Refrigerate the dip for at least 30 minutes to allow flavors to meld. Serve chilled or at room temperature with your favorite chips or vegetables.
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
            For a smoother dip, peel the skins off the black beans after cooking or rinsing canned beans.
          </li>
          <li>
            Toast the cumin and chili powder lightly in a dry pan before adding to the dip to enhance their aroma and flavor.
          </li>
          <li>
            Use fresh lime juice rather than bottled for the best bright and tangy flavor.
          </li>
          <li>
            If you prefer a spicier dip, leave some jalapeño seeds in or add a pinch of cayenne pepper.
          </li>
          <li>
            Garnish with extra cilantro, diced tomatoes, or a drizzle of olive oil for a beautiful presentation.
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
              href="https://en.wikipedia.org/wiki/Black_bean"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Black Bean Overview
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/black-bean-dip-recipe-3052746"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Black Bean Dip Recipe
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