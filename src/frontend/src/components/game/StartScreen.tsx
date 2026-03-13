import { motion } from "motion/react";

interface StartScreenProps {
  onPlay: () => void;
}

const STAR_COUNT = 60;
const STARS = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  size: i % 3 === 0 ? 3 : 2,
  left: (i * 17 + 3) % 100,
  top: (i * 13 + 7) % 60,
  duration: 2 + (i % 3),
  delay: (i * 0.17) % 2,
}));

export function StartScreen({ onPlay }: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 40%, #0a1a2e 100%)",
        fontFamily: "'Bricolage Grotesque', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* City silhouette bg */}
      <svg
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          opacity: 0.12,
        }}
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <rect x="0" y="120" width="60" height="180" fill="white" />
        <rect x="80" y="60" width="80" height="240" fill="white" />
        <rect x="180" y="90" width="50" height="210" fill="white" />
        <rect x="250" y="30" width="100" height="270" fill="white" />
        <rect x="370" y="80" width="60" height="220" fill="white" />
        <rect x="450" y="50" width="90" height="250" fill="white" />
        <rect x="560" y="100" width="55" height="200" fill="white" />
        <rect x="640" y="20" width="110" height="280" fill="white" />
        <rect x="770" y="70" width="65" height="230" fill="white" />
        <rect x="860" y="45" width="85" height="255" fill="white" />
        <rect x="970" y="95" width="55" height="205" fill="white" />
        <rect x="1050" y="55" width="90" height="245" fill="white" />
        <rect x="1160" y="110" width="40" height="190" fill="white" />
      </svg>

      {/* Stars */}
      {STARS.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: "absolute",
            width: star.size,
            height: star.size,
            borderRadius: "50%",
            background: "white",
            left: `${star.left}%`,
            top: `${star.top}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: star.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: star.delay,
          }}
        />
      ))}

      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        style={{ textAlign: "center", position: "relative", zIndex: 2 }}
      >
        {/* Subtitle */}
        <motion.p
          style={{
            color: "#f59e0b",
            letterSpacing: "0.4em",
            fontSize: "clamp(11px, 1.5vw, 14px)",
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Open World 3D
        </motion.p>

        {/* Main title */}
        <h1
          style={{
            fontSize: "clamp(56px, 12vw, 130px)",
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.02em",
            lineHeight: 0.9,
            marginBottom: "8px",
            textShadow:
              "0 0 80px rgba(251,191,36,0.3), 0 4px 40px rgba(0,0,0,0.8)",
          }}
        >
          OPEN
        </h1>
        <h1
          style={{
            fontSize: "clamp(56px, 12vw, 130px)",
            fontWeight: 800,
            background: "linear-gradient(135deg, #f59e0b, #ef4444, #f59e0b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
            lineHeight: 0.9,
            marginBottom: "32px",
          }}
        >
          WORLD
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "clamp(13px, 1.8vw, 17px)",
            marginBottom: "48px",
            fontWeight: 400,
            letterSpacing: "0.02em",
          }}
        >
          Explore the city. Drive fast. Escape the law.
        </p>

        <motion.button
          type="button"
          data-ocid="game.primary_button"
          onClick={onPlay}
          whileHover={{
            scale: 1.06,
            boxShadow: "0 0 40px rgba(251,191,36,0.5)",
          }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#0a0a1a",
            border: "none",
            padding: "18px 64px",
            fontSize: "clamp(16px, 2vw, 20px)",
            fontWeight: 800,
            borderRadius: "4px",
            cursor: "pointer",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontFamily: "inherit",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          ▶ PLAY NOW
        </motion.button>

        <p
          style={{
            marginTop: "32px",
            color: "rgba(255,255,255,0.3)",
            fontSize: "13px",
            letterSpacing: "0.05em",
          }}
        >
          WASD / Arrow Keys to drive
        </p>
      </motion.div>
    </motion.div>
  );
}
