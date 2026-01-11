import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FlanCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Flan%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6162"
  );

  // --- DATA ---
  const title = "Flan";
  const description = "Pudim assado com calda de caramelo, liso e delicado.";

  // INGREDIENTS
  const ingredients = [
    { name: "Whole Milk", baseAmount: 500, unit: "ml" },
    { name: "Granulated Sugar (for caramel)", baseAmount: 150, unit: "g" },
    { name: "Eggs", baseAmount: 4, unit: "large" },
    { name: "Sweetened Condensed Milk", baseAmount: 395, unit: "g" },
    { name: "Vanilla Extract", baseAmount: 1, unit: "tsp" },
    { name: "Water (for caramel)", baseAmount: 60, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "pinch" },
    { name: "Lemon zest (optional)", baseAmount: 1, unit: "tsp" },
    { name: "Heavy Cream (optional)", baseAmount: 100, unit: "ml" },
    { name: "Butter (for greasing)", baseAmount: 1, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "9g",
    carbs: "45g",
    fat: "10g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is flan and where does it originate from?",
      answer:
        "Flan is a smooth, creamy custard dessert topped with a layer of soft caramel. It has roots in ancient Rome but became popular in Spain and Latin America, where it evolved into the beloved dessert known today. Its delicate texture and sweet caramel topping make it a classic favorite worldwide.",
    },
    {
      question: "How do I prevent the caramel from hardening too much?",
      answer:
        "To achieve a soft caramel layer, cook the sugar and water gently until it turns a deep amber color, then pour it immediately into the mold to coat the base evenly. Avoid overcooking the caramel as it can become bitter and hard. Also, allow the flan to cool completely and refrigerate it to keep the caramel soft and luscious.",
    },
    {
      question: "Can I make flan without a water bath?",
      answer:
        "While it's possible, using a water bath (bain-marie) is highly recommended as it provides gentle, even heat that prevents the custard from curdling or cracking. If you skip the water bath, bake at a lower temperature and keep a close eye to avoid overcooking.",
    },
    {
      question: "How long can I store flan in the refrigerator?",
      answer:
        "Flan can be stored covered in the refrigerator for up to 3-4 days. Keep it well-covered to prevent it from absorbing other odors. For best texture and flavor, consume within this timeframe.",
    },
    {
      question: "Can I customize the flavor of my flan?",
      answer:
        "Absolutely! You can add citrus zest like lemon or orange for a fresh twist, infuse the milk with cinnamon sticks or coffee, or even add coconut milk for a tropical variation. Just be mindful to maintain the custard’s balance for the best texture.",
    },
    {
      question: "What is the best way to unmold flan without breaking it?",
      answer:
        "Run a thin knife or spatula gently around the edges of the flan to loosen it from the mold. Then, invert the mold onto a serving plate and tap lightly if needed. The caramel sauce will help release the custard smoothly. Chilling the flan thoroughly before unmolding also helps maintain its shape.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Flan"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 50m
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
                    {ing.unit === "large"
                      ? Math.round(servings * (ing.baseAmount / 4))
                      : getAmount(ing.baseAmount)}{" "}
                    {ing.unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-slate-50 dark:bg-slate-900/50">
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-base">
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
            Flan is a classic custard dessert characterized by its smooth,
            creamy texture and a luscious caramel topping. This recipe combines
            simple ingredients like milk, eggs, and sugar to create a delicate
            and elegant dessert that is both comforting and impressive. Perfect
            for any occasion, flan offers a balance of sweetness and richness
            that delights the palate.
          </p>
          <p>
            The origins of flan trace back to ancient Rome, where the Romans
            first developed custard-like dishes. Over centuries, flan evolved
            through Spanish and Latin American culinary traditions, becoming a
            beloved dessert across the globe. Its versatility allows for many
            variations, but the classic caramel-topped custard remains a
            timeless favorite.
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
              Prepare the Caramel
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a medium saucepan, combine granulated sugar and water over
              medium heat. Stir gently until sugar dissolves, then stop stirring
              and let it simmer until it turns a deep amber color. Quickly pour
              the caramel into the base of your flan mold or ramekins, swirling
              to coat evenly. Set aside to harden.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Make the Custard Mixture
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, whisk the eggs until smooth. Add whole milk,
              sweetened condensed milk, vanilla extract, salt, and optional
              lemon zest and heavy cream. Mix gently until fully combined,
              taking care not to create too many bubbles.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble and Bake
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the custard mixture gently over the set caramel in the mold.
              Place the mold in a larger baking dish and fill the dish with hot
              water halfway up the sides of the mold to create a water bath.
              Bake in a preheated oven at 160°C (320°F) for about 45-50 minutes,
              or until the custard is set but still slightly jiggly in the
              center.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cool and Chill
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the flan from the water bath and let it cool to room
              temperature. Then refrigerate for at least 4 hours or overnight
              to allow the custard to fully set and the flavors to meld.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Unmold and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              To serve, run a thin knife around the edges of the flan to loosen
              it. Invert onto a serving plate so the caramel sauce flows over
              the custard. Serve chilled and enjoy this silky, sweet dessert.
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
            Use fresh, high-quality eggs and whole milk for the creamiest
            texture.
          </li>
          <li>
            Avoid whisking the custard mixture too vigorously to prevent air
            bubbles, which can cause holes in the flan.
          </li>
          <li>
            Make sure the water bath water is hot but not boiling to ensure
            gentle cooking.
          </li>
          <li>
            Let the flan chill thoroughly before unmolding to maintain its
            shape and texture.
          </li>
          <li>
            Experiment with infusions like cinnamon sticks or citrus zest in
            the milk for unique flavor variations.
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
              href="https://en.wikipedia.org/wiki/Flan_(custard)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Flan (Custard)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/flan-dessert"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Flan Dessert
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