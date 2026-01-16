import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BrazilianHotDogLoadedCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Hot%20Dog%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4231"
  );

  // --- DATA ---
  const title = "Brazilian Hot Dog";
  const description = "Loaded dog with mashed potatoes, corn, peas, and more.";

  // INGREDIENTS
  const ingredients = [
    { name: "Hot Dog Sausages", baseAmount: 8, unit: "pcs" },
    { name: "Hot Dog Buns", baseAmount: 8, unit: "pcs" },
    { name: "Mashed Potatoes", baseAmount: 400, unit: "g" },
    { name: "Green Peas (cooked)", baseAmount: 150, unit: "g" },
    { name: "Corn Kernels (cooked)", baseAmount: 150, unit: "g" },
    { name: "Grated Carrots", baseAmount: 100, unit: "g" },
    { name: "Chopped Onions", baseAmount: 100, unit: "g" },
    { name: "Chopped Tomatoes", baseAmount: 150, unit: "g" },
    { name: "Mayonnaise", baseAmount: 100, unit: "g" },
    { name: "Ketchup", baseAmount: 80, unit: "g" },
    { name: "Mustard", baseAmount: 50, unit: "g" },
    { name: "Grated Cheese (e.g., mozzarella)", baseAmount: 150, unit: "g" },
    { name: "Chopped Parsley", baseAmount: 15, unit: "g" },
    { name: "Pickled Jalapeños (optional)", baseAmount: 50, unit: "g" },
  ];

  // Approximate nutrition per serving (4 servings base)
  const nutrition = {
    calories: "520",
    protein: "22g",
    carbs: "45g",
    fat: "25g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes a Brazilian hot dog different from a traditional hot dog?",
      answer:
        "Brazilian hot dogs are uniquely loaded with a variety of toppings such as mashed potatoes, corn, peas, grated carrots, and a mix of sauces like mayonnaise, ketchup, and mustard. This combination creates a hearty, flavorful experience that goes beyond the classic sausage and bun.",
    },
    {
      question: "Can I prepare the toppings in advance?",
      answer:
        "Yes, many toppings like mashed potatoes, cooked peas, corn, and grated carrots can be prepared a day ahead and stored in the refrigerator. This helps speed up assembly on the day you serve the hot dogs.",
    },
    {
      question: "Are there vegetarian alternatives for this recipe?",
      answer:
        "Absolutely! You can substitute the hot dog sausages with plant-based or vegetarian sausages. The toppings remain the same, making it a delicious option for vegetarians.",
    },
    {
      question: "How should I store leftovers?",
      answer:
        "Store leftover toppings and sausages separately in airtight containers in the refrigerator. Hot dog buns are best kept in a bread box or sealed bag at room temperature to maintain freshness. Reheat sausages and toppings gently before assembling new hot dogs.",
    },
    {
      question: "Can I customize the toppings to suit my taste?",
      answer:
        "Definitely! Brazilian hot dogs are very versatile. Feel free to add or remove toppings like pickled jalapeños for heat, swap cheeses, or add fresh herbs to personalize your loaded hot dog experience.",
    },
    {
      question: "What beverages pair well with Brazilian hot dogs?",
      answer:
        "Brazilian hot dogs pair wonderfully with refreshing beverages like guaraná soda, cold beer, or fresh fruit juices such as passion fruit or mango to complement the rich and savory flavors.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Hot Dog"
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
            The Brazilian Hot Dog is a vibrant and indulgent twist on the classic
            American hot dog, renowned for its generous toppings and bold flavors.
            This loaded hot dog features a hearty sausage nestled in a soft bun,
            topped with creamy mashed potatoes, sweet corn, tender peas, fresh
            vegetables, and a medley of sauces that create a symphony of textures
            and tastes. It's a beloved street food in Brazil, offering a satisfying
            meal that combines comfort and creativity.
          </p>
          <p>
            Originating from the bustling streets of São Paulo and Rio de Janeiro,
            the Brazilian hot dog reflects the country's love for rich, layered
            flavors and generous portions. Unlike its simpler counterparts, this
            version embraces a variety of fresh and cooked ingredients, making it
            a complete and hearty dish. Its popularity has spread beyond Brazil,
            inspiring food lovers worldwide to explore this unique culinary
            delight.
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
              Prepare the Toppings
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cook the peas and corn until tender and set aside. Prepare mashed
              potatoes by boiling and mashing potatoes with butter and milk until
              creamy. Grate carrots, chop onions, tomatoes, parsley, and jalapeños
              if using. Mix mayonnaise, ketchup, and mustard in a bowl for the sauce.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Sausages
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Grill or pan-fry the hot dog sausages until they are cooked through and
              nicely browned on the outside. This usually takes about 8-10 minutes.
              Keep them warm while preparing the buns.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Toast the Buns
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Lightly toast the hot dog buns on a grill or in a pan until golden and
              slightly crispy. This adds texture and prevents sogginess from the
              toppings.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Hot Dogs
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place a cooked sausage inside each bun. Generously layer mashed potatoes,
              peas, corn, grated carrots, chopped onions, and tomatoes on top. Drizzle
              with the prepared sauce mixture and sprinkle grated cheese and parsley.
              Add pickled jalapeños if desired for a spicy kick.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve Immediately
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the Brazilian hot dogs fresh and warm. They pair wonderfully with
              cold beverages and make for a satisfying meal or snack.
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
            For extra creaminess, mix a little cream cheese into the mashed potatoes.
          </li>
          <li>
            Toast the buns just before assembling to keep them from becoming soggy.
          </li>
          <li>
            Use fresh, high-quality sausages for the best flavor and texture.
          </li>
          <li>
            Customize the sauce by adding a touch of hot sauce or garlic for more
            depth.
          </li>
          <li>
            If you prefer a lighter version, swap mayonnaise for Greek yogurt in the
            sauce.
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
              href="https://en.wikipedia.org/wiki/Brazilian_cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Brazilian Cuisine Overview
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.tasteatlas.com/brazilian-hot-dog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              TasteAtlas: Brazilian Hot Dog
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