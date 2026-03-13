export interface Question {
  id: string;
  studentName: string;
  subject: string;
  questionText: string;
  status: "pending" | "answered";
  answer: string;
  askedAt: string;
  answeredAt: string;
}

export const SUBJECTS = [
  "Math",
  "Science",
  "Hindi",
  "English",
  "History",
  "Geography",
  "Other",
] as const;

export const SUBJECT_COLORS: Record<string, string> = {
  Math: "bg-blue-100 text-blue-800",
  Science: "bg-green-100 text-green-800",
  Hindi: "bg-orange-100 text-orange-800",
  English: "bg-purple-100 text-purple-800",
  History: "bg-amber-100 text-amber-800",
  Geography: "bg-teal-100 text-teal-800",
  Other: "bg-gray-100 text-gray-700",
};
