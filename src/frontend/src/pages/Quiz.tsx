import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  Clock,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Question {
  q: string;
  options: string[];
  answer: number;
  category: string;
}

const questions: Question[] = [
  {
    q: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: 2,
    category: "Geography",
  },
  {
    q: "Which planet is closest to the Sun?",
    options: ["Venus", "Mars", "Earth", "Mercury"],
    answer: 3,
    category: "Science",
  },
  {
    q: "How many sides does a hexagon have?",
    options: ["5", "6", "7", "8"],
    answer: 1,
    category: "Math",
  },
  {
    q: "Who wrote 'Romeo and Juliet'?",
    options: [
      "Charles Dickens",
      "William Shakespeare",
      "Jane Austen",
      "Mark Twain",
    ],
    answer: 1,
    category: "Literature",
  },
  {
    q: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    answer: 3,
    category: "Geography",
  },
  {
    q: "How many players are in a soccer team?",
    options: ["9", "10", "11", "12"],
    answer: 2,
    category: "Sports",
  },
  {
    q: "What gas do plants absorb from the air?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    answer: 2,
    category: "Science",
  },
  {
    q: "Which country invented pizza?",
    options: ["Spain", "France", "Greece", "Italy"],
    answer: 3,
    category: "Culture",
  },
  {
    q: "What is the speed of light (approx)?",
    options: ["3×10⁵ km/s", "3×10⁶ km/s", "3×10⁷ km/s", "3×10⁸ km/s"],
    answer: 3,
    category: "Science",
  },
  {
    q: "Which element has the symbol 'Au'?",
    options: ["Silver", "Iron", "Gold", "Copper"],
    answer: 2,
    category: "Science",
  },
];

type Phase = "intro" | "playing" | "result" | "save";

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timer, setTimer] = useState(15);
  const [playerName, setPlayerName] = useState("");

  const handleAnswer = useCallback(
    (idx: number | null) => {
      if (selected !== null) return;
      setSelected(idx);
      const correct = idx === questions[current].answer;
      if (correct) setScore((s) => s + 1);

      setTimeout(() => {
        if (current + 1 >= questions.length) {
          setPhase("result");
        } else {
          setCurrent((c) => c + 1);
          setSelected(null);
          setTimer(15);
        }
      }, 1000);
    },
    [selected, current],
  );

  useEffect(() => {
    if (phase !== "playing") return;
    if (selected !== null) return;
    if (timer <= 0) {
      handleAnswer(null);
      return;
    }
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timer, selected, handleAnswer]);

  function startGame() {
    setPhase("playing");
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setTimer(15);
  }

  function saveScore() {
    if (!playerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    const entry = {
      name: playerName.trim(),
      score,
      date: new Date().toLocaleDateString(),
    };
    const existing = JSON.parse(localStorage.getItem("quiz_scores") || "[]");
    existing.push(entry);
    existing.sort(
      (a: { score: number }, b: { score: number }) => b.score - a.score,
    );
    localStorage.setItem("quiz_scores", JSON.stringify(existing.slice(0, 10)));
    toast.success("Score saved!");
    setPhase("intro");
  }

  const q = questions[current];
  const timerPercent = (timer / 15) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12" data-ocid="quiz.page">
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/games"
          className="p-2 rounded-lg hover:bg-muted/50 transition-all"
          data-ocid="quiz.back_button"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 neon-text-purple" />
          <h1 className="font-display text-2xl font-bold neon-text-purple">
            Quiz Challenge
          </h1>
        </div>
      </div>

      {phase === "intro" && (
        <div
          className="glass rounded-2xl p-10 text-center"
          data-ocid="quiz.intro.panel"
        >
          <Brain className="w-16 h-16 neon-text-purple mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold mb-3">
            Ready to Test Your Knowledge?
          </h2>
          <p className="text-muted-foreground mb-2">
            10 questions · 15 seconds per question
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            Topics: Geography, Science, Sports, Literature &amp; more
          </p>
          <Button
            onClick={startGame}
            className="px-10 py-4 text-lg bg-primary hover:bg-primary/90 glow-purple"
            data-ocid="quiz.start_button"
          >
            Start Quiz
          </Button>
        </div>
      )}

      {phase === "playing" && (
        <div
          className="glass rounded-2xl overflow-hidden"
          data-ocid="quiz.question.panel"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Question {current + 1}/10
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-neon-purple font-semibold">
              {q.category}
            </span>
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <Clock
                className={`w-4 h-4 ${timer <= 5 ? "text-destructive" : "text-neon-cyan"}`}
              />
              <span
                className={timer <= 5 ? "text-destructive" : "text-neon-cyan"}
              >
                {timer}s
              </span>
            </div>
          </div>

          {/* Timer bar */}
          <div className="h-1 bg-muted">
            <div
              className="h-full transition-all duration-1000"
              style={{
                width: `${timerPercent}%`,
                background:
                  timer > 5 ? "oklch(0.78 0.22 200)" : "oklch(0.6 0.24 25)",
              }}
            />
          </div>

          <div className="p-6">
            <p className="text-lg font-semibold mb-6">{q.q}</p>
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((opt, i) => {
                let variant = "default";
                if (selected !== null) {
                  if (i === q.answer) variant = "correct";
                  else if (i === selected && selected !== q.answer)
                    variant = "wrong";
                }
                return (
                  <button
                    type="button"
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed 4-option list
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selected !== null}
                    className={`text-left px-5 py-3.5 rounded-xl border font-medium transition-all flex items-center justify-between
                      ${
                        variant === "correct"
                          ? "border-success bg-success/20 text-neon-green"
                          : variant === "wrong"
                            ? "border-destructive bg-destructive/20 text-destructive"
                            : selected !== null
                              ? "border-border text-muted-foreground"
                              : "border-border hover:border-primary/60 hover:bg-primary/10 cursor-pointer"
                      }`}
                    data-ocid={`quiz.option.${i + 1}`}
                  >
                    <span>{opt}</span>
                    {variant === "correct" && (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    {variant === "wrong" && <XCircle className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-6 pb-4 text-sm text-muted-foreground">
            Score:{" "}
            <span className="text-neon-purple font-bold">
              {score}/{current}
            </span>
          </div>
        </div>
      )}

      {phase === "result" && (
        <div
          className="glass rounded-2xl p-10 text-center"
          data-ocid="quiz.result.panel"
        >
          <Trophy className="w-16 h-16 text-warning mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold mb-2">
            Quiz Complete!
          </h2>
          <p className="text-muted-foreground mb-6">
            You answered {score} out of 10 correctly
          </p>
          <div className="text-6xl font-display font-extrabold neon-text-purple mb-8">
            {score}/10
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setPhase("save")}
              className="bg-primary hover:bg-primary/90"
              data-ocid="quiz.save_button"
            >
              <Trophy className="w-4 h-4 mr-2" /> Save Score
            </Button>
            <Button
              variant="outline"
              onClick={startGame}
              data-ocid="quiz.replay_button"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Play Again
            </Button>
            <Link to="/games">
              <Button variant="ghost" data-ocid="quiz.games_button">
                Back to Games
              </Button>
            </Link>
          </div>
        </div>
      )}

      {phase === "save" && (
        <div
          className="glass rounded-2xl p-10 text-center"
          data-ocid="quiz.save.panel"
        >
          <Trophy className="w-12 h-12 text-warning mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">
            Save Your Score
          </h2>
          <p className="text-muted-foreground mb-6">
            Score:{" "}
            <span className="neon-text-purple font-bold text-xl">
              {score}/10
            </span>
          </p>
          <Input
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="max-w-xs mx-auto mb-4"
            onKeyDown={(e) => e.key === "Enter" && saveScore()}
            data-ocid="quiz.name_input"
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={saveScore}
              className="bg-primary hover:bg-primary/90"
              data-ocid="quiz.confirm_button"
            >
              Save
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPhase("intro")}
              data-ocid="quiz.cancel_button"
            >
              Skip
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
