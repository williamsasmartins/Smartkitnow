import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SfogliatellaCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Sfogliatella%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=5931"
  );

  // --- DATA ---
  const title = "Sfogliatella";
  const description = "Flaky layered pastry filled with orange-scented ricotta cream.";

  // INGREDIENTS
  const ingredients = [
    { name: "All-purpose flour", baseAmount: 500, unit: "g" },
    { name: "Cold water", baseAmount: 250, unit: "ml" },
    { name: "Salt", baseAmount: 5, unit: "g" },
    { name: "Unsalted butter (for dough)", baseAmount: 50, unit: "g" },
    { name: "Ricotta cheese", baseAmount: 400, unit: "g" },
    { name: "Semolina flour", baseAmount: 50, unit: "g" },
    { name: "Granulated sugar", baseAmount: 150, unit: "g" },
    { name: "Eggs", baseAmount: 2, unit: "large" },
    { name: "Candied orange peel, finely chopped", baseAmount: 80, unit: "g" },
    { name: "Vanilla extract", baseAmount: 1, unit: "tsp" },
    { name: "Orange zest", baseAmount: 1, unit: "tbsp" },
    { name: "Ground cinnamon", baseAmount: 1, unit: "tsp" },
    { name: "Unsalted butter (for filling)", baseAmount: 30, unit: "g" },
    { name: "Powdered sugar (for dusting)", baseAmount: 20, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "12g",
    carbs: "55g",
    fat: "15g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is Sfogliatella and where does it originate from?",
      answer:
        "Sfogliatella is a traditional Italian pastry known for its distinctive shell-like shape and flaky layers. Originating from the Campania region, particularly Naples, it is a beloved dessert that dates back to the 17th century. The name 'sfogliatella' means 'small, thin leaf' in Italian, referring to the pastry's many delicate layers.",
    },
    {
      question: "How do I achieve the signature flaky layers in Sfogliatella dough?",
      answer:
        "The key to the signature flaky texture lies in the dough preparation. The dough is rolled very thin and layered with butter, then rolled and folded multiple times to create thin sheets separated by butter. This lamination process, similar to puff pastry, creates the delicate, crisp layers when baked.",
    },
    {
      question: "Can I prepare Sfogliatella filling in advance?",
      answer:
        "Yes, the ricotta-based filling can be prepared a day ahead and stored in the refrigerator. This allows the flavors to meld and makes the assembly process quicker. Just ensure the filling is well covered to prevent it from drying out.",
    },
    {
      question: "What is the best way to store leftover Sfogliatella?",
      answer:
        "Sfogliatella is best enjoyed fresh, but leftovers can be stored in an airtight container at room temperature for up to 2 days. To refresh the crispiness, warm them briefly in a preheated oven at 175°C (350°F) for 5-7 minutes before serving.",
    },
    {
      question: "Are there variations of Sfogliatella?",
      answer:
        "Yes, there are two main types: 'Sfogliatella Riccia' which has the classic layered, crispy shell, and 'Sfogliatella Frolla' which uses a shortcrust pastry for a softer texture. Fillings can also vary, including almond paste or semolina custard, depending on regional and personal preferences.",
    },
    {
      question: "Can I substitute ricotta cheese with other cheeses?",
      answer:
        "Ricotta is preferred for its creamy texture and mild flavor, but you can substitute it with mascarpone or a blend of cream cheese and ricotta for a richer filling. Avoid using very dense or salty cheeses as they alter the traditional taste.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Sfogliatella"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 15m
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
            Sfogliatella is a classic Italian pastry renowned for its crisp,
            flaky layers and rich, aromatic filling. This delicacy combines a
            unique laminated dough with a luscious ricotta cream infused with
            citrus and spices, creating a perfect balance of textures and
            flavors. Traditionally enjoyed as a breakfast treat or dessert,
            Sfogliatella showcases the artistry and heritage of Neapolitan
            baking.
          </p>
          <p>
            The origins of Sfogliatella trace back to the 17th century in the
            Campania region of Italy, where it was first crafted by nuns in
            convents. Over centuries, it evolved into a beloved pastry symbolizing
            Italian culinary craftsmanship. Its name, meaning "small leaf," aptly
            describes the many delicate layers that define its signature
            appearance and texture.
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
              Prepare the Dough
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a large bowl, combine the all-purpose flour and salt. Gradually
              add cold water and mix until a firm dough forms. Knead on a floured
              surface until smooth and elastic, about 10 minutes. Wrap in plastic
              and refrigerate for at least 1 hour.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Make the Filling
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a bowl, blend ricotta cheese, semolina flour, sugar, eggs,
              candied orange peel, vanilla extract, orange zest, and cinnamon
              until smooth. Melt the butter and fold it into the mixture. Chill
              the filling while preparing the dough.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Laminate the Dough
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Roll the dough into a large thin rectangle. Spread softened butter
              evenly over the surface. Roll the dough tightly into a log and slice
              into 2 cm thick discs. Flatten each disc into an oval shape.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Shape and Fill
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Using your fingers, carefully open the layers of each oval to form a
              shell shape. Fill each shell generously with the ricotta mixture,
              then pinch the edges to seal.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Bake to Perfection
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat the oven to 200°C (390°F). Place the filled pastries on a
              parchment-lined baking sheet and bake for 15-20 minutes until golden
              brown and crisp. Dust with powdered sugar before serving.
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
            Use very cold water and keep the dough chilled to make rolling and
            laminating easier.
          </li>
          <li>
            When shaping the shells, be gentle to avoid tearing the delicate dough
            layers.
          </li>
          <li>
            For an extra aromatic filling, soak the candied orange peel in a
            splash of orange liqueur before mixing.
          </li>
          <li>
            If you don’t have semolina flour, fine cornmeal can be a substitute,
            but it will slightly change the texture.
          </li>
          <li>
            Serve Sfogliatella warm for the best experience, as the layers are
            crispest and the filling is creamy.
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