import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChickenStroganoffBrazilianStyleCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/BrazilianStyle%20Chicken%20Stroganoff%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9843"
  );

  // --- DATA ---
  const title = "Brazilian-Style Chicken Stroganoff";
  const description = "A lighter chicken version of the beloved creamy stroganoff.";

  // INGREDIENTS
  const ingredients = [
    { name: "Chicken breast, diced", baseAmount: 500, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 2, unit: "cloves" },
    { name: "Tomato sauce", baseAmount: 200, unit: "ml" },
    { name: "Heavy cream", baseAmount: 200, unit: "ml" },
    { name: "Ketchup", baseAmount: 2, unit: "tbsp" },
    { name: "Mustard", baseAmount: 1, unit: "tbsp" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Butter", baseAmount: 1, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh parsley, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "White mushrooms, sliced", baseAmount: 150, unit: "g" },
    { name: "Water or chicken broth", baseAmount: 100, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "350",
    protein: "38g",
    carbs: "10g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use chicken thighs instead of chicken breast?",
      answer:
        "Yes, chicken thighs can be used and will add more juiciness and flavor due to their higher fat content. Adjust cooking time slightly to ensure they are fully cooked and tender.",
    },
    {
      question: "What can I substitute for heavy cream in this recipe?",
      answer:
        "You can substitute heavy cream with coconut cream for a dairy-free option or use half-and-half mixed with a bit of butter to mimic the richness. Keep in mind the flavor profile may slightly change.",
    },
    {
      question: "Is it necessary to add ketchup and mustard?",
      answer:
        "Ketchup and mustard are traditional ingredients in Brazilian chicken stroganoff that provide a subtle tang and sweetness balancing the creaminess. You can reduce or omit them if preferred, but the flavor will be less authentic.",
    },
    {
      question: "How do I store leftovers and how long do they last?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days. Reheat gently on the stove or microwave to avoid curdling the cream. Avoid freezing as the texture may change.",
    },
    {
      question: "What side dishes pair well with Brazilian chicken stroganoff?",
      answer:
        "This dish is traditionally served with white rice and shoestring potatoes (batata palha). You can also serve it with mashed potatoes, pasta, or a fresh green salad for a balanced meal.",
    },
    {
      question: "Can I make this recipe spicy?",
      answer:
        "Absolutely! Adding a pinch of cayenne pepper, chopped fresh chili, or a dash of hot sauce can give the stroganoff a pleasant kick without overpowering the creamy base.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian-Style Chicken Stroganoff"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Brazilian-Style Chicken Stroganoff is a beloved comfort dish that
            blends the creamy richness of traditional Russian stroganoff with
            the vibrant flavors and ingredients popular in Brazil. This lighter
            version uses tender chicken breast instead of beef, making it a
            perfect weeknight meal that is both satisfying and easy to prepare.
          </p>
          <p>
            The dish gained popularity in Brazil during the mid-20th century,
            evolving from the classic beef stroganoff brought by European
            immigrants. Over time, Brazilian cooks adapted the recipe by
            incorporating local ingredients like ketchup and mustard, which add
            a subtle tang and sweetness. Served traditionally with white rice
            and crispy shoestring potatoes, it has become a staple in Brazilian
            households and restaurants alike.
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
              Prepare Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Dice the chicken breast into bite-sized pieces. Finely chop the
              onion and mince the garlic cloves. Slice the mushrooms and chop
              the fresh parsley. Measure out the tomato sauce, heavy cream,
              ketchup, and mustard.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Aromatics and Chicken
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil and butter in a large skillet over medium heat.
              Add the chopped onion and garlic, sautéing until translucent and
              fragrant, about 3-4 minutes. Add the diced chicken and cook until
              browned on all sides but not fully cooked through, about 5-6
              minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Mushrooms and Liquids
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the sliced mushrooms and cook until softened, about 4
              minutes. Pour in the tomato sauce and water or chicken broth,
              stirring to combine. Let simmer for 5 minutes to meld flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Finish with Cream and Seasonings
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Lower the heat and stir in the heavy cream, ketchup, and mustard.
              Season with salt and black pepper to taste. Cook gently for 3-4
              minutes until the sauce thickens slightly and the chicken is
              cooked through.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Garnish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove from heat and sprinkle with chopped fresh parsley. Serve
              hot over white rice and accompany with shoestring potatoes or a
              fresh salad for a complete meal.
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
            For extra depth of flavor, marinate the chicken in a little garlic,
            mustard, and olive oil for 30 minutes before cooking.
          </li>
          <li>
            Use fresh mushrooms for the best texture; canned mushrooms tend to
            make the sauce watery.
          </li>
          <li>
            To keep the cream from curdling, add it at the end of cooking and
            avoid boiling the sauce vigorously.
          </li>
          <li>
            Shoestring potatoes (batata palha) add a delightful crunch and are
            a traditional Brazilian accompaniment.
          </li>
          <li>
            Adjust the ketchup and mustard quantities to your taste for a
            sweeter or tangier sauce.
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
              href="https://en.wikipedia.org/wiki/Chicken_stroganoff"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Chicken Stroganoff
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.brazilianfoodrecipes.com/chicken-stroganoff"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Brazilian Food Recipes: Chicken Stroganoff
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