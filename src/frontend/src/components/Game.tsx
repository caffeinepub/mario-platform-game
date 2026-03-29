import { useGame } from "@/hooks/useGame";
import { useEffect } from "react";

interface GameProps {
  level: number;
  score: number;
  onLevelComplete: (level: number, score: number) => void;
  onGameOver: (score: number) => void;
}

export default function Game({
  level,
  score,
  onLevelComplete,
  onGameOver,
}: GameProps) {
  const {
    canvasRef,
    startGame,
    stopGame,
    onLevelComplete: setLevelCompleteHandler,
    onGameOver: setGameOverHandler,
  } = useGame();

  useEffect(() => {
    setLevelCompleteHandler(onLevelComplete);
    setGameOverHandler(onGameOver);
  }, [
    onLevelComplete,
    onGameOver,
    setLevelCompleteHandler,
    setGameOverHandler,
  ]);

  useEffect(() => {
    startGame(level, score);
    return () => {
      stopGame();
    };
  }, [level, score, startGame, stopGame]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-background">
      <div className="relative" style={{ lineHeight: 0 }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          data-ocid="game.canvas_target"
          className="block border-2 border-border"
          style={{ imageRendering: "pixelated" }}
          tabIndex={0}
        />
        {/* Controls hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/40 pointer-events-none select-none whitespace-nowrap">
          ← → to move · ↑ / Space to jump · Land on enemies to stomp
        </div>
      </div>
    </div>
  );
}
