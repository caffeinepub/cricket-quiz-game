import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, RotateCcw, Shield, Trophy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const W = 480;
const H = 480;
const PLAYER_R = 14;
const FOOD_R = 9;
const ENEMY_R = 15;
const MAX_LIVES = 3;

interface Vec {
  x: number;
  y: number;
}
interface FoodItem extends Vec {
  id: number;
}
interface EnemyItem extends Vec {
  id: number;
  speed: number;
}

function vecDist(a: Vec, b: Vec) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export default function Survival() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    player: { x: W / 2, y: H / 2 },
    foods: [] as FoodItem[],
    enemies: [] as EnemyItem[],
    score: 0,
    lives: MAX_LIVES,
    running: false,
    keys: { up: false, down: false, left: false, right: false },
    invincible: 0,
    frameCount: 0,
    nextId: 0,
    joystick: { active: false, dx: 0, dy: 0 },
  });
  const animRef = useRef<number>(0);
  const [phase, setPhase] = useState<"intro" | "playing" | "gameover">("intro");
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLives, setDisplayLives] = useState(MAX_LIVES);
  const [finalScore, setFinalScore] = useState(0);
  const [playerName, setPlayerName] = useState("");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    ctx.fillStyle = "#0d0d1a";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(100,50,200,0.1)";
    ctx.lineWidth = 1;
    for (let gx = 0; gx < W; gx += 40) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, H);
      ctx.stroke();
    }
    for (let gy = 0; gy < H; gy += 40) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.stroke();
    }

    for (const f of s.foods) {
      ctx.shadowColor = "#22c55e";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#4ade80";
      ctx.beginPath();
      ctx.arc(f.x, f.y, FOOD_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    for (const e of s.enemies) {
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "#f87171";
      ctx.beginPath();
      ctx.arc(e.x, e.y, ENEMY_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(e.x, e.y - 4, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(e.x, e.y - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const alpha =
      s.invincible > 0 ? Math.sin(s.invincible * 0.5) * 0.5 + 0.5 : 1;
    ctx.globalAlpha = alpha;
    ctx.shadowColor = "#c084fc";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#a855f7";
    ctx.beginPath();
    ctx.arc(s.player.x, s.player.y, PLAYER_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e9d5ff";
    ctx.beginPath();
    ctx.arc(s.player.x - 3, s.player.y - 4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, W, 36);
    ctx.fillStyle = "#c084fc";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(`Score: ${s.score}`, 12, 24);
    ctx.font = "18px sans-serif";
    for (let i = 0; i < MAX_LIVES; i++) {
      ctx.fillText(i < s.lives ? "❤️" : "🖤", W - 30 - i * 28, 24);
    }
  }, []);

  const gameLoop = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;

    const pSpeed = 3;
    const { keys, joystick } = s;

    let dx = 0;
    let dy = 0;
    if (joystick.active) {
      dx = joystick.dx;
      dy = joystick.dy;
    } else {
      if (keys.left) dx = -1;
      if (keys.right) dx = 1;
      if (keys.up) dy = -1;
      if (keys.down) dy = 1;
    }

    const len = Math.hypot(dx, dy);
    if (len > 0) {
      dx /= len;
      dy /= len;
    }

    s.player.x = Math.max(
      PLAYER_R,
      Math.min(W - PLAYER_R, s.player.x + dx * pSpeed),
    );
    s.player.y = Math.max(
      PLAYER_R,
      Math.min(H - PLAYER_R, s.player.y + dy * pSpeed),
    );

    for (const e of s.enemies) {
      const d = vecDist(e, s.player);
      if (d > 0) {
        e.x += ((s.player.x - e.x) / d) * e.speed;
        e.y += ((s.player.y - e.y) / d) * e.speed;
      }
    }

    s.foods = s.foods.filter((f) => {
      if (vecDist(f, s.player) < PLAYER_R + FOOD_R) {
        s.score++;
        return false;
      }
      return true;
    });

    if (s.invincible <= 0) {
      const hit = s.enemies.find(
        (e) => vecDist(e, s.player) < PLAYER_R + ENEMY_R - 4,
      );
      if (hit) {
        s.lives--;
        s.invincible = 90;
        setDisplayLives(s.lives);
        if (s.lives <= 0) {
          s.running = false;
          setFinalScore(s.score);
          setPhase("gameover");
          cancelAnimationFrame(animRef.current);
          return;
        }
      }
    } else {
      s.invincible--;
    }

    s.frameCount++;

    // Spawn food
    if (s.frameCount % 30 === 0 && s.foods.length < 8) {
      s.foods.push({
        x: FOOD_R + Math.random() * (W - FOOD_R * 2),
        y: FOOD_R + Math.random() * (H - FOOD_R * 2),
        id: s.nextId++,
      });
    }
    // Spawn enemies
    if (
      s.frameCount % 60 === 0 &&
      s.enemies.length < 6 + Math.floor(s.score / 10)
    ) {
      const side = Math.floor(Math.random() * 4);
      let ex = 0;
      let ey = 0;
      if (side === 0) {
        ex = Math.random() * W;
        ey = -ENEMY_R;
      } else if (side === 1) {
        ex = W + ENEMY_R;
        ey = Math.random() * H;
      } else if (side === 2) {
        ex = Math.random() * W;
        ey = H + ENEMY_R;
      } else {
        ex = -ENEMY_R;
        ey = Math.random() * H;
      }
      s.enemies.push({
        x: ex,
        y: ey,
        id: s.nextId++,
        speed: 1.2 + Math.random() * 0.8 + s.score * 0.02,
      });
    }

    setDisplayScore(s.score);
    draw();
    animRef.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  function startGame() {
    const s = stateRef.current;
    s.player = { x: W / 2, y: H / 2 };
    s.foods = [];
    s.enemies = [];
    s.score = 0;
    s.lives = MAX_LIVES;
    s.running = true;
    s.invincible = 0;
    s.frameCount = 0;
    s.nextId = 0;
    s.keys = { up: false, down: false, left: false, right: false };
    for (let i = 0; i < 5; i++) {
      s.foods.push({
        x: FOOD_R + Math.random() * (W - FOOD_R * 2),
        y: FOOD_R + Math.random() * (H - FOOD_R * 2),
        id: s.nextId++,
      });
    }
    setDisplayScore(0);
    setDisplayLives(MAX_LIVES);
    setPhase("playing");
    animRef.current = requestAnimationFrame(gameLoop);
  }

  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      const down = e.type === "keydown";
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W")
        stateRef.current.keys.up = down;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S")
        stateRef.current.keys.down = down;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A")
        stateRef.current.keys.left = down;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
        stateRef.current.keys.right = down;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [phase]);

  const joystickRef = useRef<HTMLDivElement>(null);
  const handleJoystickStart = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handleJoystickMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const max = rect.width / 2;
    const len = Math.hypot(dx, dy);
    stateRef.current.joystick = {
      active: true,
      dx: len > 0 ? (Math.min(len, max) / max) * (dx / len) : 0,
      dy: len > 0 ? (Math.min(len, max) / max) * (dy / len) : 0,
    };
  };
  const handleJoystickEnd = () => {
    stateRef.current.joystick = { active: false, dx: 0, dy: 0 };
  };

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
    const existing = JSON.parse(
      localStorage.getItem("survival_scores") || "[]",
    );
    existing.push(entry);
    existing.sort(
      (a: { score: number }, b: { score: number }) => b.score - a.score,
    );
    localStorage.setItem(
      "survival_scores",
      JSON.stringify(existing.slice(0, 10)),
    );
    toast.success("Score saved!");
    setPhase("intro");
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12" data-ocid="survival.page">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/games"
          className="p-2 rounded-lg hover:bg-muted/50 transition-all"
          data-ocid="survival.back_button"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Shield className="w-6 h-6 text-warning" />
        <h1 className="font-display text-2xl font-bold text-warning">
          Survive!
        </h1>
        {phase === "playing" && (
          <div className="ml-auto flex items-center gap-3">
            <span className="text-neon-purple font-bold">
              {displayScore} pts
            </span>
            <div className="flex">
              {Array.from({ length: MAX_LIVES }, (_, i) => (
                <Heart
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed MAX_LIVES length
                  key={i}
                  className={`w-4 h-4 ${i < displayLives ? "fill-red-500 text-red-500" : "text-muted"}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {phase === "intro" && (
        <div
          className="glass rounded-2xl p-10 text-center"
          data-ocid="survival.intro.panel"
        >
          <Shield className="w-16 h-16 text-warning mx-auto mb-6" />
          <h2 className="font-display text-3xl font-bold mb-3">Survive!</h2>
          <p className="text-muted-foreground mb-2">
            Collect 🟢 green food. Dodge 🔴 red enemies!
          </p>
          <div className="text-sm text-muted-foreground mb-8 space-y-1">
            <p>🖥️ WASD or Arrow Keys to move</p>
            <p>📱 On-screen joystick below canvas</p>
            <p>❤️ You have 3 lives</p>
          </div>
          <Button
            onClick={startGame}
            className="px-10 py-4 text-lg bg-warning/80 text-warning-foreground hover:bg-warning"
            data-ocid="survival.start_button"
          >
            Start Surviving!
          </Button>
        </div>
      )}

      {phase === "playing" && (
        <div data-ocid="survival.playing.panel">
          <div
            className="canvas-container mx-auto"
            style={{ width: W, maxWidth: "100%" }}
          >
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              style={{ maxWidth: "100%", height: "auto" }}
              data-ocid="survival.canvas_target"
            />
          </div>
          <div className="flex justify-center mt-4">
            <div
              ref={joystickRef}
              className="w-28 h-28 rounded-full border-2 border-warning/40 bg-warning/10 flex items-center justify-center cursor-none touch-none select-none"
              onPointerDown={handleJoystickStart}
              onPointerMove={handleJoystickMove}
              onPointerUp={handleJoystickEnd}
              onPointerLeave={handleJoystickEnd}
            >
              <div className="w-10 h-10 rounded-full bg-warning/40 border border-warning/60" />
            </div>
          </div>
          <p className="text-center text-muted-foreground text-xs mt-2">
            Drag the joystick or use WASD/arrows
          </p>
        </div>
      )}

      {phase === "gameover" && (
        <div
          className="glass rounded-2xl p-10 text-center"
          data-ocid="survival.gameover.panel"
        >
          <div className="text-6xl mb-4">💀</div>
          <h2 className="font-display text-3xl font-bold mb-2">
            You Didn&apos;t Survive!
          </h2>
          <p className="text-muted-foreground mb-2">Final Score</p>
          <div className="text-6xl font-display font-extrabold text-warning mb-6">
            {finalScore} pts
          </div>
          <Input
            placeholder="Enter your name to save score"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="max-w-xs mx-auto mb-4"
            onKeyDown={(e) => e.key === "Enter" && saveScore()}
            data-ocid="survival.name_input"
          />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={saveScore}
              className="bg-warning/80 hover:bg-warning text-warning-foreground"
              data-ocid="survival.save_button"
            >
              <Trophy className="w-4 h-4 mr-2" /> Save Score
            </Button>
            <Button
              variant="outline"
              onClick={startGame}
              data-ocid="survival.replay_button"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
            <Link to="/games">
              <Button variant="ghost" data-ocid="survival.games_button">
                Back to Games
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
