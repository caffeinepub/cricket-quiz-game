import { Sky } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { HUD } from "./components/game/HUD";
import { MinimapCanvas } from "./components/game/Minimap";
import { MobileControls } from "./components/game/MobileControls";
import { StartScreen } from "./components/game/StartScreen";
import { useGameStore } from "./store/gameStore";

// ─── City generation data ────────────────────────────────────────────────────

type BuildingData = {
  key: string;
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: string;
};

type TreeData = { key: string; x: number; z: number };

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export const BLOCK_SIZE = 28;
export const ROAD_WIDTH = 8;
export const GRID = 6;

const BUILDING_COLORS = [
  "#9ca3af",
  "#a8a29e",
  "#d6d3d1",
  "#c4b5a4",
  "#b5b0ab",
  "#8d9da8",
];

function generateCity(): { buildings: BuildingData[]; trees: TreeData[] } {
  const rand = seededRand(42);
  const buildings: BuildingData[] = [];
  const trees: TreeData[] = [];
  const step = BLOCK_SIZE + ROAD_WIDTH;
  const offset = (GRID / 2) * step;
  let bIdx = 0;
  let tIdx = 0;

  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const bx = col * step - offset + step / 2;
      const bz = row * step - offset + step / 2;
      const count = 2 + Math.floor(rand() * 3);
      const subW = BLOCK_SIZE / 2;
      for (let k = 0; k < count; k++) {
        const ox = (rand() - 0.5) * (BLOCK_SIZE - 4);
        const oz = (rand() - 0.5) * (BLOCK_SIZE - 4);
        const w = 4 + rand() * 8;
        const d = 4 + rand() * 8;
        const h = 5 + rand() * 18;
        const colorIdx = Math.floor(rand() * BUILDING_COLORS.length);
        buildings.push({
          key: `b${bIdx++}`,
          x: bx + ox,
          z: bz + oz,
          w: Math.min(w, subW),
          d: Math.min(d, subW),
          h,
          color: BUILDING_COLORS[colorIdx],
        });
      }
      if (rand() > 0.5)
        trees.push({
          key: `t${tIdx++}`,
          x: bx + (rand() - 0.5) * BLOCK_SIZE * 0.6,
          z: bz + (rand() - 0.5) * BLOCK_SIZE * 0.6,
        });
      if (rand() > 0.5)
        trees.push({
          key: `t${tIdx++}`,
          x: bx + (rand() - 0.5) * BLOCK_SIZE * 0.6,
          z: bz + (rand() - 0.5) * BLOCK_SIZE * 0.6,
        });
    }
  }
  return { buildings, trees };
}

const CITY_DATA = generateCity();

// Static wheel positions
const WHEEL_POSITIONS: Array<{ key: string; pos: [number, number, number] }> = [
  { key: "wfl", pos: [0.95, -0.25, 1.3] },
  { key: "wfr", pos: [-0.95, -0.25, 1.3] },
  { key: "wrl", pos: [0.95, -0.25, -1.3] },
  { key: "wrr", pos: [-0.95, -0.25, -1.3] },
];

// ─── City Meshes ─────────────────────────────────────────────────────────────

function CityMeshes() {
  return (
    <>
      {CITY_DATA.buildings.map((b) => (
        <mesh
          key={b.key}
          position={[b.x, b.h / 2, b.z]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[b.w, b.h, b.d]} />
          <meshStandardMaterial color={b.color} />
        </mesh>
      ))}
      {CITY_DATA.trees.map((t) => (
        <group key={t.key} position={[t.x, 0, t.z]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 2.4, 6]} />
            <meshStandardMaterial color="#6b4226" />
          </mesh>
          <mesh position={[0, 3.5, 0]}>
            <coneGeometry args={[1.8, 4, 8]} />
            <meshStandardMaterial color="#2d6a2d" />
          </mesh>
          <mesh position={[0, 5.5, 0]}>
            <coneGeometry args={[1.2, 3, 8]} />
            <meshStandardMaterial color="#3a8f3a" />
          </mesh>
        </group>
      ))}
    </>
  );
}

// ─── Ground ───────────────────────────────────────────────────────────────────

function Ground() {
  const size = (GRID + 1) * (BLOCK_SIZE + ROAD_WIDTH);
  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      {CITY_DATA.buildings.map((b) => (
        <mesh
          key={`pav-${b.key}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[b.x, 0.005, b.z]}
          receiveShadow
        >
          <planeGeometry args={[BLOCK_SIZE, BLOCK_SIZE]} />
          <meshStandardMaterial color="#9ca3af" />
        </mesh>
      ))}
    </>
  );
}

// ─── Vehicle ──────────────────────────────────────────────────────────────────

type MobileInputRef = React.MutableRefObject<{
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}>;

interface VehicleProps {
  mobileInput: MobileInputRef;
  onUpdate: (pos: THREE.Vector3, rot: number, vel: number) => void;
}

const ACCELERATION = 0.025;
const MAX_SPEED = 1.2;
const FRICTION = 0.94;
const TURN_SPEED = 0.04;

function Vehicle({ mobileInput, onUpdate }: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const velocity = useRef(0);
  const rotationY = useRef(0);
  const keys = useRef({ w: false, s: false, a: false, d: false });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "ArrowUp") keys.current.w = true;
      if (e.key === "s" || e.key === "ArrowDown") keys.current.s = true;
      if (e.key === "a" || e.key === "ArrowLeft") keys.current.a = true;
      if (e.key === "d" || e.key === "ArrowRight") keys.current.d = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "ArrowUp") keys.current.w = false;
      if (e.key === "s" || e.key === "ArrowDown") keys.current.s = false;
      if (e.key === "a" || e.key === "ArrowLeft") keys.current.a = false;
      if (e.key === "d" || e.key === "ArrowRight") keys.current.d = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame(() => {
    const mob = mobileInput.current;
    const fwd = keys.current.w || mob.forward;
    const bwd = keys.current.s || mob.backward;
    const lft = keys.current.a || mob.left;
    const rgt = keys.current.d || mob.right;

    if (fwd)
      velocity.current = Math.min(velocity.current + ACCELERATION, MAX_SPEED);
    if (bwd)
      velocity.current = Math.max(
        velocity.current - ACCELERATION * 0.7,
        -MAX_SPEED * 0.5,
      );
    velocity.current *= FRICTION;
    if (Math.abs(velocity.current) > 0.005) {
      const dir = velocity.current > 0 ? 1 : -1;
      if (lft) rotationY.current += TURN_SPEED * dir;
      if (rgt) rotationY.current -= TURN_SPEED * dir;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = rotationY.current;
      const dx = Math.sin(rotationY.current) * velocity.current;
      const dz = Math.cos(rotationY.current) * velocity.current;
      groupRef.current.position.x += dx;
      groupRef.current.position.z += dz;
      const bound = ((GRID + 1) * (BLOCK_SIZE + ROAD_WIDTH)) / 2 - 2;
      groupRef.current.position.x = Math.max(
        -bound,
        Math.min(bound, groupRef.current.position.x),
      );
      groupRef.current.position.z = Math.max(
        -bound,
        Math.min(bound, groupRef.current.position.z),
      );
      onUpdate(groupRef.current.position, rotationY.current, velocity.current);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.6, 0]}>
      {/* Car body */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.8, 4]} />
        <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Cabin */}
      <mesh castShadow position={[0, 0.65, -0.3]}>
        <boxGeometry args={[1.7, 0.6, 2.2]} />
        <meshStandardMaterial color="#b91c1c" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 0.68, 0.83]}>
        <boxGeometry args={[1.6, 0.5, 0.06]} />
        <meshStandardMaterial color="#93c5fd" transparent opacity={0.7} />
      </mesh>
      {/* Rear window */}
      <mesh position={[0, 0.68, -1.44]}>
        <boxGeometry args={[1.6, 0.45, 0.06]} />
        <meshStandardMaterial color="#93c5fd" transparent opacity={0.7} />
      </mesh>
      {/* Headlights */}
      <mesh position={[0.6, 0.1, 2.02]}>
        <boxGeometry args={[0.4, 0.2, 0.04]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={0.8}
        />
      </mesh>
      <mesh position={[-0.6, 0.1, 2.02]}>
        <boxGeometry args={[0.4, 0.2, 0.04]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Tail lights */}
      <mesh position={[0.6, 0.1, -2.02]}>
        <boxGeometry args={[0.4, 0.2, 0.04]} />
        <meshStandardMaterial
          color="#f87171"
          emissive="#f87171"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[-0.6, 0.1, -2.02]}>
        <boxGeometry args={[0.4, 0.2, 0.04]} />
        <meshStandardMaterial
          color="#f87171"
          emissive="#f87171"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Wheels */}
      {WHEEL_POSITIONS.map(({ key, pos }) => (
        <mesh
          key={key}
          position={pos}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.38, 0.38, 0.28, 10]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      ))}
      {/* Wheel hubs */}
      {WHEEL_POSITIONS.map(({ key, pos }) => (
        <mesh
          key={`hub-${key}`}
          position={[pos[0] + (pos[0] > 0 ? 0.15 : -0.15), pos[1], pos[2]]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.18, 0.18, 0.04, 6]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Follow Camera ────────────────────────────────────────────────────────────

interface FollowCameraProps {
  carPosRef: React.MutableRefObject<THREE.Vector3>;
  carRotRef: React.MutableRefObject<number>;
}

function FollowCamera({ carPosRef, carRotRef }: FollowCameraProps) {
  const { camera } = useThree();
  const camPos = useRef(new THREE.Vector3(0, 8, 15));
  const camTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    const rot = carRotRef.current;
    const pos = carPosRef.current;
    const dist = 10;
    const height = 5;
    const targetX = pos.x - Math.sin(rot) * dist;
    const targetZ = pos.z - Math.cos(rot) * dist;
    camPos.current.lerp(
      new THREE.Vector3(targetX, pos.y + height, targetZ),
      0.08,
    );
    camera.position.copy(camPos.current);
    camTarget.current.lerp(new THREE.Vector3(pos.x, pos.y + 1.5, pos.z), 0.1);
    camera.lookAt(camTarget.current);
  });

  return null;
}

// ─── Day/Night Sky ────────────────────────────────────────────────────────────

function DayNightSky() {
  const sunPos = useRef(new THREE.Vector3());
  const phiRef = useRef(0);

  useFrame((_, delta) => {
    phiRef.current += delta * 0.015;
    const phi = Math.PI / 2 - Math.sin(phiRef.current) * Math.PI * 0.48;
    sunPos.current.setFromSphericalCoords(1, phi, 0);
  });

  return (
    <Sky
      sunPosition={sunPos.current}
      turbidity={8}
      rayleigh={3}
      mieCoefficient={0.005}
      mieDirectionalG={0.8}
    />
  );
}

// ─── Scene Lights ─────────────────────────────────────────────────────────────

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[80, 120, 60]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={400}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
      />
      <hemisphereLight args={["#87ceeb", "#4a7c59", 0.3]} />
    </>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

interface SceneProps {
  mobileInput: MobileInputRef;
  onCarUpdate: (pos: THREE.Vector3, rot: number, vel: number) => void;
}

function Scene({ mobileInput, onCarUpdate }: SceneProps) {
  const carPosRef = useRef(new THREE.Vector3());
  const carRotRef = useRef(0);

  const handleUpdate = useCallback(
    (pos: THREE.Vector3, rot: number, vel: number) => {
      carPosRef.current.copy(pos);
      carRotRef.current = rot;
      onCarUpdate(pos, rot, vel);
    },
    [onCarUpdate],
  );

  return (
    <>
      <Lights />
      <DayNightSky />
      <Ground />
      <CityMeshes />
      <Vehicle mobileInput={mobileInput} onUpdate={handleUpdate} />
      <FollowCamera carPosRef={carPosRef} carRotRef={carRotRef} />
    </>
  );
}

// ─── Main Game Component ──────────────────────────────────────────────────────

export default function Game() {
  const {
    isPlaying,
    setIsPlaying,
    speed,
    setSpeed,
    wantedLevel,
    setWantedLevel,
  } = useGameStore();
  const carPosRef = useRef(new THREE.Vector3());
  const carRotRef = useRef(0);
  const mobileInput = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const handleCarUpdate = useCallback(
    (pos: THREE.Vector3, _rot: number, vel: number) => {
      carPosRef.current.copy(pos);
      carRotRef.current = _rot;
      const kmh = Math.abs(vel) * 120;
      setSpeed(Math.round(kmh));
      if (kmh > 90) setWantedLevel(5);
      else if (kmh > 70) setWantedLevel(4);
      else if (kmh > 50) setWantedLevel(3);
      else if (kmh > 30) setWantedLevel(2);
      else if (kmh > 15) setWantedLevel(1);
      else setWantedLevel(0);
    },
    [setSpeed, setWantedLevel],
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#1a1a2e",
      }}
    >
      {!isPlaying && <StartScreen onPlay={() => setIsPlaying(true)} />}

      {isPlaying && (
        <>
          <Canvas
            shadows
            camera={{ fov: 65, near: 0.1, far: 1000, position: [0, 8, 15] }}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <Scene mobileInput={mobileInput} onCarUpdate={handleCarUpdate} />
            </Suspense>
          </Canvas>

          <HUD speed={speed} wantedLevel={wantedLevel} />
          <MinimapCanvas carPosRef={carPosRef} carRotRef={carRotRef} />
          <MobileControls mobileInput={mobileInput} />

          <div
            style={{
              position: "fixed",
              bottom: "8px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "11px",
              color: "rgba(255,255,255,0.35)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            © {new Date().getFullYear()} Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              style={{ color: "rgba(255,255,255,0.5)", pointerEvents: "auto" }}
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </div>
        </>
      )}
    </div>
  );
}
