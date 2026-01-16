import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BrazilianFishStewMoquecaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Fish%20Stew%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=4883"
  );

  // --- DATA ---
  const title = "Brazilian Fish Stew";
  const description = "Traditional coastal fish stew with coconut milk and dende oil.";

  // INGREDIENTS
  const ingredients = [
    { name: "Firm white fish fillets (e.g., cod, snapper)", baseAmount: 500, unit: "g" },
    { name: "Lime juice", baseAmount: 2, unit: "tbsp" },
    { name: "Sea salt", baseAmount: 1, unit: "tsp" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "pcs" },
    { name: "Onion, thinly sliced", baseAmount: 1, unit: "medium" },
    { name: "Red bell pepper, sliced", baseAmount: 1, unit: "medium" },
    { name: "Yellow bell pepper, sliced", baseAmount: 1, unit: "medium" },
    { name: "Tomatoes, chopped", baseAmount: 3, unit: "medium" },
    { name: "Cilantro, chopped", baseAmount: 1, unit: "cup" },
    { name: "Coconut milk", baseAmount: 400, unit: "ml" },
    { name: "Dendê oil (red palm oil)", baseAmount: 2, unit: "tbsp" },
    { name: "Vegetable oil", baseAmount: 2, unit: "tbsp" },
    { name: "Green onions, chopped", baseAmount: 2, unit: "pcs" },
    { name: "Fresh chili (optional), sliced", baseAmount: 1, unit: "pcs" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "38g",
    carbs: "12g",
    fat: "24g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What type of fish is best for Moqueca?",
      answer:
        "Firm white fish like cod, snapper, or sea bass work best because they hold their shape during cooking and absorb the flavors well. Avoid flaky fish that may disintegrate in the stew.",
    },
    {
      question: "Can I make Moqueca without dendê oil?",
      answer:
        "Yes, dendê oil is traditional and imparts a unique flavor and color, but if unavailable, you can substitute with a mix of olive oil and a small amount of paprika for color. The flavor will be less authentic but still delicious.",
    },
    {
      question: "Is Moqueca spicy?",
      answer:
        "Moqueca can be mildly spicy depending on the amount of fresh chili used. You can adjust the heat by adding or omitting chili peppers according to your preference.",
    },
    {
      question: "How long does Moqueca keep in the refrigerator?",
      answer:
        "Store Moqueca in an airtight container in the refrigerator for up to 2 days. Reheat gently on the stove to avoid overcooking the fish.",
    },
    {
      question: "What should I serve with Brazilian Fish Stew?",
      answer:
        "Traditionally, Moqueca is served with white rice and farofa (toasted cassava flour). You can also serve it with crusty bread to soak up the flavorful broth.",
    },
    {
      question: "Can I use frozen fish for this recipe?",
      answer:
        "Yes, frozen fish can be used but make sure to thaw it completely and pat dry before marinating to avoid excess water diluting the stew.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Fish Stew"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 30m
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
            Moqueca, the iconic Brazilian fish stew, is a vibrant and aromatic dish
            that beautifully showcases the flavors of Brazil's coastal regions. This
            recipe combines fresh fish with coconut milk, dendê oil (red palm oil),
            and a medley of colorful vegetables and herbs, creating a rich and
            comforting stew that is both hearty and fragrant.
          </p>
          <p>
            Originating primarily from the states of Bahia and Espírito Santo, Moqueca
            reflects the cultural fusion of indigenous Brazilian, African, and Portuguese
            culinary traditions. The use of dendê oil and coconut milk is a hallmark of
            Bahian cuisine, lending the stew its distinctive taste and golden hue.
            Traditionally served with rice and farofa, Moqueca is a beloved dish that
            brings warmth and celebration to the table.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Fish</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cut the fish fillets into large chunks. Marinate with lime juice and sea salt,
              then set aside for 15 minutes to enhance flavor and firm up the fish.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté Aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a large pan over medium heat. Add minced garlic and sliced onions,
              cooking until softened and fragrant, about 5 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Peppers and Tomatoes</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in the sliced red and yellow bell peppers and chopped tomatoes. Cook for 5-7 minutes
              until vegetables soften and release their juices.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Liquids and Simmer</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour in the coconut milk and dendê oil, stirring gently to combine. Bring to a gentle simmer.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Fish</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Gently place the marinated fish chunks into the simmering stew. Cover and cook for 10-15 minutes,
              until the fish is opaque and cooked through.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Finish and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in chopped cilantro, green onions, and optional fresh chili. Adjust salt to taste.
              Serve hot with white rice and farofa for an authentic experience.
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
            Use fresh, firm white fish for the best texture and flavor. Avoid overcooking to keep the fish tender.
          </li>
          <li>
            Dendê oil is key to authentic flavor and color; try to source it from specialty stores or online.
          </li>
          <li>
            If you prefer a milder stew, omit the fresh chili or use milder peppers.
          </li>
          <li>
            Let the stew rest for a few minutes after cooking to allow flavors to meld beautifully.
          </li>
          <li>
            For a richer broth, you can add a splash of fish stock or clam juice along with the coconut milk.
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
              href="https://en.wikipedia.org/wiki/Moqueca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Moqueca (Brazilian Fish Stew)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Brazilian-Fish-Stew-Moqueca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Brazilian Fish Stew (Moqueca) Recipe
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