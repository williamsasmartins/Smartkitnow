import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ItalianStyleRoastPorkPorchettaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/ItalianStyle%20Roast%20Pork%20Porchetta%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9901"
  );

  // --- DATA ---
  const title = "Italian-Style Roast Pork (Porchetta)";
  const description = "Herb-crusted rolled pork roast with crispy crackling skin.";

  // INGREDIENTS
  const ingredients = [
    { name: "Pork belly with skin, boneless", baseAmount: 1200, unit: "g" },
    { name: "Fresh rosemary, chopped", baseAmount: 15, unit: "g" },
    { name: "Fresh sage, chopped", baseAmount: 10, unit: "g" },
    { name: "Fresh thyme, chopped", baseAmount: 10, unit: "g" },
    { name: "Garlic cloves, minced", baseAmount: 6, unit: "cloves" },
    { name: "Fennel seeds, toasted and crushed", baseAmount: 10, unit: "g" },
    { name: "Red chili flakes", baseAmount: 2, unit: "g" },
    { name: "Kosher salt", baseAmount: 20, unit: "g" },
    { name: "Black pepper, freshly ground", baseAmount: 5, unit: "g" },
    { name: "Olive oil", baseAmount: 30, unit: "ml" },
    { name: "Lemon zest", baseAmount: 1, unit: "tbsp" },
    { name: "White wine (optional)", baseAmount: 60, unit: "ml" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "650",
    protein: "55g",
    carbs: "2g",
    fat: "45g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of pork is best for making porchetta?",
      answer:
        "The best cut for porchetta is a boneless pork belly with the skin on. This cut provides the perfect balance of tender meat and crispy crackling skin when roasted properly. Some recipes also incorporate pork loin inside the belly for added texture and flavor.",
    },
    {
      question: "How do I achieve crispy crackling on porchetta?",
      answer:
        "To get crispy crackling, ensure the pork skin is very dry before roasting. Score the skin deeply with a sharp knife, rub it generously with salt, and roast at a high temperature initially to puff and crisp the skin. Avoid covering the skin during cooking and finish with a blast of high heat if needed.",
    },
    {
      question: "Can I prepare porchetta in advance?",
      answer:
        "Yes, porchetta can be prepared a day ahead. After roasting, let it cool, then wrap tightly and refrigerate. Reheat gently in the oven before serving to maintain moisture and crispiness. This makes it ideal for entertaining or meal prep.",
    },
    {
      question: "What herbs and spices are traditionally used in porchetta?",
      answer:
        "Traditional porchetta seasoning includes fresh rosemary, sage, thyme, garlic, fennel seeds, salt, and black pepper. Some variations add chili flakes or lemon zest for extra flavor complexity.",
    },
    {
      question: "How long should I roast porchetta for 4 servings?",
      answer:
        "For approximately 1.2 kg of pork belly, roast at 220°C (425°F) for 30 minutes to crisp the skin, then reduce to 160°C (320°F) and roast for another 1.5 to 2 hours until the meat is tender and cooked through. Always use a meat thermometer to ensure an internal temperature of 70°C (160°F).",
    },
    {
      question: "What side dishes pair well with porchetta?",
      answer:
        "Porchetta pairs wonderfully with roasted potatoes, sautéed greens, polenta, or a fresh fennel and orange salad. The rich, herbaceous flavors complement simple, bright sides that balance the dish.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Italian-Style Roast Pork (Porchetta)"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 2h 30m
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
            Porchetta is a classic Italian roast pork dish known for its
            succulent, herb-infused meat wrapped in crispy, crackling skin.
            Traditionally prepared by rolling a boneless pork belly with a
            fragrant mixture of fresh herbs, garlic, and spices, porchetta is
            slow-roasted to perfection, resulting in a tender interior and a
            golden, crunchy exterior. This dish is a celebration of rustic
            Italian flavors and culinary craftsmanship.
          </p>
          <p>
            Originating from central Italy, particularly the Lazio region around
            Rome, porchetta has been a beloved street food and festive centerpiece
            for centuries. Its roots trace back to ancient Roman times when
            pork was seasoned with wild herbs and cooked over open flames. Today,
            porchetta remains a staple in Italian cuisine, enjoyed in sandwiches,
            family meals, and special occasions worldwide.
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
              Lay the pork belly skin-side down on a clean surface. Score the meat
              side in a crosshatch pattern to help the seasoning penetrate. Pat the
              skin dry thoroughly with paper towels to ensure crispiness later.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Make the Herb Filling
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, combine chopped rosemary, sage, thyme, minced garlic,
              crushed fennel seeds, chili flakes, lemon zest, salt, and pepper.
              Drizzle with olive oil and mix into a fragrant paste.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season and Roll
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spread the herb mixture evenly over the scored meat side of the pork
              belly. Roll the pork belly tightly into a log with the skin on the
              outside. Tie securely with kitchen twine at 2-inch intervals.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Roast the Porchetta
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat oven to 220°C (425°F). Place the porchetta on a rack in a
              roasting pan, skin side up. Roast for 30 minutes to crisp the skin,
              then reduce heat to 160°C (320°F) and roast for 1.5 to 2 hours until
              the internal temperature reaches 70°C (160°F).
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Rest and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the porchetta from the oven and let it rest for 15-20 minutes
              before slicing. This helps retain juices and makes slicing easier.
              Serve warm with your favorite sides.
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
            For extra flavor, marinate the rolled porchetta overnight in the
            refrigerator before roasting.
          </li>
          <li>
            Use a sharp knife to score the skin deeply but avoid cutting into the
            meat to help the crackling puff up nicely.
          </li>
          <li>
            If the skin isn’t crisping enough, finish under the broiler for a few
            minutes, watching carefully to prevent burning.
          </li>
          <li>
            Let the porchetta rest uncovered to maintain the crispness of the skin.
          </li>
          <li>
            Serve porchetta thinly sliced in sandwiches with arugula and mustard for
            a delicious casual meal.
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