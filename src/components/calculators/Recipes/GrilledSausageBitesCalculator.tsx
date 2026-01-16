import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GrilledSausageBitesCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Grilled%20Sausage%20Bites%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4519"
  );

  // --- DATA ---
  const title = "Grilled Sausage Bites";
  const description = "Sliced Calabresa or spicy sausage, grilled to perfection.";

  // INGREDIENTS
  const ingredients = [
    { name: "Calabresa Sausage (or spicy sausage)", baseAmount: 500, unit: "g" },
    { name: "Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Garlic Cloves, minced", baseAmount: 3, unit: "pcs" },
    { name: "Red Bell Pepper, diced", baseAmount: 1, unit: "pcs" },
    { name: "Yellow Bell Pepper, diced", baseAmount: 1, unit: "pcs" },
    { name: "Red Onion, sliced", baseAmount: 1, unit: "pcs" },
    { name: "Fresh Parsley, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Smoked Paprika", baseAmount: 1, unit: "tsp" },
    { name: "Crushed Red Pepper Flakes", baseAmount: 0.5, unit: "tsp" },
    { name: "Salt", baseAmount: 0.75, unit: "tsp" },
    { name: "Black Pepper, freshly ground", baseAmount: 0.5, unit: "tsp" },
    { name: "Lemon Wedges (for serving)", baseAmount: 4, unit: "pcs" },
  ];

  // Nutrition per 4 servings (approximate)
  const nutrition = {
    calories: "520",
    protein: "28g",
    carbs: "8g",
    fat: "42g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of sausage is best for grilled sausage bites?",
      answer:
        "Calabresa sausage is traditionally used due to its spicy and smoky flavor, but you can substitute with any spicy or smoked sausage like chorizo or Andouille. Choose sausages with natural casings for the best grilling texture.",
    },
    {
      question: "Can I prepare this recipe without a grill?",
      answer:
        "Absolutely! You can use a grill pan or a cast-iron skillet on your stovetop. Cook the sausage bites over medium-high heat until nicely browned and cooked through, turning frequently to avoid burning.",
    },
    {
      question: "How do I prevent the sausage bites from drying out?",
      answer:
        "Avoid overcooking by grilling the sausage bites just until they reach an internal temperature of 160°F (71°C). Using sausages with a good fat content also helps keep them juicy and flavorful.",
    },
    {
      question: "Can I make this recipe ahead of time?",
      answer:
        "Yes, you can grill the sausage bites in advance and reheat them gently in a skillet or oven. However, for the best texture and flavor, it’s recommended to serve them fresh off the grill.",
    },
    {
      question: "What are some good side dishes to serve with grilled sausage bites?",
      answer:
        "Grilled sausage bites pair wonderfully with fresh salads, grilled vegetables, crusty bread, or even a tangy mustard dipping sauce. For a heartier meal, serve alongside roasted potatoes or creamy polenta.",
    },
    {
      question: "Is this recipe suitable for meal prepping?",
      answer:
        "Yes, grilled sausage bites can be portioned and stored in airtight containers in the refrigerator for up to 3 days. Reheat thoroughly before serving. This makes them a convenient protein option for quick meals.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Grilled Sausage Bites"
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
            Grilled Sausage Bites are a flavorful and easy-to-make appetizer or snack that
            highlights the bold, smoky taste of Calabresa or spicy sausages. This recipe
            combines juicy sausage slices with vibrant bell peppers and aromatic garlic,
            all perfectly charred on the grill to create a delicious bite-sized treat.
          </p>
          <p>
            Originating from Brazilian and Portuguese culinary traditions, Calabresa sausage
            is a staple ingredient known for its robust flavor and versatility. Grilling
            sausage bites is a popular way to enjoy this ingredient, especially during
            gatherings and barbecues, where the smoky aroma and charred texture elevate the
            overall experience.
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
              Prepare the Ingredients
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slice the Calabresa sausage into bite-sized pieces. Dice the red and yellow
              bell peppers, slice the red onion, and mince the garlic cloves. Chop the
              fresh parsley and set aside lemon wedges for serving.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Marinate the Sausage Bites
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the sausage slices with olive oil, minced garlic,
              smoked paprika, crushed red pepper flakes, salt, and black pepper. Toss well
              to coat evenly and let marinate for 10-15 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Preheat the Grill
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat your grill or grill pan to medium-high heat. Ensure the grates are clean
              and lightly oiled to prevent sticking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Grill the Sausage and Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the sausage bites, bell peppers, and red onion slices on the grill.
              Cook for about 8-10 minutes, turning occasionally, until the sausage is cooked
              through and the vegetables are tender with nice grill marks.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Garnish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the grilled sausage bites and vegetables to a serving platter.
              Sprinkle with chopped fresh parsley and serve with lemon wedges on the side
              for a bright, zesty finish.
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
            Use sausages with natural casings for a better snap and texture when grilled.
          </li>
          <li>
            To add smoky depth, consider adding a few drops of liquid smoke to the marinade.
          </li>
          <li>
            If grilling vegetables separately, use skewers to keep them from falling through
            the grates.
          </li>
          <li>
            Serve with a side of grainy mustard or a garlic aioli for dipping to enhance
            flavors.
          </li>
          <li>
            For a milder version, substitute spicy sausage with sweet Italian sausage and
            omit the crushed red pepper flakes.
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