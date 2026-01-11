import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HuarachesCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Huaraches%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=819"
  );

  // --- DATA ---
  const title = "Huaraches";
  const description = "Massa alongada com feijão e coberturas (carne, queijo, salsa).";

  // INGREDIENTS
  const ingredients = [
    { name: "Masa harina (corn dough)", baseAmount: 400, unit: "g" },
    { name: "Cooked black beans (refried)", baseAmount: 300, unit: "g" },
    { name: "Water", baseAmount: 250, unit: "ml" },
    { name: "Vegetable oil (for frying)", baseAmount: 100, unit: "ml" },
    { name: "Fresh queso fresco", baseAmount: 150, unit: "g" },
    { name: "Chopped white onion", baseAmount: 80, unit: "g" },
    { name: "Fresh cilantro, chopped", baseAmount: 20, unit: "g" },
    { name: "Salsa verde", baseAmount: 150, unit: "ml" },
    { name: "Salsa roja", baseAmount: 150, unit: "ml" },
    { name: "Lime wedges", baseAmount: 4, unit: "pcs" },
    { name: "Radishes, thinly sliced", baseAmount: 100, unit: "g" },
    { name: "Cooked shredded beef or chicken (optional)", baseAmount: 300, unit: "g" },
    { name: "Salt", baseAmount: 5, unit: "g" },
    { name: "Baking powder", baseAmount: 2, unit: "g" },
  ];

  // Nutrition per 4 servings (approximate)
  const nutrition = {
    calories: "680",
    protein: "28g",
    carbs: "80g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What are huaraches and where do they originate from?",
      answer:
        "Huaraches are a traditional Mexican dish consisting of a thick, oval-shaped masa base topped with refried beans and various toppings such as meat, cheese, and salsa. The name 'huarache' comes from the sandal shape of the masa base. They originated in Mexico City and are a popular street food enjoyed throughout Mexico.",
    },
    {
      question: "Can I make huaraches gluten-free?",
      answer:
        "Yes, huaraches are naturally gluten-free as they are made primarily from masa harina, which is corn flour. Just ensure that any additional toppings or sauces you use do not contain gluten ingredients.",
    },
    {
      question: "How do I store leftover huaraches?",
      answer:
        "Leftover huaraches can be stored in an airtight container in the refrigerator for up to 2 days. To reheat, warm them in a skillet over medium heat to maintain their crispness, or use an oven at 180°C (350°F) for about 10 minutes.",
    },
    {
      question: "What toppings are traditional for huaraches?",
      answer:
        "Traditional toppings include refried beans, shredded meat (such as beef or chicken), crumbled queso fresco, chopped onions, cilantro, radishes, and salsas like salsa verde or salsa roja. Lime wedges are often served on the side for added freshness.",
    },
    {
      question: "Can I prepare huaraches ahead of time?",
      answer:
        "You can prepare the masa dough and cook the refried beans ahead of time. However, it's best to assemble and fry the huaraches just before serving to ensure they remain crispy and fresh.",
    },
    {
      question: "What is the best way to fry huaraches?",
      answer:
        "Heat vegetable oil in a skillet over medium-high heat. Fry the shaped masa bases until golden and crispy on both sides, about 3-4 minutes per side. Drain on paper towels before adding toppings to avoid sogginess.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Huaraches"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Huaraches are a beloved Mexican street food characterized by their unique oval shape, resembling the sole of a sandal, which is where their name originates. Made from a thick, hand-formed masa dough base, huaraches are topped with refried beans and a variety of fresh and savory toppings, creating a deliciously satisfying meal that balances textures and flavors.
          </p>
          <p>
            Originating from Mexico City, huaraches have a rich cultural history as a popular and affordable street food that has gained international recognition. Traditionally, they are enjoyed as a hearty snack or meal, showcasing the versatility of corn masa in Mexican cuisine and the vibrant use of fresh ingredients like salsas, cheeses, and meats.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Masa Dough</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the masa harina, baking powder, and salt. Gradually add water while mixing until a soft, pliable dough forms. It should not be sticky or dry. Cover the dough with a damp cloth and let it rest for 10 minutes.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Shape the Huaraches</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Divide the dough into equal portions. Flatten each portion into an oval shape about 1 cm thick, roughly the size of a hand. Use your fingers to create a slight indentation in the center to hold the toppings.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Fry the Huaraches</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Heat vegetable oil in a large skillet over medium-high heat. Fry each huarache until golden and crispy on both sides, about 3-4 minutes per side. Remove and drain on paper towels.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Add Refried Beans</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spread a generous layer of warm refried black beans over the top of each fried huarache, filling the indentation.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Top with Garnishes</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Add your choice of toppings such as shredded beef or chicken, crumbled queso fresco, chopped onions, cilantro, radishes, and drizzle with salsa verde or salsa roja. Serve with lime wedges on the side.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve Immediately</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Enjoy your huaraches fresh and warm for the best texture and flavor experience.
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
            Use warm water when mixing the masa dough to help it come together smoothly and improve pliability.
          </li>
          <li>
            Don't overwork the dough; it should be soft but not sticky. If too dry, add a little more water; if too sticky, add a bit more masa harina.
          </li>
          <li>
            Fry huaraches in batches to avoid overcrowding the pan, which can lower the oil temperature and result in soggy bases.
          </li>
          <li>
            For a smoky flavor, try grilling the huaraches briefly after frying before adding toppings.
          </li>
          <li>
            Experiment with different salsas and toppings to customize your huaraches to your taste.
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
              href="https://en.wikipedia.org/wiki/Huarache_(food)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Huarache (food)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.mexicoinmykitchen.com/huaraches-mexican-street-food/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Mexico In My Kitchen: Huaraches Mexican Street Food
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