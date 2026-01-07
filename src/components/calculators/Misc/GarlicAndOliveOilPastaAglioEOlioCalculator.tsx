import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GarlicAndOliveOilPastaAglioEOlioCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Garlic%20and%20Olive%20Oil%20Pasta%20Aglio%20e%20Olio%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4088"
  );

  // --- DATA ---
  const title = "Garlic and Olive Oil Pasta (Aglio e Olio)";
  const description = "Classic midnight pasta with garlic, olive oil, chili flakes, and parsley.";

  // INGREDIENTS
  const ingredients = [
    { name: "Spaghetti", baseAmount: 400, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 120, unit: "ml" },
    { name: "Garlic Cloves (thinly sliced)", baseAmount: 6, unit: "pcs" },
    { name: "Red Chili Flakes", baseAmount: 1, unit: "tsp" },
    { name: "Fresh Flat-leaf Parsley (chopped)", baseAmount: 15, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tbsp" },
    { name: "Black Pepper (freshly ground)", baseAmount: 0.5, unit: "tsp" },
    { name: "Pecorino Romano or Parmesan Cheese (optional)", baseAmount: 50, unit: "g" },
    { name: "Water (for boiling pasta)", baseAmount: 4, unit: "L" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "520",
    protein: "15g",
    carbs: "70g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) => (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of pasta is best for Aglio e Olio?",
      answer:
        "Traditionally, long, thin pasta like spaghetti or linguine is used for Aglio e Olio. These shapes allow the garlic and olive oil sauce to coat the strands evenly, delivering the classic texture and flavor balance.",
    },
    {
      question: "Can I adjust the spiciness of the dish?",
      answer:
        "Absolutely! The heat level depends on the amount of red chili flakes you add. For a milder version, reduce or omit the chili flakes. For extra heat, increase them or add fresh chili peppers. Always adjust according to your taste preferences.",
    },
    {
      question: "How do I prevent garlic from burning?",
      answer:
        "To avoid burnt garlic, cook it gently over low to medium heat in olive oil until it turns golden and fragrant. Burnt garlic tastes bitter and can ruin the dish. Stir frequently and remove from heat once golden.",
    },
    {
      question: "Is it necessary to add cheese to Aglio e Olio?",
      answer:
        "Cheese is optional in this recipe. Traditional Aglio e Olio is often served without cheese, but many enjoy adding Pecorino Romano or Parmesan for a richer flavor. If you add cheese, sprinkle it just before serving.",
    },
    {
      question: "Can I make this recipe vegan?",
      answer:
        "Yes! The base recipe is naturally vegan if you omit the cheese. Use good quality extra virgin olive oil and fresh ingredients to keep the flavors vibrant and satisfying.",
    },
    {
      question: "How do I store leftovers?",
      answer:
        "Store any leftovers in an airtight container in the refrigerator for up to 2 days. Reheat gently in a pan with a splash of olive oil to restore moisture and flavor. Avoid microwaving directly to prevent drying out.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Garlic and Olive Oil Pasta (Aglio e Olio)"
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
            Garlic and Olive Oil Pasta, or Aglio e Olio, is a quintessential Italian dish that embodies simplicity and bold flavors. Originating from Naples, this recipe is beloved for its minimal ingredients and quick preparation, making it a perfect choice for a satisfying meal at any time.
          </p>
          <p>
            The magic lies in the quality of the ingredients and the technique: gently infusing olive oil with garlic and chili flakes to create a fragrant sauce that perfectly coats al dente spaghetti. This dish is a testament to how a few pantry staples can come together to create something truly delicious.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Boil the Pasta</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Bring a large pot of salted water to a rolling boil. Add the spaghetti and cook until al dente, usually about 8-9 minutes. Reserve about 1 cup of pasta water before draining.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Infuse the Olive Oil</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large skillet, heat the olive oil over medium-low heat. Add the thinly sliced garlic and red chili flakes. Cook gently, stirring frequently, until the garlic is golden and fragrant but not burnt, about 3-4 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine Pasta and Sauce</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the drained pasta to the skillet with the garlic oil. Toss well to coat evenly. If the pasta seems dry, add reserved pasta water a little at a time until you reach the desired consistency.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Parsley and Season</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the chopped fresh parsley and season with salt and freshly ground black pepper to taste. Toss again to combine all flavors.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve Immediately</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Plate the pasta and, if desired, sprinkle with grated Pecorino Romano or Parmesan cheese. Serve hot and enjoy this simple yet flavorful classic Italian dish.
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
            Use fresh, high-quality extra virgin olive oil for the best flavor and aroma in your sauce.
          </li>
          <li>
            Slice garlic thinly and cook it slowly over low heat to infuse the oil without burning it.
          </li>
          <li>
            Reserve some pasta water before draining; its starchiness helps emulsify the sauce and bind it to the pasta.
          </li>
          <li>
            Add fresh parsley at the end to preserve its bright color and fresh flavor.
          </li>
          <li>
            For a smoky twist, lightly toast the chili flakes in the oil before adding garlic.
          </li>
          <li>
            Serve immediately after cooking to enjoy the pasta at its best texture and flavor.
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