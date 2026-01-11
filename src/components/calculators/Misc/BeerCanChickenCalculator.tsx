import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BeerCanChickenCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Beer%20Can%20Chicken%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=8672"
  );

  // --- DATA ---
  const title = "Beer Can Chicken";
  const description =
    "Beer-can style chicken for moist results, seasoned skin, and grill stability tips.";

  // INGREDIENTS
  const ingredients = [
    { name: "Whole Chicken (about 1.5 kg)", baseAmount: 1, unit: "pc" },
    { name: "Can of Beer (12 oz / 355 ml)", baseAmount: 1, unit: "can" },
    { name: "Olive Oil", baseAmount: 2, unit: "tbsp" },
    { name: "Garlic Powder", baseAmount: 1, unit: "tsp" },
    { name: "Onion Powder", baseAmount: 1, unit: "tsp" },
    { name: "Paprika", baseAmount: 2, unit: "tsp" },
    { name: "Dried Thyme", baseAmount: 1, unit: "tsp" },
    { name: "Dried Oregano", baseAmount: 1, unit: "tsp" },
    { name: "Salt", baseAmount: 1.5, unit: "tsp" },
    { name: "Black Pepper", baseAmount: 1, unit: "tsp" },
    { name: "Brown Sugar", baseAmount: 1, unit: "tbsp" },
    { name: "Lemon (optional, halved)", baseAmount: 0.5, unit: "pc" },
    { name: "Fresh Parsley (for garnish)", baseAmount: 2, unit: "tbsp" },
  ];

  // Nutrition estimates per serving (approximate)
  const nutrition = {
    calories: "450",
    protein: "45g",
    carbs: "3g",
    fat: "28g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    servings === 1 && base === 1
      ? "1"
      : servings === 1 && base < 1
      ? (base * (servings / 4)).toFixed(2).replace(/\.?0+$/, "")
      : servings === 1
      ? (base * (servings / 4)).toFixed(1).replace(/\.0$/, "")
      : base === 1
      ? servings
      : (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What is the purpose of using a beer can in this recipe?",
      answer:
        "The beer can acts as a vertical roasting stand and helps to keep the chicken moist from the inside as the beer steams during cooking. This method also helps the chicken cook evenly and results in juicy meat with crispy skin.",
    },
    {
      question: "Can I use other beverages instead of beer?",
      answer:
        "Yes, you can substitute beer with other carbonated beverages like soda, sparkling water, or even broth. Each will impart a slightly different flavor, so choose one that complements your seasoning.",
    },
    {
      question: "How do I ensure the chicken cooks safely and thoroughly?",
      answer:
        "Use a meat thermometer to check the internal temperature of the chicken. The thickest part of the thigh should reach at least 165°F (74°C). Also, make sure the chicken is cooked upright and stable on the grill or oven rack to avoid tipping.",
    },
    {
      question: "Can I prepare this recipe indoors?",
      answer:
        "While traditionally cooked on a grill or smoker, you can prepare beer can chicken in an oven using a vertical roaster stand designed for this purpose. Avoid using an open beer can in the oven for safety reasons.",
    },
    {
      question: "How do I clean up after cooking beer can chicken?",
      answer:
        "Dispose of the beer can after cooking as it may be difficult to clean thoroughly. Clean your grill or oven racks as usual, and wash any utensils and surfaces that came into contact with raw chicken to prevent cross-contamination.",
    },
    {
      question: "What side dishes pair well with beer can chicken?",
      answer:
        "Classic sides include grilled vegetables, coleslaw, cornbread, baked potatoes, or a fresh green salad. The smoky, savory flavors of the chicken complement a wide variety of sides.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Beer Can Chicken"
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
            <Clock className="w-5 h-5 text-orange-400" /> Prep: 20m | Cook: 1h 15m
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
          <p className="mb-4">
            Beer Can Chicken is a beloved grilling technique that involves roasting a whole chicken
            upright on an open can of beer. This method infuses the meat with moisture and subtle
            flavors from the beer steam, while the upright position allows for even cooking and
            crispy skin all around. Perfect for backyard barbecues or weekend gatherings, this recipe
            delivers juicy, tender chicken with a beautifully seasoned crust.
          </p>
          <p>
            The origins of beer can chicken are somewhat debated, but it gained popularity in the
            United States during the 1990s as a fun and innovative way to grill chicken. It combines
            traditional roasting with the unique twist of using beer as a natural steaming agent,
            resulting in a flavorful and moist dish that has become a staple in American barbecue
            culture.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Chicken</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Remove any giblets from the chicken cavity and pat the chicken dry with paper towels.
              If desired, rub the inside of the cavity with half a lemon for extra flavor.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Make the Dry Rub</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              In a small bowl, combine garlic powder, onion powder, paprika, dried thyme, dried
              oregano, salt, black pepper, and brown sugar. Drizzle olive oil over the chicken and
              rub the spice mixture evenly all over the skin.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Beer Can</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Open the beer can and pour out (or drink) about half of the beer. You can add a few
              garlic cloves or herbs inside the can for extra aroma. Place the can on a stable
              surface.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Mount the Chicken</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Carefully place the chicken cavity over the beer can so it sits upright. The legs
              should act as a tripod to stabilize the chicken. Transfer the setup to a grill or
              oven-safe pan.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Cook the Chicken</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Preheat your grill to medium heat (around 180°C / 350°F). Place the chicken upright on
              the grill grates, cover, and cook for about 1 to 1.5 hours. Use a meat thermometer to
              ensure the internal temperature reaches 165°F (74°C).
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              6
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Rest and Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Carefully remove the chicken from the beer can (use oven mitts and be cautious of hot
              steam). Let the chicken rest for 10 minutes before carving. Garnish with fresh parsley
              and serve with your favorite sides.
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
            Use a sturdy beer can or consider a vertical roaster stand for better stability and
            safety during cooking.
          </li>
          <li>
            For extra smoky flavor, add wood chips to your grill or smoker and maintain a steady
            temperature.
          </li>
          <li>
            Pat the chicken skin dry before applying the rub to help achieve a crispier skin.
          </li>
          <li>
            Avoid opening the grill lid frequently to maintain consistent heat and cooking time.
          </li>
          <li>
            Letting the chicken rest after cooking allows the juices to redistribute, making the
            meat more tender and flavorful.
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
              href="https://en.wikipedia.org/wiki/Beer_can_chicken"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Beer Can Chicken
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/beer-can-chicken-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Beer Can Chicken Recipe & Tips
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