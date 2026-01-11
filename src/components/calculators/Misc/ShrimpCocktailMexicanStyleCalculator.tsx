import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ShrimpCocktailMexicanStyleCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Shrimp%20Cocktail%20MexicanStyle%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6956"
  );

  // --- DATA ---
  const title = "Shrimp Cocktail (Mexican-Style)";
  const description = "Coquetel de camarão com molho tipo “coctel” e toques cítricos.";

  // INGREDIENTS
  const ingredients = [
    { name: "Shrimp (peeled and deveined)", baseAmount: 500, unit: "g" },
    { name: "Tomato juice", baseAmount: 400, unit: "ml" },
    { name: "Ketchup", baseAmount: 100, unit: "ml" },
    { name: "Fresh lime juice", baseAmount: 60, unit: "ml" },
    { name: "Chopped white onion", baseAmount: 80, unit: "g" },
    { name: "Chopped cilantro", baseAmount: 15, unit: "g" },
    { name: "Diced cucumber (peeled, seeded)", baseAmount: 100, unit: "g" },
    { name: "Diced avocado", baseAmount: 100, unit: "g" },
    { name: "Chopped jalapeño (seeded for less heat)", baseAmount: 10, unit: "g" },
    { name: "Hot sauce (such as Tabasco)", baseAmount: 10, unit: "ml" },
    { name: "Worcestershire sauce", baseAmount: 15, unit: "ml" },
    { name: "Salt", baseAmount: 5, unit: "g" },
    { name: "Black pepper", baseAmount: 2, unit: "g" },
    { name: "Olive oil", baseAmount: 15, unit: "ml" },
  ];

  // Nutrition estimates per serving (approximate)
  const nutrition = {
    calories: "210",
    protein: "25g",
    carbs: "10g",
    fat: "7g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of shrimp is best for Mexican-style shrimp cocktail?",
      answer:
        "Fresh, medium to large shrimp that are peeled and deveined work best for this recipe. Wild-caught shrimp tend to have a firmer texture and better flavor, but high-quality farmed shrimp are also suitable. Make sure they are fresh or properly thawed if frozen.",
    },
    {
      question: "Can I prepare the shrimp cocktail in advance?",
      answer:
        "Yes, you can prepare the shrimp and cocktail sauce a few hours ahead of time. Keep the shrimp chilled and covered in the refrigerator. Add delicate ingredients like avocado just before serving to prevent browning.",
    },
    {
      question: "How spicy is the Mexican-style shrimp cocktail?",
      answer:
        "The heat level can be adjusted by the amount of jalapeño and hot sauce used. This recipe uses a moderate amount to provide a gentle kick without overwhelming the fresh flavors. You can reduce or omit the jalapeño for a milder version.",
    },
    {
      question: "What can I serve with this shrimp cocktail?",
      answer:
        "This dish pairs wonderfully with crispy tostadas, saltine crackers, or fresh tortilla chips. It can also be served as a light appetizer alongside a fresh salad or grilled vegetables.",
    },
    {
      question: "Is this recipe gluten-free and dairy-free?",
      answer:
        "Yes, this shrimp cocktail is naturally gluten-free and dairy-free, making it suitable for those with these dietary restrictions. Always check labels on sauces like Worcestershire to ensure they meet your dietary needs.",
    },
    {
      question: "Can I substitute any ingredients if I don't have them?",
      answer:
        "Certainly! For example, if you don't have tomato juice, you can use clamato juice or a blend of tomato sauce and water. Cilantro can be omitted or replaced with fresh parsley if preferred. Adjust seasonings to taste.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Shrimp Cocktail (Mexican-Style)"
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
            This Mexican-style shrimp cocktail, or "Coctel de Camarón," is a vibrant and refreshing seafood dish that combines tender shrimp with a tangy, slightly spicy tomato-based sauce. It is typically served chilled, making it a perfect appetizer for warm weather or festive occasions. The cocktail is enhanced with fresh ingredients like lime juice, cilantro, and avocado, delivering a balance of citrusy brightness and creamy texture.
          </p>
          <p>
            Originating from the coastal regions of Mexico, this dish reflects the country's rich culinary heritage, blending indigenous flavors with Spanish influences. Unlike the classic American shrimp cocktail served with horseradish sauce, the Mexican version uses a tomato and lime juice base with a hint of heat from jalapeños and hot sauce. It is a beloved staple at family gatherings, street food stalls, and seafood markets throughout Mexico.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Shrimp</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring a large pot of salted water to a boil. Add the shrimp and cook for 2-3 minutes until they turn pink and opaque. Immediately transfer the shrimp to an ice bath to stop the cooking process and keep them tender. Drain and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Cocktail Sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine tomato juice, ketchup, fresh lime juice, Worcestershire sauce, hot sauce, salt, and black pepper. Whisk until well blended.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Fresh Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in chopped onion, cilantro, diced cucumber, diced avocado, and chopped jalapeño into the sauce mixture. Gently fold in the cooked shrimp and drizzle olive oil over the top.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Chill and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cover the bowl and refrigerate for at least 30 minutes to allow flavors to meld. Serve chilled in individual glasses or bowls, garnished with extra cilantro and lime wedges if desired.
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
            Use fresh lime juice rather than bottled for the best bright citrus flavor.
          </li>
          <li>
            To avoid mushy shrimp, do not overcook; remove them from boiling water as soon as they turn pink.
          </li>
          <li>
            Add avocado just before serving to prevent it from browning and losing its creamy texture.
          </li>
          <li>
            Adjust the heat by controlling the amount of jalapeño and hot sauce to suit your taste.
          </li>
          <li>
            For a smoky twist, add a dash of chipotle hot sauce or smoked paprika to the cocktail sauce.
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
              href="https://en.wikipedia.org/wiki/Coctel_de_camar%C3%B3n"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Coctel de Camarón (Mexican Shrimp Cocktail)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Mexican-Shrimp-Cocktail-Coctel-de-Camaron"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Mexican Shrimp Cocktail Recipe
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