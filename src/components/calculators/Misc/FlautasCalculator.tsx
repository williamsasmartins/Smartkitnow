import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FlautasCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Flautas%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=6518"
  );

  // --- DATA ---
  const title = "Flautas";
  const description = "Similar aos taquitos, geralmente maiores e bem crocantes.";

  // INGREDIENTS
  const ingredients = [
    { name: "Tortillas de milho (corn tortillas)", baseAmount: 12, unit: "units" },
    { name: "Peito de frango cozido e desfiado", baseAmount: 500, unit: "g" },
    { name: "Queijo fresco ralado", baseAmount: 150, unit: "g" },
    { name: "Cebola picada", baseAmount: 1, unit: "medium" },
    { name: "Alho picado", baseAmount: 2, unit: "cloves" },
    { name: "Óleo vegetal para fritar", baseAmount: 500, unit: "ml" },
    { name: "Sal", baseAmount: 1, unit: "tsp" },
    { name: "Pimenta-do-reino moída", baseAmount: 0.5, unit: "tsp" },
    { name: "Cominho em pó", baseAmount: 0.5, unit: "tsp" },
    { name: "Coentro fresco picado", baseAmount: 2, unit: "tbsp" },
    { name: "Molho de tomate (opcional)", baseAmount: 200, unit: "ml" },
    { name: "Creme azedo (sour cream) para servir", baseAmount: 100, unit: "g" },
    { name: "Folhas de alface para acompanhar", baseAmount: 4, unit: "leaves" },
  ];

  // Nutrition values per serving (approximate)
  const nutrition = {
    calories: "420",
    protein: "30g",
    carbs: "35g",
    fat: "18g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "O que são flautas e como diferem dos taquitos?",
      answer:
        "Flautas são tortillas recheadas, geralmente maiores que taquitos, enroladas e fritas até ficarem crocantes. Enquanto os taquitos são menores e mais finos, as flautas costumam ser mais longas e recheadas com uma variedade maior de ingredientes, proporcionando uma textura crocante e recheio suculento.",
    },
    {
      question: "Qual o melhor tipo de tortilla para fazer flautas?",
      answer:
        "Tradicionalmente, as flautas são feitas com tortillas de milho, que conferem sabor autêntico e crocância ao prato. As tortillas de farinha podem ser usadas, mas resultam em uma textura diferente, menos crocante e mais macia.",
    },
    {
      question: "Como evitar que as flautas fiquem encharcadas após fritar?",
      answer:
        "Para evitar que as flautas fiquem encharcadas, é importante fritá-las em óleo quente (cerca de 180°C) para que cozinhem rapidamente e fiquem crocantes. Escorra-as em papel absorvente imediatamente após a fritura para remover o excesso de óleo.",
    },
    {
      question: "Posso preparar flautas com antecedência e congelar?",
      answer:
        "Sim, você pode montar as flautas e congelá-las antes de fritar. Para isso, enrole-as e disponha em uma assadeira forrada, congelando até firmar. Depois, transfira para um saco plástico para congelamento. Frite diretamente do congelador, ajustando o tempo para garantir que cozinhem por completo.",
    },
    {
      question: "Quais acompanhamentos combinam melhor com flautas?",
      answer:
        "Flautas combinam perfeitamente com guacamole, creme azedo, salsa fresca, alface picada e queijo ralado. Molhos picantes ou de tomate também realçam o sabor, além de uma salada fresca para equilibrar a crocância do prato.",
    },
    {
      question: "Como adaptar a receita para versões vegetarianas?",
      answer:
        "Para uma versão vegetariana, substitua o frango por recheios como batata temperada, feijão preto, cogumelos salteados ou queijo com legumes. Tempere bem para garantir sabor e mantenha o processo de fritura igual para obter a crocância característica.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Flautas"
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
            Flautas são um prato tradicional mexicano que consiste em tortillas recheadas, geralmente com frango desfiado, enroladas em forma de tubo e fritas até ficarem crocantes. Conhecidas por sua textura crocante e sabor rico, as flautas são frequentemente servidas com acompanhamentos frescos como alface, creme azedo e salsa, tornando-se uma opção deliciosa e versátil para refeições e festas.
          </p>
          <p>
            A origem das flautas remonta à culinária mexicana tradicional, onde o uso de tortillas de milho é predominante. O nome "flauta" significa "flauta" em espanhol, referindo-se à forma alongada e fina do prato. Embora semelhantes aos taquitos, as flautas são geralmente maiores e mais recheadas, oferecendo uma experiência gastronômica mais robusta e satisfatória.
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
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Prepare the Filling</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Em uma frigideira, refogue a cebola e o alho até ficarem translúcidos. Adicione o frango desfiado, sal, pimenta, cominho e coentro picado. Misture bem e cozinhe por alguns minutos para incorporar os temperos. Reserve e deixe esfriar um pouco.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Warm the Tortillas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Aqueça as tortillas em uma frigideira ou micro-ondas para que fiquem maleáveis e não quebrem ao enrolar.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Assemble the Flautas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Coloque uma porção do recheio no centro de cada tortilla e enrole firmemente, formando um tubo. Use um palito de dente para segurar, se necessário.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Fry the Flautas</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Aqueça o óleo vegetal em uma panela funda a 180°C. Frite as flautas em pequenas porções até dourarem e ficarem crocantes, cerca de 2-3 minutos por lado. Escorra em papel absorvente.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Serve</h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Sirva as flautas quentes acompanhadas de alface picada, creme azedo, queijo ralado e salsa fresca ou molho de tomate, conforme preferir.
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
            Para evitar que as tortillas quebrem ao enrolar, aqueça-as levemente para que fiquem flexíveis.
          </li>
          <li>
            Use óleo suficiente para que as flautas fiquem totalmente submersas durante a fritura, garantindo uma crocância uniforme.
          </li>
          <li>
            Escorra as flautas em papel toalha imediatamente após fritar para remover o excesso de óleo e manter a textura crocante.
          </li>
          <li>
            Experimente recheios variados, como carne moída temperada, queijo com espinafre ou legumes salteados para versões diferentes.
          </li>
          <li>
            Para uma opção mais saudável, asse as flautas no forno a 200°C por cerca de 15-20 minutos, virando na metade do tempo.
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
              href="https://en.wikipedia.org/wiki/Flauta_(food)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Flauta (food)
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/mexican-flautas-recipe-2342777"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Mexican Flautas Recipe
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