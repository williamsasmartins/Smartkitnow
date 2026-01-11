import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChilaquilesCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chilaquiles%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3142"
  );

  // --- DATA ---
  const title = "Chilaquiles";
  const description = "Tortilla chips cozidos em salsa, com queijo, creme e ovos/carne.";

  // INGREDIENTS
  const ingredients = [
    { name: "Tortilla Chips", baseAmount: 300, unit: "g" },
    { name: "Salsa Verde (Green Sauce)", baseAmount: 400, unit: "ml" },
    { name: "Salsa Roja (Red Sauce)", baseAmount: 400, unit: "ml" },
    { name: "Queso Fresco (Fresh Cheese)", baseAmount: 150, unit: "g" },
    { name: "Crema Mexicana (Mexican Cream)", baseAmount: 100, unit: "ml" },
    { name: "White Onion (finely chopped)", baseAmount: 50, unit: "g" },
    { name: "Cilantro (chopped)", baseAmount: 15, unit: "g" },
    { name: "Eggs", baseAmount: 4, unit: "pcs" },
    { name: "Chicken Breast (cooked and shredded)", baseAmount: 250, unit: "g" },
    { name: "Vegetable Oil", baseAmount: 30, unit: "ml" },
    { name: "Salt", baseAmount: 3, unit: "g" },
    { name: "Black Pepper", baseAmount: 2, unit: "g" },
    { name: "Avocado (sliced, optional)", baseAmount: 1, unit: "pc" },
    { name: "Radishes (sliced, optional)", baseAmount: 50, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "28g",
    carbs: "35g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What are chilaquiles and where do they originate from?",
      answer:
        "Chilaquiles are a traditional Mexican breakfast dish made from lightly fried corn tortillas cut into quarters and cooked in green or red salsa. Originating from Mexico, they are a popular comfort food often served with toppings like cheese, crema, onions, and eggs or shredded chicken.",
    },
    {
      question: "Can I use store-bought tortilla chips for chilaquiles?",
      answer:
        "While you can use store-bought tortilla chips, authentic chilaquiles are made by frying fresh corn tortillas cut into quarters until crispy. This method ensures the chips absorb the salsa properly without becoming too soggy or overly salty.",
    },
    {
      question: "How do I prevent the tortilla chips from becoming soggy?",
      answer:
        "To avoid soggy chilaquiles, add the salsa just before serving and toss gently to coat the chips. Using freshly fried tortillas instead of pre-packaged chips helps maintain a better texture. Also, serve immediately after mixing to enjoy the perfect balance of crispiness and sauciness.",
    },
    {
      question: "What variations of chilaquiles can I try?",
      answer:
        "Chilaquiles can be customized with different salsas such as salsa verde (green) or salsa roja (red). You can top them with fried or scrambled eggs, shredded chicken, pulled pork, or even beans. Garnishes like avocado, radishes, onions, and cilantro add freshness and texture.",
    },
    {
      question: "Is chilaquiles suitable for vegetarians?",
      answer:
        "Yes, chilaquiles can be made vegetarian by omitting meat toppings and using vegetable-based salsas. You can add beans, cheese, eggs, and vegetables to keep the dish hearty and flavorful without any animal meat.",
    },
    {
      question: "How long does it take to prepare chilaquiles?",
      answer:
        "Preparation usually takes about 20 minutes, including frying the tortillas and preparing the salsa, with an additional 10 minutes for cooking and assembling the dish. It’s a quick and satisfying meal perfect for breakfast or brunch.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Chilaquiles"
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
            Chilaquiles is a beloved Mexican dish that transforms simple tortilla chips into a flavorful and comforting meal. The chips are gently simmered in a vibrant salsa—either green (salsa verde) or red (salsa roja)—and topped with creamy queso fresco, tangy crema, fresh onions, and often eggs or shredded chicken. This dish is a perfect blend of textures and flavors, offering a satisfying breakfast or brunch option that is both hearty and fresh.
          </p>
          <p>
            The origins of chilaquiles trace back to indigenous Mexican cuisine, where leftover tortillas were repurposed into a new dish by frying and simmering them in chili sauces. Over time, it evolved into a staple breakfast food across Mexico, celebrated for its versatility and comforting qualities. Today, chilaquiles continue to be a popular dish in Mexican households and restaurants worldwide, cherished for their rich cultural heritage and delicious taste.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Tortilla Chips</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut fresh corn tortillas into quarters. Heat vegetable oil in a large skillet over medium heat and fry the tortilla pieces until crisp and golden brown. Drain on paper towels and season lightly with salt.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Salsa</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              For salsa verde, blend tomatillos, jalapeños, garlic, onion, cilantro, and salt. For salsa roja, blend ripe tomatoes, dried chilies, garlic, onion, and salt. Simmer the salsa in a saucepan for 5-7 minutes to develop flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine Chips and Salsa</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the fried tortilla chips to the simmering salsa and gently toss to coat. Cook for 2-3 minutes until the chips soften slightly but still retain some crispness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare Toppings</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Fry or scramble eggs according to preference. Shred cooked chicken breast if using. Slice avocado and radishes, and chop onions and cilantro for garnish.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Assemble and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Plate the chilaquiles topped with queso fresco, crema, eggs or chicken, and fresh garnishes. Serve immediately to enjoy the perfect balance of textures and flavors.
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
            Use fresh corn tortillas for frying to get the best texture and flavor; avoid pre-packaged chips for authentic chilaquiles.
          </li>
          <li>
            Adjust the salsa spiciness by controlling the amount and type of chilies used; mild or smoky chipotle salsas work wonderfully.
          </li>
          <li>
            To keep the chips from becoming soggy, add salsa just before serving and toss gently.
          </li>
          <li>
            Experiment with toppings like refried beans, pickled jalapeños, or queso añejo for added depth.
          </li>
          <li>
            Leftover chilaquiles can be reheated gently in a skillet with a splash of water or broth to revive the texture.
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
              href="https://en.wikipedia.org/wiki/Chilaquiles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Chilaquiles
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/chilaquiles-recipe-2342797"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Authentic Chilaquiles Recipe
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