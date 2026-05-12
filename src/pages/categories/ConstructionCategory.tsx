import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdBannerTop from "../../components/ads/AdBannerTop";
import AdSidebarRight from "../../components/ads/AdSidebarRight";
import EmojiIcon from "../../components/ui/EmojiIcon";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import RegistryCategorySection from "@/components/RegistryCategorySection";
import SuggestionBox from "@/components/SuggestionBox";
import SEOHead from "@/components/SEOHead";

// Estrutura espelhada da página FinancialCategory

type Item = { name: string; slug: string };

// Concrete, Masonry & Foundations (10)
const concreteMasonryFoundations: Item[] = [
  { name: "Concrete Slab Volume Calculator", slug: "concrete-slab-volume" },
  { name: "Concrete Footing & Foundation Calculator", slug: "concrete-footing-foundation" },
  { name: "Concrete Block (CMU) Wall Calculator", slug: "concrete-block-cmu-wall" },
  { name: "Rebar Spacing & Quantity Calculator", slug: "rebar-spacing-quantity" },
  { name: "Mortar Mix Ratio & Bag Calculator", slug: "mortar-mix-ratio-bag" },
  { name: "Cement, Sand & Aggregate Ratio Calculator", slug: "cement-sand-aggregate-ratio" },
  { name: "Concrete Weight & Yield Calculator", slug: "concrete-weight-yield" },
  { name: "Concrete Curing Time Estimator", slug: "concrete-curing-time" },
  { name: "Brick Calculator", slug: "brick-calculator" },
  { name: "Retaining Wall Calculator", slug: "retaining-wall-calculator" },
];

// Lumber, Decking & Fencing (11)
const lumberDeckingFencing: Item[] = [
  { name: "Deck Board & Joist Spacing Calculator", slug: "deck-board-joist-spacing" },
  { name: "Stair Tread & Riser Dimensions Calculator", slug: "stair-tread-riser-dimensions" },
  { name: "Trim & Baseboard Length Estimator", slug: "trim-baseboard-length-estimator" },
  { name: "Hardwood Plank Quantity Calculator", slug: "hardwood-plank-quantity" },
  { name: "Laminate Flooring Waste Allowance Calculator", slug: "laminate-flooring-waste-allowance" },
  { name: "Carpet Roll & Waste Calculator", slug: "carpet-roll-waste" },
  { name: "Board Foot Calculator", slug: "board-foot" },
  { name: "Fence Post & Material Calculator (Linear Feet)", slug: "fence-post-material-linear-feet" },
  { name: "Tile Area & Grout Calculator", slug: "tile-area-grout" },
  { name: "Flooring Material Cost Estimator", slug: "flooring-material-cost" },
  { name: "Baluster Spacing Calculator", slug: "baluster-spacing-calculator" },
];

// Interior Surfaces & Finishes (8)
const interiorSurfacesFinishes: Item[] = [
  { name: "Drywall Area & Sheets Calculator", slug: "drywall-area-sheets" },
  { name: "Paint Coverage & Gallons Needed Calculator", slug: "paint-coverage-gallons" },
  { name: "Wallpaper Roll Coverage Calculator", slug: "wallpaper-roll-coverage" },
  { name: "Ceiling Tile Quantity Calculator", slug: "ceiling-tile-quantity" },
  { name: "Plaster Volume & Bag Estimator", slug: "plaster-volume-bag" },
  { name: "Acoustic Panel Area Planner", slug: "acoustic-panel-area" },
  { name: "Joint Compound Amount Calculator", slug: "joint-compound-amount" },
  { name: "Plywood Calculator", slug: "plywood-calculator" },
];

// Roofing, Siding & Site Prep (9)
const roofingSidingSitePrep: Item[] = [
  { name: "Roof Pitch & Slope Angle Calculator", slug: "roof-pitch-slope-angle" },
  { name: "Roof Shingle & Bundle Calculator", slug: "roof-shingle-bundle" },
  { name: "Metal Roofing Panel Coverage Calculator", slug: "metal-roof-panel-coverage" },
  { name: "Roof Underlayment Roll Estimator", slug: "roof-underlayment-roll" },
  { name: "Siding Panel Coverage Calculator", slug: "siding-panel-coverage" },
  { name: "Roof Drainage (Gutter Size) Calculator", slug: "gutter-size" },
  { name: "Hip Roof Calculator", slug: "hip-roof-calculator" },
  { name: "Gable Roof Calculator", slug: "gable-roof-calculator" },
  { name: "Excavation Calculator", slug: "excavation-calculator" },
];

// Insulation, HVAC & Energy (6)
const insulationHVACEnergy: Item[] = [
  { name: "Insulation R-Value Requirement Calculator", slug: "insulation-r-value-requirement" },
  { name: "HVAC BTU Requirement Calculator", slug: "hvac-btu-requirement" },
  { name: "Duct Size & Airflow Calculator", slug: "duct-size-airflow" },
  { name: "Heating Cost per Square Foot Estimator", slug: "heating-cost-per-square-foot" },
  { name: "Energy Efficiency Savings Estimator", slug: "energy-efficiency-savings" },
  { name: "CFM Calculator", slug: "cfm-calculator" },
];

const TOTAL =
  concreteMasonryFoundations.length +
  lumberDeckingFencing.length +
  interiorSurfacesFinishes.length +
  roofingSidingSitePrep.length +
  insulationHVACEnergy.length; // 44

export default function ConstructionCategory() {
  const [descExpanded, setDescExpanded] = useState(false);
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Construction Calculators | Smart Kit Now"
        description="Free construction calculators for concrete, drywall, paint, flooring, lumber, fencing, roofing, and building material estimates."
        canonical="https://www.smartkitnow.com/construction"
        robots="index,follow"
      />
      {/* empurra tudo abaixo do header fixo */}
      <div className="h-16 md:h-20" aria-hidden />
      <AdBannerTop />

      <main className="mx-auto pb-16" style={{ maxWidth: 1200 }}>
        <div className="relative xl:flex xl:justify-center xl:gap-12">
          {/* coluna esquerda: header + conteúdo */}
          <div className="w-full max-w-3xl mx-auto xl:mx-0 px-4 sm:px-6 min-w-0">
            {/* HERO */}
            <header className="py-6 mb-8">
              <div className="flex items-center gap-3">
                <EmojiIcon symbol="🧱" size={38} className="text-primary" label="Construction" />
                <h1 className="text-3xl md:text-4xl font-semibold text-primary">Construction Calculators</h1>
                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                  {TOTAL} tools
                </span>
              </div>
              <div className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-muted-foreground space-y-3">
                {descExpanded ? (
                  <>
                    <p>
                      Plan and estimate building materials, costs, and timelines with {TOTAL} construction calculators spanning concrete, masonry, lumber, interiors, roofing, siding, HVAC, and energy efficiency.
                    </p>
                    <p>
                      Compute concrete volumes, footing and foundation needs, CMU wall quantities, rebar spacing, mortar and aggregate ratios, concrete weight/yield, and curing times.
                    </p>
                    <p>
                      Size decks and stairs, estimate trim/baseboard length, hardwood and laminate quantities including waste, carpet rolls, board feet for rough lumber, fence posts/materials, tile area and grout, and total flooring material cost.
                    </p>
                    <p>
                      Cover interiors and finishes: drywall sheets, paint coverage, wallpaper rolls, ceiling tiles, plaster volume/bags, acoustic panel area, and joint compound quantities.
                    </p>
                    <p>
                      Prepare exteriors and site: roof pitch/slope, shingles/bundles, metal panel coverage, underlayment rolls, siding panels, and gutter sizing. Optimize comfort and savings with insulation R-values, HVAC BTU requirements, duct sizing/airflow, heating cost per sq ft, and energy savings estimates.
                    </p>
                  </>
                ) : (
                  <p className="line-clamp-3">
                    {TOTAL} construction tools: concrete volumes and foundations, CMU walls, rebar, mortar and aggregate ratios, concrete weight/yield, curing times; decking, stairs, trim/baseboards, hardwood/laminate waste, carpet rolls, board feet, fencing materials, tile area & grout, flooring cost; interiors (drywall, paint, wallpaper, ceiling tiles, plaster, acoustic panels, joint compound); roofing/siding/site prep (pitch, shingles, metal panels, underlayment, siding, gutters); insulation/HVAC/energy (R-values, BTU, duct, heating cost, savings).
                  </p>
                )}
                {!descExpanded && (
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center rounded-md border px-3 py-1 text-sm text-primary hover:underline"
                    onClick={() => setDescExpanded(true)}
                    aria-expanded={descExpanded}
                  >
                    Read More
                  </button>
                )}
              </div>
            </header>

            <Section
              emoji="🧱"
              title={`Concrete, Masonry & Foundations (${concreteMasonryFoundations.length})`}
              description="Compute slab volume, footing/foundation requirements, CMU wall quantities, rebar spacing and counts, mortar mix and bag needs, cement/sand/aggregate ratios, concrete weight/yield, curing time; plus brick quantities and retaining wall estimates."
              items={concreteMasonryFoundations}
              base="/construction"
            />

            <Section
              emoji="🪵"
              title={`Lumber, Decking & Fencing (${lumberDeckingFencing.length})`}
              description="Deck board/joist spacing, stair tread/riser dimensions, trim/baseboard length, hardwood plank quantity, laminate waste allowance, carpet roll/waste, board foot volume, fence posts/materials, tile area & grout, flooring material cost, and baluster spacing."
              items={lumberDeckingFencing}
              base="/construction"
            />

            <Section
              emoji="🎨"
              title={`Interior Surfaces & Finishes (${interiorSurfacesFinishes.length})`}
              description="Drywall sheets, paint coverage and gallons, wallpaper roll coverage, ceiling tile quantities, plaster volume/bags, acoustic panel area planning, joint compound amounts, and plywood sheet estimates."
              items={interiorSurfacesFinishes}
              base="/construction"
            />

            <Section
              emoji="🏠"
              title={`Roofing, Siding & Site Prep (${roofingSidingSitePrep.length})`}
              description="Roof pitch/slope angle, shingle bundles, metal roofing panel coverage, underlayment roll estimates, siding panel coverage, gutter size for drainage, hip/gable roof calculators, and excavation volume estimates."
              items={roofingSidingSitePrep}
              base="/construction"
            />

            <Section
              emoji="🌡️"
              title={`Insulation, HVAC & Energy (${insulationHVACEnergy.length})`}
              description="Insulation R-value requirements, HVAC BTU sizing, duct size and airflow, heating cost per square foot, energy efficiency savings estimation, and CFM airflow calculations."
              items={insulationHVACEnergy}
              base="/construction"
            />

            {/* All construction calculators from registry — ensures every tool gets at least one internal link */}
            <RegistryCategorySection
              category="construction"
              title="More Construction Calculators"
              className="mt-10"
            />

                        {/* Boxes inferiores: Share + Suggest embutido */}
            <div className="mt-14 space-y-6">
              <ShareThisPageBox />
              <SuggestionBox />
            </div>
          </div>

          {/* Coluna do right rail */}
          <aside className="hidden xl:block w-[300px] flex-shrink-0">
            <div className="sticky" style={{ top: "var(--skn-rail-top)" }}>
              <AdSidebarRight topOffset={0} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ---------- helpers ---------- */

function splitTwoColumns<T>(arr: T[]) {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

function Section({
  emoji,
  title,
  description,
  items,
  base,
}: {
  emoji: string; // emoji colorido no título da seção
  title: string;
  description: string;
  items: Item[];
  base: string;
}) {
  const [left, right] = splitTwoColumns(items);

  return (
    <section className="mb-12">
      {/* título da seção com emoji colorido */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-grid place-items-center h-8 w-8 rounded-lg border bg-card">
          <EmojiIcon symbol={emoji} size={20} />
        </span>
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
      </div>

      <p className="text-sm md:text-base text-muted-foreground mb-5 leading-relaxed">{description}</p>

      {/* LISTA EM DUAS COLUNAS */}
      <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
        <ul className="list-disc ml-6 space-y-2.5">
          {left.map((it) => (
            <li key={it.slug} className="leading-relaxed">
              <Link
                to={`${base}/${it.slug}`}
                className="text-primary hover:underline text-base md:text-[1.05rem] font-medium"
              >
                {it.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="list-disc ml-6 space-y-2.5">
          {right.map((it) => (
            <li key={it.slug} className="leading-relaxed">
              <Link
                to={`${base}/${it.slug}`}
                className="text-primary hover:underline text-base md:text-[1.05rem] font-medium"
              >
                {it.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
