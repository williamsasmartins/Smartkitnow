import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function SnacksPaoDeQueijoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Cheese%20Bread%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3408"
  );

  // --- DATA ---
  const title = "Brazilian Cheese Bread";
  const description = "The ultimate gluten-free street snack found in every bakery.";

  // INGREDIENTS
  const ingredients = [
    { name: "Tapioca flour (polvilho doce)", baseAmount: 250, unit: "g" },
    { name: "Whole milk", baseAmount: 120, unit: "ml" },
    { name: "Water", baseAmount: 120, unit: "ml" },
    { name: "Vegetable oil (or melted butter)", baseAmount: 60, unit: "ml" },
    { name: "Large eggs", baseAmount: 2, unit: "pcs" },
    { name: "Grated Parmesan cheese", baseAmount: 150, unit: "g" },
    { name: "Grated mozzarella cheese", baseAmount: 100, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Sugar", baseAmount: 1, unit: "tsp" },
    { name: "Baking powder", baseAmount: 0.5, unit: "tsp" },
    { name: "Optional: garlic powder", baseAmount: 0.25, unit: "tsp" },
    { name: "Optional: finely chopped fresh parsley", baseAmount: 1, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate for 4 servings)
  const nutrition = {
    calories: "280",
    protein: "10g",
    carbs: "25g",
    fat: "14g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes Pão de Queijo gluten-free?",
      answer:
        "Pão de Queijo is naturally gluten-free because it uses tapioca flour, which is derived from cassava root and contains no gluten. This makes it a great snack option for those with gluten intolerance or celiac disease.",
    },
    {
      question: "Can I substitute the cheeses used in this recipe?",
      answer:
        "Yes, you can substitute the traditional Parmesan and mozzarella with other cheeses like cheddar or a local cheese with good melting properties. However, the flavor and texture might vary slightly from the classic taste.",
    },
    {
      question: "How do I store leftover Brazilian Cheese Bread?",
      answer:
        "Store leftovers in an airtight container at room temperature for up to 2 days. To reheat, warm them in an oven at 180°C (350°F) for 5-7 minutes to regain their crisp exterior and soft interior.",
    },
    {
      question: "Can I freeze Pão de Queijo dough or baked bread?",
      answer:
        "Yes, you can freeze the dough in balls before baking for up to 1 month. Thaw in the refrigerator overnight and bake as usual. Baked bread can also be frozen and reheated, but fresh baking yields the best texture.",
    },
    {
      question: "Why does the dough feel sticky and hard to handle?",
      answer:
        "The dough is naturally sticky due to the tapioca flour and moisture content. This is normal. Using wet or oiled hands when shaping the dough balls helps prevent sticking and makes handling easier.",
    },
    {
      question: "Can I make Pão de Queijo vegan?",
      answer:
        "Traditional Pão de Queijo contains eggs and cheese, but vegan versions can be made using plant-based cheese alternatives and egg replacers. The texture and flavor will differ, so experimentation is recommended.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT15M",
    totalTime: "PT35M",
    recipeYield: `${servings} portions`,
    recipeCategory: "Snack",
    recipeCuisine: "Brazilian",
    keywords: "pao de queijo, cheese bread, brazilian snack, gluten-free, appetizer, traditional recipe",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Boil milk, water, and oil, then pour over tapioca flour and stir.",
      "Cool slightly, then mix in beaten eggs, Parmesan, mozzarella, and baking powder.",
      "Add garlic powder or parsley if desired, mixing into a smooth dough.",
      "Shape into 3-4 cm balls with oiled hands.",
      "Bake at 200°C (390°F) for 15-20 minutes until puffed and golden."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Cheese Bread"
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
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-base">
          <div>
            <div className="font-bold text-lg">{nutrition.calories}</div>
            <span className="font-bold uppercase text-slate-500">Kcal</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.protein}</div>
            <span className="font-bold uppercase text-slate-500">Prot</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.carbs}</div>
            <span className="font-bold uppercase text-slate-500">Carb</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.fat}</div>
            <span className="font-bold uppercase text-slate-500">Fat</span>
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
            Brazilian Cheese Bread, or Pão de Queijo, is a beloved gluten-free snack
            originating from Brazil. Known for its chewy texture and cheesy flavor,
            it is a staple in Brazilian bakeries and street food culture. Made primarily
            from tapioca flour and cheese, this bread is naturally gluten-free and
            perfect for those seeking a savory, satisfying bite.
          </p>
          <p>
            The origins of Pão de Queijo trace back to the 18th century in the state of
            Minas Gerais, Brazil. It was initially created by African slaves using
            cassava starch and local cheese. Over time, it evolved into the popular
            snack enjoyed today, symbolizing Brazilian culinary heritage and comfort food.
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
              Prepare the liquid mixture
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a medium saucepan, combine the milk, water, vegetable oil, salt, and
              sugar. Bring to a gentle boil over medium heat, stirring occasionally.
              Once boiling, remove from heat.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Mix tapioca flour and hot liquid
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the tapioca flour in a large mixing bowl. Pour the hot liquid over
              the flour and stir vigorously with a wooden spoon until smooth and
              slightly sticky. Let it cool for about 10 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add eggs, cheese, and optional ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Beat the eggs lightly and add them to the dough along with the grated
              Parmesan, mozzarella, baking powder, and optional garlic powder and
              parsley. Mix thoroughly until the dough is smooth and elastic.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shape the dough balls
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              With wet or oiled hands, shape the dough into small balls about 3-4 cm
              in diameter. Place them on a baking sheet lined with parchment paper,
              spaced about 3 cm apart.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake until golden and puffed
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat the oven to 200°C (390°F). Bake the dough balls for 15-20 minutes
              or until they puff up and develop a golden crust. Serve warm for the
              best texture and flavor.
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
            Use a combination of Parmesan and mozzarella for authentic flavor and
            meltiness; you can adjust ratios to your taste.
          </li>
          <li>
            If the dough feels too sticky to handle, wet your hands with water or oil
            before shaping each ball to prevent sticking.
          </li>
          <li>
            Baking at a high temperature ensures the bread puffs up nicely and forms
            a crisp crust while staying chewy inside.
          </li>
          <li>
            For a richer flavor, substitute vegetable oil with melted butter.
          </li>
          <li>
            Experiment with adding herbs like rosemary or spices like smoked paprika
            for a unique twist.
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
              href="https://en.wikipedia.org/wiki/P%C3%A3o_de_queijo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Pão de Queijo
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Pao-de-Queijo-Brazilian-Cheese-Bread/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Authentic Brazilian Cheese Bread Recipe
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.brazil.org.za/brazilian-cheese-bread-pao-de-queijo/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Brazil.org.za: Brazilian Cheese Bread Overview
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