import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";

const STORAGE_KEY = "wallnova_user_email";

async function hashPassword(password: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (email: string) => void;
}

export default function AuthModal({
  open,
  onOpenChange,
  onLogin,
}: AuthModalProps) {
  const { actor } = useActor();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  function resetState() {
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirm("");
    setSignupError("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(loginEmail)) {
      setLoginError("Please enter a valid email address.");
      return;
    }
    if (!actor) {
      setLoginError("Connecting to server... Please try again in a moment.");
      return;
    }

    setLoginLoading(true);
    try {
      const hash = await hashPassword(loginPassword);
      const success = await actor.loginUser(
        loginEmail.toLowerCase().trim(),
        hash,
      );
      if (success) {
        const email = loginEmail.toLowerCase().trim();
        localStorage.setItem(STORAGE_KEY, email);
        onLogin(email);
        toast.success(`Welcome back! Logged in as ${email}`);
        onOpenChange(false);
        resetState();
      } else {
        setLoginError("Incorrect email or password. Please try again.");
      }
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setSignupError("");

    if (!signupEmail || !signupPassword || !signupConfirm) {
      setSignupError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(signupEmail)) {
      setSignupError("Please enter a valid email address.");
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match.");
      return;
    }
    if (!actor) {
      setSignupError("Connecting to server... Please try again in a moment.");
      return;
    }

    setSignupLoading(true);
    try {
      const hash = await hashPassword(signupPassword);
      const email = signupEmail.toLowerCase().trim();
      await actor.registerUser(email, hash);

      // Auto-login after signup
      const success = await actor.loginUser(email, hash);
      if (success) {
        localStorage.setItem(STORAGE_KEY, email);
        onLogin(email);
        toast.success("Account created! Welcome to WallNova HD 🎉");
        onOpenChange(false);
        resetState();
      } else {
        toast.success("Account created! Please log in.");
        onOpenChange(false);
        resetState();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.toLowerCase().includes("already") ||
        msg.toLowerCase().includes("exist")
      ) {
        setSignupError("This email is already registered. Please log in.");
      } else {
        setSignupError("Something went wrong. Please try again.");
      }
    } finally {
      setSignupLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) resetState();
      }}
    >
      <DialogContent
        className="sm:max-w-md p-0 overflow-hidden"
        style={{
          background: "oklch(11% 0.015 260)",
          border: "1px solid oklch(22% 0.02 260)",
          boxShadow:
            "0 0 40px oklch(57% 0.28 295 / 0.2), 0 25px 60px oklch(0% 0 0 / 0.7)",
        }}
        data-ocid="auth.dialog"
      >
        {/* Gradient header bar */}
        <div
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(57% 0.28 295), oklch(84% 0.19 200))",
          }}
        />

        <div className="px-6 pt-5 pb-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(57% 0.28 295), oklch(84% 0.19 200))",
                    boxShadow: "0 0 12px oklch(57% 0.28 295 / 0.4)",
                  }}
                >
                  <span className="text-white font-black text-sm">W</span>
                </div>
                <span className="font-display font-bold text-lg text-foreground">
                  WallNova{" "}
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(57% 0.28 295), oklch(84% 0.19 200))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    HD
                  </span>
                </span>
              </div>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                Sign in to save favorites across devices
              </p>
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="login" className="w-full">
            <TabsList
              className="w-full mb-5"
              style={{
                background: "oklch(14% 0.02 260)",
                border: "1px solid oklch(22% 0.02 260)",
              }}
            >
              <TabsTrigger
                value="login"
                className="flex-1 data-[state=active]:text-foreground"
                style={
                  {
                    // active state handled by data attr
                  }
                }
                data-ocid="auth.login.tab"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="flex-1 data-[state=active]:text-foreground"
                data-ocid="auth.signup.tab"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="login-email"
                    className="text-sm text-muted-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    autoComplete="email"
                    disabled={loginLoading}
                    style={{
                      background: "oklch(14% 0.02 260)",
                      border: "1px solid oklch(22% 0.02 260)",
                    }}
                    className="focus-visible:ring-1"
                    data-ocid="auth.login.input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="login-password"
                    className="text-sm text-muted-foreground"
                  >
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loginLoading}
                    style={{
                      background: "oklch(14% 0.02 260)",
                      border: "1px solid oklch(22% 0.02 260)",
                    }}
                    className="focus-visible:ring-1"
                    data-ocid="auth.login.input"
                  />
                </div>

                {loginError && (
                  <p
                    className="text-sm px-3 py-2 rounded-lg"
                    style={{
                      background: "oklch(60% 0.24 25 / 0.1)",
                      border: "1px solid oklch(60% 0.24 25 / 0.3)",
                      color: "oklch(70% 0.2 25)",
                    }}
                    data-ocid="auth.login.error_state"
                  >
                    {loginError}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full font-semibold"
                  disabled={loginLoading}
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(57% 0.28 295), oklch(68% 0.22 280))",
                    border: "none",
                    boxShadow: loginLoading
                      ? "none"
                      : "0 0 20px oklch(57% 0.28 295 / 0.35)",
                  }}
                  data-ocid="auth.login.submit_button"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="signup-email"
                    className="text-sm text-muted-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    autoComplete="email"
                    disabled={signupLoading}
                    style={{
                      background: "oklch(14% 0.02 260)",
                      border: "1px solid oklch(22% 0.02 260)",
                    }}
                    className="focus-visible:ring-1"
                    data-ocid="auth.signup.input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="signup-password"
                    className="text-sm text-muted-foreground"
                  >
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    autoComplete="new-password"
                    disabled={signupLoading}
                    style={{
                      background: "oklch(14% 0.02 260)",
                      border: "1px solid oklch(22% 0.02 260)",
                    }}
                    className="focus-visible:ring-1"
                    data-ocid="auth.signup.input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="signup-confirm"
                    className="text-sm text-muted-foreground"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Re-enter password"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    autoComplete="new-password"
                    disabled={signupLoading}
                    style={{
                      background: "oklch(14% 0.02 260)",
                      border: "1px solid oklch(22% 0.02 260)",
                    }}
                    className="focus-visible:ring-1"
                    data-ocid="auth.signup.input"
                  />
                </div>

                {signupError && (
                  <p
                    className="text-sm px-3 py-2 rounded-lg"
                    style={{
                      background: "oklch(60% 0.24 25 / 0.1)",
                      border: "1px solid oklch(60% 0.24 25 / 0.3)",
                      color: "oklch(70% 0.2 25)",
                    }}
                    data-ocid="auth.signup.error_state"
                  >
                    {signupError}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full font-semibold"
                  disabled={signupLoading}
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(84% 0.19 200 / 0.9), oklch(72% 0.22 200))",
                    border: "none",
                    color: "oklch(8% 0.01 260)",
                    boxShadow: signupLoading
                      ? "none"
                      : "0 0 20px oklch(84% 0.19 200 / 0.3)",
                  }}
                  data-ocid="auth.signup.submit_button"
                >
                  {signupLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-center text-muted-foreground mt-4">
            By continuing, you agree to our terms of service.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
