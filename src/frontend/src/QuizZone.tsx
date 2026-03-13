import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = "pop" | "science" | "sports" | "general";

interface Question {
  q: string;
  options: string[];
  correct: number;
}

interface ScoreEntry {
  name: string;
  category: Category;
  score: number;
  total: number;
  date: string;
}

type Screen = "home" | "name" | "quiz" | "result" | "leaderboard";

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<
  Category,
  { label: string; icon: string; gradient: string; glow: string }
> = {
  pop: {
    label: "Pop Culture",
    icon: "🎬",
    gradient: "from-pink-500 via-rose-500 to-orange-500",
    glow: "shadow-pink-500/40",
  },
  science: {
    label: "Science",
    icon: "🔬",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    glow: "shadow-cyan-500/40",
  },
  sports: {
    label: "Sports",
    icon: "⚽",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    glow: "shadow-green-500/40",
  },
  general: {
    label: "General Knowledge",
    icon: "🌍",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    glow: "shadow-violet-500/40",
  },
};

const QUESTIONS: Record<Category, Question[]> = {
  pop: [
    {
      q: 'Who sang "Blinding Lights"?',
      options: ["Drake", "The Weeknd", "Post Malone", "Bruno Mars"],
      correct: 1,
    },
    {
      q: "Which movie won Oscar Best Picture 2023?",
      options: [
        "Avatar",
        "Top Gun",
        "Everything Everywhere All at Once",
        "Tár",
      ],
      correct: 2,
    },
    {
      q: "What app is known for short videos?",
      options: ["Snapchat", "Instagram", "TikTok", "Twitter"],
      correct: 2,
    },
    {
      q: 'Which singer is known as "Queen Bey"?',
      options: ["Rihanna", "Beyoncé", "Adele", "Taylor Swift"],
      correct: 1,
    },
    {
      q: '"Minecraft" was created by?',
      options: ["EA", "Nintendo", "Mojang", "Ubisoft"],
      correct: 2,
    },
    {
      q: "Harry Styles was in which band?",
      options: ["BTS", "NSYNC", "One Direction", "Backstreet Boys"],
      correct: 2,
    },
    {
      q: '"Squid Game" is from which country?',
      options: ["Japan", "China", "Korea", "Thailand"],
      correct: 2,
    },
    {
      q: 'Spider-Man actor in "No Way Home"?',
      options: ["Andrew Garfield", "Tobey Maguire", "Tom Holland", "Tom Hardy"],
      correct: 2,
    },
    {
      q: '"Shape of You" by?',
      options: ["Ed Sheeran", "Sam Smith", "Lewis Capaldi", "Shawn Mendes"],
      correct: 0,
    },
    {
      q: "Which game popularized Battle Royale mode first?",
      options: ["Fortnite", "PUBG", "Apex Legends", "Call of Duty"],
      correct: 1,
    },
  ],
  science: [
    {
      q: "What planet is closest to the Sun?",
      options: ["Venus", "Earth", "Mercury", "Mars"],
      correct: 2,
    },
    {
      q: "What is the chemical formula for water?",
      options: ["H3O", "HO2", "H2O", "H2O2"],
      correct: 2,
    },
    {
      q: "Speed of light (km/s)?",
      options: ["300,000", "150,000", "450,000", "100,000"],
      correct: 0,
    },
    {
      q: "How many bones do humans have?",
      options: ["196", "206", "216", "226"],
      correct: 1,
    },
    {
      q: "Largest organ in the human body?",
      options: ["Heart", "Liver", "Skin", "Lung"],
      correct: 2,
    },
    {
      q: "DNA stands for?",
      options: [
        "Dioxin Nucleic Acid",
        "Deoxyribonucleic Acid",
        "Double Nucleic Atom",
        "Digital Nucleic Array",
      ],
      correct: 1,
    },
    {
      q: "Which planet has rings?",
      options: ["Jupiter", "Neptune", "Saturn", "Uranus"],
      correct: 2,
    },
    {
      q: "Sound travels fastest in?",
      options: ["Air", "Vacuum", "Water", "Steel"],
      correct: 3,
    },
    {
      q: "Photosynthesis produces?",
      options: ["CO2", "Nitrogen", "Oxygen", "Hydrogen"],
      correct: 2,
    },
    {
      q: "Newton's first law is also called?",
      options: [
        "Law of Energy",
        "Law of Motion",
        "Law of Inertia",
        "Law of Gravity",
      ],
      correct: 2,
    },
  ],
  sports: [
    {
      q: "FIFA World Cup 2022 winner?",
      options: ["France", "Brazil", "Argentina", "Germany"],
      correct: 2,
    },
    {
      q: "Cricket: Most Test centuries?",
      options: [
        "Ricky Ponting",
        "Sachin Tendulkar",
        "Virat Kohli",
        "Brian Lara",
      ],
      correct: 1,
    },
    {
      q: "NBA team with most championships?",
      options: ["Lakers", "Bulls", "Celtics", "Warriors"],
      correct: 2,
    },
    {
      q: "Olympics held every?",
      options: ["2 years", "3 years", "4 years", "5 years"],
      correct: 2,
    },
    {
      q: '"The Greatest" boxer?',
      options: [
        "Mike Tyson",
        "Muhammad Ali",
        "Floyd Mayweather",
        "Joe Frazier",
      ],
      correct: 1,
    },
    {
      q: "Lionel Messi's home country?",
      options: ["Brazil", "Spain", "Argentina", "Uruguay"],
      correct: 2,
    },
    {
      q: "Tennis Grand Slam events?",
      options: ["2", "3", "4", "5"],
      correct: 2,
    },
    {
      q: "F1 most championships (7 each)?",
      options: ["Schumacher & Hamilton", "Vettel", "Prost", "Senna"],
      correct: 0,
    },
    {
      q: "Marathon distance (km)?",
      options: ["40", "41", "42.195", "43"],
      correct: 2,
    },
    {
      q: "Usain Bolt's nationality?",
      options: ["American", "Jamaican", "British", "Canadian"],
      correct: 1,
    },
  ],
  general: [
    {
      q: "Capital of Japan?",
      options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
      correct: 2,
    },
    {
      q: "Largest country by area?",
      options: ["USA", "China", "Canada", "Russia"],
      correct: 3,
    },
    {
      q: "How many colors in a rainbow?",
      options: ["5", "6", "7", "8"],
      correct: 2,
    },
    {
      q: "Who painted the Mona Lisa?",
      options: ["Picasso", "Van Gogh", "Da Vinci", "Rembrandt"],
      correct: 2,
    },
    {
      q: "Smallest continent?",
      options: ["Europe", "Antarctica", "Australia", "South America"],
      correct: 2,
    },
    {
      q: "Shakespeare's birthplace?",
      options: ["London", "Stratford-upon-Avon", "Manchester", "Oxford"],
      correct: 1,
    },
    {
      q: "Internet invented by?",
      options: [
        "Bill Gates",
        "Steve Jobs",
        "Tim Berners-Lee",
        "Mark Zuckerberg",
      ],
      correct: 2,
    },
    {
      q: "Great Wall of China length (km approx)?",
      options: ["5,000", "10,000", "21,000", "30,000"],
      correct: 2,
    },
    {
      q: "Deepest ocean?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correct: 3,
    },
    {
      q: "Which language has most native speakers?",
      options: ["English", "Spanish", "Mandarin", "Hindi"],
      correct: 2,
    },
  ],
};

const TIMER_SECONDS = 15;
const LS_KEY = "quizzone_scores";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGrade(
  score: number,
  total: number,
): { grade: string; msg: string; colorClass: string } {
  const pct = score / total;
  if (pct >= 0.9)
    return {
      grade: "A+",
      msg: "🌟 Absolutely legendary! You're a genius!",
      colorClass: "text-yellow-300",
    };
  if (pct >= 0.8)
    return {
      grade: "A",
      msg: "🔥 Amazing! You really know your stuff!",
      colorClass: "text-yellow-300",
    };
  if (pct >= 0.7)
    return {
      grade: "B",
      msg: "👍 Great job! Just a bit more practice!",
      colorClass: "text-green-300",
    };
  if (pct >= 0.6)
    return {
      grade: "C",
      msg: "😊 Not bad! Keep pushing!",
      colorClass: "text-cyan-300",
    };
  if (pct >= 0.5)
    return {
      grade: "D",
      msg: "📚 You can do better — study up!",
      colorClass: "text-orange-300",
    };
  return {
    grade: "F",
    msg: "💪 Don't give up — try again!",
    colorClass: "text-red-300",
  };
}

function loadScores(): ScoreEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveScore(entry: ScoreEntry) {
  const scores = loadScores();
  scores.unshift(entry);
  localStorage.setItem(LS_KEY, JSON.stringify(scores.slice(0, 100)));
}

function shareText(score: number, category: Category): string {
  return `I scored ${score}/10 on the ${CATEGORY_META[category].label} quiz on QuizZone! Can you beat me? 🎯`;
}

// ─── Confetti ────────────────────────────────────────────────────────────────

const CONFETTI_ITEMS = Array.from({ length: 60 }, (_, i) => ({
  id: `c${i}`,
  left: `${(i * 1.7) % 100}%`,
  color: [
    "#f472b6",
    "#a78bfa",
    "#34d399",
    "#fbbf24",
    "#60a5fa",
    "#f87171",
    "#e879f9",
  ][i % 7],
  duration: `${1.5 + (i % 5) * 0.4}s`,
  delay: `${(i % 10) * 0.15}s`,
  size: `${8 + (i % 5) * 2}px`,
  radius: i % 2 === 0 ? "50%" : "2px",
  rotate: `rotate(${(i * 47) % 360}deg)`,
}));

function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <>
      {CONFETTI_ITEMS.map((c) => (
        <div
          key={c.id}
          className="confetti-piece"
          style={{
            left: c.left,
            top: "-20px",
            backgroundColor: c.color,
            animationDuration: c.duration,
            animationDelay: c.delay,
            width: c.size,
            height: c.size,
            borderRadius: c.radius,
            transform: c.rotate,
          }}
        />
      ))}
    </>
  );
}

// ─── Home Screen ─────────────────────────────────────────────────────────────

function HomeScreen({
  onStart,
  onLeaderboard,
}: {
  onStart: (cat: Category) => void;
  onLeaderboard: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950 flex flex-col">
      {/* Header */}
      <div className="text-center pt-12 pb-8 px-4 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <h1
            className="text-6xl md:text-7xl font-black tracking-tight mb-2"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              Quiz
            </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Zone
            </span>
          </h1>
          <p className="text-purple-200 text-lg font-medium">
            Test your knowledge. Challenge your friends! 🚀
          </p>
        </div>
      </div>

      {/* Leaderboard button */}
      <div className="flex justify-center px-4 mb-6">
        <button
          type="button"
          data-ocid="leaderboard.button"
          onClick={onLeaderboard}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-full transition-all duration-200 backdrop-blur-sm text-sm"
        >
          🏆 Leaderboard
        </button>
      </div>

      {/* Category cards */}
      <div className="flex-1 px-4 pb-12 max-w-lg mx-auto w-full">
        <p className="text-center text-purple-300 text-sm font-semibold uppercase tracking-wider mb-4">
          Pick a Category
        </p>
        <div className="grid grid-cols-2 gap-4">
          {(Object.keys(CATEGORY_META) as Category[]).map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                type="button"
                data-ocid="category.card"
                onClick={() => onStart(cat)}
                className={`relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl ${meta.glow} group`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative z-10">
                  <div className="text-4xl mb-3">{meta.icon}</div>
                  <div
                    className="text-white font-bold text-sm leading-tight"
                    style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                  >
                    {meta.label}
                  </div>
                  <div className="text-white/70 text-xs mt-1">10 Questions</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-6 text-purple-400/60 text-xs">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-purple-300"
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}

// ─── Name Entry ──────────────────────────────────────────────────────────────

function NameScreen({
  category,
  onConfirm,
  onBack,
}: {
  category: Category;
  onConfirm: (name: string) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const meta = CATEGORY_META[category];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-bounce-in">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">{meta.icon}</div>
            <h2
              className="text-2xl font-black text-white mb-1"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              {meta.label}
            </h2>
            <p className="text-purple-200 text-sm">Enter your name to begin!</p>
          </div>
          <input
            data-ocid="name.input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && name.trim() && onConfirm(name.trim())
            }
            placeholder="Your name..."
            maxLength={20}
            className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-3 text-white placeholder-white/40 text-center text-lg font-bold focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30 transition-all mb-4"
          />
          <button
            type="button"
            data-ocid="name.submit_button"
            onClick={() => name.trim() && onConfirm(name.trim())}
            disabled={!name.trim()}
            className={`w-full py-4 rounded-2xl font-black text-lg transition-all duration-200 ${name.trim() ? `bg-gradient-to-r ${meta.gradient} text-white hover:scale-105 active:scale-95 shadow-lg` : "bg-white/10 text-white/30 cursor-not-allowed"}`}
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Let&apos;s Go! 🎯
          </button>
          <button
            type="button"
            data-ocid="name.cancel_button"
            onClick={onBack}
            className="w-full mt-3 py-3 text-purple-300 hover:text-white transition-colors text-sm font-medium"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Quiz Screen ─────────────────────────────────────────────────────────────

const OPTION_LABELS = ["A", "B", "C", "D"];

function QuizScreen({
  category,
  questions,
  onFinish,
}: {
  category: Category;
  questions: Question[];
  onFinish: (score: number) => void;
}) {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerActive, setTimerActive] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const meta = CATEGORY_META[category];
  const current = questions[qIndex];

  const advance = useCallback(() => {
    const nextIndex = qIndex + 1;
    if (nextIndex >= questions.length) {
      onFinish(score);
    } else {
      setQIndex(nextIndex);
      setSelected(null);
      setTimeLeft(TIMER_SECONDS);
      setTimerActive(true);
    }
  }, [qIndex, questions.length, score, onFinish]);

  useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setTimerActive(false);
          setSelected(-1);
          setTimeout(advance, 1000);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [timerActive, advance]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    clearInterval(timerRef.current!);
    setTimerActive(false);
    setSelected(idx);
    if (idx === current.correct) setScore((s) => s + 1);
    setTimeout(advance, 1200);
  };

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor =
    timerPct > 60
      ? "bg-green-400"
      : timerPct > 30
        ? "bg-yellow-400"
        : "bg-red-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950 flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${meta.gradient} p-4 shadow-lg`}>
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <span className="text-white font-bold text-sm">
            {meta.icon} {meta.label}
          </span>
          <span className="text-white/90 font-bold text-sm bg-white/20 rounded-full px-3 py-1">
            {qIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* Timer */}
      <div className="max-w-lg mx-auto w-full px-4 pt-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-white/70 text-xs font-medium">⏱ Time</span>
          <span
            className={`font-black text-sm ${timeLeft <= 5 ? "text-red-400" : "text-white"}`}
          >
            {timeLeft}s
          </span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${timerColor} rounded-full`}
            style={{
              width: `${timerPct}%`,
              transition: timerActive ? "width 1s linear" : "none",
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 pt-6 pb-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-6 min-h-[100px] flex items-center">
          <p
            className="text-white font-bold text-lg leading-snug"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            {current.q}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {current.options.map((opt, idx) => {
            let cls =
              "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40";
            if (selected !== null) {
              if (idx === current.correct) {
                cls = "bg-green-500/30 border-green-400 text-green-200";
              } else if (idx === selected && idx !== current.correct) {
                cls = "bg-red-500/30 border-red-400 text-red-200 animate-shake";
              } else {
                cls = "bg-white/5 border-white/10 text-white/40";
              }
            }
            const optLabel = OPTION_LABELS[idx];
            return (
              <button
                key={optLabel}
                type="button"
                data-ocid="quiz.answer.button"
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
                className={`flex items-center gap-4 border rounded-2xl px-5 py-4 text-left transition-all duration-200 font-medium ${cls} ${selected === null ? "active:scale-95 cursor-pointer" : "cursor-default"}`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                    selected === null
                      ? `bg-gradient-to-br ${meta.gradient}`
                      : idx === current.correct
                        ? "bg-green-400"
                        : idx === selected
                          ? "bg-red-400"
                          : "bg-white/20"
                  } text-white`}
                >
                  {optLabel}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Result Screen ───────────────────────────────────────────────────────────

function ResultScreen({
  name,
  category,
  score,
  total,
  onHome,
  onPlayAgain,
}: {
  name: string;
  category: Category;
  score: number;
  total: number;
  onHome: () => void;
  onPlayAgain: () => void;
}) {
  const { grade, msg, colorClass } = getGrade(score, total);
  const meta = CATEGORY_META[category];
  const isGood = score / total >= 0.6;
  const [copied, setCopied] = useState(false);

  const text = shareText(score, category);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <Confetti active={isGood} />

      <div className="w-full max-w-sm animate-bounce-in relative z-10">
        {/* Score Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl text-center mb-4">
          <div className="text-5xl mb-4">{isGood ? "🎉" : "💪"}</div>
          <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-1">
            {name}&apos;s Score
          </h2>
          <div
            className="text-7xl font-black text-white mb-1"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            {score}
            <span className="text-white/40 text-4xl">/{total}</span>
          </div>
          <div
            className={`text-5xl font-black mb-3 ${colorClass}`}
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            {grade}
          </div>
          <p className="text-purple-200 text-sm font-medium">{msg}</p>
        </div>

        {/* Share */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 mb-4">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wider text-center mb-3">
            Challenge Friends 🤝
          </p>
          <div className="grid grid-cols-3 gap-2">
            <a
              data-ocid="result.share.button"
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 bg-sky-500/20 border border-sky-400/30 hover:bg-sky-500/30 rounded-2xl py-3 transition-all"
            >
              <span className="text-xl">𝕏</span>
              <span className="text-sky-300 text-xs font-bold">Twitter</span>
            </a>
            <a
              data-ocid="result.share.button"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 bg-green-500/20 border border-green-400/30 hover:bg-green-500/30 rounded-2xl py-3 transition-all"
            >
              <span className="text-xl">💬</span>
              <span className="text-green-300 text-xs font-bold">WhatsApp</span>
            </a>
            <button
              type="button"
              data-ocid="result.copy.button"
              onClick={copyLink}
              className="flex flex-col items-center gap-1 bg-violet-500/20 border border-violet-400/30 hover:bg-violet-500/30 rounded-2xl py-3 transition-all"
            >
              <span className="text-xl">{copied ? "✅" : "🔗"}</span>
              <span className="text-violet-300 text-xs font-bold">
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            data-ocid="result.home.button"
            onClick={onHome}
            className="py-4 rounded-2xl font-black text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
          >
            🏠 Home
          </button>
          <button
            type="button"
            data-ocid="result.playagain.button"
            onClick={onPlayAgain}
            className={`py-4 rounded-2xl font-black text-white bg-gradient-to-r ${meta.gradient} hover:scale-105 active:scale-95 transition-all shadow-lg`}
          >
            🔄 Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

type LeaderFilter = "all" | Category;

const FILTER_TABS: { id: LeaderFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pop", label: "Pop" },
  { id: "science", label: "Science" },
  { id: "sports", label: "Sports" },
  { id: "general", label: "General" },
];

const RANK_EMOJIS = ["🥇", "🥈", "🥉"];

function LeaderboardScreen({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState<LeaderFilter>("all");
  const scores = loadScores();
  const filtered =
    filter === "all" ? scores : scores.filter((s) => s.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 p-4 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            type="button"
            data-ocid="leaderboard.back.button"
            onClick={onBack}
            className="text-white font-bold text-sm hover:opacity-80 transition-opacity"
          >
            ← Back
          </button>
          <h2
            className="text-white font-black text-lg"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            🏆 Leaderboard
          </h2>
          <div className="w-12" />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="max-w-lg mx-auto w-full px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid="leaderboard.filter.tab"
              onClick={() => setFilter(tab.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === tab.id
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                  : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scores */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 pb-8">
        {filtered.length === 0 ? (
          <div
            data-ocid="leaderboard.empty_state"
            className="text-center py-16 text-purple-300"
          >
            <div className="text-6xl mb-4">📭</div>
            <p className="font-bold text-lg">No scores yet!</p>
            <p className="text-sm text-purple-400">
              Play a quiz to get on the board.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((entry, i) => {
              const { grade: entryGrade, colorClass: entryColor } = getGrade(
                entry.score,
                entry.total,
              );
              return (
                <div
                  key={`${entry.name}-${entry.date}-${i}`}
                  data-ocid={`leaderboard.item.${i + 1}`}
                  className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-4 animate-slide-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <span className="text-2xl w-8 text-center shrink-0">
                    {i < 3 ? (
                      RANK_EMOJIS[i]
                    ) : (
                      <span className="text-white/40 font-bold text-sm">
                        #{i + 1}
                      </span>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm truncate">
                      {entry.name}
                    </div>
                    <div className="text-purple-300 text-xs">
                      {CATEGORY_META[entry.category].label} ·{" "}
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className="text-white font-black text-lg"
                      style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                    >
                      {entry.score}
                      <span className="text-white/40 text-sm">
                        /{entry.total}
                      </span>
                    </div>
                    <div className={`text-xs font-bold ${entryColor}`}>
                      {entryGrade}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function QuizZone() {
  const [screen, setScreen] = useState<Screen>("home");
  const [category, setCategory] = useState<Category>("pop");
  const [playerName, setPlayerName] = useState("");
  const [finalScore, setFinalScore] = useState(0);

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
    setScreen("name");
  };

  const handleNameConfirm = (name: string) => {
    setPlayerName(name);
    setScreen("quiz");
  };

  const handleFinish = (score: number) => {
    setFinalScore(score);
    saveScore({
      name: playerName,
      category,
      score,
      total: QUESTIONS[category].length,
      date: new Date().toISOString(),
    });
    setScreen("result");
  };

  if (screen === "leaderboard")
    return <LeaderboardScreen onBack={() => setScreen("home")} />;
  if (screen === "name")
    return (
      <NameScreen
        category={category}
        onConfirm={handleNameConfirm}
        onBack={() => setScreen("home")}
      />
    );
  if (screen === "quiz")
    return (
      <QuizScreen
        key={`${category}-${playerName}`}
        category={category}
        questions={QUESTIONS[category]}
        onFinish={handleFinish}
      />
    );
  if (screen === "result")
    return (
      <ResultScreen
        name={playerName}
        category={category}
        score={finalScore}
        total={QUESTIONS[category].length}
        onHome={() => setScreen("home")}
        onPlayAgain={() => setScreen("quiz")}
      />
    );

  return (
    <HomeScreen
      onStart={handleCategorySelect}
      onLeaderboard={() => setScreen("leaderboard")}
    />
  );
}
