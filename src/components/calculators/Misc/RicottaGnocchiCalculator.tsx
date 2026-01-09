import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RicottaGnocchiCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Ricotta%20Gnocchi%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7309"
  );

  // --- DATA ---
  const title = "Ricotta Gnocchi";
  const description = "Light and delicate dumplings made with ricotta cheese.";

  // INGREDIENTS
  const ingredients = [
    { name: "Ricotta Cheese (whole milk)", baseAmount: 500, unit: "g" },
    { name: "All-Purpose Flour", baseAmount: 150, unit: "g" },
    { name: "Parmesan Cheese, grated", baseAmount: 50, unit: "g" },
    { name: "Egg Yolk", baseAmount: 1, unit: "large" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Nutmeg, freshly grated", baseAmount: 0.25, unit: "tsp" },
    { name: "Butter (for sauce)", baseAmount: 50, unit: "g" },
    { name: "Fresh Sage Leaves", baseAmount: 10, unit: "leaves" },
    { name: "Black Pepper, freshly ground", baseAmount: 0.5, unit: "tsp" },
    { name: "Water (for boiling)", baseAmount: 2000, unit: "ml" },
    { name: "Salt (for boiling water)", baseAmount: 1, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "380",
    protein: "18g",
    carbs: "32g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes ricotta gnocchi different from potato gnocchi?",
      answer:
        "Ricotta gnocchi are lighter and more delicate than traditional potato gnocchi because they use ricotta cheese instead of potatoes as the main ingredient. This results in a softer texture and quicker preparation time.",
    },
    {
      question: "How do I prevent ricotta gnocchi from falling apart during cooking?",
      answer:
        "To prevent them from falling apart, ensure the dough is not too wet by adding flour gradually until it holds together but remains soft. Also, avoid overworking the dough and boil the gnocchi in plenty of salted water, removing them as soon as they float to the surface.",
    },
    {
      question: "Can I freeze ricotta gnocchi?",
      answer:
        "Yes, you can freeze ricotta gnocchi. Arrange them in a single layer on a baking sheet and freeze until solid, then transfer to a freezer bag. Cook them directly from frozen by adding a minute or two to the boiling time.",
    },
    {
      question: "What sauces pair best with ricotta gnocchi?",
      answer:
        "Ricotta gnocchi pair wonderfully with simple sauces like browned butter and sage, light tomato sauces, or creamy cheese sauces. Their delicate flavor complements rather than overpowers subtle sauces.",
    },
    {
      question: "Is it necessary to use whole milk ricotta?",
      answer:
        "Whole milk ricotta is preferred for its creaminess and moisture content, which contributes to the soft texture of the gnocchi. Low-fat ricotta can be used but may result in drier gnocchi that require more flour.",
    },
    {
      question: "Can I substitute all-purpose flour with gluten-free flour?",
      answer:
        "You can try gluten-free flour blends, but results may vary as gluten contributes to the dough’s elasticity. It’s best to use a blend designed for pasta or baking and adjust the flour quantity to achieve the right dough consistency.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Ricotta Gnocchi"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Ricotta gnocchi are a delightful Italian dish featuring light, pillowy dumplings made primarily from ricotta cheese instead of potatoes. This variation offers a tender texture and a subtly creamy flavor that melts in your mouth. Perfect for a quick yet elegant meal, ricotta gnocchi can be paired with a variety of sauces, from simple browned butter and sage to rich tomato or cream-based sauces.
          </p>
          <p>
            Originating from the regions of Italy where fresh ricotta is abundant, ricotta gnocchi have been cherished for centuries as a comforting and versatile dish. Unlike traditional potato gnocchi, these dumplings require less cooking time and are easier to prepare, making them a favorite among home cooks and professional chefs alike.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Ricotta</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the ricotta cheese in a fine-mesh sieve or cheesecloth and let it drain for at least 30 minutes to remove excess moisture. This step is crucial to avoid a wet dough.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Mix the Dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the drained ricotta, grated Parmesan, egg yolk, salt, and nutmeg. Gradually add the flour, mixing gently until a soft dough forms. Be careful not to overwork the dough to keep it tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Shape the Gnocchi</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Lightly flour your work surface. Divide the dough into smaller portions and roll each into a long rope about 2 cm thick. Cut into 2 cm pieces and, if desired, gently roll each piece over the back of a fork to create ridges.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Gnocchi</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring a large pot of salted water to a boil. Add the gnocchi in batches to avoid overcrowding. When they float to the surface (about 2-3 minutes), remove them with a slotted spoon and drain well.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Sauce and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a skillet, melt the butter over medium heat and add the fresh sage leaves. Cook until the butter is golden and fragrant. Toss the cooked gnocchi gently in the sage butter, season with freshly ground black pepper, and serve immediately with extra Parmesan if desired.
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
            Always drain the ricotta thoroughly to avoid a soggy dough that will be difficult to shape.
          </li>
          <li>
            Use a light hand when mixing and shaping the dough to keep the gnocchi tender and fluffy.
          </li>
          <li>
            If the dough feels too sticky, add flour sparingly; too much flour will make the gnocchi dense.
          </li>
          <li>
            Cook gnocchi in small batches to prevent them from sticking together.
          </li>
          <li>
            For a richer flavor, try adding a pinch of grated lemon zest to the dough.
          </li>
          <li>
            Serve immediately after cooking for the best texture; gnocchi tend to harden if left to sit.
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