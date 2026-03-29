import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";

// Pre-computed stable star positions to avoid random re-renders + noArrayIndexKey
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: `star-${i}`,
  size: ((i * 7 + 3) % 3) + 1,
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  opacity: ((i * 13 + 5) % 7) / 10 + 0.2,
}));

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const { actor, isFetching } = useActor();

  const { data: scores } = useQuery({
    queryKey: ["topScores"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopScores();
    },
    enabled: !!actor && !isFetching,
  });

  const topScores = scores ?? [];

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start overflow-y-auto"
      style={{
        background:
          "linear-gradient(180deg, #0a0a1a 0%, #0e1530 40%, #1a0a10 100%)",
      }}
    >
      {/* Stars background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {STARS.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6 py-10 flex flex-col items-center gap-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.1] }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl">🍄</span>
            <h1
              className="title-glow font-display text-5xl md:text-6xl font-black tracking-tight"
              style={{
                color: "#ffd700",
                fontFamily: '"Mona Sans", sans-serif',
              }}
            >
              Mario Platform
            </h1>
            <span className="text-5xl">⭐</span>
          </div>
          <p
            className="font-display text-3xl font-bold tracking-widest uppercase"
            style={{ color: "#ff6644", fontFamily: '"Mona Sans", sans-serif' }}
          >
            Game
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full rounded-xl border border-white/10 p-5"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
          }}
        >
          <h2 className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-4 text-center">
            Controls
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { key: "← → / A D", action: "Move left / right" },
              { key: "↑ / W / Space", action: "Jump" },
              { key: "Land on enemy", action: "Stomp (+50 pts)" },
              { key: "Coins 🪙", action: "+10 pts each" },
            ].map(({ key, action }) => (
              <div key={key} className="flex items-center gap-3">
                <span
                  className="px-2 py-1 rounded text-xs font-mono font-bold text-center min-w-[90px]"
                  style={{
                    background: "rgba(255,215,0,0.15)",
                    color: "#ffd700",
                    border: "1px solid rgba(255,215,0,0.3)",
                  }}
                >
                  {key}
                </span>
                <span className="text-white/60 text-xs">{action}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-white/40 text-xs">
            3 levels · Grassland → Sky World → Castle · Reach the green goal
            line to advance
          </div>
        </motion.div>

        {/* Start button */}
        <motion.button
          data-ocid="game.start_button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.4,
            type: "spring",
            stiffness: 200,
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
          className="pulse-ring relative px-16 py-5 rounded-xl font-display text-2xl font-black tracking-wide uppercase cursor-pointer select-none"
          style={{
            background: "linear-gradient(135deg, #ffd700 0%, #ff9900 100%)",
            color: "#1a0a00",
            fontFamily: '"Mona Sans", sans-serif',
            boxShadow:
              "0 8px 32px rgba(255,180,0,0.4), 0 2px 8px rgba(0,0,0,0.6)",
            border: "none",
          }}
        >
          ▶ Start Game
        </motion.button>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full"
        >
          <h2
            className="text-center font-display font-bold text-lg mb-3 uppercase tracking-widest"
            style={{ color: "#ffd700", fontFamily: '"Mona Sans", sans-serif' }}
          >
            🏆 Top Scores
          </h2>

          {topScores.length === 0 ? (
            <div
              className="text-center py-8 rounded-xl border border-white/10 text-white/40"
              data-ocid="leaderboard.empty_state"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              No scores yet — be the first to play!
            </div>
          ) : (
            <div
              className="rounded-xl border border-white/10 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <Table data-ocid="leaderboard.table">
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/50 text-xs uppercase tracking-wider w-12">
                      #
                    </TableHead>
                    <TableHead className="text-white/50 text-xs uppercase tracking-wider">
                      Player
                    </TableHead>
                    <TableHead className="text-white/50 text-xs uppercase tracking-wider text-right">
                      Score
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topScores.slice(0, 10).map((entry, i) => (
                    <TableRow
                      key={`${entry.playerName}-${i}`}
                      data-ocid={
                        `leaderboard.row.${i + 1}` as `leaderboard.row.${number}`
                      }
                      className="border-white/5 hover:bg-white/5"
                    >
                      <TableCell
                        className="font-mono font-bold"
                        style={{
                          color:
                            i === 0
                              ? "#ffd700"
                              : i === 1
                                ? "#c0c0c0"
                                : i === 2
                                  ? "#cd7f32"
                                  : "#ffffff60",
                        }}
                      >
                        {i === 0
                          ? "🥇"
                          : i === 1
                            ? "🥈"
                            : i === 2
                              ? "🥉"
                              : `${i + 1}`}
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        {entry.playerName}
                      </TableCell>
                      <TableCell
                        className="text-right font-mono font-bold"
                        style={{ color: "#ffd700" }}
                      >
                        {Number(entry.score).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <p className="text-white/20 text-xs text-center">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/40 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
