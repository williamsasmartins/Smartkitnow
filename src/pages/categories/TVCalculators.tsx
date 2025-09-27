import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Video, MonitorSmartphone, Settings2 } from "lucide-react";
import { Calculator } from "lucide-react";

const TVCalculators = () => {
  const navigate = useNavigate();

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // IMPORTANTE:
  // - "key" é o slug que vai na URL (kebab-case)
  // - O TVCalculatorPage transformará o slug em PascalCase + "Calculator"
  //   e importará "@/components/calculators/tv/<PascalCase>Calculator.js"
  //   Ex.: "aspect-ratio" -> "AspectRatioCalculator.js"
  const tvCategories = [
    {
      id: "display-and-screens",
      title: "Display & Screens",
      description:
        "Aspect ratio, PPI, screen size e distância de visualização.",
      icon: MonitorSmartphone,
      calculators: [
        { key: "aspect-ratio", name: "Aspect Ratio Calculator" },
        { key: "ppi", name: "Pixels Per Inch (PPI) Calculator" },
        { key: "screen-size", name: "Screen Size Calculator" },
        { key: "viewing-distance", name: "Viewing Distance Calculator" },
      ],
    },
    {
      id: "video-and-encoding",
      title: "Video & Encoding",
      description:
        "Bitrate, tamanho de arquivo, taxa de quadros e tempo de render.",
      icon: Settings2,
      calculators: [
        { key: "bitrate", name: "Bitrate Calculator" },
        { key: "file-size", name: "Video File Size Calculator" },
        { key: "frame-rate-converter", name: "Frame Rate Converter" },
        { key: "render-time", name: "Render Time Estimator" },
      ],
    },
    {
      id: "broadcast-and-timing",
      title: "Broadcast & Timing",
      description:
        "Timecode, conversões drop/non-drop e duração total de projeto.",
      icon: Video,
      calculators: [
        { key: "timecode", name: "Timecode Calculator" },
        { key: "dropframe-converter", name: "Drop/Non-Drop Converter" },
        { key: "runtime-sum", name: "Total Runtime (Clips) Calculator" },
      ],
    },
  ] as const;

  const handleCategoryClick = (
    category: (typeof tvCategories)[number]
  ) => {
    const subSlug = slugify(category.title);
    navigate(`/tv/${subSlug}`, {
      state: {
        subCategory: {
          title: category.title,
          calculators: category.calculators,
        },
      },
    });
  };

  // Clique direto na calculadora a partir da página de categorias:
  // vai para /tv/:subcategory/calculator/:calculatorSlug
  const handleCalculatorClick = (
    category: (typeof tvCategories)[number],
    calculator: { key: string; name: string }
  ) => {
    const subSlug = slugify(category.title);
    navigate(`/tv/${subSlug}/calculator/${calculator.key}`, {
      state: {
        calculator,
        subCategory: category.title,
      },
    });
  };

  const handleBack = () => navigate("/");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-subtle pt-20 pb-8">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center animate-glow">
                <Video className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                TV & Video Calculators
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Ferramentas para telas, vídeo, codificação e broadcast: calcule
              proporções, PPI, tamanhos, distância ideal, bitrate, timecode e mais.
            </p>
          </div>

          <div className="space-y-12">
            {tvCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id}>
                  <Card className="bg-card/30 border-border/30 mb-6">
                    <CardHeader
                      className="cursor-pointer group"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <CardTitle className="flex items-center gap-3 text-2xl group-hover:text-primary transition-colors">
                        <div className="p-2 rounded-lg bg-gradient-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.calculators.map((calculator) => (
                      <Card
                        key={calculator.key}
                        className="group cursor-pointer transition-all duration-300 hover:shadow-elegant border-border/60 bg-card/50 backdrop-blur-sm hover:bg-card/80"
                        onClick={() => handleCalculatorClick(category, calculator)}
                      >
                        <CardHeader className="text-center pb-4">
                          <div className="mx-auto mb-3 p-2 rounded-lg bg-gradient-primary/10 group-hover:bg-gradient-primary/20 transition-colors w-fit">
                            <Calculator className="h-5 w-5 text-primary" />
                          </div>
                          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                            {calculator.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground text-center">
                            Quick TV & video computations
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TVCalculators;
