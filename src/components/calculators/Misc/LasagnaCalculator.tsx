import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LasagnaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Lasagna%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2472"
  );

  // --- DATA ---
  const title = "Lasagna";
  const description = "Layered pasta with ragù, béchamel, mozzarella, and Parmesan.";

  // INGREDIENTS
  const ingredients = [
    { name: "Lasagna sheets (dry)", baseAmount: 250, unit: "g" },
    { name: "Ground beef", baseAmount: 400, unit: "g" },
    { name: "Ground pork", baseAmount: 150, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Carrot, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Celery stalk, finely chopped", baseAmount: 1, unit: "stalk" },
    { name: "Garlic cloves, minced", baseAmount: 2, unit: "cloves" },
    { name: "Tomato paste", baseAmount: 70, unit: "g" },
    { name: "Canned crushed tomatoes", baseAmount: 400, unit: "g" },
    { name: "Dry white wine", baseAmount: 125, unit: "ml" },
    { name: "Whole milk", baseAmount: 500, unit: "ml" },
    { name: "Butter", baseAmount: 60, unit: "g" },
    { name: "All-purpose flour", baseAmount: 60, unit: "g" },
    { name: "Mozzarella cheese, shredded", baseAmount: 200, unit: "g" },
    { name: "Parmesan cheese, grated", baseAmount: 100, unit: "g" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Nutmeg, grated", baseAmount: 0.25, unit: "tsp" },
    { name: "Fresh basil leaves", baseAmount: 5, unit: "leaves" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "650",
    protein: "38g",
    carbs: "45g",
    fat: "30g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of pasta sheets should I use for lasagna?",
      answer:
        "Traditionally, lasagna sheets are made from durum wheat semolina and come either fresh or dried. Fresh sheets cook faster and yield a tender texture, while dried sheets require pre-cooking or soaking before layering. Choose high-quality sheets to ensure the best texture and flavor.",
    },
    {
      question: "Can I prepare the ragù sauce in advance?",
      answer:
        "Yes, the ragù sauce benefits from slow cooking and tastes even better when made a day ahead. Preparing it in advance allows the flavors to meld beautifully. Simply store it in an airtight container in the refrigerator and reheat gently before assembling the lasagna.",
    },
    {
      question: "How do I prevent the lasagna from becoming watery?",
      answer:
        "To avoid a watery lasagna, ensure your béchamel sauce is thick enough and your ragù is not too liquidy. Drain excess liquid from canned tomatoes and avoid over-saucing the layers. Also, let the lasagna rest for 15-20 minutes after baking to allow it to set.",
    },
    {
      question: "Can I substitute the meat in the ragù for a vegetarian option?",
      answer:
        "Absolutely! You can replace the ground beef and pork with finely chopped mushrooms, lentils, or a mix of vegetables like zucchini and eggplant. Use vegetable broth instead of meat stock and adjust seasoning accordingly for a rich vegetarian lasagna.",
    },
    {
      question: "What is the best way to reheat leftover lasagna?",
      answer:
        "Reheat leftover lasagna in the oven at 175°C (350°F) covered with foil to retain moisture, for about 20-25 minutes until heated through. Alternatively, microwave individual portions covered with a microwave-safe lid or wrap, heating in short intervals to avoid drying out.",
    },
    {
      question: "How can I make my lasagna more authentic Italian style?",
      answer:
        "Authentic Italian lasagna uses fresh pasta sheets, a slow-cooked ragù alla Bolognese, a creamy béchamel sauce, and freshly grated Parmigiano-Reggiano. Avoid using too many cheeses or heavy tomato sauces. Layering and balance of flavors are key to authenticity.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Lasagna"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 1h 30m
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
            Lasagna is a classic Italian dish that features layers of tender pasta sheets,
            rich ragù sauce made from ground meats and tomatoes, creamy béchamel, and
            melted mozzarella and Parmesan cheeses. This hearty casserole is beloved worldwide
            for its comforting flavors and satisfying texture, perfect for family meals or
            special occasions.
          </p>
          <p>
            Originating from the Emilia-Romagna region of Italy, lasagna has a rich culinary
            history dating back to the Middle Ages. The dish evolved from simple layered
            pasta preparations to the modern version featuring ragù alla Bolognese and béchamel,
            showcasing the Italian mastery of balancing robust flavors with creamy textures.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Ragù</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large pan over medium heat. Add finely chopped onion, carrot,
              celery, and garlic; sauté until softened. Add ground beef and pork, cooking until
              browned. Stir in tomato paste, then deglaze with white wine. Add crushed tomatoes,
              salt, pepper, and basil leaves. Simmer gently for at least 1 hour, stirring occasionally.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Béchamel Sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a saucepan, melt butter over medium heat. Whisk in flour and cook for 1-2 minutes
              without browning. Gradually add warm milk, whisking continuously to avoid lumps.
              Cook until thickened and creamy. Season with salt, pepper, and a pinch of grated nutmeg.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Assemble the Lasagna</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat oven to 180°C (350°F). Spread a thin layer of ragù on the bottom of a baking dish.
              Layer lasagna sheets over the sauce, then add ragù, béchamel, mozzarella, and Parmesan.
              Repeat layers until ingredients are used, finishing with béchamel and a generous sprinkle of Parmesan.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Bake</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cover the dish with foil and bake for 45 minutes. Remove the foil and bake for an
              additional 15-20 minutes until the top is golden and bubbling. Let rest for 15 minutes
              before serving to allow the layers to set.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve and Enjoy</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slice the lasagna into portions and serve warm. Pair with a fresh green salad and
              a glass of Italian red wine for a complete meal experience.
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
            Use fresh pasta sheets if possible for a delicate texture and quicker cooking time.
          </li>
          <li>
            Simmer the ragù slowly to develop deep, rich flavors; patience is key.
          </li>
          <li>
            When layering, avoid over-saturating the pasta sheets to prevent sogginess.
          </li>
          <li>
            Let the lasagna rest after baking to firm up the layers, making it easier to slice.
          </li>
          <li>
            Experiment with adding a pinch of cinnamon or clove to the ragù for subtle warmth.
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