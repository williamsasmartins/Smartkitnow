import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/calculators/common/CalculatorLayout";
import { InputGroup } from "@/components/calculators/common/InputGroup";
import { ResultCard } from "@/components/calculators/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const DiscountCalculator = () => {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);

  const calculateDiscount = () => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercentage);
    if (price >= 0 && discount >= 0 && discount <= 100) {
      const discountAmount = (price * discount) / 100;
      setDiscountedPrice(price - discountAmount);
    }
  };

  const handleReset = () => {
    setOriginalPrice('');
    setDiscountPercentage('');
    setDiscountedPrice(null);
  };

  return (
    <CalculatorLayout
      title="Discount Calculator"
      description="Calculate the discounted price based on the original price and discount percentage."
      formula="Discounted Price = Original Price - (Original Price × Discount % / 100)"
      example="Original $100 with 20% discount = $80"
    >
      <div className="space-y-4">
        <InputGroup
          label="Original Price ($)"
          id="originalPrice"
          type="number"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          placeholder="100"
          required
        />
        <InputGroup
          label="Discount Percentage (%)"
          id="discountPercentage"
          type="number"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
          placeholder="20"
          required
        />
        <div className="flex gap-4">
          <Button onClick={calculateDiscount} className="flex-1">Calculate</Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>
        {discountedPrice !== null && (
          <>
            <Separator />
            <ResultCard
              title="Discounted Price"
              value={discountedPrice.toFixed(2)}
              suffix="$"
              colorClass="text-primary"
            />
          </>
        )}
      </div>
    </CalculatorLayout>
  );
};
