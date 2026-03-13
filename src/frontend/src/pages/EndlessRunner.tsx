import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const W = 480;
const H = 240;
const GROUND = H - 50;
const PLAYER_W = 30;
const PLAYER_H = 40;
const GRAVITY = 0.7;
const JUMP_FORCE = -14;

interface Obstacle {
  x: number;
  w: number;
  h: number;
  type: "short" | "tall" | "flying";
  y: number;
}

interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

interface GameState {
  playerY: number;
  playerVY: number;
  onGround: boolean;
  obstacles: Obstacle[];
  coins: Coin[];
  score: number;
  speed: number;
  frame: number;
  gameOver: boolean;
  started: boolean;
  lives: number;
  coinCount: number;
}

function makeObstacle(): Obstacle {
  const types: Obstacle["type"][] = ["short", "tall", "flying"];
  const type = types[Math.floor(Math.random() * types.length)];
  const w = type === "tall" ? 22 : 18;
  const h = type === "short" ? 30 : type === "tall" ? 55 : 22;
  const y = type === "flying" ? GROUND - 55 : GROUND - h;
  return { x: W + 80, w, h, type, y };
}

function makeCoin(): Coin {
  return {
    x: W + 40 + Math.random() * 80,
    y: GROUND - 20 - Math.random() * 60,
    collected: false,
  };
}

const initState = (): GameState => ({
  playerY: GROUND - PLAYER_H,
  playerVY: 0,
  onGround: true,
  obstacles: [],
  coins: [],
  score: 0,
  speed: 4,
  frame: 0,
  gameOver: false,
  started: false,
  lives: 3,
  coinCount: 0,
});

export default function EndlessRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(initState());
  const rafRef = useRef<number>(0);
  const [display, setDisplay] = useState({
    score: 0,
    lives: 3,
    coinCount: 0,
    gameOver: false,
    started: false,
  });
  const [bestScore, setBestScore] = useState(0);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (!s.started) {
      s.started = true;
      setDisplay((d) => ({ ...d, started: true }));
      return;
    }
    if (s.gameOver) return;
    if (s.onGround) {
      s.playerVY = JUMP_FORCE;
      s.onGround = false;
    }
  }, []);

  const restart = useCallback(() => {
    stateRef.current = initState();
    stateRef.current.started = true;
    setDisplay({
      score: 0,
      lives: 3,
      coinCount: 0,
      gameOver: false,
      started: true,
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let bgX = 0;
    let flashFrames = 0;

    const draw = () => {
      const s = stateRef.current;

      if (s.started && !s.gameOver) {
        s.frame++;
        s.score++;
        if (s.frame % 400 === 0) s.speed = Math.min(s.speed + 0.5, 14);

        s.playerVY += GRAVITY;
        s.playerY += s.playerVY;
        if (s.playerY >= GROUND - PLAYER_H) {
          s.playerY = GROUND - PLAYER_H;
          s.playerVY = 0;
          s.onGround = true;
        }

        bgX = (bgX - s.speed * 0.3) % W;

        const gap = Math.max(200, 420 - s.speed * 12);
        const lastObs = s.obstacles[s.obstacles.length - 1];
        if (s.obstacles.length === 0 || (lastObs && lastObs.x < W - gap)) {
          if (s.frame > 60) s.obstacles.push(makeObstacle());
        }

        if (s.coins.filter((c) => !c.collected).length < 3) {
          if (s.frame % 80 === 0) s.coins.push(makeCoin());
        }

        s.obstacles = s.obstacles
          .map((o) => ({ ...o, x: o.x - s.speed }))
          .filter((o) => o.x > -60);
        s.coins = s.coins
          .map((c) => ({ ...c, x: c.x - s.speed }))
          .filter((c) => c.x > -20);

        const px = 60;
        const py = s.playerY;
        for (const obs of s.obstacles) {
          if (
            px + PLAYER_W - 6 > obs.x + 4 &&
            px + 6 < obs.x + obs.w - 4 &&
            py + PLAYER_H - 4 > obs.y + 4 &&
            py + 4 < obs.y + obs.h
          ) {
            s.lives--;
            flashFrames = 30;
            obs.x = px - obs.w - 10;
            if (s.lives <= 0) {
              s.gameOver = true;
              setBestScore((prev) => Math.max(prev, Math.floor(s.score / 10)));
              setDisplay((d) => ({
                ...d,
                gameOver: true,
                score: Math.floor(s.score / 10),
                lives: 0,
              }));
            } else {
              setDisplay((d) => ({ ...d, lives: s.lives }));
            }
            break;
          }
        }

        for (const coin of s.coins) {
          if (coin.collected) continue;
          if (
            px + PLAYER_W > coin.x - 8 &&
            px < coin.x + 8 &&
            py + PLAYER_H > coin.y - 8 &&
            py < coin.y + 8
          ) {
            coin.collected = true;
            s.coinCount++;
            s.score += 50;
            setDisplay((d) => ({ ...d, coinCount: s.coinCount }));
          }
        }

        if (s.frame % 10 === 0)
          setDisplay((d) => ({ ...d, score: Math.floor(s.score / 10) }));
      }
      if (flashFrames > 0) flashFrames--;

      // Draw sky
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#0a0a1a");
      sky.addColorStop(1, "#0f0f2a");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Stars
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      for (let i = 0; i < 40; i++) {
        const sx = (((i * 137 + bgX * 0.2) % W) + W) % W;
        const sy = (i * 53) % (GROUND - 20);
        ctx.fillRect(sx, sy, 1, 1);
      }

      // Ground
      const groundGrad = ctx.createLinearGradient(0, GROUND, 0, H);
      groundGrad.addColorStop(0, "#1e1b4b");
      groundGrad.addColorStop(1, "#0f0f2a");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, GROUND, W, H - GROUND);

      ctx.strokeStyle = "#7c3aed";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#7c3aed";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, GROUND);
      ctx.lineTo(W, GROUND);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(124,58,237,0.2)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 10; i++) {
        const gx = (((bgX * 2 + i * 48) % W) + W) % W;
        ctx.beginPath();
        ctx.moveTo(gx, GROUND);
        ctx.lineTo(gx - 30, H);
        ctx.stroke();
      }

      // Draw obstacles
      for (const obs of s.obstacles) {
        const obsGrad = ctx.createLinearGradient(
          obs.x,
          obs.y,
          obs.x + obs.w,
          obs.y,
        );
        const colors =
          obs.type === "short"
            ? ["#ef4444", "#dc2626"]
            : obs.type === "tall"
              ? ["#f97316", "#ea580c"]
              : ["#06b6d4", "#0891b2"];
        obsGrad.addColorStop(0, colors[0]);
        obsGrad.addColorStop(1, colors[1]);
        ctx.fillStyle = obsGrad;
        ctx.shadowColor = colors[0];
        ctx.shadowBlur = 10;
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        if (obs.type !== "flying") {
          ctx.fillStyle = colors[0];
          for (let si = 0; si < Math.floor(obs.w / 7); si++) {
            ctx.beginPath();
            ctx.moveTo(obs.x + si * 7, obs.y);
            ctx.lineTo(obs.x + si * 7 + 3.5, obs.y - 7);
            ctx.lineTo(obs.x + si * 7 + 7, obs.y);
            ctx.fill();
          }
        } else {
          ctx.fillStyle = "#0e7490";
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + obs.h / 2);
          ctx.lineTo(obs.x - 12, obs.y);
          ctx.lineTo(obs.x, obs.y + 5);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // Draw coins
      for (const coin of s.coins) {
        if (coin.collected) continue;
        ctx.save();
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fef3c7";
        ctx.beginPath();
        ctx.arc(coin.x - 2, coin.y - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw player
      const px = 60;
      const py = s.playerY;
      const flash = flashFrames > 0 && Math.floor(flashFrames / 5) % 2 === 0;
      if (!flash) {
        const playerGrad = ctx.createLinearGradient(
          px,
          py,
          px + PLAYER_W,
          py + PLAYER_H,
        );
        playerGrad.addColorStop(0, "#22d3ee");
        playerGrad.addColorStop(1, "#0891b2");
        ctx.fillStyle = playerGrad;
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.roundRect(px, py, PLAYER_W, PLAYER_H, 6);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(px + PLAYER_W * 0.65, py + PLAYER_H * 0.3, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#0a0a1a";
        ctx.beginPath();
        ctx.arc(px + PLAYER_W * 0.7, py + PLAYER_H * 0.3, 2, 0, Math.PI * 2);
        ctx.fill();
        const legPhase = (s.frame * 0.3) % (Math.PI * 2);
        ctx.strokeStyle = "#0e7490";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        if (s.onGround) {
          ctx.beginPath();
          ctx.moveTo(px + 8, py + PLAYER_H);
          ctx.lineTo(px + 8, py + PLAYER_H + 8 * Math.sin(legPhase));
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(px + PLAYER_W - 8, py + PLAYER_H);
          ctx.lineTo(
            px + PLAYER_W - 8,
            py + PLAYER_H + 8 * Math.sin(legPhase + Math.PI),
          );
          ctx.stroke();
        }
      }

      // HUD
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, W, 28);
      ctx.fillStyle = "#22d3ee";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`SCORE: ${Math.floor(s.score / 10)}`, 8, 18);
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(`COINS: ${s.coinCount}`, W / 2 - 30, 18);
      ctx.fillStyle = "#ef4444";
      ctx.textAlign = "right";
      ctx.fillText(`HP: ${s.lives}`, W - 8, 18);

      if (!s.started) {
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#22d3ee";
        ctx.font = "bold 22px monospace";
        ctx.textAlign = "center";
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 20;
        ctx.fillText("ENDLESS RUNNER", W / 2, H / 2 - 24);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#a78bfa";
        ctx.font = "14px monospace";
        ctx.fillText("Tap / Press SPACE to start", W / 2, H / 2 + 8);
        ctx.fillStyle = "#6b7280";
        ctx.font = "11px monospace";
        ctx.fillText(
          "SPACE / TAP = Jump  •  Avoid obstacles  •  Collect coins",
          W / 2,
          H / 2 + 32,
        );
      }

      if (s.gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 26px monospace";
        ctx.textAlign = "center";
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 20;
        ctx.fillText("GAME OVER", W / 2, H / 2 - 28);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fbbf24";
        ctx.font = "14px monospace";
        ctx.fillText(
          `Score: ${Math.floor(s.score / 10)}  |  Coins: ${s.coinCount}`,
          W / 2,
          H / 2 + 4,
        );
        ctx.fillStyle = "#6b7280";
        ctx.font = "11px monospace";
        ctx.fillText("Press Restart button to play again", W / 2, H / 2 + 28);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" data-ocid="runner.page">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/games" data-ocid="runner.link">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </Link>
        <h1 className="font-display text-2xl font-bold neon-text-cyan">
          🏃 Endless Runner
        </h1>
      </div>

      <div className="flex items-center justify-between mb-3 bg-card rounded-xl px-4 py-2.5 border border-border">
        <div className="flex items-center gap-4">
          <span className="text-cyan-400 font-mono font-bold text-lg">
            {display.score}
          </span>
          <span className="text-muted-foreground text-sm">pts</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-yellow-400 font-mono">
            🪙 {display.coinCount}
          </span>
          <span className="text-muted-foreground text-sm">
            Best: {bestScore}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={
                i <= display.lives ? "text-red-400" : "text-muted-foreground/30"
              }
            >
              ♥
            </span>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={jump}
        onKeyDown={(e) => {
          if (e.code === "Space") {
            e.preventDefault();
            jump();
          }
        }}
        tabIndex={0}
        data-ocid="runner.canvas_target"
        className="w-full rounded-2xl border-2 border-border cursor-pointer touch-none outline-none"
        style={{ imageRendering: "pixelated", touchAction: "none" }}
      />

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          <span className="bg-muted px-2 py-0.5 rounded font-mono">SPACE</span>{" "}
          or <span className="bg-muted px-2 py-0.5 rounded font-mono">TAP</span>{" "}
          to jump
        </div>
        <div className="flex gap-3">
          {!display.started && (
            <Button
              onClick={jump}
              className="gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              data-ocid="runner.primary_button"
            >
              <Play className="w-4 h-4" /> Start
            </Button>
          )}
          {display.gameOver && (
            <Button
              onClick={restart}
              className="gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              data-ocid="runner.primary_button"
            >
              <RotateCcw className="w-4 h-4" /> Restart
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
        <div className="bg-card rounded-lg p-2 border border-border">
          <div className="text-red-400 font-bold mb-1">Obstacles</div>Jump to
          avoid
        </div>
        <div className="bg-card rounded-lg p-2 border border-border">
          <div className="text-yellow-400 font-bold mb-1">🪙 Coins</div>Collect
          for bonus
        </div>
        <div className="bg-card rounded-lg p-2 border border-border">
          <div className="text-cyan-400 font-bold mb-1">Speed</div>Increases
          over time
        </div>
      </div>
    </div>
  );
}
