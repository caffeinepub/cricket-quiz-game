import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type * as THREE from "three";

// Static city data for minimap (matches Game.tsx generation)
const BLOCK_SIZE = 28;
const ROAD_WIDTH = 8;
const GRID = 6;
const MAP_SIZE = 150;
const WORLD_SIZE = (GRID + 1) * (BLOCK_SIZE + ROAD_WIDTH);

function worldToMap(worldX: number, worldZ: number): [number, number] {
  const scale = MAP_SIZE / WORLD_SIZE;
  const mx = (worldX + WORLD_SIZE / 2) * scale;
  const mz = (worldZ + WORLD_SIZE / 2) * scale;
  return [mx, mz];
}

interface MinimapCanvasProps {
  carPosRef: React.MutableRefObject<THREE.Vector3>;
  carRotRef: React.MutableRefObject<number>;
}

export function MinimapCanvas({ carPosRef, carRotRef }: MinimapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Precompute city blocks positions for minimap
  function drawMinimap() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, MAP_SIZE, MAP_SIZE);

    // Background
    ctx.fillStyle = "#374151";
    ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

    // Roads (grid lines)
    const step = BLOCK_SIZE + ROAD_WIDTH;
    const scale = MAP_SIZE / WORLD_SIZE;
    ctx.strokeStyle = "#6b7280";
    ctx.lineWidth = ROAD_WIDTH * scale;
    for (let i = 0; i <= GRID; i++) {
      const x = i * step * scale;
      const halfOffset = (GRID / 2) * step * scale;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, MAP_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, x);
      ctx.lineTo(MAP_SIZE, x);
      ctx.stroke();
      // road at grid center
      const cx =
        halfOffset +
        (i - GRID / 2) * step * scale +
        step * 0.5 * scale -
        ROAD_WIDTH * scale * 0.5;
      void cx;
    }

    // City blocks
    ctx.fillStyle = "#9ca3af";
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        const bx = col * step - (GRID / 2) * step + step / 2;
        const bz = row * step - (GRID / 2) * step + step / 2;
        const [mx, mz] = worldToMap(bx, bz);
        const bs = BLOCK_SIZE * scale;
        ctx.fillRect(mx - bs / 2, mz - bs / 2, bs, bs);
      }
    }

    // Car dot
    const [cx, cz] = worldToMap(carPosRef.current.x, carPosRef.current.z);
    // Car direction arrow
    const rot = carRotRef.current;
    ctx.save();
    ctx.translate(cx, cz);
    ctx.rotate(rot);
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(4, 4);
    ctx.lineTo(-4, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Border
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, MAP_SIZE, MAP_SIZE);
  }

  // We can't use useFrame outside Canvas, so we use requestAnimationFrame
  useEffect(() => {
    let animId: number;
    const loop = () => {
      drawMinimap();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  });

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 20,
        zIndex: 50,
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 4,
          left: 6,
          color: "rgba(255,255,255,0.5)",
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          fontFamily: "monospace",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        MAP
      </div>
      <canvas
        ref={canvasRef}
        data-ocid="game.canvas_target"
        width={MAP_SIZE}
        height={MAP_SIZE}
        style={{ display: "block" }}
      />
    </div>
  );
}
