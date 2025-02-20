import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { TrophyIcon } from "lucide-react";

interface ScoreWithUsername extends Score {
  username: string;
}

export default function Leaderboard() {
  const { data: scores } = useQuery<ScoreWithUsername[]>({
    queryKey: ["/api/scores/top"],
  });

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <TrophyIcon className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Leaderboard</h1>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scores?.map((score, index) => (
                  <TableRow key={score.id}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>{score.username}</TableCell>
                    <TableCell className="text-right">{score.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}