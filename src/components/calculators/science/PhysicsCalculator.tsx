import React, { useState } from 'react';
import { CalculatorLayout } from "@/components/common/CalculatorLayout";
import { InputGroup } from "@/components/common/InputGroup";
import { ResultCard } from "@/components/common/ResultCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const PhysicsCalculator = () => {
  const [mass, setMass] = useState('');
  const [acceleration, setAcceleration] = useState('');
  const [velocity, setVelocity] = useState('');
  const [time, setTime] = useState('');
  const [distance, setDistance] = useState('');
  const [activeTab, setActiveTab] = useState('force');
  const [result, setResult] = useState<number | null>(null);

  const calculateForce = () => {
    const m = parseFloat(mass);
    const a = parseFloat(acceleration);
    if (m > 0 && a >= 0) {
      setResult(m * a);
    }
  };

  const calculateVelocity = () => {
    const d = parseFloat(distance);
    const t = parseFloat(time);
    if (d >= 0 && t > 0) {
      setResult(d / t);
    }
  };

  const calculateAcceleration = () => {
    const v = parseFloat(velocity);
    const t = parseFloat(time);
    if (v >= 0 && t > 0) {
      setResult(v / t);
    }
  };

  const handleReset = () => {
    setMass('');
    setAcceleration('');
    setVelocity('');
    setTime('');
    setDistance('');
    setResult(null);
  };

  const getCalculateFunction = () => {
    switch (activeTab) {
      case 'force': return calculateForce;
      case 'velocity': return calculateVelocity;
      case 'acceleration': return calculateAcceleration;
      default: return calculateForce;
    }
  };

  return (
    <CalculatorLayout
      title="Physics Calculator"
      description="Calculate force, velocity, acceleration and other physics quantities."
      formula="F = ma, v = d/t, a = v/t"
      example="Force = 10kg × 9.8m/s² = 98N"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="force">Force (F=ma)</TabsTrigger>
          <TabsTrigger value="velocity">Velocity (v=d/t)</TabsTrigger>
          <TabsTrigger value="acceleration">Acceleration (a=v/t)</TabsTrigger>
        </TabsList>

        <TabsContent value="force" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Mass (kg)"
              id="mass"
              type="number"
              value={mass}
              onChange={setMass}
              placeholder="10"
              required
            />
            <InputGroup
              label="Acceleration (m/s²)"
              id="acceleration"
              type="number"
              value={acceleration}
              onChange={setAcceleration}
              placeholder="9.8"
              step="0.1"
              required
            />
          </div>
        </TabsContent>

        <TabsContent value="velocity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Distance (m)"
              id="distance"
              type="number"
              value={distance}
              onChange={setDistance}
              placeholder="100"
              required
            />
            <InputGroup
              label="Time (s)"
              id="time"
              type="number"
              value={time}
              onChange={setTime}
              placeholder="10"
              step="0.1"
              required
            />
          </div>
        </TabsContent>

        <TabsContent value="acceleration" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Velocity (m/s)"
              id="velocity"
              type="number"
              value={velocity}
              onChange={setVelocity}
              placeholder="20"
              step="0.1"
              required
            />
            <InputGroup
              label="Time (s)"
              id="time"
              type="number"
              value={time}
              onChange={setTime}
              placeholder="5"
              step="0.1"
              required
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button onClick={getCalculateFunction()} className="flex-1">
          Calculate
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      {result !== null && (
        <>
          <Separator />
          <ResultCard
            title={activeTab === 'force' ? 'Force' : activeTab === 'velocity' ? 'Velocity' : 'Acceleration'}
            value={Math.round(result * 100) / 100}
            suffix={activeTab === 'force' ? ' N' : activeTab === 'velocity' ? ' m/s' : ' m/s²'}
            colorClass="text-primary"
          />
        </>
      )}
    </CalculatorLayout>
  );
};
