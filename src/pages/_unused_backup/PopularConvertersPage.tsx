// src/pages/PopularConvertersPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import CalculatorLink from "@/components/common/CalculatorLink";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PageWithRails from "@/components/layouts/PageWithRails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { getCategoryIcon } from "@/lib/navigation";
import { subcategoryIcon } from "@/data/calculatorRegistry";

type PopularItem = { label: string; to: string };
type PopularGroup = { title: string; key: string; color: string; bg: string; links: PopularItem[] };

const groups: PopularGroup[] = [
  { title: "Angle", key: "angle", color: "#22c55e", bg: "rgba(34,197,94,0.14)", links: [
    { label: "deg → rad", to: "/conversion/angle/deg-to-rad" },
    { label: "rad → deg", to: "/conversion/angle/rad-to-deg" },
    { label: "deg → mrad", to: "/conversion/angle/deg-to-mrad" },
    { label: "mrad → deg", to: "/conversion/angle/mrad-to-deg" },
  ]},
  { title: "Area", key: "area", color: "#06b6d4", bg: "rgba(6,182,212,0.14)", links: [
    { label: "sq ft → sq m", to: "/conversion/area/sqft-to-sqm" },
    { label: "sq m → sq ft", to: "/conversion/area/sqm-to-sqft" },
    { label: "sq mi → sq km", to: "/conversion/area/sqmi-to-sqkm" },
    { label: "sq km → sq mi", to: "/conversion/area/sqkm-to-sqmi" },
  ]},
  { title: "Cooking", key: "cooking", color: "#f97316", bg: "rgba(249,115,22,0.14)", links: [
    { label: "g → mL", to: "/conversion/cooking/g-to-ml" },
    { label: "mL → g", to: "/conversion/cooking/ml-to-g" },
    { label: "mg → mL", to: "/conversion/cooking/mg-to-ml" },
    { label: "mL → mg", to: "/conversion/cooking/ml-to-mg" },
  ]},
  { title: "Electrical", key: "electrical", color: "#f59e0b", bg: "rgba(245,158,11,0.14)", links: [
    { label: "kΩ → Ω", to: "/conversion/electrical/kohm-to-ohm" },
    { label: "MΩ → Ω", to: "/conversion/electrical/mohm-to-ohm" },
    { label: "Ω → kΩ", to: "/conversion/electrical/ohm-to-kohm" },
    { label: "mΩ → Ω", to: "/conversion/electrical/milliohm-to-ohm" },
  ]},
  { title: "Energy", key: "energy", color: "#3b82f6", bg: "rgba(59,130,246,0.14)", links: [
    { label: "kcal → cal", to: "/conversion/energy/kcal-to-cal" },
    { label: "MJ → kWh", to: "/conversion/energy/mj-to-kwh" },
    { label: "MWh → kWh", to: "/conversion/energy/mwh-to-kwh" },
    { label: "MMBTU → MWh", to: "/conversion/energy/mmbtu-to-mwh" },
  ]},
  { title: "Fuel Economy", key: "fuel-economy", color: "#14b8a6", bg: "rgba(20,184,166,0.14)", links: [
    { label: "mpg → km/L", to: "/conversion/fuel-economy/mpg-to-km-per-l" },
    { label: "km/L → mpg", to: "/conversion/fuel-economy/km-per-l-to-mpg" },
    { label: "mpg → L/100km", to: "/conversion/fuel-economy/mpg-to-l-per-100km" },
    { label: "L/100km → mpg", to: "/conversion/fuel-economy/l-per-100km-to-mpg" },
  ]},
  { title: "Length", key: "length", color: "#22c55e", bg: "rgba(34,197,94,0.14)", links: [
    { label: "in → cm", to: "/conversion/length/in-to-cm" },
    { label: "cm → in", to: "/conversion/length/cm-to-in" },
    { label: "ft → m", to: "/conversion/length/ft-to-m" },
    { label: "m → ft", to: "/conversion/length/m-to-ft" },
  ]},
  { title: "Speed", key: "speed", color: "#f59e0b", bg: "rgba(245,158,11,0.14)", links: [
    { label: "mph → km/h", to: "/conversion/speed/mph-to-kmh" },
    { label: "km/h → mph", to: "/conversion/speed/kmh-to-mph" },
    { label: "ft/s → mph", to: "/conversion/speed/fts-to-mph" },
    { label: "mph → m/s", to: "/conversion/speed/mph-to-ms" },
  ]},
  { title: "Temperature", key: "temperature", color: "#ef4444", bg: "rgba(239,68,68,0.14)", links: [
    { label: "°F → °C", to: "/conversion/temperature/f-to-c" },
    { label: "°C → °F", to: "/conversion/temperature/c-to-f" },
    { label: "°F → K", to: "/conversion/temperature/f-to-k" },
    { label: "°C → K", to: "/conversion/temperature/c-to-k" },
  ]},
  { title: "Time", key: "time", color: "#f97316", bg: "rgba(249,115,22,0.14)", links: [
    { label: "sec → min", to: "/conversion/time/sec-to-min" },
    { label: "min → sec", to: "/conversion/time/min-to-sec" },
    { label: "sec → hr", to: "/conversion/time/sec-to-hr" },
    { label: "hr → sec", to: "/conversion/time/hr-to-sec" },
  ]},
  { title: "Volume", key: "volume", color: "#3b82f6", bg: "rgba(59,130,246,0.14)", links: [
    { label: "tbsp → cups", to: "/conversion/volume/tbsp-to-cup" },
    { label: "cm³ → m³", to: "/conversion/volume/cm3-to-m3" },
    { label: "gal → L", to: "/conversion/volume/gal-to-l" },
    { label: "tsp → mL", to: "/conversion/volume/tsp-to-ml" },
  ]},
  { title: "Weight", key: "weight", color: "#a855f7", bg: "rgba(168,85,247,0.14)", links: [
    { label: "lb → kg", to: "/conversion/weight/lb-to-kg" },
    { label: "kg → lb", to: "/conversion/weight/kg-to-lb" },
    { label: "oz → g", to: "/conversion/weight/oz-to-g" },
    { label: "g → oz", to: "/conversion/weight/g-to-oz" },
  ]},
];

export default function PopularConvertersPage() {
  const navigate = useNavigate();
  const emoji = getCategoryIcon("conversion");
  const calculatorsCount = groups.reduce((acc, g) => acc + g.links.length, 0);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <SEOHead
        title="Popular Unit Converters · SmartKitNow"
        description="Twelve popular converter groups with quick links to common unit conversions."
        breadcrumbs={[
          { name: "Home", url: "https://www.smartkitnow.com/" },
          { name: "Conversion Calculators", url: "https://www.smartkitnow.com/conversion" },
          { name: "Popular Unit Converters", url: "https://www.smartkitnow.com/conversion/popular" },
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Popular Unit Converters",
          url: "https://www.smartkitnow.com/conversion/popular",
          description: "Quick links for common unit conversions.",
        }}
      />

      <Header />

      <main className="skn-offset-header pb-16 md:pb-24">
        <PageWithRails
          titleBlock={
            <div>
              <div className="mb-6">
                <Button
                  variant="default"
                  onClick={() => navigate("/conversion")}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: "#3c83f6", color: "#ffffff" }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
              <header className="mb-8">
                <div className="flex items-center gap-3">
                  <div
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl shadow-sm text-[20px] leading-none select-none"
                    style={{ backgroundColor: "#3c83f6", color: "#fff" }}
                    aria-hidden="true"
                  >
                    {emoji}
                  </div>
                  <h1 className="block text-[28px] md:text-[32px] font-bold tracking-[-0.01em]" style={{ color: "#5c82ee" }}>
                    Popular Unit Converters
                  </h1>
                </div>
                <div className="mt-2 text-sm skn-text-muted">
                  {calculatorsCount} converters
                </div>
                <div className="mt-3">
                  <div className="max-w-[740px]">
                    <p className="text-[15px] md:text-[16px] leading-[1.8]" style={{ color: "#747886" }}>
                      Twelve groups; each card contains four quick conversion links.
                    </p>
                  </div>
                </div>
              </header>
            </div>
          }
          showRails
          showTopBanner
          showBottomBanner
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {groups.map((group) => {
              return (
                <Card key={group.title} className="hover:shadow-soft transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <span
                      className="inline-flex items-center justify-center rounded-xl"
                      style={{ width: 40, height: 40, backgroundColor: group.bg, color: group.color }}
                      aria-hidden="true"
                    >
                      <span className="text-base leading-none" aria-hidden="true">{subcategoryIcon(group.key, "conversion")}</span>
                    </span>
                    <CardTitle className="text-xl font-bold" style={{ color: "#000000" }}>
                      {group.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2">
                    {group.links.map((lnk) => (
                      <CalculatorLink key={lnk.to} to={lnk.to} className="text-sm">
                        {lnk.label}
                      </CalculatorLink>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </PageWithRails>
      </main>

      <Footer />
    </div>
  );
}
