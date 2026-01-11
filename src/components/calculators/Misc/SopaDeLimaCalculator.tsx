import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SopaDeLimaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Lime%20Soup%20YucatanStyle%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4046"
  );

  // --- DATA ---
  const title = "Lime Soup (Yucatan-Style)";
  const description = "Sopa yucateca com toque cítrico de limão e frango.";

  // INGREDIENTS
  const ingredients = [
    { name: "Chicken breast, boneless and skinless", baseAmount: 500, unit: "g" },
    { name: "Chicken broth", baseAmount: 1.5, unit: "L" },
    { name: "Lime juice (freshly squeezed)", baseAmount: 60, unit: "ml" },
    { name: "Tomato, diced", baseAmount: 2, unit: "medium" },
    { name: "Onion, chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Bell pepper, chopped", baseAmount: 1, unit: "medium" },
    { name: "Tortilla strips (fried)", baseAmount: 100, unit: "g" },
    { name: "Cilantro, chopped", baseAmount: 15, unit: "g" },
    { name: "Oregano, dried", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Vegetable oil", baseAmount: 2, unit: "tbsp" },
    { name: "Scallions, sliced", baseAmount: 2, unit: "stalks" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "280",
    protein: "35g",
    carbs: "12g",
    fat: "6g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes Sopa de Lima unique compared to other lime soups?",
      answer:
        "Sopa de Lima is distinct due to its combination of aromatic Yucatecan spices, the use of fresh lime juice for a bright citrus flavor, and the addition of crispy fried tortilla strips that add texture. Unlike other lime soups, it balances savory chicken broth with the tangy lime and subtle heat from local peppers.",
    },
    {
      question: "Can I use other types of meat instead of chicken?",
      answer:
        "Yes, while chicken breast is traditional, you can substitute with turkey or even seafood like shrimp for a different twist. Adjust cooking times accordingly to ensure the protein is cooked through without drying out.",
    },
    {
      question: "How do I make the tortilla strips crispy without frying?",
      answer:
        "If you prefer to avoid frying, you can bake the tortilla strips in a preheated oven at 180°C (350°F) for about 10-15 minutes, turning halfway through until golden and crisp. This method uses less oil but still provides a satisfying crunch.",
    },
    {
      question: "Is it necessary to use fresh lime juice?",
      answer:
        "Fresh lime juice is highly recommended as it provides a bright, vibrant acidity that bottled juice often lacks. The fresh juice enhances the authentic flavor profile of the soup and balances the savory broth perfectly.",
    },
    {
      question: "Can I prepare Sopa de Lima in advance?",
      answer:
        "You can prepare the broth and cook the chicken ahead of time, storing them separately in the refrigerator. However, add the lime juice and tortilla strips just before serving to maintain their fresh flavor and crisp texture.",
    },
    {
      question: "What side dishes pair well with Sopa de Lima?",
      answer:
        "Sopa de Lima pairs wonderfully with traditional Mexican sides like refried beans, Mexican rice, or a fresh avocado salad. A light, citrusy beverage such as agua fresca complements the soup nicely.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Lime Soup (Yucatan-Style)"
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
            Sopa de Lima is a traditional Yucatecan lime soup that beautifully
            balances the bright acidity of fresh lime juice with the savory
            depth of chicken broth and aromatic spices. This dish is a staple in
            the Yucatán Peninsula of Mexico, celebrated for its refreshing yet
            comforting qualities. The addition of crispy tortilla strips adds a
            delightful texture contrast, making it a beloved comfort food with a
            citrusy twist.
          </p>
          <p>
            Originating from the Yucatán region, Sopa de Lima reflects the rich
            culinary heritage influenced by Mayan traditions and Spanish
            colonial flavors. The use of local ingredients like lime, oregano,
            and native peppers showcases the region’s vibrant agricultural
            bounty. Traditionally served during family gatherings and special
            occasions, this soup has gained international recognition for its
            unique flavor profile and simplicity.
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
              Prepare the Chicken and Broth
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pot, heat the vegetable oil over medium heat. Add the
              chopped onion, garlic, and bell pepper, sautéing until softened
              and fragrant, about 5 minutes. Add the chicken breasts and pour in
              the chicken broth. Bring to a boil, then reduce heat and simmer
              for 10 minutes or until the chicken is cooked through.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shred the Chicken and Add Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the chicken breasts from the pot and shred them using two
              forks. Return the shredded chicken to the pot. Add the diced
              tomatoes, oregano, salt, and black pepper. Simmer for another 5
              minutes to meld the flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Lime Juice and Adjust Seasoning
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the freshly squeezed lime juice and sliced scallions.
              Taste and adjust salt or lime juice as needed to achieve a bright,
              balanced flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve with Crispy Tortilla Strips and Cilantro
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Ladle the soup into bowls and top generously with crispy fried
              tortilla strips and chopped cilantro. Serve immediately to enjoy
              the contrast of textures and fresh flavors.
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
            Use fresh limes for juicing to get the brightest and most vibrant
            flavor; avoid bottled lime juice.
          </li>
          <li>
            Fry your tortilla strips just before serving to keep them crispy and
            prevent sogginess.
          </li>
          <li>
            For a smoky depth, consider adding a small amount of chipotle or
            smoked paprika to the broth.
          </li>
          <li>
            If you prefer a vegetarian version, substitute chicken broth with
            vegetable broth and add hearty vegetables like zucchini or corn.
          </li>
          <li>
            Garnish with avocado slices or radish for added texture and color.
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
              href="https://en.wikipedia.org/wiki/Sopa_de_lima"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Sopa de Lima
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.mexicoinmykitchen.com/sopa-de-lima-yucatan-lime-soup/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Mexico In My Kitchen: Sopa de Lima Recipe
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