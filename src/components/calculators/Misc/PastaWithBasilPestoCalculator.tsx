import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PastaWithBasilPestoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Pasta%20with%20Basil%20Pesto%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7719"
  );

  // --- DATA ---
  const title = "Pasta with Basil Pesto";
  const description = "Fresh Genovese pesto made with basil, pine nuts, garlic, Parmesan, and olive oil.";

  // INGREDIENTS
  const ingredients = [
    { name: "Spaghetti or Linguine", baseAmount: 400, unit: "g" },
    { name: "Fresh Basil Leaves", baseAmount: 50, unit: "g" },
    { name: "Pine Nuts", baseAmount: 30, unit: "g" },
    { name: "Garlic Cloves", baseAmount: 2, unit: "pcs" },
    { name: "Parmesan Cheese, grated", baseAmount: 60, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 120, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Lemon Juice (optional)", baseAmount: 1, unit: "tsp" },
    { name: "Cherry Tomatoes (for garnish)", baseAmount: 100, unit: "g" },
    { name: "Freshly Ground Black Pepper (for garnish)", baseAmount: 0, unit: "" },
    { name: "Extra Parmesan (for serving)", baseAmount: 20, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "520",
    protein: "18g",
    carbs: "55g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use other nuts instead of pine nuts in the pesto?",
      answer:
        "Yes, you can substitute pine nuts with walnuts, almonds, or cashews. Each nut will slightly alter the flavor and texture of the pesto, but walnuts are the most common alternative and provide a rich, earthy taste.",
    },
    {
      question: "How do I store leftover pesto to keep it fresh?",
      answer:
        "Store leftover pesto in an airtight container in the refrigerator for up to 3 days. To prevent oxidation and browning, pour a thin layer of olive oil on top before sealing. For longer storage, pesto freezes well in ice cube trays and can be thawed as needed.",
    },
    {
      question: "What type of pasta pairs best with basil pesto?",
      answer:
        "Traditional Italian recipes often use long, thin pasta like spaghetti, linguine, or trofie. These shapes allow the pesto to coat the strands evenly. However, short pasta like penne or fusilli also works well as they hold the sauce in their crevices.",
    },
    {
      question: "Can I make pesto without cheese for a vegan version?",
      answer:
        "Absolutely! To make vegan pesto, simply omit the Parmesan cheese and consider adding nutritional yeast for a cheesy flavor. You might also want to add a bit more nuts or olive oil to maintain the creamy texture.",
    },
    {
      question: "Is it necessary to blanch the basil leaves before making pesto?",
      answer:
        "Blanching basil leaves is optional. Some chefs do it to preserve the vibrant green color and reduce bitterness, but fresh raw basil is traditional and provides the best flavor. If blanching, quickly dunk leaves in boiling water for 10 seconds, then shock in ice water.",
    },
    {
      question: "How can I prevent the pesto from turning brown after preparation?",
      answer:
        "Pesto oxidizes quickly when exposed to air, causing browning. To prevent this, store it in an airtight container with a thin layer of olive oil on top. Using fresh ingredients and consuming pesto within a few days also helps maintain its bright green color.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Pasta with Basil Pesto"
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
                    {ing.unit
                      ? `${getAmount(ing.baseAmount)} ${ing.unit}`
                      : ""}
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
            Pasta with Basil Pesto is a classic Italian dish originating from
            Genoa, the capital of Liguria. This recipe highlights the fresh,
            vibrant flavors of basil combined with pine nuts, garlic, and
            Parmesan cheese, all blended into a luscious sauce with extra virgin
            olive oil. The simplicity of the ingredients allows the aromatic basil
            to shine, making it a beloved staple in Italian cuisine.
          </p>
          <p>
            Traditionally served with long pasta such as spaghetti or linguine,
            this dish is quick to prepare yet delivers a gourmet experience. The
            pesto sauce can be made ahead and stored, making it perfect for busy
            weeknights or elegant dinners. Garnished with cherry tomatoes and
            extra Parmesan, this recipe balances freshness, richness, and texture
            beautifully.
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
              Prepare the Pesto Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a food processor or blender, combine fresh basil leaves, pine
              nuts, garlic cloves, and grated Parmesan cheese. Pulse until finely
              chopped. With the processor running, slowly drizzle in the olive oil
              until the mixture forms a smooth, creamy sauce. Season with salt,
              black pepper, and optional lemon juice to brighten the flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Pasta
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring a large pot of salted water to a boil. Add the spaghetti or
              linguine and cook according to package instructions until al dente,
              usually about 8-10 minutes. Reserve about 1 cup of pasta cooking
              water before draining.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Combine Pasta and Pesto
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Return the drained pasta to the pot or a large mixing bowl. Add the
              prepared pesto sauce and toss to coat evenly. If the sauce is too
              thick, add reserved pasta water a little at a time until you reach
              the desired consistency.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Garnish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Plate the pesto-coated pasta and garnish with halved cherry tomatoes,
              extra grated Parmesan cheese, and freshly ground black pepper. Serve
              immediately with a drizzle of olive oil if desired.
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
            Use fresh, young basil leaves for the best flavor and vibrant green
            color. Avoid older leaves which can be bitter.
          </li>
          <li>
            Toast pine nuts lightly in a dry pan before blending to enhance their
            nuttiness and aroma.
          </li>
          <li>
            When blending pesto, avoid overheating the basil by pulsing gently and
            adding olive oil slowly.
          </li>
          <li>
            Reserve some pasta water to adjust the pesto sauce consistency for a
            silky finish.
          </li>
          <li>
            For a creamier pesto, add a small spoonful of ricotta or mascarpone
            cheese when mixing with pasta.
          </li>
          <li>
            Serve pesto pasta immediately to enjoy the fresh flavors and prevent
            discoloration.
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