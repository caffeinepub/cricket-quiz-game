import { useGameStore } from "../../store/gameStore";

const STARS = [1, 2, 3, 4, 5];

interface HUDProps {
  speed: number;
  wantedLevel: number;
}

export function HUD({ speed, wantedLevel }: HUDProps) {
  const health = useGameStore((s) => s.health);

  return (
    <>
      {/* Top left: Health */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            fontFamily: "monospace",
          }}
        >
          ❤ HEALTH
        </div>
        <div
          style={{
            width: "140px",
            height: "8px",
            background: "rgba(0,0,0,0.5)",
            borderRadius: "4px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${health}%`,
              background:
                health > 50 ? "#22c55e" : health > 25 ? "#f59e0b" : "#ef4444",
              borderRadius: "4px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <div
          style={{
            color: "white",
            fontSize: "12px",
            fontWeight: 700,
            fontFamily: "monospace",
          }}
        >
          {health}/100
        </div>
      </div>

      {/* Top right: Wanted level */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "4px",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            fontFamily: "monospace",
          }}
        >
          WANTED
        </div>
        <div style={{ display: "flex", gap: "3px" }}>
          {STARS.map((n) => (
            <div
              key={n}
              style={{
                fontSize: "18px",
                filter: n <= wantedLevel ? "none" : "grayscale(1) opacity(0.3)",
                transition: "filter 0.2s",
              }}
            >
              ⭐
            </div>
          ))}
        </div>
        {wantedLevel > 0 && (
          <div
            style={{
              color: "#ef4444",
              fontSize: "10px",
              fontWeight: 700,
              fontFamily: "monospace",
              letterSpacing: "0.05em",
              animation: "pulse 1s infinite",
            }}
          >
            ● POLICE ALERT
          </div>
        )}
      </div>

      {/* Bottom left: Speed */}
      <div
        data-ocid="game.panel"
        style={{
          position: "fixed",
          bottom: 24,
          left: 20,
          zIndex: 50,
          background: "rgba(0,0,0,0.7)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "8px",
          padding: "12px 18px",
          backdropFilter: "blur(8px)",
          minWidth: "120px",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            fontFamily: "monospace",
          }}
        >
          SPEED
        </div>
        <div
          style={{
            color: speed > 80 ? "#ef4444" : speed > 50 ? "#f59e0b" : "#22c55e",
            fontSize: "36px",
            fontWeight: 800,
            fontFamily: "monospace",
            lineHeight: 1,
            transition: "color 0.2s",
          }}
        >
          {speed}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "11px",
            fontFamily: "monospace",
          }}
        >
          km/h
        </div>
      </div>

      {/* Controls hint */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: 20,
          transform: "translateY(-50%)",
          zIndex: 50,
          color: "rgba(255,255,255,0.25)",
          fontSize: "11px",
          fontFamily: "monospace",
          lineHeight: "1.8",
          pointerEvents: "none",
        }}
      >
        W / ↑ Forward
        <br />S / ↓ Reverse
        <br />A / ← Turn Left
        <br />D / → Turn Right
      </div>
    </>
  );
}
