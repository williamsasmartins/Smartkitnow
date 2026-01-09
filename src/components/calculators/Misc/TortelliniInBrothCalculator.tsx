import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TortelliniInBrothCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Tortellini%20in%20Broth%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3808"
  );

  // --- DATA ---
  const title = "Tortellini in Broth";
  const description = "Tiny meat-filled pasta rings served in clear chicken broth.";

  // INGREDIENTS
  const ingredients = [
    { name: "Fresh tortellini (meat-filled)", baseAmount: 500, unit: "g" },
    { name: "Chicken broth (homemade or low-sodium)", baseAmount: 1500, unit: "ml" },
    { name: "Parmesan rind", baseAmount: 1, unit: "piece" },
    { name: "Carrot, peeled and chopped", baseAmount: 1, unit: "medium" },
    { name: "Celery stalk, chopped", baseAmount: 1, unit: "stalk" },
    { name: "Yellow onion, quartered", baseAmount: 0.5, unit: "medium" },
    { name: "Garlic clove, smashed", baseAmount: 1, unit: "clove" },
    { name: "Fresh parsley sprigs", baseAmount: 3, unit: "sprigs" },
    { name: "Fresh thyme sprigs", baseAmount: 2, unit: "sprigs" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black peppercorns", baseAmount: 6, unit: "pcs" },
    { name: "Olive oil (for drizzling)", baseAmount: 1, unit: "tbsp" },
    { name: "Grated Parmesan cheese (for serving)", baseAmount: 50, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "18g",
    carbs: "35g",
    fat: "8g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of tortellini is best for this recipe?",
      answer:
        "Fresh meat-filled tortellini is ideal for this dish as it cooks quickly and absorbs the flavors of the broth. You can use store-bought fresh tortellini or homemade if you prefer. Avoid dried tortellini as it requires longer cooking times and may not have the same delicate texture.",
    },
    {
      question: "Can I use vegetable broth instead of chicken broth?",
      answer:
        "Yes, vegetable broth can be used as a substitute to make the dish vegetarian-friendly. However, traditional Tortellini in Broth is made with a clear chicken broth which imparts a rich and savory flavor. Using vegetable broth will result in a lighter but still delicious version.",
    },
    {
      question: "How do I make homemade chicken broth for this recipe?",
      answer:
        "To make homemade chicken broth, simmer chicken bones with water, carrots, celery, onion, garlic, parsley, thyme, salt, and peppercorns for several hours. Strain the broth and use it as the base for the tortellini. This results in a deeply flavorful and clear broth perfect for this dish.",
    },
    {
      question: "Can I prepare this recipe ahead of time?",
      answer:
        "You can prepare the broth in advance and refrigerate or freeze it. Cook the tortellini fresh just before serving to maintain their texture and prevent them from becoming soggy. Reheat the broth gently before adding the tortellini.",
    },
    {
      question: "What are some good garnishes for Tortellini in Broth?",
      answer:
        "A drizzle of high-quality olive oil and a generous sprinkle of freshly grated Parmesan cheese enhance the flavors beautifully. Fresh parsley or a few drops of truffle oil can also add an elegant touch.",
    },
    {
      question: "How long should I cook the tortellini in the broth?",
      answer:
        "Fresh tortellini typically cooks in 3 to 5 minutes once the broth is boiling. Cook until they float to the surface and are tender but still firm to the bite (al dente). Overcooking can cause them to become mushy.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Tortellini in Broth"
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
            Tortellini in Broth is a classic Italian dish that showcases the
            delicate flavors of tiny, meat-filled pasta rings served in a clear,
            aromatic chicken broth. This comforting soup is a staple in
            Emilia-Romagna cuisine and is often enjoyed as a starter during
            festive occasions or family gatherings. The combination of tender
            tortellini and savory broth creates a harmonious balance that warms
            both body and soul.
          </p>
          <p>
            The origins of Tortellini in Broth trace back to the Emilia region,
            particularly the city of Bologna, where tortellini are traditionally
            handmade and filled with a mixture of pork, prosciutto, and cheese.
            The broth is typically prepared from simmering chicken bones with
            fresh vegetables and herbs, resulting in a clear, flavorful base that
            perfectly complements the pasta. This dish embodies the Italian
            philosophy of simple, high-quality ingredients prepared with care.
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
              Prepare the Broth
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pot, combine chicken broth, Parmesan rind, chopped
              carrot, celery, onion, garlic, parsley, thyme, salt, and peppercorns.
              Bring to a gentle simmer over medium heat. Let it cook uncovered for
              20-30 minutes to develop a rich flavor. Strain the broth through a
              fine sieve and return it to the pot, keeping it warm.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Tortellini
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring the strained broth to a gentle boil. Add the fresh tortellini
              and cook for 3-5 minutes until they float to the surface and are
              tender but firm. Avoid overcooking to maintain their shape and
              texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve Immediately
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Ladle the tortellini and broth into warm bowls. Drizzle with a
              little olive oil and sprinkle generously with freshly grated
              Parmesan cheese. Garnish with chopped fresh parsley if desired.
              Serve hot for the best experience.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Optional: Enhance the Broth
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              For added depth, you can simmer the broth with a Parmesan rind
              longer or add a splash of white wine during the simmering process.
              Adjust seasoning with salt and pepper before serving.
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
            Use fresh tortellini for the best texture and flavor; homemade is
            ideal if you have time.
          </li>
          <li>
            Simmer the broth gently to keep it clear and avoid cloudiness.
          </li>
          <li>
            Adding a Parmesan rind while simmering the broth enriches its taste
            and adds subtle umami.
          </li>
          <li>
            Serve the soup immediately after cooking the tortellini to prevent
            them from becoming soggy.
          </li>
          <li>
            For a vegetarian version, substitute chicken broth with a rich
            vegetable broth and use cheese-filled tortellini.
          </li>
          <li>
            Garnish with fresh herbs like parsley or a few drops of truffle oil
            for an elegant finish.
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