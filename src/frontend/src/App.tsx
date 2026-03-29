import Game from "@/components/Game";
import GameOverScreen from "@/components/GameOverScreen";
import LevelCompleteScreen from "@/components/LevelCompleteScreen";
import StartScreen from "@/components/StartScreen";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Screen = "start" | "playing" | "level-complete" | "game-over" | "win";

const TOTAL_LEVELS = 3;

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [completedLevel, setCompletedLevel] = useState(0);

  const handleStart = () => {
    setCurrentLevel(0);
    setCurrentScore(0);
    setScreen("playing");
  };

  const handleLevelComplete = (level: number, score: number) => {
    setCompletedLevel(level);
    setCurrentScore(score);
    setCurrentLevel(level);
    if (level + 1 >= TOTAL_LEVELS) {
      setScreen("win");
    } else {
      setScreen("level-complete");
    }
  };

  const handleNextLevel = () => {
    setCurrentLevel((prev) => prev + 1);
    setScreen("playing");
  };

  const handleGameOver = (score: number) => {
    setCurrentScore(score);
    setScreen("game-over");
  };

  const handlePlayAgain = () => {
    setCurrentLevel(0);
    setCurrentScore(0);
    setScreen("start");
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {screen === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StartScreen onStart={handleStart} />
          </motion.div>
        )}

        {screen === "playing" && (
          <motion.div
            key={`playing-level-${currentLevel}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-screen flex items-center justify-center bg-background"
          >
            <Game
              level={currentLevel}
              score={currentScore}
              onLevelComplete={handleLevelComplete}
              onGameOver={handleGameOver}
            />
          </motion.div>
        )}

        {screen === "level-complete" && (
          <motion.div
            key="level-complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LevelCompleteScreen
              level={completedLevel}
              score={currentScore}
              onNext={handleNextLevel}
              totalLevels={TOTAL_LEVELS}
            />
          </motion.div>
        )}

        {screen === "game-over" && (
          <motion.div
            key="game-over"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GameOverScreen
              score={currentScore}
              isWin={false}
              onPlayAgain={handlePlayAgain}
            />
          </motion.div>
        )}

        {screen === "win" && (
          <motion.div
            key="win"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GameOverScreen
              score={currentScore}
              isWin={true}
              onPlayAgain={handlePlayAgain}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
