import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Shield } from "lucide-react";

interface CalculatorFooterProps {
  calculatorName: string;
  description: string;
  formula: string;
  sources: { title: string; url: string }[];
}

export function CalculatorFooter({ calculatorName, description, formula, sources }: CalculatorFooterProps) {
  return (
    <div className="mt-12 space-y-6">
      {/* How this calculator works */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground flex items-center space-x-2">
            <span>How this calculator works</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
          
          {/* Formula block */}
          <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
            <h4 className="font-semibold text-foreground mb-2">Formula:</h4>
            <code className="text-sm bg-background/50 px-3 py-2 rounded font-mono text-foreground block">
              {formula}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Sources and References */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">
            Sources and References
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sources.map((source, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-foreground">{source.title}</span>
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
              >
                <span className="text-sm">Visit</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Review Note */}
      <Card className="bg-muted/30 border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">Quality Assured</Badge>
              <p className="text-sm text-muted-foreground">
                Content has been internally reviewed to ensure accurate formulas and precise results.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}