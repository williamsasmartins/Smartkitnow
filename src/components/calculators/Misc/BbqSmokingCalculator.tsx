import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BbqSmokingCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/BBQ%20%20Smoking%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6292"
  );

  // --- DATA ---
  const title = "BBQ & Smoking";
  const description =
    "Smoked and grilled favorites: brisket, ribs, pulled pork, poultry, seafood, and veggies.";

  // INGREDIENTS
  const ingredients = [
    { name: "Beef Brisket", baseAmount: 1000, unit: "g" },
    { name: "Pork Ribs", baseAmount: 800, unit: "g" },
    { name: "Pulled Pork Shoulder", baseAmount: 900, unit: "g" },
    { name: "Chicken Thighs", baseAmount: 600, unit: "g" },
    { name: "Salmon Fillet", baseAmount: 500, unit: "g" },
    { name: "Smoked Sausages", baseAmount: 400, unit: "g" },
    { name: "Bell Peppers", baseAmount: 300, unit: "g" },
    { name: "Onions", baseAmount: 200, unit: "g" },
    { name: "Garlic Cloves", baseAmount: 6, unit: "pcs" },
    { name: "Applewood Chips", baseAmount: 50, unit: "g" },
    { name: "BBQ Sauce", baseAmount: 150, unit: "ml" },
    { name: "Olive Oil", baseAmount: 50, unit: "ml" },
    { name: "Salt", baseAmount: 15, unit: "g" },
    { name: "Black Pepper", baseAmount: 10, unit: "g" },
  ];

  // Nutrition estimates per serving (approximate)
  const nutrition = {
    calories: "650",
    protein: "55g",
    carbs: "20g",
    fat: "35g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the difference between BBQ and smoking?",
      answer:
        "BBQ generally refers to cooking food slowly over indirect heat with smoke, often at lower temperatures, while smoking specifically uses wood smoke to flavor and cook the food over a longer period. Smoking is a subset of BBQ techniques focused on infusing smoky flavors.",
    },
    {
      question: "How do I choose the right wood chips for smoking?",
      answer:
        "Different woods impart distinct flavors: fruitwoods like apple and cherry provide mild, sweet smoke; hickory and mesquite offer stronger, more robust flavors. Choose based on the meat type and your flavor preference. Avoid resinous woods like pine as they produce unpleasant tastes.",
    },
    {
      question: "How long should I smoke brisket for the best results?",
      answer:
        "Brisket typically requires low and slow smoking at around 225°F (107°C) for 1 to 1.5 hours per pound. This can mean 8-12 hours depending on size. Use a meat thermometer to ensure internal temperature reaches about 195-205°F (90-96°C) for tender, juicy results.",
    },
    {
      question: "Can I use a gas grill for smoking?",
      answer:
        "Yes, you can use a gas grill for smoking by setting up a two-zone fire and adding a smoker box or foil pouch with wood chips near the burners. Maintain low temperatures and keep the lid closed to trap smoke. However, dedicated smokers often provide more consistent results.",
    },
    {
      question: "How do I prevent my meat from drying out during smoking?",
      answer:
        "Maintain a consistent low temperature, use a water pan inside the smoker to add moisture, and consider wrapping the meat in foil or butcher paper during the latter stages (the 'Texas Crutch'). Also, avoid opening the smoker frequently to keep heat and smoke steady.",
    },
    {
      question: "What are some good side dishes to serve with BBQ & smoked meats?",
      answer:
        "Classic sides include coleslaw, baked beans, cornbread, grilled vegetables, mac and cheese, and pickles. These complement the rich smoky flavors and provide balance with freshness and texture.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="BBQ & Smoking"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
          About this Recipe
        </h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            BBQ & Smoking is a culinary art that celebrates the rich, smoky flavors
            achieved by slow-cooking meats and vegetables over wood smoke and charcoal.
            This technique transforms humble ingredients into tender, flavorful dishes
            that are beloved worldwide. From brisket and ribs to poultry and seafood,
            BBQ & Smoking offers a diverse range of tastes and textures that satisfy
            every palate.
          </p>
          <p>
            The origins of BBQ and smoking trace back centuries, with indigenous peoples
            using smoke to preserve and flavor meats long before modern grills existed.
            Over time, regional styles developed across the United States and beyond,
            each with unique woods, rubs, sauces, and cooking methods. Today, BBQ & Smoking
            is both a cherished tradition and a vibrant, evolving culinary craft.
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
              Prepare the Meat
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Trim excess fat from your meat cuts, then apply a dry rub made of salt,
              pepper, garlic powder, and your favorite spices. Let the meat rest at
              room temperature for 30 minutes to absorb the flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Smoker or Grill
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your smoker or grill to a steady 225°F (107°C). Add soaked wood
              chips (applewood or hickory recommended) to the smoker box or directly
              on the coals to generate smoke.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Smoke the Meat Low and Slow
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Place the meat on the grill away from direct heat. Maintain temperature
              and smoke for several hours, depending on the cut and size. Use a meat
              thermometer to monitor internal temperature.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Wrap and Rest
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Once the meat reaches about 160°F (71°C), wrap it tightly in butcher
              paper or foil to retain moisture. Continue cooking until the internal
              temperature hits 195-205°F (90-96°C). Let the meat rest for at least 30
              minutes before slicing.
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
              Slice the meat against the grain and serve with your favorite BBQ sauce
              and sides. Enjoy the deep smoky flavors and tender texture that define
              classic BBQ & Smoking.
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
            Use a water pan inside your smoker to maintain humidity and prevent meat
            from drying out.
          </li>
          <li>
            Experiment with different wood chips to find your preferred smoke flavor
            profile.
          </li>
          <li>
            Avoid opening the smoker lid frequently; each opening causes heat and smoke
            loss, extending cooking time.
          </li>
          <li>
            Rest your meat after cooking to allow juices to redistribute for maximum
            tenderness.
          </li>
          <li>
            Use a digital meat thermometer for precise temperature monitoring and
            perfect doneness.
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
              href="https://en.wikipedia.org/wiki/Barbecue"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Barbecue
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/the-food-lab-complete-guide-to-smoking-meat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Complete Guide to Smoking Meat
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