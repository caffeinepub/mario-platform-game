import { motion } from "motion/react";

// Pre-computed stable confetti data
const CONFETTI = Array.from({ length: 20 }, (_, i) => ({
  id: `confetti-${i}`,
  left: (i * 31 + 7) % 100,
  background: (["#ffd700", "#ff6644", "#22dd55", "#44aaff"] as const)[i % 4],
  duration: 2 + (i % 5) * 0.5,
  delay: ((i * 17) % 15) / 10,
  repeatDelay: ((i * 23) % 20) / 10,
}));

interface LevelCompleteScreenProps {
  level: number;
  score: number;
  onNext: () => void;
  totalLevels: number;
}

const levelNames = ["Grassland", "Sky World", "Castle"];

export default function LevelCompleteScreen({
  level,
  score,
  onNext,
  totalLevels,
}: LevelCompleteScreenProps) {
  const isLastLevel = level + 1 >= totalLevels;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, #0a1a0a 0%, #0d2210 50%, #051a0a 100%)",
      }}
    >
      {/* Confetti-like particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {CONFETTI.map((c) => (
          <motion.div
            key={c.id}
            className="absolute w-2 h-2 rounded-sm"
            style={{
              left: `${c.left}%`,
              background: c.background,
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: "110vh", opacity: [0, 1, 1, 0] }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: c.repeatDelay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-8 flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 15 }}
        >
          <div className="text-7xl mb-2">⭐</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1
            className="font-display font-black text-4xl md:text-5xl mb-1"
            style={{
              color: "#22dd55",
              fontFamily: '"Mona Sans", sans-serif',
              textShadow: "0 0 30px rgba(34,221,85,0.6)",
            }}
          >
            Level {level + 1} Complete!
          </h1>
          <p className="text-white/60 text-lg font-medium">
            {levelNames[level]} cleared
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="px-10 py-5 rounded-2xl border border-white/10"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div className="text-white/50 text-sm uppercase tracking-widest mb-1">
            Score so far
          </div>
          <div
            className="font-display font-black text-5xl"
            style={{ color: "#ffd700", fontFamily: '"Mona Sans", sans-serif' }}
          >
            {score.toLocaleString()}
          </div>
        </motion.div>

        {!isLastLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/40 text-sm"
          >
            Next:{" "}
            <span className="text-white/70 font-semibold">
              {levelNames[level + 1]}
            </span>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={onNext}
          className="px-14 py-4 rounded-xl font-display font-black text-xl uppercase tracking-wide cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #22dd55 0%, #00aa33 100%)",
            color: "#031a08",
            fontFamily: '"Mona Sans", sans-serif',
            boxShadow: "0 8px 28px rgba(34,221,85,0.35)",
            border: "none",
          }}
        >
          {isLastLevel ? "🏆 See Results" : "▶ Next Level"}
        </motion.button>
      </div>
    </div>
  );
}
