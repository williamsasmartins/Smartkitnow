import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function CassavaFriesCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Cassava%20Fries%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2544"
  );

  // --- DATA ---
  const title = "Cassava Fries";
  const description = "A crispy, starchy alternative to traditional potato fries.";

  // INGREDIENTS
  const ingredients = [
    { name: "Cassava (peeled and cut into fries)", baseAmount: 500, unit: "g" },
    { name: "Vegetable oil (for frying)", baseAmount: 500, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Garlic powder", baseAmount: 0.5, unit: "tsp" },
    { name: "Paprika", baseAmount: 0.5, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.25, unit: "tsp" },
    { name: "Fresh parsley (chopped)", baseAmount: 2, unit: "tbsp" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "pcs" },
    { name: "Cornstarch (optional, for extra crispiness)", baseAmount: 2, unit: "tbsp" },
    { name: "Water (for soaking)", baseAmount: 1000, unit: "ml" },
    { name: "Salt (for soaking water)", baseAmount: 1, unit: "tbsp" },
    { name: "Mayonnaise (for dipping)", baseAmount: 100, unit: "g" },
    { name: "Chili powder (optional, for dipping sauce)", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh cilantro (optional, for garnish)", baseAmount: 1, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "2g",
    carbs: "35g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is cassava and why use it for fries?",
      answer:
        "Cassava, also known as yuca or manioc, is a starchy root vegetable native to South America and widely used in tropical regions. It has a slightly sweet, nutty flavor and a dense texture that crisps up beautifully when fried, making it an excellent alternative to traditional potato fries.",
    },
    {
      question: "How do I prepare cassava for frying?",
      answer:
        "First, peel the tough outer skin carefully to reveal the white flesh. Cut the cassava into fry-sized sticks, then soak them in salted water for at least 30 minutes to remove excess starch and prevent discoloration. After soaking, pat them dry thoroughly before frying.",
    },
    {
      question: "Can I bake cassava fries instead of frying?",
      answer:
        "Yes, baking is a healthier alternative. Toss the cassava fries with oil and seasoning, then bake at 220°C (425°F) for about 25-30 minutes, turning halfway through until golden and crispy. However, deep frying yields the crispiest texture.",
    },
    {
      question: "How do I make cassava fries extra crispy?",
      answer:
        "To achieve extra crispiness, after soaking and drying, lightly dust the cassava fries with cornstarch before frying. Also, ensure the oil is hot enough (around 180°C/350°F) to quickly seal the fries and prevent sogginess.",
    },
    {
      question: "Are cassava fries gluten-free and suitable for special diets?",
      answer:
        "Yes, cassava is naturally gluten-free and suitable for gluten-sensitive individuals. It is also vegan and paleo-friendly, making cassava fries a versatile option for various dietary preferences.",
    },
    {
      question: "What dipping sauces pair well with cassava fries?",
      answer:
        "Cassava fries pair wonderfully with garlic aioli, spicy mayo, chimichurri, or a simple squeeze of fresh lime. You can also try traditional sauces like ketchup or hot sauce for a familiar flavor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);
  const recipeJsonLd = getRecipeSchema({
    name: title,
    description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT10M",
    totalTime: "PT30M",
    recipeYield: `${servings} portions`,
    recipeCategory: "Appetizer",
    recipeCuisine: "Brazilian",
    keywords: "cassava fries, yuca fries, brazilian appetiser, fried mandioca, gluten-free snack, crispy side dish",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Peel, cut into sticks, and soak cassava in salted water for 30 minutes.",
      "Pat dry thoroughly and lightly dust with cornstarch if desired.",
      "Heat oil to 180°C (350°F).",
      "Fry in batches for 5-7 minutes until golden brown and crispy.",
      "Drain on paper towels, season with spices and parsley, and serve with lime."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Cassava Fries"
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
            Cassava fries are a delicious and crispy alternative to traditional potato fries, offering a unique texture and flavor. Made from the starchy root vegetable cassava, these fries are beloved in many tropical and subtropical regions around the world. Their slightly sweet and nutty taste combined with a satisfyingly crunchy exterior makes them a perfect snack or side dish.
          </p>
          <p>
            Originating from South America, cassava has been a staple food for centuries and is now widely cultivated in Africa, Asia, and the Caribbean. Cassava fries have gained popularity globally as a gluten-free and vegan-friendly option, often enjoyed with a variety of dipping sauces or simply seasoned with salt and lime.
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
              Peel the cassava roots carefully, removing the thick brown skin and the pinkish layer beneath. Cut the peeled cassava into sticks about the size of traditional fries. Place the cut cassava in a large bowl of cold salted water and soak for at least 30 minutes to remove excess starch and prevent discoloration.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Dry and Season
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Drain the cassava fries and pat them completely dry with a clean kitchen towel or paper towels. If you want extra crispy fries, toss them lightly with cornstarch. Then season with salt, garlic powder, paprika, and black pepper to your taste.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Heat the Oil
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a deep fryer or heavy-bottomed pot, heat vegetable oil to 180°C (350°F). Use enough oil to fully submerge the fries for even cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Fry the Cassava
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Fry the cassava fries in batches for about 5-7 minutes or until golden brown and crispy. Avoid overcrowding the pot to maintain oil temperature. Remove fries with a slotted spoon and drain on paper towels.
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
              While still hot, sprinkle the fries with fresh chopped parsley and an extra pinch of salt if needed. Serve immediately with lime wedges and your favorite dipping sauce.
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
            Soaking cassava fries in salted water helps remove excess starch and prevents them from turning gray or brown before frying.
          </li>
          <li>
            Make sure to dry the fries thoroughly before frying to avoid dangerous oil splatters and to achieve maximum crispiness.
          </li>
          <li>
            Use a thermometer to maintain consistent oil temperature; too low and fries become greasy, too high and they burn quickly.
          </li>
          <li>
            For a flavorful twist, toss fries with smoked paprika or chili powder after frying.
          </li>
          <li>
            Leftover cassava fries can be reheated in a hot oven or air fryer to restore crispiness.
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
              href="https://www.thespruceeats.com/cassava-fries-recipe-5207693"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Cassava Fries Recipe
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