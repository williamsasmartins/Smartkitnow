import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, RotateCcw } from "lucide-react";
import { useState } from "react";

interface ConversionData {
  title: string;
  fromUnit: string;
  toUnit: string;
  formula: string;
  factor: number;
  description: string;
  howToConvert: string;
  examples: { input: string; output: string; }[];
  educationalText: string;
}

const conversionData: Record<string, ConversionData> = {
  "deg-to-rad": {
    title: "Degrees to Radians",
    fromUnit: "degrees",
    toUnit: "radians", 
    formula: "radians = degrees × π/180",
    factor: Math.PI / 180,
    description: "Convert angle measurements from degrees to radians.",
    howToConvert: "To convert degrees to radians, multiply the degree value by π/180 (approximately 0.0174533).",
    examples: [
      { input: "90°", output: "1.5708 rad" },
      { input: "180°", output: "3.1416 rad" },
      { input: "360°", output: "6.2832 rad" }
    ],
    educationalText: "Radians are the standard unit of angular measure in mathematics. One radian is the angle subtended at the center of a circle by an arc equal in length to the radius. There are 2π radians in a complete circle, which equals 360 degrees."
  },
  "rad-to-deg": {
    title: "Radians to Degrees",
    fromUnit: "radians",
    toUnit: "degrees",
    formula: "degrees = radians × 180/π",
    factor: 180 / Math.PI,
    description: "Convert angle measurements from radians to degrees.",
    howToConvert: "To convert radians to degrees, multiply the radian value by 180/π (approximately 57.2958).",
    examples: [
      { input: "π/2 rad", output: "90°" },
      { input: "π rad", output: "180°" },
      { input: "2π rad", output: "360°" }
    ],
    educationalText: "Degrees are a common unit for measuring angles, where a full circle is divided into 360 degrees. This system dates back to ancient Babylonian mathematics and is widely used in navigation, engineering, and everyday applications."
  },
  "in-to-cm": {
    title: "Inches to Centimeters",
    fromUnit: "inches",
    toUnit: "centimeters",
    formula: "centimeters = inches × 2.54",
    factor: 2.54,
    description: "Convert length measurements from inches to centimeters.",
    howToConvert: "To convert inches to centimeters, multiply the inch value by 2.54.",
    examples: [
      { input: "1 inch", output: "2.54 cm" },
      { input: "12 inches", output: "30.48 cm" },
      { input: "36 inches", output: "91.44 cm" }
    ],
    educationalText: "The inch is an imperial unit of length, while the centimeter is a metric unit. The conversion factor 2.54 is exact by definition, as it was established by international agreement to standardize the relationship between imperial and metric systems."
  },
  "cm-to-in": {
    title: "Centimeters to Inches",
    fromUnit: "centimeters",
    toUnit: "inches",
    formula: "inches = centimeters ÷ 2.54",
    factor: 1 / 2.54,
    description: "Convert length measurements from centimeters to inches.",
    howToConvert: "To convert centimeters to inches, divide the centimeter value by 2.54.",
    examples: [
      { input: "2.54 cm", output: "1 inch" },
      { input: "30.48 cm", output: "12 inches" },
      { input: "91.44 cm", output: "36 inches" }
    ],
    educationalText: "Centimeters are part of the metric system, which is used by most countries worldwide. The metric system is based on powers of 10, making calculations easier than the imperial system used primarily in the United States."
  },
  "f-to-c": {
    title: "Fahrenheit to Celsius",
    fromUnit: "°F",
    toUnit: "°C",
    formula: "°C = (°F - 32) × 5/9",
    factor: 0, // Special case - needs custom calculation
    description: "Convert temperature from Fahrenheit to Celsius.",
    howToConvert: "To convert Fahrenheit to Celsius, subtract 32 from the Fahrenheit temperature, then multiply by 5/9.",
    examples: [
      { input: "32°F", output: "0°C" },
      { input: "68°F", output: "20°C" },
      { input: "100°F", output: "37.78°C" }
    ],
    educationalText: "The Fahrenheit scale was developed by Daniel Gabriel Fahrenheit in 1724. Water freezes at 32°F and boils at 212°F. The Celsius scale, developed by Anders Celsius, uses 0°C for water's freezing point and 100°C for its boiling point at standard atmospheric pressure."
  },
  "c-to-f": {
    title: "Celsius to Fahrenheit", 
    fromUnit: "°C",
    toUnit: "°F",
    formula: "°F = (°C × 9/5) + 32",
    factor: 0, // Special case - needs custom calculation
    description: "Convert temperature from Celsius to Fahrenheit.",
    howToConvert: "To convert Celsius to Fahrenheit, multiply the Celsius temperature by 9/5, then add 32.",
    examples: [
      { input: "0°C", output: "32°F" },
      { input: "20°C", output: "68°F" },
      { input: "37.78°C", output: "100°F" }
    ],
    educationalText: "Celsius is the primary temperature scale used in the metric system and by most countries worldwide. It's based on the freezing and boiling points of water at standard atmospheric pressure, making it intuitive for everyday use."
  },
  "lbs-to-kg": {
    title: "Pounds to Kilograms",
    fromUnit: "pounds",
    toUnit: "kilograms",
    formula: "kilograms = pounds ÷ 2.20462",
    factor: 1 / 2.20462,
    description: "Convert weight from pounds to kilograms.",
    howToConvert: "To convert pounds to kilograms, divide the pound value by 2.20462.",
    examples: [
      { input: "1 lb", output: "0.454 kg" },
      { input: "10 lbs", output: "4.536 kg" },
      { input: "150 lbs", output: "68.04 kg" }
    ],
    educationalText: "The pound is an imperial unit of weight commonly used in the United States, while the kilogram is the base unit of mass in the metric system. One kilogram is approximately equal to 2.20462 pounds."
  },
  "kg-to-lbs": {
    title: "Kilograms to Pounds",
    fromUnit: "kilograms", 
    toUnit: "pounds",
    formula: "pounds = kilograms × 2.20462",
    factor: 2.20462,
    description: "Convert weight from kilograms to pounds.",
    howToConvert: "To convert kilograms to pounds, multiply the kilogram value by 2.20462.",
    examples: [
      { input: "0.454 kg", output: "1 lb" },
      { input: "4.536 kg", output: "10 lbs" },
      { input: "68.04 kg", output: "150 lbs" }
    ],
    educationalText: "The kilogram is defined by the International System of Units (SI) and is based on fundamental physical constants. It's the only SI base unit still defined by a physical artifact, though this changed in 2019 when it was redefined using Planck's constant."
  },
  "mph-to-kmh": {
    title: "Miles per Hour to Kilometers per Hour",
    fromUnit: "mph",
    toUnit: "km/h",
    formula: "km/h = mph × 1.60934",
    factor: 1.60934,
    description: "Convert speed from miles per hour to kilometers per hour.",
    howToConvert: "To convert mph to km/h, multiply the mph value by 1.60934.",
    examples: [
      { input: "30 mph", output: "48.28 km/h" },
      { input: "60 mph", output: "96.56 km/h" },
      { input: "70 mph", output: "112.65 km/h" }
    ],
    educationalText: "Miles per hour is commonly used in the United States and United Kingdom for measuring vehicle speeds, while kilometers per hour is used in most other countries. The conversion factor comes from the relationship between miles and kilometers (1 mile = 1.60934 kilometers)."
  },
  "kmh-to-mph": {
    title: "Kilometers per Hour to Miles per Hour",
    fromUnit: "km/h",
    toUnit: "mph",
    formula: "mph = km/h ÷ 1.60934",
    factor: 1 / 1.60934,
    description: "Convert speed from kilometers per hour to miles per hour.",
    howToConvert: "To convert km/h to mph, divide the km/h value by 1.60934.",
    examples: [
      { input: "48.28 km/h", output: "30 mph" },
      { input: "96.56 km/h", output: "60 mph" },
      { input: "112.65 km/h", output: "70 mph" }
    ],
    educationalText: "Speed limits and vehicle speedometers in metric countries display kilometers per hour. This unit is part of the metric system's consistency, where distances are measured in kilometers and time in hours, making calculations straightforward."
  },
  "deg-to-mrad": {
    title: "Degrees to Milliradians",
    fromUnit: "degrees",
    toUnit: "milliradians",
    formula: "milliradians = degrees × π/180 × 1000",
    factor: (Math.PI / 180) * 1000,
    description: "Convert angle measurements from degrees to milliradians.",
    howToConvert: "To convert degrees to milliradians, multiply the degree value by π/180, then multiply by 1000.",
    examples: [
      { input: "1°", output: "17.4533 mrad" },
      { input: "90°", output: "1570.8 mrad" },
      { input: "180°", output: "3141.6 mrad" }
    ],
    educationalText: "Milliradians (mrad) are commonly used in military and engineering applications for precise angular measurements. One milliradian is approximately 3.6 inches at 100 yards, making it useful for ballistic calculations and surveying."
  },
  "mrad-to-deg": {
    title: "Milliradians to Degrees",
    fromUnit: "milliradians",
    toUnit: "degrees",
    formula: "degrees = milliradians ÷ (π/180 × 1000)",
    factor: 1 / ((Math.PI / 180) * 1000),
    description: "Convert angle measurements from milliradians to degrees.",
    howToConvert: "To convert milliradians to degrees, divide the milliradian value by (π/180 × 1000).",
    examples: [
      { input: "17.4533 mrad", output: "1°" },
      { input: "1570.8 mrad", output: "90°" },
      { input: "3141.6 mrad", output: "180°" }
    ],
    educationalText: "Converting milliradians to degrees is essential in precision shooting and artillery applications. Military personnel often work with milliradians for range finding and target acquisition due to their practical measurement properties."
  },
  "sq-ft-to-sq-m": {
    title: "Square Feet to Square Meters",
    fromUnit: "sq ft",
    toUnit: "sq m",
    formula: "sq m = sq ft × 0.092903",
    factor: 0.092903,
    description: "Convert area measurements from square feet to square meters.",
    howToConvert: "To convert square feet to square meters, multiply the square feet value by 0.092903.",
    examples: [
      { input: "100 sq ft", output: "9.29 sq m" },
      { input: "1000 sq ft", output: "92.9 sq m" },
      { input: "2500 sq ft", output: "232.26 sq m" }
    ],
    educationalText: "Square meters are the standard unit of area measurement in the metric system and real estate worldwide. This conversion is essential for international property transactions, architectural plans, and construction projects involving both imperial and metric specifications."
  },
  "sq-m-to-sq-ft": {
    title: "Square Meters to Square Feet",
    fromUnit: "sq m",
    toUnit: "sq ft",
    formula: "sq ft = sq m × 10.7639",
    factor: 10.7639,
    description: "Convert area measurements from square meters to square feet.",
    howToConvert: "To convert square meters to square feet, multiply the square meters value by 10.7639.",
    examples: [
      { input: "10 sq m", output: "107.64 sq ft" },
      { input: "100 sq m", output: "1076.39 sq ft" },
      { input: "200 sq m", output: "2152.78 sq ft" }
    ],
    educationalText: "Square feet remain the primary area measurement in US real estate and construction. Understanding this conversion helps in comparing property sizes internationally and working with building materials sized in different measurement systems."
  },
  "g-to-ml": {
    title: "Grams to Milliliters",
    fromUnit: "grams",
    toUnit: "milliliters",
    formula: "mL = g ÷ density (for water: mL = g ÷ 1)",
    factor: 1, // For water density = 1 g/mL
    description: "Convert mass to volume for water and water-based solutions.",
    howToConvert: "For water, 1 gram equals 1 milliliter. For other substances, divide grams by the substance's density in g/mL.",
    examples: [
      { input: "250 g (water)", output: "250 mL" },
      { input: "500 g (water)", output: "500 mL" },
      { input: "1000 g (water)", output: "1000 mL" }
    ],
    educationalText: "This conversion assumes water density (1 g/mL at standard conditions). For other liquids, density varies: honey ≈1.4 g/mL, olive oil ≈0.92 g/mL, alcohol ≈0.79 g/mL. Always consider the specific substance when converting between mass and volume."
  },
  "ml-to-g": {
    title: "Milliliters to Grams",
    fromUnit: "milliliters",
    toUnit: "grams",
    formula: "g = mL × density (for water: g = mL × 1)",
    factor: 1, // For water density = 1 g/mL
    description: "Convert volume to mass for water and water-based solutions.",
    howToConvert: "For water, 1 milliliter equals 1 gram. For other substances, multiply milliliters by the substance's density in g/mL.",
    examples: [
      { input: "250 mL (water)", output: "250 g" },
      { input: "500 mL (water)", output: "500 g" },
      { input: "1000 mL (water)", output: "1000 g" }
    ],
    educationalText: "This conversion is fundamental in cooking and chemistry. Water's unique property of having a density of 1 g/mL makes it the reference standard. Other common cooking ingredients have different densities: flour ≈0.6 g/mL, sugar ≈0.8 g/mL, butter ≈0.9 g/mL."
  },
  "ko-to-o": {
    title: "Kiloohms to Ohms",
    fromUnit: "kΩ",
    toUnit: "Ω",
    formula: "Ω = kΩ × 1000",
    factor: 1000,
    description: "Convert electrical resistance from kiloohms to ohms.",
    howToConvert: "To convert kiloohms to ohms, multiply the kiloohm value by 1000.",
    examples: [
      { input: "1 kΩ", output: "1000 Ω" },
      { input: "4.7 kΩ", output: "4700 Ω" },
      { input: "10 kΩ", output: "10000 Ω" }
    ],
    educationalText: "Kiloohms are commonly used in electronics for resistor values in circuits. Standard resistor values like 1kΩ, 4.7kΩ, and 10kΩ are frequently found in electronic circuits for current limiting, voltage division, and signal conditioning applications."
  },
  "mo-to-o": {
    title: "Megaohms to Ohms",
    fromUnit: "MΩ",
    toUnit: "Ω",
    formula: "Ω = MΩ × 1,000,000",
    factor: 1000000,
    description: "Convert electrical resistance from megaohms to ohms.",
    howToConvert: "To convert megaohms to ohms, multiply the megaohm value by 1,000,000.",
    examples: [
      { input: "1 MΩ", output: "1,000,000 Ω" },
      { input: "2.2 MΩ", output: "2,200,000 Ω" },
      { input: "10 MΩ", output: "10,000,000 Ω" }
    ],
    educationalText: "Megaohms are used for very high resistance values in applications like insulation testing, high-voltage circuits, and precision measurement equipment. These values are common in input impedances of operational amplifiers and digital multimeters."
  },
  "o-to-ko": {
    title: "Ohms to Kiloohms",
    fromUnit: "Ω",
    toUnit: "kΩ",
    formula: "kΩ = Ω ÷ 1000",
    factor: 1 / 1000,
    description: "Convert electrical resistance from ohms to kiloohms.",
    howToConvert: "To convert ohms to kiloohms, divide the ohm value by 1000.",
    examples: [
      { input: "1000 Ω", output: "1 kΩ" },
      { input: "4700 Ω", output: "4.7 kΩ" },
      { input: "22000 Ω", output: "22 kΩ" }
    ],
    educationalText: "Converting ohms to kiloohms simplifies reading resistor color codes and circuit schematics. Most resistors in electronic circuits fall within the kiloohm range, making this conversion essential for circuit analysis and component selection."
  },
  "mo-to-o-milli": {
    title: "Milliohms to Ohms",
    fromUnit: "mΩ",
    toUnit: "Ω",
    formula: "Ω = mΩ ÷ 1000",
    factor: 1 / 1000,
    description: "Convert electrical resistance from milliohms to ohms.",
    howToConvert: "To convert milliohms to ohms, divide the milliohm value by 1000.",
    examples: [
      { input: "100 mΩ", output: "0.1 Ω" },
      { input: "500 mΩ", output: "0.5 Ω" },
      { input: "1000 mΩ", output: "1 Ω" }
    ],
    educationalText: "Milliohms are used for measuring very low resistances, such as contact resistance, wire resistance in power applications, and current sensing resistors. These measurements are critical in power electronics and automotive applications."
  },
  "mg-to-ml": {
    title: "Milligrams to Milliliters",
    fromUnit: "milligrams",
    toUnit: "milliliters",
    formula: "mL = mg ÷ density × 1000 (for water: mL = mg ÷ 1000)",
    factor: 1 / 1000, // For water density = 1 g/mL
    description: "Convert mass to volume for water and pharmaceutical solutions.",
    howToConvert: "For water-based solutions, divide milligrams by 1000 to get milliliters. For other substances, divide by density in mg/mL.",
    examples: [
      { input: "1000 mg (water)", output: "1 mL" },
      { input: "500 mg (water)", output: "0.5 mL" },
      { input: "250 mg (water)", output: "0.25 mL" }
    ],
    educationalText: "This conversion is crucial in pharmaceutical and medical applications where precise dosing is required. Water-based medications often use this 1:1000 ratio, but active pharmaceutical ingredients may have different densities requiring specific calculations."
  },
  "ml-to-mg": {
    title: "Milliliters to Milligrams",
    fromUnit: "milliliters",
    toUnit: "milligrams",
    formula: "mg = mL × density × 1000 (for water: mg = mL × 1000)",
    factor: 1000, // For water density = 1 g/mL
    description: "Convert volume to mass for water and pharmaceutical solutions.",
    howToConvert: "For water-based solutions, multiply milliliters by 1000 to get milligrams. For other substances, multiply by density in mg/mL.",
    examples: [
      { input: "1 mL (water)", output: "1000 mg" },
      { input: "0.5 mL (water)", output: "500 mg" },
      { input: "0.25 mL (water)", output: "250 mg" }
    ],
    educationalText: "Essential for medication preparation and laboratory work, this conversion helps calculate active ingredient concentrations. Pharmaceutical solutions often express concentrations in mg/mL, making this conversion vital for accurate dosing calculations."
  },
  "sq-mi-to-sq-km": {
    title: "Square Miles to Square Kilometers",
    fromUnit: "sq mi",
    toUnit: "sq km",
    formula: "sq km = sq mi × 2.58999",
    factor: 2.58999,
    description: "Convert area measurements from square miles to square kilometers.",
    howToConvert: "To convert square miles to square kilometers, multiply the square miles value by 2.58999.",
    examples: [
      { input: "1 sq mi", output: "2.59 sq km" },
      { input: "10 sq mi", output: "25.9 sq km" },
      { input: "100 sq mi", output: "259 sq km" }
    ],
    educationalText: "Square miles are commonly used in the United States for measuring large areas such as cities, counties, and states. Square kilometers are the international standard for geographic and scientific measurements, used in mapping and land surveying worldwide."
  },
  "sq-km-to-sq-mi": {
    title: "Square Kilometers to Square Miles",
    fromUnit: "sq km",
    toUnit: "sq mi",
    formula: "sq mi = sq km ÷ 2.58999",
    factor: 1 / 2.58999,
    description: "Convert area measurements from square kilometers to square miles.",
    howToConvert: "To convert square kilometers to square miles, divide the square kilometers value by 2.58999.",
    examples: [
      { input: "2.59 sq km", output: "1 sq mi" },
      { input: "25.9 sq km", output: "10 sq mi" },
      { input: "259 sq km", output: "100 sq mi" }
    ],
    educationalText: "This conversion is useful for comparing international geographic data with US measurements. National parks, city areas, and geographic features are often reported in square kilometers globally but may need conversion to square miles for US audiences."
  },
  "kcal-to-cal": {
    title: "Kilocalories to Calories",
    fromUnit: "kcal",
    toUnit: "cal",
    formula: "cal = kcal × 1000",
    factor: 1000,
    description: "Convert energy measurements from kilocalories to calories.",
    howToConvert: "To convert kilocalories to calories, multiply the kilocalorie value by 1000.",
    examples: [
      { input: "1 kcal", output: "1000 cal" },
      { input: "2.5 kcal", output: "2500 cal" },
      { input: "10 kcal", output: "10000 cal" }
    ],
    educationalText: "Kilocalories (often called 'calories' on food labels) are the standard unit for measuring food energy. One kilocalorie is the energy needed to raise 1 kilogram of water by 1°C. This distinction is important in nutrition science and metabolic calculations."
  },
  "mj-to-kwh": {
    title: "Megajoules to Kilowatt-hours",
    fromUnit: "MJ",
    toUnit: "kWh",
    formula: "kWh = MJ ÷ 3.6",
    factor: 1 / 3.6,
    description: "Convert energy measurements from megajoules to kilowatt-hours.",
    howToConvert: "To convert megajoules to kilowatt-hours, divide the megajoule value by 3.6.",
    examples: [
      { input: "3.6 MJ", output: "1 kWh" },
      { input: "36 MJ", output: "10 kWh" },
      { input: "72 MJ", output: "20 kWh" }
    ],
    educationalText: "This conversion is essential in energy industry calculations, particularly for comparing energy storage systems, fuel energy content, and electrical consumption. Megajoules are often used in scientific contexts while kilowatt-hours are standard for electrical billing."
  },
  "mwh-to-kwh": {
    title: "Megawatt-hours to Kilowatt-hours",
    fromUnit: "MWh",
    toUnit: "kWh",
    formula: "kWh = MWh × 1000",
    factor: 1000,
    description: "Convert energy measurements from megawatt-hours to kilowatt-hours.",
    howToConvert: "To convert megawatt-hours to kilowatt-hours, multiply the megawatt-hour value by 1000.",
    examples: [
      { input: "1 MWh", output: "1000 kWh" },
      { input: "2.5 MWh", output: "2500 kWh" },
      { input: "10 MWh", output: "10000 kWh" }
    ],
    educationalText: "Megawatt-hours are used for large-scale energy measurements in power plants, industrial facilities, and grid operations. This conversion is crucial for utility companies, energy traders, and industrial energy managers working with both residential and commercial scale measurements."
  },
  "mmbtu-to-mwh": {
    title: "MMBTU to Megawatt-hours",
    fromUnit: "MMBTU",
    toUnit: "MWh",
    formula: "MWh = MMBTU × 0.293071",
    factor: 0.293071,
    description: "Convert energy measurements from million BTU to megawatt-hours.",
    howToConvert: "To convert MMBTU to MWh, multiply the MMBTU value by 0.293071.",
    examples: [
      { input: "1 MMBTU", output: "0.293 MWh" },
      { input: "10 MMBTU", output: "2.931 MWh" },
      { input: "100 MMBTU", output: "29.307 MWh" }
    ],
    educationalText: "MMBTU (Million British Thermal Units) is commonly used in natural gas trading and industrial heating applications. This conversion is vital for energy procurement, comparing heating fuels to electrical alternatives, and carbon footprint calculations in industrial processes."
  },
  "mpg-to-kml": {
    title: "Miles per Gallon to Kilometers per Liter",
    fromUnit: "mpg",
    toUnit: "km/L",
    formula: "km/L = mpg × 0.425144",
    factor: 0.425144,
    description: "Convert fuel economy from miles per gallon to kilometers per liter.",
    howToConvert: "To convert mpg to km/L, multiply the mpg value by 0.425144.",
    examples: [
      { input: "25 mpg", output: "10.63 km/L" },
      { input: "30 mpg", output: "12.75 km/L" },
      { input: "40 mpg", output: "17.01 km/L" }
    ],
    educationalText: "Miles per gallon is the standard fuel economy measurement in the United States, while kilometers per liter is used in many other countries. This conversion is essential for international vehicle comparisons and fleet management across different regions."
  },
  "kml-to-mpg": {
    title: "Kilometers per Liter to Miles per Gallon",
    fromUnit: "km/L",
    toUnit: "mpg",
    formula: "mpg = km/L ÷ 0.425144",
    factor: 1 / 0.425144,
    description: "Convert fuel economy from kilometers per liter to miles per gallon.",
    howToConvert: "To convert km/L to mpg, divide the km/L value by 0.425144.",
    examples: [
      { input: "10 km/L", output: "23.52 mpg" },
      { input: "15 km/L", output: "35.28 mpg" },
      { input: "20 km/L", output: "47.04 mpg" }
    ],
    educationalText: "This conversion helps international consumers understand vehicle efficiency ratings when comparing cars from different markets. Many fuel-efficient vehicles are rated in km/L in Asian and European markets but need mpg conversion for US consumers."
  },
  "mpg-to-l100km": {
    title: "Miles per Gallon to Liters per 100km",
    fromUnit: "mpg",
    toUnit: "L/100km",
    formula: "L/100km = 235.214 ÷ mpg",
    factor: 0, // Special calculation needed
    description: "Convert fuel economy from miles per gallon to liters per 100 kilometers.",
    howToConvert: "To convert mpg to L/100km, divide 235.214 by the mpg value. Note: lower L/100km values indicate better fuel economy.",
    examples: [
      { input: "25 mpg", output: "9.41 L/100km" },
      { input: "30 mpg", output: "7.84 L/100km" },
      { input: "40 mpg", output: "5.88 L/100km" }
    ],
    educationalText: "Liters per 100 kilometers is the standard fuel consumption measurement in Europe and many other countries. Unlike mpg where higher numbers are better, lower L/100km values indicate better fuel efficiency, making this conversion conceptually important."
  },
  "l100km-to-mpg": {
    title: "Liters per 100km to Miles per Gallon",
    fromUnit: "L/100km",
    toUnit: "mpg",
    formula: "mpg = 235.214 ÷ L/100km",
    factor: 0, // Special calculation needed
    description: "Convert fuel economy from liters per 100 kilometers to miles per gallon.",
    howToConvert: "To convert L/100km to mpg, divide 235.214 by the L/100km value. Remember: lower L/100km equals higher mpg.",
    examples: [
      { input: "8 L/100km", output: "29.40 mpg" },
      { input: "6 L/100km", output: "39.20 mpg" },
      { input: "5 L/100km", output: "47.04 mpg" }
    ],
    educationalText: "This conversion is essential for comparing European and North American fuel economy standards. European fuel economy labels use L/100km, while US EPA ratings use mpg, requiring this conversion for international vehicle comparisons and purchasing decisions."
  },
  "ft-to-m": {
    title: "Feet to Meters",
    fromUnit: "feet",
    toUnit: "meters",
    formula: "meters = feet × 0.3048",
    factor: 0.3048,
    description: "Convert length measurements from feet to meters.",
    howToConvert: "To convert feet to meters, multiply the feet value by 0.3048.",
    examples: [
      { input: "1 ft", output: "0.305 m" },
      { input: "10 ft", output: "3.048 m" },
      { input: "100 ft", output: "30.48 m" }
    ],
    educationalText: "The foot is a fundamental unit in the imperial system, commonly used in construction, real estate, and aviation in the United States. The meter is the base unit of length in the metric system, used worldwide for scientific and most commercial applications."
  }
};

const ConversionPage = () => {
  const { conversionKey } = useParams();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");

  if (!conversionKey || !conversionData[conversionKey]) {
    navigate('/conversion');
    return null;
  }

  const data = conversionData[conversionKey];

  const handleConversion = () => {
    const input = parseFloat(inputValue);
    if (isNaN(input)) {
      setResult("Please enter a valid number");
      return;
    }

    let convertedValue: number;
    
    // Special cases for temperature conversions
    if (conversionKey === "f-to-c") {
      convertedValue = (input - 32) * 5/9;
    } else if (conversionKey === "c-to-f") {
      convertedValue = (input * 9/5) + 32;
    } else {
      convertedValue = input * data.factor;
    }

    setResult(convertedValue.toFixed(4));
  };

  const handleReset = () => {
    setInputValue("");
    setResult("");
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Header />
      
      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/conversion')}
              className="flex items-center space-x-2 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Conversions</span>
            </Button>
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {data.title}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  {data.description}
                </p>
              </div>
            </div>
          </div>
          
          {/* Calculator Interface */}
          <Card className="bg-card border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Convert {data.fromUnit} to {data.toUnit}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="input" className="text-sm font-medium">
                    Enter value in {data.fromUnit}
                  </Label>
                  <Input
                    id="input"
                    type="number"
                    placeholder={`Enter ${data.fromUnit}`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Result in {data.toUnit}
                  </Label>
                  <div className="p-3 bg-muted rounded-md text-lg font-mono">
                    {result || "0"}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleConversion} className="flex-1">
                  <Calculator className="h-4 w-4 mr-2" />
                  Convert
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">Formula:</h4>
                <code className="text-sm bg-background px-2 py-1 rounded font-mono">
                  {data.formula}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* How to Convert Section */}
          <Card className="bg-card border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">How to Convert {data.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{data.howToConvert}</p>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Examples:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.examples.map((example, index) => (
                    <div key={index} className="bg-muted/30 rounded-lg p-3">
                      <div className="text-sm text-foreground font-medium">{example.input}</div>
                      <div className="text-sm text-muted-foreground">= {example.output}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Educational Content */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">About {data.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {data.educationalText}
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ConversionPage;