import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SalsaVerdeCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Salsa%20Verde%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8989"
  );

  // --- DATA ---
  const title = "Salsa Verde";
  const description = "Salsa verde de tomatillo e pimentas, com acidez e frescor.";

  // INGREDIENTS
  const ingredients = [
    { name: "Tomatillos, husked and rinsed", baseAmount: 500, unit: "g" },
    { name: "Jalapeño peppers, stemmed and seeded", baseAmount: 2, unit: "pcs" },
    { name: "Fresh cilantro leaves", baseAmount: 30, unit: "g" },
    { name: "White onion, roughly chopped", baseAmount: 100, unit: "g" },
    { name: "Garlic cloves", baseAmount: 3, unit: "pcs" },
    { name: "Fresh lime juice", baseAmount: 30, unit: "ml" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Ground cumin", baseAmount: 0.5, unit: "tsp" },
    { name: "Olive oil", baseAmount: 15, unit: "ml" },
    { name: "Water (optional, to adjust consistency)", baseAmount: 50, unit: "ml" },
    { name: "Sugar (optional, to balance acidity)", baseAmount: 1, unit: "tsp" },
  ];

  // Nutrition estimates per serving (approximate)
  const nutrition = {
    calories: "45",
    protein: "1g",
    carbs: "8g",
    fat: "2g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the best way to roast tomatillos for salsa verde?",
      answer:
        "Roasting tomatillos enhances their natural tanginess and adds a subtle smoky flavor. You can roast them under a broiler or on a hot skillet until the skins are charred and blistered, usually about 5-7 minutes. This step is optional but highly recommended for depth of flavor.",
    },
    {
      question: "Can I make salsa verde without jalapeños?",
      answer:
        "Yes, you can substitute jalapeños with milder peppers like poblano or Anaheim if you prefer less heat. Alternatively, remove the seeds and membranes from jalapeños to reduce spiciness while retaining flavor.",
    },
    {
      question: "How long does salsa verde keep in the refrigerator?",
      answer:
        "Stored in an airtight container, salsa verde typically stays fresh for up to 5-7 days in the refrigerator. Always check for any off smells or mold before consuming.",
    },
    {
      question: "Can I freeze salsa verde?",
      answer:
        "Yes, salsa verde freezes well. Transfer it to a freezer-safe container or bag, leaving some space for expansion. Thaw in the refrigerator before use. Note that texture may slightly change after freezing.",
    },
    {
      question: "What dishes pair well with salsa verde?",
      answer:
        "Salsa verde is incredibly versatile and pairs wonderfully with grilled meats, tacos, roasted vegetables, eggs, and as a dipping sauce for chips. Its bright acidity and fresh herbs complement rich and smoky flavors beautifully.",
    },
    {
      question: "How can I adjust the consistency of my salsa verde?",
      answer:
        "If your salsa verde is too thick, add a little water or olive oil to thin it out. For a chunkier texture, pulse the ingredients less in the blender or food processor. Adjust seasoning after modifying consistency.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Salsa Verde"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 15m | Cook: 10m
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
            Salsa verde is a vibrant, tangy green sauce originating from Mexican cuisine,
            celebrated for its fresh, bright flavors and versatility. Made primarily from
            tomatillos, fresh herbs, and peppers, it brings a zesty punch to any dish,
            balancing acidity with a subtle heat and herbal freshness.
          </p>
          <p>
            Historically, salsa verde has been a staple in Mexican households for centuries,
            evolving from indigenous recipes that utilized native ingredients like tomatillos
            and chili peppers. Its name, meaning "green sauce" in Spanish, reflects its
            characteristic color and freshness. Today, salsa verde is enjoyed worldwide,
            inspiring countless variations and culinary innovations.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Tomatillos</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Husk and rinse the tomatillos thoroughly to remove their sticky residue. For a deeper flavor,
              roast them under a broiler or on a hot skillet until the skins are blistered and charred,
              about 5-7 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Peppers and Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove stems and seeds from jalapeños for milder heat. Roughly chop the white onion and peel the garlic cloves.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Blend the Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a blender or food processor, combine the tomatillos, jalapeños, onion, garlic, cilantro,
              lime juice, salt, and cumin. Pulse until you reach your desired consistency—smooth or slightly chunky.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Adjust and Finish</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add olive oil and water as needed to adjust thickness. Taste and add sugar if the salsa is too acidic.
              Adjust salt and lime juice to balance flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve or Store</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve immediately or refrigerate in an airtight container for up to a week.
              Salsa verde also freezes well for longer storage.
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
            For a smoky depth, try charring the tomatillos and jalapeños on a grill or open flame before blending.
          </li>
          <li>
            Adjust the heat level by controlling the amount of seeds and membranes in the peppers.
          </li>
          <li>
            Fresh lime juice brightens the salsa—add it gradually and taste as you go.
          </li>
          <li>
            Use fresh cilantro for the best herbal aroma; dried cilantro will not provide the same flavor.
          </li>
          <li>
            If you prefer a chunkier salsa, pulse the ingredients less or chop by hand before blending.
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
              href="https://en.wikipedia.org/wiki/Salsa_verde"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Salsa Verde
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/mexican-salsa-verde-recipe-2342764"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Authentic Mexican Salsa Verde Recipe
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