import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FocacciaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Focaccia%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5627"
  );

  // --- DATA ---
  const title = "Focaccia";
  const description = "Dimpled olive oil bread topped with rosemary and sea salt.";

  // INGREDIENTS
  const ingredients = [
    { name: "Bread Flour", baseAmount: 500, unit: "g" },
    { name: "Warm Water", baseAmount: 350, unit: "ml" },
    { name: "Active Dry Yeast", baseAmount: 7, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 60, unit: "ml" },
    { name: "Fine Sea Salt", baseAmount: 10, unit: "g" },
    { name: "Fresh Rosemary", baseAmount: 15, unit: "g" },
    { name: "Sugar", baseAmount: 5, unit: "g" },
    { name: "Coarse Sea Salt (for topping)", baseAmount: 5, unit: "g" },
    { name: "Garlic Cloves (optional)", baseAmount: 2, unit: "cloves" },
    { name: "Black Pepper (freshly ground)", baseAmount: 1, unit: "tsp" },
    { name: "Cornmeal (for dusting)", baseAmount: 10, unit: "g" },
  ];

  // Nutrition per 4 servings approx.
  const nutrition = {
    calories: "320",
    protein: "9g",
    carbs: "55g",
    fat: "7g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of flour is best for focaccia?",
      answer:
        "Bread flour is ideal for focaccia because it has a higher protein content than all-purpose flour, which helps develop gluten and gives the bread its characteristic chewy texture. However, you can also use all-purpose flour for a lighter crumb.",
    },
    {
      question: "How do I achieve the classic dimples on focaccia?",
      answer:
        "After the dough has risen and is spread out on the baking tray, use your fingertips to gently press into the dough, creating dimples. These indentations help trap olive oil and toppings, giving focaccia its signature look and flavor.",
    },
    {
      question: "Can I make focaccia without fresh rosemary?",
      answer:
        "Yes, if fresh rosemary is unavailable, dried rosemary can be used, but use it sparingly as it is more concentrated. Alternatively, other herbs like thyme or oregano can be used to add flavor.",
    },
    {
      question: "How should I store leftover focaccia?",
      answer:
        "Store leftover focaccia in an airtight container or wrapped tightly in plastic wrap at room temperature for up to 2 days. For longer storage, freeze the focaccia wrapped in foil and plastic wrap; thaw at room temperature before reheating.",
    },
    {
      question: "Can I add toppings other than rosemary and sea salt?",
      answer:
        "Absolutely! Focaccia is versatile and can be topped with a variety of ingredients such as olives, cherry tomatoes, caramelized onions, garlic, or even cheese. Just add toppings before baking for best results.",
    },
    {
      question: "Why is my focaccia dense instead of light and airy?",
      answer:
        "Dense focaccia can result from under-proofing the dough, using too little yeast, or not enough hydration. Ensure the dough rises adequately until doubled in size, and use the recommended water-to-flour ratio for a moist, airy crumb.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Focaccia"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 20m
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
            Focaccia is a traditional Italian flatbread known for its soft,
            airy crumb and crispy, golden crust. Characterized by its signature
            dimples and a generous drizzle of olive oil, focaccia is often
            topped with fragrant rosemary and coarse sea salt, making it a
            versatile and beloved staple in Italian cuisine. This recipe
            captures the essence of authentic focaccia, perfect for serving
            alongside meals or enjoying as a flavorful snack.
          </p>
          <p>
            Originating from the Liguria region of Italy, focaccia has a rich
            history dating back to ancient Roman times when it was baked on
            hot stones. Over centuries, it evolved into the beloved bread known
            today, celebrated for its simplicity and depth of flavor. Its
            rustic charm and adaptability have made it popular worldwide,
            inspiring countless variations and toppings.
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
              In a small bowl, combine the warm water (about 38°C/100°F) with
              the sugar and active dry yeast. Stir gently and let it sit for
              5-10 minutes until it becomes frothy, indicating the yeast is
              active.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Mix and Knead the Dough
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the bread flour and fine sea salt. Make
              a well in the center and pour in the activated yeast mixture and
              40ml of olive oil. Mix until a shaggy dough forms, then knead on
              a floured surface for about 8-10 minutes until smooth and elastic.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              First Rise
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Lightly oil a large bowl and place the dough inside, turning it
              to coat with oil. Cover with a damp cloth or plastic wrap and let
              it rise in a warm place for 1 to 1.5 hours, or until doubled in
              size.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shape and Second Rise
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Generously dust a baking sheet with cornmeal. Transfer the dough
              onto it and gently stretch it out to fit the pan, about 1 to 1.5
              cm thick. Cover and let it rise again for 30-45 minutes until
              puffy.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Create Dimples and Add Toppings
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Using your fingertips, press deep dimples all over the dough
              surface. Drizzle the remaining olive oil generously over the top,
              sprinkle with fresh rosemary, coarse sea salt, freshly ground
              black pepper, and optional thinly sliced garlic.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your oven to 220°C (425°F). Bake the focaccia for 18-22
              minutes or until golden brown and crisp on top. Remove from oven
              and allow to cool slightly before slicing.
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
            Use room temperature water to activate the yeast; water that is too
            hot can kill the yeast, while too cold water slows fermentation.
          </li>
          <li>
            For an extra crispy crust, preheat your baking sheet or stone in
            the oven before placing the dough on it.
          </li>
          <li>
            Experiment with toppings like sun-dried tomatoes, olives, or caramelized
            onions for different flavor profiles.
          </li>
          <li>
            If you prefer a more open crumb, increase hydration slightly by adding
            10-20ml more water.
          </li>
          <li>
            Leftover focaccia can be toasted and used for sandwiches or served
            alongside soups and salads.
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
