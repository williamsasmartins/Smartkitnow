import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SidesVinaigretteCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Tomato%20Vinaigrette%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3835"
  );

  // --- DATA ---
  const title = "Brazilian Tomato Vinaigrette";
  const description = "Refreshing salsa to balance the richness of barbecued meats.";

  // INGREDIENTS
  const ingredients = [
    { name: "Ripe Tomatoes, finely chopped", baseAmount: 500, unit: "g" },
    { name: "Red Onion, finely chopped", baseAmount: 100, unit: "g" },
    { name: "Fresh Parsley, chopped", baseAmount: 30, unit: "g" },
    { name: "Fresh Cilantro, chopped", baseAmount: 20, unit: "g" },
    { name: "Green Bell Pepper, finely chopped", baseAmount: 100, unit: "g" },
    { name: "Garlic Cloves, minced", baseAmount: 2, unit: "cloves" },
    { name: "Extra Virgin Olive Oil", baseAmount: 60, unit: "ml" },
    { name: "White Vinegar", baseAmount: 30, unit: "ml" },
    { name: "Lime Juice, freshly squeezed", baseAmount: 15, unit: "ml" },
    { name: "Sugar", baseAmount: 5, unit: "g" },
    { name: "Salt", baseAmount: 3, unit: "g" },
    { name: "Black Pepper, freshly ground", baseAmount: 1, unit: "g" },
    { name: "Red Chili Pepper, finely chopped (optional)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "90",
    protein: "1g",
    carbs: "5g",
    fat: "8g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Brazilian Tomato Vinaigrette?",
      answer:
        "Brazilian Tomato Vinaigrette, also known as 'Vinagrete', is a fresh, tangy salsa made primarily from chopped tomatoes, onions, and herbs, dressed with vinegar and olive oil. It is commonly served as a condiment alongside grilled meats, especially in Brazilian barbecue (churrasco).",
    },
    {
      question: "Can I make this vinaigrette ahead of time?",
      answer:
        "Yes, you can prepare the vinaigrette a few hours in advance. Allowing it to rest in the refrigerator helps the flavors meld beautifully. However, for the freshest texture, it’s best consumed within 24 hours.",
    },
    {
      question: "How spicy is this vinaigrette?",
      answer:
        "The traditional recipe is mildly spicy, but you can adjust the heat by adding or omitting the red chili pepper. For a milder version, simply leave out the chili or reduce its quantity.",
    },
    {
      question: "What dishes pair well with Brazilian Tomato Vinaigrette?",
      answer:
        "This vinaigrette pairs excellently with grilled meats like beef, chicken, and pork. It also complements rice dishes, black beans, and can be used as a fresh topping for sandwiches or salads.",
    },
    {
      question: "Can I substitute white vinegar with another type?",
      answer:
        "While white vinegar is traditional for its clean acidity, you can substitute it with apple cider vinegar or red wine vinegar for a slightly different flavor profile. Just keep the quantity the same to maintain balance.",
    },
    {
      question: "Is this vinaigrette suitable for vegans and vegetarians?",
      answer:
        "Absolutely! Brazilian Tomato Vinaigrette is entirely plant-based, making it perfect for vegan and vegetarian diets.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Tomato Vinaigrette"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 0m
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
            Brazilian Tomato Vinaigrette, or "Vinagrete," is a vibrant and refreshing condiment that
            brings brightness and acidity to any meal. This fresh salsa-like vinaigrette is a staple
            in Brazilian cuisine, especially beloved as a perfect accompaniment to churrasco (Brazilian
            barbecue). Its combination of ripe tomatoes, crisp onions, fresh herbs, and a tangy dressing
            creates a lively balance that cuts through rich, smoky grilled meats.
          </p>
          <p>
            The origins of Vinagrete trace back to Portuguese culinary influences blended with native
            Brazilian ingredients. Over time, it has evolved into a versatile side that reflects the
            country's love for fresh, bold flavors. Traditionally served chilled or at room temperature,
            this vinaigrette is simple to prepare yet elevates any dish with its bright, zesty character.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Vegetables</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Finely chop the ripe tomatoes, red onion, green bell pepper, parsley, cilantro, and red chili pepper (if using). Mince the garlic cloves. Place all chopped ingredients into a large mixing bowl.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Dressing</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small bowl, whisk together the extra virgin olive oil, white vinegar, lime juice, sugar, salt, and freshly ground black pepper until the sugar dissolves and the dressing emulsifies.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine and Toss</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the dressing over the chopped vegetables and herbs. Gently toss everything together until evenly coated. Taste and adjust seasoning if necessary.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Rest and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Let the vinaigrette rest for at least 20 minutes at room temperature or chill in the refrigerator for up to 2 hours to allow flavors to meld. Serve alongside grilled meats, rice, or beans.
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
            Use ripe, firm tomatoes for the best texture and flavor. Roma or plum tomatoes work well.
          </li>
          <li>
            Adjust the acidity by balancing vinegar and lime juice to your taste preference.
          </li>
          <li>
            For a milder vinaigrette, omit the chili pepper or replace it with sweet bell pepper.
          </li>
          <li>
            Fresh herbs like parsley and cilantro add brightness; feel free to increase or reduce quantities.
          </li>
          <li>
            This vinaigrette can be stored in the refrigerator for up to 24 hours, but it's best fresh.
          </li>
          <li>
            Serve at room temperature to maximize flavor and aroma.
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
              href="https://www.thespruceeats.com/brazilian-vinaigrette-recipe-3029333"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Brazilian Vinaigrette Recipe
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