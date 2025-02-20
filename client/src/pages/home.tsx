import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RocketIcon, KeyboardIcon, TrophyIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            Space Shooter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Defend Earth from alien invasion in this classic arcade-style space shooter game
          </p>
          <Link href="/game">
            <Button size="lg" className="mt-8">
              <RocketIcon className="mr-2 h-5 w-5" />
              Play Now
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6 text-center">
              <KeyboardIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Simple Controls</h3>
              <p className="text-muted-foreground">
                Use arrow keys to move and spacebar to shoot. Master the controls to achieve victory!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6 text-center">
              <TrophyIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Compete</h3>
              <p className="text-muted-foreground">
                Challenge yourself to reach the top of the global leaderboard!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6 text-center">
              <RocketIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Level Up</h3>
              <p className="text-muted-foreground">
                Unlock achievements and improve your skills as you play!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
