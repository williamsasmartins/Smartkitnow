import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LasagnaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Lasagna%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6233"
  );

  // --- DATA ---
  const title = "Lasagna";
  const description = "Layered pasta with ragù, béchamel, mozzarella, and Parmesan.";

  // INGREDIENTS
  const ingredients = [
    { name: "Lasagna sheets", baseAmount: 250, unit: "g" },
    { name: "Ground beef", baseAmount: 400, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Carrot, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Celery stalk, finely chopped", baseAmount: 1, unit: "stalk" },
    { name: "Canned tomatoes (crushed)", baseAmount: 800, unit: "g" },
    { name: "Tomato paste", baseAmount: 2, unit: "tbsp" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Milk", baseAmount: 500, unit: "ml" },
    { name: "Butter", baseAmount: 50, unit: "g" },
    { name: "All-purpose flour", baseAmount: 50, unit: "g" },
    { name: "Mozzarella cheese, shredded", baseAmount: 200, unit: "g" },
    { name: "Parmesan cheese, grated", baseAmount: 100, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Nutmeg, grated", baseAmount: 0.25, unit: "tsp" },
    { name: "Fresh basil leaves", baseAmount: 5, unit: "leaves" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "550",
    protein: "35g",
    carbs: "40g",
    fat: "25g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of pasta is best for lasagna?",
      answer:
        "Traditional lasagna uses wide, flat sheets of pasta made from durum wheat. You can use fresh or dried lasagna sheets. Fresh pasta cooks faster and has a tender texture, while dried pasta is convenient and holds its shape well. No-boil lasagna sheets are also available, which save time but require sufficient sauce to soften properly during baking.",
    },
    {
      question: "Can I make lasagna vegetarian?",
      answer:
        "Absolutely! Replace the ground beef with vegetables like mushrooms, zucchini, spinach, or lentils for a hearty vegetarian ragù. You can also use plant-based meat substitutes. Ensure to season well and add umami-rich ingredients like soy sauce or miso to enhance flavor.",
    },
    {
      question: "How do I store leftover lasagna?",
      answer:
        "Allow the lasagna to cool completely, then cover tightly with plastic wrap or transfer to an airtight container. Store in the refrigerator for up to 3-4 days. For longer storage, freeze portions wrapped well in foil or freezer-safe containers for up to 3 months. Reheat thoroughly before serving.",
    },
    {
      question: "What is béchamel sauce and why is it used in lasagna?",
      answer:
        "Béchamel is a classic white sauce made from butter, flour, and milk. It adds creaminess and moisture to the lasagna, balancing the acidity of the tomato ragù and providing a rich texture. It also helps bind the layers together for a cohesive dish.",
    },
    {
      question: "Can I prepare lasagna in advance?",
      answer:
        "Yes, lasagna is an excellent make-ahead dish. You can assemble it a day before baking and keep it refrigerated. This allows the flavors to meld beautifully. When ready, bake it directly from the fridge, adding a few extra minutes to the cooking time to ensure it’s heated through.",
    },
    {
      question: "How do I prevent the lasagna from drying out?",
      answer:
        "Ensure your ragù and béchamel sauces have enough moisture. Avoid overcooking the pasta sheets before layering. Cover the lasagna with foil during the first part of baking to trap steam, then remove the foil near the end to brown the top. Adding a little extra sauce between layers also helps keep it moist.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Lasagna"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 1h 15m
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
            Lasagna is a classic Italian dish that has won hearts worldwide with its rich layers of pasta, savory ragù, creamy béchamel, and melted cheeses. Originating from the Emilia-Romagna region, this hearty casserole combines simple ingredients into a comforting and indulgent meal perfect for family gatherings or special occasions.
          </p>
          <p>
            This recipe balances the robust flavors of slow-cooked meat sauce with the delicate creaminess of béchamel, layered between tender sheets of pasta and topped with mozzarella and Parmesan for a golden, bubbling crust. Adjust the servings easily to suit your needs and enjoy a restaurant-quality lasagna at home.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the ragù</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large pan over medium heat. Sauté the chopped onion, carrot, celery, and garlic until softened. Add the ground beef and cook until browned. Stir in tomato paste, crushed tomatoes, salt, pepper, and fresh basil. Simmer gently for 45 minutes, stirring occasionally.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the béchamel sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a saucepan, melt butter over medium heat. Whisk in flour and cook for 1-2 minutes without browning. Gradually add milk while whisking continuously to avoid lumps. Cook until thickened. Season with salt, pepper, and a pinch of grated nutmeg.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Preheat oven and prepare pasta</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 180°C (350°F). If using dried lasagna sheets, boil them briefly according to package instructions to soften, then drain and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Assemble the lasagna</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a baking dish, spread a thin layer of ragù, then a layer of pasta sheets. Add a layer of béchamel sauce, followed by ragù, mozzarella, and a sprinkle of Parmesan. Repeat layers until ingredients are used, finishing with béchamel and cheese on top.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Bake and serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cover the dish with foil and bake for 45 minutes. Remove the foil and bake for another 15-20 minutes until the top is golden and bubbling. Let rest for 10 minutes before slicing and serving.
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
            Use fresh basil and high-quality cheeses for the best flavor and aroma.
          </li>
          <li>
            Let the lasagna rest after baking to allow the layers to set, making it easier to cut and serve.
          </li>
          <li>
            For a richer béchamel, substitute part of the milk with cream.
          </li>
          <li>
            If you prefer a spicier ragù, add a pinch of chili flakes during cooking.
          </li>
          <li>
            Leftover lasagna tastes even better the next day as the flavors meld together.
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