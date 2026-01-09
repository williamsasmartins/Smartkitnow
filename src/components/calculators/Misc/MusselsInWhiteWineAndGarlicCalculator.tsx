import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MusselsInWhiteWineAndGarlicCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Mussels%20in%20White%20Wine%20and%20Garlic%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4023"
  );

  // --- DATA ---
  const title = "Mussels in White Wine and Garlic";
  const description = "Steamed mussels in a fragrant white wine, garlic, and parsley broth.";

  // INGREDIENTS
  const ingredients = [
    { name: "Fresh Mussels (cleaned)", baseAmount: 1000, unit: "g" },
    { name: "Dry White Wine", baseAmount: 250, unit: "ml" },
    { name: "Garlic Cloves (minced)", baseAmount: 4, unit: "cloves" },
    { name: "Shallots (finely chopped)", baseAmount: 2, unit: "pcs" },
    { name: "Fresh Flat-leaf Parsley (chopped)", baseAmount: 30, unit: "g" },
    { name: "Unsalted Butter", baseAmount: 30, unit: "g" },
    { name: "Olive Oil", baseAmount: 15, unit: "ml" },
    { name: "Fresh Lemon Juice", baseAmount: 15, unit: "ml" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Freshly Ground Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Crusty Bread (to serve)", baseAmount: 4, unit: "slices" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "280",
    protein: "30g",
    carbs: "8g",
    fat: "10g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "How do I clean mussels properly before cooking?",
      answer:
        "To clean mussels, scrub the shells under cold running water to remove any dirt or barnacles. Remove the 'beard' by pulling it firmly towards the hinge of the shell. Discard any mussels that are cracked, broken, or remain open after a gentle tap, as these are likely dead and unsafe to eat.",
    },
    {
      question: "Can I use other types of wine besides white wine?",
      answer:
        "Dry white wine is preferred for its light, crisp flavor that complements the mussels without overpowering them. However, you can experiment with other dry wines like rosé or even a light beer. Avoid sweet wines as they can alter the dish's flavor balance.",
    },
    {
      question: "What if some mussels don’t open after cooking?",
      answer:
        "Mussels that remain closed after cooking should be discarded as they may be unsafe to eat. Properly cooked mussels open their shells when steamed. Eating unopened mussels can pose a risk of foodborne illness.",
    },
    {
      question: "Can I prepare this recipe ahead of time?",
      answer:
        "It's best to cook mussels fresh to enjoy their optimal flavor and texture. However, you can prepare the broth base (wine, garlic, shallots, butter) ahead and refrigerate it. When ready, reheat the broth and steam the mussels just before serving.",
    },
    {
      question: "What are some good side dishes to serve with mussels in white wine and garlic?",
      answer:
        "Crusty bread is classic for soaking up the flavorful broth. You can also serve this dish with a light green salad, steamed vegetables, or crispy fries for a more substantial meal.",
    },
    {
      question: "Is it necessary to add butter to the broth?",
      answer:
        "Butter adds richness and a silky texture to the broth, balancing the acidity of the wine and lemon juice. While optional, it enhances the overall flavor and mouthfeel of the dish.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Mussels in White Wine and Garlic"
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
            Mussels in White Wine and Garlic is a classic seafood dish that
            highlights the natural briny sweetness of fresh mussels, enhanced by
            a fragrant broth of dry white wine, garlic, shallots, and fresh
            parsley. This recipe is beloved for its simplicity, elegance, and
            the comforting warmth it brings to the table. Perfect as a starter or
            a light main course, it pairs beautifully with crusty bread to soak
            up the delicious broth.
          </p>
          <p>
            The tradition of cooking mussels in wine dates back centuries in
            coastal European regions, especially in France, Belgium, and Italy.
            This dish reflects the Mediterranean culinary philosophy of using
            fresh, local ingredients to create vibrant flavors with minimal
            fuss. Over time, it has become a staple in bistros and seafood
            restaurants worldwide, celebrated for its quick preparation and
            impressive taste.
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
              Prepare the Mussels
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Rinse the mussels under cold water, scrubbing the shells to remove
              any debris. Remove the beards by pulling firmly towards the hinge.
              Discard any mussels that are cracked, broken, or remain open after
              tapping.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté Aromatics
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large pot or deep skillet, heat olive oil and butter over medium
              heat. Add minced garlic and chopped shallots, sautéing until fragrant
              and translucent, about 2-3 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Wine and Seasonings
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the dry white wine and bring to a simmer. Add salt, pepper,
              and half of the chopped parsley. Let the mixture reduce slightly for
              3-4 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Steam the Mussels
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the cleaned mussels to the pot, cover with a tight-fitting lid,
              and steam over medium-high heat for 5-7 minutes. Shake the pot
              occasionally to ensure even cooking. Mussels are done when they open
              wide.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Finish and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Discard any unopened mussels. Squeeze fresh lemon juice over the
              mussels and sprinkle with the remaining parsley. Serve immediately
              with crusty bread to soak up the flavorful broth.
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
            Always buy fresh mussels from a reputable source and cook them the
            same day for the best flavor and safety.
          </li>
          <li>
            To add a subtle heat, consider adding a pinch of red pepper flakes
            when sautéing the garlic and shallots.
          </li>
          <li>
            Use a good quality dry white wine such as Sauvignon Blanc or Pinot
            Grigio to enhance the broth’s flavor.
          </li>
          <li>
            If you prefer a creamier broth, stir in a splash of heavy cream just
            before serving.
          </li>
          <li>
            Serve with lemon wedges on the side for guests to add extra brightness
            if desired.
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