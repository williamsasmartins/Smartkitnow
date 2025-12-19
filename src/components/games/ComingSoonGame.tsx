import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  description?: string;
};

export default function ComingSoonGame({ title, description }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <header className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
            {description}
          </p>
        )}
      </header>

      <Card className="border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 h-64"
            aria-label="Game preview area"
          >
            <span className="text-slate-500 dark:text-slate-400">Game coming soon</span>
          </div>
          <div className="mt-4">
            <Button className="w-full" disabled>
              Play
            </Button>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">
              This game will be available soon. Stay tuned!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
