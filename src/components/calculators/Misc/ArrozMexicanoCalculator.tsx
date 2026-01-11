import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ArrozMexicanoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Mexican%20Rice%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=222"
  );

  // --- DATA ---
  const title = "Mexican Rice";
  const description = "Arroz vermelho soltinho com tomate e temperos.";

  // INGREDIENTS
  const ingredients = [
    { name: "Long-grain white rice", baseAmount: 200, unit: "g" },
    { name: "Tomato sauce", baseAmount: 120, unit: "ml" },
    { name: "Chicken broth", baseAmount: 500, unit: "ml" },
    { name: "Onion, finely chopped", baseAmount: 100, unit: "g" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "pcs" },
    { name: "Carrot, diced", baseAmount: 80, unit: "g" },
    { name: "Green peas", baseAmount: 80, unit: "g" },
    { name: "Vegetable oil", baseAmount: 30, unit: "ml" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Ground cumin", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh cilantro, chopped", baseAmount: 10, unit: "g" },
    { name: "Lime wedges (for serving)", baseAmount: 4, unit: "pcs" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "220",
    protein: "5g",
    carbs: "40g",
    fat: "4g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of rice is best for Mexican rice?",
      answer:
        "Long-grain white rice is ideal for Mexican rice because it cooks up fluffy and separate, preventing the dish from becoming mushy. Avoid short-grain or sticky rice varieties.",
    },
    {
      question: "Can I make Mexican rice vegetarian or vegan?",
      answer:
        "Absolutely! Substitute chicken broth with vegetable broth and use vegetable oil instead of lard or butter. The flavors remain rich and satisfying without animal products.",
    },
    {
      question: "How do I prevent the rice from sticking or burning?",
      answer:
        "To avoid sticking, toast the rice in oil until lightly golden before adding liquids. Use a heavy-bottomed pan and keep the heat moderate. Avoid stirring the rice while it cooks to prevent breaking the grains.",
    },
    {
      question: "Can I prepare Mexican rice ahead of time?",
      answer:
        "Yes, Mexican rice can be made a day in advance and reheated gently with a splash of broth or water to restore moisture. Store it covered in the refrigerator to maintain freshness.",
    },
    {
      question: "What dishes pair well with Mexican rice?",
      answer:
        "Mexican rice complements a variety of dishes such as tacos, enchiladas, grilled meats, beans, and fajitas. It adds a flavorful and colorful side that balances spicy and savory main courses.",
    },
    {
      question: "Is it possible to make Mexican rice spicy?",
      answer:
        "Definitely! You can add diced jalapeños or chipotle peppers in adobo sauce during cooking to introduce heat. Adjust the spice level according to your preference.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Mexican Rice"
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
            Mexican Rice, also known as Arroz Rojo, is a vibrant and flavorful side dish
            that is a staple in Mexican cuisine. This recipe features fluffy long-grain
            rice cooked with tomato sauce, aromatic spices, and fresh vegetables, resulting
            in a beautifully colored and delicious accompaniment to many Mexican meals.
          </p>
          <p>
            The origins of Mexican rice trace back to the blending of indigenous Mesoamerican
            ingredients with Spanish culinary influences. Tomatoes, native to the Americas,
            combined with rice introduced by the Spanish, created this iconic dish that
            has become beloved worldwide. Traditionally served alongside beans, meats,
            and salsas, Mexican rice adds both texture and flavor to any meal.
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
              Rinse the rice under cold water until the water runs clear to remove excess starch.
              Finely chop the onion and garlic, dice the carrot, and measure out the tomato sauce,
              broth, and spices.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Toast the Rice</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat the vegetable oil in a large skillet or saucepan over medium heat. Add the rinsed rice
              and cook, stirring frequently, until the grains turn a light golden brown. This step adds
              nuttiness and prevents sticking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Vegetables</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the chopped onion, garlic, and diced carrot to the rice. Cook for 3-4 minutes until the
              vegetables soften and become fragrant.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Liquids and Spices</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the tomato sauce, chicken broth, salt, and ground cumin. Bring the mixture to a boil,
              then reduce heat to low and cover the pan with a tight-fitting lid.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Simmer the Rice</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Let the rice simmer gently for about 15-20 minutes, or until all the liquid is absorbed and the
              rice is tender. Avoid lifting the lid during cooking to maintain steam.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Finish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove the pan from heat and let it rest covered for 5 minutes. Fluff the rice with a fork,
              stir in the green peas and chopped cilantro, and serve with lime wedges on the side.
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
            Rinsing the rice thoroughly removes excess starch and helps achieve a fluffy texture.
          </li>
          <li>
            Toasting the rice before adding liquids enhances the flavor and prevents it from becoming mushy.
          </li>
          <li>
            Use a heavy-bottomed pan with a tight-fitting lid to ensure even cooking and steam retention.
          </li>
          <li>
            For extra depth, add a small pinch of smoked paprika or a chipotle pepper in adobo sauce.
          </li>
          <li>
            Avoid stirring the rice while it cooks to keep the grains intact and fluffy.
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
              href="https://en.wikipedia.org/wiki/Mexican_cuisine#Rice"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Mexican Rice in Mexican Cuisine
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/mexican-rice-recipe-2342797"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Authentic Mexican Rice Recipe
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