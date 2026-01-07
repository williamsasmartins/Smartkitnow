import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TagliatelleWithMeatRaguBologneseCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Tagliatelle%20with%20Meat%20Rag%20Bolognese%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8707"
  );

  // --- DATA ---
  const title = "Tagliatelle with Meat Ragù (Bolognese)";
  const description = "Rich slow-cooked meat sauce with beef, pork, tomatoes, and milk.";

  // INGREDIENTS
  const ingredients = [
    { name: "Tagliatelle pasta", baseAmount: 400, unit: "g" },
    { name: "Ground beef (80% lean)", baseAmount: 250, unit: "g" },
    { name: "Ground pork", baseAmount: 250, unit: "g" },
    { name: "Carrot, finely chopped", baseAmount: 100, unit: "g" },
    { name: "Celery stalk, finely chopped", baseAmount: 80, unit: "g" },
    { name: "Yellow onion, finely chopped", baseAmount: 100, unit: "g" },
    { name: "Garlic cloves, minced", baseAmount: 2, unit: "pcs" },
    { name: "Tomato paste", baseAmount: 2, unit: "tbsp" },
    { name: "Canned crushed tomatoes", baseAmount: 400, unit: "g" },
    { name: "Whole milk", baseAmount: 150, unit: "ml" },
    { name: "Dry white wine", baseAmount: 125, unit: "ml" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Freshly ground black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Nutmeg, freshly grated", baseAmount: 0.25, unit: "tsp" },
    { name: "Parmesan cheese, grated (for serving)", baseAmount: 50, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "650",
    protein: "38g",
    carbs: "65g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the difference between Ragù Bolognese and other meat sauces?",
      answer:
        "Ragù Bolognese is a traditional Italian meat sauce originating from Bologna, characterized by its slow cooking process, use of both beef and pork, inclusion of milk to soften acidity, and a balance of finely chopped vegetables. Unlike simpler meat sauces, it is rich, layered, and typically served with tagliatelle or used in lasagna.",
    },
    {
      question: "Can I substitute tagliatelle with other types of pasta?",
      answer:
        "Yes, while tagliatelle is traditional due to its broad, flat shape that holds the sauce well, you can substitute with fettuccine, pappardelle, or even pici. Avoid very thin pastas like spaghetti as they don't hold the ragù as effectively.",
    },
    {
      question: "Why is milk added to the ragù?",
      answer:
        "Milk is added to the ragù to tenderize the meat and reduce the acidity from the tomatoes and wine. It creates a smoother, richer sauce and balances the flavors, making the ragù less sharp and more velvety.",
    },
    {
      question: "How long should I cook the ragù for the best flavor?",
      answer:
        "For authentic flavor, the ragù should be simmered gently for at least 2 to 3 hours. This slow cooking allows the flavors to meld, the meat to become tender, and the sauce to thicken beautifully.",
    },
    {
      question: "Can I prepare the ragù in advance?",
      answer:
        "Absolutely! Ragù Bolognese tastes even better the next day as the flavors deepen. You can refrigerate it for up to 3 days or freeze it for up to 3 months. Reheat gently before serving.",
    },
    {
      question: "Is it necessary to use both beef and pork in the ragù?",
      answer:
        "Using a combination of beef and pork adds complexity and richness to the ragù. Beef provides a robust flavor, while pork adds sweetness and fat, resulting in a balanced and tender sauce. However, you can adjust the ratio or use just one type if preferred.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Tagliatelle with Meat Ragù (Bolognese)"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 180m
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
            Tagliatelle with Meat Ragù, commonly known as Bolognese, is a classic Italian dish
            hailing from the Emilia-Romagna region. This recipe features a rich, slow-cooked meat
            sauce made from a blend of ground beef and pork, simmered with aromatic vegetables,
            tomatoes, wine, and milk to create a deeply flavorful and velvety sauce.
          </p>
          <p>
            Traditionally served with fresh tagliatelle pasta, this dish embodies the heart of
            Italian comfort food. The long cooking process allows the flavors to meld beautifully,
            resulting in a hearty and satisfying meal perfect for family dinners or special
            occasions.
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
              Prepare the soffritto
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large heavy-bottomed pan over medium heat. Add finely chopped
              carrot, celery, and onion. Sauté gently until softened and translucent, about 8-10
              minutes, stirring occasionally to avoid browning.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Brown the meat
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the ground beef and pork to the pan. Increase heat slightly and cook, breaking up
              the meat with a spoon, until browned evenly and no longer pink, about 8-10 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add garlic, tomato paste, and deglaze
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in minced garlic and tomato paste, cooking for 2 minutes to deepen flavors.
              Pour in the white wine to deglaze the pan, scraping up any browned bits. Let the wine
              reduce by half, about 3-4 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add tomatoes, milk, and seasoning
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in crushed tomatoes, milk, salt, pepper, and freshly grated nutmeg. Bring to a
              gentle simmer.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Simmer the ragù
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Reduce heat to low and cook uncovered for 2 to 3 hours, stirring occasionally. Add a
              splash of water or broth if the sauce becomes too thick.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the tagliatelle and serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cook tagliatelle in salted boiling water until al dente. Drain and toss with a
              portion of the ragù. Serve topped with freshly grated Parmesan cheese.
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
            Use fresh tagliatelle if possible; it absorbs the sauce better and provides a more
            authentic texture.
          </li>
          <li>
            Finely chop the soffritto vegetables to ensure they melt into the sauce, creating a
            smooth texture.
          </li>
          <li>
            Stir occasionally during simmering to prevent the ragù from sticking to the bottom of
            the pan.
          </li>
          <li>
            If you prefer a thicker sauce, simmer uncovered for longer, but keep an eye on moisture
            levels.
          </li>
          <li>
            For added depth, some chefs add a small piece of pancetta or prosciutto with the
            soffritto.
          </li>
          <li>
            Let the ragù rest for a few minutes after cooking to allow flavors to settle before
            serving.
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