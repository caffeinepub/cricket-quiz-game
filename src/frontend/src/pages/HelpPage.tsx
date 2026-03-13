import {
  ChevronDown,
  Lightbulb,
  MessageSquare,
  Send,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "How do I ask a question?",
    a: "Simply type your question in the input box at the bottom of the chat screen and press Enter (or click the Send button). Kuzo AI will respond within a second.",
  },
  {
    q: "What topics can Kuzo AI answer?",
    a: "Kuzo AI covers education (study tips, exams, scholarships), careers (resume, interviews, salary), technology (programming, AI, apps), and general knowledge (science, history, health, geography).",
  },
  {
    q: "Can I have a multi-turn conversation?",
    a: "Yes! Your conversation history stays visible throughout the session. You can keep asking follow-up questions and the chat scrolls to show all messages.",
  },
  {
    q: "How do I clear the chat?",
    a: "Once you've sent at least one message, a trash icon appears on the left side of the input bar. Click it to clear all messages and start fresh.",
  },
  {
    q: "Does Kuzo AI save my conversations?",
    a: "No. All conversations are stored only in your browser's memory during the session. When you refresh or close the page, the chat history is cleared.",
  },
  {
    q: "Can I use Kuzo AI on mobile?",
    a: "Absolutely! Kuzo AI is fully mobile-friendly. The interface adapts to any screen size — phone, tablet, or desktop.",
  },
  {
    q: "Why didn't I get a specific answer?",
    a: "Kuzo AI uses a knowledge base of common topics. If your question is very specific or niche, it may not have a tailored answer yet. Try rephrasing or asking a more general question.",
  },
];

const STEPS = [
  {
    icon: MessageSquare,
    text: "Go to the Home page to open the chat interface",
  },
  { icon: Send, text: "Type your question in the input box and press Enter" },
  { icon: Lightbulb, text: "Kuzo AI will respond in about 1 second" },
  { icon: Trash2, text: "Use the trash icon to clear and start a new chat" },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      className="rounded-xl overflow-hidden transition-all cursor-pointer"
      style={{
        background: "oklch(0.16 0.03 250 / 0.8)",
        border: "1px solid oklch(0.28 0.05 250)",
      }}
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary className="flex items-center justify-between px-5 py-4 list-none select-none">
        <span className="font-medium text-sm text-foreground pr-4">{q}</span>
        <ChevronDown
          className="w-4 h-4 shrink-0 transition-transform"
          style={{
            color: "oklch(0.72 0.2 210)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </summary>
      <div className="px-5 pb-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
      </div>
    </details>
  );
}

export default function HelpPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10 animate-fade-up">
        <h1 className="font-display text-4xl text-foreground mb-3">
          Help Center
        </h1>
        <p className="text-muted-foreground">
          Everything you need to know about using Kuzo AI.
        </p>
      </div>

      <div
        className="rounded-2xl p-6 mb-8 animate-fade-up stagger-1"
        style={{
          background: "oklch(0.72 0.2 210 / 0.08)",
          border: "1px solid oklch(0.72 0.2 210 / 0.2)",
        }}
      >
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lightbulb
            className="w-4 h-4"
            style={{ color: "oklch(0.72 0.2 210)" }}
          />
          Quick Start Guide
        </h2>
        <ol className="space-y-3">
          {STEPS.map((step, i) => (
            <li key={step.text} className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
                style={{
                  background: "oklch(0.72 0.2 210 / 0.2)",
                  color: "oklch(0.78 0.18 200)",
                }}
              >
                {i + 1}
              </div>
              <span className="text-sm text-muted-foreground leading-relaxed">
                {step.text}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <h2 className="font-display text-2xl text-foreground mb-4 animate-fade-up stagger-2">
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {faqs.map((faq) => (
          <div key={faq.q} className="animate-fade-up">
            <FAQItem q={faq.q} a={faq.a} />
          </div>
        ))}
      </div>
    </div>
  );
}
