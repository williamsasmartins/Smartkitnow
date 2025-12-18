import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// ⚠️ FIX: Adicionei Droplets, Wrench e FlaskConical
import {
  Home,
  AlertTriangle,
  RotateCcw,
  Droplets,
  Wrench,
  FlaskConical, 
  Scale, 
  Waves
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CleaningDilutionRatioCalculator() {
  const [inputs, setInputs] = useState({
    concentrateVolume: "",
    concentrateUnit: "mL",
    dilutionRatio: "",
    desiredDilutedVolume: "",
    dilutedVolumeUnit: "mL",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const volumeToMl: Record<string, number> = {
    mL: 1,
    L: 1000,
    "fl oz": 29.5735,
    gal: 3785.41,
  };

  const results = useMemo(() => {
    const {
      concentrateVolume,
      concentrateUnit,
      dilutionRatio,
      desiredDilutedVolume,
      dilutedVolumeUnit,
    } = inputs;

    const concVolNum = parseFloat(concentrateVolume);
    const dilRatioNum = parseFloat(dilutionRatio);
    const desiredDilVolNum = parseFloat(desiredDilutedVolume);

    if (
      isNaN(concVolNum) ||
      concVolNum <= 0 ||
      !volumeToMl[concentrateUnit] ||
      (dilutionRatio === "" && desiredDilutedVolume === "")
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning:
          "Please enter a valid concentrate volume & unit, and either a dilution ratio or desired diluted volume.",
        formulaUsed: null,
      };
    }

    if (
      dilutionRatio !== "" &&
      (isNaN(dilRatioNum) || dilRatioNum <= 0 || dilRatioNum < 1)
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning:
          "Dilution ratio must be a number ≥ 1 (e.g., 10 means 1:10 dilution).",
        formulaUsed: null,
      };
    }

    if (
      desiredDilutedVolume !== "" &&
      (isNaN(desiredDilVolNum) || desiredDilVolNum <= 0)
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Desired diluted volume must be a positive number.",
        formulaUsed: null,
      };
    }

    const concVolMl = concVolNum * volumeToMl[concentrateUnit];

    if (dilutionRatio !== "") {
      const totalDilutedVolumeMl = concVolMl * dilRatioNum;
      const waterVolumeMl = totalDilutedVolumeMl - concVolMl;

      const totalDilutedVolumeDisplay =
        totalDilutedVolumeMl / volumeToMl[dilutedVolumeUnit];
      const waterVolumeDisplay = waterVolumeMl / volumeToMl[dilutedVolumeUnit];

      return {
        value: `${totalDilutedVolumeDisplay.toFixed(2)} ${dilutedVolumeUnit}`,
        label: "Total Diluted Volume",
        subtext: `Add ${waterVolumeDisplay.toFixed(
          2
        )} ${dilutedVolumeUnit} of water to ${concVolNum} ${concentrateUnit} of concentrate.`,
        warning: null,
        formulaUsed:
          "Total Diluted Volume = Concentrate Volume × Dilution Ratio (1:X)",
      };
    }

    if (desiredDilutedVolume !== "") {
      const desiredDilutedVolumeMl = desiredDilVolNum * volumeToMl[dilutedVolumeUnit];

      if (desiredDilutedVolumeMl < concVolMl) {
        return {
          value: "",
          label: "",
          subtext: "",
          warning:
            "Desired diluted volume must be greater than or equal to the concentrate volume.",
          formulaUsed: null,
        };
      }

      const dilutionRatioCalc = desiredDilutedVolumeMl / concVolMl;
      const waterVolumeMl = desiredDilutedVolumeMl - concVolMl;

      return {
        value: `1:${dilutionRatioCalc.toFixed(2)}`,
        label: "Dilution Ratio",
        subtext: `Add ${waterVolumeMl.toFixed(
          2
        )} mL of water to ${concVolNum} ${concentrateUnit} of concentrate.`,
        warning: null,
        formulaUsed:
          "Dilution Ratio (1:X) = Total Diluted Volume ÷ Concentrate Volume",
      };
    }

    return {
      value: "",
      label: "",
      subtext: "",
      warning: "Please provide either dilution ratio or desired diluted volume.",
      formulaUsed: null,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a cleaning dilution ratio?",
      answer:
        "A cleaning dilution ratio indicates how much water should be mixed with a concentrate to achieve an effective cleaning solution. Using the correct ratio ensures safety and optimizes cleaning performance.",
    },
    {
      question: "Can I use any units for volume?",
      answer:
        "Yes, this calculator supports milliliters (mL), liters (L), fluid ounces (fl oz), and gallons (gal). Ensure you select the correct units for both concentrate and diluted volumes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="concentrateVolume" className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            Concentrate Volume
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="concentrateVolume"
              type="number"
              placeholder="e.g., 100"
              value={inputs.concentrateVolume}
              onChange={(e) => handleInputChange("concentrateVolume", e.target.value)}
            />
            <Select
              value={inputs.concentrateUnit}
              onValueChange={(value) => handleInputChange("concentrateUnit", value)}
            >
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mL">mL</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="fl oz">fl oz</SelectItem>
                <SelectItem value="gal">gal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="dilutionRatio" className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-green-600" />
            Dilution Ratio (1:X)
          </Label>
          <Input
            id="dilutionRatio"
            type="number"
            placeholder="e.g., 10"
            value={inputs.dilutionRatio}
            onChange={(e) => {
              handleInputChange("dilutionRatio", e.target.value);
              if (e.target.value !== "") handleInputChange("desiredDilutedVolume", "");
            }}
          />
        </div>

        <div>
          <Label htmlFor="desiredDilutedVolume" className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-purple-600" />
            Desired Diluted Volume
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="desiredDilutedVolume"
              type="number"
              placeholder="e.g., 1000"
              value={inputs.desiredDilutedVolume}
              onChange={(e) => {
                handleInputChange("desiredDilutedVolume", e.target.value);
                if (e.target.value !== "") handleInputChange("dilutionRatio", "");
              }}
            />
            <Select
              value={inputs.dilutedVolumeUnit}
              onValueChange={(value) => handleInputChange("dilutedVolumeUnit", value)}
            >
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mL">mL</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="fl oz">fl oz</SelectItem>
                <SelectItem value="gal">gal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button variant="outline" onClick={() => setInputs({ concentrateVolume: "", concentrateUnit: "mL", dilutionRatio: "", desiredDilutedVolume: "", dilutedVolumeUnit: "mL" })} className="flex-1 h-11">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && results.value !== "" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">{results.formulaUsed}</p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 text-red-800 border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding the Basics</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cleaning dilution ratios indicate how much water should be mixed with a concentrate. The ratio 1:X means 1 part concentrate to X parts total solution.
        </p>
      </section>
      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 pb-4">
              <h3 className="font-bold text-xl mb-2">{item.question}</h3>
              <p className="text-slate-600">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cleaning Dilution Ratio Calculator"
      description="Calculate the perfect cleaning dilution ratio safely."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Total Volume = Concentrate × Ratio",
        variables: [{ symbol: "Ratio", description: "1:X Dilution" }]
      }}
      example={{
        title: "Example",
        scenario: "100mL concentrate at 1:10 ratio.",
        steps: [{ label: "1", explanation: "Add 900mL water to 100mL concentrate." }],
        result: "1000mL Total Solution"
      }}
      relatedCalculators={[]}
      onThisPage={[{ id: "what-is", label: "Understanding" }, { id: "faq", label: "FAQ" }]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}
