import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SnacksAcarajeCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/BlackEyed%20Pea%20Fritters%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=2606"
  );

  // --- DATA ---
  const title = "Black-Eyed Pea Fritters";
  const description = "Deep fried bean dough filled with vatapá and dried shrimp.";

  // INGREDIENTS
  const ingredients = [
    { name: "Black-eyed peas (soaked and peeled)", baseAmount: 500, unit: "g" },
    { name: "Onion (finely chopped)", baseAmount: 100, unit: "g" },
    { name: "Garlic cloves (minced)", baseAmount: 3, unit: "pcs" },
    { name: "Dried shrimp (ground)", baseAmount: 50, unit: "g" },
    { name: "Palm oil (for frying)", baseAmount: 200, unit: "ml" },
    { name: "Vatapá (spicy shrimp paste)", baseAmount: 150, unit: "g" },
    { name: "Scotch bonnet pepper (chopped)", baseAmount: 1, unit: "pcs" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Palm oil (for batter)", baseAmount: 2, unit: "tbsp" },
    { name: "Water (as needed)", baseAmount: 100, unit: "ml" },
    { name: "Vegetable oil (optional, for frying mix)", baseAmount: 50, unit: "ml" },
  ];

  // Nutrition estimates per 4 servings
  const nutrition = {
    calories: "480",
    protein: "25g",
    carbs: "45g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the best way to soak and peel black-eyed peas for fritters?",
      answer:
        "Soak the black-eyed peas overnight or for at least 8 hours in plenty of water. After soaking, rub the peas between your hands or use a food processor briefly to loosen the skins, then rinse repeatedly to remove the skins. This process ensures a smooth batter and better texture for the fritters.",
    },
    {
      question: "Can I substitute dried shrimp in the recipe?",
      answer:
        "Yes, if dried shrimp is unavailable or if you prefer a vegetarian option, you can omit it or substitute with finely chopped mushrooms or smoked paprika for a similar umami flavor. However, the authentic taste of acarajé relies heavily on the dried shrimp and vatapá fillings.",
    },
    {
      question: "What is vatapá and how do I prepare it?",
      answer:
        "Vatapá is a creamy, spicy paste made from bread, shrimp, coconut milk, peanuts, and palm oil. It is traditionally cooked slowly to develop rich flavors. You can prepare it ahead or buy pre-made vatapá in some specialty stores. It is used as a filling inside the fritters to add moisture and flavor.",
    },
    {
      question: "How do I know when the fritters are cooked perfectly?",
      answer:
        "The fritters should be golden brown and crispy on the outside while soft and moist inside. Fry them in hot palm oil at medium heat to ensure they cook through without burning. Typically, 4-6 minutes per batch is sufficient. Avoid overcrowding the pan to maintain oil temperature.",
    },
    {
      question: "Can I make the batter ahead of time?",
      answer:
        "Yes, you can prepare the batter a few hours in advance and refrigerate it. However, it’s best to fry the fritters fresh to maintain their crispiness. If refrigerated, stir the batter well before frying and add a little water if it thickened too much.",
    },
    {
      question: "Is palm oil essential for this recipe?",
      answer:
        "Palm oil is traditional and imparts a distinct flavor and color to acarajé. If unavailable, you can substitute with refined vegetable oil, but the taste and authenticity will be slightly different. Using palm oil for frying is highly recommended for the best results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Black-Eyed Pea Fritters"
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
            Black-Eyed Pea Fritters, also known as Acarajé, are a beloved street food
            originating from the Afro-Brazilian communities in Bahia, Brazil. These deep-fried
            fritters are made from peeled black-eyed peas blended into a smooth batter,
            then fried in traditional red palm oil to achieve a crispy exterior and soft,
            flavorful interior. Filled with vatapá, a spicy shrimp paste, these fritters
            offer a perfect balance of textures and bold flavors.
          </p>
          <p>
            The recipe traces its roots back to West African culinary traditions, brought to
            Brazil by enslaved Africans. Over centuries, it has evolved into a cultural
            symbol and festive delicacy, often enjoyed during religious ceremonies and
            celebrations. The use of palm oil and vatapá highlights the rich fusion of African,
            indigenous, and Portuguese influences in Brazilian cuisine.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Black-Eyed Peas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Soak the black-eyed peas overnight in plenty of water. After soaking, rub the peas
              between your hands or pulse briefly in a food processor to loosen the skins. Rinse
              repeatedly to remove the skins until mostly peeled. Drain well.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Batter</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Blend the peeled black-eyed peas with chopped onion, garlic, scotch bonnet pepper,
              salt, black pepper, and a little water until you get a smooth, thick batter. Stir in
              a tablespoon or two of palm oil to enrich the mixture.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Heat the Palm Oil</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a deep frying pan or pot, heat the palm oil over medium heat until hot but not
              smoking. The oil should be deep enough to allow the fritters to float while frying.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Fry the Fritters</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Using a spoon or your hands, scoop portions of the batter and carefully drop them into
              the hot oil. Fry in batches, turning occasionally, until golden brown and cooked
              through, about 4-6 minutes. Remove and drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Fill and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Slice the fritters open and fill generously with vatapá and ground dried shrimp. Serve
              hot as a snack or appetizer, accompanied by hot sauce or fresh salad if desired.
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
            For best results, use fresh palm oil and maintain medium heat to avoid burning the
            fritters while ensuring they cook through.
          </li>
          <li>
            Peeling the black-eyed peas thoroughly is key to a smooth batter and light texture.
            Take your time during this step.
          </li>
          <li>
            Vatapá can be made ahead and refrigerated; warm it slightly before filling the fritters.
          </li>
          <li>
            Experiment with adding finely chopped herbs like parsley or cilantro to the batter for
            a fresh twist.
          </li>
          <li>
            If you prefer less spicy fritters, reduce or omit the scotch bonnet pepper and serve
            with a mild dipping sauce.
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
              href="https://en.wikipedia.org/wiki/Acaraj%C3%A9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Acarajé
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
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Acaraje-Black-Eyed-Pea-Fritters/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Acarajé Recipe and History
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