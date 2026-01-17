import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CashewFruitJuiceSucoDeCajuCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Cashew%20Fruit%20Juice%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1277"
  );

  // --- DATA ---
  const title = "Cashew Fruit Juice";
  const description = "Unique, slightly astringent juice from the cashew apple.";

  // INGREDIENTS
  const ingredients = [
    { name: "Fresh Cashew Apples (washed and chopped)", baseAmount: 500, unit: "g" },
    { name: "Filtered Water", baseAmount: 750, unit: "ml" },
    { name: "Granulated Sugar", baseAmount: 50, unit: "g" },
    { name: "Fresh Lime Juice", baseAmount: 15, unit: "ml" },
    { name: "Ice Cubes", baseAmount: 200, unit: "g" },
    { name: "Mint Leaves (for garnish)", baseAmount: 5, unit: "g" },
    { name: "Salt (a pinch)", baseAmount: 0.5, unit: "g" },
    { name: "Honey (optional, for sweetness)", baseAmount: 10, unit: "g" },
    { name: "Ginger (fresh, peeled and grated)", baseAmount: 5, unit: "g" },
    { name: "Chia Seeds (optional, for texture)", baseAmount: 10, unit: "g" },
    { name: "Sparkling Water (optional, to top up)", baseAmount: 100, unit: "ml" },
    { name: "Lemon Zest (for aroma)", baseAmount: 2, unit: "g" },
    { name: "Cinnamon Stick (for infusion)", baseAmount: 1, unit: "stick" },
    { name: "Cloves (for infusion)", baseAmount: 2, unit: "pcs" },
  ];

  // Nutrition values approximate per serving (250ml)
  const nutrition = {
    calories: "85",
    protein: "0.5g",
    carbs: "21g",
    fat: "0.2g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is cashew fruit juice and how does it differ from cashew nut products?",
      answer:
        "Cashew fruit juice is extracted from the cashew apple, the fleshy, pear-shaped fruit attached to the cashew nut. Unlike cashew nuts, which are seeds, the juice is a refreshing beverage with a unique sweet-tart flavor and slight astringency. It is rich in vitamin C and antioxidants, making it a nutritious drink distinct from the nut itself.",
    },
    {
      question: "How do I select and prepare cashew apples for juicing?",
      answer:
        "Choose ripe cashew apples that are firm, brightly colored (yellow, orange, or red), and free from bruises or mold. Wash them thoroughly to remove dirt and any pesticide residues. Chop the apples into smaller pieces to facilitate easier juicing or blending. Remove the cashew nut attached to the fruit carefully, as it contains irritants and should not be consumed raw.",
    },
    {
      question: "Can I store cashew fruit juice, and how long does it stay fresh?",
      answer:
        "Fresh cashew fruit juice is best consumed immediately to enjoy its vibrant flavor and nutritional benefits. If you need to store it, keep it refrigerated in an airtight container and consume within 24 to 48 hours. The juice may ferment or lose flavor quickly due to its natural sugars and enzymes, so avoid prolonged storage.",
    },
    {
      question: "Are there any health benefits or risks associated with cashew fruit juice?",
      answer:
        "Cashew fruit juice is rich in vitamin C, antioxidants, and dietary fiber, which support immune health and digestion. However, the juice can be slightly astringent and acidic, so those with sensitive stomachs should consume it in moderation. Also, ensure the juice is prepared hygienically to avoid contamination. The cashew nut shell contains urushiol, a skin irritant, but the juice itself is safe when properly prepared.",
    },
    {
      question: "How can I enhance the flavor of cashew fruit juice?",
      answer:
        "You can enhance the flavor by adding fresh lime or lemon juice for brightness, a touch of honey or sugar for sweetness, and spices like ginger, cinnamon, or cloves for warmth and complexity. Adding mint leaves or a splash of sparkling water can also add refreshing notes and texture to the juice.",
    },
    {
      question: "Is cashew fruit juice commonly used in any traditional cuisines or beverages?",
      answer:
        "Yes, cashew fruit juice is popular in tropical regions such as Brazil, India, and parts of Africa, where cashew trees grow abundantly. In Brazil, it is known as 'suco de caju' and is enjoyed as a refreshing drink, often served chilled or mixed with other tropical fruits. It is also used in cocktails and culinary recipes to add a unique fruity flavor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Cashew Fruit Juice"
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
            Cashew fruit juice, known as "suco de caju" in Brazil, is a vibrant and refreshing beverage made from the cashew apple—the juicy, colorful fruit attached to the cashew nut. This juice offers a unique balance of sweetness and astringency, with a bright tropical aroma and a slightly tart finish. It is a beloved drink in tropical regions where cashew trees flourish, prized for its natural vitamin C content and invigorating flavor.
          </p>
          <p>
            Historically, cashew fruit juice has been consumed for centuries in South America, Africa, and parts of Asia. Indigenous peoples discovered the fruit's potential not only as a food source but also as a medicinal tonic. Today, it remains a staple in local markets and is gaining popularity worldwide as a healthy and exotic alternative to conventional fruit juices.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Cashew Apples</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Wash the cashew apples thoroughly under running water. Remove the attached cashew nuts carefully and discard or set aside for other uses. Chop the apples into small pieces to facilitate blending or juicing.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Infuse the Water</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small saucepan, combine filtered water with the cinnamon stick and cloves. Heat gently and let it simmer for 5 minutes to infuse the spices. Remove from heat and let it cool to room temperature.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Blend the Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a blender, add the chopped cashew apples, cooled infused water, granulated sugar, fresh lime juice, grated ginger, honey (if using), and a pinch of salt. Blend until smooth and well combined.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Strain the Juice</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the blended mixture through a fine mesh sieve or cheesecloth into a large bowl or pitcher to remove pulp and fibers, yielding a smooth juice.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Ice and Optional Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in ice cubes and chia seeds if desired. For a sparkling twist, top up with chilled sparkling water. Garnish with fresh mint leaves and lemon zest before serving.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve and Enjoy</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the cashew fruit juice chilled in tall glasses. Enjoy its refreshing, tropical flavor as a healthy beverage or a unique accompaniment to your meals.
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
            Use ripe cashew apples for the best flavor; underripe fruits can be overly astringent and sour.
          </li>
          <li>
            If fresh cashew apples are unavailable, consider using frozen pulp or concentrate, but fresh is always preferred for vibrant taste.
          </li>
          <li>
            Adjust sweetness gradually; cashew fruit juice naturally has a complex flavor that balances well with moderate sugar or honey.
          </li>
          <li>
            Infusing water with warm spices like cinnamon and cloves adds depth and subtle warmth to the juice.
          </li>
          <li>
            Adding chia seeds not only enhances texture but also boosts nutritional value with omega-3 fatty acids and fiber.
          </li>
          <li>
            Serve immediately after preparation to enjoy the freshest taste and preserve vitamin content.
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
              href="https://en.wikipedia.org/wiki/Cashew_apple"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Cashew Apple
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/plant/cashew"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Cashew Tree and Fruit
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.tasteatlas.com/suco-de-caju"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              TasteAtlas: Suco de Caju (Cashew Fruit Juice)
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