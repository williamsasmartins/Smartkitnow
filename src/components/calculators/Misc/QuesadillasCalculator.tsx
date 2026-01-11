import { useState } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChefHat, Flame, Utensils, Clock, Users, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function QuesadillasCalculator() {
  const [servings, setServings] = useState(4);
  const [imgSrc, setImgSrc] = useState(
    "https://image.pollinations.ai/prompt/Quesadillas%2C%20plated%20food%20dish%20on%20table%2C%20chopped%20ingredients%20visible%2C%20restaurant%20style%2C%20delicious%2C%20highly%20detailed?width=1280&height=720&nologo=true&seed=9082"
  );

  // --- DATA ---
  const title = "Quesadillas";
  const description = "Tortilhas com queijo derretido e recheios opcionais, na chapa.";

  // INGREDIENTS
  const ingredients = [
    { name: "Tortilhas de farinha", baseAmount: 8, unit: "unidades" },
    { name: "Queijo cheddar ralado", baseAmount: 300, unit: "g" },
    { name: "Queijo mussarela ralado", baseAmount: 200, unit: "g" },
    { name: "Peito de frango cozido e desfiado", baseAmount: 250, unit: "g" },
    { name: "Pimentão vermelho picado", baseAmount: 1, unit: "unidade" },
    { name: "Cebola roxa picada", baseAmount: 1, unit: "unidade" },
    { name: "Milho verde", baseAmount: 150, unit: "g" },
    { name: "Coentro fresco picado", baseAmount: 15, unit: "g" },
    { name: "Azeite de oliva", baseAmount: 2, unit: "colheres de sopa" },
    { name: "Sal", baseAmount: 1, unit: "colher de chá" },
    { name: "Pimenta-do-reino moída", baseAmount: 0.5, unit: "colher de chá" },
    { name: "Molho de pimenta (opcional)", baseAmount: 2, unit: "colheres de sopa" },
    { name: "Creme azedo para servir", baseAmount: 100, unit: "g" },
    { name: "Guacamole para servir", baseAmount: 150, unit: "g" },
  ];

  // Nutrition per serving (approximate)
  const nutrition = {
    calories: "480",
    protein: "28g",
    carbs: "35g",
    fat: "22g",
  };

  // --- LOGIC ---
  const getAmount = (base: number) =>
    (base * (servings / 4)).toFixed(1).replace(/\.0$/, "");

  // --- FAQ (RICH & DETAILED) ---
  const faqs = [
    {
      question: "O que é uma quesadilla tradicional?",
      answer:
        "A quesadilla tradicional é um prato mexicano feito com tortilhas recheadas principalmente com queijo derretido, podendo incluir outros ingredientes como carnes, vegetais e temperos, e depois grelhadas até ficarem douradas e crocantes.",
    },
    {
      question: "Posso usar tortilhas de milho em vez de farinha?",
      answer:
        "Sim, as tortilhas de milho podem ser usadas para quesadillas, mas elas são menos flexíveis e podem quebrar mais facilmente ao dobrar. Tortilhas de farinha são mais comuns para quesadillas por sua maleabilidade e textura suave.",
    },
    {
      question: "Como evitar que a quesadilla fique encharcada?",
      answer:
        "Para evitar que a quesadilla fique encharcada, evite recheios muito úmidos ou escorra bem ingredientes como tomates e pimentões. Cozinhar os recheios antes e usar queijos que derretem bem ajuda a manter a textura ideal.",
    },
    {
      question: "Qual o melhor queijo para quesadillas?",
      answer:
        "Queijos que derretem bem, como cheddar, mussarela, Monterey Jack ou queijo Oaxaca, são ideais para quesadillas, pois proporcionam uma textura cremosa e sabor agradável.",
    },
    {
      question: "Posso preparar quesadillas vegetarianas?",
      answer:
        "Com certeza! Quesadillas vegetarianas podem ser feitas com uma variedade de vegetais grelhados, feijão preto, milho, cogumelos e queijos, oferecendo uma opção saborosa e nutritiva sem carne.",
    },
    {
      question: "Como armazenar e reaquecer quesadillas?",
      answer:
        "Quesadillas podem ser armazenadas na geladeira por até 2 dias em recipiente hermético. Para reaquecer, use uma frigideira em fogo médio para manter a crocância, evitando o micro-ondas que pode deixá-las moles.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- WIDGET CONTENT ---
  const widget = (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt="Quesadillas"
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
            Quesadillas são um prato tradicional mexicano que combina tortilhas
            crocantes com queijo derretido e uma variedade de recheios saborosos,
            como carnes, vegetais e temperos. São rápidas de preparar e perfeitas
            para uma refeição reconfortante e versátil, podendo ser adaptadas a
            diferentes gostos e dietas.
          </p>
          <p>
            A origem das quesadillas remonta ao México colonial, onde o uso do
            queijo e das tortilhas era comum na culinária local. Tradicionalmente,
            eram feitas com tortilhas de milho e queijo fresco, mas com o tempo,
            a receita evoluiu para incluir tortilhas de farinha e diversos
            ingredientes adicionais, tornando-se um prato popular em todo o mundo.
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
              Prepare os ingredientes
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Pique o pimentão, a cebola e o coentro. Cozinhe e desfie o peito de
              frango. Rale os queijos e escorra o milho, se necessário.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              2
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Refogue os vegetais e o frango
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Em uma frigideira, aqueça o azeite e refogue a cebola e o pimentão até
              ficarem macios. Adicione o frango desfiado, milho, sal e pimenta e
              misture bem. Cozinhe por mais 3-4 minutos.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              3
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Monte as quesadillas
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Coloque uma tortilha em uma frigideira antiaderente em fogo médio.
              Espalhe uma camada generosa de queijos ralados, adicione o refogado
              de frango e vegetais e finalize com mais queijo. Cubra com outra
              tortilha.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              4
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Cozinhe até dourar
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Cozinhe por 3-4 minutos de cada lado, pressionando levemente com uma
              espátula, até que as tortilhas estejam douradas e o queijo completamente
              derretido.
            </p>
          </li>
          <li className="ml-8 relative">
            <span className="absolute -left-12 flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full ring-4 ring-white dark:ring-slate-950 dark:bg-orange-900 text-orange-700 dark:text-orange-100 font-bold text-sm">
              5
            </span>
            <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">
              Sirva e aproveite
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              Corte as quesadillas em triângulos e sirva com creme azedo, guacamole
              e molho de pimenta a gosto.
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
            Use queijos que derretem bem para garantir uma textura cremosa e
            saborosa.
          </li>
          <li>
            Pressione levemente a quesadilla com a espátula durante o cozimento
            para ajudar a unir as camadas.
          </li>
          <li>
            Experimente adicionar ingredientes como cogumelos salteados,
            jalapeños ou feijão preto para variações interessantes.
          </li>
          <li>
            Para uma versão mais saudável, use tortilhas integrais e recheios
            com menos gordura.
          </li>
          <li>
            Sirva imediatamente para aproveitar a textura crocante da tortilha e
            o queijo derretido.
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
              href="https://en.wikipedia.org/wiki/Quesadilla"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Wikipedia: Quesadilla
            </a>
          </li>
          <li className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <a
              href="https://www.thespruceeats.com/authentic-quesadilla-recipe-2342797"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              The Spruce Eats: Authentic Quesadilla Recipe
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