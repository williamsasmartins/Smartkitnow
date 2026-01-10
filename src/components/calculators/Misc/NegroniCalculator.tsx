import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function NegroniCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Negroni%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8490"
  );

  // --- DATA ---
  const title = "Negroni";
  const description = "Classic aperitif cocktail with gin, vermouth, and Campari.";

  // INGREDIENTS
  const ingredients = [
    { name: "Gin", baseAmount: 30, unit: "ml" },
    { name: "Sweet Vermouth", baseAmount: 30, unit: "ml" },
    { name: "Campari", baseAmount: 30, unit: "ml" },
    { name: "Orange Peel (for garnish)", baseAmount: 1, unit: "piece" },
    { name: "Ice Cubes", baseAmount: 6, unit: "pieces" },
    { name: "Orange Slice (optional garnish)", baseAmount: 1, unit: "slice" },
    { name: "Cocktail Stirrer", baseAmount: 1, unit: "piece" },
    { name: "Old Fashioned Glass", baseAmount: 1, unit: "glass" },
    { name: "Mixing Glass", baseAmount: 1, unit: "glass" },
    { name: "Bar Spoon", baseAmount: 1, unit: "piece" },
    { name: "Strainer", baseAmount: 1, unit: "piece" },
  ];

  // Nutrition is approximate per serving
  const nutrition = {
    calories: "190",
    protein: "0g",
    carbs: "14g",
    fat: "0g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is a Negroni cocktail?",
      answer:
        "The Negroni is a classic Italian aperitif cocktail made from equal parts gin, sweet vermouth, and Campari. It is known for its balanced bitter, sweet, and botanical flavors, typically garnished with an orange peel.",
    },
    {
      question: "How do I make a Negroni at home?",
      answer:
        "To make a Negroni, combine 30ml each of gin, sweet vermouth, and Campari in a mixing glass filled with ice. Stir well until chilled, then strain into an old fashioned glass over fresh ice. Garnish with a twist of orange peel.",
    },
    {
      question: "Can I adjust the bitterness of a Negroni?",
      answer:
        "Yes, you can adjust the bitterness by varying the amount of Campari or substituting it with other bitter liqueurs. Some prefer a 'Negroni Sbagliato' which replaces gin with sparkling wine for a lighter taste.",
    },
    {
      question: "What glassware is best for serving a Negroni?",
      answer:
        "Traditionally, a Negroni is served in an old fashioned glass (also called a rocks glass) over ice. This allows the drink to stay chilled and provides a perfect vessel for the garnish.",
    },
    {
      question: "What is the history behind the Negroni?",
      answer:
        "The Negroni originated in Florence, Italy, in the early 20th century. It is credited to Count Camillo Negroni, who asked a bartender to strengthen his favorite cocktail, the Americano, by replacing soda water with gin.",
    },
    {
      question: "Are there popular variations of the Negroni?",
      answer:
        "Yes, popular variations include the Negroni Sbagliato (with sparkling wine), White Negroni (using Lillet Blanc and Suze), and Mezcal Negroni (substituting gin with mezcal). Each offers a unique twist on the classic.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Negroni"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 5m | Cook: 0m
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
                    {ing.unit === "piece" || ing.unit === "pieces"
                      ? getAmount(ing.baseAmount)
                      : getAmount(ing.baseAmount)}{" "}
                    {ing.unit}
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
            The Negroni is a timeless Italian aperitif cocktail that masterfully
            balances the botanical notes of gin with the sweet richness of vermouth
            and the distinctive bitterness of Campari. Served over ice and garnished
            with a bright orange peel, it is both visually striking and delightfully
            complex on the palate.
          </p>
          <p>
            Originating in Florence in the early 20th century, the Negroni was
            reportedly created when Count Camillo Negroni requested a stronger
            version of his favorite Americano cocktail by substituting soda water
            with gin. Since then, it has become a staple in cocktail bars worldwide,
            celebrated for its simplicity and bold flavor profile.
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
              Chill Your Glass
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place an old fashioned glass in the freezer or fill it with ice water
              to chill while you prepare the cocktail.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Combine Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a mixing glass filled with ice, pour gin, sweet vermouth, and
              Campari in equal parts (30ml each for 1 serving).
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Stir to Chill
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir the mixture gently for about 20-30 seconds until well chilled and
              slightly diluted.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare Glass & Strain
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the ice or water from your chilled glass and fill it with fresh
              ice cubes. Strain the cocktail mixture into the glass.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Garnish and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Express the oils of an orange peel over the drink by twisting it, then
              drop it into the glass. Optionally, add an orange slice for extra
              aroma. Serve immediately.
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
            Use a quality London Dry gin with pronounced botanical notes to complement
            the bitterness of Campari.
          </li>
          <li>
            Stirring instead of shaking preserves the silky texture and clarity of
            the cocktail.
          </li>
          <li>
            Fresh orange peel oils add a fragrant citrus aroma that enhances the
            drinking experience.
          </li>
          <li>
            Experiment with different vermouth brands to find your preferred sweetness
            and herbal complexity.
          </li>
          <li>
            For a lighter variation, try a Negroni Sbagliato by replacing gin with
            sparkling wine.
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
      jsonLd={faqJsonLd}
      hideLegalDisclaimer={true}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}