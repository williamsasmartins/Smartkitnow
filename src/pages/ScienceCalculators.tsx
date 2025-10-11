import CategoryCalculatorsTemplate from "@/components/layouts/CategoryCalculatorsTemplate";

const scienceData = {
  "chemistry": {
    title: "Chemistry Calculators",
    description: "Chemical calculations for molarity, pH, molecular mass, and reactions",
    calculators: [
      { key: "molar-mass", name: "Molar Mass Calculator", description: "Calculate molecular weight of compounds" },
      { key: "molarity", name: "Molarity Calculator", description: "Calculate solution concentration" },
      { key: "ph", name: "pH Calculator", description: "Calculate pH from H+ concentration" },
      { key: "percent-yield", name: "Percent Yield Calculator", description: "Calculate reaction efficiency" },
      { key: "grams-to-moles", name: "Grams to Moles Calculator", description: "Convert mass to moles" },
      { key: "atoms-to-moles", name: "Atoms to Moles Calculator", description: "Convert atoms to moles using Avogadro's number" },
      { key: "liters-to-moles", name: "Liters to Moles Calculator", description: "Convert gas volume to moles at STP" },
      { key: "ppm", name: "PPM Calculator", description: "Calculate parts per million concentration" },
      { key: "mg-l-to-ppm", name: "mg/L to PPM Converter", description: "Convert milligrams per liter to PPM" },
      { key: "theoretical-yield", name: "Theoretical Yield Calculator", description: "Calculate maximum possible product yield" }
    ]
  },
  "density": {
    title: "Density Calculators",
    description: "Density and weight calculations for various materials",
    calculators: [
      { key: "density", name: "Density Calculator", description: "Calculate density from mass and volume" },
      { key: "water-weight", name: "Water Weight Calculator", description: "Calculate weight of water by volume" },
      { key: "metal-weight", name: "Metal Weight Calculator", description: "Calculate weight of metal objects" }
    ]
  },
  "physics": {
    title: "Physics Calculators",
    description: "Physics calculations for mechanics, waves, and thermodynamics",
    calculators: [
      { key: "force", name: "Force Calculator", description: "Calculate force using Newton's second law" },
      { key: "acceleration", name: "Acceleration Calculator", description: "Calculate acceleration from velocity change" },
      { key: "velocity", name: "Velocity Calculator", description: "Calculate velocity from displacement and time" },
      { key: "speed", name: "Speed Calculator", description: "Calculate speed from distance and time" },
      { key: "momentum", name: "Momentum Calculator", description: "Calculate momentum from mass and velocity" },
      { key: "gravitational-force", name: "Gravitational Force Calculator", description: "Calculate gravitational attraction" },
      { key: "frequency", name: "Frequency Calculator", description: "Calculate wave frequency" },
      { key: "wavelength", name: "Wavelength Calculator", description: "Calculate wavelength from frequency" },
      { key: "specific-heat", name: "Specific Heat Calculator", description: "Calculate heat capacity of materials" },
      { key: "spring-constant", name: "Spring Constant Calculator", description: "Calculate spring constant from Hooke's law" }
    ]
  }
};

export default function ScienceCalculators() {
  return (
    <CategoryCalculatorsTemplate
      category="science"
      description="Explore scientific calculators across physics, chemistry, and general science."
      canonical="https://www.smartkitnow.com/science"
      titleOverride={undefined}
      breadcrumbsOverride={undefined}
      marginTopClass="mt-[156px] md:mt-[176px]"
      showRightRail={true}
      showTopBanner={true}
      showBottomBanner={true}
      railsSticky={false}
      backTo="/"
    />
  );
}