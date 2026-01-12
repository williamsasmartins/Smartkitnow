import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PicoDeGalloCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Pico%20de%20Gallo%20fresh%20salsa%20bowl%20mexican%20food%20chopped%20ingredients%20close%20up%20high%20detail?width=1280&height=720&nologo=true&seed=1234"
  );

  const title = "Pico de Gallo";
  const description = "A fresh, uncooked salsa made from chopped tomato, onion, cilantro, fresh serranos, salt, and lime juice.";

  const ingredients = [
    { name: "Roma tomatoes, diced", baseAmount: 4, unit: "medium" },
    { name: "White onion, finely chopped", baseAmount: 0.5, unit: "medium" },
    { name: "Fresh cilantro, chopped", baseAmount: 0.5, unit: "cup" },
    { name: "Serrano or Jalapeño pepper, minced", baseAmount: 1, unit: "pcs" },
    { name: "Lime juice", baseAmount: 1, unit: "tbsp" },
    { name: "Salt", baseAmount: 0.5, unit: "tsp" },
  ];

  const nutrition = { calories: "20", protein: "1g", carbs: "4g", fat: "0g" };
  const getAmount = (base: number) => (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  const faqs = [
    { question: "What is the difference between Pico de Gallo and Salsa?", answer: "Pico de Gallo is a type of salsa fresca (fresh sauce) that is uncooked and chunky, with distinct visible ingredients. Traditional salsa is often cooked or blended for a smoother consistency." },
    { question: "How long does Pico de Gallo last?", answer: "It is best eaten the same day but can be stored in the refrigerator for up to 3 days. The tomatoes will release more liquid over time." },
    { question: "Can I use lemon instead of lime?", answer: "Lime is traditional for its distinct zesty flavor, but lemon can be used in a pinch. The flavor profile will be slightly different." }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img src={imgSrc} alt={title} width="1280" height="720" className="w-full h-auto object-cover aspect-video" onError={() => setImgSrc("https://images.unsplash.com/photo-1574653853027-5382a3d23a15?q=80&w=1280&auto=format&fit=crop")} />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
           <span className="text-white font-bold text-lg flex items-center gap-2"><Clock className="w-5 h-5 text-orange-400"/> Prep: 15m | Cook: 0m</span>
        </div>
      </div>
      <Card>
        <CardHeader className="pb-3 bg-slate-50 dark:bg-slate-900/50">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg"><Utensils className="h-5 w-5 text-orange-500"/> Ingredients</span>
            <div className="flex items-center gap-2 text-sm bg-white dark:bg-slate-800 border p-1 rounded-lg">
               <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setServings(s => Math.max(1, s-1))}>-</Button>
               <span className="w-6 text-center font-bold text-lg">{servings}</span>
               <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setServings(s => s+1)}>+</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableBody>
              {ingredients.map((ing, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-base">{ing.name}</TableCell>
                  <TableCell className="text-right font-bold text-base text-slate-700 dark:text-slate-200">{getAmount(ing.baseAmount)} {ing.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="bg-slate-50 dark:bg-slate-900/50">
        <CardContent className="p-4 grid grid-cols-4 gap-2 text-center text-sm">
            <div><div className="font-bold text-lg">{nutrition.calories}</div><span className="text-xs font-bold uppercase text-slate-500">Kcal</span></div>
            <div><div className="font-bold text-lg">{nutrition.protein}</div><span className="text-xs font-bold uppercase text-slate-500">Prot</span></div>
            <div><div className="font-bold text-lg">{nutrition.carbs}</div><span className="text-xs font-bold uppercase text-slate-500">Carb</span></div>
            <div><div className="font-bold text-lg">{nutrition.fat}</div><span className="text-xs font-bold uppercase text-slate-500">Fat</span></div>
        </CardContent>
      </Card>
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">About this Recipe</h2>
        <div className="prose prose-lg prose-slate dark:prose-invert leading-relaxed text-base md:text-lg text-slate-700 dark:text-slate-300">
           <p className="mb-4">Pico de Gallo, also known as Salsa Fresca, is a cornerstone of Mexican cuisine. Unlike cooked salsas, it relies entirely on the freshness of its raw ingredients. The name literally translates to "rooster's beak," possibly referring to the way it was originally eaten by pinching pieces between the thumb and finger.</p>
           <p>The key to a perfect Pico de Gallo is the ratio of ingredients. You want the tomatoes to be the star, supported by the crunch of onions, the herbal note of cilantro, the heat of the pepper, and the acidity of the lime.</p>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><ChefHat className="h-8 w-8 text-orange-500"/> Instructions</h2>
        <ol className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-10">
            <li className="ml-8 relative">
                <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">1</span>
                <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prep the Ingredients</h3>
                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">Dice the tomatoes and onions into small, uniform pieces. Finely chop the cilantro and mince the jalapeño (remove seeds for less heat).</p>
            </li>
            <li className="ml-8 relative">
                <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">2</span>
                <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Combine and Season</h3>
                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">In a medium bowl, combine the tomatoes, onions, cilantro, and jalapeño. Squeeze the lime juice over the mixture and sprinkle with salt.</p>
            </li>
            <li className="ml-8 relative">
                <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">3</span>
                <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Rest and Serve</h3>
                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">Toss gently to coat. Let the salsa sit for 15-30 minutes to allow the flavors to meld. Taste and adjust salt or lime if needed. Serve with chips or tacos.</p>
            </li>
        </ol>
      </section>
      <section className="bg-amber-50 dark:bg-amber-950/20 p-8 rounded-2xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-xl mb-4 text-amber-900 dark:text-amber-100 flex items-center gap-2"><Flame className="h-6 w-6 text-amber-500"/> Chef's Tips</h3>
        <ul className="list-disc pl-5 space-y-3 text-amber-900 dark:text-amber-100 text-base">
            <li>Remove the watery seeds from the tomatoes if you prefer a less liquid salsa.</li>
            <li>For milder flavor, soak the chopped onions in cold water for 10 minutes then drain before adding.</li>
        </ul>
      </section>
      <section className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="h-6 w-6"/> References</h3>
        <ul className="space-y-3 text-base text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-2"><ExternalLink className="h-4 w-4 text-blue-600"/> <a href="https://en.wikipedia.org/wiki/Pico_de_gallo" target="_blank" className="text-blue-600 hover:text-blue-800 underline font-medium">Wikipedia: Pico de Gallo</a></li>
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
      showTopBanner showSidebar showBottomBanner
    />
  );
}
