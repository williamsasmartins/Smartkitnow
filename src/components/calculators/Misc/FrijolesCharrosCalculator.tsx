import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FrijolesCharrosCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Charro%20Beans%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8906"
  );

  // --- DATA ---
  const title = "Charro Beans";
  const description = "Feijão com bacon/linguiça, tomate e especiarias, estilo “charro”.";

  // INGREDIENTS
  const ingredients = [
    { name: "Dry Pinto Beans", baseAmount: 500, unit: "g" },
    { name: "Bacon, diced", baseAmount: 150, unit: "g" },
    { name: "Mexican Chorizo, casing removed", baseAmount: 150, unit: "g" },
    { name: "White Onion, finely chopped", baseAmount: 120, unit: "g" },
    { name: "Garlic Cloves, minced", baseAmount: 4, unit: "cloves" },
    { name: "Roma Tomatoes, chopped", baseAmount: 300, unit: "g" },
    { name: "Jalapeño Pepper, seeded and chopped", baseAmount: 1, unit: "piece" },
    { name: "Fresh Cilantro, chopped", baseAmount: 15, unit: "g" },
    { name: "Chicken Broth", baseAmount: 1000, unit: "ml" },
    { name: "Bay Leaves", baseAmount: 2, unit: "leaves" },
    { name: "Ground Cumin", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Lime Juice", baseAmount: 1, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "28g",
    carbs: "40g",
    fat: "14g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What are Charro Beans and where do they originate?",
      answer:
        "Charro Beans, or 'Frijoles Charros,' are a traditional Mexican dish named after the Mexican horsemen called 'charros.' This hearty bean stew combines pinto beans with smoky bacon, spicy chorizo, fresh tomatoes, and aromatic herbs, reflecting the rustic flavors of rural Mexico, especially popular in Northern Mexican cuisine.",
    },
    {
      question: "Can I use canned beans instead of dry beans?",
      answer:
        "While canned beans can be used for convenience, dry beans provide a better texture and flavor when properly soaked and cooked. If using canned beans, reduce the cooking time and adjust the liquid accordingly to avoid a watery stew.",
    },
    {
      question: "How spicy is Charro Beans, and can I adjust the heat?",
      answer:
        "Charro Beans typically have a mild to moderate heat level, mainly from jalapeño peppers and chorizo. You can adjust the spiciness by removing seeds from the jalapeño or substituting with milder peppers. Adding extra chili powder or hot sauce can increase the heat if desired.",
    },
    {
      question: "What are some common side dishes to serve with Charro Beans?",
      answer:
        "Charro Beans pair wonderfully with Mexican rice, warm corn tortillas, grilled meats, or fresh salads. They also make a great accompaniment to tacos, enchiladas, or as a hearty side for barbecues.",
    },
    {
      question: "Can I make Charro Beans vegetarian or vegan?",
      answer:
        "Yes, you can make a vegetarian or vegan version by omitting the bacon and chorizo. Substitute with smoked paprika or liquid smoke for a smoky flavor, and add sautéed mushrooms or plant-based sausage alternatives to maintain richness.",
    },
    {
      question: "How should I store and reheat leftovers?",
      answer:
        "Store Charro Beans in an airtight container in the refrigerator for up to 4 days. Reheat gently on the stovetop or microwave, adding a splash of broth or water if the stew has thickened too much. They also freeze well for up to 3 months.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Charro Beans"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 90m
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
            Charro Beans, or Frijoles Charros, are a beloved traditional Mexican stew known for their rich,
            smoky, and hearty flavors. This dish combines pinto beans simmered slowly with bacon, spicy chorizo,
            fresh tomatoes, onions, garlic, and a medley of spices. The result is a comforting, rustic stew that
            perfectly balances savory, spicy, and fresh notes, making it a staple in Mexican households and
            celebrations.
          </p>
          <p>
            The origins of Charro Beans trace back to the Mexican charros, the traditional horsemen and cowboys
            of Mexico, who needed a nourishing and flavorful meal that could be prepared easily over a campfire.
            The dish reflects the resourcefulness and bold flavors of Northern Mexican cuisine, often enjoyed
            alongside grilled meats or as a hearty side dish. Today, it remains a popular comfort food, celebrated
            for its depth of flavor and cultural significance.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Soak and Prepare Beans</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the dry pinto beans thoroughly and soak them in cold water for at least 6 hours or overnight.
              Drain and rinse before cooking to reduce cooking time and improve digestibility.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Bacon and Chorizo</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pot or Dutch oven, cook the diced bacon over medium heat until crispy. Add the chorizo,
              breaking it up with a spoon, and cook until browned and fragrant. Remove excess fat if desired.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Vegetables</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add chopped onions, garlic, and jalapeño to the pot. Sauté until the onions are translucent and
              fragrant, about 5 minutes. Stir in chopped tomatoes and cook for another 3-4 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Beans and Broth</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the soaked and drained beans to the pot along with chicken broth, bay leaves, cumin, salt,
              and pepper. Stir to combine and bring to a boil.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Simmer Until Tender</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Reduce heat to low, cover partially, and simmer for 1 to 1.5 hours, stirring occasionally, until
              beans are tender and the stew has thickened. Adjust seasoning as needed.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Finish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in fresh chopped cilantro and lime juice just before serving. Serve hot with warm tortillas
              or as a side to your favorite Mexican dishes.
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
            For a richer flavor, cook the beans with a ham bone or smoked pork hock if available.
          </li>
          <li>
            Soaking beans overnight helps reduce cooking time and improves digestibility, but quick-soaking by boiling for 2 minutes and resting for 1 hour also works.
          </li>
          <li>
            Adjust the thickness of the stew by adding more broth if it becomes too thick during simmering.
          </li>
          <li>
            Use fresh, high-quality chorizo for authentic flavor; alternatively, substitute with spicy sausage if needed.
          </li>
          <li>
            Garnish with diced avocado, crumbled queso fresco, or a dollop of sour cream for extra creaminess.
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
              href="https://en.wikipedia.org/wiki/Charro_beans"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Charro Beans
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.mexicoinmykitchen.com/frijoles-charros-charro-beans/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Mexico In My Kitchen: Frijoles Charros Recipe
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