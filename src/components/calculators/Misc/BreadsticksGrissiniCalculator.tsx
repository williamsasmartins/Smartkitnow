import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BreadsticksGrissiniCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Breadsticks%20Grissini%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5938"
  );

  // --- DATA ---
  const title = "Breadsticks (Grissini)";
  const description = "Thin, crunchy breadsticks often seasoned with herbs or sesame.";

  // INGREDIENTS
  const ingredients = [
    { name: "All-purpose flour", baseAmount: 500, unit: "g" },
    { name: "Warm water", baseAmount: 250, unit: "ml" },
    { name: "Active dry yeast", baseAmount: 7, unit: "g" },
    { name: "Olive oil", baseAmount: 50, unit: "ml" },
    { name: "Salt", baseAmount: 10, unit: "g" },
    { name: "Sugar", baseAmount: 5, unit: "g" },
    { name: "Sesame seeds", baseAmount: 20, unit: "g" },
    { name: "Dried rosemary (optional)", baseAmount: 5, unit: "g" },
    { name: "Garlic powder (optional)", baseAmount: 3, unit: "g" },
    { name: "Coarse sea salt (for topping)", baseAmount: 5, unit: "g" },
    { name: "Cornmeal (for dusting)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per serving (approximate for 4 servings)
  const nutrition = {
    calories: "280",
    protein: "7g",
    carbs: "50g",
    fat: "5g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What makes grissini different from regular breadsticks?",
      answer:
        "Grissini are traditional Italian breadsticks that are thinner, crispier, and often flavored with herbs or seeds. Unlike many commercial breadsticks, grissini are hand-rolled and baked to a delicate crunch, making them perfect for dipping or snacking.",
    },
    {
      question: "Can I use whole wheat flour instead of all-purpose flour?",
      answer:
        "Yes, you can substitute whole wheat flour for all-purpose flour, but it will result in a denser and slightly nuttier breadstick. For best texture, consider using a blend of whole wheat and all-purpose flour.",
    },
    {
      question: "How should I store leftover grissini to keep them crispy?",
      answer:
        "Store leftover grissini in an airtight container at room temperature. Avoid refrigeration as it can introduce moisture and soften the breadsticks. They typically stay crispy for up to a week.",
    },
    {
      question: "Can I add other seasonings or toppings?",
      answer:
        "Absolutely! Grissini are versatile and can be flavored with various herbs like thyme, oregano, or basil. You can also sprinkle them with parmesan cheese, poppy seeds, or chili flakes before baking for extra flavor.",
    },
    {
      question: "Is it necessary to let the dough rise twice?",
      answer:
        "Yes, the first rise allows the yeast to ferment and develop flavor, while the second rise after shaping ensures the breadsticks are light and airy inside. Skipping the second rise may result in denser breadsticks.",
    },
    {
      question: "Can I freeze the dough or baked grissini?",
      answer:
        "You can freeze the dough after the first rise by wrapping it tightly in plastic wrap and placing it in a freezer bag. Thaw overnight in the fridge before shaping and baking. Baked grissini can also be frozen in an airtight container and reheated briefly to restore crispness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Breadsticks (Grissini)"
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
            Grissini, or Italian breadsticks, are slender, crunchy sticks of bread
            that originated in the Piedmont region of Italy. Known for their delicate
            crispness and subtle flavor, they are often enjoyed as an appetizer or
            snack, paired with dips, cheeses, or cured meats. Their simple yet
            elegant nature makes them a staple in Italian cuisine and a favorite
            accompaniment to meals worldwide.
          </p>
          <p>
            Historically, grissini date back to the 17th century, believed to have
            been created by a baker in Turin to help a duke with digestive issues by
            providing a light, easily digestible bread. Over time, these breadsticks
            gained popularity beyond Italy, becoming a beloved snack and party
            accompaniment globally. Today, they are often seasoned with herbs,
            seeds, or spices, adding layers of flavor to this classic treat.
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
              Activate the Yeast
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small bowl, combine warm water (about 38°C/100°F) with sugar and
              active dry yeast. Stir gently and let it sit for 5-10 minutes until it
              becomes frothy, indicating the yeast is active.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Dough
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large mixing bowl, combine the flour and salt. Create a well in
              the center and pour in the activated yeast mixture and olive oil.
              Mix until a rough dough forms.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Knead the Dough
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the dough to a lightly floured surface and knead for about 8-10
              minutes until smooth and elastic. Alternatively, use a stand mixer with
              a dough hook for 6-8 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              First Rise
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the dough in a lightly oiled bowl, cover with a damp cloth or
              plastic wrap, and let it rise in a warm place for about 1 hour or until
              doubled in size.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shape the Breadsticks
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Punch down the dough and divide it into small portions (about 15-20g
              each). Roll each portion into thin sticks about 20 cm (8 inches) long.
              Optionally, sprinkle with sesame seeds, dried rosemary, or garlic
              powder.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Second Rise
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the shaped sticks on a baking sheet dusted with cornmeal or
              parchment paper. Cover loosely and let them rise for another 30 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              7
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat the oven to 200°C (390°F). Lightly brush the breadsticks with
              olive oil and sprinkle with coarse sea salt or additional toppings.
              Bake for 10-12 minutes or until golden and crisp.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              8
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cool and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the grissini from the oven and let them cool completely on a
              wire rack. Serve as an appetizer, snack, or accompaniment to soups and
              salads.
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
            For extra crunch, bake the grissini a few minutes longer but watch
            carefully to avoid burning.
          </li>
          <li>
            Experiment with different toppings like poppy seeds, fennel seeds, or
            grated Parmesan for unique flavor twists.
          </li>
          <li>
            If the dough feels sticky, lightly flour your hands but avoid adding too
            much flour to keep the breadsticks tender.
          </li>
          <li>
            Use a pizza stone or baking steel preheated in the oven for more even
            heat and crispier results.
          </li>
          <li>
            Store baked grissini in airtight containers with a silica gel packet to
            maintain crispness longer.
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