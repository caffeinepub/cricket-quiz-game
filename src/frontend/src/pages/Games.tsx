import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Car,
  Clock,
  Dice6,
  PersonStanding,
  Puzzle,
  Shield,
  Zap,
} from "lucide-react";

const games = [
  {
    id: "quiz",
    to: "/quiz",
    icon: Brain,
    title: "Quiz Challenge",
    desc: "10 multiple-choice questions. 15 seconds per question. Test your general knowledge!",
    badge: "Knowledge",
    color: "neon-text-purple",
    border: "border-primary/40 hover:border-primary",
    bg: "bg-primary/10",
    iconBg: "bg-primary/15",
    details: ["10 Questions", "15s Timer", "Multiple Topics"],
  },
  {
    id: "puzzle",
    to: "/puzzle",
    icon: Puzzle,
    title: "Tile Puzzle",
    desc: "Classic 3×3 sliding tile puzzle. Arrange numbers 1-8 with the fewest moves!",
    badge: "Brain",
    color: "neon-text-cyan",
    border: "border-accent/40 hover:border-accent",
    bg: "bg-accent/10",
    iconBg: "bg-accent/15",
    details: ["3×3 Grid", "Move Counter", "Timed"],
  },
  {
    id: "racing",
    to: "/racing",
    icon: Car,
    title: "Neon Racer",
    desc: "Dodge oncoming traffic in a high-speed top-down racer. Survive as long as possible!",
    badge: "Speed",
    color: "neon-text-green",
    border: "border-success/40 hover:border-success",
    bg: "bg-success/10",
    iconBg: "bg-success/15",
    details: ["Arrow Keys", "Touch Controls", "High Score"],
  },
  {
    id: "survival",
    to: "/survival",
    icon: Shield,
    title: "Survive!",
    desc: "Collect food, dodge red enemies, and survive as long as you can in this chaos arena!",
    badge: "Survival",
    color: "text-warning",
    border: "border-warning/40 hover:border-warning",
    bg: "bg-warning/10",
    iconBg: "bg-warning/15",
    details: ["WASD/Arrows", "3 Lives", "Joystick"],
  },
  {
    id: "ludo",
    to: "/ludo",
    icon: Dice6,
    title: "Ludo Classic",
    desc: "Roll dice, move tokens, and race to the center! Play against the CPU in this classic board game.",
    badge: "Board",
    color: "text-orange-400",
    border: "border-orange-500/40 hover:border-orange-500",
    bg: "bg-orange-500/10",
    iconBg: "bg-orange-500/15",
    details: ["vs CPU", "4 Tokens", "Board Game"],
  },
  {
    id: "runner",
    to: "/runner",
    icon: PersonStanding,
    title: "Endless Runner",
    desc: "Run forever! Jump over obstacles, collect coins, and survive as long as you can at increasing speeds!",
    badge: "Action",
    color: "neon-text-cyan",
    border: "border-cyan-500/40 hover:border-cyan-500",
    bg: "bg-cyan-500/10",
    iconBg: "bg-cyan-500/15",
    details: ["Space to Jump", "Tap Support", "Endless"],
  },
];

export default function Games() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12" data-ocid="games.page">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold mb-3">
          <span className="neon-text-purple">Game</span> Hub
        </h1>
        <p className="text-muted-foreground text-lg">
          Pick a game and start playing instantly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((g) => (
          <div
            key={g.id}
            className={`game-card rounded-2xl p-8 bg-card ${g.border} transition-all`}
          >
            <div className="flex items-start gap-5">
              <div
                className={`w-16 h-16 rounded-2xl ${g.iconBg} flex items-center justify-center flex-shrink-0`}
              >
                <g.icon className={`w-8 h-8 ${g.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className={`font-display text-xl font-bold ${g.color}`}>
                    {g.title}
                  </h2>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${g.bg} ${g.color} border ${g.border.split(" ")[0]}`}
                  >
                    {g.badge}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{g.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {g.details.map((d) => (
                    <span
                      key={d}
                      className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full"
                    >
                      {d === "15s Timer" || d === "Timed" ? (
                        <Clock className="w-3 h-3" />
                      ) : (
                        <Zap className="w-3 h-3" />
                      )}
                      {d}
                    </span>
                  ))}
                </div>
                <Link
                  to={g.to}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm ${g.bg} ${g.color} border ${g.border.split(" ")[0]} hover:opacity-90 transition-all`}
                  data-ocid={`games.${g.id}.button`}
                >
                  Play Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
