import { users, scores, achievements, type User, type InsertUser, type Score, type Achievement } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserHighScore(userId: number, score: number): Promise<void>;
  createScore(userId: number, score: number): Promise<Score>;
  getTopScores(limit: number): Promise<Score[]>;
  getUserScores(userId: number): Promise<Score[]>;
  createAchievement(userId: number, type: string): Promise<Achievement>;
  getUserAchievements(userId: number): Promise<Achievement[]>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private scores: Map<number, Score>;
  private achievements: Map<number, Achievement>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.scores = new Map();
    this.achievements = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, highScore: 0 };
    this.users.set(id, user);
    return user;
  }

  async updateUserHighScore(userId: number, score: number): Promise<void> {
    const user = await this.getUser(userId);
    if (user && score > user.highScore) {
      user.highScore = score;
      this.users.set(userId, user);
    }
  }

  async createScore(userId: number, score: number): Promise<Score> {
    const id = this.currentId++;
    const newScore: Score = {
      id,
      userId,
      score,
      timestamp: new Date(),
    };
    this.scores.set(id, newScore);
    await this.updateUserHighScore(userId, score);
    return newScore;
  }

  async getTopScores(limit: number): Promise<Score[]> {
    return Array.from(this.scores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async getUserScores(userId: number): Promise<Score[]> {
    return Array.from(this.scores.values())
      .filter((score) => score.userId === userId)
      .sort((a, b) => b.score - a.score);
  }

  async createAchievement(userId: number, type: string): Promise<Achievement> {
    const id = this.currentId++;
    const achievement: Achievement = {
      id,
      userId,
      type,
      unlockedAt: new Date(),
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter((achievement) => achievement.userId === userId);
  }
}

export const storage = new MemStorage();