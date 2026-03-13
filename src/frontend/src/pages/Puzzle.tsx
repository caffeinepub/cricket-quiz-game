import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  Move,
  Puzzle as PuzzleIcon,
  Shuffle,
  Trophy,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type Board = (number | null)[];

function createSolvedBoard(): Board {
  return [1, 2, 3, 4, 5, 6, 7, 8, null];
}

function shuffle(board: Board): Board {
  let b = [...board];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  // Ensure solvable
  if (!isSolvable(b)) {
    const idx1 = b[0] !== null ? 0 : 1;
    const idx2 = b[1] !== null ? 1 : 2;
    [b[idx1], b[idx2]] = [b[idx2], b[idx1]];
  }
  return b;
}

function isSolvable(board: Board): boolean {
  const flat = board.filter((v) => v !== null) as number[];
  let inv = 0;
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inv++;
    }
  }
  return inv % 2 === 0;
}

function isWon(board: Board): boolean {
  const solved = createSolvedBoard();
  return board.every((v, i) => v === solved[i]);
}

export default function Puzzle() {
  const [board, setBoard] = useState<Board>(shuffle(createSolvedBoard()));
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [won, setWon] = useState(false);
  const [phase, setPhase] = useState<"playing" | "result" | "save">("playing");
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const move = useCallback(
    (idx: number) => {
      if (won) return;
      const emptyIdx = board.indexOf(null);
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      const emptyRow = Math.floor(emptyIdx / 3);
      const emptyCol = emptyIdx % 3;
      const adjacent =
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow);
      if (!adjacent) return;
      const newBoard = [...board];
      [newBoard[idx], newBoard[emptyIdx]] = [newBoard[emptyIdx], newBoard[idx]];
      setBoard(newBoard);
      setMoves((m) => m + 1);
      if (isWon(newBoard)) {
        setWon(true);
        setRunning(false);
        setTimeout(() => setPhase("result"), 400);
      }
    },
    [board, won],
  );

  function newGame() {
    setBoard(shuffle(createSolvedBoard()));
    setMoves(0);
    setSeconds(0);
    setRunning(true);
    setWon(false);
    setPhase("playing");
  }

  function saveScore() {
    if (!playerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    const scoreVal = Math.max(0, 1000 - moves * 5 - seconds);
    const entry = {
      name: playerName.trim(),
      score: scoreVal,
      moves,
      time: seconds,
      date: new Date().toLocaleDateString(),
    };
    const existing = JSON.parse(localStorage.getItem("puzzle_scores") || "[]");
    existing.push(entry);
    existing.sort(
      (a: { score: number }, b: { score: number }) => b.score - a.score,
    );
    localStorage.setItem(
      "puzzle_scores",
      JSON.stringify(existing.slice(0, 10)),
    );
    toast.success("Score saved!");
    newGame();
  }

  const fmt = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="max-w-lg mx-auto px-4 py-12" data-ocid="puzzle.page">
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/games"
          className="p-2 rounded-lg hover:bg-muted/50 transition-all"
          data-ocid="puzzle.back_button"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <PuzzleIcon className="w-6 h-6 neon-text-cyan" />
          <h1 className="font-display text-2xl font-bold neon-text-cyan">
            Tile Puzzle
          </h1>
        </div>
      </div>

      {phase === "playing" && (
        <div data-ocid="puzzle.playing.panel">
          {/* Stats */}
          <div className="flex items-center justify-between mb-6 glass rounded-xl px-5 py-3">
            <div className="flex items-center gap-1.5 text-sm">
              <Move className="w-4 h-4 neon-text-cyan" />
              <span className="text-muted-foreground">Moves:</span>
              <span className="text-neon-cyan font-bold">{moves}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4 neon-text-purple" />
              <span className="text-muted-foreground">Time:</span>
              <span className="text-neon-purple font-bold">{fmt(seconds)}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={newGame}
              data-ocid="puzzle.shuffle_button"
            >
              <Shuffle className="w-4 h-4 mr-1" /> Shuffle
            </Button>
          </div>

          {/* Board */}
          <div
            className="grid gap-2 mx-auto mb-6"
            style={{ gridTemplateColumns: "repeat(3, 1fr)", maxWidth: 320 }}
            data-ocid="puzzle.canvas_target"
          >
            {board.map((val, idx) => (
              <button
                type="button"
                // biome-ignore lint/suspicious/noArrayIndexKey: puzzle tile position is stable
                key={idx}
                onClick={() => move(idx)}
                disabled={val === null}
                className={`h-24 rounded-xl font-display text-3xl font-extrabold transition-all select-none
                  ${
                    val === null
                      ? "cursor-default opacity-0"
                      : "border border-accent/40 bg-accent/10 text-neon-cyan hover:border-accent hover:bg-accent/20 cursor-pointer hover:scale-95 active:scale-90"
                  }`}
              >
                {val}
              </button>
            ))}
          </div>

          <p className="text-center text-muted-foreground text-sm">
            Tap tiles adjacent to the empty space to move them
          </p>
        </div>
      )}

      {phase === "result" && (
        <div
          className="glass rounded-2xl p-10 text-center"
          data-ocid="puzzle.result.panel"
        >
          <Trophy className="w-16 h-16 text-warning mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold mb-2">
            Puzzle Solved! 🎉
          </h2>
          <p className="text-muted-foreground mb-6">
            Completed in {moves} moves and {fmt(seconds)}
          </p>
          <div className="text-5xl font-display font-extrabold neon-text-cyan mb-8">
            {Math.max(0, 1000 - moves * 5 - seconds)} pts
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setPhase("save")}
              className="bg-accent/80 text-accent-foreground hover:bg-accent"
              data-ocid="puzzle.save_button"
            >
              <Trophy className="w-4 h-4 mr-2" /> Save Score
            </Button>
            <Button
              variant="outline"
              onClick={newGame}
              data-ocid="puzzle.replay_button"
            >
              Play Again
            </Button>
            <Link to="/games">
              <Button variant="ghost" data-ocid="puzzle.games_button">
                Back to Games
              </Button>
            </Link>
          </div>
        </div>
      )}

      {phase === "save" && (
        <div
          className="glass rounded-2xl p-10 text-center"
          data-ocid="puzzle.save.panel"
        >
          <h2 className="font-display text-2xl font-bold mb-4">
            Save Your Score
          </h2>
          <Input
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="max-w-xs mx-auto mb-4"
            onKeyDown={(e) => e.key === "Enter" && saveScore()}
            data-ocid="puzzle.name_input"
          />
          <div className="flex gap-3 justify-center">
            <Button
              onClick={saveScore}
              className="bg-accent/80 hover:bg-accent text-accent-foreground"
              data-ocid="puzzle.confirm_button"
            >
              Save
            </Button>
            <Button
              variant="ghost"
              onClick={newGame}
              data-ocid="puzzle.cancel_button"
            >
              Skip
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
