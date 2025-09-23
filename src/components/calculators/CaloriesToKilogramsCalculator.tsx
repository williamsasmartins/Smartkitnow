import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, AlertCircle, CheckCircle, Info } from "lucide-react";

interface CaloriesToKgProps {}

const CaloriesToKilogramsCalculator: React.FC<CaloriesToKgProps> = () => {
  const [calories, setCalories] = useState<number | "">("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [result, setResult] = useState<{ kg: number; message: string } | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const activityFactors = {
    sedentary: { factor: 0.90, label: "Sedentário" },
    light: { factor: 0.95, label: "Levemente Ativo" },
    moderate: { factor: 1.00, label: "Moderadamente Ativo" },
    active: { factor: 1.05, label: "Ativo" },
    veryActive: { factor: 1.10, label: "Muito Ativo" }
  };

  const calculateCaloriesToKg = () => {
    setLoading(true);
    setError("");
    setResult(null);

    if (!calories || Number(calories) <= 0) {
      setError("Por favor, insira uma quantidade válida de calorias (maior que 0).");
      setLoading(false);
      return;
    }

    if (!activityLevel) {
      setError("Por favor, selecione seu nível de atividade física.");
      setLoading(false);
      return;
    }

    try {
      const calValue = Number(calories);
      const factor = activityFactors[activityLevel as keyof typeof activityFactors].factor;
      const kgEquivalent = (calValue / 7700) * factor;
      
      setResult({
        kg: kgEquivalent,
        message: `${calValue.toLocaleString()} calorias equivalem a aproximadamente ${kgEquivalent.toFixed(3)} kg de gordura corporal, considerando seu nível de atividade "${activityFactors[activityLevel as keyof typeof activityFactors].label}".`
      });
    } catch (err) {
      setError("Erro ao calcular. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const resetCalculator = () => {
    setCalories("");
    setActivityLevel("");
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <Calculator className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle className="text-2xl">Convert Calories to Kilograms</CardTitle>
            <CardDescription>
              Transforme calorias em peso corporal equivalente para entender melhor seu metabolismo e metas de fitness
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-6">
          {error && (
            <Alert variant="destructive" className="border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="calories" className="text-sm font-medium text-gray-700">
                Quantidade de Calorias
              </label>
              <Input
                id="calories"
                type="number"
                placeholder="Ex: 3500"
                value={calories}
                onChange={(e) => setCalories(e.target.value === "" ? "" : Number(e.target.value))}
                min="0"
                step="1"
                className="w-full"
              />
              <p className="text-xs text-gray-500">Unidade: kcal (quilocalorias)</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="activityLevel" className="text-sm font-medium text-gray-700">
                Nível de Atividade Física
              </label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione seu nível de atividade..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
                  <SelectItem value="light">Levemente ativo (exercício leve 1-3 dias/semana)</SelectItem>
                  <SelectItem value="moderate">Moderadamente ativo (exercício moderado 3-5 dias/semana)</SelectItem>
                  <SelectItem value="active">Ativo (exercício intenso 6-7 dias/semana)</SelectItem>
                  <SelectItem value="veryActive">Muito ativo (exercício muito intenso e trabalho físico)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={calculateCaloriesToKg} 
              disabled={!calories || !activityLevel || loading}
              className="flex-1"
            >
              {loading ? <>Calculando...</> : (<><Calculator className="h-4 w-4 mr-2" />Calcular</>)}
            </Button>
            {(calories || activityLevel) && (
              <Button variant="outline" onClick={resetCalculator} className="flex-0">
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-xl">Resultado da Conversão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-blue-600">
                <span className="text-gray-600">{Number(calories).toLocaleString()}</span>
                <span className="text-gray-400">kcal</span>
                <span className="text-gray-400">→</span>
                <span>{result.kg.toFixed(3)}</span>
                <span className="text-gray-400">kg</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{result.message}</p>
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>💡 Dica:</strong> Para perder 1kg de gordura, você precisa criar um déficit de cerca de 7.700 calorias através de dieta e exercício.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>Como Usar a Calculadora</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: 1, title: "Insira as Calorias", desc: "Digite a quantidade de calorias que você quer converter" },
              { step: 2, title: "Selecione Atividade", desc: "Escolha seu nível de atividade física atual" },
              { step: 3, title: "Obtenha o Resultado", desc: "Clique em 'Calcular' para ver o equivalente em kg" }
            ].map((item) => (
              <div key={item.step} className="text-center space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold">{item.step}</span>
                </div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaloriesToKilogramsCalculator;