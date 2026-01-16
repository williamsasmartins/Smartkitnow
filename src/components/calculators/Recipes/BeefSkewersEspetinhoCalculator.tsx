import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BeefSkewersEspetinhoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Beef%20Skewers%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=3819"
  );

  // --- DATA ---
  const title = "Beef Skewers";
  const description = "Tender grilled beef cubes served on traditional wooden skewers.";

  // INGREDIENTS
  const ingredients = [
    { name: "Beef sirloin, cubed", baseAmount: 500, unit: "g" },
    { name: "Olive oil", baseAmount: 3, unit: "tbsp" },
    { name: "Garlic cloves, minced", baseAmount: 3, unit: "pcs" },
    { name: "Soy sauce", baseAmount: 2, unit: "tbsp" },
    { name: "Lemon juice", baseAmount: 1, unit: "tbsp" },
    { name: "Paprika", baseAmount: 1, unit: "tsp" },
    { name: "Ground black pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Fresh parsley, chopped", baseAmount: 2, unit: "tbsp" },
    { name: "Onion, cut into chunks", baseAmount: 1, unit: "medium" },
    { name: "Red bell pepper, cut into chunks", baseAmount: 1, unit: "medium" },
    { name: "Wooden skewers, soaked", baseAmount: 8, unit: "pcs" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "320",
    protein: "35g",
    carbs: "6g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cut of beef is best for skewers?",
      answer:
        "For beef skewers, tender cuts like sirloin, ribeye, or tenderloin are ideal because they cook quickly and remain juicy. Avoid tougher cuts unless marinated for a long time.",
    },
    {
      question: "How long should I marinate the beef?",
      answer:
        "Marinating the beef for at least 1 hour enhances flavor and tenderness. For best results, marinate for 4 to 6 hours in the refrigerator, but avoid exceeding 24 hours to prevent texture breakdown.",
    },
    {
      question: "Can I use metal skewers instead of wooden ones?",
      answer:
        "Yes, metal skewers are reusable and conduct heat well, which can help cook the meat evenly. If using wooden skewers, soak them in water for at least 30 minutes before grilling to prevent burning.",
    },
    {
      question: "How do I prevent the beef from drying out on the grill?",
      answer:
        "Avoid overcooking by grilling beef skewers over medium-high heat for about 8-10 minutes total, turning frequently. Using a marinade with oil and acidic ingredients also helps retain moisture.",
    },
    {
      question: "What side dishes pair well with beef skewers?",
      answer:
        "Beef skewers pair wonderfully with grilled vegetables, rice pilaf, fresh salads, or traditional Brazilian sides like farofa and vinaigrette salsa.",
    },
    {
      question: "Can I prepare beef skewers indoors?",
      answer:
        "Absolutely! You can cook beef skewers on a grill pan or broiler indoors. Just ensure the pan is hot and cook the skewers turning often to get a nice sear and even cooking.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Beef Skewers"
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
            Beef skewers, or espetinhos as they are known in Brazil, are a beloved
            dish featuring tender cubes of beef grilled to perfection on wooden
            skewers. This recipe highlights a simple yet flavorful marinade that
            enhances the natural richness of the beef, making it a perfect choice
            for casual gatherings or festive barbecues.
          </p>
          <p>
            The tradition of skewered meats dates back centuries and spans many
            cultures worldwide. In Brazil, espetinhos are a popular street food,
            often enjoyed with friends and family. This recipe draws inspiration
            from Brazilian churrasco techniques, emphasizing fresh ingredients and
            straightforward preparation to deliver a delicious and authentic taste.
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
              Prepare the Marinade
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, combine olive oil, minced garlic, soy sauce, lemon juice,
              paprika, black pepper, and salt. Whisk together until well blended.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Marinate the Beef
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add the cubed beef to the marinade, tossing to coat evenly. Cover and
              refrigerate for at least 1 hour, preferably 4-6 hours for deeper flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare Skewers and Vegetables
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Soak wooden skewers in water for 30 minutes to prevent burning. Thread
              beef cubes alternately with onion and red bell pepper chunks onto the
              skewers.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Grill the Skewers
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat grill or grill pan to medium-high heat. Grill skewers for 8-10
              minutes, turning every 2-3 minutes until beef is cooked to desired
              doneness and vegetables are tender.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve and Garnish
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove skewers from grill and sprinkle with fresh chopped parsley.
              Serve hot with your favorite sides.
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
            For even cooking, cut beef cubes to uniform size, about 1 to 1.5 inches.
          </li>
          <li>
            Avoid overcrowding the skewers to allow heat to circulate and cook meat
            evenly.
          </li>
          <li>
            Let the grilled skewers rest for 5 minutes before serving to retain
            juices.
          </li>
          <li>
            Experiment with different herbs like rosemary or thyme in the marinade
            for varied flavor profiles.
          </li>
          <li>
            Use a meat thermometer to check doneness: 130°F (54°C) for medium-rare,
            140°F (60°C) for medium.
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
              href="https://en.wikipedia.org/wiki/Skewer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Skewers and Grilling Techniques
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Barbecue"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Barbecue and Grilling
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