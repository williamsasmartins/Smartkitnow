import React, { useState } from 'react';
import { Input, Select, Button, ResultBox, QuickTips } from 'smartkitnow-ui';

const DecibelDbPowerVoltageRatioCalculator: React.FC = () => {
  const [powerRatio, setPowerRatio] = useState<number | null>(null);
  const [voltageRatio, setVoltageRatio] = useState<number | null>(null);
  const [result, setResult] = useState<string>('');

  const calculateDecibels = () => {
    if (powerRatio !== null) {
      const powerDb = 10 * Math.log10(powerRatio);
      setResult(`Power Ratio in dB: ${powerDb.toFixed(2)} dB`);
    } else if (voltageRatio !== null) {
      const voltageDb = 20 * Math.log10(voltageRatio);
      setResult(`Voltage Ratio in dB: ${voltageDb.toFixed(2)} dB`);
    } else {
      setResult('Please enter a valid ratio.');
    }
  };

  return (
    <div className="calculator-container">
      <h1>Decibel (dB) Power / Voltage Ratio Calculator</h1>
      <h2>Calculate Decibel levels for power and voltage ratios</h2>
      <p>Used in electronics and telecommunications to measure signal strength.</p>
      <div className="calculator-form">
        <div className="form-fields">
          <Input
            label="Power Ratio"
            type="number"
            value={powerRatio !== null ? powerRatio : ''}
            onChange={(e) => setPowerRatio(parseFloat(e.target.value))}
            placeholder="Enter power ratio"
          />
          <Input
            label="Voltage Ratio"
            type="number"
            value={voltageRatio !== null ? voltageRatio : ''}
            onChange={(e) => setVoltageRatio(parseFloat(e.target.value))}
            placeholder="Enter voltage ratio"
          />
          <Button onClick={calculateDecibels}>Calculate</Button>
        </div>
        <ResultBox>{result}</ResultBox>
        <QuickTips>
          <ul>
            <li>Ensure ratios are positive numbers.</li>
            <li>Use either power or voltage ratio, not both.</li>
            <li>Decibels are a logarithmic unit used to express ratios.</li>
          </ul>
        </QuickTips>
      </div>
      <div className="educational-content">
        <section>
          <h3>Introduction</h3>
          <p>The Decibel (dB) Power / Voltage Ratio Calculator helps you determine the decibel levels for given power or voltage ratios. This is crucial in fields like electronics and telecommunications, where signal strength and clarity are paramount.</p>
          <p>Understanding decibel levels can aid in optimizing system performance and ensuring efficient communication. Use this calculator whenever you need to convert a power or voltage ratio into decibels.</p>
        </section>
        <section>
          <h3>How to Use This Calculator</h3>
          <ol>
            <li>Enter the power ratio if you have it, or the voltage ratio if applicable.</li>
            <li>Click 'Calculate' to see the decibel level.</li>
            <li>Interpret the result displayed in the result box.</li>
          </ol>
        </section>
        <section>
          <h3>Formulas / Theory</h3>
          <p>The decibel (dB) is a logarithmic unit used to express the ratio of two values. For power ratios, the formula is:</p>
          <p><strong>dB = 10 * log<sub>10</sub>(Power Ratio)</strong></p>
          <p>For voltage ratios, the formula is:</p>
          <p><strong>dB = 20 * log<sub>10</sub>(Voltage Ratio)</strong></p>
          <p>These formulas help quantify the relative change in power or voltage levels.</p>
        </section>
        <section>
          <h3>Worked Example</h3>
          <p>Suppose you have a power ratio of 5. To find the decibel level:</p>
          <ol>
            <li>Apply the formula: dB = 10 * log<sub>10</sub>(5)</li>
            <li>Calculate: dB = 10 * 0.69897 ≈ 6.99 dB</li>
            <li>The power ratio corresponds to approximately 6.99 dB.</li>
          </ol>
        </section>
        <section>
          <h3>Frequently Asked Questions</h3>
          <h4>What is a decibel?</h4>
          <p>A decibel (dB) is a unit used to measure the intensity of a sound or the power level of an electrical signal by comparing it with a given level on a logarithmic scale.</p>
          <h4>Why use decibels in electronics?</h4>
          <p>Decibels provide a convenient way to express large ratios and changes in signal strength, making it easier to handle and interpret data in electronics and telecommunications.</p>
          <h4>Can I use both power and voltage ratios simultaneously?</h4>
          <p>No, you should use either the power ratio or the voltage ratio, not both. Each has its own formula for calculating decibels.</p>
          <h4>What if my ratio is less than 1?</h4>
          <p>If your ratio is less than 1, the decibel value will be negative, indicating a decrease in power or voltage level.</p>
        </section>
        <section>
          <h3>References</h3>
          <ul>
            <li>IEEE Standards Association. (2020). IEEE Standard for Decibel Calculations.</li>
            <li>Electronics Tutorials. (2021). Decibel (dB) Tutorial.</li>
            <li>Federal Communications Commission. (2019). Understanding Decibels in Telecommunications.</li>
          </ul>
        </section>
        <p>Disclaimer: This calculator is for educational purposes only and does not replace professional advice. Always consult a qualified professional for specific guidance.</p>
      </div>
    </div>
  );
};

export default DecibelDbPowerVoltageRatioCalculator;