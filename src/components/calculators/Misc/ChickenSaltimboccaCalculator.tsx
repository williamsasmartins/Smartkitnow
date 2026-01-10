import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChickenSaltimboccaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chicken%20Saltimbocca%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8673"
  );

  // --- DATA ---
  const title = "Chicken Saltimbocca";
  const description = "Chicken cutlets topped with prosciutto and sage, in white wine sauce.";

  // INGREDIENTS
  const ingredients = [
    { name: "Chicken breast cutlets", baseAmount: 500, unit: "g" },
    { name: "Prosciutto slices", baseAmount: 8, unit: "slices" },
    { name: "Fresh sage leaves", baseAmount: 12, unit: "leaves" },
    { name: "All-purpose flour", baseAmount: 50, unit: "g" },
    { name: "Unsalted butter", baseAmount: 60, unit: "g" },
    { name: "Olive oil", baseAmount: 2, unit: "tbsp" },
    { name: "Dry white wine", baseAmount: 120, unit: "ml" },
    { name: "Chicken stock", baseAmount: 120, unit: "ml" },
    { name: "Lemon juice", baseAmount: 1, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Freshly ground black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Garlic cloves (minced)", baseAmount: 2, unit: "cloves" },
    { name: "Parmesan cheese (optional)", baseAmount: 30, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "45g",
    carbs: "5g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Chicken Saltimbocca?",
      answer:
        "Chicken Saltimbocca is a classic Italian dish originating from Rome, featuring tender chicken cutlets topped with prosciutto and fresh sage leaves, cooked in a flavorful white wine and butter sauce. The name 'Saltimbocca' means 'jumps in the mouth' in Italian, highlighting its delicious taste.",
    },
    {
      question: "Can I use other meats instead of chicken?",
      answer:
        "Yes, traditionally veal is used in Saltimbocca, but chicken is a popular and accessible alternative. You can also try pork cutlets or turkey breast slices, but cooking times may vary accordingly.",
    },
    {
      question: "How do I prevent the prosciutto from getting soggy?",
      answer:
        "To keep the prosciutto crisp, cook the chicken cutlets prosciutto-side down first in a hot pan with a bit of olive oil and butter. This helps render some fat and crisps the prosciutto. Avoid covering the pan tightly to prevent steam buildup.",
    },
    {
      question: "What can I serve with Chicken Saltimbocca?",
      answer:
        "Chicken Saltimbocca pairs beautifully with simple sides like sautéed spinach, roasted potatoes, creamy polenta, or a fresh green salad. The light white wine sauce complements mild and fresh accompaniments.",
    },
    {
      question: "Can I prepare Chicken Saltimbocca ahead of time?",
      answer:
        "You can assemble the cutlets with prosciutto and sage ahead of time and keep them refrigerated for a few hours. However, it's best to cook them just before serving to maintain the crispness of the prosciutto and freshness of the sauce.",
    },
    {
      question: "Is it necessary to use white wine in the sauce?",
      answer:
        "White wine adds a bright acidity and depth to the sauce, balancing the richness of butter and prosciutto. If you prefer not to use alcohol, you can substitute with additional chicken stock and a splash of lemon juice for acidity.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Chicken Saltimbocca"
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
            Chicken Saltimbocca is a beloved Italian classic that combines tender,
            juicy chicken cutlets with the savory flavors of prosciutto and fresh sage.
            Finished with a delicate white wine and butter sauce, this dish offers a
            perfect balance of richness and brightness. It's a quick yet elegant meal
            that brings the taste of Italy right to your table.
          </p>
          <p>
            Originating from Rome, Saltimbocca traditionally uses veal, but chicken has
            become a popular substitute due to its accessibility and lighter flavor.
            The name "Saltimbocca" translates to "jumps in the mouth," a testament to
            its irresistible taste and texture. This recipe celebrates simple,
            high-quality ingredients prepared with care to deliver a memorable dining
            experience.
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
              Prepare the Chicken Cutlets
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pound the chicken breasts gently between two sheets of plastic wrap until
              about 1/4 inch thick. Season both sides with salt and freshly ground black
              pepper. Lightly dredge each cutlet in flour, shaking off any excess.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble Saltimbocca
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place 2 sage leaves on each cutlet, then top with a slice of prosciutto.
              Secure with toothpicks if needed to keep the prosciutto in place during
              cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Cutlets
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil and half the butter in a large skillet over medium-high
              heat. Place the cutlets prosciutto-side down and cook until the prosciutto
              is crisp and golden, about 2-3 minutes. Flip and cook the other side until
              chicken is cooked through, about 3-4 minutes. Remove cutlets and keep warm.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Make the Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Reduce heat to medium and add minced garlic to the pan, sautéing briefly
              until fragrant. Pour in white wine and chicken stock, scraping up any
              browned bits from the pan. Let the sauce simmer and reduce by half, about
              4-5 minutes. Stir in remaining butter and lemon juice until sauce is silky.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Return the cutlets to the pan briefly to coat with sauce and warm through.
              Remove toothpicks, plate the cutlets, spoon sauce over them, and garnish
              with extra sage leaves or freshly grated Parmesan if desired. Serve
              immediately.
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
            Use thinly sliced chicken cutlets for even cooking and tender texture.
          </li>
          <li>
            Pat the chicken dry before dredging in flour to ensure a nice sear.
          </li>
          <li>
            Crisp the prosciutto first to add texture and prevent sogginess.
          </li>
          <li>
            Deglaze the pan with white wine and chicken stock to capture all the
            flavorful browned bits.
          </li>
          <li>
            Add lemon juice at the end to brighten the sauce without overpowering it.
          </li>
          <li>
            Serve immediately for best texture; leftovers can be gently reheated but
            may lose crispness.
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
