import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Dice1, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const BOARD_SIZE = 15;
const CELL = 40;
const CANVAS = BOARD_SIZE * CELL;

const SAFE_POSITIONS = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

const PATH: [number, number][] = [
  [6, 1],
  [6, 2],
  [6, 3],
  [6, 4],
  [6, 5],
  [5, 6],
  [4, 6],
  [3, 6],
  [2, 6],
  [1, 6],
  [0, 6],
  [0, 7],
  [0, 8],
  [1, 8],
  [2, 8],
  [3, 8],
  [4, 8],
  [5, 8],
  [6, 9],
  [6, 10],
  [6, 11],
  [6, 12],
  [6, 13],
  [7, 13],
  [8, 13],
  [8, 12],
  [8, 11],
  [8, 10],
  [8, 9],
  [9, 8],
  [10, 8],
  [11, 8],
  [12, 8],
  [13, 8],
  [14, 8],
  [14, 7],
  [14, 6],
  [13, 6],
  [12, 6],
  [11, 6],
  [10, 6],
  [9, 6],
  [8, 5],
  [8, 4],
  [8, 3],
  [8, 2],
  [8, 1],
  [8, 0],
  [7, 0],
  [6, 0],
];

const BLUE_START = 0;
const RED_START = 13;

const BLUE_HOME_BASE: [number, number][] = [
  [2, 2],
  [2, 4],
  [4, 2],
  [4, 4],
];
const RED_HOME_BASE: [number, number][] = [
  [2, 10],
  [2, 12],
  [4, 10],
  [4, 12],
];
const BLUE_HOME_COLUMN: [number, number][] = [
  [7, 1],
  [7, 2],
  [7, 3],
  [7, 4],
  [7, 5],
  [7, 6],
];
const RED_HOME_COLUMN: [number, number][] = [
  [7, 13],
  [7, 12],
  [7, 11],
  [7, 10],
  [7, 9],
  [7, 8],
];
const CENTER: [number, number] = [7, 7];

interface Token {
  id: number;
  player: "blue" | "red";
  pos: number;
  baseIdx: number;
}

function initTokens(): Token[] {
  const tokens: Token[] = [];
  for (let i = 0; i < 4; i++)
    tokens.push({ id: i, player: "blue", pos: -1, baseIdx: i });
  for (let i = 0; i < 4; i++)
    tokens.push({ id: i + 4, player: "red", pos: -1, baseIdx: i });
  return tokens;
}

function getTokenCanvasPos(token: Token): [number, number] {
  const offsets = [
    [0.25, 0.25],
    [0.75, 0.25],
    [0.25, 0.75],
    [0.75, 0.75],
  ];
  const o = offsets[token.baseIdx % 4];
  if (token.pos === -1) {
    const base = token.player === "blue" ? BLUE_HOME_BASE : RED_HOME_BASE;
    const [r, c] = base[token.baseIdx];
    return [c * CELL + CELL / 2, r * CELL + CELL / 2];
  }
  if (token.pos >= 52) {
    const col = token.player === "blue" ? BLUE_HOME_COLUMN : RED_HOME_COLUMN;
    const idx = token.pos - 52;
    if (idx >= col.length)
      return [CENTER[1] * CELL + CELL / 2, CENTER[0] * CELL + CELL / 2];
    const [r, c] = col[idx];
    return [c * CELL + CELL * o[0], r * CELL + CELL * o[1]];
  }
  const offset = token.player === "blue" ? BLUE_START : RED_START;
  const actualPos = (token.pos + offset) % PATH.length;
  const [r, c] = PATH[actualPos];
  return [c * CELL + CELL * o[0], r * CELL + CELL * o[1]];
}

function checkWin(toks: Token[], player: "blue" | "red") {
  return toks.filter((t) => t.player === player && t.pos === 58).length === 4;
}

export default function Ludo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tokens, setTokens] = useState<Token[]>(initTokens());
  const [currentPlayer, setCurrentPlayer] = useState<"blue" | "red">("blue");
  const [dice, setDice] = useState<number>(0);
  const [diceRolled, setDiceRolled] = useState(false);
  const [message, setMessage] = useState("Roll the dice to start!");
  const [winner, setWinner] = useState<"blue" | "red" | null>(null);
  const [rolling, setRolling] = useState(false);

  const getMovableTokens = useCallback(
    (player: "blue" | "red", diceVal: number, toks: Token[]): Token[] =>
      toks.filter((t) => {
        if (t.player !== player) return false;
        if (t.pos === 58) return false;
        if (t.pos === -1) return diceVal === 6;
        return t.pos + diceVal <= 57;
      }),
    [],
  );

  const moveToken = useCallback(
    (tokenId: number, diceVal: number, toks: Token[]): Token[] =>
      toks.map((t) => {
        if (t.id !== tokenId) return t;
        if (t.pos === -1) return { ...t, pos: 0 };
        const newPos = t.pos + diceVal;
        if (newPos >= 58) return { ...t, pos: 58 };
        return { ...t, pos: newPos };
      }),
    [],
  );

  // Use refs to avoid stale closure in rollDice
  const currentPlayerRef = useRef(currentPlayer);
  const tokensRef = useRef(tokens);
  const diceRolledRef = useRef(diceRolled);
  const rollingRef = useRef(rolling);
  const winnerRef = useRef(winner);
  currentPlayerRef.current = currentPlayer;
  tokensRef.current = tokens;
  diceRolledRef.current = diceRolled;
  rollingRef.current = rolling;
  winnerRef.current = winner;

  const rollDiceImpl = useCallback(() => {
    if (diceRolledRef.current || rollingRef.current || winnerRef.current)
      return;
    setRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDice(Math.ceil(Math.random() * 6));
      count++;
      if (count >= 8) {
        clearInterval(interval);
        const finalDice = Math.ceil(Math.random() * 6);
        setDice(finalDice);
        setRolling(false);
        setDiceRolled(true);
        const player = currentPlayerRef.current;
        const movable = getMovableTokens(player, finalDice, tokensRef.current);
        if (movable.length === 0) {
          setMessage(
            `${player === "blue" ? "You" : "CPU"} got ${finalDice} — no moves! Turn passes.`,
          );
          setTimeout(() => {
            setCurrentPlayer((p) => (p === "blue" ? "red" : "blue"));
            setDiceRolled(false);
            setMessage(
              player === "blue"
                ? "CPU's turn — rolling..."
                : "Your turn! Roll the dice.",
            );
          }, 1200);
        } else if (player === "blue") {
          setMessage(`You rolled ${finalDice}! Click a token to move.`);
        } else {
          setMessage(`CPU rolled ${finalDice}!`);
          setTimeout(() => {
            const pick = movable[Math.floor(Math.random() * movable.length)];
            setTokens((prev) => {
              const next = moveToken(pick.id, finalDice, prev);
              if (checkWin(next, "red")) setWinner("red");
              return next;
            });
            setDiceRolled(false);
            setCurrentPlayer(finalDice === 6 ? "red" : "blue");
            setMessage(
              finalDice === 6
                ? "CPU rolls again!"
                : "Your turn! Roll the dice.",
            );
          }, 1000);
        }
      }
    }, 80);
  }, [getMovableTokens, moveToken]);

  const handleTokenClick = (tokenId: number) => {
    if (!diceRolled || currentPlayer !== "blue" || winner) return;
    const movable = getMovableTokens("blue", dice, tokens);
    if (!movable.find((t) => t.id === tokenId)) return;
    setTokens((prev) => {
      const next = moveToken(tokenId, dice, prev);
      if (checkWin(next, "blue")) setWinner("blue");
      return next;
    });
    setDiceRolled(false);
    if (dice === 6) {
      setMessage("You rolled 6! Roll again!");
      setCurrentPlayer("blue");
    } else {
      setCurrentPlayer("red");
      setMessage("CPU's turn — rolling...");
    }
  };

  // Auto CPU roll
  useEffect(() => {
    if (currentPlayer === "red" && !diceRolled && !winner) {
      const t = setTimeout(() => rollDiceImpl(), 900);
      return () => clearTimeout(t);
    }
  }, [currentPlayer, diceRolled, winner, rollDiceImpl]);

  // Draw board
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS, CANVAS);
    ctx.fillStyle = "#0f0f1a";
    ctx.fillRect(0, 0, CANVAS, CANVAS);

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const x = c * CELL;
        const y = r * CELL;
        let cellColor = "#1a1a2e";
        if (r < 6 && c < 6) cellColor = "#0d1b4a";
        if (r < 6 && c > 8) cellColor = "#4a0d0d";
        if (r > 8 && c > 8) cellColor = "#0d4a1b";
        if (r > 8 && c < 6) cellColor = "#3a3a00";
        if (PATH.some(([pr, pc]) => pr === r && pc === c))
          cellColor = "#1e1e3a";
        if (BLUE_HOME_COLUMN.some(([pr, pc]) => pr === r && pc === c))
          cellColor = "#0d2b6e";
        if (RED_HOME_COLUMN.some(([pr, pc]) => pr === r && pc === c))
          cellColor = "#6e0d0d";
        if (r === 7 && c === 7) cellColor = "#1a2a1a";
        ctx.fillStyle = cellColor;
        ctx.fillRect(x, y, CELL, CELL);
        ctx.strokeStyle = "#2a2a4a";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, CELL, CELL);
      }
    }

    for (const idx of SAFE_POSITIONS) {
      if (idx < PATH.length) {
        const [r, c] = PATH[idx];
        ctx.fillStyle = "rgba(255,215,0,0.15)";
        ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
        ctx.fillStyle = "#ffd700";
        ctx.font = `${CELL * 0.4}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("★", c * CELL + CELL / 2, r * CELL + CELL / 2);
      }
    }

    ctx.fillStyle = "#7c3aed";
    ctx.beginPath();
    ctx.moveTo(7 * CELL + CELL / 2, 7 * CELL);
    ctx.lineTo(9 * CELL, 9 * CELL);
    ctx.lineTo(6 * CELL, 9 * CELL);
    ctx.closePath();
    ctx.fill();

    const drawHomeBase = (
      cells: [number, number][],
      color: string,
      glow: string,
    ) => {
      for (const [r, c] of cells) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(
          c * CELL + CELL / 2,
          r * CELL + CELL / 2,
          CELL * 0.38,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.strokeStyle = glow;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };
    drawHomeBase(BLUE_HOME_BASE, "#1e3a8a", "#3b82f6");
    drawHomeBase(RED_HOME_BASE, "#7f1d1d", "#ef4444");

    const movable =
      diceRolled && currentPlayer === "blue"
        ? getMovableTokens("blue", dice, tokens)
        : [];
    const movableIds = new Set(movable.map((t) => t.id));

    for (const token of tokens) {
      if (token.pos === 58) continue;
      const [x, y] = getTokenCanvasPos(token);
      const color = token.player === "blue" ? "#3b82f6" : "#ef4444";
      const glow = token.player === "blue" ? "#60a5fa" : "#f87171";
      const isMovable = movableIds.has(token.id);
      if (isMovable) {
        ctx.shadowColor = glow;
        ctx.shadowBlur = 12;
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, CELL * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isMovable ? "#fff" : glow;
      ctx.lineWidth = isMovable ? 2.5 : 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.font = `bold ${CELL * 0.28}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String((token.id % 4) + 1), x, y);
    }
  }, [tokens, diceRolled, dice, currentPlayer, getMovableTokens]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!diceRolled || currentPlayer !== "blue" || winner) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = CANVAS / rect.width;
    const mx = (e.clientX - rect.left) * scale;
    const my = (e.clientY - rect.top) * scale;
    const movable = getMovableTokens("blue", dice, tokens);
    for (const token of movable) {
      const [tx, ty] = getTokenCanvasPos(token);
      if (Math.sqrt((mx - tx) ** 2 + (my - ty) ** 2) < CELL * 0.4) {
        handleTokenClick(token.id);
        return;
      }
    }
  };

  const reset = () => {
    setTokens(initTokens());
    setCurrentPlayer("blue");
    setDice(0);
    setDiceRolled(false);
    setMessage("Roll the dice to start!");
    setWinner(null);
    setRolling(false);
  };

  const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" data-ocid="ludo.page">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/games" data-ocid="ludo.link">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </Link>
        <h1 className="font-display text-2xl font-bold text-orange-400">
          🎲 Ludo Classic
        </h1>
      </div>

      <div className="flex items-center justify-between mb-4 bg-card rounded-xl px-4 py-3 border border-border">
        <div className="flex items-center gap-3">
          <div
            className={`w-4 h-4 rounded-full ${currentPlayer === "blue" ? "bg-blue-500 shadow-[0_0_8px_#3b82f6]" : "bg-red-500 shadow-[0_0_8px_#ef4444]"}`}
          />
          <span className="text-sm font-semibold text-foreground">
            {currentPlayer === "blue" ? "Your Turn (Blue)" : "CPU Turn (Red)"}
          </span>
        </div>
        <span className="text-muted-foreground text-sm">{message}</span>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS}
          height={CANVAS}
          onClick={handleCanvasClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              handleCanvasClick(
                e as unknown as React.MouseEvent<HTMLCanvasElement>,
              );
          }}
          tabIndex={0}
          data-ocid="ludo.canvas_target"
          className="w-full rounded-2xl border-2 border-border cursor-pointer outline-none"
          style={{ maxWidth: "100%", touchAction: "none" }}
        />
        {winner && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-2xl">
            <div className="text-center">
              <div className="text-5xl mb-3">
                {winner === "blue" ? "🎉" : "🤖"}
              </div>
              <h2
                className={`font-display text-3xl font-extrabold mb-2 ${winner === "blue" ? "text-blue-400" : "text-red-400"}`}
              >
                {winner === "blue" ? "You Win!" : "CPU Wins!"}
              </h2>
              <Button
                onClick={reset}
                className="mt-3 gap-2"
                data-ocid="ludo.confirm_button"
              >
                <RotateCcw className="w-4 h-4" /> Play Again
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl" aria-label={`Dice: ${dice}`}>
            {dice > 0 ? diceFaces[dice - 1] : "🎲"}
          </span>
          {dice > 0 && (
            <span className="text-2xl font-bold text-orange-400">{dice}</span>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            onClick={rollDiceImpl}
            disabled={
              diceRolled || rolling || !!winner || currentPlayer === "red"
            }
            className="gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold"
            data-ocid="ludo.primary_button"
          >
            <Dice1 className="w-4 h-4" />
            {rolling ? "Rolling..." : "Roll Dice"}
          </Button>
          <Button
            variant="outline"
            onClick={reset}
            className="gap-2"
            data-ocid="ludo.secondary_button"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>
      </div>

      <div className="flex gap-6 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <span>
            You (Blue) —{" "}
            {tokens.filter((t) => t.player === "blue" && t.pos === 58).length}/4
            home
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500" />
          <span>
            CPU (Red) —{" "}
            {tokens.filter((t) => t.player === "red" && t.pos === 58).length}/4
            home
          </span>
        </div>
      </div>
    </div>
  );
}
