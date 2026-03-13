import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Brain, Car, Puzzle, Shield, Trophy } from "lucide-react";
import { useState } from "react";

interface ScoreEntry {
  name: string;
  score: number;
  date: string;
}

function getScores(key: string): ScoreEntry[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

const MEDALS = ["🥇", "🥈", "🥉"];

function ScoreTable({
  scores,
  unit = "pts",
}: { scores: ScoreEntry[]; unit?: string }) {
  if (scores.length === 0) {
    return (
      <div className="text-center py-16" data-ocid="leaderboard.empty_state">
        <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
        <p className="text-muted-foreground">
          No scores yet. Play a game to set the first record!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2" data-ocid="leaderboard.list">
      {scores.map((s, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: sorted leaderboard position is stable
          key={i}
          className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border transition-all
            ${
              i === 0
                ? "border-warning/60 bg-warning/10"
                : i === 1
                  ? "border-muted-foreground/40 bg-muted/20"
                  : i === 2
                    ? "border-orange-700/40 bg-orange-900/10"
                    : "border-border bg-card/50"
            }`}
          data-ocid={`leaderboard.item.${i + 1}`}
        >
          <span className="text-2xl w-8 text-center">
            {i < 3 ? MEDALS[i] : `#${i + 1}`}
          </span>
          <span className="flex-1 font-semibold truncate">{s.name}</span>
          <span className="font-display font-bold text-neon-purple">
            {s.score} {unit}
          </span>
          <span className="text-xs text-muted-foreground hidden sm:block">
            {s.date}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Leaderboard() {
  const [tab, setTab] = useState("quiz");

  const quizScores = getScores("quiz_scores");
  const puzzleScores = getScores("puzzle_scores");
  const racingScores = getScores("racing_scores");
  const survivalScores = getScores("survival_scores");

  const tabs = [
    { id: "quiz", label: "Quiz", icon: Brain, scores: quizScores, unit: "/10" },
    {
      id: "puzzle",
      label: "Puzzle",
      icon: Puzzle,
      scores: puzzleScores,
      unit: "pts",
    },
    {
      id: "racing",
      label: "Racing",
      icon: Car,
      scores: racingScores,
      unit: "pts",
    },
    {
      id: "survival",
      label: "Survival",
      icon: Shield,
      scores: survivalScores,
      unit: "pts",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12" data-ocid="leaderboard.page">
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/games"
          className="p-2 rounded-lg hover:bg-muted/50 transition-all"
          data-ocid="leaderboard.back_button"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Trophy className="w-6 h-6 text-warning" />
        <h1 className="font-display text-2xl font-bold text-warning">
          Leaderboard
        </h1>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-4 mb-8 bg-card border border-border h-auto p-1 gap-1">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-neon-purple"
              data-ocid={`leaderboard.${t.id}.tab`}
            >
              <t.icon className="w-4 h-4" />
              <span className="text-xs">{t.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t) => (
          <TabsContent key={t.id} value={t.id}>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <t.icon className="w-5 h-5 neon-text-purple" />
                <h2 className="font-display text-lg font-bold">
                  {t.label} — Top 10
                </h2>
                <span className="ml-auto text-xs text-muted-foreground">
                  {t.scores.length} record{t.scores.length !== 1 ? "s" : ""}
                </span>
              </div>
              <ScoreTable scores={t.scores} unit={t.unit} />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="text-center mt-8">
        <Link
          to="/games"
          className="text-neon-cyan text-sm hover:underline"
          data-ocid="leaderboard.games_link"
        >
          ← Back to all games
        </Link>
      </div>
    </div>
  );
}
