import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BrazilianBarbecuePlatterChurrascoCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Brazilian%20Barbecue%20Platter%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=563"
  );

  // --- DATA ---
  const title = "Brazilian Barbecue Platter";
  const description = "An assortment of prime grilled meats cooked over open fire.";

  // INGREDIENTS
  const ingredients = [
    { name: "Beef Picanha (Top Sirloin Cap)", baseAmount: 500, unit: "g" },
    { name: "Pork Sausage (Linguiça)", baseAmount: 300, unit: "g" },
    { name: "Chicken Thighs (boneless, skin-on)", baseAmount: 400, unit: "g" },
    { name: "Beef Short Ribs", baseAmount: 350, unit: "g" },
    { name: "Pork Ribs", baseAmount: 350, unit: "g" },
    { name: "Salt (coarse sea salt)", baseAmount: 15, unit: "g" },
    { name: "Garlic Cloves (minced)", baseAmount: 4, unit: "cloves" },
    { name: "Olive Oil", baseAmount: 30, unit: "ml" },
    { name: "Lemon (for garnish and marinade)", baseAmount: 1, unit: "whole" },
    { name: "Fresh Rosemary", baseAmount: 5, unit: "g" },
    { name: "Black Pepper (freshly ground)", baseAmount: 5, unit: "g" },
    { name: "Chimichurri Sauce", baseAmount: 100, unit: "ml" },
    { name: "Farofa (toasted cassava flour)", baseAmount: 80, unit: "g" },
    { name: "Grilled Pineapple Slices", baseAmount: 200, unit: "g" },
  ];

  // Nutrition estimates per serving (approximate)
  const nutrition = {
    calories: "750",
    protein: "65g",
    carbs: "15g",
    fat: "45g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "What cuts of meat are traditionally used in Brazilian barbecue?",
      answer:
        "Brazilian barbecue, or churrasco, traditionally features cuts like picanha (top sirloin cap), beef short ribs, pork sausage (linguiça), chicken thighs, and pork ribs. These cuts are chosen for their flavor and tenderness when grilled over open flames.",
    },
    {
      question: "How do you properly season the meats for churrasco?",
      answer:
        "The classic seasoning for churrasco is simple coarse sea salt applied generously before grilling. Some cuts may be marinated lightly with garlic, olive oil, lemon juice, and fresh herbs like rosemary. The key is to enhance the natural flavors without overpowering them.",
    },
    {
      question: "What is the best way to grill the meats for authentic flavor?",
      answer:
        "Grilling over a wood or charcoal fire at medium-high heat is ideal. Meats are often skewered and cooked slowly, allowing fat to render and create a smoky, caramelized crust. Turning the meat regularly ensures even cooking and juiciness.",
    },
    {
      question: "What side dishes complement a Brazilian barbecue platter?",
      answer:
        "Traditional sides include farofa (toasted cassava flour), vinaigrette salsa, grilled pineapple slices, rice, and fresh salads. Chimichurri sauce is also popular as a vibrant, herbaceous condiment to accompany the meats.",
    },
    {
      question: "Can I prepare churrasco indoors if I don't have a grill?",
      answer:
        "While outdoor grilling is preferred for authentic flavor, you can use a grill pan or broiler indoors. To mimic the smoky taste, consider using smoked paprika or liquid smoke sparingly. However, nothing quite replaces the aroma of an open flame churrasco.",
    },
    {
      question: "How do I store and reheat leftover Brazilian barbecue?",
      answer:
        "Store leftovers in an airtight container in the refrigerator for up to 3 days. Reheat gently in an oven at low temperature or on a grill pan to preserve moisture and texture. Avoid microwaving as it can dry out the meat.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Brazilian Barbecue Platter"
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
            Brazilian Barbecue Platter, known locally as "Churrasco," is a vibrant
            celebration of fire-grilled meats that showcases Brazil's rich culinary
            heritage. This platter features an assortment of prime cuts, each
            expertly seasoned and cooked over an open flame to achieve a perfect
            balance of smoky, juicy, and tender flavors. Traditionally enjoyed
            during social gatherings, churrasco is more than a meal—it's an
            experience that brings people together around the fire.
          </p>
          <p>
            Originating from the southern regions of Brazil, churrasco was popularized
            by the gaúchos, the skilled cattle herders of the Pampas. These
            cowboys perfected the art of grilling large cuts of meat on skewers over
            wood fires. Over time, churrasco evolved into a national culinary icon,
            celebrated in churrascarias (Brazilian steakhouses) worldwide. The
            simplicity of seasoning with coarse salt and the technique of slow,
            open-fire cooking remain central to its authentic flavor.
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
              Prepare the Meats
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Trim excess fat from the beef short ribs and pork ribs. Cut the
              chicken thighs into large pieces. For the picanha, leave a thick fat
              cap intact to enhance flavor. Mince garlic and mix with olive oil,
              lemon juice, and rosemary to create a marinade for the chicken and
              pork sausage.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Season the Meats
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Generously coat all meat cuts with coarse sea salt. Marinate the
              chicken thighs and pork sausage in the garlic-lemon mixture for at
              least 30 minutes. Sprinkle freshly ground black pepper on the picanha
              and ribs.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Prepare the Grill
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Light a charcoal or wood fire and allow it to burn down to medium-high
              heat with glowing embers. Arrange the grill grate about 6-8 inches
              above the coals for optimal cooking.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Grill the Meats
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Skewer the meats or place them directly on the grill. Cook the
              picanha fat-side down first to render fat and create a crispy crust.
              Turn meats regularly to ensure even cooking. Grill sausages and
              chicken until cooked through and nicely charred. Ribs should be cooked
              low and slow for tenderness.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Serve with Sides and Garnishes
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Arrange the grilled meats on a large platter with grilled pineapple
              slices and farofa. Serve chimichurri sauce on the side for dipping.
              Garnish with fresh lemon wedges and enjoy with friends and family.
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
            Use coarse sea salt rather than fine salt to season the meats; it
            helps create a flavorful crust and draws out moisture for better
            caramelization.
          </li>
          <li>
            Let the picanha rest at room temperature before grilling to ensure even
            cooking and juiciness.
          </li>
          <li>
            Maintain a consistent medium-high heat on the grill to avoid burning
            while achieving a smoky flavor.
          </li>
          <li>
            Rotate the skewers or flip the meat frequently to cook evenly and avoid
            flare-ups.
          </li>
          <li>
            Serve grilled pineapple slices alongside the meats to add a sweet,
            tangy contrast that complements the smoky flavors.
          </li>
          <li>
            Prepare chimichurri sauce fresh with parsley, garlic, vinegar, and olive
            oil for a bright, herbaceous accompaniment.
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
              href="https://en.wikipedia.org/wiki/Churrasco"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Churrasco (Brazilian Barbecue)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.britannica.com/topic/Churrasco"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Britannica: Churrasco Overview
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.seriouseats.com/brazilian-churrasco-picanha-recipe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Serious Eats: Brazilian Churrasco Picanha Recipe
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