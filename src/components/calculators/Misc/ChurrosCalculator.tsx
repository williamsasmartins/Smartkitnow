import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChurrosCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Churros%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6819"
  );

  // --- DATA ---
  const title = "Churros";
  const description = "Massa frita polvilhada com açúcar e canela, servida com calda opcional.";

  // INGREDIENTS
  const ingredients = [
    { name: "All-purpose flour", baseAmount: 250, unit: "g" },
    { name: "Water", baseAmount: 300, unit: "ml" },
    { name: "Unsalted butter", baseAmount: 50, unit: "g" },
    { name: "Granulated sugar", baseAmount: 30, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Large eggs", baseAmount: 2, unit: "pcs" },
    { name: "Vegetable oil (for frying)", baseAmount: 1000, unit: "ml" },
    { name: "Ground cinnamon (for coating)", baseAmount: 2, unit: "tsp" },
    { name: "Powdered sugar (for coating)", baseAmount: 50, unit: "g" },
    { name: "Chocolate sauce (optional)", baseAmount: 100, unit: "ml" },
    { name: "Vanilla extract", baseAmount: 1, unit: "tsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "350",
    protein: "6g",
    carbs: "45g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the origin of churros?",
      answer:
        "Churros originated in Spain and Portugal as a simple fried dough snack. They were popularized by Spanish shepherds who made them in the mountains due to their easy preparation and portability. Over time, churros spread to Latin America and other parts of the world, evolving with regional variations.",
    },
    {
      question: "How do I get the perfect crispy texture?",
      answer:
        "To achieve the perfect crispy exterior and soft interior, ensure the oil temperature stays between 175°C to 190°C (350°F to 375°F). Fry the churros in small batches to avoid temperature drops. Also, the dough should be thick enough to hold its shape when piped.",
    },
    {
      question: "Can I make churros without eggs?",
      answer:
        "Yes, churros can be made eggless by adjusting the dough recipe, often by increasing the water and flour ratio and sometimes adding a binding agent like xanthan gum or baking powder. However, eggs contribute to the richness and structure, so texture may vary.",
    },
    {
      question: "What are some popular dipping sauces for churros?",
      answer:
        "Classic dipping sauces include thick hot chocolate, dulce de leche, caramel sauce, and vanilla custard. You can also experiment with fruit compotes or flavored creams to complement the cinnamon-sugar coating.",
    },
    {
      question: "How should I store leftover churros?",
      answer:
        "Churros are best enjoyed fresh. If you need to store leftovers, let them cool completely, then place them in an airtight container at room temperature for up to 1 day. Reheat in an oven or air fryer to restore crispiness; avoid microwaving as it makes them soggy.",
    },
    {
      question: "Can I bake churros instead of frying?",
      answer:
        "Baking churros is possible for a healthier alternative, but they won't have the same crispiness and texture as fried ones. To bake, pipe the dough onto a baking sheet and bake at a high temperature (around 220°C/425°F) until golden, then coat with cinnamon sugar.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Churros"
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
            Churros are a beloved fried dough pastry, traditionally sprinkled with a mixture of sugar and cinnamon. Crispy on the outside and tender on the inside, they are often enjoyed as a breakfast treat or dessert. This recipe offers a classic approach to making authentic churros at home, complete with an optional rich chocolate dipping sauce.
          </p>
          <p>
            The origins of churros trace back to the Iberian Peninsula, where shepherds crafted this simple yet satisfying snack while tending their flocks. Over centuries, churros have become a staple in Spanish and Latin American cuisine, celebrated for their comforting texture and sweet flavor. Today, they are enjoyed worldwide, often paired with warm beverages or decadent sauces.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a medium saucepan, combine water, butter, sugar, and salt. Bring to a boil over medium heat, stirring occasionally until the butter melts completely.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Incorporate flour</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the saucepan from heat and quickly stir in the flour until the mixture forms a smooth dough that pulls away from the sides of the pan.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add eggs and vanilla</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Let the dough cool slightly, then beat in the eggs one at a time, mixing thoroughly after each addition. Stir in the vanilla extract until fully incorporated.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Heat the oil</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a deep fryer or large heavy pot, heat vegetable oil to 180°C (350°F). Use a thermometer to maintain consistent temperature.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Pipe and fry churros</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the dough to a piping bag fitted with a large star tip. Pipe 10-15 cm strips directly into the hot oil, cutting with scissors. Fry until golden and crisp, about 2-3 minutes per side.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Drain and coat</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove churros with a slotted spoon and drain on paper towels. While still warm, toss them in a mixture of cinnamon and powdered sugar.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              7
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve churros warm with optional chocolate sauce or your favorite dip. Enjoy immediately for best texture and flavor.
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
            Use a large star piping tip to create the classic ridged texture that crisps beautifully when fried.
          </li>
          <li>
            Maintain consistent oil temperature to avoid greasy or undercooked churros.
          </li>
          <li>
            For a richer flavor, substitute half the water with whole milk.
          </li>
          <li>
            If you don't have a piping bag, use a sturdy plastic bag with a corner snipped off.
          </li>
          <li>
            Experiment with different coatings like powdered sugar alone or a mix of sugar and nutmeg for a unique twist.
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
              href="https://en.wikipedia.org/wiki/Churros"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Churros
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/authentic-spanish-churros-recipe-3083492"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Authentic Spanish Churros Recipe
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