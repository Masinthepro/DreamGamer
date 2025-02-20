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
  const gameOverToastShownRef = useRef(false);
  const keysPressed = useRef<Set<string>>(new Set());
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

    // Focus canvas for keyboard controls
    canvas.focus();

    // Start game
    engine.start();

    // Initialize audio
    const audio = AudioManager.getInstance();
    audio.playMusic();

    // Set up keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default browser behavior for game controls
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
        keysPressed.current.add(e.key);
      }

      if (e.key === " ") {
        engine.shoot();
        audio.playSound("shoot");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        keysPressed.current.delete(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Game loop to check state and handle continuous movement
    const gameLoop = setInterval(() => {
      if (keysPressed.current.has("ArrowLeft")) {
        engine.movePlayer("left");
      }
      if (keysPressed.current.has("ArrowRight")) {
        engine.movePlayer("right");
      }

      setScore(engine.getScore());
      if (engine.isGameOver() && !gameOver) {
        setGameOver(true);
        audio.playSound("explosion");
        if (!gameOverToastShownRef.current) {
          toast({
            title: "Game Over!",
            description: `Final score: ${engine.getScore()}`,
          });
          gameOverToastShownRef.current = true;
        }
      }
    }, 16); // ~60fps

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
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
      gameOverToastShownRef.current = false;
      keysPressed.current.clear();

      // Refocus the canvas
      if (canvasRef.current) {
        canvasRef.current.focus();
      }
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
              tabIndex={0}
            />
          </div>

          <Card className="p-4 mt-4">
            <h2 className="text-lg font-semibold mb-2">Controls</h2>
            <div className="text-muted-foreground">
              <p>← → Arrow keys to move</p>
              <p>Spacebar to shoot</p>
              <p className="text-sm mt-2">Click the game area to enable controls</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}