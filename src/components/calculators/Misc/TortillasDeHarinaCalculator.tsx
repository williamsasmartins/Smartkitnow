import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TortillasDeHarinaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Flour%20Tortillas%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8973"
  );

  // --- DATA ---
  const title = "Flour Tortillas";
  const description = "Tortilhas de trigo macias, comuns no norte do México.";

  // INGREDIENTS
  const ingredients = [
    { name: "All-purpose flour", baseAmount: 500, unit: "g" },
    { name: "Baking powder", baseAmount: 8, unit: "g" },
    { name: "Salt", baseAmount: 10, unit: "g" },
    { name: "Lard or vegetable shortening", baseAmount: 60, unit: "g" },
    { name: "Warm water", baseAmount: 250, unit: "ml" },
    { name: "Vegetable oil (for cooking)", baseAmount: 15, unit: "ml" },
    { name: "Optional: sugar", baseAmount: 5, unit: "g" },
    { name: "Optional: baking soda", baseAmount: 2, unit: "g" },
    { name: "Optional: milk (replace some water)", baseAmount: 50, unit: "ml" },
    { name: "Optional: corn starch (for dusting)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per serving (approximate for 4 servings)
  const nutrition = {
    calories: "290",
    protein: "7g",
    carbs: "45g",
    fat: "7g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes flour tortillas different from corn tortillas?",
      answer:
        "Flour tortillas are made primarily from wheat flour, which gives them a softer, more pliable texture compared to corn tortillas that are made from masa harina (corn flour). Flour tortillas are common in northern Mexico and the southwestern United States, while corn tortillas are more traditional in central and southern Mexico.",
    },
    {
      question: "Can I substitute lard with vegetable shortening or oil?",
      answer:
        "Yes, lard is traditional and imparts a distinct flavor and tenderness, but vegetable shortening or neutral oils like canola or vegetable oil can be used as substitutes. The texture might be slightly different, but the tortillas will still be soft and delicious.",
    },
    {
      question: "How do I store flour tortillas to keep them fresh?",
      answer:
        "Store cooked tortillas in an airtight container or wrapped tightly in plastic wrap at room temperature for up to 2 days. For longer storage, refrigerate them for up to a week or freeze for up to 3 months. Reheat gently on a hot skillet or wrapped in a damp towel in the microwave to restore softness.",
    },
    {
      question: "Why do my tortillas sometimes turn out tough or dry?",
      answer:
        "Tough or dry tortillas usually result from overworking the dough, insufficient fat, or cooking them too long or at too high heat. Be gentle when kneading, ensure enough fat is incorporated, and cook each tortilla briefly on a hot skillet until lightly browned and puffed.",
    },
    {
      question: "Can I make the dough ahead of time?",
      answer:
        "Absolutely! The dough can be made ahead and refrigerated for up to 24 hours, which can improve flavor and texture. Just bring it to room temperature before rolling out and cooking.",
    },
    {
      question: "What is the best way to roll out tortillas evenly?",
      answer:
        "Use a lightly floured surface and a rolling pin, rolling from the center outward while rotating the dough ball frequently to maintain a round shape and even thickness. Avoid pressing too hard to keep the tortillas tender.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Flour Tortillas"
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
            Flour tortillas are a staple of northern Mexican cuisine, prized for their soft, pliable texture and mild flavor. Unlike corn tortillas, which are made from masa harina, flour tortillas use wheat flour as the base, resulting in a versatile wrap perfect for burritos, quesadillas, and tacos. This recipe yields tender, warm tortillas that can be made quickly with simple pantry ingredients.
          </p>
          <p>
            The origin of flour tortillas dates back to the northern regions of Mexico, where wheat was more readily available than corn. Over time, these tortillas became a beloved part of Mexican-American cuisine, especially in Texas and the southwestern United States. Their adaptability and ease of preparation have made them a global favorite.
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
              In a large mixing bowl, combine the all-purpose flour, baking powder, salt, and optional sugar and baking soda. Mix well to distribute the dry ingredients evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Fat and Water</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut in the lard or vegetable shortening into the flour mixture using your fingers or a pastry cutter until it resembles coarse crumbs. Gradually add warm water (and milk if using), mixing until a soft dough forms.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Knead the Dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Turn the dough onto a lightly floured surface and knead for about 5-7 minutes until smooth and elastic. Cover with a damp cloth and let rest for at least 20 minutes to relax the gluten.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Divide and Roll Out</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Divide the dough into equal portions (about 8-12 pieces depending on size). Roll each piece into a ball, then flatten and roll out on a lightly floured surface into thin, round tortillas about 6-8 inches in diameter.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Tortillas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat a dry skillet or griddle over medium-high heat. Cook each tortilla for about 30-45 seconds on each side until brown spots appear and the tortilla puffs slightly. Brush lightly with vegetable oil if desired for extra softness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Keep Warm and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stack cooked tortillas and keep them wrapped in a clean kitchen towel to stay warm and soft. Serve immediately or store as needed.
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
            Use warm water to help the fat incorporate better and create a softer dough.
          </li>
          <li>
            Letting the dough rest is crucial to relax the gluten, making rolling easier and tortillas tender.
          </li>
          <li>
            If you want fluffier tortillas, add a pinch of baking powder to the dry ingredients.
          </li>
          <li>
            Cook tortillas on a hot, dry skillet without oil for the best texture; oil can be brushed on after cooking if desired.
          </li>
          <li>
            Store cooked tortillas wrapped in a towel inside a sealed container to keep them soft and warm.
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
              href="https://en.wikipedia.org/wiki/Flour_tortilla"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Flour Tortilla
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/how-to-make-flour-tortillas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: How to Make Flour Tortillas
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