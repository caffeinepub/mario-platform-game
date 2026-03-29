import { Input } from "@/components/ui/input";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";

interface GameOverScreenProps {
  score: number;
  isWin: boolean;
  onPlayAgain: () => void;
}

export default function GameOverScreen({
  score,
  isWin,
  onPlayAgain,
}: GameOverScreenProps) {
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const { mutate: submitScore, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor || !playerName.trim()) return;
      await actor.submitScore(playerName.trim(), BigInt(score));
    },
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["topScores"] });
    },
  });

  const bgGradient = isWin
    ? "linear-gradient(180deg, #0a1a0a 0%, #0d2510 50%, #051a0a 100%)"
    : "linear-gradient(180deg, #1a0505 0%, #250808 50%, #0e0303 100%)";

  const titleColor = isWin ? "#22dd55" : "#ff3333";
  const titleGlow = isWin
    ? "0 0 30px rgba(34,221,85,0.6)"
    : "0 0 30px rgba(255,50,50,0.6)";

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center"
      style={{ background: bgGradient }}
    >
      <div className="relative z-10 text-center px-8 flex flex-col items-center gap-6 max-w-md w-full">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 250, damping: 16 }}
          className="text-7xl"
        >
          {isWin ? "🏆" : "💀"}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h1
            className="font-display font-black text-5xl md:text-6xl"
            style={{
              color: titleColor,
              fontFamily: '"Mona Sans", sans-serif',
              textShadow: titleGlow,
            }}
          >
            {isWin ? "You Win!" : "Game Over!"}
          </h1>
          {isWin && (
            <p className="text-white/60 mt-1">All 3 levels complete!</p>
          )}
        </motion.div>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="px-12 py-5 rounded-2xl border border-white/10 w-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div className="text-white/50 text-sm uppercase tracking-widest mb-1">
            Final Score
          </div>
          <div
            className="font-display font-black text-5xl"
            style={{ color: "#ffd700", fontFamily: '"Mona Sans", sans-serif' }}
          >
            {score.toLocaleString()}
          </div>
        </motion.div>

        {/* Submit score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-full rounded-xl border border-white/10 p-5"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {submitted ? (
            <motion.div
              data-ocid="game.success_state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-3"
            >
              <div className="text-3xl mb-2">✅</div>
              <p className="font-semibold" style={{ color: "#22dd55" }}>
                Score submitted!
              </p>
              <p className="text-white/50 text-sm mt-1">
                Check the leaderboard
              </p>
            </motion.div>
          ) : (
            <>
              <p className="text-white/70 text-sm mb-3 font-medium">
                Submit your score to the leaderboard:
              </p>
              <div className="flex gap-2">
                <Input
                  data-ocid="game.name_input"
                  placeholder="Your name..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    !isPending &&
                    playerName.trim() &&
                    submitScore()
                  }
                  maxLength={20}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/30 flex-1"
                />
                <button
                  type="button"
                  data-ocid="game.submit_button"
                  onClick={() => submitScore()}
                  disabled={isPending || !playerName.trim()}
                  className="px-5 py-2 rounded-lg font-semibold text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  style={{
                    background: isPending
                      ? "rgba(255,215,0,0.3)"
                      : "linear-gradient(135deg, #ffd700, #ff9900)",
                    color: "#1a0a00",
                    border: "none",
                  }}
                >
                  {isPending ? "..." : "Submit"}
                </button>
              </div>
            </>
          )}
        </motion.div>

        {/* Play again */}
        <motion.button
          data-ocid="game.play_again_button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={onPlayAgain}
          className="w-full py-4 rounded-xl font-display font-black text-xl uppercase tracking-wide cursor-pointer"
          style={{
            background: isWin
              ? "linear-gradient(135deg, #ffd700 0%, #ff9900 100%)"
              : "linear-gradient(135deg, #ff4444 0%, #cc1111 100%)",
            color: isWin ? "#1a0a00" : "#fff",
            fontFamily: '"Mona Sans", sans-serif',
            boxShadow: isWin
              ? "0 8px 28px rgba(255,180,0,0.35)"
              : "0 8px 28px rgba(200,0,0,0.35)",
            border: "none",
          }}
        >
          ↺ Play Again
        </motion.button>
      </div>
    </div>
  );
}
