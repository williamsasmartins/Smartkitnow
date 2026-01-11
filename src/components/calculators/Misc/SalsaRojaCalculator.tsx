import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SalsaRojaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Salsa%20Roja%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4858"
  );

  // --- DATA ---
  const title = "Salsa Roja";
  const description = "Salsa vermelha à base de tomate e pimentas, levemente picante.";

  // INGREDIENTS
  const ingredients = [
    { name: "Tomatoes (ripe)", baseAmount: 600, unit: "g" },
    { name: "White onion", baseAmount: 100, unit: "g" },
    { name: "Garlic cloves", baseAmount: 3, unit: "pcs" },
    { name: "Jalapeño peppers", baseAmount: 2, unit: "pcs" },
    { name: "Fresh cilantro", baseAmount: 15, unit: "g" },
    { name: "Lime juice", baseAmount: 15, unit: "ml" },
    { name: "Vegetable oil", baseAmount: 15, unit: "ml" },
    { name: "Salt", baseAmount: 5, unit: "g" },
    { name: "Ground black pepper", baseAmount: 1, unit: "g" },
    { name: "Ground cumin", baseAmount: 1, unit: "g" },
    { name: "Water", baseAmount: 50, unit: "ml" },
    { name: "Sugar (optional)", baseAmount: 2, unit: "g" },
  ];

  const nutrition = {
    calories: "45",
    protein: "1g",
    carbs: "9g",
    fat: "1g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Salsa Roja and how is it different from other salsas?",
      answer:
        "Salsa Roja is a traditional Mexican red sauce primarily made from tomatoes and chili peppers. Unlike Salsa Verde, which uses tomatillos and green chilies, Salsa Roja has a deeper, smoky flavor often achieved by roasting or sautéing the ingredients. It is typically medium spicy and used as a versatile condiment.",
    },
    {
      question: "Can I adjust the spiciness of Salsa Roja?",
      answer:
        "Absolutely! The heat level depends on the type and amount of chili peppers used. For a milder salsa, reduce the number of jalapeños or remove the seeds before blending. For more heat, add spicier peppers like serranos or chipotles.",
    },
    {
      question: "How should I store Salsa Roja and how long does it last?",
      answer:
        "Store Salsa Roja in an airtight container in the refrigerator. It typically lasts up to one week. For longer storage, you can freeze it in portions. Always use a clean spoon to avoid contamination.",
    },
    {
      question: "Can I make Salsa Roja without cooking the ingredients?",
      answer:
        "Yes, you can make a fresh, uncooked version by blending raw tomatoes, onions, garlic, and chilies. However, cooking or roasting the ingredients enhances the flavor complexity and mellows the acidity.",
    },
    {
      question: "What dishes pair well with Salsa Roja?",
      answer:
        "Salsa Roja is incredibly versatile. It pairs well with tacos, grilled meats, eggs, quesadillas, and as a dip for tortilla chips. It also works as a sauce base for enchiladas and chilaquiles.",
    },
    {
      question: "Is Salsa Roja gluten-free and vegan?",
      answer:
        "Yes, Salsa Roja is naturally gluten-free and vegan, made from fresh vegetables and spices without any animal products or gluten-containing ingredients.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Salsa Roja"
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
            Salsa Roja, literally meaning "red sauce," is a vibrant and flavorful staple in Mexican cuisine. Made primarily from ripe tomatoes and chili peppers, this sauce offers a perfect balance of smoky, tangy, and mildly spicy notes. It is a versatile condiment that enhances the taste of tacos, grilled meats, eggs, and many traditional dishes.
          </p>
          <p>
            The origins of Salsa Roja trace back to indigenous Mexican cooking traditions, where roasting fresh ingredients over an open flame was common. This technique imparts a subtle smokiness and depth to the salsa. Over centuries, Salsa Roja has evolved with regional variations, but its core essence remains a beloved classic in kitchens worldwide.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Wash the tomatoes, jalapeños, and cilantro thoroughly. Peel the onion and garlic cloves. Cut the tomatoes into halves or quarters for easier cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté the Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat the vegetable oil in a skillet over medium heat. Add the chopped onion and garlic, sautéing until translucent and fragrant, about 3-4 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Tomatoes and Peppers</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the tomatoes and jalapeños to the skillet. Cook for about 8-10 minutes, stirring occasionally, until the tomatoes soften and release their juices.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Blend the Salsa</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Transfer the cooked mixture to a blender. Add fresh cilantro, lime juice, water, salt, black pepper, cumin, and sugar if using. Blend until smooth or slightly chunky, according to your preference.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Adjust and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Taste the salsa and adjust seasoning if needed. Serve immediately or refrigerate for flavors to meld. Salsa Roja pairs beautifully with a wide variety of dishes.
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
            Roast the tomatoes and peppers on a hot skillet or grill for a smoky depth before cooking them with onions and garlic.
          </li>
          <li>
            Remove the seeds from jalapeños to reduce heat without losing flavor.
          </li>
          <li>
            Use fresh lime juice instead of bottled for a brighter, fresher taste.
          </li>
          <li>
            Let the salsa rest in the fridge for at least an hour to allow flavors to meld and intensify.
          </li>
          <li>
            Add a pinch of sugar to balance acidity if your tomatoes are very tart.
          </li>
          <li>
            For a chunkier texture, pulse the blender instead of blending continuously.
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
              href="https://en.wikipedia.org/wiki/Salsa_(sauce)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Salsa (sauce)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/salsa-roja-recipe-2342797"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Salsa Roja Recipe
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