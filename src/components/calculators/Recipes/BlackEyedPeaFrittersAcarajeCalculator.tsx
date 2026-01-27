import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function BlackEyedPeaFrittersAcarajeCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/BlackEyed%20Pea%20Fritters%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=293"
  );

  // --- DATA ---
  const title = "Black-Eyed Pea Fritters";
  const description = "Afro-Brazilian deep-fried peeled black-eyed pea balls.";

  // INGREDIENTS
  const ingredients = [
    { name: "Black-eyed peas (peeled)", baseAmount: 500, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 100, unit: "g" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "pcs" },
    { name: "Fresh parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Dende oil (palm oil)", baseAmount: 100, unit: "ml" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Ground black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Cayenne pepper", baseAmount: 0.25, unit: "tsp" },
    { name: "Water (if needed)", baseAmount: 50, unit: "ml" },
    { name: "Vegetable oil (for frying)", baseAmount: 500, unit: "ml" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "pcs" },
    { name: "Hot sauce (optional)", baseAmount: 50, unit: "ml" },
  ];

  // Nutrition per 4 servings (approximate)
  const nutrition = {
    calories: "420",
    protein: "18g",
    carbs: "45g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What are Black-Eyed Pea Fritters (Acarajé)?",
      answer:
        "Black-Eyed Pea Fritters, known as Acarajé in Brazil, are deep-fried balls made from peeled black-eyed peas mixed with onions and spices. Originating from Afro-Brazilian cuisine, they are a popular street food especially in the northeastern state of Bahia. The fritters are traditionally fried in dende (palm) oil, giving them a distinctive flavor and vibrant color.",
    },
    {
      question: "How do I properly peel black-eyed peas for this recipe?",
      answer:
        "Peeling black-eyed peas involves soaking them overnight to soften the skins, then rubbing them between your hands or using a coarse sieve to remove the skins. This step is essential to achieve the smooth, creamy texture characteristic of authentic acarajé. Alternatively, you can purchase pre-peeled black-eyed peas to save time.",
    },
    {
      question: "Can I substitute dende oil with another oil?",
      answer:
        "Dende oil (red palm oil) imparts a unique flavor and color to acarajé, but if unavailable, you can substitute it with refined vegetable oil or peanut oil. However, the taste and appearance will differ from the traditional version. For frying, use a neutral oil with a high smoke point to ensure crispiness.",
    },
    {
      question: "How do I know when the fritters are cooked properly?",
      answer:
        "Fritters should be golden brown and crispy on the outside while fully cooked and soft inside. Fry them in hot oil (around 180°C / 350°F) for about 5-7 minutes, turning occasionally for even cooking. Avoid overcrowding the pan to maintain oil temperature and crispiness.",
    },
    {
      question: "What are some traditional accompaniments for acarajé?",
      answer:
        "Acarajé is often served with spicy vatapá (a creamy paste made from bread, shrimp, coconut milk, and peanuts), caruru (okra stew), fresh lime wedges, and hot sauce. These accompaniments enhance the flavors and provide a balanced taste experience.",
    },
    {
      question: "Is this recipe suitable for vegans?",
      answer:
        "Yes, this recipe is naturally vegan as it uses plant-based ingredients. Just ensure that any accompaniments or sauces you serve with it are also vegan-friendly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const recipeJsonLd = getRecipeSchema({
    name: title,
    description: description,
    image: imgSrc,
    prepTime: "PT20M",
    cookTime: "PT10M",
    totalTime: "PT30M",
    recipeYield: "4 servings",
    recipeCategory: "Appetizer",
    recipeCuisine: "Brazilian",
    keywords: "acaraje, black eyed pea fritters, brazilian street food, bahian cuisine, dende oil",
    recipeIngredient: ingredients.map(ing => `${ing.baseAmount}${ing.unit} ${ing.name}`),
    recipeInstructions: [
      "Rinse the black-eyed peas and soak them in plenty of water overnight (8-12 hours). After soaking, drain and rub the peas between your hands or against a coarse sieve to remove the skins. Rinse and repeat until most skins are removed. Drain well.",
      "In a food processor or blender, combine the peeled black-eyed peas, chopped onion, minced garlic, parsley, salt, black pepper, and cayenne pepper. Blend until you get a smooth, thick batter. Add a little water if needed to help blend, but keep the batter thick.",
      "Pour dende oil into a deep frying pan or pot to a depth of about 5 cm (2 inches). Heat over medium-high heat until it reaches 180°C (350°F).",
      "Using a spoon or your hands, shape the batter into small balls or ovals and carefully drop them into the hot oil. Fry in batches, turning occasionally, until golden brown and crispy, about 5-7 minutes. Remove with a slotted spoon and drain on paper towels.",
      "Serve the fritters hot with lime wedges and optional hot sauce or traditional Bahian fillings like vatapá and caruru."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Black-Eyed Pea Fritters"
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
            Black-Eyed Pea Fritters, or Acarajé, are a beloved Afro-Brazilian
            delicacy originating from the northeastern state of Bahia. These
            deep-fried fritters are made from peeled black-eyed peas blended
            with aromatic onions, garlic, and spices, then fried to golden
            perfection in dende oil, a rich palm oil that imparts a unique
            flavor and vibrant color. Traditionally sold by street vendors
            called "baianas," acarajé is often served with spicy fillings and
            sauces, making it a flavorful and hearty snack or meal.
          </p>
          <p>
            The recipe traces its roots back to West African culinary traditions,
            brought to Brazil by enslaved Africans. Over centuries, it has
            evolved into a cultural symbol of Afro-Brazilian identity and
            resilience. Today, acarajé is celebrated not only for its delicious
            taste but also for its rich cultural heritage, enjoyed by locals and
            visitors alike.
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
              Soak and Peel the Black-Eyed Peas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the black-eyed peas and soak them in plenty of water overnight
              (8-12 hours). After soaking, drain and rub the peas between your
              hands or against a coarse sieve to remove the skins. Rinse and
              repeat until most skins are removed. Drain well.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Blend the Batter
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a food processor or blender, combine the peeled black-eyed peas,
              chopped onion, minced garlic, parsley, salt, black pepper, and
              cayenne pepper. Blend until you get a smooth, thick batter. Add a
              little water if needed to help blend, but keep the batter thick.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Heat the Dende Oil
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour dende oil into a deep frying pan or pot to a depth of about 5 cm
              (2 inches). Heat over medium-high heat until it reaches 180°C (350°F).
              Use a thermometer for accuracy.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Fry the Fritters
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Using a spoon or your hands, shape the batter into small balls or
              ovals and carefully drop them into the hot oil. Fry in batches,
              turning occasionally, until golden brown and crispy, about 5-7
              minutes. Remove with a slotted spoon and drain on paper towels.
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
              Serve the fritters hot with lime wedges and optional hot sauce or
              traditional Bahian fillings like vatapá and caruru. Enjoy as a snack
              or part of a meal.
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
            Soaking and peeling the black-eyed peas thoroughly is key to a smooth
            batter and light fritters.
          </li>
          <li>
            Maintain the oil temperature around 180°C (350°F) to ensure the
            fritters cook evenly and absorb minimal oil.
          </li>
          <li>
            If the batter is too thick to blend, add water sparingly to avoid a
            runny consistency.
          </li>
          <li>
            Use fresh dende oil if possible for authentic flavor and color; it can
            be found in specialty or Brazilian markets.
          </li>
          <li>
            Serve immediately after frying for the best texture and flavor.
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
              href="https://en.wikipedia.org/wiki/Acaraj%C3%A9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Acarajé
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Acaraje"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Acarajé
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Acaraje-Black-Eyed-Pea-Fritters/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Acarajé Recipe & History
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