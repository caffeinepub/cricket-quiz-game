import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Car,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const CANVAS_W = 360;
const CANVAS_H = 560;
const LANE_W = 80;
const LANES = 4;
const PLAYER_W = 40;
const PLAYER_H = 70;
const ENEMY_W = 42;
const ENEMY_H = 72;

interface Enemy {
  x: number;
  y: number;
  speed: number;
  color: string;
  lane: number;
}

const ENEMY_COLORS = ["#e74c3c", "#3498db", "#f39c12", "#8e44ad", "#1abc9c"];

function checkCollision(px: number, enemies: Enemy[]) {
  const py = CANVAS_H - PLAYER_H - 20;
  return enemies.some(
    (e) =>
      px < e.x + ENEMY_W - 5 &&
      px + PLAYER_W > e.x + 5 &&
      py < e.y + ENEMY_H - 5 &&
      py + PLAYER_H > e.y + 5,
  );
}

export default function Racing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    playerX: CANVAS_W / 2 - PLAYER_W / 2,
    enemies: [] as Enemy[],
    score: 0,
    speed: 3,
    running: false,
    roadOffset: 0,
    frameCount: 0,
    keys: { left: false, right: false },
  });
  const animRef = useRef<number>(0);
  const [phase, setPhase] = useState<"intro" | "playing" | "gameover">("intro");
  const [finalScore, setFinalScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [displayScore, setDisplayScore] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = "#2d2d4e";
    ctx.fillRect(20, 0, LANE_W * LANES, CANVAS_H);

    s.roadOffset = (s.roadOffset + s.speed) % 40;
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2;
    ctx.setLineDash([30, 30]);
    for (let l = 1; l < LANES; l++) {
      ctx.beginPath();
      ctx.moveTo(20 + l * LANE_W, -40 + s.roadOffset);
      ctx.lineTo(20 + l * LANE_W, CANVAS_H + 40);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    ctx.strokeStyle = "rgba(100,200,255,0.4)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(20, CANVAS_H);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(20 + LANE_W * LANES, 0);
    ctx.lineTo(20 + LANE_W * LANES, CANVAS_H);
    ctx.stroke();

    for (const e of s.enemies) {
      ctx.fillStyle = e.color;
      ctx.beginPath();
      ctx.roundRect(e.x, e.y, ENEMY_W, ENEMY_H, 6);
      ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(e.x + 6, e.y + 10, ENEMY_W - 12, 18);
      ctx.fillStyle = "#fff";
      ctx.fillRect(e.x + 6, e.y + ENEMY_H - 14, 10, 8);
      ctx.fillRect(e.x + ENEMY_W - 16, e.y + ENEMY_H - 14, 10, 8);
    }

    const py = CANVAS_H - PLAYER_H - 20;
    ctx.fillStyle = "#a855f7";
    ctx.beginPath();
    ctx.roundRect(s.playerX, py, PLAYER_W, PLAYER_H, 6);
    ctx.fill();
    ctx.shadowColor = "rgba(168,85,247,0.8)";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "rgba(168,85,247,0.5)";
    ctx.fillRect(s.playerX, py, PLAYER_W, PLAYER_H);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(200,150,255,0.5)";
    ctx.fillRect(s.playerX + 6, py + 10, PLAYER_W - 12, 18);
    ctx.fillStyle = "#ff4444";
    ctx.fillRect(s.playerX + 4, py + 4, 8, 6);
    ctx.fillRect(s.playerX + PLAYER_W - 12, py + 4, 8, 6);

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, CANVAS_W, 36);
    ctx.fillStyle = "#c084fc";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`Score: ${Math.floor(s.score)}`, 12, 24);
    ctx.fillStyle = "#67e8f9";
    ctx.fillText(`Speed: ${s.speed.toFixed(1)}x`, CANVAS_W - 100, 24);
  }, []);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;

    const spd = 4;
    const roadLeft = 20;
    const roadRight = 20 + LANE_W * LANES - PLAYER_W;
    if (s.keys.left) s.playerX = Math.max(roadLeft, s.playerX - spd);
    if (s.keys.right) s.playerX = Math.min(roadRight, s.playerX + spd);

    s.enemies = s.enemies.filter((e) => e.y < CANVAS_H + 100);
    for (const e of s.enemies) {
      e.y += e.speed;
    }

    s.frameCount++;
    const spawnRate = Math.max(30, 80 - Math.floor(s.score / 50));
    if (s.frameCount % spawnRate === 0) {
      const lane = Math.floor(Math.random() * LANES);
      const x = 20 + lane * LANE_W + (LANE_W - ENEMY_W) / 2;
      const color =
        ENEMY_COLORS[Math.floor(Math.random() * ENEMY_COLORS.length)];
      s.enemies.push({
        x,
        y: -ENEMY_H,
        speed: s.speed + Math.random() * 2,
        color,
        lane,
      });
    }

    s.speed = 3 + s.score / 200;
    s.score += 0.1;
    setDisplayScore(Math.floor(s.score));

    if (checkCollision(s.playerX, s.enemies)) {
      s.running = false;
      setFinalScore(Math.floor(s.score));
      setPhase("gameover");
      cancelAnimationFrame(animRef.current);
      return;
    }

    draw();
    animRef.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  function startGame() {
    const s = stateRef.current;
    s.playerX = CANVAS_W / 2 - PLAYER_W / 2;
    s.enemies = [];
    s.score = 0;
    s.speed = 3;
    s.running = true;
    s.roadOffset = 0;
    s.frameCount = 0;
    s.keys = { left: false, right: false };
    setDisplayScore(0);
    setPhase("playing");
    animRef.current = requestAnimationFrame(gameLoop);
  }

  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      const down = e.type === "keydown";
      if (e.key === "ArrowLeft" || e.key === "a")
        stateRef.current.keys.left = down;
      if (e.key === "ArrowRight" || e.key === "d")
        stateRef.current.keys.right = down;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [phase]);

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  function saveScore() {
    if (!playerName.trim()) {
      toast.error("Enter your name");
      return;
    }
    const entry = {
      name: playerName.trim(),
      score: finalScore,
      date: new Date().toLocaleDateString(),
    };
    const existing = JSON.parse(localStorage.getItem("racing_scores") || "[]");
    existing.push(entry);
    existing.sort(
      (a: { score: number }, b: { score: number }) => b.score - a.score,
    );
    localStorage.setItem(
      "racing_scores",
      JSON.stringify(existing.slice(0, 10)),
    );
    toast.success("Score saved!");
    setPhase("intro");
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12" data-ocid="racing.page">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/games"
          className="p-2 rounded-lg hover:bg-muted/50 transition-all"
          data-ocid="racing.back_button"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Car className="w-6 h-6 neon-text-green" />
        <h1 className="font-display text-2xl font-bold neon-text-green">
          Neon Racer
        </h1>
        {phase === "playing" && (
          <span className="ml-auto text-neon-purple font-bold">
            Score: {displayScore}
          </span>
        )}
      </div>

      {phase === "intro" && (
        <div
          className="glass rounded-2xl p-10 text-center"
          data-ocid="racing.intro.panel"
        >
          <Car className="w-16 h-16 neon-text-green mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold mb-3">Neon Racer</h2>
          <p className="text-muted-foreground mb-2">
            Dodge traffic. Go as far as you can!
          </p>
          <div className="text-sm text-muted-foreground mb-8 space-y-1">
            <p>🖥️ Arrow keys / A,D to steer</p>
            <p>📱 Touch buttons below the game</p>
          </div>
          <Button
            onClick={startGame}
            className="px-10 py-4 text-lg bg-success/80 text-success-foreground hover:bg-success"
            data-ocid="racing.start_button"
          >
            Start Racing!
          </Button>
        </div>
      )}

      {phase === "playing" && (
        <div data-ocid="racing.playing.panel">
          <div className="canvas-container mx-auto" style={{ width: CANVAS_W }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              data-ocid="racing.canvas_target"
            />
          </div>
          <div className="flex justify-center gap-8 mt-4">
            <button
              type="button"
              className="w-16 h-16 rounded-full bg-success/20 border border-success/40 flex items-center justify-center text-neon-green active:bg-success/40 touch-none select-none"
              onPointerDown={() => {
                stateRef.current.keys.left = true;
              }}
              onPointerUp={() => {
                stateRef.current.keys.left = false;
              }}
              onPointerLeave={() => {
                stateRef.current.keys.left = false;
              }}
              data-ocid="racing.left_button"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              type="button"
              className="w-16 h-16 rounded-full bg-success/20 border border-success/40 flex items-center justify-center text-neon-green active:bg-success/40 touch-none select-none"
              onPointerDown={() => {
                stateRef.current.keys.right = true;
              }}
              onPointerUp={() => {
                stateRef.current.keys.right = false;
              }}
              onPointerLeave={() => {
                stateRef.current.keys.right = false;
              }}
              data-ocid="racing.right_button"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}

      {phase === "gameover" && (
        <div
          className="glass rounded-2xl p-10 text-center"
          data-ocid="racing.gameover.panel"
        >
          <div className="text-6xl mb-4">💥</div>
          <h2 className="font-display text-3xl font-bold mb-2">Game Over!</h2>
          <p className="text-muted-foreground mb-2">Final Score</p>
          <div className="text-6xl font-display font-extrabold neon-text-green mb-6">
            {finalScore}
          </div>
          <Input
            placeholder="Enter your name to save score"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="max-w-xs mx-auto mb-4"
            onKeyDown={(e) => e.key === "Enter" && saveScore()}
            data-ocid="racing.name_input"
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={saveScore}
              className="bg-success/80 hover:bg-success text-success-foreground"
              data-ocid="racing.save_button"
            >
              <Trophy className="w-4 h-4 mr-2" /> Save Score
            </Button>
            <Button
              variant="outline"
              onClick={startGame}
              data-ocid="racing.replay_button"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Play Again
            </Button>
            <Link to="/games">
              <Button variant="ghost" data-ocid="racing.games_button">
                Back to Games
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
