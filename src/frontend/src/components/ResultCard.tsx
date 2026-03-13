import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, CheckCircle2, Printer, XCircle } from "lucide-react";
import type { Result } from "../backend.d";

interface Props {
  result: Result;
}

function getGradeStyle(grade: string) {
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    "A+": {
      bg: "oklch(0.95 0.05 145)",
      text: "oklch(0.3 0.18 145)",
      border: "oklch(0.75 0.15 145)",
    },
    A: {
      bg: "oklch(0.95 0.04 175)",
      text: "oklch(0.3 0.16 175)",
      border: "oklch(0.7 0.14 175)",
    },
    B: {
      bg: "oklch(0.95 0.04 240)",
      text: "oklch(0.3 0.14 240)",
      border: "oklch(0.65 0.12 240)",
    },
    C: {
      bg: "oklch(0.97 0.06 80)",
      text: "oklch(0.4 0.18 80)",
      border: "oklch(0.75 0.16 80)",
    },
    D: {
      bg: "oklch(0.97 0.06 50)",
      text: "oklch(0.4 0.18 50)",
      border: "oklch(0.75 0.16 50)",
    },
    F: {
      bg: "oklch(0.97 0.05 25)",
      text: "oklch(0.4 0.2 25)",
      border: "oklch(0.65 0.2 25)",
    },
  };
  return styles[grade] ?? styles.C;
}

export default function ResultCard({ result }: Props) {
  const gradeStyle = getGradeStyle(result.grade);
  const percentage = result.percentage.toFixed(2);

  const handlePrint = () => window.print();

  return (
    <div className="print-card bg-card border rounded-xl shadow-result overflow-hidden">
      {/* Top banner */}
      <div
        className="px-6 py-5 flex items-center justify-between gap-4"
        style={{ background: "oklch(0.32 0.12 240)", color: "white" }}
      >
        <div className="flex items-center gap-3">
          <Award className="w-7 h-7 opacity-80" />
          <div>
            <h2 className="font-display text-xl font-bold">
              Examination Result
            </h2>
            <p className="text-sm opacity-75">{result.examName}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrint}
          className="no-print gap-2 border border-white/30 text-white hover:bg-white/15"
          data-ocid="result.primary_button"
        >
          <Printer className="w-4 h-4" />
          Print
        </Button>
      </div>

      {/* Student info */}
      <div className="px-6 pt-6 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
            Student Name
          </p>
          <p className="font-display text-lg font-semibold">
            {result.studentName}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
            Roll Number
          </p>
          <p className="font-mono font-semibold text-base">
            {result.rollNumber}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
            Examination
          </p>
          <p className="font-semibold">{result.examName}</p>
        </div>
      </div>

      {/* Subjects table */}
      <div className="px-6 py-4">
        <h3 className="font-display font-semibold text-base mb-3">
          Subject-wise Marks
        </h3>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Marks Obtained</TableHead>
                <TableHead className="text-center">Max Marks</TableHead>
                <TableHead className="text-center">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.subjects.map((sub, idx) => {
                const pct =
                  Number(sub.maxMarks) > 0
                    ? (
                        (Number(sub.marksObtained) / Number(sub.maxMarks)) *
                        100
                      ).toFixed(1)
                    : "0.0";
                const isPassing =
                  Number(sub.marksObtained) / Number(sub.maxMarks) >= 0.33;
                return (
                  <TableRow
                    key={`${sub.subjectName}-${idx}`}
                    data-ocid={`result.item.${idx + 1}`}
                  >
                    <TableCell className="font-medium">
                      {sub.subjectName}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      <span
                        className={
                          isPassing
                            ? "text-emerald-700 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {Number(sub.marksObtained)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground font-mono">
                      {Number(sub.maxMarks)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`text-sm font-medium ${
                          isPassing ? "text-emerald-700" : "text-red-600"
                        }`}
                      >
                        {pct}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Summary */}
      <div className="px-6 pb-6">
        <div
          className="rounded-xl p-5 border"
          style={{ background: "oklch(0.97 0.01 240)" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Total Obtained
              </p>
              <p
                className="font-display text-2xl font-bold"
                style={{ color: "oklch(0.32 0.12 240)" }}
              >
                {Number(result.obtainedMarks)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Marks</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {Number(result.totalMarks)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Overall %</p>
              <p
                className="font-display text-2xl font-bold"
                style={{ color: "oklch(0.42 0.15 240)" }}
              >
                {percentage}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Grade</p>
              <span
                className="inline-block px-3 py-1 rounded-full font-bold font-display text-lg border"
                style={{
                  background: gradeStyle.bg,
                  color: gradeStyle.text,
                  borderColor: gradeStyle.border,
                }}
              >
                {result.grade}
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            {result.passed ? (
              <div
                className="flex items-center gap-3 px-8 py-3 rounded-full font-bold text-lg"
                style={{
                  background: "oklch(0.9 0.1 145)",
                  color: "oklch(0.28 0.18 145)",
                }}
                data-ocid="result.success_state"
              >
                <CheckCircle2 className="w-6 h-6" />
                PASSED
              </div>
            ) : (
              <div
                className="flex items-center gap-3 px-8 py-3 rounded-full font-bold text-lg"
                style={{
                  background: "oklch(0.93 0.08 25)",
                  color: "oklch(0.4 0.22 25)",
                }}
                data-ocid="result.error_state"
              >
                <XCircle className="w-6 h-6" />
                FAILED
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
