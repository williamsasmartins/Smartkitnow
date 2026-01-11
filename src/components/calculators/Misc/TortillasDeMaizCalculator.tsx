import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TortillasDeMaizCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Corn%20Tortillas%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5980"
  );

  // --- DATA ---
  const title = "Corn Tortillas";
  const description = "Tortilhas de milho para tacos e tostadas, base da cozinha mexicana.";

  // INGREDIENTS
  const ingredients = [
    { name: "Masa Harina (corn flour)", baseAmount: 250, unit: "g" },
    { name: "Warm Water", baseAmount: 180, unit: "ml" },
    { name: "Salt", baseAmount: 5, unit: "g" },
    { name: "Vegetable Oil or Lard (optional)", baseAmount: 10, unit: "g" },
    { name: "Corn Starch (for dusting)", baseAmount: 10, unit: "g" },
    { name: "Butter (for serving, optional)", baseAmount: 20, unit: "g" },
    { name: "Fresh Cilantro (optional garnish)", baseAmount: 5, unit: "g" },
    { name: "Lime Wedges (optional, for serving)", baseAmount: 2, unit: "pieces" },
    { name: "Chopped Onion (optional garnish)", baseAmount: 15, unit: "g" },
    { name: "Chopped Jalapeño (optional garnish)", baseAmount: 5, unit: "g" },
    { name: "Cheese (optional, for serving)", baseAmount: 30, unit: "g" },
    { name: "Sour Cream (optional, for serving)", baseAmount: 20, unit: "g" },
    { name: "Salsa (optional, for serving)", baseAmount: 30, unit: "g" },
  ];

  // Nutrition per 4 servings approx.
  const nutrition = {
    calories: "320",
    protein: "6g",
    carbs: "60g",
    fat: "5g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the difference between masa harina and regular cornmeal?",
      answer:
        "Masa harina is a specially treated corn flour made from dried corn kernels that have been cooked and soaked in limewater (calcium hydroxide solution), a process called nixtamalization. This treatment enhances the flavor, texture, and nutritional value, making it ideal for making authentic corn tortillas. Regular cornmeal is simply ground dried corn without this treatment and will not yield the same pliable dough or authentic taste.",
    },
    {
      question: "Can I make corn tortillas without a tortilla press?",
      answer:
        "Yes, you can make corn tortillas without a press by using a heavy flat object like a cast iron skillet or a flat-bottomed pan. Place the dough ball between two sheets of parchment paper or plastic wrap and press down firmly to flatten it evenly. While a tortilla press ensures uniform thickness and shape, hand-pressing works well with practice.",
    },
    {
      question: "How do I store corn tortillas to keep them fresh?",
      answer:
        "Freshly made corn tortillas are best enjoyed immediately. To store, let them cool completely, then wrap them tightly in a clean kitchen towel or place them in an airtight container. Refrigerate for up to 3 days or freeze for up to 2 months. Reheat on a hot skillet or wrapped in a damp cloth in the microwave to restore softness.",
    },
    {
      question: "Why do my corn tortillas crack or break when cooking?",
      answer:
        "Cracking tortillas usually indicates the dough is too dry or not kneaded enough. Ensure you add enough warm water to form a soft, pliable dough and knead it well until smooth. Also, avoid rolling or pressing the dough too thin. Proper resting of the dough for 15-20 minutes helps hydrate the masa harina, improving flexibility.",
    },
    {
      question: "Can I substitute masa harina with other flours?",
      answer:
        "Masa harina is unique due to the nixtamalization process, which affects flavor and texture. Substituting with regular cornmeal, corn flour, or wheat flour will not produce authentic corn tortillas and may result in a different texture and taste. For best results, use masa harina specifically.",
    },
    {
      question: "What dishes can I make with corn tortillas besides tacos?",
      answer:
        "Corn tortillas are versatile and can be used for tostadas, enchiladas, chilaquiles, quesadillas, and tortilla chips. They can also be layered in casseroles or served alongside soups and stews. Their slightly chewy texture and corn flavor complement many Mexican and Latin American dishes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Corn Tortillas"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Corn tortillas are a fundamental staple of Mexican cuisine, cherished for their
            simplicity and versatility. Made from masa harina, a specially treated corn flour,
            these tortillas are naturally gluten-free and boast a distinctive corn flavor that
            complements a wide variety of dishes. Whether used for tacos, tostadas, or enchiladas,
            corn tortillas bring authentic taste and texture to the table.
          </p>
          <p>
            The tradition of making corn tortillas dates back thousands of years to the indigenous
            peoples of Mesoamerica. The nixtamalization process, which involves soaking dried corn
            kernels in an alkaline solution, was a revolutionary technique that enhanced the
            nutritional value and flavor of corn, enabling civilizations to thrive. Today, corn
            tortillas remain a cultural icon and culinary cornerstone, celebrated worldwide for
            their rich heritage and delicious simplicity.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large mixing bowl, combine masa harina and salt. Gradually add warm water while
              mixing with your hands until a soft, pliable dough forms. If the dough feels dry,
              add a little more water, one tablespoon at a time. Knead for about 3-5 minutes until
              smooth. Cover with a damp cloth and let rest for 15-20 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Divide and Shape</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Divide the dough into equal-sized balls (about 40-45g each for standard tortillas).
              Keep them covered to prevent drying out. Lightly dust a clean surface or plastic wrap
              with corn starch or masa harina to prevent sticking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Press the Tortillas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Using a tortilla press lined with parchment paper or plastic wrap, press each ball
              into a thin, round tortilla about 15 cm (6 inches) in diameter. If you don't have a
              press, flatten with a heavy skillet or rolling pin between sheets of parchment.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Tortillas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat a dry cast iron skillet or griddle over medium-high heat. Carefully peel the
              tortilla off the parchment and place it on the hot skillet. Cook for about 50-60
              seconds until the edges start to dry and brown spots appear. Flip and cook the other
              side for another 50-60 seconds. Flip once more briefly to puff up the tortilla.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Keep Warm and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stack cooked tortillas and wrap them in a clean kitchen towel to keep warm and soft.
              Serve immediately with your favorite fillings or toppings such as grilled meats,
              beans, cheese, or salsa.
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
            Use warm water to hydrate the masa harina; cold water can make the dough crumbly and
            harder to work with.
          </li>
          <li>
            Resting the dough covered allows the masa to fully absorb the water, resulting in more
            pliable tortillas.
          </li>
          <li>
            If tortillas crack while cooking, try adding a teaspoon of vegetable oil or lard to the
            dough for extra moisture and flexibility.
          </li>
          <li>
            Keep cooked tortillas wrapped in a towel or tortilla warmer to maintain softness and
            prevent drying out.
          </li>
          <li>
            For a smoky flavor, cook tortillas over an open flame or grill briefly after cooking on
            the skillet.
          </li>
          <li>
            Experiment with thickness: thinner tortillas are great for tacos, while slightly thicker
            ones hold up better for tostadas or enchiladas.
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
              href="https://en.wikipedia.org/wiki/Tortilla"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Tortilla (Food)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/how-to-make-corn-tortillas-2342793"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: How to Make Corn Tortillas
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/nixtamalization-corn-masa-harina"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: The Science of Nixtamalization
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