import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { getRecipeSchema } from "@/components/RecipeSchema";

export default function SnacksPastelCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Crispy%20Fried%20Pastries%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2909"
  );

  // --- DATA ---
  const title = "Crispy Fried Pastries";
  const description = 'Traditional "Feira" (street market) large fried pastries.';

  // INGREDIENTS
  const ingredients = [
    { name: "All-purpose flour", baseAmount: 500, unit: "g" },
    { name: "Warm water", baseAmount: 200, unit: "ml" },
    { name: "Vegetable oil (for dough)", baseAmount: 50, unit: "ml" },
    { name: "Salt", baseAmount: 10, unit: "g" },
    { name: "Eggs", baseAmount: 2, unit: "pcs" },
    { name: "Ground beef (optional filling)", baseAmount: 300, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 100, unit: "g" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "pcs" },
    { name: "Chopped parsley", baseAmount: 15, unit: "g" },
    { name: "Black pepper", baseAmount: 5, unit: "g" },
    { name: "Paprika", baseAmount: 5, unit: "g" },
    { name: "Vegetable oil (for frying)", baseAmount: 1000, unit: "ml" },
    { name: "Hard-boiled eggs (optional filling)", baseAmount: 2, unit: "pcs" },
    { name: "Grated cheese (optional filling)", baseAmount: 100, unit: "g" },
  ];

  // Estimated nutrition per serving (4 servings base)
  const nutrition = {
    calories: "480",
    protein: "18g",
    carbs: "45g",
    fat: "25g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of oil is best for frying these pastries?",
      answer:
        "Vegetable oils with a high smoke point such as canola, sunflower, or peanut oil are ideal for frying these pastries. They ensure a crispy texture without imparting strong flavors or burning quickly.",
    },
    {
      question: "Can I prepare the dough in advance?",
      answer:
        "Yes, the dough can be prepared a day ahead and refrigerated, tightly wrapped in plastic wrap. Bring it to room temperature before rolling out to ensure pliability and ease of shaping.",
    },
    {
      question: "How do I prevent the pastries from becoming soggy after frying?",
      answer:
        "Drain the fried pastries on a wire rack or paper towels immediately after frying to remove excess oil. Avoid stacking them while hot, as trapped steam can cause sogginess.",
    },
    {
      question: "Are there vegetarian filling options for these pastries?",
      answer:
        "Absolutely! You can fill the pastries with a variety of vegetarian options such as seasoned mashed potatoes, sautéed mushrooms with onions, cheese and herbs, or mixed vegetables.",
    },
    {
      question: "What is the origin of these crispy fried pastries?",
      answer:
        "These pastries, often called 'pastel' in Brazil or 'empanadas' in other cultures, originated as street food in Latin America and Portugal. They are traditionally sold at fairs and markets, known for their crispy exterior and savory fillings.",
    },
    {
      question: "How can I store leftover fried pastries?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 2 days. To reheat, bake them in a preheated oven at 180°C (350°F) for 8-10 minutes to restore crispiness.",
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
    recipeCategory: "Snack",
    recipeCuisine: "Brazilian",
    keywords: "pastel, crispy fried pastries, brazilian snack, street food, appetizer, savory pastry",
    recipeIngredient: ingredients.map(i => `${getAmount(i.baseAmount)}${i.unit} ${i.name}`),
    recipeInstructions: [
      "Knead flour, warm water, oil, and salt into a smooth dough, then rest for 30 minutes.",
      "Sauté ground beef with onions, garlic, and spices to make the filling.",
      "Roll dough into thin circles and place a spoonful of filling in the center.",
      "Fold into half-moons and seal edges firmly with a fork.",
      "Deep fry at 180°C (350°F) until golden brown and crispy."
    ]
  });

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Crispy Fried Pastries"
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
            Crispy Fried Pastries, often known as "pastel" in Brazil or similar to empanadas in other cultures, are beloved street food snacks characterized by their golden, crunchy exterior and savory fillings. This recipe captures the essence of traditional feira (street market) pastries, offering a delightful combination of textures and flavors that make them irresistible as appetizers or snacks.
          </p>
          <p>
            The origins of these fried pastries trace back to Portuguese and Latin American culinary traditions, where they were commonly sold at fairs and markets as affordable, portable food. Over time, regional variations have emerged, incorporating local ingredients and fillings, but the core technique of crafting a thin dough and frying it to crisp perfection remains a hallmark of this beloved dish.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the all-purpose flour and salt. Gradually add warm water and vegetable oil while mixing until a soft dough forms. Knead the dough on a floured surface for about 8-10 minutes until smooth and elastic. Cover with a damp cloth and let it rest for 30 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Filling</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a skillet, heat a tablespoon of oil over medium heat. Sauté the chopped onions and minced garlic until translucent. Add ground beef, paprika, black pepper, and salt to taste. Cook until browned and fully cooked through. Stir in chopped parsley and remove from heat. Optionally, chop hard-boiled eggs and grated cheese to mix into the filling.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Roll and Fill the Pastries</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Divide the dough into equal portions and roll each into thin circles about 12 cm (5 inches) in diameter. Place a spoonful of filling in the center of each circle. Fold the dough over to form a half-moon shape and press the edges firmly to seal, using a fork to crimp if desired.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Fry the Pastries</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a deep pan or fryer to 180°C (350°F). Fry the pastries in batches, turning occasionally, until golden brown and crispy, about 3-4 minutes per side. Remove with a slotted spoon and drain on paper towels or a wire rack.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve and Enjoy</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the crispy fried pastries warm with your favorite dipping sauces such as chimichurri, hot sauce, or a simple squeeze of lime. They make a perfect snack or appetizer for gatherings and celebrations.
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
            For an extra flaky texture, you can brush the dough edges with a little beaten egg before sealing the pastries.
          </li>
          <li>
            Avoid overcrowding the frying pan to maintain the oil temperature and ensure even cooking.
          </li>
          <li>
            Experiment with different fillings like spiced chicken, shrimp, or vegetarian options to customize the pastries.
          </li>
          <li>
            If you want to reduce oil absorption, fry the pastries at the correct temperature and drain them well immediately after frying.
          </li>
          <li>
            Leftover dough can be refrigerated for up to 2 days or frozen for longer storage.
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
              href="https://en.wikipedia.org/wiki/Empanada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Empanada History and Variations
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/empanada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Culinary Reference on Empanadas
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