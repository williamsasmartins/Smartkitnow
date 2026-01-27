import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function MashedCassavaCasseroleEscondidinhoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Mashed%20Cassava%20Casserole%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9743"
  );

  // --- DATA ---
  const title = "Mashed Cassava Casserole";
  const description = '"Hidden" meat filling under a layer of creamy puréed cassava.';

  // INGREDIENTS
  const ingredients = [
    { name: "Cassava (yuca), peeled and chopped", baseAmount: 500, unit: "g" },
    { name: "Ground beef", baseAmount: 300, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Tomato paste", baseAmount: 2, unit: "tbsp" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Butter", baseAmount: 50, unit: "g" },
    { name: "Milk", baseAmount: 100, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh parsley, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Grated Parmesan cheese", baseAmount: 50, unit: "g" },
    { name: "Mozzarella cheese, shredded", baseAmount: 100, unit: "g" },
    { name: "Bay leaf", baseAmount: 1, unit: "leaf" },
  ];

  // Approximate nutrition per serving (4 servings)
  const nutrition = {
    calories: "450",
    protein: "28g",
    carbs: "45g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Mashed Cassava Casserole (Escondidinho)?",
      answer:
        "Mashed Cassava Casserole, also known as Escondidinho, is a traditional Brazilian dish featuring a savory meat filling hidden beneath a creamy layer of mashed cassava (yuca). The name 'Escondidinho' means 'little hidden one' in Portuguese, referring to the concealed filling.",
    },
    {
      question: "Can I substitute cassava with other root vegetables?",
      answer:
        "While cassava is traditional and gives the dish its unique texture and flavor, you can substitute it with potatoes or sweet potatoes if cassava is unavailable. However, the taste and consistency will differ slightly.",
    },
    {
      question: "How do I store leftovers and reheat them?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days. To reheat, cover the casserole with foil and warm it in a preheated oven at 180°C (350°F) for about 15-20 minutes until heated through.",
    },
    {
      question: "Is this dish gluten-free?",
      answer:
        "Yes, Mashed Cassava Casserole is naturally gluten-free as it uses cassava and meat without any wheat-based ingredients. Always check labels on processed ingredients like tomato paste to ensure they are gluten-free.",
    },
    {
      question: "Can I make this recipe vegetarian or vegan?",
      answer:
        "Absolutely! For a vegetarian or vegan version, substitute the ground beef with cooked lentils, mushrooms, or textured vegetable protein. Use plant-based butter and milk alternatives for the mashed cassava topping.",
    },
    {
      question: "What is the best way to peel and prepare cassava?",
      answer:
        "To peel cassava, cut off both ends, make a shallow lengthwise slit through the thick skin, then peel it off with your fingers or a knife. Cut into chunks and boil in salted water until tender before mashing.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT40M",
    totalTime: "PT1H",
    recipeYield: `${servings} servings`,
    recipeCategory: "Main Course",
    recipeCuisine: "Brazilian",
    keywords: "mashed cassava casserole, escondidinho, brazilian cuisine, comfort food, yuca casserole",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Boil peeled cassava chunks until tender, then mash with butter and milk until creamy.",
      "Sauté onion, garlic, and ground beef until browned, then simmer with tomato paste and spices.",
      "Stir in parsley and remove bay leaf.",
      "Layer half of the mash, the meat filling, and then the remaining mash in a baking dish.",
      "Top with Parmesan and mozzarella, then bake at 180°C (350°F) for 20-25 minutes."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Mashed Cassava Casserole"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 40m
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
            Mashed Cassava Casserole, or Escondidinho, is a beloved Brazilian comfort
            food that artfully combines a rich, savory meat filling with a smooth,
            creamy cassava mash topping. This layered casserole is baked to golden
            perfection, creating a delightful contrast between the hearty filling and
            the velvety cassava crust. It’s a perfect dish for family dinners or
            special occasions, showcasing the versatility and unique flavor of cassava.
          </p>
          <p>
            Originating from Northeastern Brazil, Escondidinho reflects the region’s
            culinary heritage where cassava is a staple ingredient. Traditionally,
            the filling consists of dried meat or ground beef cooked with aromatic
            spices and herbs, then “hidden” beneath the mashed cassava layer. Over
            time, this dish has gained popularity across Brazil and beyond, with
            many variations adapting to local tastes and available ingredients.
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
              Prepare the Cassava
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Peel the cassava and cut it into chunks. Boil in salted water for about
              20 minutes or until very tender. Drain well and mash with butter and
              warm milk until smooth and creamy. Season with salt and pepper to taste.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Meat Filling
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a pan over medium heat. Sauté the chopped onion and
              garlic until translucent. Add the ground beef and cook until browned.
              Stir in tomato paste, bay leaf, salt, and pepper. Simmer for 10-15
              minutes until flavors meld. Remove bay leaf and stir in chopped parsley.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Casserole
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat the oven to 180°C (350°F). In a baking dish, spread half of the
              mashed cassava evenly. Layer the meat filling on top, then cover with
              the remaining mashed cassava. Sprinkle grated Parmesan and shredded
              mozzarella cheese on top.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bake the casserole for 20-25 minutes or until the cheese is melted and
              golden brown. Let it rest for 5 minutes before serving. Enjoy warm as a
              hearty main dish.
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
            For extra creaminess, add a splash of heavy cream or coconut milk to the
            mashed cassava.
          </li>
          <li>
            Use freshly grated cheeses for better melting and flavor.
          </li>
          <li>
            If you prefer a spicier filling, add a pinch of chili flakes or diced
            jalapeños while cooking the meat.
          </li>
          <li>
            To save time, prepare the meat filling a day ahead; flavors deepen when
            rested overnight.
          </li>
          <li>
            Make sure to remove the fibrous core from cassava before cooking to avoid
            any bitterness.
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
              href="https://en.wikipedia.org/wiki/Escondidinho"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Escondidinho (Brazilian Cassava Casserole)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/cassava"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Cassava Overview
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
      jsonLd={[faqJsonLd, recipeJsonLd]}
      hideLegalDisclaimer={true}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}