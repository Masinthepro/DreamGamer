import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameEngine } from "@/lib/game/engine";
import { AudioManager } from "@/lib/game/audio";
import { useToast } from "@/hooks/use-toast";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Initialize game engine
    const engine = new GameEngine(canvas);
    engineRef.current = engine;

    // Start game
    engine.start();

    // Initialize audio
    const audio = AudioManager.getInstance();
    audio.playMusic();

    // Set up keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        engine.movePlayer("left");
      } else if (e.key === "ArrowRight") {
        engine.movePlayer("right");
      } else if (e.key === " ") {
        engine.shoot();
        audio.playSound("shoot");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Game loop to check state
    const gameLoop = setInterval(() => {
      setScore(engine.getScore());
      if (engine.isGameOver() && !gameOver) {
        setGameOver(true);
        audio.playSound("explosion");
        toast({
          title: "Game Over!",
          description: `Final score: ${engine.getScore()}`,
        });
      }
    }, 100);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(gameLoop);
      engine.stop();
      audio.stopMusic();
    };
  }, []);

  const handleRestart = () => {
    if (engineRef.current) {
      engineRef.current.stop();
      engineRef.current.start();
      setGameOver(false);
      setScore(0);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-4 mb-4 flex justify-between items-center">
            <div className="text-xl font-bold">Score: {score}</div>
            {gameOver && (
              <Button onClick={handleRestart}>
                Play Again
              </Button>
            )}
          </Card>

          <div className="relative aspect-video">
            <canvas
              ref={canvasRef}
              className="w-full h-full border border-border rounded-lg"
            />
          </div>

          <Card className="p-4 mt-4">
            <h2 className="text-lg font-semibold mb-2">Controls</h2>
            <div className="text-muted-foreground">
              <p>← → Arrow keys to move</p>
              <p>Spacebar to shoot</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
