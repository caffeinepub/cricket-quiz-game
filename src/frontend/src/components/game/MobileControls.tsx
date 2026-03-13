import { useEffect, useState } from "react";

type MobileInputRef = React.MutableRefObject<{
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}>;

interface MobileControlsProps {
  mobileInput: MobileInputRef;
}

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

interface DPadButtonProps {
  label: string;
  symbol: string;
  style: React.CSSProperties;
  onDown: () => void;
  onUp: () => void;
}

function DPadButton({ label, symbol, style, onDown, onUp }: DPadButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      style={{
        width: 56,
        height: 56,
        background: "rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: "8px",
        color: "white",
        fontSize: "22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
        ...style,
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        onDown();
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        onUp();
      }}
      onPointerLeave={(e) => {
        e.preventDefault();
        onUp();
      }}
    >
      {symbol}
    </button>
  );
}

export function MobileControls({ mobileInput }: MobileControlsProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isTouchDevice());
    const handler = () => setShow(isTouchDevice());
    window.addEventListener("touchstart", handler, { once: true });
    return () => window.removeEventListener("touchstart", handler);
  }, []);

  if (!show) return null;

  const set = (key: keyof typeof mobileInput.current, val: boolean) => {
    mobileInput.current[key] = val;
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 60,
        display: "grid",
        gridTemplateColumns: "56px 56px 56px",
        gridTemplateRows: "56px 56px",
        gap: "8px",
      }}
    >
      {/* Up */}
      <div style={{ gridColumn: 2, gridRow: 1 }}>
        <DPadButton
          label="Forward"
          symbol="▲"
          style={{}}
          onDown={() => set("forward", true)}
          onUp={() => set("forward", false)}
        />
      </div>
      {/* Left */}
      <div style={{ gridColumn: 1, gridRow: 2 }}>
        <DPadButton
          label="Left"
          symbol="◀"
          style={{}}
          onDown={() => set("left", true)}
          onUp={() => set("left", false)}
        />
      </div>
      {/* Down */}
      <div style={{ gridColumn: 2, gridRow: 2 }}>
        <DPadButton
          label="Reverse"
          symbol="▼"
          style={{}}
          onDown={() => set("backward", true)}
          onUp={() => set("backward", false)}
        />
      </div>
      {/* Right */}
      <div style={{ gridColumn: 3, gridRow: 2 }}>
        <DPadButton
          label="Right"
          symbol="▶"
          style={{}}
          onDown={() => set("right", true)}
          onUp={() => set("right", false)}
        />
      </div>
    </div>
  );
}
