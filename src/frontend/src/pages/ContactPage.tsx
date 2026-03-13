import { CheckCircle, Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-10 animate-fade-up">
        <h1 className="font-display text-4xl text-foreground mb-3">
          Contact Us
        </h1>
        <p className="text-muted-foreground">
          Have feedback or questions? We'd love to hear from you.
        </p>
      </div>

      <div
        className="rounded-2xl p-6 md:p-8 animate-fade-up stagger-1"
        style={{
          background: "oklch(0.16 0.03 250 / 0.8)",
          border: "1px solid oklch(0.28 0.05 250)",
        }}
      >
        {sent ? (
          <div className="text-center py-8" data-ocid="contact.success_state">
            <CheckCircle
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "oklch(0.6 0.18 155)" }}
            />
            <h2 className="font-display text-2xl text-foreground mb-2">
              Message Sent!
            </h2>
            <p className="text-muted-foreground text-sm">
              Thank you for reaching out. We'll get back to you soon.
            </p>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setForm({ name: "", email: "", message: "" });
              }}
              className="mt-6 px-5 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: "oklch(0.72 0.2 210 / 0.2)",
                color: "oklch(0.78 0.18 200)",
                border: "1px solid oklch(0.72 0.2 210 / 0.3)",
              }}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Your Name
              </label>
              <input
                id="contact-name"
                data-ocid="contact.input"
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Kush Ranjan"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all placeholder:text-muted-foreground"
                style={{
                  background: "oklch(0.19 0.04 250)",
                  border: "1px solid oklch(0.3 0.05 250)",
                  color: "oklch(0.93 0.015 230)",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Email Address
              </label>
              <input
                id="contact-email"
                data-ocid="contact.input"
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all placeholder:text-muted-foreground"
                style={{
                  background: "oklch(0.19 0.04 250)",
                  border: "1px solid oklch(0.3 0.05 250)",
                  color: "oklch(0.93 0.015 230)",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </label>
              <textarea
                id="contact-message"
                data-ocid="contact.textarea"
                required
                value={form.message}
                onChange={(e) =>
                  setForm((p) => ({ ...p, message: e.target.value }))
                }
                placeholder="Tell us your feedback, bug report, or feature request..."
                rows={5}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none transition-all placeholder:text-muted-foreground"
                style={{
                  background: "oklch(0.19 0.04 250)",
                  border: "1px solid oklch(0.3 0.05 250)",
                  color: "oklch(0.93 0.015 230)",
                }}
              />
            </div>
            <button
              type="submit"
              data-ocid="contact.submit_button"
              className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "oklch(0.72 0.2 210)",
                color: "oklch(0.08 0.02 250)",
                boxShadow: "0 0 16px oklch(0.72 0.2 210 / 0.3)",
              }}
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
            <div
              className="flex items-center gap-2 pt-2"
              style={{ color: "oklch(0.5 0.04 230)" }}
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="text-xs">
                Or email us at: kuzosolution@gmail.com
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
