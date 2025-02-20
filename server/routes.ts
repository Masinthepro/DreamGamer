import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertScoreSchema } from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);

  app.post("/api/users", async (req, res) => {
    const result = insertUserSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid user data" });
    }

    const existingUser = await storage.getUserByUsername(result.data.username);
    if (existingUser) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const user = await storage.createUser(result.data);
    res.status(201).json(user);
  });

  // Protected routes - require authentication
  app.post("/api/scores", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const result = insertScoreSchema.safeParse({
      ...req.body,
      userId: req.user!.id,
    });

    if (!result.success) {
      return res.status(400).json({ error: "Invalid score data" });
    }

    const score = await storage.createScore(result.data.userId, result.data.score);
    res.status(201).json(score);
  });

  app.get("/api/scores/top", async (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const scores = await storage.getTopScores(limit);

    // Fetch usernames for the scores
    const scoresWithUsernames = await Promise.all(
      scores.map(async (score) => {
        const user = await storage.getUser(score.userId);
        return {
          ...score,
          username: user?.username || "Unknown Player",
        };
      })
    );

    res.json(scoresWithUsernames);
  });

  app.get("/api/users/:userId/scores", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = Number(req.params.userId);
    if (userId !== req.user!.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const scores = await storage.getUserScores(userId);
    res.json(scores);
  });

  app.get("/api/users/:userId/achievements", async (req, res) => {
    const userId = Number(req.params.userId);
    const achievements = await storage.getUserAchievements(userId);
    res.json(achievements);
  });

  const httpServer = createServer(app);
  return httpServer;
}