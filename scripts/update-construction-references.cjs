const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/components/calculators/Construction');

// Map of filenames to topics and categories for better link generation
const fileMap = {
    // Concrete & Masonry
    'ConcreteSlabVolumeCalculator.tsx': { topic: 'Concrete Slab Calculation', category: 'Construction', sub: 'Concrete' },
    'ConcreteFootingFoundationCalculator.tsx': { topic: 'Concrete Footings', category: 'Construction', sub: 'Concrete' },
    'ConcreteBlockCmuWallCalculator.tsx': { topic: 'Concrete Masonry Unit', category: 'Construction', sub: 'Masonry' },
    'RebarSpacingQuantityCalculator.tsx': { topic: 'Rebar Reinforcement', category: 'Construction', sub: 'Concrete' },
    'MortarMixRatioBagCalculator.tsx': { topic: 'Mortar Mix', category: 'Construction', sub: 'Masonry' },
    'CementSandAggregateRatioCalculator.tsx': { topic: 'Concrete Mix Ratios', category: 'Construction', sub: 'Concrete' },
    'ConcreteWeightYieldCalculator.tsx': { topic: 'Concrete Weight', category: 'Construction', sub: 'Concrete' },
    'ConcreteCuringTimeCalculator.tsx': { topic: 'Concrete Curing', category: 'Construction', sub: 'Concrete' },
    'BrickCalculator.tsx': { topic: 'Brickwork Calculation', category: 'Construction', sub: 'Masonry' },
    'RetainingWallCalculator.tsx': { topic: 'Retaining Wall Design', category: 'Construction', sub: 'Masonry' },

    // Lumber & Decking
    'DeckBoardJoistSpacingCalculator.tsx': { topic: 'Deck Joist Spacing', category: 'Construction', sub: 'Carpentry' },
    'StairTreadRiserDimensionsCalculator.tsx': { topic: 'Stair Dimensions', category: 'Construction', sub: 'Carpentry' },
    'TrimBaseboardLengthEstimatorCalculator.tsx': { topic: 'Trim Carpentry', category: 'Construction', sub: 'Carpentry' },
    'HardwoodPlankQuantityCalculator.tsx': { topic: 'Hardwood Flooring', category: 'Construction', sub: 'Flooring' },
    'LaminateFlooringWasteAllowanceCalculator.tsx': { topic: 'Laminate Flooring', category: 'Construction', sub: 'Flooring' },
    'CarpetRollWasteCalculator.tsx': { topic: 'Carpet Installation', category: 'Construction', sub: 'Flooring' },
    'BoardFootCalculator.tsx': { topic: 'Board Foot Measurement', category: 'Construction', sub: 'Carpentry' },
    'FencePostMaterialLinearFeetCalculator.tsx': { topic: 'Fence Construction', category: 'Construction', sub: 'Landscaping' },
    'TileAreaGroutCalculator.tsx': { topic: 'Tile Installation', category: 'Construction', sub: 'Flooring' },
    'FlooringMaterialCostCalculator.tsx': { topic: 'Flooring Cost Estimation', category: 'Construction', sub: 'Flooring' },
    'BalusterSpacingCalculator.tsx': { topic: 'Baluster Spacing', category: 'Construction', sub: 'Carpentry' },

    // Interior
    'DrywallAreaSheetsCalculator.tsx': { topic: 'Drywall Installation', category: 'Construction', sub: 'Interior' },
    'PaintCoverageGallonsCalculator.tsx': { topic: 'Paint Coverage', category: 'Construction', sub: 'Interior' },
    'WallpaperRollCoverageCalculator.tsx': { topic: 'Wallpaper Hanging', category: 'Construction', sub: 'Interior' },
    'CeilingTileQuantityCalculator.tsx': { topic: 'Drop Ceiling Installation', category: 'Construction', sub: 'Interior' },
    'PlasterVolumeBagCalculator.tsx': { topic: 'Plastering', category: 'Construction', sub: 'Interior' },
    'AcousticPanelAreaCalculator.tsx': { topic: 'Acoustic Treatment', category: 'Construction', sub: 'Interior' },
    'JointCompoundAmountCalculator.tsx': { topic: 'Drywall Mudding', category: 'Construction', sub: 'Interior' },
    'PlywoodCalculator.tsx': { topic: 'Plywood Sheathing', category: 'Construction', sub: 'Carpentry' },

    // Roofing & Siding
    'RoofPitchSlopeAngleCalculator.tsx': { topic: 'Roof Pitch', category: 'Construction', sub: 'Roofing' },
    'RoofShingleBundleCalculator.tsx': { topic: 'Roof Shingles', category: 'Construction', sub: 'Roofing' },
    'MetalRoofPanelCoverageCalculator.tsx': { topic: 'Metal Roofing', category: 'Construction', sub: 'Roofing' },
    'RoofUnderlaymentRollCalculator.tsx': { topic: 'Roof Underlayment', category: 'Construction', sub: 'Roofing' },
    'SidingPanelCoverageCalculator.tsx': { topic: 'Siding Installation', category: 'Construction', sub: 'Exterior' },
    'GutterSizeCalculator.tsx': { topic: 'Rain Gutters', category: 'Construction', sub: 'Exterior' },
    'HipRoofCalculator.tsx': { topic: 'Hip Roof Framing', category: 'Construction', sub: 'Roofing' },
    'GableRoofCalculator.tsx': { topic: 'Gable Roof Framing', category: 'Construction', sub: 'Roofing' },
    'ExcavationCalculator.tsx': { topic: 'Excavation Calculation', category: 'Construction', sub: 'Site Work' },

    // HVAC & Energy
    'InsulationRValueRequirementCalculator.tsx': { topic: 'Insulation R-Value', category: 'Construction', sub: 'HVAC' },
    'HvacBtuRequirementCalculator.tsx': { topic: 'HVAC Sizing', category: 'Construction', sub: 'HVAC' },
    'DuctSizeAirflowCalculator.tsx': { topic: 'Ductwork Sizing', category: 'Construction', sub: 'HVAC' },
    'HeatingCostPerSquareFootCalculator.tsx': { topic: 'Heating Costs', category: 'Construction', sub: 'HVAC' },
    'EnergyEfficiencySavingsCalculator.tsx': { topic: 'Home Energy Efficiency', category: 'Construction', sub: 'HVAC' },
    'CfmCalculator.tsx': { topic: 'Airflow CFM', category: 'Construction', sub: 'HVAC' },
};

function getLinks(info) {
    const topic = info.topic;
    const encodedTopic = encodeURIComponent(topic);
    const links = [];

    // 1. This Old House (Great for DIY/Construction)
    links.push({
        title: `${topic} - This Old House`,
        url: `https://www.thisoldhouse.com/search?q=${encodedTopic}`,
        desc: `Professional advice, step-by-step tutorials, and expert videos on ${topic} from the trusted team at This Old House.`
    });

    // 2. Family Handyman
    links.push({
        title: `${topic} - The Family Handyman`,
        url: `https://www.familyhandyman.com/?s=${encodedTopic}`,
        desc: `Practical DIY guides, project plans, and tool reviews for ${topic}, helping you get the job done right.`
    });

    // 3. Category Specific
    if (info.sub === 'Concrete' || info.sub === 'Masonry') {
        links.push({
            title: `${topic} - Concrete Network`,
            url: `https://www.concretenetwork.com/search.html?q=${encodedTopic}`,
            desc: `The leading source for concrete information, including design ideas, contractor directories, and technical guides for ${topic}.`
        });
        links.push({
            title: `${topic} - Portland Cement Association`,
            url: `https://www.cement.org/search-results?indexCatalogue=site-search&searchQuery=${encodedTopic}&wordsMode=0`,
            desc: `Technical resources and industry standards for cement and concrete applications related to ${topic}.`
        });
    } else if (info.sub === 'Carpentry' || info.sub === 'Flooring' || info.sub === 'Roofing') {
        links.push({
            title: `${topic} - Fine Homebuilding`,
            url: `https://www.finehomebuilding.com/?s=${encodedTopic}`,
            desc: `Expert articles and detailed construction techniques for ${topic} from professional builders and craftsmen.`
        });
        links.push({
            title: `${topic} - ConstructConnect`,
            url: `https://www.constructconnect.com/blog/search?term=${encodedTopic}`,
            desc: `Construction industry insights, cost data, and project management tips relevant to ${topic}.`
        });
    } else if (info.sub === 'HVAC' || info.sub === 'Interior') {
        links.push({
            title: `${topic} - Energy.gov`,
            url: `https://www.energy.gov/search/site?keywords=${encodedTopic}`,
            desc: `Official Department of Energy guidelines for energy efficiency and ${topic} to save money and improve home comfort.`
        });
        links.push({
            title: `${topic} - ASHRAE`,
            url: `https://www.ashrae.org/search?q=${encodedTopic}`,
            desc: `Technical standards and guidelines for HVAC and building systems related to ${topic}.`
        });
    } else {
        // Fallback for general construction
        links.push({
            title: `${topic} - Construction Dive`,
            url: `https://www.constructiondive.com/search/?q=${encodedTopic}`,
            desc: `Latest news and trends in the construction industry regarding ${topic}.`
        });
    }

    return links;
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
let modifiedCount = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const info = fileMap[file];
    if (!info) {
        console.log(`Skipping ${file} - no mapping found`);
        return;
    }

    const links = getLinks(info);
    
    const listItems = links.map(link => `
          <li>
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              ${link.title}
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              ${link.desc}
            </p>
          </li>`).join('');

    const newSection = `
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
${listItems}
        </ul>
      </section>`;

    // Insert logic
    // 1. Check if section exists (replace it)
    const sectionRegex = /<section id="references"[\s\S]*?<\/section>/;
    
    if (sectionRegex.test(content)) {
        content = content.replace(sectionRegex, newSection.trim());
        console.log(`Updated references in ${file}`);
        modifiedCount++;
    } else {
        // 2. If not, append it after the last section in editorial
        // Usually after FAQ section
        const faqSectionRegex = /<section id="faq"[\s\S]*?<\/section>/;
        if (faqSectionRegex.test(content)) {
             content = content.replace(faqSectionRegex, `$&${newSection}`);
             
             // Also update onThisPage
             const onThisPageRegex = /(onThisPage=\{\[\s*[\s\S]*?)(\s*\]\})/;
             if (onThisPageRegex.test(content)) {
                 // Check if already in onThisPage
                 if (!content.includes('id: "references"')) {
                    // Try to insert cleanly
                    // Find the last item before ]}
                    const lastItemRegex = /({[^}]+label:\s*"FAQ"[^}]+})/;
                    if (lastItemRegex.test(content)) {
                         content = content.replace(lastItemRegex, `$1,\n        { id: "references", label: "References & Resources" }`);
                    } else {
                        content = content.replace(/(\s*\]\}\s*showTopBanner)/, `,\n        { id: "references", label: "References & Resources" }$1`);
                    }
                 }
             }
             
             console.log(`Added references to ${file}`);
             modifiedCount++;
        } else {
            console.log(`Could not find FAQ section in ${file}`);
        }
    }
    
    fs.writeFileSync(filePath, content);
});

console.log(`Total files processed: ${modifiedCount}`);
