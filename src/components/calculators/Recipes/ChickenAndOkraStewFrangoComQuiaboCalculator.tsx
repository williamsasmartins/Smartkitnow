import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChickenAndOkraStewFrangoComQuiaboCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Chicken%20and%20Okra%20Stew%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2584"
  );

  // --- DATA ---
  const title = "Brazilian Chicken and Okra Stew";
  const description = "A rustic Minas Gerais classic chicken stew with sautéed okra.";

  // INGREDIENTS
  const ingredients = [
    { name: "Chicken thighs (bone-in, skin-on)", baseAmount: 600, unit: "g" },
    { name: "Fresh okra, sliced", baseAmount: 300, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic cloves, minced", baseAmount: 4, unit: "cloves" },
    { name: "Tomatoes, diced", baseAmount: 3, unit: "medium" },
    { name: "Green bell pepper, chopped", baseAmount: 1, unit: "medium" },
    { name: "Fresh parsley, chopped", baseAmount: 15, unit: "g" },
    { name: "Olive oil", baseAmount: 3, unit: "tbsp" },
    { name: "Water or chicken broth", baseAmount: 250, unit: "ml" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black pepper", baseAmount: 1, unit: "tsp" },
    { name: "Smoked paprika", baseAmount: 1, unit: "tsp" },
    { name: "Bay leaf", baseAmount: 1, unit: "leaf" },
    { name: "Lime wedges (for serving)", baseAmount: 1, unit: "lime" },
  ];

  // Nutrition estimates per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "38g",
    carbs: "10g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of chicken is best for Frango com Quiabo?",
      answer:
        "Chicken thighs with bone and skin are preferred for this stew because they remain juicy and tender during cooking, imparting rich flavor to the dish. However, you can also use drumsticks or a whole cut-up chicken if preferred.",
    },
    {
      question: "How do I prevent okra from becoming slimy?",
      answer:
        "To reduce okra's natural sliminess, sauté it separately in a hot pan with a bit of oil until lightly browned before adding it to the stew. Avoid over-stirring once added, and cook it just until tender to maintain texture.",
    },
    {
      question: "Can I make this stew in advance?",
      answer:
        "Yes, Frango com Quiabo tastes even better the next day as the flavors meld. Store it in an airtight container in the refrigerator for up to 2 days. Reheat gently on the stove, adding a splash of water or broth if it thickens too much.",
    },
    {
      question: "What can I serve with Brazilian Chicken and Okra Stew?",
      answer:
        "This hearty stew pairs wonderfully with white rice, farofa (toasted cassava flour), or a simple green salad. Lime wedges served alongside add a fresh citrus brightness that complements the rich flavors.",
    },
    {
      question: "Is this dish spicy?",
      answer:
        "Traditionally, Frango com Quiabo is mildly spiced, focusing on savory and smoky flavors rather than heat. You can add fresh chili peppers or a pinch of cayenne if you prefer a spicier stew.",
    },
    {
      question: "Can I substitute fresh okra with frozen?",
      answer:
      "While fresh okra is ideal for texture and flavor, frozen okra can be used in a pinch. Thaw and pat dry the frozen okra before cooking to minimize excess moisture and sliminess.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Chicken and Okra Stew"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 40m
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
                    {typeof ing.baseAmount === "number"
                      ? getAmount(ing.baseAmount)
                      : ing.baseAmount}{" "}
                    {ing.unit}
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
            Frango com Quiabo, or Brazilian Chicken and Okra Stew, is a beloved
            dish from the Minas Gerais region of Brazil. This rustic stew
            combines tender chicken thighs with fresh okra, simmered in a
            fragrant tomato and bell pepper sauce enriched with garlic and
            smoked paprika. The result is a comforting, hearty meal that
            showcases the vibrant flavors of Brazilian home cooking.
          </p>
          <p>
            The dish reflects the culinary heritage of Minas Gerais, where
            indigenous ingredients like okra were blended with Portuguese and
            African influences brought by settlers and enslaved peoples. Today,
            Frango com Quiabo remains a staple in Brazilian households,
            celebrated for its simplicity, depth of flavor, and satisfying
            textures.
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
              Prepare the Chicken
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pat the chicken thighs dry and season them generously with salt,
              black pepper, and smoked paprika. Heat 2 tablespoons of olive oil
              in a large heavy-bottomed pot or Dutch oven over medium-high
              heat. Brown the chicken on all sides until golden, about 5-7
              minutes per side. Remove and set aside.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sauté the Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In the same pot, add the remaining 1 tablespoon of olive oil. Add
              the chopped onion, garlic, and green bell pepper. Cook over
              medium heat until softened and fragrant, about 5 minutes. Stir in
              the diced tomatoes and bay leaf, cooking for another 5 minutes to
              develop the sauce.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Chicken and Simmer
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Return the browned chicken to the pot, nestling it into the sauce.
              Pour in the water or chicken broth. Bring to a gentle simmer,
              cover partially, and cook for 25 minutes, or until the chicken is
              cooked through and tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare and Add Okra
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              While the chicken simmers, heat a skillet over medium-high heat
              and add a small amount of oil. Sauté the sliced okra until lightly
              browned and slightly crisp, about 5 minutes. Add the okra to the
              stew, stir gently, and cook uncovered for another 5-7 minutes to
              meld flavors and finish cooking the okra.
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
              Remove the bay leaf. Stir in the chopped fresh parsley and adjust
              seasoning with salt and pepper as needed. Serve hot with steamed
              white rice and lime wedges on the side for squeezing over the
              stew.
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
            For best flavor, brown the chicken well to develop a rich crust
            before simmering.
          </li>
          <li>
            Sauté okra separately to reduce sliminess and add a pleasant
            texture contrast.
          </li>
          <li>
            Use bone-in chicken for deeper flavor and moist meat.
          </li>
          <li>
            Adjust the thickness of the stew by adding more broth or simmering
            uncovered to reduce.
          </li>
          <li>
            Fresh lime juice brightens the dish and balances the richness.
          </li>
          <li>
            Serve with traditional Brazilian sides like farofa or white rice for
            an authentic experience.
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
              href="https://www.tasteatlas.com/frango-com-quiabo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              TasteAtlas: Frango com Quiabo
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.brazil.org.za/brazilian-cuisine.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Brazil.org.za: Brazilian Cuisine Overview
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