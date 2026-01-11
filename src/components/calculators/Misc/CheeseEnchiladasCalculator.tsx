import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CheeseEnchiladasCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Cheese%20Enchiladas%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=1842"
  );

  // --- DATA ---
  const title = "Cheese Enchiladas";
  const description = "Enchiladas recheadas com queijo e finalizadas com molho.";

  // INGREDIENTS
  const ingredients = [
    { name: "Corn Tortillas", baseAmount: 12, unit: "units" },
    { name: "Shredded Cheddar Cheese", baseAmount: 300, unit: "g" },
    { name: "Shredded Monterey Jack Cheese", baseAmount: 200, unit: "g" },
    { name: "Cream Cheese", baseAmount: 100, unit: "g" },
    { name: "Onion, finely chopped", baseAmount: 1, unit: "medium" },
    { name: "Garlic Cloves, minced", baseAmount: 3, unit: "cloves" },
    { name: "Green Chilies, diced", baseAmount: 2, unit: "units" },
    { name: "Enchilada Sauce", baseAmount: 400, unit: "ml" },
    { name: "Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Fresh Cilantro, chopped", baseAmount: 15, unit: "g" },
    { name: "Salt", baseAmount: 1, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 0.5, unit: "tsp" },
    { name: "Sour Cream (for serving)", baseAmount: 100, unit: "g" },
    { name: "Lime Wedges (for serving)", baseAmount: 4, unit: "wedges" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "25g",
    carbs: "35g",
    fat: "28g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "Can I use flour tortillas instead of corn tortillas?",
      answer:
        "Yes, flour tortillas can be used as a substitute for corn tortillas. They tend to be softer and more pliable, which some people prefer. However, corn tortillas provide a more authentic flavor and texture for traditional enchiladas.",
    },
    {
      question: "How do I make my enchiladas less spicy?",
      answer:
        "To reduce the spiciness, use mild enchilada sauce or reduce the amount of green chilies. You can also omit the seeds from the chilies, as they contain most of the heat. Serving with sour cream or avocado can also help mellow the spice.",
    },
    {
      question: "Can I prepare cheese enchiladas ahead of time?",
      answer:
        "Absolutely! You can assemble the enchiladas a day in advance and refrigerate them covered. When ready to serve, bake them directly from the fridge, adding a few extra minutes to the cooking time to ensure they are heated through.",
    },
    {
      question: "What cheeses work best for enchiladas?",
      answer:
        "A combination of cheeses that melt well is ideal. Cheddar and Monterey Jack are classic choices for their meltability and flavor. Cream cheese adds creaminess. You can also experiment with queso fresco or mozzarella for different textures.",
    },
    {
      question: "How do I store leftover enchiladas?",
      answer:
        "Store leftover enchiladas in an airtight container in the refrigerator for up to 3 days. Reheat in the oven at 175°C (350°F) covered with foil to prevent drying out, or microwave individual portions until warmed through.",
    },
    {
      question: "Can I add vegetables or meat to this cheese enchilada recipe?",
      answer:
        "Yes, you can customize enchiladas by adding cooked vegetables like bell peppers, mushrooms, or spinach, or proteins such as shredded chicken or beef. Adjust the seasoning and sauce accordingly to complement the added ingredients.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Cheese Enchiladas"
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
            Cheese enchiladas are a beloved Mexican dish featuring tender corn
            tortillas filled with a blend of melted cheeses, bathed in a rich
            and flavorful enchilada sauce. This recipe balances creamy,
            tangy, and mildly spicy elements to create a comforting and
            satisfying meal perfect for any occasion.
          </p>
          <p>
            Originating from traditional Mexican cuisine, enchiladas have been
            enjoyed for centuries. The dish evolved from indigenous corn tortilla
            preparations combined with Spanish influences, particularly the use
            of cheese and chili sauces. Cheese enchiladas highlight the
            simplicity and richness of Mexican flavors, making them a staple in
            homes and restaurants alike.
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
              Prepare the Filling
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a medium bowl, combine shredded cheddar, Monterey Jack, and
              cream cheese until well mixed. Set aside. Finely chop the onion,
              mince garlic, and dice green chilies for later use.
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
              Heat olive oil in a skillet over medium heat. Add chopped onion,
              garlic, and green chilies. Cook until softened and fragrant,
              about 3-4 minutes. Season with salt and black pepper.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Warm Tortillas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Lightly warm the corn tortillas in a dry skillet or microwave to
              make them pliable and prevent cracking when rolling.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Assemble Enchiladas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Spread a spoonful of enchilada sauce on the bottom of a baking
              dish. Fill each tortilla with the cheese mixture and a bit of the
              sautéed aromatics, then roll tightly. Place seam side down in the
              dish.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Add Sauce and Bake
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pour remaining enchilada sauce evenly over the rolled tortillas.
              Sprinkle extra shredded cheese on top if desired. Bake in a
              preheated oven at 180°C (350°F) for 15 minutes or until bubbly
              and golden.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Garnish and Serve
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove from oven and garnish with fresh chopped cilantro. Serve
              hot with sour cream and lime wedges on the side for added zest.
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
            Warm the tortillas just before assembling to prevent cracking and
            make rolling easier.
          </li>
          <li>
            Use a blend of cheeses for the best melt and flavor complexity.
          </li>
          <li>
            If you prefer a saucier enchilada, add extra sauce before baking.
          </li>
          <li>
            For a smoky flavor, try adding a pinch of smoked paprika or chipotle
            powder to the cheese filling.
          </li>
          <li>
            Leftover enchiladas make great next-day meals and can be frozen for
            up to 2 months.
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
              href="https://en.wikipedia.org/wiki/Enchilada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Enchilada
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/cheese-enchiladas-recipe-2342733"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Cheese Enchiladas Recipe
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