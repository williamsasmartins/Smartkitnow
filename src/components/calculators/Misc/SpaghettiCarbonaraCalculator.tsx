import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SpaghettiCarbonaraCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Spaghetti%20Carbonara%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5325"
  );

  // --- DATA ---
  const title = "Spaghetti Carbonara";
  const description = "Creamy pasta with eggs, Pecorino cheese, guanciale, and black pepper.";

  // INGREDIENTS
  const ingredients = [
    { name: "Spaghetti", baseAmount: 400, unit: "g" },
    { name: "Guanciale (pork cheek)", baseAmount: 150, unit: "g" },
    { name: "Egg yolks", baseAmount: 4, unit: "pcs" },
    { name: "Whole eggs", baseAmount: 1, unit: "pc" },
    { name: "Pecorino Romano cheese, finely grated", baseAmount: 100, unit: "g" },
    { name: "Freshly ground black pepper", baseAmount: 2, unit: "tsp" },
    { name: "Salt (for pasta water)", baseAmount: 1, unit: "tbsp" },
    { name: "Extra virgin olive oil", baseAmount: 1, unit: "tbsp" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "520",
    protein: "25g",
    carbs: "60g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the difference between guanciale and pancetta?",
      answer:
        "Guanciale is cured pork cheek, prized for its rich flavor and higher fat content, which renders beautifully in carbonara. Pancetta is cured pork belly and can be used as a substitute, but it has a milder flavor and less fat, slightly altering the dish's traditional taste and texture.",
    },
    {
      question: "Can I use cream in Spaghetti Carbonara?",
      answer:
        "Traditional Roman carbonara does not use cream. The creamy texture comes from the emulsion of eggs, cheese, and pasta water. Adding cream is common outside Italy but changes the authentic flavor and consistency of the dish.",
    },
    {
      question: "How do I prevent the eggs from scrambling when mixing?",
      answer:
        "To avoid scrambling, remove the pasta from heat before adding the egg mixture. Toss quickly and continuously, using some reserved hot pasta water to create a smooth, silky sauce without cooking the eggs into curds.",
    },
    {
      question: "What type of cheese is best for carbonara?",
      answer:
        "Pecorino Romano is the traditional cheese used in carbonara, offering a sharp, salty flavor. Parmesan (Parmigiano-Reggiano) can be used as a milder alternative or mixed with Pecorino for balance.",
    },
    {
      question: "Can I prepare carbonara in advance?",
      answer:
        "Carbonara is best served immediately to enjoy its creamy texture. Preparing in advance and reheating can cause the sauce to separate or the eggs to scramble. If needed, reheat gently with a splash of water or broth while stirring.",
    },
    {
      question: "Why is black pepper important in carbonara?",
      answer:
        "Black pepper adds a spicy, aromatic kick that balances the richness of the eggs and cheese. Freshly cracked black pepper is preferred for its robust flavor and texture.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Spaghetti Carbonara"
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
            Spaghetti Carbonara is a classic Roman pasta dish that combines simple,
            high-quality ingredients to create a rich and creamy sauce without the use
            of cream. The magic lies in the perfect balance of eggs, Pecorino Romano
            cheese, guanciale, and freshly cracked black pepper, all tossed with
            al dente spaghetti.
          </p>
          <p>
            This recipe celebrates traditional Italian culinary techniques, emphasizing
            the importance of timing and temperature to achieve a silky, luscious
            sauce. Whether you're a seasoned cook or a passionate home chef, mastering
            carbonara is a rewarding experience that showcases the beauty of Italian
            cuisine.
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
              Prepare the Guanciale
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut the guanciale into small strips or cubes. Heat a skillet over medium
              heat and add the guanciale with a tablespoon of olive oil. Cook until
              crispy and golden, rendering the fat. Remove from heat and set aside,
              leaving the fat in the pan.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cook the Spaghetti
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring a large pot of salted water to a boil. Add the spaghetti and cook
              until al dente according to package instructions. Reserve about a cup
              of pasta water before draining.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Egg and Cheese Mixture
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, whisk together the egg yolks, whole egg, and finely grated
              Pecorino Romano cheese until smooth. Add a generous amount of freshly
              ground black pepper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Combine Pasta and Guanciale
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the drained spaghetti to the skillet with the guanciale fat (off
              heat). Toss to coat the pasta evenly with the rendered fat.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Egg Mixture and Finish the Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Quickly pour the egg and cheese mixture over the pasta, tossing
              vigorously to create a creamy sauce. Add reserved pasta water a little
              at a time as needed to loosen the sauce and achieve a silky texture.
              Avoid direct heat to prevent scrambling.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve Immediately
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Plate the carbonara immediately, topping with extra Pecorino Romano and
              freshly ground black pepper to taste. Enjoy while warm and creamy.
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
            Use guanciale if possible for authentic flavor; pancetta is a good
            substitute but less fatty.
          </li>
          <li>
            Always reserve some pasta water to adjust the sauce consistency and help
            emulsify the eggs and cheese.
          </li>
          <li>
            Work off the heat when adding the egg mixture to avoid scrambling the
            eggs.
          </li>
          <li>
            Finely grate Pecorino Romano cheese for better melting and flavor
            distribution.
          </li>
          <li>
            Freshly cracked black pepper is essential — add it generously for the
            best taste.
          </li>
          <li>
            Serve carbonara immediately; it does not reheat well due to the egg-based
            sauce.
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