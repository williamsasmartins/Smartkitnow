import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function StuffedFlatbreadPiadinaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Stuffed%20Flatbread%20Piadina%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7817"
  );

  // --- DATA ---
  const title = "Stuffed Flatbread (Piadina)";
  const description = "Soft flatbread from Romagna, filled with prosciutto, cheese, or greens.";

  // INGREDIENTS
  const ingredients = [
    { name: "All-purpose flour", baseAmount: 500, unit: "g" },
    { name: "Warm water", baseAmount: 180, unit: "ml" },
    { name: "Lard or olive oil", baseAmount: 60, unit: "g" },
    { name: "Salt", baseAmount: 10, unit: "g" },
    { name: "Baking powder", baseAmount: 5, unit: "g" },
    { name: "Prosciutto di Parma", baseAmount: 150, unit: "g" },
    { name: "Stracchino cheese", baseAmount: 150, unit: "g" },
    { name: "Arugula (rocket)", baseAmount: 50, unit: "g" },
    { name: "Fresh mozzarella", baseAmount: 100, unit: "g" },
    { name: "Cherry tomatoes", baseAmount: 100, unit: "g" },
    { name: "Extra virgin olive oil", baseAmount: 15, unit: "ml" },
    { name: "Black pepper", baseAmount: 2, unit: "g" },
    { name: "Fresh rosemary (optional)", baseAmount: 5, unit: "g" },
    { name: "Garlic clove (optional)", baseAmount: 1, unit: "clove" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "18g",
    carbs: "45g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Piadina and where does it originate from?",
      answer:
        "Piadina is a traditional Italian flatbread originating from the Romagna region in Northern Italy. It is typically made from simple ingredients like flour, water, lard or olive oil, and salt. Piadina is known for its soft, pliable texture and is often stuffed with various fillings such as cured meats, cheeses, and fresh greens.",
    },
    {
      question: "Can I substitute lard with olive oil in the dough?",
      answer:
        "Yes, olive oil is a common substitute for lard in piadina dough, especially for those who prefer a vegetarian or lighter option. Olive oil will give the dough a slightly different texture and flavor but still results in a delicious flatbread. Use the same quantity as the lard called for in the recipe.",
    },
    {
      question: "How do I store leftover piadina?",
      answer:
        "Leftover piadina can be stored wrapped tightly in plastic wrap or in an airtight container at room temperature for up to 2 days. For longer storage, refrigerate for up to 4 days or freeze for up to 1 month. Reheat gently on a skillet or in the oven to restore softness before serving.",
    },
    {
      question: "What are some popular fillings for stuffed piadina?",
      answer:
        "Traditional fillings include prosciutto, stracchino cheese, fresh mozzarella, arugula, and cherry tomatoes. Other popular options are grilled vegetables, sautéed mushrooms, or even sweet fillings like Nutella and fresh fruit. The piadina is versatile and can be customized to your taste.",
    },
    {
      question: "Can I make piadina dough ahead of time?",
      answer:
        "Absolutely! Piadina dough can be prepared a day in advance and stored wrapped in plastic wrap in the refrigerator. Let it come to room temperature before rolling out and cooking. This resting period can even improve the dough’s texture and flavor.",
    },
    {
      question: "What is the best way to cook piadina for an authentic texture?",
      answer:
        "Traditionally, piadina is cooked on a flat terracotta or cast-iron griddle called a 'testo'. At home, a heavy non-stick skillet or cast-iron pan over medium-high heat works well. Cook each side for 1-2 minutes until golden spots appear and the bread is soft and pliable.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Stuffed Flatbread (Piadina)"
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
            Piadina is a beloved Italian flatbread hailing from the Romagna region,
            cherished for its soft, tender texture and versatility. Traditionally
            made with simple pantry staples like flour, water, lard or olive oil,
            and salt, this flatbread is cooked on a griddle until golden and pliable.
            It is then generously stuffed with savory fillings such as prosciutto,
            creamy cheeses, and fresh greens, making it a perfect handheld meal or
            snack.
          </p>
          <p>
            The origins of piadina date back to ancient times, with roots in Roman
            and Etruscan culinary traditions. Over centuries, it evolved into a
            regional specialty, often enjoyed by farmers and travelers for its
            portability and satisfying flavor. Today, piadina remains a staple in
            Italian cuisine, celebrated both in rustic trattorias and modern
            restaurants worldwide.
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
              Prepare the Dough
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large mixing bowl, combine the all-purpose flour, salt, and baking
              powder. Add the lard or olive oil and warm water gradually, mixing until
              a soft dough forms. Knead on a floured surface for about 8-10 minutes
              until smooth and elastic. Cover with a damp cloth and let rest for 30
              minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Divide and Roll Out
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Divide the dough into equal portions (about 8 pieces for 4 servings).
              Roll each piece into a thin, round flatbread approximately 20 cm (8
              inches) in diameter on a lightly floured surface.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Flatbreads
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat a dry non-stick skillet or cast-iron pan over medium-high heat.
              Cook each flatbread for 1-2 minutes on each side until golden spots
              appear and the bread is soft and pliable. Keep warm wrapped in a clean
              kitchen towel.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble the Piadina
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spread stracchino cheese or fresh mozzarella on one half of each flatbread.
              Add slices of prosciutto, arugula, and cherry tomatoes. Drizzle with a
              little extra virgin olive oil and season with black pepper. Fold the
              flatbread over the filling.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Enjoy
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the stuffed piadina warm as a delicious lunch or snack. Optionally,
              add fresh rosemary or rub with a garlic clove for extra aroma before
              filling.
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
            For a lighter dough, substitute half the all-purpose flour with whole
            wheat flour to add a nutty flavor and extra fiber.
          </li>
          <li>
            Resting the dough is essential to relax the gluten, making rolling out
            easier and resulting in a tender flatbread.
          </li>
          <li>
            Use a cast-iron skillet for even heat distribution and authentic charred
            spots on your piadina.
          </li>
          <li>
            If you prefer a vegan version, replace lard with olive oil and use vegan
            cheese or grilled vegetables as filling.
          </li>
          <li>
            To enhance aroma, rub the cooked flatbread with a cut garlic clove before
            adding fillings.
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
