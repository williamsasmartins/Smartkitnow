import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChickenAndCornStewCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chicken%20and%20Corn%20Stew%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5449"
  );

  // --- DATA ---
  const title = "Chicken and Corn Stew";
  const description = "A comforting, farm-style chicken stew with sweet corn gems.";

  // INGREDIENTS
  const ingredients = [
    { name: "Chicken thighs (boneless, skinless)", baseAmount: 500, unit: "g" },
    { name: "Fresh corn kernels", baseAmount: 250, unit: "g" },
    { name: "Carrots (diced)", baseAmount: 150, unit: "g" },
    { name: "Celery stalks (diced)", baseAmount: 100, unit: "g" },
    { name: "Yellow onion (chopped)", baseAmount: 150, unit: "g" },
    { name: "Garlic cloves (minced)", baseAmount: 4, unit: "cloves" },
    { name: "Chicken broth", baseAmount: 800, unit: "ml" },
    { name: "Potatoes (peeled and cubed)", baseAmount: 300, unit: "g" },
    { name: "Heavy cream", baseAmount: 120, unit: "ml" },
    { name: "Butter", baseAmount: 30, unit: "g" },
    { name: "Olive oil", baseAmount: 15, unit: "ml" },
    { name: "Fresh thyme (leaves)", baseAmount: 2, unit: "tsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper (freshly ground)", baseAmount: 1, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "38g",
    carbs: "25g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use chicken breast instead of thighs?",
      answer:
        "Yes, you can substitute chicken thighs with chicken breast for a leaner stew. However, thighs tend to stay juicier and more flavorful during cooking, making the stew richer and more tender.",
    },
    {
      question: "Is fresh corn necessary, or can I use frozen or canned corn?",
      answer:
        "Fresh corn kernels provide the best sweetness and texture, but frozen corn is a great alternative and works well in this stew. Canned corn can be used in a pinch, but be sure to drain it well to avoid excess liquid.",
    },
    {
      question: "How can I make this stew dairy-free?",
      answer:
        "To make the stew dairy-free, substitute the heavy cream with coconut milk or a plant-based cream alternative, and replace butter with olive oil or a dairy-free margarine.",
    },
    {
      question: "Can I prepare this stew in advance?",
      answer:
        "Absolutely! This stew tastes even better the next day as the flavors meld. Store it in an airtight container in the refrigerator for up to 3 days. Reheat gently on the stove or in the microwave.",
    },
    {
      question: "What side dishes pair well with chicken and corn stew?",
      answer:
        "This hearty stew pairs wonderfully with crusty bread, a fresh green salad, or steamed rice to soak up the delicious broth.",
    },
    {
      question: "How do I thicken the stew if it’s too watery?",
      answer:
        "If the stew is too thin, you can simmer it uncovered to reduce the liquid or stir in a slurry made from cornstarch and cold water to thicken it quickly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Chicken and Corn Stew"
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
            This Chicken and Corn Stew is a comforting, farm-style dish that
            brings together tender chicken thighs and sweet bursts of fresh
            corn in a creamy, savory broth. Perfect for cooler evenings, this
            stew balances hearty ingredients with fresh herbs and a touch of
            cream to create a rich, satisfying meal that warms the soul.
          </p>
          <p>
            The origins of chicken and corn stews trace back to rural American
            cooking traditions, where simple, fresh ingredients were combined
            to create nourishing meals. Corn, a staple crop, adds natural
            sweetness and texture, while chicken provides protein and depth.
            Over time, this humble stew has evolved into a beloved classic,
            celebrated for its rustic charm and comforting flavors.
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
              Rinse and pat dry the chicken thighs, then cut into bite-sized
              pieces. Dice the carrots, celery, and potatoes. Chop the onion
              and mince the garlic. Remove corn kernels from the cob if using
              fresh corn.
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
              Heat olive oil and butter in a large pot over medium heat. Add
              the onion, garlic, carrots, and celery, cooking until softened
              and fragrant, about 5 minutes. Add the chicken pieces and cook
              until lightly browned on all sides.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Broth and Potatoes
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the chicken broth and add the cubed potatoes. Stir in
              fresh thyme, salt, and pepper. Bring the stew to a gentle boil,
              then reduce heat and simmer for 25 minutes, or until potatoes are
              tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Corn and Cream
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the fresh corn kernels and heavy cream. Simmer for an
              additional 5-7 minutes until the corn is tender and the stew is
              creamy and heated through. Adjust seasoning to taste.
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
              Ladle the stew into bowls and garnish with additional fresh thyme
              if desired. Serve hot with crusty bread or a side salad for a
              complete meal.
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
            For extra depth of flavor, brown the chicken pieces in batches to
            avoid steaming, then set aside before sautéing the vegetables.
          </li>
          <li>
            Use fresh thyme sprigs during cooking and remove them before
            serving to avoid woody stems.
          </li>
          <li>
            If you prefer a thicker stew, mash some of the potatoes against the
            side of the pot during simmering.
          </li>
          <li>
            Adding a splash of white wine before the broth can enhance the stew's
            complexity.
          </li>
          <li>
            Leftovers reheat beautifully and often taste better the next day as
            flavors meld.
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
              href="https://en.wikipedia.org/wiki/Chicken_soup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Chicken Soup and Stews
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/corn-plant"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Corn Plant and Culinary Uses
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