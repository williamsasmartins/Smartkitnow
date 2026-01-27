import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

import { getRecipeSchema } from "@/components/RecipeSchema";

export default function BeanPureeSausageTutuCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Bean%20Pure%20with%20Sausage%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3013"
  );

  // --- DATA ---
  const title = "Bean Purée with Sausage";
  const description = "Thick bean sauce thickened with cassava flour and pork.";

  // INGREDIENTS
  const ingredients = [
    { name: "Cannellini Beans (dry)", baseAmount: 250, unit: "g" },
    { name: "Italian Sausage (pork)", baseAmount: 300, unit: "g" },
    { name: "Cassava Flour", baseAmount: 30, unit: "g" },
    { name: "Garlic Cloves", baseAmount: 3, unit: "pcs" },
    { name: "Yellow Onion", baseAmount: 1, unit: "medium" },
    { name: "Extra Virgin Olive Oil", baseAmount: 40, unit: "ml" },
    { name: "Chicken Broth", baseAmount: 500, unit: "ml" },
    { name: "Fresh Rosemary", baseAmount: 1, unit: "sprig" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 1, unit: "tsp" },
    { name: "Lemon Juice", baseAmount: 15, unit: "ml" },
    { name: "Fresh Parsley (chopped)", baseAmount: 15, unit: "g" },
    { name: "Red Chili Flakes (optional)", baseAmount: 0.5, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "28g",
    carbs: "35g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use canned beans instead of dry beans?",
      answer:
        "Yes, you can substitute canned cannellini beans to save time. Drain and rinse them well before use. Adjust the cooking time accordingly, as canned beans are already cooked and will only need to be heated through.",
    },
    {
      question: "What type of sausage works best for this recipe?",
      answer:
        "Italian pork sausage with fennel and mild spices is ideal for this dish, as it complements the creamy bean purée. You can use spicy sausage if you prefer a bit of heat, or substitute with chicken sausage for a lighter option.",
    },
    {
      question: "How does cassava flour affect the texture?",
      answer:
        "Cassava flour acts as a natural thickener, giving the purée a smooth, velvety texture without overpowering the flavor. It also helps bind the sauce, making it rich and creamy without using dairy.",
    },
    {
      question: "Can I make this recipe vegan or vegetarian?",
      answer:
        "To make a vegan version, omit the sausage and use vegetable broth instead of chicken broth. You can add smoked paprika or liquid smoke to mimic the smoky flavor of sausage. Consider adding sautéed mushrooms or tempeh for protein.",
    },
    {
      question: "What is the best way to store leftovers?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days. Reheat gently on the stove or in the microwave, adding a splash of broth or water if the purée thickens too much.",
    },
    {
      question: "Can I prepare parts of this recipe in advance?",
      answer:
        "Absolutely! You can soak and cook the beans a day ahead and refrigerate them. The sausage can also be cooked in advance and stored separately. Assemble and heat everything just before serving for best freshness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const recipeJsonLd = getRecipeSchema({
    name: title,
    description: description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT1H",
    totalTime: "PT1H20M",
    recipeYield: "4 servings",
    recipeCategory: "Main Course",
    recipeCuisine: "Brazilian",
    keywords: "bean puree with sausage, tutu de feijão, brazilian bean puree, cassava flour, hearty stew",
    recipeIngredient: ingredients.map(ing => `${ing.baseAmount}${ing.unit} ${ing.name}`),
    recipeInstructions: [
      "Rinse the dry cannellini beans and soak them overnight in plenty of cold water. Drain and rinse again, then place in a pot with fresh water and a sprig of rosemary. Simmer gently for about 1 hour or until tender. Drain, reserving some cooking liquid.",
      "Remove the sausage casing and crumble the meat. In a large skillet, heat half the olive oil over medium heat. Add the sausage and cook until browned and cooked through. Remove and set aside. In the same pan, add the remaining oil, finely chopped onion, and minced garlic. Sauté until translucent and fragrant.",
      "Add the cooked beans, sausage, and chicken broth to the skillet with the aromatics. Stir well and bring to a gentle simmer. Gradually sprinkle in the cassava flour while stirring constantly to avoid lumps. Cook for 5-7 minutes until the purée thickens to a creamy consistency.",
      "Season the purée with salt, black pepper, and red chili flakes if using. Stir in fresh lemon juice to brighten the flavors. Remove the rosemary sprig. Garnish with chopped fresh parsley before serving."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Bean Purée with Sausage"
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
            This Bean Purée with Sausage is a hearty and comforting dish that
            combines creamy cannellini beans with savory Italian sausage,
            thickened naturally with cassava flour. The purée is rich in flavor,
            smooth in texture, and perfect as a main course or a side dish. It
            showcases the beauty of simple ingredients elevated through careful
            technique and seasoning.
          </p>
          <p>
            Originating from rustic Italian countryside cooking, this recipe
            reflects the tradition of using beans as a staple protein source,
            paired with cured or fresh pork sausage to add depth and richness.
            Cassava flour is a gluten-free thickener that has been embraced in
            modern adaptations to create a velvety sauce without dairy. This
            dish embodies the essence of Italian comfort food with a modern
            twist.
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
              Soak and Cook the Beans
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the dry cannellini beans and soak them overnight in plenty of
              cold water. Drain and rinse again, then place in a pot with fresh
              water and a sprig of rosemary. Simmer gently for about 1 hour or
              until tender. Drain, reserving some cooking liquid.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Sausage and Aromatics
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the sausage casing and crumble the meat. In a large skillet,
              heat half the olive oil over medium heat. Add the sausage and cook
              until browned and cooked through. Remove and set aside. In the same
              pan, add the remaining oil, finely chopped onion, and minced garlic.
              Sauté until translucent and fragrant.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Combine Ingredients and Thicken
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the cooked beans, sausage, and chicken broth to the skillet with
              the aromatics. Stir well and bring to a gentle simmer. Gradually
              sprinkle in the cassava flour while stirring constantly to avoid
              lumps. Cook for 5-7 minutes until the purée thickens to a creamy
              consistency.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season and Finish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Season the purée with salt, black pepper, and red chili flakes if
              using. Stir in fresh lemon juice to brighten the flavors. Remove the
              rosemary sprig. Garnish with chopped fresh parsley before serving.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Enjoy
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the bean purée warm as a main dish or alongside crusty bread or
              roasted vegetables. This dish pairs beautifully with a light red wine
              or a crisp white.
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
            For a silkier purée, blend half of the cooked beans before mixing with
            the rest.
          </li>
          <li>
            Toast the cassava flour lightly in a dry pan before adding to enhance
            its nutty flavor.
          </li>
          <li>
            Use homemade chicken broth or low-sodium store-bought broth for better
            depth of flavor.
          </li>
          <li>
            If you prefer a smoky note, add a small amount of smoked paprika or
            chipotle powder.
          </li>
          <li>
            Garnish with a drizzle of high-quality olive oil and a sprinkle of
            freshly cracked black pepper for an elegant finish.
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
      jsonLd={[faqJsonLd, recipeJsonLd]}
      hideLegalDisclaimer={true}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
