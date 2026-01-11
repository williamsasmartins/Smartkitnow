import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CevicheMexicanStyleCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Ceviche%20MexicanStyle%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=747"
  );

  // --- DATA ---
  const title = "Ceviche (Mexican-Style)";
  const description = "Ceviche cítrico com peixe/seafood, tomate, cebola e coentro.";

  // INGREDIENTS
  const ingredients = [
    { name: "Fresh firm white fish (e.g., sea bass, snapper)", baseAmount: 500, unit: "g" },
    { name: "Fresh lime juice", baseAmount: 250, unit: "ml" },
    { name: "Tomato, finely chopped", baseAmount: 150, unit: "g" },
    { name: "Red onion, thinly sliced", baseAmount: 100, unit: "g" },
    { name: "Fresh cilantro (coriander), chopped", baseAmount: 15, unit: "g" },
    { name: "Fresh serrano or jalapeño chili, finely chopped", baseAmount: 1, unit: "piece" },
    { name: "Cucumber, peeled and diced", baseAmount: 100, unit: "g" },
    { name: "Avocado, diced", baseAmount: 1, unit: "piece" },
    { name: "Sea salt", baseAmount: 5, unit: "g" },
    { name: "Black pepper, freshly ground", baseAmount: 1, unit: "g" },
    { name: "Olive oil (optional)", baseAmount: 15, unit: "ml" },
    { name: "Tortilla chips or tostadas (for serving)", baseAmount: 8, unit: "pieces" },
  ];

  // Approximate nutrition per 4 servings
  const nutrition = { calories: "280", protein: "35g", carbs: "12g", fat: "8g" };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of fish is best for Mexican-style ceviche?",
      answer:
        "For authentic Mexican-style ceviche, use fresh, firm white fish such as sea bass, snapper, or tilapia. The fish should be very fresh and preferably sashimi-grade to ensure safety since it is 'cooked' only by citrus juice.",
    },
    {
      question: "How long should I marinate the fish in lime juice?",
      answer:
        "Marinate the fish in fresh lime juice for about 15 to 30 minutes until the flesh turns opaque and firms up. Over-marinating can make the fish tough and overly sour, so timing is key for perfect texture and flavor.",
    },
    {
      question: "Can I substitute lime juice with lemon juice?",
      answer:
        "While lemon juice can be used in a pinch, lime juice is traditional and preferred for Mexican ceviche due to its distinct tartness and flavor profile. Using lime juice helps achieve the authentic citrusy brightness characteristic of this dish.",
    },
    {
      question: "Is it safe to eat ceviche with raw fish?",
      answer:
        "Ceviche is safe to eat when prepared with very fresh, high-quality fish and proper hygiene. The acid in the lime juice denatures the proteins in the fish, effectively 'cooking' it. However, it does not kill all bacteria or parasites, so sourcing fresh fish from a trusted supplier is essential.",
    },
    {
      question: "What are some traditional accompaniments for Mexican ceviche?",
      answer:
        "Mexican ceviche is often served with crunchy tortilla chips or tostadas, avocado slices, and sometimes fresh cucumber or radish. These accompaniments add texture and balance the bright, tangy flavors of the ceviche.",
    },
    {
      question: "Can I prepare ceviche in advance?",
      answer:
        "Ceviche is best enjoyed fresh within a few hours of preparation. If you need to prepare it in advance, marinate the fish separately and combine with other ingredients just before serving to maintain optimal texture and flavor.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Ceviche (Mexican-Style)"
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
            Mexican-style ceviche is a vibrant, refreshing seafood dish that
            celebrates the bright flavors of fresh fish marinated in citrus
            juices, combined with crisp vegetables and aromatic herbs. This
            dish is perfect for warm weather and offers a healthy, light meal
            packed with protein and zesty flavors.
          </p>
          <p>
            Originating from the coastal regions of Mexico, ceviche has roots
            that trace back to indigenous cooking methods combined with
            influences from Spanish and other Latin American cuisines. The
            technique of 'cooking' fish in lime juice is both practical and
            delicious, preserving the freshness of the seafood while infusing
            it with tangy citrus notes. Today, ceviche remains a beloved dish
            across Mexico and beyond, often enjoyed as an appetizer or light
            main course.
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
              Prepare the Fish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the fish fillets under cold water and pat dry with paper
              towels. Cut the fish into small, uniform 1 cm cubes to ensure
              even marination.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Marinate the Fish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the fish cubes in a glass or ceramic bowl and cover with
              fresh lime juice. Stir gently to coat all pieces. Cover and
              refrigerate for 15-30 minutes until the fish turns opaque and
              firms up.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              While the fish marinates, finely chop the tomato, thinly slice
              the red onion, dice the cucumber and avocado, and finely chop the
              cilantro and chili pepper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Combine Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Drain about half of the lime juice from the fish (to avoid
              overpowering sourness). Add the chopped vegetables, cilantro,
              salt, pepper, and olive oil (if using). Gently fold to combine.
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
              Serve immediately chilled with tortilla chips or tostadas on the
              side. Garnish with extra cilantro or avocado slices if desired.
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
            Use sashimi-grade fish from a trusted fishmonger to ensure safety
            and freshness.
          </li>
          <li>
            Adjust the amount of chili pepper to your preferred spice level; you
            can remove seeds for milder heat.
          </li>
          <li>
            For a more complex flavor, add a splash of fresh orange juice to the
            lime marinade.
          </li>
          <li>
            Avoid marinating the fish for too long to prevent it from becoming
            tough and overly sour.
          </li>
          <li>
            Serve ceviche chilled and consume within a few hours for best
            quality.
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
              href="https://en.wikipedia.org/wiki/Ceviche"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Ceviche
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/mexican-ceviche-recipe-2342817"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Mexican Ceviche Recipe
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