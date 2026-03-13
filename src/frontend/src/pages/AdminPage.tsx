import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  LogOut,
  Save,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SUBJECT_COLORS } from "../types/question";
import type { Question } from "../types/question";
import { getQuestions, saveQuestion } from "../utils/questionStorage";

const ADMIN_USER = "admin";
const ADMIN_PASS = "kuzo123";
const SESSION_KEY = "kuzo_admin_logged_in";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AnswerForm({
  q,
  onSave,
}: { q: Question; onSave: (q: Question) => void }) {
  const [answer, setAnswer] = useState(q.answer || "");
  const [saving, setSaving] = useState(false);

  function handleSave() {
    if (!answer.trim()) {
      toast.error("Pehle jawab likho!");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const updated: Question = {
        ...q,
        answer: answer.trim(),
        status: "answered",
        answeredAt: new Date().toISOString(),
      };
      saveQuestion(updated);
      onSave(updated);
      setSaving(false);
      toast.success("Jawab save ho gaya! ✅");
    }, 400);
  }

  return (
    <div className="mt-3 border-t border-border pt-3">
      <Label className="text-xs font-semibold text-foreground mb-1.5 block">
        Jawab Likho (Markdown supported):
      </Label>
      <Textarea
        data-ocid="admin.answer_textarea"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Poori explanation likho... Step by step samjhao!"
        rows={6}
        className="rounded-xl resize-y text-sm"
      />
      <Button
        data-ocid="admin.save_button"
        onClick={handleSave}
        disabled={saving}
        size="sm"
        className="mt-2 bg-primary text-primary-foreground rounded-xl gap-1.5"
      >
        <Save className="w-3.5 h-3.5" />
        {saving ? "Save Ho Raha Hai..." : "Jawab Save Karo"}
      </Button>
    </div>
  );
}

function QuestionItem({
  q,
  index,
  onUpdate,
}: { q: Question; index: number; onUpdate: (q: Question) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      data-ocid={`admin.question.item.${index + 1}`}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      <button
        type="button"
        className="w-full p-4 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 rounded-full p-1.5 flex-shrink-0 ${q.status === "answered" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
          >
            {q.status === "answered" ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex flex-wrap gap-1.5 mb-1">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SUBJECT_COLORS[q.subject] ?? "bg-gray-100 text-gray-700"}`}
              >
                {q.subject}
              </span>
            </div>
            <p className="text-sm font-medium text-foreground line-clamp-2">
              {q.questionText}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {q.studentName} • {formatDate(q.askedAt)}
            </p>
          </div>
          <Eye
            className={`w-4 h-4 flex-shrink-0 mt-1 transition-colors ${expanded ? "text-primary" : "text-muted-foreground"}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          {q.status === "answered" && q.answer && (
            <div className="mb-3 p-3 bg-green-50 border border-green-100 rounded-lg">
              <p className="text-xs font-semibold text-green-700 mb-1">
                ✅ Diya Gaya Jawab:
              </p>
              <p className="text-xs text-green-800 line-clamp-3 whitespace-pre-wrap">
                {q.answer}
              </p>
            </div>
          )}
          <AnswerForm key={q.id + q.answeredAt} q={q} onSave={onUpdate} />
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [questions, setQuestions] = useState<Question[]>(getQuestions());

  function handleUpdate(updated: Question) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q)),
    );
  }

  const pending = questions.filter((q) => q.status === "pending");
  const answered = questions.filter((q) => q.status === "answered");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" /> Home
              </Button>
            </Link>
            <span className="font-display font-bold text-lg text-primary">
              Admin Dashboard
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="gap-1.5 text-muted-foreground rounded-xl"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 text-center shadow-card">
            <div className="text-2xl font-bold text-foreground">
              {questions.length}
            </div>
            <div className="text-xs text-muted-foreground">Kul Sawaal</div>
          </div>
          <div className="bg-card border border-green-200 rounded-xl p-4 text-center shadow-card">
            <div className="text-2xl font-bold text-green-700">
              {answered.length}
            </div>
            <div className="text-xs text-muted-foreground">Jawab Diye</div>
          </div>
          <div className="bg-card border border-amber-200 rounded-xl p-4 text-center shadow-card">
            <div className="text-2xl font-bold text-amber-700">
              {pending.length}
            </div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="mb-4 rounded-xl bg-muted/50">
            <TabsTrigger
              value="pending"
              data-ocid="admin.pending.tab"
              className="rounded-lg gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" /> Pending ({pending.length})
            </TabsTrigger>
            <TabsTrigger
              value="answered"
              data-ocid="admin.answered.tab"
              className="rounded-lg gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Jawab Diye (
              {answered.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pending.length === 0 ? (
              <div data-ocid="admin.empty_state" className="text-center py-12">
                <p className="text-3xl mb-3">🎉</p>
                <p className="font-semibold text-foreground">
                  Saare sawaalon ke jawab de diye!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Koi pending sawaal nahi hai
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pending.map((q, i) => (
                  <QuestionItem
                    key={q.id}
                    q={q}
                    index={i}
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="answered">
            {answered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Koi jawab nahi diya gaya abhi tak
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {answered.map((q, i) => (
                  <QuestionItem
                    key={q.id}
                    q={q}
                    index={i}
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border bg-card mt-4">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            Kuzo Solution Admin Panel • Created by Kuzo
          </p>
        </div>
      </footer>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem(SESSION_KEY, "1");
      onLogin();
    } else {
      setError("Galat username ya password!");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm animate-bounce-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Admin Login
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kuzo Solution Admin Panel
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-card border border-border rounded-2xl p-6 shadow-elevated"
        >
          <div className="mb-4">
            <Label
              htmlFor="admin-user"
              className="text-sm font-semibold mb-1.5 block"
            >
              Username
            </Label>
            <Input
              id="admin-user"
              data-ocid="admin.username_input"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="admin"
              className="rounded-xl h-11"
              autoComplete="username"
            />
          </div>
          <div className="mb-5">
            <Label
              htmlFor="admin-pass"
              className="text-sm font-semibold mb-1.5 block"
            >
              Password
            </Label>
            <Input
              id="admin-pass"
              data-ocid="admin.password_input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="••••••••"
              className="rounded-xl h-11"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive mb-4 text-center">{error}</p>
          )}
          <Button
            type="submit"
            data-ocid="admin.login_button"
            className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-semibold"
          >
            Login Karo
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4">
          <Link to="/" className="hover:underline text-primary/80">
            ← Home Par Jao
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(
    () => !!localStorage.getItem(SESSION_KEY),
  );

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    setLoggedIn(false);
  }

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  return <AdminDashboard onLogout={handleLogout} />;
}
