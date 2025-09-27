import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";

interface Course {
  id: string;
  grade: string;
  credits: string;
}

export function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", grade: "", credits: "" }
  ]);
  const [gpa, setGpa] = useState<number | null>(null);

  const gradePoints: { [key: string]: number } = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "D-": 0.7,
    "F": 0.0
  };

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      grade: "",
      credits: ""
    };
    setCourses([...courses, newCourse]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    for (const course of courses) {
      const credits = parseFloat(course.credits);
      const points = gradePoints[course.grade];

      if (!isNaN(credits) && points !== undefined && credits > 0) {
        totalPoints += points * credits;
        totalCredits += credits;
      }
    }

    if (totalCredits > 0) {
      setGpa(totalPoints / totalCredits);
    } else {
      setGpa(null);
    }
  };

  const clearAll = () => {
    setCourses([{ id: "1", grade: "", credits: "" }]);
    setGpa(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          GPA Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Calculate your Grade Point Average (GPA) based on your course grades and credit hours.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Your Courses</CardTitle>
          <CardDescription>
            Add your courses with their grades and credit hours to calculate your GPA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {courses.map((course, index) => (
            <div key={course.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label htmlFor={`course-${course.id}`}>Course {index + 1}</Label>
                <Input
                  id={`course-${course.id}`}
                  placeholder="Course name (optional)"
                  className="bg-muted/30"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor={`grade-${course.id}`}>Grade</Label>
                <Select
                  value={course.grade}
                  onValueChange={(value) => updateCourse(course.id, "grade", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(gradePoints).map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade} ({gradePoints[grade]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`credits-${course.id}`}>Credit Hours</Label>
                <Input
                  id={`credits-${course.id}`}
                  type="number"
                  placeholder="Credits"
                  value={course.credits}
                  onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                  min="0"
                  step="0.5"
                />
              </div>
              <div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeCourse(course.id)}
                  disabled={courses.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <Button onClick={addCourse} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
            <Button onClick={calculateGPA}>
              Calculate GPA
            </Button>
            <Button onClick={clearAll} variant="secondary">
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {gpa !== null && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {gpa.toFixed(3)}
              </div>
              <p className="text-muted-foreground">
                GPA on a 4.0 scale
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>GPA Scale Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(gradePoints).map(([grade, points]) => (
              <div key={grade} className="text-center p-2 border rounded">
                <div className="font-semibold">{grade}</div>
                <div className="text-sm text-muted-foreground">{points}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>GPA is calculated using the standard 4.0 scale. Each grade has a point value, and your GPA is the weighted average based on credit hours.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
