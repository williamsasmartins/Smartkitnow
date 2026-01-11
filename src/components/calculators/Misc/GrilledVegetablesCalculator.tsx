import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GrilledVegetablesCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Grilled%20Vegetables%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8481"
  );

  // --- DATA ---
  const title = "Grilled Vegetables";
  const description = "Grill vegetables with char, seasoning blends, and texture-friendly heat zones.";

  // INGREDIENTS
  const ingredients = [
    { name: "Zucchini", baseAmount: 200, unit: "g" },
    { name: "Red Bell Pepper", baseAmount: 150, unit: "g" },
    { name: "Yellow Bell Pepper", baseAmount: 150, unit: "g" },
    { name: "Eggplant", baseAmount: 200, unit: "g" },
    { name: "Red Onion", baseAmount: 100, unit: "g" },
    { name: "Cherry Tomatoes", baseAmount: 150, unit: "g" },
    { name: "Asparagus", baseAmount: 150, unit: "g" },
    { name: "Olive Oil", baseAmount: 30, unit: "ml" },
    { name: "Garlic Cloves", baseAmount: 3, unit: "pcs" },
    { name: "Fresh Thyme", baseAmount: 5, unit: "g" },
    { name: "Salt", baseAmount: 2, unit: "g" },
    { name: "Black Pepper", baseAmount: 1, unit: "g" },
    { name: "Lemon Juice", baseAmount: 15, unit: "ml" },
    { name: "Fresh Basil Leaves", baseAmount: 10, unit: "g" },
  ];

  const nutrition = {
    calories: "180",
    protein: "4g",
    carbs: "12g",
    fat: "14g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) => (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What vegetables are best for grilling?",
      answer:
        "Vegetables with firm textures and low water content such as zucchini, bell peppers, eggplant, asparagus, and onions are ideal for grilling. They hold their shape well and develop a delicious charred flavor without becoming mushy.",
    },
    {
      question: "How do I prevent vegetables from sticking to the grill?",
      answer:
        "To prevent sticking, make sure your grill grates are clean and preheated. Lightly brush the vegetables with olive oil before placing them on the grill. Using a grill basket or skewers can also help keep smaller pieces from sticking or falling through.",
    },
    {
      question: "Can I prepare grilled vegetables ahead of time?",
      answer:
        "Yes, grilled vegetables can be prepared a few hours in advance and stored in the refrigerator. For best texture and flavor, reheat them gently or serve at room temperature. Adding fresh herbs or a drizzle of lemon juice before serving can refresh their taste.",
    },
    {
      question: "What seasoning works best with grilled vegetables?",
      answer:
        "Simple seasonings like salt, black pepper, garlic, fresh herbs (thyme, basil, rosemary), and a splash of lemon juice complement the natural sweetness and smokiness of grilled vegetables. Olive oil helps to enhance flavor and prevent drying out.",
    },
    {
      question: "How long should I grill vegetables?",
      answer:
        "Grilling times vary depending on the vegetable and thickness. Generally, firm vegetables like zucchini and bell peppers take 6-10 minutes, turning occasionally until tender and charred. Cherry tomatoes and asparagus require less time, around 4-6 minutes.",
    },
    {
      question: "Is it better to grill vegetables whole or sliced?",
      answer:
        "Slicing vegetables into uniform pieces ensures even cooking and more surface area for charring. However, some vegetables like asparagus or cherry tomatoes can be grilled whole. Adjust grilling time accordingly to avoid undercooking or burning.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Grilled Vegetables"
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
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setServings((s) => Math.max(1, s - 1))}>
                -
              </Button>
              <span className="w-6 text-center font-bold text-lg">{servings}</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setServings((s) => s + 1)}>
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
            Grilled vegetables are a vibrant and healthy dish that highlights the natural flavors of fresh produce enhanced by the smoky char from the grill. This recipe combines a variety of colorful vegetables, seasoned simply with olive oil, garlic, and fresh herbs, making it a perfect side or main for any meal. The grilling process caramelizes the sugars in the vegetables, adding depth and complexity to their taste.
          </p>
          <p>
            The tradition of grilling vegetables spans many cultures, from Mediterranean to Asian cuisines, where fire and smoke are used to transform humble ingredients into something extraordinary. This recipe draws inspiration from classic Italian and Provençal grilling techniques, emphasizing freshness, simplicity, and balance.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Vegetables</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Wash and dry all vegetables thoroughly. Slice zucchini, eggplant, and bell peppers into 1/2-inch thick strips. Peel and quarter the red onion. Trim asparagus ends and leave cherry tomatoes whole. Mince garlic and chop fresh thyme and basil leaves.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Marinate the Vegetables</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine olive oil, minced garlic, lemon juice, salt, black pepper, and fresh thyme. Toss the vegetables gently in the marinade until evenly coated. Let them rest for 10-15 minutes to absorb the flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Preheat the Grill</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your grill to medium-high heat (about 400°F / 200°C). Clean and oil the grates to prevent sticking. If using a charcoal grill, ensure the coals are evenly spread for consistent heat.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Grill the Vegetables</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the vegetables on the grill in a single layer. Grill zucchini, eggplant, and bell peppers for 6-8 minutes per side until tender and charred. Asparagus and cherry tomatoes will take about 4-6 minutes, turning occasionally. Use tongs to flip carefully.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve and Garnish</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer grilled vegetables to a serving platter. Sprinkle fresh basil leaves on top and drizzle with any remaining marinade or a little extra olive oil. Serve warm or at room temperature as a side dish or salad.
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
            For even cooking, cut vegetables into uniform sizes and thicknesses. This ensures they grill at the same rate and prevents some pieces from burning while others remain undercooked.
          </li>
          <li>
            Use a grill basket or skewers for smaller or delicate vegetables like cherry tomatoes to avoid losing them through the grates.
          </li>
          <li>
            Let the vegetables rest for a few minutes after grilling to allow juices to redistribute, enhancing flavor and texture.
          </li>
          <li>
            Experiment with different herbs and spices such as smoked paprika, cumin, or fresh oregano to customize the flavor profile.
          </li>
          <li>
            If you don’t have a grill, you can use a grill pan or broiler to achieve similar charred effects indoors.
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
              href="https://en.wikipedia.org/wiki/Grilled_vegetables"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Grilled Vegetables
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.bonappetit.com/story/how-to-grill-vegetables"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Bon Appétit: How to Grill Vegetables Perfectly
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