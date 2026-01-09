import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PotatoGnocchiWithTomatoSauceCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Potato%20Gnocchi%20with%20Tomato%20Sauce%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3681"
  );

  // --- DATA ---
  const title = "Potato Gnocchi with Tomato Sauce";
  const description = "Fluffy potato dumplings in simple fresh tomato sauce.";

  // INGREDIENTS
  const ingredients = [
    { name: "Russet Potatoes (peeled and boiled)", baseAmount: 700, unit: "g" },
    { name: "All-purpose Flour", baseAmount: 180, unit: "g" },
    { name: "Egg (large)", baseAmount: 1, unit: "pc" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Garlic Cloves (minced)", baseAmount: 2, unit: "pcs" },
    { name: "Canned San Marzano Tomatoes", baseAmount: 400, unit: "g" },
    { name: "Fresh Basil Leaves", baseAmount: 10, unit: "g" },
    { name: "Onion (finely chopped)", baseAmount: 1, unit: "pc" },
    { name: "Salt (for sauce)", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "Parmesan Cheese (grated, optional)", baseAmount: 50, unit: "g" },
    { name: "Water (for boiling gnocchi)", baseAmount: 2000, unit: "ml" },
    { name: "Sugar (optional, to balance acidity)", baseAmount: 0.5, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "9g",
    carbs: "75g",
    fat: "6g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    base * (servings / 4) % 1 === 0
      ? (base * (servings / 4)).toFixed(0)
      : (base * (servings / 4)).toFixed(1);

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of potatoes are best for making gnocchi?",
      answer:
        "Russet or starchy potatoes are ideal for gnocchi because they have a dry texture that helps create light and fluffy dumplings. Waxy potatoes tend to make the dough too sticky and dense.",
    },
    {
      question: "How can I prevent my gnocchi from falling apart during cooking?",
      answer:
        "Make sure not to overwork the dough and use just enough flour to bring it together. Also, boil the gnocchi in plenty of salted water and remove them as soon as they float to the surface to avoid overcooking.",
    },
    {
      question: "Can I make gnocchi dough ahead of time?",
      answer:
        "Yes, you can prepare the dough a few hours ahead and keep it wrapped tightly in plastic wrap in the refrigerator. For longer storage, gnocchi can be frozen before cooking by placing them on a baking sheet and then transferring to a freezer bag.",
    },
    {
      question: "How do I make the tomato sauce taste fresh and vibrant?",
      answer:
        "Use high-quality canned San Marzano tomatoes or fresh ripe tomatoes if in season. Simmer the sauce gently with garlic, onion, and fresh basil, and season with salt and a pinch of sugar to balance acidity. Avoid overcooking to preserve brightness.",
    },
    {
      question: "What can I serve with potato gnocchi and tomato sauce?",
      answer:
        "This dish pairs wonderfully with a simple green salad, crusty bread, and a glass of light red wine such as Chianti. You can also sprinkle freshly grated Parmesan or Pecorino cheese on top for extra flavor.",
    },
    {
      question: "Is it possible to make this recipe vegan?",
      answer:
        "Yes, you can omit the egg in the gnocchi dough and use a flaxseed or chia seed egg substitute instead. Also, skip the Parmesan cheese or use a vegan cheese alternative for topping.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Potato Gnocchi with Tomato Sauce"
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
            Potato gnocchi are delicate, fluffy dumplings made primarily from russet potatoes,
            flour, and egg. This recipe pairs them with a fresh, vibrant tomato sauce made from
            San Marzano tomatoes, garlic, and basil, creating a comforting yet elegant Italian
            dish. The gnocchi’s pillowy texture contrasts beautifully with the bright acidity of
            the tomato sauce, making it a favorite in both home kitchens and Michelin-starred
            restaurants.
          </p>
          <p>
            Originating from Italy, gnocchi have been a staple for centuries, with variations
            found across regions. Potato gnocchi became popular in the 18th century after the
            introduction of potatoes to Europe. This recipe reflects the classic northern Italian
            style, emphasizing simplicity and quality ingredients to highlight the natural flavors.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Potatoes</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Boil the peeled russet potatoes whole in salted water until tender, about 20-25
              minutes. Drain and let them cool slightly, then pass through a potato ricer or mash
              thoroughly until smooth. Avoid lumps for the best gnocchi texture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              On a clean surface, combine the mashed potatoes with flour, salt, and the beaten egg.
              Gently knead until a soft dough forms. Be careful not to overwork it to keep the
              gnocchi light.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Shape the Gnocchi</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Divide the dough into smaller portions and roll each into long ropes about 2 cm thick.
              Cut into 2 cm pieces and gently roll each piece over the back of a fork to create
              ridges that help hold the sauce.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Gnocchi</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring a large pot of salted water to a boil. Add gnocchi in batches and cook until
              they float to the surface, about 2-3 minutes. Remove with a slotted spoon and set
              aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Tomato Sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a skillet, heat olive oil over medium heat. Sauté onion and garlic until fragrant
              and translucent. Add canned tomatoes, salt, pepper, and a pinch of sugar. Simmer for
              10 minutes, then stir in fresh basil leaves.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Toss the cooked gnocchi gently in the tomato sauce until well coated. Serve hot,
              garnished with freshly grated Parmesan cheese if desired.
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
            Use starchy potatoes like russets and avoid waxy varieties to ensure light, fluffy gnocchi.
          </li>
          <li>
            Do not over-knead the dough; too much handling activates gluten and makes gnocchi tough.
          </li>
          <li>
            Rolling gnocchi over a fork or gnocchi board creates ridges that help the sauce cling better.
          </li>
          <li>
            If the dough feels sticky, dust your work surface and hands lightly with flour, but avoid adding too much.
          </li>
          <li>
            For a richer sauce, finish with a drizzle of good quality extra virgin olive oil before serving.
          </li>
          <li>
            Leftover gnocchi freeze well; freeze them on a tray before transferring to a bag to prevent sticking.
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