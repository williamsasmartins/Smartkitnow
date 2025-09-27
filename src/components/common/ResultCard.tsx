import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface ResultCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  colorClass?: string;
  prefix?: string;
  suffix?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  subtitle,
  colorClass = "text-primary",
  prefix = "",
  suffix = ""
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <div className={`text-2xl font-bold ${colorClass}`}>
            {prefix}{formatValue(value)}{suffix}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground/80 mt-1">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};