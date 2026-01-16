import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CrispyPorkBellyBitesTorresmoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Crispy%20Pork%20Belly%20Bites%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4165"
  );

  // --- DATA ---
  const title = "Crispy Pork Belly Bites";
  const description = "Extra crispy, golden-brown deep-fried pork belly chunks.";

  // INGREDIENTS
  const ingredients = [
    { name: "Pork Belly (skin-on, boneless)", baseAmount: 500, unit: "g" },
    { name: "Sea Salt", baseAmount: 10, unit: "g" },
    { name: "Black Pepper (freshly ground)", baseAmount: 5, unit: "g" },
    { name: "Garlic Powder", baseAmount: 3, unit: "g" },
    { name: "Paprika", baseAmount: 3, unit: "g" },
    { name: "Vegetable Oil (for deep frying)", baseAmount: 1000, unit: "ml" },
    { name: "White Vinegar", baseAmount: 15, unit: "ml" },
    { name: "Bay Leaves", baseAmount: 2, unit: "pieces" },
    { name: "Water (for boiling)", baseAmount: 1000, unit: "ml" },
    { name: "Fresh Lime Wedges (for serving)", baseAmount: 4, unit: "pieces" },
    { name: "Chopped Fresh Parsley (optional garnish)", baseAmount: 5, unit: "g" },
    { name: "Salt (for boiling water)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "450",
    protein: "25g",
    carbs: "0g",
    fat: "38g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of pork belly is best for crispy pork belly bites?",
      answer:
        "Choose a skin-on, boneless pork belly with a good balance of meat and fat layers. The skin is essential for achieving the signature crispy crackling texture, while the fat renders down to keep the meat juicy and flavorful.",
    },
    {
      question: "How do I ensure the pork belly bites come out extra crispy?",
      answer:
        "Dry the pork belly skin thoroughly before cooking and score it lightly to help the fat render. Boiling the pork belly first softens the skin and fat, then drying it completely before deep frying ensures maximum crispiness. Frying at the right temperature (around 180°C/350°F) is crucial to avoid soggy or burnt bites.",
    },
    {
      question: "Can I bake the pork belly bites instead of deep frying?",
      answer:
        "While baking can produce a crispy texture, deep frying yields the classic ultra-crispy and golden exterior characteristic of torresmo. If baking, use a high temperature and broil at the end to crisp the skin, but expect a slightly different texture.",
    },
    {
      question: "How long can I store leftover crispy pork belly bites?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days. To re-crisp, reheat in a hot oven or air fryer rather than the microwave to maintain the crunch.",
    },
    {
      question: "What are some popular dipping sauces or accompaniments?",
      answer:
        "Crispy pork belly bites pair wonderfully with tangy lime wedges, spicy vinegar-based sauces, chimichurri, or a garlic aioli. Fresh herbs like parsley or cilantro add a nice freshness to balance the richness.",
    },
    {
      question: "Is it necessary to boil the pork belly before frying?",
      answer:
        "Boiling the pork belly before frying helps render fat and tenderize the meat, making the final bites juicy inside and crispy outside. Skipping this step may result in uneven cooking and less tender pork.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Crispy Pork Belly Bites"
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
            Crispy Pork Belly Bites, also known as "Torresmo" in Brazilian cuisine,
            are irresistible chunks of pork belly that are boiled, dried, and then
            deep-fried to achieve a perfect golden-brown crackling exterior with
            tender, juicy meat inside. This recipe celebrates the art of rendering
            fat and crisping skin to create a snack or appetizer that’s rich in
            flavor and texture.
          </p>
          <p>
            Originating from Brazil and popular throughout Latin America, torresmo
            has roots in traditional pork preservation and cooking techniques. It
            is often enjoyed as a bar snack or accompaniment to feijoada, the famous
            Brazilian black bean stew. The method of boiling before frying ensures
            the pork belly is cooked through and tender, while the final fry
            delivers the signature crunch.
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
              Prepare the Pork Belly
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut the pork belly into bite-sized chunks, about 2-3 cm pieces. Score
              the skin lightly in a crosshatch pattern to help render fat and crisp
              the skin evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Boil the Pork Belly
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pot, bring water to a boil with salt, bay leaves, and white
              vinegar. Add the pork belly pieces and boil gently for 20 minutes until
              tender but not falling apart.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Dry and Season
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove pork from the pot and pat dry thoroughly with paper towels.
              Season with sea salt, black pepper, garlic powder, and paprika evenly.
              Let the pieces rest uncovered in the fridge for at least 1 hour to dry
              the skin further.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Heat Oil and Fry
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a deep fryer or heavy pot to 180°C (350°F). Fry
              the pork belly bites in batches for 5-7 minutes until golden brown and
              crispy. Remove with a slotted spoon and drain on paper towels.
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
              Serve immediately with fresh lime wedges and a sprinkle of chopped
              parsley if desired. Enjoy as a snack, appetizer, or alongside your
              favorite dishes.
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
            Pat the pork belly skin completely dry before frying to maximize crispiness.
          </li>
          <li>
            Use a thermometer to maintain consistent oil temperature; too hot will burn,
            too cool will make the bites greasy.
          </li>
          <li>
            Let the pork rest uncovered in the fridge after seasoning to dry out the skin,
            which helps achieve a better crackle.
          </li>
          <li>
            Fry in small batches to avoid overcrowding the oil, which lowers temperature
            and affects texture.
          </li>
          <li>
            For extra flavor, add aromatics like bay leaves or garlic to the boiling water.
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
              href="https://en.wikipedia.org/wiki/Torresmo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Torresmo (Brazilian Pork Belly Snack)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/how-to-make-crispy-pork-belly-torresmo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Make Crispy Pork Belly (Torresmo)
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