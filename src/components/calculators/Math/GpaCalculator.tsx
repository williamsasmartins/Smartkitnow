import { useMemo, useState } from "react";
import { Calculator, Plus, RotateCcw, Trash2 } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

type Course = {
  name: string;
  credits: string;
  grade: string;
};

const DEFAULT_COURSES: Course[] = [
  { name: "Course 1", credits: "3", grade: "A" },
  { name: "Course 2", credits: "3", grade: "B+" },
  { name: "Course 3", credits: "4", grade: "A-" },
];

function toNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const normalized = trimmed.replace(/,/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

function clampNumber(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function normalizeGrade(raw: string) {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

function gradePoints(letter: string) {
  const g = normalizeGrade(letter);
  const MAP: Record<string, number> = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    "D-": 0.7,
    F: 0.0,
  };
  return MAP[g];
}

function formatNumber(n: number, digits = 2) {
  return n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);

  const faqJsonLd = useFaqJsonLd([
    {
      question: "How is GPA calculated?",
      answer: "GPA = (sum of (grade points × credits)) ÷ (sum of credits).",
    },
    {
      question: "What if my school uses a different scale?",
      answer: "This tool uses a common 4.0 scale. If your institution differs, treat this as an estimate.",
    },
  ]);

  const { totalCredits, qualityPoints, gpa } = useMemo(() => {
    let totalCredits = 0;
    let qualityPoints = 0;

    for (const c of courses) {
      const credits = clampNumber(toNumber(c.credits), 0, 50);
      const gp = gradePoints(c.grade);
      if (credits <= 0 || gp === undefined) continue;
      totalCredits += credits;
      qualityPoints += gp * credits;
    }

    const gpa = totalCredits > 0 ? qualityPoints / totalCredits : 0;
    return { totalCredits, qualityPoints, gpa };
  }, [courses]);

  const onAddCourse = () => {
    setCourses((prev) => [...prev, { name: `Course ${prev.length + 1}`, credits: "3", grade: "A" }]);
  };

  const onRemoveCourse = (idx: number) => {
    setCourses((prev) => prev.filter((_, i) => i !== idx));
  };

  const onReset = () => setCourses(DEFAULT_COURSES);

  return (
    <CalculatorVerticalLayout
      title="GPA Calculator"
      description="Calculate your GPA using a common 4.0 grading scale and course credits."
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "faq", label: "FAQ" },
      ]}
    >
      <section id="calculator" className="scroll-mt-24">
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-[#5c82ee]" />
              GPA Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">GPA</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(gpa, 2)}</p>
                </CardContent>
              </Card>
              <Card className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total credits</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(totalCredits, 0)}</p>
                </CardContent>
              </Card>
              <Card className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Quality points</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{formatNumber(qualityPoints, 2)}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {courses.map((course, idx) => (
                <Card key={idx} className="border-slate-200 dark:border-slate-700">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-6 space-y-2">
                        <Label htmlFor={`course-name-${idx}`}>Course</Label>
                        <Input
                          id={`course-name-${idx}`}
                          value={course.name}
                          onChange={(e) =>
                            setCourses((prev) =>
                              prev.map((c, i) => (i === idx ? { ...c, name: e.target.value } : c)),
                            )
                          }
                        />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <Label htmlFor={`course-credits-${idx}`}>Credits</Label>
                        <Input
                          id={`course-credits-${idx}`}
                          inputMode="decimal"
                          value={course.credits}
                          onChange={(e) =>
                            setCourses((prev) =>
                              prev.map((c, i) => (i === idx ? { ...c, credits: e.target.value } : c)),
                            )
                          }
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor={`course-grade-${idx}`}>Grade</Label>
                        <Input
                          id={`course-grade-${idx}`}
                          value={course.grade}
                          onChange={(e) =>
                            setCourses((prev) =>
                              prev.map((c, i) => (i === idx ? { ...c, grade: e.target.value } : c)),
                            )
                          }
                          placeholder="A, B+, C-"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => onRemoveCourse(idx)}
                          aria-label="Remove course"
                          disabled={courses.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Button type="button" variant="default" className="gap-2" onClick={onAddCourse}>
                  <Plus className="h-4 w-4" />
                  Add course
                </Button>
                <Button type="button" variant="outline" className="gap-2" onClick={onReset}>
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Valid grades: A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="faq" className="scroll-mt-24" />
    </CalculatorVerticalLayout>
  );
}

