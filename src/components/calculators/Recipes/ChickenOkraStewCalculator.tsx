import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChickenOkraStewCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chicken%20and%20Okra%20Stew%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5436"
  );

  // --- DATA ---
  const title = "Chicken and Okra Stew";
  const description = "Savory bone-in chicken braised with fresh okra.";

  // INGREDIENTS
  const ingredients = [
    { name: "Bone-in Chicken Thighs", baseAmount: 600, unit: "g" },
    { name: "Fresh Okra", baseAmount: 300, unit: "g" },
    { name: "Yellow Onion, diced", baseAmount: 1, unit: "medium" },
    { name: "Garlic Cloves, minced", baseAmount: 4, unit: "cloves" },
    { name: "Ripe Tomatoes, chopped", baseAmount: 400, unit: "g" },
    { name: "Chicken Broth", baseAmount: 500, unit: "ml" },
    { name: "Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Smoked Paprika", baseAmount: 1, unit: "tsp" },
    { name: "Ground Cumin", baseAmount: 1, unit: "tsp" },
    { name: "Dried Thyme", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.75, unit: "tsp" },
    { name: "Fresh Parsley, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Lemon Juice", baseAmount: 1, unit: "tbsp" },
  ];

  const nutrition = {
    calories: "420",
    protein: "38g",
    carbs: "12g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use frozen okra instead of fresh?",
      answer:
        "While fresh okra is preferred for its texture and flavor, frozen okra can be used as a substitute. However, frozen okra tends to be softer and may release more mucilage, which can slightly thicken the stew. To minimize sliminess, rinse frozen okra under cold water before cooking and avoid overcooking it.",
    },
    {
      question: "What cut of chicken works best for this stew?",
      answer:
        "Bone-in chicken thighs are ideal for this stew due to their rich flavor and tenderness after braising. They also help keep the meat moist. You can substitute with bone-in chicken drumsticks or a mix of thighs and drumsticks. Boneless chicken breasts are less recommended as they can dry out during cooking.",
    },
    {
      question: "How do I prevent the stew from becoming too slimy?",
      answer:
        "Okra naturally releases mucilage which can thicken the stew. To reduce sliminess, cook okra separately by sautéing it quickly at high heat before adding it to the stew. Also, avoid stirring the stew excessively once okra is added. Adding acidic ingredients like lemon juice or tomatoes helps cut through the mucilage.",
    },
    {
      question: "Can I make this stew in advance?",
      answer:
        "Yes, this stew tastes even better the next day as the flavors meld together. Store it in an airtight container in the refrigerator for up to 3 days. Reheat gently on the stove over low heat, adding a splash of broth or water if it thickens too much.",
    },
    {
      question: "What side dishes pair well with Chicken and Okra Stew?",
      answer:
        "This hearty stew pairs wonderfully with steamed white rice, crusty bread, or creamy polenta. A simple green salad with a light vinaigrette can also complement the rich flavors and provide a refreshing contrast.",
    },
    {
      question: "Is this recipe gluten-free and dairy-free?",
      answer:
        "Yes, this recipe is naturally gluten-free and dairy-free, making it suitable for those with gluten or dairy sensitivities. Just ensure your chicken broth is gluten-free if using store-bought.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Chicken and Okra Stew"
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
            Chicken and Okra Stew is a comforting and hearty dish that combines tender,
            bone-in chicken thighs with fresh okra, simmered in a rich tomato and
            aromatic spice broth. This stew is beloved in many Southern and Creole
            kitchens, celebrated for its balance of bold flavors and satisfying texture.
            The okra adds a unique velvety thickness while complementing the savory
            chicken perfectly.
          </p>
          <p>
            The origins of chicken and okra stew trace back to African and Southern
            American culinary traditions, where okra was introduced as a staple vegetable.
            Over generations, it became a key ingredient in stews and gumbos, prized for
            its ability to thicken dishes naturally. This recipe honors that heritage,
            bringing together simple ingredients with expert technique to create a
            flavorful, soul-warming meal.
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
              Prepare the Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the chicken thighs and pat dry. Trim the okra ends and slice into
              1-inch pieces. Dice the onion, mince the garlic, and chop the tomatoes.
              Set aside the fresh parsley and measure out the spices.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Brown the Chicken
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large heavy-bottomed pot over medium-high heat.
              Season chicken with salt and pepper, then brown on all sides until golden,
              about 4-5 minutes per side. Remove chicken and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Aromatics and Spices
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In the same pot, add diced onion and sauté until translucent, about 5
              minutes. Add minced garlic, smoked paprika, cumin, and thyme; cook for
              another minute until fragrant.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Tomatoes and Broth
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in chopped tomatoes and cook for 5 minutes until they soften. Pour in
              chicken broth and bring to a simmer.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Braise the Chicken
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Return the browned chicken to the pot. Cover and simmer gently for 25-30
              minutes until the chicken is cooked through and tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Okra and Finish Cooking
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the sliced okra to the stew and cook uncovered for another 10 minutes,
              stirring gently to avoid breaking the okra. Finish with fresh lemon juice
              and chopped parsley. Adjust seasoning with salt and pepper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              7
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Enjoy
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the stew hot over steamed rice or with crusty bread. Garnish with
              extra parsley if desired.
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
            To reduce okra's sliminess, sauté it separately at high heat before adding
            to the stew.
          </li>
          <li>
            Use bone-in chicken for richer flavor and juicier meat; skin-on adds extra
            depth but can be removed after cooking if preferred.
          </li>
          <li>
            Adding a splash of lemon juice brightens the stew and balances the richness.
          </li>
          <li>
            Let the stew rest for a few minutes after cooking to allow flavors to meld.
          </li>
          <li>
            For a smoky twist, consider adding a small amount of smoked sausage or
            smoked paprika.
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
              href="https://en.wikipedia.org/wiki/Okra"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Okra History and Culinary Uses
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.southernliving.com/recipes/chicken-and-okra-stew"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Southern Living: Chicken and Okra Stew Recipe
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