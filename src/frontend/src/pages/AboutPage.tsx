import {
  BookOpen,
  Briefcase,
  Globe,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Answers",
    desc: "Get helpful responses in under a second. No waiting, no loading screens.",
  },
  {
    icon: BookOpen,
    title: "Education",
    desc: "Study tips, exam prep, scholarships, college admissions, and online courses.",
  },
  {
    icon: Briefcase,
    title: "Career & Jobs",
    desc: "Resume writing, interview prep, salary negotiation, and career guidance.",
  },
  {
    icon: Globe,
    title: "General Knowledge",
    desc: "Science, history, geography, health, nutrition, and much more.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "Your conversations stay on your device. We don't store or track your questions.",
  },
  {
    icon: Sparkles,
    title: "Always Learning",
    desc: "Our knowledge base is continuously updated to keep answers relevant and accurate.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12 animate-fade-up">
        <div
          className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-5 mx-auto"
          style={{
            background: "oklch(0.72 0.2 210 / 0.15)",
            border: "1px solid oklch(0.72 0.2 210 / 0.3)",
            boxShadow: "0 0 24px oklch(0.72 0.2 210 / 0.2)",
          }}
        >
          <Sparkles
            className="w-7 h-7"
            style={{ color: "oklch(0.78 0.18 200)" }}
          />
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
          About Kuzo AI
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Kuzo AI is a smart question-and-answer assistant designed to give you
          fast, clear, and helpful answers — covering education, technology,
          careers, and everyday knowledge.
        </p>
      </div>

      {/* Mission */}
      <div
        className="rounded-2xl p-6 mb-10 animate-fade-up stagger-1"
        style={{
          background: "oklch(0.72 0.2 210 / 0.08)",
          border: "1px solid oklch(0.72 0.2 210 / 0.2)",
        }}
      >
        <h2 className="font-display text-2xl text-foreground mb-3">
          Our Mission
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          We believe everyone deserves access to knowledge. Kuzo AI was created
          to democratize information — giving students, job seekers, and curious
          minds instant access to well-structured, accurate answers without
          complexity or cost.
        </p>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`rounded-xl p-5 animate-fade-up stagger-${Math.min(i + 1, 4)}`}
            style={{
              background: "oklch(0.16 0.03 250 / 0.8)",
              border: "1px solid oklch(0.28 0.05 250)",
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{
                background: "oklch(0.72 0.2 210 / 0.15)",
                border: "1px solid oklch(0.72 0.2 210 / 0.25)",
              }}
            >
              <f.icon
                className="w-4 h-4"
                style={{ color: "oklch(0.78 0.18 200)" }}
              />
            </div>
            <h3 className="font-semibold text-foreground mb-1.5 text-sm">
              {f.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Creator */}
      <div
        className="rounded-2xl p-6 text-center animate-fade-up"
        style={{
          background: "oklch(0.16 0.03 250 / 0.8)",
          border: "1px solid oklch(0.28 0.05 250)",
        }}
      >
        <p className="text-muted-foreground text-sm mb-1">Created with ❤️ by</p>
        <p className="font-display text-2xl text-foreground">Kush Ranjan</p>
      </div>
    </div>
  );
}
