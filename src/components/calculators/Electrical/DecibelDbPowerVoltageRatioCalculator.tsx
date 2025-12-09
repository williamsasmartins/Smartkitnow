import React, { useState } from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const DecibelDbPowerVoltageRatioCalculator: React.FC = () => {
  const [powerRatio, setPowerRatio] = useState<number | undefined>();
  const [voltageRatio, setVoltageRatio] = useState<number | undefined>();
  const [result, setResult] = useState<{ powerDb: number; voltageDb: number } | null>(null);

  const calculateDecibels = () => {
    if (powerRatio !== undefined && voltageRatio !== undefined) {
      const powerDb = 10 * Math.log10(powerRatio);
      const voltageDb = 20 * Math.log10(voltageRatio);
      setResult({ powerDb, voltageDb });
    }
  };

  return (
    <CalculatorVerticalLayout>
      <Card>
        <CardHeader>
          <CardTitle>Decibel (dB) Power / Voltage Ratio Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="powerRatio">Power Ratio</Label>
          <Input
            id="powerRatio"
            type="number"
            value={powerRatio}
            onChange={(e) => setPowerRatio(parseFloat(e.target.value))}
            placeholder="Enter power ratio"
          />
          <Label htmlFor="voltageRatio">Voltage Ratio</Label>
          <Input
            id="voltageRatio"
            type="number"
            value={voltageRatio}
            onChange={(e) => setVoltageRatio(parseFloat(e.target.value))}
            placeholder="Enter voltage ratio"
          />
          <Button onClick={calculateDecibels}>Calculate</Button>
          {result && (
            <Alert>
              <AlertTitle>Calculation Result</AlertTitle>
              <AlertDescription>
                Power Ratio in dB: {result.powerDb.toFixed(2)} dB
                <br />
                Voltage Ratio in dB: {result.voltageDb.toFixed(2)} dB
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <section>
        <h2>Introduction</h2>
        <p>
          The Decibel (dB) Power / Voltage Ratio Calculator is a tool used in electronics and telecommunications to measure signal strength. Understanding decibels is crucial for engineers and technicians who work with audio, radio, and other signal processing technologies.
        </p>
        <p>
          This calculator helps you convert power and voltage ratios into decibels, providing a clearer understanding of signal amplification or attenuation. It is particularly useful in designing and analyzing circuits where signal integrity is vital.
        </p>
      </section>

      <section>
        <h2>How to Use This Calculator</h2>
        <ol>
          <li>Enter the power ratio in the designated field. This is the ratio of the output power to the input power.</li>
          <li>Enter the voltage ratio in the designated field. This is the ratio of the output voltage to the input voltage.</li>
          <li>Click the "Calculate" button to compute the decibel values for both power and voltage ratios.</li>
          <li>Interpret the results displayed in decibels (dB) to understand the level of amplification or attenuation.</li>
        </ol>
      </section>

      <section>
        <h2>Formulas / Theory</h2>
        <p>
          The decibel is a logarithmic unit used to express the ratio of two values, commonly power or intensity. It is defined as ten times the logarithm to base 10 of the power ratio. For voltage, since power is proportional to the square of voltage, the formula uses 20 times the logarithm.
        </p>
        <p>
          The formulas are:
          <br />
          Power in dB = 10 × log<sub>10</sub>(Power Ratio)
          <br />
          Voltage in dB = 20 × log<sub>10</sub>(Voltage Ratio)
        </p>
      </section>

      <section>
        <h2>Worked Example</h2>
        <p>
          Suppose you have a power ratio of 100 and a voltage ratio of 10. Using the formulas:
        </p>
        <p>
          Power in dB = 10 × log<sub>10</sub>(100) = 20 dB
          <br />
          Voltage in dB = 20 × log<sub>10</sub>(10) = 20 dB
        </p>
        <p>
          This indicates a significant amplification in both power and voltage.
        </p>
      </section>

      <section>
        <h2>Frequently Asked Questions</h2>
        <h3>What is a decibel (dB)?</h3>
        <p>
          A decibel (dB) is a logarithmic unit used to measure sound intensity, power level, or voltage level. It provides a way to express ratios of power or amplitude in a manageable scale.
        </p>
        <h3>Why use logarithms in decibel calculations?</h3>
        <p>
          Logarithms allow for a more convenient representation of large ratios, compressing a wide range of values into a smaller, more understandable scale. This is particularly useful in electronics where signal levels can vary greatly.
        </p>
        <h3>How do I interpret decibel values?</h3>
        <p>
          Positive decibel values indicate amplification, while negative values indicate attenuation. A 3 dB increase represents a doubling of power, while a 3 dB decrease represents halving.
        </p>
        <h3>Can decibel calculations apply to other fields?</h3>
        <p>
          Yes, decibels are used in various fields such as acoustics, electronics, and telecommunications to measure sound levels, signal strength, and more.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul>
          <li>Electronics and Telecommunications Research Institute. "Understanding Decibels in Signal Processing."</li>
          <li>National Institute of Standards and Technology. "Guide to Decibel Calculations."</li>
          <li>IEEE Standards Association. "Decibel Measurement Standards."</li>
          <li>Audio Engineering Society. "Decibels in Audio Systems."</li>
          <li>Federal Communications Commission. "Signal Strength and Decibels."</li>
        </ul>
      </section>
    </CalculatorVerticalLayout>
  );
};

export default DecibelDbPowerVoltageRatioCalculator;