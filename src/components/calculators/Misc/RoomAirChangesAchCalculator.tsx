import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RoomAirChangesAchCalculator() {
  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    height: "",
    ventilationRate: "",
    ventilationUnit: "CFM",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Calculation logic:
   * ACH = (Q × 60) / V
   * Where:
   * Q = volumetric airflow rate (cubic feet per minute, CFM)
   * V = room volume (cubic feet)
   * 60 = minutes per hour (to convert CFM to cubic feet per hour)
   *
   * If ventilation rate is given in other units (e.g., m³/h), convert accordingly.
   */

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const height = parseFloat(inputs.height);
    const ventilationRate = parseFloat(inputs.ventilationRate);
    const ventilationUnit = inputs.ventilationUnit;

    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(height) ||
      isNaN(ventilationRate) ||
      length <= 0 ||
      width <= 0 ||
      height <= 0 ||
      ventilationRate <= 0
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid positive numbers for all fields.",
        formulaUsed: null,
      };
    }

    // Calculate room volume in cubic feet
    const volumeCubicFeet = length * width * height;

    // Convert ventilation rate to CFM if needed
    // Supported units: CFM (cubic feet per minute), m³/h (cubic meters per hour)
    let ventilationCFM = ventilationRate;
    if (ventilationUnit === "m3h") {
      // 1 cubic meter = 35.3147 cubic feet
      // ventilationRate is in m³/h, convert to CFM:
      // (m³/h) * (35.3147 ft³/m³) / 60 (min/h) = CFM
      ventilationCFM = (ventilationRate * 35.3147) / 60;
    }

    // ACH calculation
    const ach = (ventilationCFM * 60) / volumeCubicFeet;

    return {
      value: ach.toFixed(2),
      label: "Air Changes per Hour (ACH)",
      subtext: `Calculated using room volume of ${volumeCubicFeet.toFixed(
        2
      )} ft³ and ventilation rate of ${ventilationRate} ${
        ventilationUnit === "CFM" ? "CFM" : "m³/h"
      }.`,
      warning: null,
      formulaUsed:
        "ACH = (Ventilation Rate (CFM) × 60) / Room Volume (cubic feet)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is ACH and why does it matter?",
      answer: "ACH (Air Changes per Hour) measures how many times all air in a room is completely replaced hourly. Higher ACH improves air quality and reduces airborne contaminants by 50-90% depending on filtration type.",
    },
    {
      question: "How do I calculate ACH for my room?",
      answer: "Divide your HVAC system's CFM (cubic feet per minute) by your room's volume in cubic feet, then multiply by 60. The calculator automates this: ACH = (CFM × 60) ÷ Room Volume.",
    },
    {
      question: "What ACH level is recommended for residential spaces?",
      answer: "Most residential standards recommend 3-5 ACH for living spaces and 6-8 ACH for bedrooms with allergies or respiratory concerns. Hospital ICUs require 12-15 ACH.",
    },
    {
      question: "Does room size affect the ACH calculation?",
      answer: "Yes, significantly—larger rooms require higher CFM to achieve the same ACH. A 1,000 CFM system achieves 6 ACH in a 10,000 cu ft room but 12 ACH in a 5,000 cu ft room.",
    },
    {
      question: "Can I improve ACH without upgrading my HVAC system?",
      answer: "Yes—portable air purifiers with HEPA filters can add 2-4 ACH, and closing unused rooms concentrates airflow and increases effective ACH in occupied spaces.",
    },
    {
      question: "What CFM do I need to achieve 6 ACH?",
      answer: "Multiply your room volume by 6, then divide by 60. For a 2,000 cu ft room: (2,000 × 6) ÷ 60 = 200 CFM required.",
    },
    {
      question: "How does ACH relate to COVID-19 and virus transmission?",
      answer: "Studies show ACH &gt;6 with HEPA filtration reduces airborne virus transmission by 99% within 15-30 minutes, making it critical for healthcare and public spaces.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="length" className="mb-1 flex items-center gap-1">
              <Home className="w-4 h-4 text-blue-600" /> Room Length (feet)
            </Label>
            <Input
              id="length"
              type="number"
              min="0"
              step="any"
              value={inputs.length}
              onChange={(e) => handleInputChange("length", e.target.value)}
              placeholder="e.g., 20"
            />
          </div>
          <div>
            <Label htmlFor="width" className="mb-1 flex items-center gap-1">
              <Home className="w-4 h-4 text-blue-600" /> Room Width (feet)
            </Label>
            <Input
              id="width"
              type="number"
              min="0"
              step="any"
              value={inputs.width}
              onChange={(e) => handleInputChange("width", e.target.value)}
              placeholder="e.g., 15"
            />
          </div>
          <div>
            <Label htmlFor="height" className="mb-1 flex items-center gap-1">
              <Home className="w-4 h-4 text-blue-600" /> Room Height (feet)
            </Label>
            <Input
              id="height"
              type="number"
              min="0"
              step="any"
              value={inputs.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              placeholder="e.g., 8"
            />
          </div>
          <div>
            <Label htmlFor="ventilationRate" className="mb-1 flex items-center gap-1">
              <Wrench className="w-4 h-4 text-green-600" /> Ventilation Rate
            </Label>
            <div className="flex gap-2">
              <Input
                id="ventilationRate"
                type="number"
                min="0"
                step="any"
                value={inputs.ventilationRate}
                onChange={(e) => handleInputChange("ventilationRate", e.target.value)}
                placeholder="e.g., 100"
                className="flex-1"
              />
              <Select
                value={inputs.ventilationUnit}
                onValueChange={(v) => handleInputChange("ventilationUnit", v)}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CFM">CFM (ft³/min)</SelectItem>
                  <SelectItem value="m3h">m³/h (m³/hr)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate ACH"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              length: "",
              width: "",
              height: "",
              ventilationRate: "",
              ventilationUnit: "CFM",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700">
          <CardContent className="text-yellow-800 dark:text-yellow-300 text-center font-semibold">
            <AlertTriangle className="mx-auto mb-2 w-6 h-6" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            <p className="mt-3 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Room Air Changes per Hour (ACH) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Room ACH Calculator determines how frequently all air in your space is fully replaced per hour. This metric is essential for HVAC design, air quality assessment, and compliance with health standards in residential, commercial, and medical settings.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your room's length, width, and height (or total cubic footage), along with your HVAC system's CFM (cubic feet per minute) rating. Most HVAC specs list CFM on the unit nameplate or system documentation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator instantly shows your ACH value and compares it against industry benchmarks. Higher ACH indicates better air quality, faster contaminant removal, and improved respiratory health. Use results to identify if upgrades (higher-capacity fans, additional purifiers) are needed.</p>
        </div>
      </section>

      {/* TABLE: Recommended ACH Levels by Room Type (2024 Standards) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended ACH Levels by Room Type (2024 Standards)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different spaces require varying air change rates based on occupancy and contamination risk.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended ACH</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Residential Living Room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">General comfort and odor control</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bedroom</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sleep quality and allergy management</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kitchen</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cooking odor and moisture removal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bathroom</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Humidity and odor extraction</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Office</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Employee health and productivity</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Classroom</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Disease prevention and focus</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hospital Patient Room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Infection control protocols</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Surgical Suite</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sterile environment requirement</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Restaurant</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Food odor and grease management</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values based on ASHRAE 62.1 and CDC guidelines as of 2024.</p>
      </section>

      {/* TABLE: CFM Requirements by Room Volume (for 6 ACH Target) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">CFM Requirements by Room Volume (for 6 ACH Target)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to estimate your HVAC system's required CFM output based on room size.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Volume (cu ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">CFM Needed (6 ACH)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">System Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Portable air purifier</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Window unit or small system</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mid-range residential HVAC</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard residential system</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large room or office</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Commercial/industrial system</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large warehouse/facility</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hospital wing or lab</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Formula: CFM = (Room Volume × Desired ACH) ÷ 60. Actual requirements vary by ductwork efficiency.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure room dimensions accurately in feet—errors of 1-2 feet can shift ACH by 10-15% and affect compliance decisions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your HVAC system's actual CFM output, not nameplate capacity, as ductwork friction and filter restrictions reduce real airflow by 20-30%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Seal air leaks and close doors to prevent backdrafts, which reduce effective ACH by forcing recirculation instead of fresh replacement.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine your HVAC system ACH with portable HEPA purifiers to add 2-4 supplemental ACH in high-risk areas like nurseries or recovery rooms.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing CFM with ACH</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">CFM is airflow rate; ACH is how many complete room air replacements occur hourly—you must divide CFM by room volume to get ACH.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring ductwork losses</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Real CFM delivery is typically 15-30% lower than nameplate CFM due to filter resistance, duct friction, and bend losses.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using only outdoor air without recirculation filters</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">100% outdoor air ACH 10 still allows contaminants in; pair with HEPA filtration to achieve meaningful air quality improvements.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Calculating ACH for combined multi-room spaces</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">ACH must be calculated per room separately—combining volumes masks inadequate airflow in isolated pockets.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is ACH and why does it matter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">ACH (Air Changes per Hour) measures how many times all air in a room is completely replaced hourly. Higher ACH improves air quality and reduces airborne contaminants by 50-90% depending on filtration type.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate ACH for my room?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Divide your HVAC system's CFM (cubic feet per minute) by your room's volume in cubic feet, then multiply by 60. The calculator automates this: ACH = (CFM × 60) ÷ Room Volume.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What ACH level is recommended for residential spaces?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most residential standards recommend 3-5 ACH for living spaces and 6-8 ACH for bedrooms with allergies or respiratory concerns. Hospital ICUs require 12-15 ACH.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does room size affect the ACH calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, significantly—larger rooms require higher CFM to achieve the same ACH. A 1,000 CFM system achieves 6 ACH in a 10,000 cu ft room but 12 ACH in a 5,000 cu ft room.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I improve ACH without upgrading my HVAC system?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—portable air purifiers with HEPA filters can add 2-4 ACH, and closing unused rooms concentrates airflow and increases effective ACH in occupied spaces.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What CFM do I need to achieve 6 ACH?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiply your room volume by 6, then divide by 60. For a 2,000 cu ft room: (2,000 × 6) ÷ 60 = 200 CFM required.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does ACH relate to COVID-19 and virus transmission?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Studies show ACH &gt;6 with HEPA filtration reduces airborne virus transmission by 99% within 15-30 minutes, making it critical for healthcare and public spaces.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.ashrae.org/technical-resources/standards-and-guidelines" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASHRAE 62.1 Ventilation Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative HVAC ventilation rates and ACH requirements for all building types and occupancy classifications.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/coronavirus/2019-ncov/community/ventilation.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC Guidelines on Ventilation and Air Quality</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal guidance linking ACH levels to airborne disease transmission risk in public and healthcare facilities.</p>
          </li>
          <li>
            <a href="https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NFPA 101 Life Safety Code</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Building safety standards specifying minimum ACH requirements for occupancy classifications and emergency egress.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/indoor-air-quality-iaq" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Indoor Air Quality Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Residential and commercial air quality benchmarks and ACH recommendations for homes, offices, and schools.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Room Air Changes per Hour (ACH) Calculator"
      description="Calculate Air Changes per Hour (ACH). Measure ventilation efficiency and air quality turnover rates for any room size."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "ACH = (Ventilation Rate (CFM) × 60) / Room Volume (cubic feet)",
        variables: [
          { symbol: "ACH", description: "Air Changes per Hour" },
          { symbol: "Ventilation Rate (CFM)", description: "Volumetric airflow rate in cubic feet per minute" },
          { symbol: "Room Volume", description: "Room volume in cubic feet (Length × Width × Height)" },
          { symbol: "60", description: "Conversion factor from minutes to hours" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Calculate the ACH for a conference room measuring 20 feet long, 15 feet wide, and 8 feet high, with a ventilation system supplying 120 CFM.",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate the room volume: 20 ft × 15 ft × 8 ft = 2400 cubic feet.",
          },
          {
            label: "Step 2",
            explanation: "Use the formula: ACH = (120 CFM × 60) / 2400 ft³ = 3 ACH.",
          },
          {
            label: "Step 3",
            explanation: "Interpret the result: The air in the room is replaced 3 times per hour.",
          },
        ],
        result: "The conference room has an ACH of 3, which is suitable for general office spaces but may be low for healthcare or laboratory environments.",
      }}
      relatedCalculators={[
        { title: "Event Capacity Calculator", url: "/everyday/event-capacity-calculator", icon: "💡" },
        { title: "Home Renovation Cost Estimator", url: "/everyday/home-renovation-cost-estimator", icon: "🏠" },
        { title: "Event Budget Calculator", url: "/everyday/event-budget-calculator", icon: "💡" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday/water-heater-recovery-time", icon: "💧" },
        { title: "Steps → Distance Converter", url: "/everyday/steps-to-distance-converter", icon: "💡" },
        { title: "Rainwater Barrel Days of Supply", url: "/everyday/rainwater-barrel-days-supply", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}