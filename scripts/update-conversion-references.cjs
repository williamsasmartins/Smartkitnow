const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.join(__dirname, '../src/components/calculators/Conversion');

// Map filenames to specific subcategories/topics for better link targeting
const FILE_MAPPING = {
  // Core Units
  'LengthMFtInCalculator.tsx': { topic: 'Length Conversion', sub: 'Core' },
  'AreaM2Ft2Calculator.tsx': { topic: 'Area Conversion', sub: 'Core' },
  'VolumeLMlGalOzCalculator.tsx': { topic: 'Volume Conversion', sub: 'Core' },
  'MassKgLbOzCalculator.tsx': { topic: 'Mass Weight Conversion', sub: 'Core' },
  'TemperatureCFKCalculator.tsx': { topic: 'Temperature Conversion', sub: 'Core' },
  'DensityGPerMlKgPerM3Calculator.tsx': { topic: 'Density Conversion', sub: 'Core' },
  'AngleDegRadCalculator.tsx': { topic: 'Angle Conversion', sub: 'Core' },
  'SpeedMpsKmphMphCalculator.tsx': { topic: 'Speed Conversion', sub: 'Core' },

  // Mechanics & Pressure
  'ForceNLbfCalculator.tsx': { topic: 'Force Conversion', sub: 'Mechanics' },
  'EnergyJCalKwhCalculator.tsx': { topic: 'Energy Conversion', sub: 'Mechanics' },
  'PowerWHpCalculator.tsx': { topic: 'Power Conversion', sub: 'Mechanics' },
  'PressurePaBarPsiCalculator.tsx': { topic: 'Pressure Conversion', sub: 'Mechanics' },
  'TorqueNmLbfftCalculator.tsx': { topic: 'Torque Conversion', sub: 'Mechanics' },
  'WorkPotentialEnergyCalculator.tsx': { topic: 'Work and Energy', sub: 'Mechanics' },

  // Time & Frequency
  'TimeMsSMinHrCalculator.tsx': { topic: 'Time Conversion', sub: 'Time' },
  'FrequencyHzKhzMhzCalculator.tsx': { topic: 'Frequency Conversion', sub: 'Time' },
  'PeriodFrequencyCalculator.tsx': { topic: 'Period to Frequency', sub: 'Time' },
  'FrameRateFpsHzCalculator.tsx': { topic: 'Frame Rate Conversion', sub: 'Time' },
  'ClockTimeTimezoneShiftCalculator.tsx': { topic: 'Timezone Converter', sub: 'Time' },

  // Computing & Data
  'BytesBKbMbGbTbCalculator.tsx': { topic: 'Byte Conversion', sub: 'Computing' },
  'BitsBKbMbGbCalculator.tsx': { topic: 'Bit Conversion', sub: 'Computing' },
  'BinaryDecimalPrefixesCalculator.tsx': { topic: 'Binary Prefixes', sub: 'Computing' },
  'TransferSpeedMbpsMbsCalculator.tsx': { topic: 'Data Transfer Speed', sub: 'Computing' },
  'CompressionRatioSizeCalculator.tsx': { topic: 'Data Compression', sub: 'Computing' },
  'ChecksumHashQuickToolsCalculator.tsx': { topic: 'Checksum and Hash', sub: 'Computing' },

  // Everyday & Mixed
  'CookingTspTbspCupMlCalculator.tsx': { topic: 'Cooking Conversions', sub: 'Everyday' },
  'FuelEconomyLPer100kmMpgCalculator.tsx': { topic: 'Fuel Economy', sub: 'Everyday' },
  'CurrencyFxQuickConvertCalculator.tsx': { topic: 'Currency Conversion', sub: 'Everyday' },
  'BmiBsaQuickEstimatorsCalculator.tsx': { topic: 'BMI and BSA', sub: 'Everyday' },
  'PaperSizeASeriesUsCalculator.tsx': { topic: 'Paper Size', sub: 'Everyday' },
  'ShoeSizeEuUsUkCalculator.tsx': { topic: 'Shoe Size Conversion', sub: 'Everyday' },
};

function getLinks(info) {
  const topic = info.topic;
  const encodedTopic = encodeURIComponent(topic);
  const links = [];

  // 1. General Authority (NIST/Engineering Toolbox based on category)
  if (info.sub === 'Core' || info.sub === 'Time') {
    links.push({
      title: `${topic} - NIST`,
      url: `https://www.nist.gov/search?s=${encodedTopic}`,
      desc: `Official guide and standards for ${topic} from the National Institute of Standards and Technology.`
    });
  } else if (info.sub === 'Mechanics') {
    links.push({
      title: `${topic} - Engineering ToolBox`,
      url: `https://www.engineeringtoolbox.com/index.html?q=${encodedTopic}`,
      desc: `Comprehensive technical resources, formulas, and data for ${topic} from the Engineering ToolBox.`
    });
  } else if (info.sub === 'Computing') {
    links.push({
      title: `${topic} - Computer Hope`,
      url: `https://www.computerhope.com/search.htm?q=${encodedTopic}`,
      desc: `Clear explanations, examples, and history of ${topic} from Computer Hope's extensive tech dictionary.`
    });
  } else if (info.sub === 'Everyday') {
    // Variable first link for everyday
    if (topic.includes('Cooking')) {
        links.push({
            title: `${topic} - Allrecipes`,
            url: `https://www.allrecipes.com/search?q=${encodedTopic}`,
            desc: `Trusted cooking guides and ${topic} charts to help you get perfect results in the kitchen.`
        });
    } else if (topic.includes('Fuel')) {
        links.push({
            title: `${topic} - FuelEconomy.gov`,
            url: `https://www.fueleconomy.gov/feg/findacar.shtml`, // General search not easy, using main site
            desc: `Official fuel economy data and ${topic} information from the U.S. Department of Energy.`
        });
    } else if (topic.includes('Currency')) {
         links.push({
            title: `${topic} - XE`,
            url: `https://www.xe.com/currencyconverter/`,
            desc: `The world's trusted currency authority for ${topic} and live exchange rates.`
        });
    } else if (topic.includes('BMI')) {
        links.push({
           title: `${topic} - CDC`,
           url: `https://www.cdc.gov/healthyweight/assessing/bmi/index.html`,
           desc: `Official health information and ${topic} calculators from the Centers for Disease Control and Prevention.`
       });
    } else {
        links.push({
            title: `${topic} - Wikipedia`,
            url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodedTopic}`,
            desc: `Detailed encyclopedia article covering the history, standards, and usage of ${topic}.`
        });
    }
  }

  // 2. Educational / Secondary Authority
  if (info.sub === 'Computing') {
      links.push({
          title: `${topic} - TechTarget`,
          url: `https://search.techtarget.com/search/query?q=${encodedTopic}`,
          desc: `In-depth technical definitions and enterprise context for ${topic} from TechTarget.`
      });
  } else if (info.sub === 'Everyday' && topic.includes('Shoe')) {
       links.push({
          title: `${topic} - Zappos`,
          url: `https://www.zappos.com/c/shoe-size-conversion`,
          desc: `Practical ${topic} charts and fitting guides from Zappos to ensure the perfect fit.`
      });
  } else {
      links.push({
        title: `${topic} - Khan Academy`,
        url: `https://www.khanacademy.org/search?page_search_query=${encodedTopic}`,
        desc: `Learn the math and science behind ${topic} with free interactive lessons and videos from Khan Academy.`
      });
  }

  // 3. Broad Resource
  links.push({
    title: `${topic} - Calculator.net`,
    url: `https://www.calculator.net/search?q=${encodedTopic}`,
    desc: `Compare results and explore alternative calculation methods for ${topic} on Calculator.net.`
  });
  
  // 4. Wikipedia (if not used) or other
   if (info.sub !== 'Everyday') { // Avoid duplicating if used in first slot
        links.push({
            title: `${topic} - Wikipedia`,
            url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodedTopic}`,
            desc: `Detailed encyclopedia article covering the history, standards, and usage of ${topic}.`
        });
   }

  return links;
}

async function processFile(filePath, filename) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already has references
    if (content.includes('id="references"')) {
      console.log(`Skipping ${filename} - already has references`);
      return;
    }

    const info = FILE_MAPPING[filename] || { topic: filename.replace('Calculator.tsx', '').replace(/([A-Z])/g, ' $1').trim(), sub: 'General' };
    const links = getLinks(info);

    const referencesSection = `
      {/* 8. REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          ${links.map(link => `
          <li>
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              ${link.title}
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              ${link.desc}
            </p>
          </li>`).join('')}
        </ul>
      </section>`;

    // Insert before the last closing div and parenthesis of the return statement
    // Looking for the closing of the main div inside return
    // Pattern:  </div>\n  );\n}
    // Or just before the last </div> inside the return
    
    let newContent = content;
    
    // Find insertion point: End of FAQ section or before closing main div
    // Most files seem to have a specific structure.
    // Let's look for where FAQ ends.
    
    // Pattern 1: After FAQ section closing tag </section>
    const faqEndRegex = /(<section id="faq".*?<\/section>)/s;
    const match = content.match(faqEndRegex);
    
    if (match) {
        newContent = content.replace(faqEndRegex, `$1\n${referencesSection}`);
    } else {
        console.log(`Could not find FAQ section in ${filename} - trying to append to end of main div`);
        // Fallback: look for the last </div> before );
        const lastDivRegex = /(<\/div>\s*)\);/s;
        if (lastDivRegex.test(content)) {
             newContent = content.replace(lastDivRegex, `${referencesSection}\n$1);`);
        } else {
             console.log(`Could not find suitable insertion point for ${filename}`);
             return;
        }
    }

    // Update onThisPage
    // Add references to the list
    const onThisPageRegex = /(onThisPage=\{\[[\s\S]*?)(\]\})/s;
    if (onThisPageRegex.test(newContent)) {
       newContent = newContent.replace(onThisPageRegex, `$1  { id: "references", label: "References & Resources" },\n$2`);
    } else {
        console.log(`Could not update onThisPage in ${filename}`);
    }

    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${filename}`);

  } catch (err) {
    console.error(`Error processing ${filename}:`, err);
  }
}

async function main() {
  if (!fs.existsSync(TARGET_DIR)) {
    console.error('Directory not found:', TARGET_DIR);
    return;
  }

  const files = fs.readdirSync(TARGET_DIR).filter(f => f.endsWith('.tsx'));
  
  console.log(`Found ${files.length} files in Conversion category.`);

  for (const file of files) {
    await processFile(path.join(TARGET_DIR, file), file);
  }
  
  console.log('Done!');
}

main();
