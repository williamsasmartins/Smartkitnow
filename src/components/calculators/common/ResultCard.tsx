import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  colorClass?: string;
}

export const ResultCard = ({ title, value, suffix = '', colorClass = 'text-primary' }: ResultCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className={colorClass}>
        <h2 className="text-3xl font-bold">{value}{suffix}</h2>
      </CardContent>
    </Card>
  );
};
