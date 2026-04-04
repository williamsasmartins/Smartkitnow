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
      answer:
        "GPA = (sum of grade points × credits) ÷ (sum of credits). Each letter grade converts to a grade point value: A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, B- = 2.7, C+ = 2.3, C = 2.0, and so on down to F = 0.0. Multiply each course's grade points by its credit hours, add up all those products, then divide by total credit hours.",
    },
    {
      question: "What GPA is needed for the Dean's List?",
      answer:
        "Dean's List requirements vary by institution, but the most common threshold is a semester GPA of 3.5 or higher. Some schools require 3.7 or 3.8 for honors distinction. Check your institution's academic honor policy — many also require a minimum number of credit hours taken in the semester.",
    },
    {
      question: "What if my school uses a different grading scale?",
      answer:
        "This calculator uses the standard US 4.0 scale. Some schools use a 5.0 scale for honors/AP courses, while international institutions may use percentage-based or letter-only systems. If your school differs, use this as an estimate and convert using your institution's official grade-point equivalency table.",
    },
    {
      question: "Can I calculate GPA for just one semester vs. cumulative GPA?",
      answer:
        "Yes — this calculator handles both. For a single semester GPA, enter only that semester's courses. For cumulative GPA, enter all courses completed to date. If you want to project what GPA you need this semester to reach a target cumulative GPA, use the formula: Required Semester GPA = (Target GPA × Total Credits Needed) − (Current GPA × Current Credits) ÷ (Credits This Semester).",
    },
    {
      question: "Do retaken courses improve GPA?",
      answer:
        "It depends on your school's policy. Most US institutions practice 'grade forgiveness' or 'grade replacement' — the new grade replaces the old one in the GPA calculation, though both may appear on the transcript. Some schools average the two attempts. Check with your registrar before retaking a course specifically to improve GPA.",
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

  const editorial = (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-3">Understanding the 4.0 GPA Scale</h2>
        <p className="text-muted-foreground leading-relaxed">
          The 4.0 scale is the standard US college grading system. Each letter grade maps to
          a numeric grade point value, and your GPA is the weighted average of those values
          across all courses, where the weight is the credit-hour value of each course. A
          4-credit lecture counts twice as heavily as a 2-credit lab.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="text-sm w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Letter Grade</th>
                <th className="text-left p-2 font-semibold">Grade Points</th>
                <th className="text-left p-2 font-semibold">Percentage Range</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["A / A+", "4.0", "93–100%"],
                ["A-", "3.7", "90–92%"],
                ["B+", "3.3", "87–89%"],
                ["B", "3.0", "83–86%"],
                ["B-", "2.7", "80–82%"],
                ["C+", "2.3", "77–79%"],
                ["C", "2.0", "73–76%"],
                ["C-", "1.7", "70–72%"],
                ["D+", "1.3", "67–69%"],
                ["D", "1.0", "63–66%"],
                ["D-", "0.7", "60–62%"],
                ["F", "0.0", "Below 60%"],
              ].map(([grade, points, pct]) => (
                <tr key={grade} className="border-b last:border-0">
                  <td className="p-2 font-medium">{grade}</td>
                  <td className="p-2">{points}</td>
                  <td className="p-2">{pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Common GPA Thresholds</h2>
        <ul className="space-y-2 text-muted-foreground list-disc ml-6">
          <li><strong>4.0:</strong> Perfect GPA — all A grades</li>
          <li><strong>3.7–3.9:</strong> Summa Cum Laude range at most universities</li>
          <li><strong>3.5–3.69:</strong> Magna Cum Laude / Dean's List at most schools</li>
          <li><strong>3.0–3.49:</strong> Cum Laude range; competitive for many graduate programs</li>
          <li><strong>2.0:</strong> Minimum passing GPA required by most institutions</li>
          <li><strong>Below 2.0:</strong> Academic probation risk at many colleges</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Graduate school admissions typically require a minimum 3.0 undergraduate GPA,
          with competitive programs expecting 3.5+. Medical schools typically require 3.7+
          science GPA. Law schools use a slightly different calculation (LSAC GPA) that
          may differ from your transcript GPA.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">How to Raise Your GPA</h2>
        <p className="text-muted-foreground leading-relaxed">
          GPA changes slowly because past grades remain in the calculation. The credit-hour
          weight means high-credit courses have the most impact — one 4-credit A converts
          2.7 quality points per credit more efficiently than two 2-credit courses. Focus
          on: attending office hours for high-credit courses before exams, dropping courses
          before the grade deadline if needed (check your school's withdrawal policy), and
          retaking courses with grade forgiveness if your school offers it.
        </p>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="GPA Calculator"
      description="Calculate your semester or cumulative GPA using the standard 4.0 scale. Includes full grade-point conversion table and GPA thresholds for Dean's List and graduate school admissions."
      jsonLd={faqJsonLd}
      formula={{
        formula: "GPA = Σ(Grade Points × Credits) ÷ Σ(Credits)",
        variables: [
          { symbol: "Grade Points", description: "Numeric value for letter grade (A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0; ± 0.3 for +/−)" },
          { symbol: "Credits", description: "Credit-hour weight of each course" },
        ],
        title: "GPA Formula (4.0 Scale)",
      }}
      editorial={editorial}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "scale", label: "4.0 Scale Table" },
        { id: "thresholds", label: "GPA Thresholds" },
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

      <section id="faq" className="scroll-mt-24" aria-label="FAQ" />
    </CalculatorVerticalLayout>
  );
}

