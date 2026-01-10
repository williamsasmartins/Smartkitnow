import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function VealCutletMilaneseCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Veal%20Cutlet%20Milanese%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9246"
  );

  // --- DATA ---
  const title = "Veal Cutlet Milanese";
  const description = "Breaded and fried veal cutlet served with lemon and arugula.";

  // INGREDIENTS
  const ingredients = [
    { name: "Veal cutlets", baseAmount: 500, unit: "g" },
    { name: "All-purpose flour", baseAmount: 100, unit: "g" },
    { name: "Large eggs", baseAmount: 2, unit: "pcs" },
    { name: "Plain breadcrumbs", baseAmount: 150, unit: "g" },
    { name: "Parmesan cheese, grated", baseAmount: 50, unit: "g" },
    { name: "Fresh parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Lemon, sliced", baseAmount: 1, unit: "pc" },
    { name: "Arugula leaves", baseAmount: 50, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper, freshly ground", baseAmount: 0.5, unit: "tsp" },
    { name: "Vegetable oil (for frying)", baseAmount: 500, unit: "ml" },
    { name: "Butter", baseAmount: 30, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "650",
    protein: "45g",
    carbs: "35g",
    fat: "35g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of veal is best for Veal Cutlet Milanese?",
      answer:
        "The best cut for Veal Cutlet Milanese is veal scaloppine or thinly sliced veal loin or leg. These cuts are tender and cook quickly, making them ideal for breading and frying. If the cutlets are too thick, pound them gently to an even thinness of about 1/4 inch for the best texture and cooking results.",
    },
    {
      question: "Can I substitute veal with another meat?",
      answer:
        "Yes, you can substitute veal with thinly sliced chicken breast or pork loin cutlets if veal is unavailable. However, veal has a delicate flavor and tenderness that is characteristic of this dish. Adjust cooking times accordingly to avoid overcooking the substitute meat.",
    },
    {
      question: "How do I get a crispy and golden crust on the cutlets?",
      answer:
        "To achieve a crispy and golden crust, make sure to dredge the veal cutlets evenly in flour, then dip in beaten eggs, and finally coat thoroughly with a mixture of breadcrumbs and grated Parmesan cheese. Use fresh breadcrumbs if possible. Fry in hot vegetable oil with a bit of butter for flavor, and avoid overcrowding the pan to maintain oil temperature.",
    },
    {
      question: "What is the traditional way to serve Veal Cutlet Milanese?",
      answer:
        "Traditionally, Veal Cutlet Milanese is served hot, garnished with fresh lemon wedges and a side of peppery arugula salad dressed lightly with olive oil and lemon juice. This combination balances the richness of the fried cutlet with fresh acidity and peppery greens.",
    },
    {
      question: "Can I prepare the cutlets ahead of time?",
      answer:
        "You can bread the veal cutlets ahead of time and keep them refrigerated for a few hours before frying. However, it is best to fry them just before serving to maintain maximum crispiness. Reheating fried cutlets may cause the crust to become soggy.",
    },
    {
      question: "What oil is best for frying Veal Cutlet Milanese?",
      answer:
        "Use a neutral oil with a high smoke point such as vegetable oil, canola oil, or peanut oil for frying. Adding a small amount of butter to the oil enhances flavor and helps achieve a beautiful golden crust.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Veal Cutlet Milanese"
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
            Veal Cutlet Milanese, or Cotoletta alla Milanese, is a classic Italian
            dish featuring tender veal cutlets breaded and fried to golden
            perfection. This recipe combines a crispy, flavorful crust with the
            delicate texture of veal, served traditionally with fresh lemon and a
            peppery arugula salad. It's a beloved staple in Milanese cuisine and
            offers a perfect balance of richness and freshness.
          </p>
          <p>
            The origins of Veal Cutlet Milanese date back to the 19th century in
            Milan, Italy. It is believed to have been inspired by Austrian Wiener
            Schnitzel but developed its own unique identity with the addition of
            Parmesan cheese in the breadcrumb coating and the use of veal. This
            dish has since become a symbol of Milanese culinary tradition and is
            enjoyed worldwide for its simplicity and elegance.
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
              Prepare the Veal Cutlets
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Trim any excess fat from the veal cutlets and gently pound them to an
              even thickness of about 1/4 inch using a meat mallet. Season both
              sides with salt and freshly ground black pepper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Set Up Breading Stations
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the flour in a shallow dish. In another bowl, beat the eggs
              until smooth. In a third dish, combine the breadcrumbs, grated
              Parmesan cheese, and chopped parsley.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bread the Cutlets
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Dredge each veal cutlet first in flour, shaking off excess, then dip
              into the beaten eggs, and finally coat evenly with the breadcrumb
              mixture. Press gently to adhere the coating well.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Fry the Cutlets
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil and butter in a large skillet over medium-high
              heat. Fry the cutlets for about 3-4 minutes per side until golden
              brown and cooked through. Avoid overcrowding the pan; fry in batches
              if necessary.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Drain and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the fried cutlets to a paper towel-lined plate to drain
              excess oil. Serve immediately garnished with lemon slices and a side
              of fresh arugula dressed lightly with olive oil and lemon juice.
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
            Use fresh breadcrumbs made from day-old bread for a lighter, crispier
            crust.
          </li>
          <li>
            Adding a bit of grated Parmesan cheese to the breadcrumb mixture adds
            a savory depth and helps with browning.
          </li>
          <li>
            Maintain the oil temperature around 170-180°C (340-355°F) to ensure
            even frying without absorbing excess oil.
          </li>
          <li>
            For extra flavor, add a splash of lemon juice over the cutlets just
            before serving.
          </li>
          <li>
            If you don’t have veal, chicken breast cutlets can be used as a
            delicious alternative.
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
