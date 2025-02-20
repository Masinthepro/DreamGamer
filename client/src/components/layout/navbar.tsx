import { Link } from "wouter";
import { RocketIcon, TrophyIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 z-50">
      <div className="container h-full mx-auto flex items-center justify-between px-4">
        <Link href="/">
          <a className="flex items-center gap-2 text-xl font-bold text-primary">
            <RocketIcon className="w-6 h-6" />
            <span>Space Shooter</span>
          </a>
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/">
            <a className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <HomeIcon className="w-5 h-5" />
              <span>Home</span>
            </a>
          </Link>
          <Link href="/game">
            <a className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <RocketIcon className="w-5 h-5" />
              <span>Play</span>
            </a>
          </Link>
          <Link href="/leaderboard">
            <a className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <TrophyIcon className="w-5 h-5" />
              <span>Leaderboard</span>
            </a>
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                {user.username}
              </span>
              <Button variant="ghost" onClick={() => logout()}>
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button variant="ghost">
                <UserIcon className="w-5 h-5 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}