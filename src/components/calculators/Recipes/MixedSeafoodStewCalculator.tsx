import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MixedSeafoodStewCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Seafood%20Stew%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6225"
  );

  // --- DATA ---
  const title = "Brazilian Seafood Stew";
  const description = "A comprehensive mix of ocean bounty in a traditional broth.";

  // INGREDIENTS
  const ingredients = [
    { name: "Mixed seafood (shrimp, squid, mussels, clams)", baseAmount: 600, unit: "g" },
    { name: "Fish fillets (firm white fish, e.g., cod or snapper)", baseAmount: 300, unit: "g" },
    { name: "Olive oil", baseAmount: 3, unit: "tbsp" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 4, unit: "cloves" },
    { name: "Red bell pepper, sliced", baseAmount: 1, unit: "medium" },
    { name: "Tomatoes, chopped (fresh or canned)", baseAmount: 400, unit: "g" },
    { name: "Tomato paste", baseAmount: 2, unit: "tbsp" },
    { name: "Fish stock or water", baseAmount: 500, unit: "ml" },
    { name: "Coconut milk", baseAmount: 200, unit: "ml" },
    { name: "Fresh cilantro, chopped", baseAmount: 0.5, unit: "cup" },
    { name: "Fresh parsley, chopped", baseAmount: 0.25, unit: "cup" },
    { name: "Lime juice", baseAmount: 2, unit: "tbsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Chili flakes (optional)", baseAmount: 0.25, unit: "tsp" },
  ];

  // Approximate nutrition per serving (4 servings)
  const nutrition = {
    calories: "380",
    protein: "45g",
    carbs: "12g",
    fat: "12g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What types of seafood work best for Brazilian Seafood Stew?",
      answer:
        "A mix of firm white fish fillets (like cod or snapper), shrimp, squid, mussels, and clams provides a balanced texture and flavor. Fresh seafood is preferred, but frozen can be used if thawed properly.",
    },
    {
      question: "Can I make this stew spicy?",
      answer:
        "Yes! Adding chili flakes or fresh chopped chili peppers during cooking will add heat. Adjust the amount to your taste. The stew traditionally has a mild warmth but can be customized.",
    },
    {
      question: "What can I substitute for fish stock if I don’t have any?",
      answer:
        "You can use vegetable stock or water with a splash of fish sauce or soy sauce to add umami. Homemade seafood broth from shrimp shells or fish bones is ideal if you have time.",
    },
    {
      question: "How do I prevent the seafood from overcooking?",
      answer:
        "Add seafood in stages based on cooking times: start with firm fish fillets, then add shrimp and squid, and finally mussels and clams just before finishing. Cook gently and avoid boiling vigorously.",
    },
    {
      question: "Can I prepare this stew in advance?",
      answer:
        "The broth and base can be made a day ahead and refrigerated. Add seafood fresh when reheating to maintain texture and flavor. Avoid reheating seafood multiple times to prevent toughness.",
    },
    {
      question: "What side dishes pair well with Brazilian Seafood Stew?",
      answer:
        "Traditionally served with white rice, farofa (toasted cassava flour), or crusty bread to soak up the flavorful broth. A fresh green salad or sautéed greens complement the meal nicely.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Seafood Stew"
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
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-base">
          <div>
            <div className="font-bold text-lg">{nutrition.calories}</div>
            <span className="font-bold uppercase text-slate-500">Kcal</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.protein}</div>
            <span className="font-bold uppercase text-slate-500">Prot</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.carbs}</div>
            <span className="font-bold uppercase text-slate-500">Carb</span>
          </div>
          <div>
            <div className="font-bold text-lg">{nutrition.fat}</div>
            <span className="font-bold uppercase text-slate-500">Fat</span>
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
            Brazilian Seafood Stew, known locally as "Moqueca," is a vibrant and aromatic dish
            that celebrates the rich coastal flavors of Brazil. This hearty stew combines a
            medley of fresh seafood simmered gently in a fragrant broth of tomatoes, coconut milk,
            and fresh herbs, delivering a perfect balance of sweetness, acidity, and spice.
          </p>
          <p>
            Originating from the northeastern state of Bahia, Moqueca reflects the fusion of indigenous,
            African, and Portuguese culinary traditions. Traditionally cooked in a clay pot called
            a "panela de barro," this stew has become a beloved staple across Brazil, showcasing
            the country's abundant seafood and tropical ingredients.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the seafood</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Clean and devein the shrimp, rinse the squid and cut into rings, scrub the mussels and clams,
              and cut fish fillets into bite-sized pieces. Pat dry and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Sauté aromatics</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat olive oil in a large pot over medium heat. Add chopped onion, garlic, and red bell pepper.
              Cook until softened and fragrant, about 5 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add tomatoes and simmer</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in chopped tomatoes and tomato paste. Cook for 5 minutes, then add fish stock or water.
              Bring to a gentle simmer.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook fish and seafood</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add fish fillets first and simmer gently for 5 minutes. Then add shrimp and squid,
              cooking for another 3 minutes. Finally, add mussels and clams, cover, and cook until
              they open, about 5 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Finish with coconut milk and herbs</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Stir in coconut milk, chopped cilantro, parsley, lime juice, salt, pepper, and chili flakes if using.
              Heat through gently without boiling. Adjust seasoning to taste.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Serve hot with steamed white rice, farofa, or crusty bread. Garnish with extra fresh herbs and lime wedges.
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
            Use fresh seafood whenever possible for the best flavor and texture. If using frozen,
            thaw completely and pat dry to avoid excess water in the stew.
          </li>
          <li>
            Avoid boiling the stew vigorously once seafood is added to prevent toughening delicate
            proteins.
          </li>
          <li>
            Customize the stew by adding other local ingredients like dendê oil (palm oil) for an
            authentic Bahian flavor.
          </li>
          <li>
            If you prefer a thicker stew, simmer uncovered for a few extra minutes before adding
            coconut milk.
          </li>
          <li>
            Serve with a squeeze of fresh lime juice at the table to brighten the flavors just before eating.
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
              Wikipedia: Moqueca (Brazilian Seafood Stew)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Brazilian-cuisine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Brazilian Cuisine Overview
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