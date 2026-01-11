import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChickenTortillaSoupCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chicken%20Tortilla%20Soup%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7576"
  );

  // --- DATA ---
  const title = "Chicken Tortilla Soup";
  const description = "Sopa de frango com tomate/chili, finalizada com tiras de tortilla.";

  // INGREDIENTS
  const ingredients = [
    { name: "Boneless Chicken Breast", baseAmount: 500, unit: "g" },
    { name: "Corn Tortillas (cut into strips)", baseAmount: 4, unit: "pieces" },
    { name: "Diced Tomatoes (canned)", baseAmount: 400, unit: "g" },
    { name: "Chicken Broth", baseAmount: 1000, unit: "ml" },
    { name: "Onion (finely chopped)", baseAmount: 1, unit: "medium" },
    { name: "Garlic Cloves (minced)", baseAmount: 3, unit: "cloves" },
    { name: "Jalapeño Pepper (seeded and chopped)", baseAmount: 1, unit: "piece" },
    { name: "Ground Cumin", baseAmount: 1, unit: "tsp" },
    { name: "Chili Powder", baseAmount: 1, unit: "tbsp" },
    { name: "Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Fresh Cilantro (chopped)", baseAmount: 15, unit: "g" },
    { name: "Lime (juiced)", baseAmount: 1, unit: "piece" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "35g",
    carbs: "20g",
    fat: "8g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use chicken thighs instead of chicken breast?",
      answer:
        "Absolutely! Chicken thighs add more richness and moisture to the soup. Adjust cooking time slightly to ensure they are fully cooked and tender.",
    },
    {
      question: "How can I make this soup spicier?",
      answer:
        "To increase the heat, add more jalapeño peppers or include some chipotle chili powder. You can also garnish with sliced fresh chili or a dash of hot sauce.",
    },
    {
      question: "Is it possible to make this soup vegetarian?",
      answer:
        "Yes, substitute the chicken broth with vegetable broth and omit the chicken. Add extra beans or vegetables like zucchini and corn for added texture and protein.",
    },
    {
      question: "How do I store leftovers?",
      answer:
        "Store leftover soup in an airtight container in the refrigerator for up to 3 days. Reheat gently on the stove or microwave. Tortilla strips are best added fresh when serving to keep them crispy.",
    },
    {
      question: "Can I prepare this soup in a slow cooker?",
      answer:
        "Yes, you can. Combine all ingredients except the tortilla strips and cilantro in the slow cooker. Cook on low for 6-8 hours or high for 3-4 hours. Add tortilla strips and cilantro just before serving.",
    },
    {
      question: "What are good toppings for Chicken Tortilla Soup?",
      answer:
        "Popular toppings include avocado slices, shredded cheese, sour cream, fresh cilantro, lime wedges, and crispy tortilla strips. These add texture and enhance the flavors.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Chicken Tortilla Soup"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 30m
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
            Chicken Tortilla Soup is a vibrant and comforting Mexican-inspired dish
            that combines tender chicken, smoky spices, and fresh vegetables in a
            flavorful broth. Finished with crispy tortilla strips and zesty lime,
            this soup is a perfect balance of textures and tastes, ideal for any
            season.
          </p>
          <p>
            The origins of tortilla soup trace back to traditional Mexican cuisine,
            where corn tortillas are a staple ingredient. This soup evolved as a
            hearty way to use leftover tortillas and chicken, enriched with local
            spices and fresh ingredients. Today, it is enjoyed worldwide as a
            delicious and nutritious meal.
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
              Cut the chicken breasts into bite-sized pieces. Slice the corn
              tortillas into thin strips and set aside. Finely chop the onion,
              garlic, jalapeño, and cilantro. Juice the lime.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Aromatics
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large pot over medium heat. Add the chopped onion,
              garlic, and jalapeño, cooking until softened and fragrant, about 5
              minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Spices and Chicken
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the ground cumin and chili powder, cooking for 1 minute to
              release their aromas. Add the chicken pieces and cook until they start
              to brown, about 5 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Simmer the Soup
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the chicken broth and diced tomatoes with their juices. Season
              with salt and black pepper. Bring to a boil, then reduce heat and
              simmer for 20 minutes until the chicken is cooked through and flavors
              meld.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare Tortilla Strips
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              While the soup simmers, heat a small amount of oil in a skillet over
              medium heat. Fry the tortilla strips until crispy and golden brown.
              Drain on paper towels and season lightly with salt.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Finish and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir the lime juice and chopped cilantro into the soup. Ladle the soup
              into bowls and top with crispy tortilla strips. Optionally, garnish
              with avocado, shredded cheese, or sour cream.
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
            Use homemade chicken broth for a richer, more authentic flavor.
          </li>
          <li>
            Toast the chili powder and cumin briefly before adding liquids to
            enhance their aroma.
          </li>
          <li>
            For extra depth, add a small piece of smoked chipotle pepper or a dash
            of smoked paprika.
          </li>
          <li>
            If you prefer a thicker soup, blend a portion of the soup and stir it
            back in.
          </li>
          <li>
            Always add the tortilla strips just before serving to keep them crispy.
          </li>
          <li>
            Garnish with fresh lime wedges and cilantro for a bright, fresh finish.
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
              href="https://en.wikipedia.org/wiki/Tortilla_soup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Tortilla Soup
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.simplyrecipes.com/recipes/chicken_tortilla_soup/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Simply Recipes: Chicken Tortilla Soup Recipe
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