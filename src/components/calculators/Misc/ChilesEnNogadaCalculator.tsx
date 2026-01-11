import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ChilesEnNogadaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Chiles%20en%20Nogada%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=617"
  );

  // --- DATA ---
  const title = "Chiles en Nogada";
  const description = "Poblano recheado com carne/frutas, coberto com molho de noz e romã.";

  // INGREDIENTS
  const ingredients = [
    { name: "Poblano Chiles (roasted and peeled)", baseAmount: 8, unit: "units" },
    { name: "Ground Beef", baseAmount: 300, unit: "g" },
    { name: "Ground Pork", baseAmount: 200, unit: "g" },
    { name: "Onion (finely chopped)", baseAmount: 1, unit: "medium" },
    { name: "Garlic Cloves (minced)", baseAmount: 2, unit: "cloves" },
    { name: "Tomato (finely chopped)", baseAmount: 2, unit: "medium" },
    { name: "Peach (peeled and diced)", baseAmount: 1, unit: "medium" },
    { name: "Apple (peeled and diced)", baseAmount: 1, unit: "medium" },
    { name: "Pear (peeled and diced)", baseAmount: 1, unit: "medium" },
    { name: "Almonds (chopped)", baseAmount: 50, unit: "g" },
    { name: "Raisins", baseAmount: 30, unit: "g" },
    { name: "Cinnamon Stick", baseAmount: 1, unit: "stick" },
    { name: "Cloves", baseAmount: 3, unit: "units" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Fresh Parsley (for garnish)", baseAmount: 10, unit: "g" },
    { name: "Pomegranate Seeds (for garnish)", baseAmount: 50, unit: "g" },
    { name: "Walnuts (for nogada sauce)", baseAmount: 150, unit: "g" },
    { name: "Milk (for nogada sauce)", baseAmount: 200, unit: "ml" },
    { name: "Fresh Cheese (queso fresco)", baseAmount: 100, unit: "g" },
    { name: "Sugar (for nogada sauce)", baseAmount: 1, unit: "tbsp" },
    { name: "Sherry or Brandy (optional, for nogada sauce)", baseAmount: 2, unit: "tbsp" },
  ];

  // Nutrition estimates per serving (approximate)
  const nutrition = {
    calories: "520",
    protein: "28g",
    carbs: "35g",
    fat: "28g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the origin of Chiles en Nogada?",
      answer:
        "Chiles en Nogada is a traditional Mexican dish originating from the state of Puebla. It was created in the early 19th century to celebrate Mexico's independence, featuring the colors of the Mexican flag with green poblano chiles, white walnut sauce, and red pomegranate seeds.",
    },
    {
      question: "Can I prepare the nogada sauce in advance?",
      answer:
        "Yes, the nogada sauce can be prepared a day ahead and refrigerated. Before serving, bring it to room temperature and stir well. This allows the flavors to meld and makes the cooking process smoother on the day you assemble the dish.",
    },
    {
      question: "How do I roast and peel the poblano chiles properly?",
      answer:
        "To roast poblanos, char them over an open flame or under a broiler until the skin is blistered and blackened. Place them in a sealed plastic bag or covered bowl to steam for about 10 minutes, which loosens the skin. Then gently peel off the skin using your fingers or a paper towel, taking care not to tear the chile.",
    },
    {
      question: "Can I substitute ingredients in the filling?",
      answer:
        "Absolutely. While the traditional filling includes a mix of ground beef, pork, fruits, and nuts, you can adapt it to your preference. For example, you can use turkey or chicken instead of pork, or omit certain fruits if unavailable, but the balance of sweet and savory is key to the authentic flavor.",
    },
    {
      question: "How should I store leftovers?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 2 days. Keep the chiles and nogada sauce separate to maintain texture and flavor. Reheat gently on the stove or microwave before serving, and add fresh pomegranate seeds and parsley as garnish.",
    },
    {
      question: "Is Chiles en Nogada suitable for vegetarians?",
      answer:
        "Traditionally, the filling contains meat, but you can make a vegetarian version by substituting the meat with mushrooms, tofu, or textured vegetable protein, and keeping the fruits and nuts. The nogada sauce remains the same, providing a rich and creamy complement.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Chiles en Nogada"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 40m | Cook: 30m
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
            Chiles en Nogada is a quintessential Mexican dish that beautifully
            combines savory and sweet flavors in a colorful presentation. It
            features roasted poblano chiles stuffed with a rich picadillo made
            from ground meats, fruits, and nuts, all topped with a creamy walnut
            sauce (nogada) and garnished with fresh pomegranate seeds and parsley.
            This dish is traditionally served during the Mexican Independence
            celebrations in late summer and early fall, showcasing the vibrant
            colors of the Mexican flag.
          </p>
          <p>
            The origins of Chiles en Nogada date back to the early 19th century in
            Puebla, Mexico. It is said to have been created by nuns in the Santa
            Monica convent to honor Agustín de Iturbide, a key figure in Mexico's
            independence. The dish's ingredients and colors symbolize patriotism,
            making it a beloved culinary icon that reflects Mexico's rich history
            and cultural heritage.
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
              Roast and Prepare the Poblanos
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Char the poblano chiles over an open flame or under a broiler until
              the skin is blistered and blackened. Place them in a sealed plastic
              bag or covered bowl to steam for 10 minutes. Carefully peel off the
              skin, keeping the chiles intact. Make a slit lengthwise on each chile
              and remove the seeds and veins.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Picadillo Filling
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large skillet, sauté finely chopped onion and garlic until
              translucent. Add ground beef and pork, cooking until browned. Stir in
              chopped tomatoes, diced peach, apple, and pear, along with chopped
              almonds, raisins, cinnamon stick, and cloves. Season with salt and
              pepper. Simmer gently until the mixture is thick and fragrant. Remove
              cinnamon and cloves before stuffing.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Stuff the Chiles
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Carefully fill each poblano chile with the picadillo mixture. Be
              generous but avoid overstuffing to prevent tearing. Set aside on a
              serving platter.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Nogada Sauce
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Soak the walnuts in milk for at least 2 hours or overnight to soften.
              Blend the soaked walnuts with fresh cheese, milk, sugar, and optional
              sherry or brandy until smooth and creamy. Adjust consistency with
              milk if needed. Chill the sauce before serving.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble and Garnish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour the chilled nogada sauce generously over the stuffed chiles.
              Garnish with fresh pomegranate seeds and chopped parsley to add
              color and freshness. Serve immediately at room temperature.
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
            Roast the poblanos evenly and peel them gently to keep their shape
            intact for a beautiful presentation.
          </li>
          <li>
            Soaking the walnuts overnight softens them and mellows their flavor,
            resulting in a smoother nogada sauce.
          </li>
          <li>
            Balance the sweetness and savoriness in the picadillo by adjusting the
            amount of fruits and seasoning to your taste.
          </li>
          <li>
            Use fresh pomegranate seeds and parsley just before serving to maintain
            their vibrant color and crunch.
          </li>
          <li>
            If you prefer a lighter sauce, substitute part of the milk with cream
            or use less cheese.
          </li>
          <li>
            This dish is best served at room temperature to fully enjoy the complex
            flavors.
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
              href="https://en.wikipedia.org/wiki/Chiles_en_nogada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Chiles en Nogada
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.saveur.com/article/Recipes/Chiles-en-Nogada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Saveur: Traditional Chiles en Nogada Recipe
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.mexicoinmykitchen.com/chiles-en-nogada/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Mexico In My Kitchen: Chiles en Nogada History & Recipe
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