import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function SlowCookedPorkRibsCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/SlowCooked%20Pork%20Ribs%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6567"
  );

  // --- DATA ---
  const title = "Slow-Cooked Pork Ribs";
  const description = "Tender, fall-off-the-bone ribs with Brazilian spices.";

  // INGREDIENTS
  const ingredients = [
    { name: "Pork Ribs", baseAmount: 1000, unit: "g" },
    { name: "Brown Sugar", baseAmount: 50, unit: "g" },
    { name: "Paprika", baseAmount: 15, unit: "g" },
    { name: "Garlic Powder", baseAmount: 10, unit: "g" },
    { name: "Onion Powder", baseAmount: 10, unit: "g" },
    { name: "Ground Cumin", baseAmount: 5, unit: "g" },
    { name: "Chili Powder", baseAmount: 7, unit: "g" },
    { name: "Salt", baseAmount: 10, unit: "g" },
    { name: "Black Pepper", baseAmount: 5, unit: "g" },
    { name: "Olive Oil", baseAmount: 30, unit: "ml" },
    { name: "Apple Cider Vinegar", baseAmount: 60, unit: "ml" },
    { name: "Honey", baseAmount: 30, unit: "ml" },
    { name: "Water", baseAmount: 120, unit: "ml" },
    { name: "Fresh Cilantro (for garnish)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "550",
    protein: "45g",
    carbs: "20g",
    fat: "30g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the best cut of pork ribs for slow cooking?",
      answer:
        "The best cut for slow-cooked pork ribs is baby back ribs or St. Louis-style spare ribs. Baby back ribs are leaner and cook faster, while St. Louis ribs have more fat and connective tissue, which breaks down beautifully during slow cooking, resulting in tender, flavorful meat.",
    },
    {
      question: "How long should I slow cook pork ribs for optimal tenderness?",
      answer:
        "For tender, fall-off-the-bone ribs, slow cook them at a low temperature (around 120-135°C / 250-275°F) for 3 to 4 hours. This slow process breaks down collagen and connective tissue without drying out the meat.",
    },
    {
      question: "Can I prepare the ribs in advance and reheat them?",
      answer:
        "Yes, you can prepare the ribs a day ahead, store them in an airtight container in the refrigerator, and gently reheat them in the oven at low temperature. This also allows the flavors to meld even more.",
    },
    {
      question: "What are some good side dishes to serve with slow-cooked pork ribs?",
      answer:
        "Classic sides include coleslaw, cornbread, baked beans, roasted vegetables, or a fresh green salad. These complement the rich, smoky flavors of the ribs and add balance to the meal.",
    },
    {
      question: "How can I make the ribs spicier or milder?",
      answer:
        "Adjust the chili powder and paprika quantities to control the heat level. For spicier ribs, add cayenne pepper or hot sauce. For milder ribs, reduce or omit the chili powder and balance with more brown sugar or honey.",
    },
    {
      question: "Is it necessary to marinate the ribs overnight?",
      answer:
        "While not strictly necessary, marinating the ribs overnight enhances flavor penetration and tenderizes the meat. If short on time, even a 1-2 hour marination can improve taste significantly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT4H",
    totalTime: "PT4H20M",
    recipeYield: `${servings} servings`,
    recipeCategory: "Main Course",
    recipeCuisine: "Brazilian",
    keywords: "pork ribs, slow cooked ribs, brazilian spices, BBQ, costelinha de porco",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Combine spices to create a dry rub.",
      "Pat ribs dry and rub thoroughly with the spice mix, then refrigerate for at least 2 hours.",
      "Whisk together oil, vinegar, honey, and water for the cooking liquid.",
      "Place ribs in a slow cooker or roasting pan, pour liquid over, and cook for 3-4 hours.",
      "Optionally broil for a caramelized finish and garnish with fresh cilantro."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Slow-Cooked Pork Ribs"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 4h
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
            Slow-cooked pork ribs are a culinary delight, prized for their tender,
            juicy texture and rich, smoky flavor. This recipe infuses the ribs with a
            blend of Brazilian-inspired spices, creating a harmonious balance of sweet,
            savory, and mildly spicy notes. The slow cooking process allows the meat to
            fall off the bone effortlessly, making it perfect for a comforting family
            meal or an impressive dish for guests.
          </p>
          <p>
            The tradition of slow cooking pork ribs has roots in many cultures, but
            Brazilian cuisine adds its unique touch with vibrant spices and a hint of
            sweetness. This method not only tenderizes the meat but also deepens the
            flavors, resulting in a dish that is both hearty and sophisticated.
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
              Prepare the Dry Rub
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, combine brown sugar, paprika, garlic powder, onion powder,
              ground cumin, chili powder, salt, and black pepper. Mix thoroughly to
              create a balanced dry rub.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season the Ribs
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pat the pork ribs dry with paper towels. Rub the dry spice mix evenly all
              over the ribs, pressing gently to adhere. Wrap in plastic wrap and
              refrigerate for at least 2 hours, preferably overnight.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Cooking Liquid
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small bowl, whisk together olive oil, apple cider vinegar, honey, and
              water. This mixture will keep the ribs moist and add a subtle tangy-sweet
              flavor during cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Slow Cook the Ribs
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the ribs in a slow cooker or a covered roasting pan. Pour the
              cooking liquid over the ribs. Cook on low heat for 3 to 4 hours until the
              meat is tender and easily pulls away from the bone.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Finish and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Optional: For a caramelized finish, brush the ribs with extra honey or
              barbecue sauce and broil for 3-5 minutes. Garnish with fresh cilantro and
              serve hot with your favorite sides.
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
            For extra smoky flavor, add a few wood chips to your slow cooker or oven
            setup, or finish the ribs on a grill for a few minutes.
          </li>
          <li>
            Remove the silver skin membrane from the back of the ribs before seasoning
            to allow better flavor absorption and tenderness.
          </li>
          <li>
            Use a meat thermometer to ensure ribs reach an internal temperature of
            about 90°C (195°F) for perfect tenderness.
          </li>
          <li>
            Leftover ribs can be shredded and used in sandwiches or tacos for a tasty
            second meal.
          </li>
          <li>
            Experiment with adding smoked paprika or chipotle powder for a deeper,
            smoky heat.
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
              href="https://www.seriouseats.com/how-to-cook-pork-ribs-slow-cooker-oven"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Cook Pork Ribs Slow and Low
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.bonappetit.com/recipe/slow-cooker-pork-ribs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Bon Appétit: Slow Cooker Pork Ribs Recipe
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://en.wikipedia.org/wiki/Barbecue_in_Brazil"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Barbecue in Brazil
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