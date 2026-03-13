import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";

type Mode = "signin" | "signup";
type KuzoUser = { username: string; password: string };

export default function SignIn() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim() || !password.trim()) {
      setError("Username aur password dono zaroori hain");
      return;
    }
    if (password.length < 4) {
      setError("Password kam se kam 4 characters ka hona chahiye");
      return;
    }

    if (mode === "signup") {
      const existing = localStorage.getItem("kuzo_user");
      if (existing) {
        const user: KuzoUser = JSON.parse(existing);
        if (user.username === username.trim()) {
          setError("Yeh username already exist karta hai");
          return;
        }
      }
      const newUser: KuzoUser = { username: username.trim(), password };
      localStorage.setItem("kuzo_user", JSON.stringify(newUser));
      localStorage.setItem("kuzo_session", JSON.stringify(newUser));
      setSuccess("Account ban gaya! Home page pe ja rahe hain...");
      setTimeout(() => navigate({ to: "/" }), 1000);
    } else {
      const stored = localStorage.getItem("kuzo_user");
      if (!stored) {
        setError("Koi account nahi mila. Pehle Sign Up karo.");
        return;
      }
      const user: KuzoUser = JSON.parse(stored);
      if (user.username !== username.trim() || user.password !== password) {
        setError("Username ya password galat hai");
        return;
      }
      localStorage.setItem("kuzo_session", JSON.stringify(user));
      setSuccess("Login ho gaye! Ja rahe hain...");
      setTimeout(() => navigate({ to: "/" }), 800);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Wapas
            </Button>
          </Link>
          <span className="font-display font-bold text-lg text-primary">
            Kuzo Solution
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-1">
              {mode === "signin" ? "Wapas Aaye! 👋" : "Join Karo! 🎓"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "signin"
                ? "Apne account mein sign in karo"
                : "Naya account banao — bilkul free!"}
            </p>
          </div>

          {/* Tab Toggle */}
          <div
            className="flex rounded-xl border border-border bg-muted/40 p-1 gap-1 mb-6"
            data-ocid="signin.mode_toggle"
          >
            <button
              type="button"
              data-ocid="signin.signin_tab"
              onClick={() => {
                setMode("signin");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                mode === "signin"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              type="button"
              data-ocid="signin.signup_tab"
              onClick={() => {
                setMode("signup");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                mode === "signup"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl p-6 shadow-card"
          >
            {/* Username */}
            <div className="mb-4">
              <Label
                htmlFor="signin-username"
                className="text-sm font-semibold text-foreground mb-1.5 block"
              >
                Username
              </Label>
              <Input
                id="signin-username"
                data-ocid="signin.username_input"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="Apna username likhein"
                autoComplete="username"
                className="rounded-xl h-11"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <Label
                htmlFor="signin-password"
                className="text-sm font-semibold text-foreground mb-1.5 block"
              >
                Password
              </Label>
              <Input
                id="signin-password"
                data-ocid="signin.password_input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                className="rounded-xl h-11"
              />
            </div>

            {/* Error / Success */}
            {error && (
              <div
                data-ocid="signin.error_state"
                className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive"
              >
                ❌ {error}
              </div>
            )}
            {success && (
              <div
                data-ocid="signin.success_state"
                className="mb-4 rounded-lg bg-green-50 border border-green-200 px-3 py-2.5 text-sm text-green-700"
              >
                ✅ {success}
              </div>
            )}

            <Button
              type="submit"
              data-ocid="signin.submit_button"
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold gap-2"
            >
              {mode === "signin" ? (
                <>
                  <LogIn className="w-4 h-4" /> Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Account Banao
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            {mode === "signin" ? (
              <>
                Account nahi hai?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  Sign Up karo
                </button>
              </>
            ) : (
              <>
                Already account hai?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError("");
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  Sign In karo
                </button>
              </>
            )}
          </p>
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Kuzo Solution. Created by Kuzo
          </p>
        </div>
      </footer>
    </div>
  );
}
