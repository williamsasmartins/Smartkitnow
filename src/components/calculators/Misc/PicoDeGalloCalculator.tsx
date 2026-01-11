import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PicoDeGalloCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Pico%20de%20Gallo%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3809"
  );

  // --- DATA ---
  const title = "Pico de Gallo";
  const description = "Salsa crua de tomate, cebola, coentro e limão, bem refrescante.";

  // INGREDIENTS
  const ingredients = [
    { name: "Tomatoes (ripe, chopped)", baseAmount: 400, unit: "g" },
    { name: "White onion (finely chopped)", baseAmount: 100, unit: "g" },
    { name: "Fresh cilantro (chopped)", baseAmount: 15, unit: "g" },
    { name: "Fresh lime juice", baseAmount: 30, unit: "ml" },
    { name: "Jalapeño pepper (seeded and minced)", baseAmount: 15, unit: "g" },
    { name: "Salt", baseAmount: 3, unit: "g" },
    { name: "Black pepper (freshly ground)", baseAmount: 1, unit: "g" },
    { name: "Olive oil (optional)", baseAmount: 10, unit: "ml" },
    { name: "Garlic (minced, optional)", baseAmount: 5, unit: "g" },
    { name: "Green bell pepper (finely chopped, optional)", baseAmount: 50, unit: "g" },
    { name: "Cumin powder (optional)", baseAmount: 1, unit: "g" },
    { name: "Sugar (optional, to balance acidity)", baseAmount: 2, unit: "g" },
  ];

  // Nutrition per 100g approx (values for fresh salsa)
  const nutrition = {
    calories: "30",
    protein: "1g",
    carbs: "7g",
    fat: "0.2g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Pico de Gallo and how is it different from salsa?",
      answer:
        "Pico de Gallo, also known as salsa fresca, is a fresh, uncooked Mexican condiment made from chopped tomatoes, onions, cilantro, lime juice, and chili peppers. Unlike cooked salsas, Pico de Gallo is chunky and has a crisp texture, offering a bright and refreshing flavor profile.",
    },
    {
      question: "Can I adjust the spiciness of Pico de Gallo?",
      answer:
        "Absolutely! The heat level depends on the type and amount of chili peppers used. Jalapeños are common, but you can substitute with milder peppers like Anaheim or hotter ones like serrano. Removing seeds reduces heat, while including them increases spiciness.",
    },
    {
      question: "How long does Pico de Gallo stay fresh?",
      answer:
        "Because it is made from fresh ingredients without preservatives, Pico de Gallo is best consumed within 2 to 3 days when stored in an airtight container in the refrigerator. The flavors meld over time, but the texture may become softer.",
    },
    {
      question: "Can I prepare Pico de Gallo in advance?",
      answer:
        "Yes, you can prepare it a few hours ahead to allow the flavors to meld. However, avoid making it too far in advance as the tomatoes release water and the texture can become watery. Stir before serving to redistribute juices.",
    },
    {
      question: "What dishes pair well with Pico de Gallo?",
      answer:
        "Pico de Gallo is versatile and pairs wonderfully with tacos, grilled meats, quesadillas, nachos, and as a topping for eggs or avocado toast. It also works well as a fresh dip with tortilla chips or as a side salad.",
    },
    {
      question: "Can I customize Pico de Gallo with other ingredients?",
      answer:
        "Definitely! While the classic recipe is simple, you can add diced avocado, mango, cucumber, or radish for different textures and flavors. Just keep the balance of acidity and freshness to maintain its signature bright taste.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Pico de Gallo"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 10m | Cook: 0m
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
            Pico de Gallo, often called salsa fresca, is a vibrant and fresh Mexican condiment
            that brings brightness and zest to any dish. Made from freshly chopped tomatoes,
            onions, cilantro, lime juice, and chili peppers, it is celebrated for its crisp
            texture and refreshing flavors. This uncooked salsa is a staple in Mexican cuisine,
            perfect for adding a burst of freshness to tacos, grilled meats, and snacks.
          </p>
          <p>
            The origins of Pico de Gallo trace back to traditional Mexican cooking, where fresh,
            simple ingredients are combined to create bold flavors. Its name, which translates
            to "rooster's beak," is believed to come from the way it was originally eaten by
            pinching the mixture between the thumb and forefinger, resembling a rooster's beak.
            Over time, it has become a beloved accompaniment worldwide, cherished for its
            versatility and healthful qualities.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Wash and finely chop the ripe tomatoes, white onion, fresh cilantro, and jalapeño
              pepper. If you prefer less heat, remove the seeds from the jalapeño. Mince the garlic
              if using.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Mix Ingredients</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a medium bowl, combine the chopped tomatoes, onion, cilantro, jalapeño, and garlic.
              Add the fresh lime juice, salt, black pepper, and optional cumin powder and sugar.
              Stir gently to combine all ingredients evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Adjust Seasoning</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Taste the mixture and adjust salt, lime juice, or chili to your preference. If desired,
              drizzle a small amount of olive oil for a richer mouthfeel.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve Fresh</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve immediately or refrigerate for up to 2-3 days. Stir before serving to redistribute
              juices. Enjoy as a topping, dip, or side to your favorite dishes.
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
            Use firm, ripe tomatoes like Roma or vine-ripened for the best texture and flavor.
          </li>
          <li>
            Remove excess seeds and juice from tomatoes if you want a less watery Pico de Gallo.
          </li>
          <li>
            For a smoky twist, lightly char the tomatoes and jalapeños before chopping.
          </li>
          <li>
            Always add lime juice last and adjust seasoning after mixing to balance acidity.
          </li>
          <li>
            Fresh cilantro is key; avoid dried herbs to maintain the authentic bright flavor.
          </li>
          <li>
            If you prefer a milder salsa, substitute jalapeño with a mild pepper or reduce quantity.
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
              href="https://en.wikipedia.org/wiki/Pico_de_gallo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Pico de Gallo
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/pico-de-gallo-recipe-2342783"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Authentic Pico de Gallo Recipe
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/pico-de-gallo-fresh-salsa-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Fresh Pico de Gallo Salsa
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