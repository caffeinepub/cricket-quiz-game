import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Car,
  Monitor,
  Puzzle,
  Shield,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Quiz Games",
    desc: "Test your knowledge with fun quizzes on various topics — science, geography, sports & more.",
    color: "neon-text-purple",
    glow: "border-primary/40 hover:border-primary/80",
    bg: "bg-primary/10",
    to: "/quiz",
  },
  {
    icon: Puzzle,
    title: "Puzzle Games",
    desc: "Solve challenging sliding tile puzzles and sharpen your problem-solving skills.",
    color: "neon-text-cyan",
    glow: "border-accent/40 hover:border-accent/80",
    bg: "bg-accent/10",
    to: "/puzzle",
  },
  {
    icon: Car,
    title: "Car Racing Games",
    desc: "Race at full speed, dodge oncoming traffic, and beat your personal best score.",
    color: "neon-text-green",
    glow: "border-success/40 hover:border-success/80",
    bg: "bg-success/10",
    to: "/racing",
  },
  {
    icon: Shield,
    title: "Survival Games",
    desc: "Survive thrilling scenarios — collect food, dodge enemies, outlast everyone.",
    color: "text-warning",
    glow: "border-warning/40 hover:border-warning/80",
    bg: "bg-warning/10",
    to: "/survival",
  },
];

const extras = [
  {
    icon: Zap,
    label: "Multi-Game Access",
    desc: "Switch between games instantly",
  },
  {
    icon: Monitor,
    label: "Medium Graphics",
    desc: "Smooth gameplay on any device",
  },
  {
    icon: Trophy,
    label: "Leaderboard",
    desc: "Compete globally, track scores",
  },
];

export default function Home() {
  return (
    <div data-ocid="home.page">
      {/* Hero */}
      <section className="relative hero-gradient scanlines overflow-hidden py-24 md:py-36">
        {/* Decorative orbs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "oklch(0.65 0.28 300)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: "oklch(0.78 0.22 200)" }}
        />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-neon-purple text-sm font-semibold mb-6 animate-fade-up">
            <Star className="w-4 h-4" fill="currentColor" />
            Free & Instant — No Downloads Required
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-fade-up stagger-1">
            <span className="neon-text-purple">Kuzo</span>{" "}
            <span className="text-foreground">Game Hub</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-4 animate-fade-up stagger-2">
            Play <span className="neon-text-cyan">Quiz</span>,{" "}
            <span className="neon-text-purple">Puzzle</span>,{" "}
            <span className="neon-text-green">Racing</span> &amp;{" "}
            <span className="text-warning">Survival</span> Games Online
          </p>

          <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up stagger-3">
            Welcome to Kuzo Game Hub! Enjoy a variety of games all in one place
            – from brain-teasing quizzes and tricky puzzles to high-speed car
            racing and survival challenges. Play instantly on your browser with
            smooth medium-quality graphics, no downloads required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up stagger-4">
            <Link
              to="/games"
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all glow-purple animate-pulse-glow"
              data-ocid="home.primary_button"
            >
              Play Now – Free &amp; Instant Access!
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-accent/40 text-neon-cyan font-semibold hover:bg-accent/10 transition-all"
              data-ocid="home.secondary_button"
            >
              <Trophy className="w-5 h-5" />
              View Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* Games grid */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-3">
          Choose Your Game
        </h2>
        <p className="text-muted-foreground text-center mb-12">
          Four unique games, one epic platform.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className={`game-card rounded-xl p-6 bg-card flex flex-col gap-4 ${f.glow} cursor-pointer`}
              data-ocid="home.game.card"
            >
              <div
                className={`w-14 h-14 rounded-xl ${f.bg} flex items-center justify-center`}
              >
                <f.icon className={`w-7 h-7 ${f.color}`} />
              </div>
              <div>
                <h3
                  className={`font-display font-bold text-lg mb-1 ${f.color}`}
                >
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
              <div
                className={`mt-auto flex items-center gap-1 text-sm font-semibold ${f.color}`}
              >
                Play Now <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Extra features */}
      <section className="border-t border-border bg-card/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">
            Everything You Need to Play
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {extras.map((e) => (
              <div
                key={e.label}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <e.icon className="w-6 h-6 neon-text-purple" />
                </div>
                <div>
                  <h4 className="font-display font-bold">{e.label}</h4>
                  <p className="text-muted-foreground text-sm mt-1">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Ready to Play?
        </h2>
        <p className="text-muted-foreground mb-8">
          Jump in instantly — no account, no downloads needed.
        </p>
        <Link
          to="/games"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all glow-purple"
          data-ocid="home.cta_button"
        >
          Start Playing <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
