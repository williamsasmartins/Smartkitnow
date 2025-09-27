import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const DiscountCalculator = () => {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [result, setResult] = useState<{
    discountAmount: number;
    finalPrice: number;
    savings: number;
  } | null>(null);

  const calculateDiscount = () => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);

    if (price > 0 && discount >= 0 && discount <= 100) {
      const discountAmount = (price * discount) / 100;
      const finalPrice = price - discountAmount;

      setResult({
        discountAmount: Math.round(discountAmount * 100) / 100,
        finalPrice: Math.round(finalPrice * 100) / 100,
        savings: Math.round(discountAmount * 100) / 100
      });
    }
  };

  const handleReset = () => {
    setOriginalPrice('');
    setDiscountPercent('');
    setResult(null);
  };

  return (
    <CalculatorLayout
      title="Discount Calculator"
      description="Calculate the discount amount, final price, and total savings from a percentage discount."
      formula="Discount Amount = Original Price × (Discount % ÷ 100)"
      example="$100 item with 20% discount = $20 savings, $80 final price"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup
          label="Original Price"
          id="originalPrice"
          type="number"
          value={originalPrice}
          onChange={setOriginalPrice}
          placeholder="100"
          step="0.01"
          required
        />
        <InputGroup
          label="Discount Percentage"
          id="discountPercent"
          type="number"
          value={discountPercent}
          onChange={setDiscountPercent}
          placeholder="20"
          min={0}
          max={100}
          required
        />
      </div>

      <div className="flex gap-4">
        <Button onClick={calculateDiscount} className="flex-1">
          Calculate Discount
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {result && (
        <>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              title="Discount Amount"
              value={result.discountAmount}
              prefix="$"
              colorClass="text-red-600"
            />
            <ResultCard
              title="Final Price"
              value={result.finalPrice}
              prefix="$"
              colorClass="text-primary"
            />
            <ResultCard
              title="You Save"
              value={result.savings}
              prefix="$"
              colorClass="text-green-600"
            />
          </div>
        </>
      )}
    </CalculatorLayout>
  );
};