import { useActor } from "@/hooks/useActor";
import {
  BookOpen,
  Bot,
  Briefcase,
  Globe,
  Send,
  Sparkles,
  Trash2,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  { icon: BookOpen, label: "Study tips", query: "Give me 3 study tips" },
  {
    icon: Briefcase,
    label: "Resume writing",
    query: "How to write a good resume?",
  },
  {
    icon: Zap,
    label: "What is AI?",
    query: "What is artificial intelligence?",
  },
  { icon: Globe, label: "Capital of India", query: "Capital of India" },
];

function formatText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/);
    return (
      // biome-ignore lint/suspicious/noArrayIndexKey: static text rendering
      <span key={lineIdx}>
        {parts.map((p, partIdx) =>
          p.startsWith("**") && p.endsWith("**") ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: static text rendering
            <strong key={partIdx}>{p.slice(2, -2)}</strong>
          ) : (
            p
          ),
        )}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function ChatHome() {
  const { actor } = useActor();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message/typing changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(query?: string) {
    const text = (query ?? input).trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: nextId.current++,
      role: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      if (!actor) throw new Error("Actor not ready");
      // Cast to any because the generated backend.ts type is stale;
      // askGemini is defined in the Motoko canister and declared in backend.d.ts
      const answer: string = await (actor as any).askGemini(text);
      const aiMsg: Message = {
        id: nextId.current++,
        role: "assistant",
        text: answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (_err) {
      const errMsg: Message = {
        id: nextId.current++,
        role: "assistant",
        text: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-56px-53px)]">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {isEmpty && (
            <div className="text-center py-10 animate-fade-up">
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
              <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
                Ask me anything
              </h1>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                Powered by Gemini AI — education, technology, jobs, and more.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-8 max-w-sm mx-auto">
                {SUGGESTIONS.map((s) => (
                  <button
                    type="button"
                    key={s.label}
                    onClick={() => sendMessage(s.query)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "oklch(0.18 0.04 250 / 0.8)",
                      border: "1px solid oklch(0.72 0.2 210 / 0.18)",
                      color: "oklch(0.85 0.02 230)",
                    }}
                  >
                    <s.icon
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: "oklch(0.72 0.2 210)" }}
                    />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 mb-4 animate-msg-in ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5"
                style={{
                  background:
                    msg.role === "assistant"
                      ? "oklch(0.72 0.2 210 / 0.2)"
                      : "oklch(0.25 0.06 250)",
                  border:
                    msg.role === "assistant"
                      ? "1px solid oklch(0.72 0.2 210 / 0.35)"
                      : "1px solid oklch(0.35 0.07 250)",
                }}
              >
                {msg.role === "assistant" ? (
                  <Bot
                    className="w-4 h-4"
                    style={{ color: "oklch(0.78 0.18 200)" }}
                  />
                ) : (
                  <User
                    className="w-4 h-4"
                    style={{ color: "oklch(0.72 0.12 230)" }}
                  />
                )}
              </div>
              <div
                className={`max-w-[80%] flex flex-col gap-1 ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className="px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
                  style={{
                    background:
                      msg.role === "user"
                        ? "oklch(0.72 0.2 210 / 0.2)"
                        : "oklch(0.18 0.04 250 / 0.9)",
                    border:
                      msg.role === "user"
                        ? "1px solid oklch(0.72 0.2 210 / 0.4)"
                        : "1px solid oklch(0.28 0.05 250)",
                    color: "oklch(0.93 0.015 230)",
                    borderRadius:
                      msg.role === "user"
                        ? "1rem 0.25rem 1rem 1rem"
                        : "0.25rem 1rem 1rem 1rem",
                  }}
                >
                  {formatText(msg.text)}
                </div>
                <span
                  className="text-xs px-1"
                  style={{ color: "oklch(0.45 0.04 230)" }}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 mb-4 animate-msg-in">
              <div
                className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
                style={{
                  background: "oklch(0.72 0.2 210 / 0.2)",
                  border: "1px solid oklch(0.72 0.2 210 / 0.35)",
                }}
              >
                <Bot
                  className="w-4 h-4"
                  style={{ color: "oklch(0.78 0.18 200)" }}
                />
              </div>
              <div
                className="flex items-center gap-1.5 px-4 py-3"
                style={{
                  background: "oklch(0.18 0.04 250 / 0.9)",
                  border: "1px solid oklch(0.28 0.05 250)",
                  borderRadius: "0.25rem 1rem 1rem 1rem",
                }}
              >
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div
        className="border-t px-4 py-3"
        style={{
          background: "oklch(0.13 0.025 255 / 0.9)",
          borderColor: "oklch(0.25 0.04 250)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-2xl mx-auto flex gap-2 items-end">
          {!isEmpty && (
            <button
              type="button"
              onClick={() => setMessages([])}
              data-ocid="chat.primary_button"
              className="p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shrink-0"
              style={{
                background: "oklch(0.2 0.035 250)",
                border: "1px solid oklch(0.3 0.05 250)",
                color: "oklch(0.6 0.04 230)",
              }}
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <div className="flex-1">
            <textarea
              data-ocid="chat.input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground"
              style={{
                background: "oklch(0.19 0.04 250)",
                border: "1px solid oklch(0.3 0.05 250)",
                color: "oklch(0.93 0.015 230)",
                minHeight: "44px",
                maxHeight: "120px",
                lineHeight: "1.5",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "oklch(0.72 0.2 210 / 0.6)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 2px oklch(0.72 0.2 210 / 0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "oklch(0.3 0.05 250)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => sendMessage()}
            data-ocid="chat.submit_button"
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background:
                input.trim() && !isTyping
                  ? "oklch(0.72 0.2 210)"
                  : "oklch(0.2 0.035 250)",
              border: "1px solid oklch(0.72 0.2 210 / 0.4)",
              color:
                input.trim() && !isTyping
                  ? "oklch(0.08 0.02 250)"
                  : "oklch(0.5 0.04 230)",
              boxShadow:
                input.trim() && !isTyping
                  ? "0 0 12px oklch(0.72 0.2 210 / 0.3)"
                  : "none",
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p
          className="text-center text-xs mt-2"
          style={{ color: "oklch(0.35 0.03 250)" }}
        >
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
