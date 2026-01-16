import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SnacksBolinhoBacalhauCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Cod%20Fritters%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=192"
  );

  // --- DATA ---
  const title = "Cod Fritters";
  const description = "Bite-sized salted cod delights, perfect with a cold beer.";

  // INGREDIENTS
  const ingredients = [
    { name: "Salted cod (desalted and shredded)", baseAmount: 500, unit: "g" },
    { name: "Potatoes (boiled and mashed)", baseAmount: 300, unit: "g" },
    { name: "Onion (finely chopped)", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves (minced)", baseAmount: 2, unit: "cloves" },
    { name: "Fresh parsley (chopped)", baseAmount: 15, unit: "g" },
    { name: "Eggs", baseAmount: 2, unit: "units" },
    { name: "All-purpose flour", baseAmount: 100, unit: "g" },
    { name: "Baking powder", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Salt", baseAmount: 0.5, unit: "tsp" },
    { name: "Vegetable oil (for frying)", baseAmount: 500, unit: "ml" },
    { name: "Lemon wedges (for serving)", baseAmount: 1, unit: "unit" },
  ];

  // Approximate nutrition per 4 servings
  const nutrition = {
    calories: "450",
    protein: "35g",
    carbs: "40g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the best way to desalt the cod for fritters?",
      answer:
        "To properly desalt salted cod, soak it in cold water for 24 to 48 hours, changing the water every 6 to 8 hours. This gradual process ensures the salt is removed evenly without compromising the fish's texture or flavor.",
    },
    {
      question: "Can I use fresh cod instead of salted cod?",
      answer:
        "Fresh cod lacks the characteristic saltiness and texture of salted cod, which is essential for authentic cod fritters. If using fresh cod, you may need to season it generously and adjust the recipe, but the traditional flavor will differ.",
    },
    {
      question: "How do I prevent the fritters from falling apart while frying?",
      answer:
        "Ensure the mixture is well combined and not too wet. Using mashed potatoes helps bind the ingredients. Also, refrigerate the batter for at least 30 minutes before frying to firm it up, and fry in hot oil to quickly set the fritters' shape.",
    },
    {
      question: "What oil is best for frying cod fritters?",
      answer:
        "Use a neutral oil with a high smoke point such as vegetable oil, canola oil, or sunflower oil. These oils allow for even frying without imparting unwanted flavors or burning quickly.",
    },
    {
      question: "Can I prepare the cod fritters in advance?",
      answer:
        "Yes, you can prepare the mixture a few hours ahead and keep it refrigerated. For best texture, fry them fresh just before serving. Alternatively, you can fry and then reheat in a hot oven to maintain crispiness.",
    },
    {
      question: "What are some traditional accompaniments for cod fritters?",
      answer:
        "Cod fritters are often served with lemon wedges, a fresh green salad, or a garlicky aioli. They pair excellently with cold beers or white wines, making them perfect as appetizers or snacks.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Cod Fritters"
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
            Cod fritters, or "Bolinho de Bacalhau," are a beloved Portuguese snack
            featuring salted cod mixed with mashed potatoes, herbs, and spices,
            then deep-fried to golden perfection. These bite-sized delights are
            crispy on the outside and tender inside, making them a perfect appetizer
            or accompaniment to a cold beer.
          </p>
          <p>
            Originating from Portugal, cod fritters have a rich history tied to the
            country's seafaring traditions and the preservation of salted cod as a
            staple food. Over centuries, this humble dish has become a culinary
            icon, celebrated in Portuguese communities worldwide for its comforting
            flavors and cultural significance.
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
              Prepare the Cod
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Soak the salted cod in cold water for 24 to 48 hours, changing the
              water every 6 to 8 hours to remove excess salt. Once desalted, drain
              and shred the cod into small flakes, removing any bones or skin.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Make the Batter
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the shredded cod, mashed potatoes, finely
              chopped onion, minced garlic, and chopped parsley. Add the eggs,
              flour, baking powder, salt, and black pepper. Mix thoroughly until a
              sticky, cohesive batter forms.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Chill the Mixture
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cover the batter and refrigerate for at least 30 minutes. This helps
              the mixture firm up, making it easier to shape and fry.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Fry the Fritters
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a deep pan or fryer to 180°C (350°F). Using
              wet hands or a spoon, shape the batter into small oval or round
              fritters. Fry in batches until golden brown and crispy, about 3-4
              minutes per side. Drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the cod fritters hot with lemon wedges on the side. They pair
              wonderfully with a fresh salad, aioli, or your favorite dipping
              sauce.
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
            Use cold water to soak the cod and change it frequently to ensure
            proper desalting without losing texture.
          </li>
          <li>
            Adding mashed potatoes not only binds the mixture but also gives the
            fritters a creamy interior.
          </li>
          <li>
            Fry the fritters in small batches to maintain oil temperature and
            ensure even cooking.
          </li>
          <li>
            For extra flavor, add a pinch of nutmeg or smoked paprika to the batter.
          </li>
          <li>
            Leftover fritters can be reheated in a hot oven to restore their
            crispiness without becoming greasy.
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
              href="https://en.wikipedia.org/wiki/Bolinhos_de_bacalhau"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Bolinhos de Bacalhau
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Portuguese-Cod-Fritters-Bolinhos-de-Bacalhau/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Portuguese Cod Fritters Recipe
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