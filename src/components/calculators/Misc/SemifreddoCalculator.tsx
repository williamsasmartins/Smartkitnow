import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SemifreddoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Semifreddo%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1003"
  );

  // --- DATA ---
  const title = "Semifreddo";
  const description = "Semi-frozen mousse-like dessert, often flavored with nuts or fruit.";

  // INGREDIENTS
  const ingredients = [
    { name: "Egg Yolks", baseAmount: 6, unit: "pcs" },
    { name: "Granulated Sugar", baseAmount: 150, unit: "g" },
    { name: "Heavy Cream", baseAmount: 400, unit: "ml" },
    { name: "Vanilla Bean (split and scraped)", baseAmount: 1, unit: "pc" },
    { name: "Almonds (toasted and chopped)", baseAmount: 100, unit: "g" },
    { name: "Honey", baseAmount: 50, unit: "g" },
    { name: "Espresso (optional)", baseAmount: 30, unit: "ml" },
    { name: "Dark Chocolate (for garnish)", baseAmount: 50, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "pinch" },
    { name: "Lemon Zest", baseAmount: 1, unit: "tsp" },
    { name: "Powdered Sugar (for dusting)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "7g",
    carbs: "30g",
    fat: "30g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is semifreddo and how does it differ from ice cream?",
      answer:
        "Semifreddo is an Italian semi-frozen dessert with a mousse-like texture. Unlike ice cream, it is not churned during freezing, resulting in a lighter, airy consistency. It often contains whipped cream and egg yolks, giving it a creamy yet soft texture that melts smoothly in the mouth.",
    },
    {
      question: "Can I make semifreddo without raw eggs?",
      answer:
        "Yes, you can substitute raw egg yolks with pasteurized eggs or use eggless recipes that rely on whipped cream and gelatin for structure. However, traditional semifreddo uses raw egg yolks for richness and texture, so ensure eggs are fresh and handled safely if you choose the classic method.",
    },
    {
      question: "How long should semifreddo be frozen before serving?",
      answer:
        "Semifreddo should be frozen for at least 6 hours, preferably overnight, to achieve the ideal semi-frozen texture. This allows the dessert to firm up while maintaining its creamy, mousse-like consistency.",
    },
    {
      question: "Can semifreddo be flavored with fruits or nuts?",
      answer:
        "Absolutely! Semifreddo is very versatile and can be flavored with a variety of ingredients such as fresh fruits, nuts, chocolate, coffee, or liqueurs. In this recipe, toasted almonds and vanilla add depth, but feel free to experiment with your favorite flavors.",
    },
    {
      question: "How should semifreddo be stored and how long does it keep?",
      answer:
        "Store semifreddo covered in an airtight container in the freezer. It is best consumed within 3-4 days for optimal texture and flavor. Avoid refreezing once thawed to maintain quality.",
    },
    {
      question: "Can I prepare semifreddo in advance for events?",
      answer:
        "Yes, semifreddo is an excellent make-ahead dessert. Prepare it a day or two in advance and keep it frozen until serving. Just remember to remove it from the freezer about 10-15 minutes before serving to soften slightly for easier slicing and better texture.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Semifreddo"
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
            Semifreddo is a classic Italian dessert that beautifully balances the richness of a mousse with the refreshing chill of ice cream. Its name literally means "half cold," reflecting its unique semi-frozen texture that is creamy, airy, and melts delightfully on the palate. This dessert is perfect for warm weather or as a sophisticated finish to any meal.
          </p>
          <p>
            Originating from Italy, semifreddo has roots in traditional frozen desserts but distinguishes itself by not requiring an ice cream maker. The technique involves folding whipped cream into a custard base made with egg yolks and sugar, then freezing the mixture until it reaches a soft, mousse-like consistency. Over time, chefs have adapted semifreddo with various flavors, including nuts, fruits, chocolate, and coffee, making it a versatile and beloved treat worldwide.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Custard Base</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a heatproof bowl, whisk the egg yolks with half of the granulated sugar until pale and creamy. Place the bowl over a pot of simmering water (double boiler) and whisk continuously until the mixture thickens and reaches about 70°C (160°F). Remove from heat and let it cool slightly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Whip the Cream</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a chilled bowl, whip the heavy cream with the vanilla bean seeds and a pinch of salt until soft peaks form. Be careful not to overwhip.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Gently fold the cooled custard into the whipped cream until fully combined. Stir in the honey, lemon zest, and optional espresso for added depth. Finally, fold in the toasted chopped almonds.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Freeze the Semifreddo</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the mixture into a loaf pan or mold lined with parchment paper. Cover tightly with plastic wrap and freeze for at least 6 hours or overnight until firm but still soft enough to slice.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve and Garnish</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove semifreddo from the freezer about 10 minutes before serving. Slice and garnish with grated dark chocolate and a dusting of powdered sugar. Enjoy this elegant dessert with coffee or a dessert wine.
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
            Use fresh, high-quality eggs and cream for the best flavor and texture.
          </li>
          <li>
            Toast the almonds lightly to enhance their nutty flavor and add crunch.
          </li>
          <li>
            When folding the custard and whipped cream, do so gently to preserve the airy texture.
          </li>
          <li>
            For a flavor twist, try adding citrus zest, liqueurs like Amaretto, or fresh fruit purees.
          </li>
          <li>
            If you don’t have a double boiler, use a heatproof bowl over a pot of simmering water, ensuring the bowl doesn’t touch the water.
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