import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ArugulaAndParmesanSaladCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Arugula%20and%20Parmesan%20Salad%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=7802"
  );

  // --- DATA ---
  const title = "Arugula and Parmesan Salad";
  const description = "Peppery arugula tossed with shaved Parmesan and lemon-olive oil dressing.";

  // INGREDIENTS
  const ingredients = [
    { name: "Fresh Arugula", baseAmount: 120, unit: "g" },
    { name: "Parmesan Cheese (shaved)", baseAmount: 50, unit: "g" },
    { name: "Extra Virgin Olive Oil", baseAmount: 3, unit: "tbsp" },
    { name: "Fresh Lemon Juice", baseAmount: 1.5, unit: "tbsp" },
    { name: "Garlic (minced)", baseAmount: 1, unit: "clove" },
    { name: "Salt", baseAmount: 0.5, unit: "tsp" },
    { name: "Freshly Ground Black Pepper", baseAmount: 0.25, unit: "tsp" },
    { name: "Cherry Tomatoes (halved)", baseAmount: 100, unit: "g" },
    { name: "Toasted Pine Nuts", baseAmount: 30, unit: "g" },
    { name: "Red Onion (thinly sliced)", baseAmount: 30, unit: "g" },
    { name: "Capers (optional)", baseAmount: 10, unit: "g" },
    { name: "Fresh Basil Leaves (for garnish)", baseAmount: 5, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "180",
    protein: "6g",
    carbs: "5g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) => (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I substitute arugula with other greens?",
      answer:
        "Yes, you can substitute arugula with other peppery greens like watercress or baby spinach for a milder flavor. However, arugula's distinctive peppery taste is key to this salad's character.",
    },
    {
      question: "How do I store leftovers to keep the salad fresh?",
      answer:
        "It's best to store leftover salad components separately. Keep the arugula and dressing apart to prevent wilting. Store the salad in an airtight container in the refrigerator and consume within 1-2 days for optimal freshness.",
    },
    {
      question: "Can I make the dressing ahead of time?",
      answer:
        "Absolutely! The lemon-olive oil dressing can be prepared up to 2 days in advance and stored in the refrigerator. Bring it to room temperature and whisk before tossing with the salad to ensure the best flavor and texture.",
    },
    {
      question: "What are some good additions to enhance this salad?",
      answer:
        "You can add grilled chicken, roasted beets, or avocado slices to make the salad more substantial. Toasted nuts like walnuts or almonds also add a delightful crunch and complement the flavors well.",
    },
    {
      question: "Is this salad suitable for vegans?",
      answer:
        "The salad as is contains Parmesan cheese, which is not vegan. To make it vegan, omit the Parmesan or substitute it with a plant-based cheese alternative or nutritional yeast for a cheesy flavor.",
    },
    {
      question: "How do I toast pine nuts properly?",
      answer:
        "Toast pine nuts in a dry skillet over medium heat, stirring frequently, until they turn golden brown and fragrant, about 3-5 minutes. Be careful as they can burn quickly. Remove from heat immediately and let cool before adding to the salad.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Arugula and Parmesan Salad"
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
            This Arugula and Parmesan Salad is a refreshing and vibrant dish that perfectly balances peppery greens with the nutty richness of Parmesan cheese. The bright lemon-olive oil dressing adds a zesty touch, making it an ideal starter or side for any meal. Its simplicity and elegance make it a favorite in both home kitchens and upscale restaurants.
          </p>
          <p>
            The salad combines fresh, crisp arugula leaves with shaved Parmesan, toasted pine nuts, and bursts of sweetness from cherry tomatoes. Thinly sliced red onions and a hint of garlic in the dressing elevate the flavor profile, while optional capers add a briny contrast. This recipe is quick to prepare, healthy, and versatile enough to customize with your favorite ingredients.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Dressing</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small bowl, whisk together the extra virgin olive oil, fresh lemon juice, minced garlic, salt, and freshly ground black pepper until well combined. Set aside to allow the flavors to meld.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Toast the Pine Nuts</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat a dry skillet over medium heat. Add the pine nuts and toast, stirring frequently, until golden brown and fragrant, about 3-5 minutes. Remove from heat and let cool.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Assemble the Salad</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large salad bowl, combine the fresh arugula, halved cherry tomatoes, thinly sliced red onion, and optional capers. Drizzle the dressing over the salad and toss gently to coat all ingredients evenly.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Parmesan and Pine Nuts</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Sprinkle the shaved Parmesan cheese and toasted pine nuts over the top of the salad. Garnish with fresh basil leaves for an aromatic finish.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve Immediately</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve the salad immediately to enjoy the fresh textures and vibrant flavors. This salad pairs wonderfully with grilled meats or as a light standalone dish.
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
            Use freshly grated or shaved Parmesan for the best texture and flavor. Avoid pre-grated cheese as it often contains anti-caking agents that affect melting and taste.
          </li>
          <li>
            When washing arugula, dry it thoroughly using a salad spinner to prevent the dressing from becoming watery and diluting the flavors.
          </li>
          <li>
            Adjust the lemon juice and olive oil ratio to your taste preference; some like it more tangy, others prefer a richer olive oil presence.
          </li>
          <li>
            For added depth, consider adding a teaspoon of honey or Dijon mustard to the dressing for a subtle sweetness and complexity.
          </li>
          <li>
            Toast nuts gently and watch carefully to avoid burning, which can impart a bitter taste to the salad.
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