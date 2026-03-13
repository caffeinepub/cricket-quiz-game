import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Result, SubjectResult } from "../backend.d";
import { useAddOrUpdateResult } from "../hooks/useQueries";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingResult: Result | null;
}

interface SubjectForm {
  subjectName: string;
  marksObtained: string;
  maxMarks: string;
}

function calcGrade(pct: number): string {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
}

export default function AddEditResultModal({
  open,
  onOpenChange,
  editingResult,
}: Props) {
  const mutation = useAddOrUpdateResult();

  const [rollNumber, setRollNumber] = useState("");
  const [studentName, setStudentName] = useState("");
  const [examName, setExamName] = useState("");
  const [subjects, setSubjects] = useState<SubjectForm[]>([
    { subjectName: "", marksObtained: "", maxMarks: "" },
  ]);

  const isEditing = !!editingResult;

  useEffect(() => {
    if (!open) return;
    if (editingResult) {
      setRollNumber(editingResult.rollNumber);
      setStudentName(editingResult.studentName);
      setExamName(editingResult.examName);
      setSubjects(
        editingResult.subjects.map((s) => ({
          subjectName: s.subjectName,
          marksObtained: String(Number(s.marksObtained)),
          maxMarks: String(Number(s.maxMarks)),
        })),
      );
    } else {
      setRollNumber("");
      setStudentName("");
      setExamName("");
      setSubjects([{ subjectName: "", marksObtained: "", maxMarks: "" }]);
    }
  }, [editingResult, open]);

  const addSubject = () =>
    setSubjects((prev) => [
      ...prev,
      { subjectName: "", marksObtained: "", maxMarks: "" },
    ]);

  const removeSubject = (idx: number) =>
    setSubjects((prev) => prev.filter((_, i) => i !== idx));

  const updateSubject = (
    idx: number,
    field: keyof SubjectForm,
    value: string,
  ) =>
    setSubjects((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    );

  const totalMarks = subjects.reduce(
    (s, sub) => s + (Number(sub.maxMarks) || 0),
    0,
  );
  const obtainedMarks = subjects.reduce(
    (s, sub) => s + (Number(sub.marksObtained) || 0),
    0,
  );
  const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
  const grade = calcGrade(percentage);
  const passed = percentage >= 33;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber || !studentName || !examName) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (
      subjects.some((s) => !s.subjectName || !s.marksObtained || !s.maxMarks)
    ) {
      toast.error("Please fill in all subject details");
      return;
    }

    const result: Result = {
      rollNumber: rollNumber.trim(),
      studentName: studentName.trim(),
      examName: examName.trim(),
      subjects: subjects.map(
        (s): SubjectResult => ({
          subjectName: s.subjectName.trim(),
          marksObtained: BigInt(Math.round(Number(s.marksObtained))),
          maxMarks: BigInt(Math.round(Number(s.maxMarks))),
        }),
      ),
      totalMarks: BigInt(Math.round(totalMarks)),
      obtainedMarks: BigInt(Math.round(obtainedMarks)),
      percentage,
      grade,
      passed,
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    };

    try {
      await mutation.mutateAsync(result);
      toast.success(
        isEditing ? "Result updated successfully" : "Result added successfully",
      );
      onOpenChange(false);
    } catch {
      toast.error("Failed to save result");
    }
  };

  const skeletonCols = ["name", "obtained", "max", "del"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="admin.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEditing ? "Edit Result" : "Add New Result"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="rollNumber">Roll Number *</Label>
              <Input
                id="rollNumber"
                placeholder="2024-CS-001"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                disabled={isEditing}
                required
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="studentName">Student Name *</Label>
              <Input
                id="studentName"
                placeholder="Full name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                data-ocid="admin.input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="examName">Exam Name *</Label>
            <Input
              id="examName"
              placeholder="Annual Examination 2024"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              required
              data-ocid="admin.input"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-semibold">Subjects</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubject}
                className="gap-1.5"
                data-ocid="admin.secondary_button"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Subject
              </Button>
            </div>

            <div className="space-y-3">
              {subjects.map((sub, idx) => (
                <div
                  key={`subject-${skeletonCols[0]}-${idx}`}
                  className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center p-3 rounded-lg border bg-muted/30"
                  data-ocid={`admin.item.${idx + 1}`}
                >
                  <Input
                    placeholder="Subject name"
                    value={sub.subjectName}
                    onChange={(e) =>
                      updateSubject(idx, "subjectName", e.target.value)
                    }
                    className="min-w-0"
                    data-ocid="admin.input"
                  />
                  <Input
                    placeholder="Obtained"
                    type="number"
                    min="0"
                    value={sub.marksObtained}
                    onChange={(e) =>
                      updateSubject(idx, "marksObtained", e.target.value)
                    }
                    className="w-24"
                    data-ocid="admin.input"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    min="1"
                    value={sub.maxMarks}
                    onChange={(e) =>
                      updateSubject(idx, "maxMarks", e.target.value)
                    }
                    className="w-24"
                    data-ocid="admin.input"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive/60 hover:text-destructive"
                    onClick={() => removeSubject(idx)}
                    disabled={subjects.length === 1}
                    data-ocid={`admin.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {subjects.some((s) => s.maxMarks) && (
            <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  Total Marks
                </p>
                <p className="font-bold font-mono">{totalMarks}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Obtained</p>
                <p className="font-bold font-mono">{obtainedMarks}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  Percentage
                </p>
                <p className="font-bold">{percentage.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Grade</p>
                <p className="font-bold">
                  {grade} • {passed ? "PASS" : "FAIL"}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              style={{ background: "oklch(0.32 0.12 240)", color: "white" }}
              data-ocid="admin.submit_button"
            >
              {mutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isEditing ? "Update Result" : "Save Result"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
