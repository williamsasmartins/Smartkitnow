import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SpaghettiWithTomatoAndBasilPomodoroCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Spaghetti%20with%20Tomato%20and%20Basil%20Pomodoro%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5360"
  );

  // --- DATA ---
  const title = "Spaghetti with Tomato and Basil (Pomodoro)";
  const description = "Light fresh tomato sauce with basil and garlic over spaghetti.";

  // INGREDIENTS
  const ingredients = [
    { name: "Spaghetti", baseAmount: 400, unit: "g" },
    { name: "Ripe Tomatoes (or canned San Marzano)", baseAmount: 800, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 60, unit: "ml" },
    { name: "Fresh Basil Leaves", baseAmount: 15, unit: "g" },
    { name: "Garlic Cloves", baseAmount: 3, unit: "cloves" },
    { name: "Salt", baseAmount: 10, unit: "g" },
    { name: "Black Pepper (freshly ground)", baseAmount: 2, unit: "g" },
    { name: "Sugar (optional, to balance acidity)", baseAmount: 5, unit: "g" },
    { name: "Parmesan Cheese (for serving)", baseAmount: 50, unit: "g" },
    { name: "Water (for boiling pasta)", baseAmount: 4000, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "15g",
    carbs: "75g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of tomatoes are best for Pomodoro sauce?",
      answer:
        "For authentic Pomodoro sauce, San Marzano tomatoes are preferred due to their balanced sweetness and low acidity. However, ripe plum tomatoes or high-quality canned tomatoes can also work well. Freshness and ripeness are key to a flavorful sauce.",
    },
    {
      question: "Can I make this recipe vegan?",
      answer:
        "Yes! The base Pomodoro sauce is naturally vegan. Simply omit the Parmesan cheese or substitute it with a vegan cheese alternative or nutritional yeast to keep the dish fully plant-based.",
    },
    {
      question: "How do I prevent the sauce from becoming watery?",
      answer:
        "Simmer the sauce gently to reduce excess water and concentrate flavors. Using ripe tomatoes with less water content and draining canned tomatoes before cooking can also help. Adding a small amount of sugar balances acidity without adding water.",
    },
    {
      question: "Can I prepare the sauce in advance?",
      answer:
        "Absolutely. Pomodoro sauce can be made ahead and stored in the refrigerator for up to 3 days or frozen for up to 3 months. Reheat gently on the stove before serving to preserve freshness and flavor.",
    },
    {
      question: "What is the best way to cook spaghetti for this dish?",
      answer:
        "Cook spaghetti in plenty of salted boiling water until al dente, usually 8-10 minutes depending on the brand. Reserve some pasta water to adjust the sauce consistency if needed, and toss the pasta with the sauce immediately after draining.",
    },
    {
      question: "How important is fresh basil in this recipe?",
      answer:
        "Fresh basil is essential for the authentic aroma and flavor of Pomodoro sauce. Add it at the end of cooking or as a garnish to preserve its bright, fresh taste. Dried basil does not provide the same vibrant flavor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Spaghetti with Tomato and Basil (Pomodoro)"
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
            Spaghetti with Tomato and Basil, or Pomodoro, is a classic Italian
            dish that celebrates simplicity and freshness. Originating from
            Naples, this recipe highlights the vibrant flavors of ripe tomatoes,
            fragrant basil, and garlic, combined with perfectly cooked
            al dente spaghetti. It is a staple in Italian households and loved
            worldwide for its comforting and bright taste.
          </p>
          <p>
            The beauty of Pomodoro lies in its minimalism — using just a handful
            of quality ingredients to create a sauce that is both light and
            flavorful. This recipe is perfect for a quick weeknight dinner or a
            refined meal when paired with a crisp white wine and fresh
            Parmesan cheese.
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
              Prepare the Tomatoes
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              If using fresh tomatoes, blanch them in boiling water for 30
              seconds, then transfer to ice water. Peel off the skins, remove
              seeds, and chop finely. If using canned tomatoes, crush them
              gently by hand or with a spoon.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Garlic
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat the olive oil in a large skillet over medium heat. Add the
              peeled and lightly crushed garlic cloves and sauté until fragrant
              and golden, about 1-2 minutes. Be careful not to burn the garlic.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the prepared tomatoes to the skillet. Season with salt,
              pepper, and sugar if desired. Simmer gently for 10-15 minutes,
              stirring occasionally, until the sauce thickens and flavors meld.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Spaghetti
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring a large pot of salted water to a boil. Add spaghetti and
              cook until al dente, about 8-10 minutes. Reserve 1 cup of pasta
              water, then drain the pasta.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Combine and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Toss the drained spaghetti with the tomato sauce, adding reserved
              pasta water as needed to loosen the sauce. Tear fresh basil leaves
              and stir gently. Serve immediately with grated Parmesan cheese on
              top.
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
            Use high-quality extra virgin olive oil for the best flavor and
            richness in the sauce.
          </li>
          <li>
            Avoid overcooking the garlic to prevent bitterness; it should be
            golden and fragrant.
          </li>
          <li>
            Adding a pinch of sugar helps balance the acidity of the tomatoes,
            especially if they are very tangy.
          </li>
          <li>
            Always reserve some pasta water to adjust the sauce consistency and
            help it cling to the spaghetti.
          </li>
          <li>
            Fresh basil should be added at the end of cooking or as a garnish to
            preserve its aroma and vibrant color.
          </li>
          <li>
            For a smoother sauce, you can blend the tomatoes before cooking or
            after simmering, depending on your texture preference.
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